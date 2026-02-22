// Main game class: state machine, wires all subsystems together.

import { VIRTUAL_W, VIRTUAL_H } from '../constants';
import { GameState } from '../types';
import { LEVELS } from '../data/levels';
import { CHARACTERS, getCharacter } from '../data/characters';
import { STORY_CARDS } from '../data/storyCards';
import { Audio } from './Audio';
import { Camera } from './Camera';
import { GameLoop } from './GameLoop';
import { Input } from './Input';
import { Level } from './Level';
import { MusicEngine } from './MusicEngine';
import { Player } from './Player';
import { Projectile } from './Projectile';
import { Save } from './Save';
import { UI, LevelInfo } from './UI';
import { sprites } from '../sprites';
import { reRegisterPlayerSprites } from '../sprites/playerSprites';
import { reRegisterPlayerProjectile } from '../sprites/entitySprites';

type OverlayMode = 'none' | 'controls';

export class Game {
  private loop: GameLoop;
  private input: Input;
  private camera: Camera;
  private player: Player;
  private level: Level | null = null;
  private ui: UI;
  private audio: Audio;
  private music: MusicEngine;
  private save: Save;
  private musicInitialized = false;

  private state: GameState = GameState.Title;
  private currentLevelId = 1;
  private overlay: OverlayMode = 'none';
  private frameCount = 0;
  private lastDt = 1 / 60;

  // Total crystals collected across all finished levels
  private sessionCrystals = 0;

  // Max possible crystals across all 20 levels
  private maxCrystals = LEVELS.reduce((s, l) => s + l.crystalTotal, 0);

  // Confirm new game when save exists
  private confirmingNewGame = false;

  // Tracks whether boss music has been triggered for the current level
  private bossMusicallyTriggered = false;

  // Debug overlay
  private debugMode = false;
  private fps = 0;
  private fpsFrames = 0;
  private fpsTimer = 0;
  private crashed = false;
  private crashError = '';

  constructor(
    private ctx: CanvasRenderingContext2D,
    canvas?: HTMLCanvasElement,
  ) {
    this.input = new Input(canvas);
    this.camera = new Camera();
    this.save = new Save();
    this.audio = new Audio();
    this.music = new MusicEngine();
    this.ui = new UI(this.save);
    this.player = new Player(0, 0, this.input);
    this.loop = new GameLoop(
      dt => this.safeUpdate(dt),
      ()  => this.safeRender(),
    );

    // Apply saved character on startup
    this.applyCharacter(this.save.character);

    // Auto-pause when tab hidden
    document.addEventListener('visibilitychange', () => {
      if (document.hidden && this.state === GameState.Play) {
        this.state = GameState.Pause;
        this.ui.resetMenuIndex();
      }
    });
  }

  start(): void {
    this.loop.start();
  }

  /** Initialize music engine on first user interaction (AudioContext requires gesture). */
  private initMusic(): void {
    if (this.musicInitialized) return;
    const ctx = this.audio.getContext();
    if (ctx) {
      this.music.setContext(ctx);
      this.music.setMuted(this.save.muted);
      this.musicInitialized = true;
    }
  }

  /** Apply character palette to sprites and projectile colors. */
  private applyCharacter(charId: string): void {
    const char = getCharacter(charId);
    reRegisterPlayerSprites(sprites, char.palette);
    reRegisterPlayerProjectile(sprites, char.projColor, char.projBright);
    Projectile.playerTrailColor = char.projColor;
    Projectile.playerBrightColor = char.projBright;
  }

  // ============================================================
  // ERROR BOUNDARY
  // ============================================================
  private safeUpdate(dt: number): void {
    if (this.crashed) return;
    try {
      this.update(dt);
    } catch (e: any) {
      this.crashed = true;
      this.crashError = String(e?.message ?? e);
      console.error('Game crash in update:', e);
    }
  }

  private safeRender(): void {
    if (this.crashed) {
      this.renderCrash();
      return;
    }
    try {
      this.render();
    } catch (e: any) {
      this.crashed = true;
      this.crashError = String(e?.message ?? e);
      console.error('Game crash in render:', e);
    }
  }

  private renderCrash(): void {
    const ctx = this.ctx;
    ctx.fillStyle = '#200000';
    ctx.fillRect(0, 0, VIRTUAL_W, VIRTUAL_H);
    ctx.font = 'bold 12px monospace';
    this.drawOutlined(ctx, 'GAME ERROR', 100, 60, '#ff4444');
    ctx.font = '7px monospace';
    this.drawOutlined(ctx, 'Something went wrong.', 80, 80, '#cc8888');
    this.drawOutlined(ctx, this.crashError.slice(0, 40), 40, 95, '#cc8888');
    this.drawOutlined(ctx, 'Refresh the page to restart.', 70, 120, '#888888');
  }

  // ============================================================
  // UPDATE
  // ============================================================
  private update(dt: number): void {
    this.lastDt = dt;
    this.frameCount++;

    // Debug toggle
    if (this.input.justPressed('debug')) this.debugMode = !this.debugMode;

    // FPS counter
    this.fpsFrames++;
    this.fpsTimer += dt;
    if (this.fpsTimer >= 1) {
      this.fps = this.fpsFrames;
      this.fpsFrames = 0;
      this.fpsTimer -= 1;
    }

    switch (this.state) {
      case GameState.Title:           this.updateTitle(); break;
      case GameState.CharacterSelect: this.updateCharacterSelect(); break;
      case GameState.Story:           this.updateStory(); break;
      case GameState.StoryCard:       this.updateStoryCard(); break;
      case GameState.Play:            this.updatePlay(dt); break;
      case GameState.Pause:           this.updatePause(); break;
      case GameState.Transition:      break;
      case GameState.LevelComplete:   this.updateLevelComplete(); break;
      case GameState.GameOver:        this.updateGameOver(); break;
      case GameState.GameComplete:    this.updateGameComplete(); break;
    }

    // Update music engine
    if (this.musicInitialized) {
      this.music.update(dt);
    }

    this.input.update();
  }

  private updateTitle(): void {
    if (this.overlay === 'controls') {
      if (this.input.justPressed('pause') || this.input.justPressed('confirm')) {
        this.overlay = 'none';
      }
      return;
    }

    // Confirm new game dialog
    if (this.confirmingNewGame) {
      if (this.input.justPressed('up'))   { this.ui.menuUp(2); this.audio.play('ui_move'); }
      if (this.input.justPressed('down')) { this.ui.menuDown(2); this.audio.play('ui_move'); }
      if (this.input.justPressed('confirm')) {
        this.audio.play('ui_confirm');
        if (this.ui.getSelectedIndex() === 0) {
          // Confirmed: erase save and go to character select
          this.save.clearAll();
          this.confirmingNewGame = false;
          this.ui.resetMenuIndex();
          this.state = GameState.CharacterSelect;
        } else {
          // Cancel
          this.confirmingNewGame = false;
          this.ui.resetMenuIndex();
        }
      }
      if (this.input.justPressed('pause')) {
        this.confirmingNewGame = false;
        this.ui.resetMenuIndex();
      }
      return;
    }

    if (this.input.justPressed('up'))   { this.ui.menuUp(3); this.audio.play('ui_move'); }
    if (this.input.justPressed('down')) { this.ui.menuDown(3); this.audio.play('ui_move'); }

    if (this.input.justPressed('confirm')) {
      this.audio.play('ui_confirm');
      const sel = this.ui.getSelectedIndex();
      if (sel === 0) {
        // NEW GAME
        if (this.save.hasSave()) {
          // Ask to confirm erase
          this.confirmingNewGame = true;
          this.ui.resetMenuIndex();
        } else {
          this.ui.resetMenuIndex();
          this.state = GameState.CharacterSelect;
        }
      } else if (sel === 1 && this.save.hasSave()) {
        // CONTINUE — load saved character and level
        this.initMusic();
        this.sessionCrystals = 0;
        this.applyCharacter(this.save.character);
        this.currentLevelId = this.save.highestUnlockedLevel;
        this.loadLevel(this.currentLevelId);
        this.music.play('exploration');
        this.state = GameState.Play;
      } else if (sel === 2) {
        // CONTROLS
        this.overlay = 'controls';
      }
    }
  }

  private updateCharacterSelect(): void {
    if (this.input.justPressed('left'))  { this.ui.menuUp(CHARACTERS.length); this.audio.play('ui_move'); }
    if (this.input.justPressed('right')) { this.ui.menuDown(CHARACTERS.length); this.audio.play('ui_move'); }

    if (this.input.justPressed('confirm')) {
      this.audio.play('ui_confirm');
      this.initMusic();
      const char = CHARACTERS[this.ui.getSelectedIndex()]!;
      this.save.setCharacter(char.id);
      this.applyCharacter(char.id);
      this.sessionCrystals = 0;
      this.ui.resetStoryScroll();
      this.loadLevel(1);
      this.state = GameState.Story;
    }

    if (this.input.justPressed('pause')) {
      this.ui.resetMenuIndex();
      this.state = GameState.Title;
    }
  }

  private updateStory(): void {
    if (this.input.justPressed('confirm') || this.ui.isStoryComplete()) {
      this.state = GameState.Play;
      this.music.play('exploration');
    }
  }

  private updateStoryCard(): void {
    if (this.input.justPressed('confirm')) {
      this.currentLevelId++;
      if (this.currentLevelId > 20) return;
      this.loadLevel(this.currentLevelId);
      this.state = GameState.Play;
      this.music.play('exploration');
    }
  }

  private updatePlay(dt: number): void {
    if (this.input.justPressed('pause')) {
      this.state = GameState.Pause;
      this.ui.resetMenuIndex();
      return;
    }

    this.level?.update(dt);

    if (this.player.isDead()) {
      this.audio.play('game_over');
      this.music.stop();
      this.state = GameState.GameOver;
      this.ui.resetMenuIndex();
      return;
    }

    // Check boss encounter for music switch (trigger once per level)
    if (this.level?.bossEncountered && !this.bossMusicallyTriggered) {
      this.bossMusicallyTriggered = true;
      this.music.play('boss');
    }

    if (this.level?.levelComplete) {
      this.sessionCrystals += this.level.crystalsCollected;
      this.save.unlockLevel(this.currentLevelId + 1);
      this.save.saveHighScore(this.currentLevelId, this.level.crystalsCollected);
      this.audio.play('level_complete');
      this.music.play('victory');
      this.state = GameState.LevelComplete;
    }
  }

  private updatePause(): void {
    if (this.overlay === 'controls') {
      if (this.input.justPressed('pause') || this.input.justPressed('confirm')) {
        this.overlay = 'none';
      }
      return;
    }
    if (this.input.justPressed('up'))   { this.ui.menuUp(5); this.audio.play('ui_move'); }
    if (this.input.justPressed('down')) { this.ui.menuDown(5); this.audio.play('ui_move'); }

    if (this.input.justPressed('confirm') || this.input.justPressed('pause')) {
      this.audio.play('ui_confirm');
      switch (this.ui.getSelectedIndex()) {
        case 0: // RESUME
          this.state = GameState.Play;
          break;
        case 1: // RESTART LEVEL
          this.loadLevel(this.currentLevelId);
          this.music.play('exploration');
          this.state = GameState.Play;
          break;
        case 2: // TITLE SCREEN
          this.music.stop();
          this.state = GameState.Title;
          this.ui.resetMenuIndex();
          break;
        case 3: // CONTROLS
          this.overlay = 'controls';
          break;
        case 4: // MUTE
          this.audio.muted = this.save.toggleMute();
          this.music.setMuted(this.audio.muted);
          break;
      }
    }
  }

  private updateLevelComplete(): void {
    if (this.input.justPressed('confirm')) {
      if (this.currentLevelId >= 20) {
        this.ui.resetCreditsScroll();
        this.state = GameState.GameComplete;
      } else {
        // Show story card before next level
        this.state = GameState.StoryCard;
      }
    }
  }

  private updateGameOver(): void {
    if (this.input.justPressed('up'))   { this.ui.menuUp(2); this.audio.play('ui_move'); }
    if (this.input.justPressed('down')) { this.ui.menuDown(2); this.audio.play('ui_move'); }

    if (this.input.justPressed('confirm')) {
      this.audio.play('ui_confirm');
      if (this.ui.getSelectedIndex() === 0) {
        this.loadLevel(this.currentLevelId);
        this.music.play('exploration');
        this.state = GameState.Play;
      } else {
        this.music.stop();
        this.state = GameState.Title;
        this.ui.resetMenuIndex();
      }
    }
  }

  private updateGameComplete(): void {
    if (this.input.justPressed('confirm')) {
      this.music.stop();
      this.state = GameState.Title;
      this.ui.resetMenuIndex();
    }
  }

  private loadLevel(id: number): void {
    const def = LEVELS.find(l => l.id === id);
    if (!def) { console.error(`Level ${id} not found`); return; }

    this.currentLevelId = id;
    this.bossMusicallyTriggered = false;
    this.audio.muted = this.save.muted;
    this.level = new Level(def, this.camera, this.player, this.audio);
    this.level.load();
  }

  // ============================================================
  // RENDER
  // ============================================================
  private render(): void {
    this.ctx.fillStyle = '#05050f';
    this.ctx.fillRect(0, 0, VIRTUAL_W, VIRTUAL_H);

    switch (this.state) {
      case GameState.Title:
        this.ui.renderTitle(this.ctx, this.frameCount);
        if (this.confirmingNewGame) {
          this.ui.renderConfirmNewGame(this.ctx);
        }
        if (this.overlay === 'controls') this.ui.renderControls(this.ctx);
        break;

      case GameState.CharacterSelect:
        this.ui.renderCharacterSelect(this.ctx, CHARACTERS, this.frameCount);
        break;

      case GameState.Story:
        this.ctx.fillStyle = '#05050f';
        this.ctx.fillRect(0, 0, VIRTUAL_W, VIRTUAL_H);
        this.ui.renderStory(this.ctx, this.lastDt);
        break;

      case GameState.StoryCard:
        this.ui.renderStoryCard(
          this.ctx,
          this.currentLevelId,
          STORY_CARDS[this.currentLevelId] ?? '',
          this.frameCount,
        );
        break;

      case GameState.Play:
      case GameState.Transition:
        this.level?.render(this.ctx);
        if (this.level) {
          this.ui.renderHUD(this.ctx, this.player, this.levelInfo());
        }
        break;

      case GameState.Pause:
        this.level?.render(this.ctx);
        if (this.level) this.ui.renderHUD(this.ctx, this.player, this.levelInfo());
        this.ui.renderPause(this.ctx, this.audio.muted);
        if (this.overlay === 'controls') this.ui.renderControls(this.ctx);
        break;

      case GameState.LevelComplete:
        this.level?.render(this.ctx);
        if (this.level) {
          this.ui.renderHUD(this.ctx, this.player, this.levelInfo());
          this.ui.renderLevelComplete(this.ctx, this.levelInfo(), this.frameCount);
        }
        break;

      case GameState.GameOver:
        this.ui.renderGameOver(this.ctx, this.frameCount);
        break;

      case GameState.GameComplete: {
        const charName = getCharacter(this.save.character).name;
        this.ui.renderGameComplete(this.ctx, this.lastDt, this.sessionCrystals, this.maxCrystals, charName);
        break;
      }
    }

    // Touch controls overlay
    if (this.input.showTouchControls &&
        (this.state === GameState.Play || this.state === GameState.Pause || this.state === GameState.Title)) {
      this.renderTouchControls();
    }

    // Debug overlay (backtick toggle)
    if (this.debugMode) {
      this.renderDebugOverlay();
    }
  }

  private renderTouchControls(): void {
    const ctx = this.ctx;
    ctx.save();
    ctx.globalAlpha = 0.3;

    // D-pad background circle
    ctx.fillStyle = '#222244';
    ctx.beginPath();
    ctx.arc(40, 200, 34, 0, Math.PI * 2);
    ctx.fill();

    // D-pad arrows
    ctx.fillStyle = '#aaaacc';
    this.drawTriangle(ctx, 40, 172, 8, 'up');
    this.drawTriangle(ctx, 40, 228, 8, 'down');
    this.drawTriangle(ctx, 12, 200, 8, 'left');
    this.drawTriangle(ctx, 68, 200, 8, 'right');

    // Action buttons
    const buttons = [
      { x: 272, y: 212, r: 12, label: 'Z', color: '#4488ff' },
      { x: 300, y: 190, r: 12, label: 'X', color: '#ff4466' },
      { x: 272, y: 178, r: 12, label: 'P', color: '#aa44ff' },
      { x: 301, y: 159, r: 8,  label: '||', color: '#888888' },
    ];
    for (const btn of buttons) {
      ctx.fillStyle = btn.color;
      ctx.beginPath();
      ctx.arc(btn.x, btn.y, btn.r, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#ffffff';
      ctx.font = btn.r > 8 ? '7px monospace' : '5px monospace';
      const tw = ctx.measureText(btn.label).width;
      ctx.fillText(btn.label, btn.x - tw / 2, btn.y + (btn.r > 8 ? 3 : 2));
    }

    ctx.restore();
  }

  private drawTriangle(ctx: CanvasRenderingContext2D, cx: number, cy: number, size: number, dir: string): void {
    ctx.beginPath();
    switch (dir) {
      case 'up':    ctx.moveTo(cx, cy - size); ctx.lineTo(cx - size, cy + size); ctx.lineTo(cx + size, cy + size); break;
      case 'down':  ctx.moveTo(cx, cy + size); ctx.lineTo(cx - size, cy - size); ctx.lineTo(cx + size, cy - size); break;
      case 'left':  ctx.moveTo(cx - size, cy); ctx.lineTo(cx + size, cy - size); ctx.lineTo(cx + size, cy + size); break;
      case 'right': ctx.moveTo(cx + size, cy); ctx.lineTo(cx - size, cy - size); ctx.lineTo(cx - size, cy + size); break;
    }
    ctx.closePath();
    ctx.fill();
  }

  private renderDebugOverlay(): void {
    const ctx = this.ctx;
    ctx.fillStyle = 'rgba(0,0,0,0.7)';
    ctx.fillRect(0, VIRTUAL_H - 44, 160, 44);
    ctx.font = '7px monospace';
    this.drawOutlined(ctx, `FPS:${this.fps} State:${this.state}`, 2, VIRTUAL_H - 35, '#44ff44');
    this.drawOutlined(ctx, `Lvl:${this.currentLevelId} Scr:${this.camera.screenCol},${this.camera.screenRow}`, 2, VIRTUAL_H - 26, '#44ff44');
    this.drawOutlined(ctx, `Pos:${Math.round(this.player.x)},${Math.round(this.player.y)}`, 2, VIRTUAL_H - 17, '#44ff44');
    this.drawOutlined(ctx, `HP:${this.player.hp} E:${Math.round(this.player.energy)} J:${this.player.isJumping?1:0}`, 2, VIRTUAL_H - 8, '#44ff44');
  }

  private drawOutlined(ctx: CanvasRenderingContext2D, text: string, x: number, y: number, fill: string): void {
    ctx.fillStyle = '#000000';
    ctx.fillText(text, x - 1, y);
    ctx.fillText(text, x + 1, y);
    ctx.fillText(text, x, y - 1);
    ctx.fillText(text, x, y + 1);
    ctx.fillStyle = fill;
    ctx.fillText(text, x, y);
  }

  private levelInfo(): LevelInfo {
    return {
      id: this.level?.id ?? this.currentLevelId,
      name: this.level?.name ?? '',
      crystalsCollected: this.level?.crystalsCollected ?? 0,
      crystalTotal: this.level?.crystalTotal ?? 0,
      hasKey: this.level?.hasKey ?? false,
      switchActivated: this.level?.switchActivated ?? false,
      gatingType: this.level?.gatingType ?? '',
    };
  }
}
