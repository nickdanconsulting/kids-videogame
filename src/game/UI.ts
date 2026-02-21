// All screen rendering: HUD, title, story, menus, overlays.
// Everything drawn directly to the canvas.

import {
  VIRTUAL_W, VIRTUAL_H, HUD_H,
  COLOR_WHITE, COLOR_YELLOW, COLOR_CYAN, COLOR_RED,
  PLAYER_MAX_HP, PLAYER_MAX_ENERGY,
  FONT_LARGE, FONT_MED, FONT_SMALL,
} from '../constants';
import { CharacterDef } from '../data/characters';
import { drawGlow } from './Effects';
import { Save } from './Save';
import { Player } from './Player';
import { sprites } from '../sprites';

// Level info needed by HUD / level-complete screen
export interface LevelInfo {
  id: number;
  name: string;
  crystalsCollected: number;
  crystalTotal: number;
  hasKey: boolean;
  switchActivated: boolean;
  gatingType: string;
}

export class UI {
  private selectedIndex = 0;

  // Story scroll
  private storyY = VIRTUAL_H;

  // Credits scroll
  private creditsY = VIRTUAL_H;

  // Smooth HUD bar interpolation
  private displayEnergy = PLAYER_MAX_ENERGY;

  // Star field (deterministic positions)
  private stars: Array<{ x: number; y: number; speed: number; brightness: string; size: number }>;

  constructor(private save: Save) {
    this.stars = Array.from({ length: 40 }, (_, i) => ({
      x: ((i * 73 + 11) % VIRTUAL_W),
      y: ((i * 137 + 7) % VIRTUAL_H),
      speed: 0.1 + (i % 3) * 0.1,
      brightness: i % 3 === 0 ? '#ffffff' : i % 3 === 1 ? '#aaaacc' : '#555577',
      size: i % 5 === 0 ? 2 : 1,
    }));
  }

  // ============================================================
  // Title Screen
  // ============================================================
  renderTitle(ctx: CanvasRenderingContext2D, frameCount: number): void {
    ctx.fillStyle = '#05050f';
    ctx.fillRect(0, 0, VIRTUAL_W, VIRTUAL_H);
    this.renderStarField(ctx, frameCount);

    // Title banner sprite (floating bob)
    const bannerBob = Math.sin(frameCount * 0.02) * 2;
    const abelSize = sprites.size('title_abel');
    if (abelSize.w > 0) {
      sprites.draw(ctx, 'title_abel', (VIRTUAL_W - abelSize.w) / 2, 36 + bannerBob);
    }

    // "AND THE" text
    ctx.font = FONT_SMALL;
    this.centeredOutlinedText(ctx, 'AND THE', VIRTUAL_W / 2, 52, COLOR_CYAN);

    ctx.font = 'bold 14px monospace';
    this.centeredOutlinedText(ctx, 'TIME CRYSTAL', VIRTUAL_W / 2, 66, COLOR_YELLOW);

    // Subtitle pulse
    const pulse = 0.6 + Math.sin(frameCount * 0.05) * 0.4;
    ctx.globalAlpha = pulse;
    ctx.font = FONT_SMALL;
    this.centeredOutlinedText(ctx, '~ A space adventure ~', VIRTUAL_W / 2, 78, '#8888aa');
    ctx.globalAlpha = 1;

    // Player character sprite on title screen
    sprites.draw(ctx, 'player_down_0', VIRTUAL_W / 2 - 7, 84);

    // Menu items with 9-patch border
    const hasSave = this.save.hasSave();
    const items = ['NEW GAME', 'CONTINUE', 'CONTROLS'];

    const menuX = VIRTUAL_W / 2 - 55;
    const menuY = 104;
    const menuW = 110;
    const menuH = 52;
    this.draw9Patch(ctx, menuX, menuY, menuW, menuH);

    items.forEach((item, i) => {
      const sel = i === this.selectedIndex;
      const dimmed = item === 'CONTINUE' && !hasSave;
      const fill = dimmed ? '#333355' : sel ? COLOR_YELLOW : '#8888aa';
      ctx.font = FONT_MED;
      const textX = menuX + 20;
      const textY = menuY + 14 + i * 16;

      if (sel && !dimmed) {
        drawGlow(ctx, menuX + menuW / 2, textY - 2, 40, '#ffdd44', 0.06);
        sprites.draw(ctx, 'menu_arrow', menuX + 10, textY - 6);
      }
      this.outlinedText(ctx, item, textX, textY, fill);
    });

    // Controls hint
    ctx.font = FONT_SMALL;
    this.centeredOutlinedText(ctx, 'ARROW KEYS: move   ENTER: select', VIRTUAL_W / 2, 168, '#444466');
    this.centeredOutlinedText(ctx, 'Z: jump   X: blast   SPACE: pulse', VIRTUAL_W / 2, 177, '#444466');

    if (hasSave) {
      ctx.font = FONT_SMALL;
      this.centeredOutlinedText(ctx, `Save: Deck ${this.save.highestUnlockedLevel}`, VIRTUAL_W / 2, 191, '#335533');
    }

    ctx.font = FONT_SMALL;
    this.centeredOutlinedText(ctx, 'v1.1', VIRTUAL_W / 2, VIRTUAL_H - 5, '#333344');
  }

  // ============================================================
  // Story Screen
  // ============================================================
  renderStory(ctx: CanvasRenderingContext2D, dt: number): void {
    ctx.fillStyle = '#05050f';
    ctx.fillRect(0, 0, VIRTUAL_W, VIRTUAL_H);

    this.storyY -= 28 * dt;

    const lines = [
      '- YEAR 2387 -',
      '',
      'The spaceship CHRONOS',
      'drifts through deep space...',
      '',
      'A young crew member',
      'discovers a pulsing crystal',
      'hidden in the reactor core.',
      '',
      'The crystal shatters,',
      'tearing open rifts in time.',
      '',
      'Ancient guardians pour',
      'through every deck of the ship.',
      '',
      'Armed with a blast cannon',
      'and the power of TIME PULSE,',
      'Abel must fight through',
      '20 decks of chaos...',
      '',
      'and seal the Time Crystal',
      'before the CHRONOS is lost',
      'to eternity.',
      '',
      '',
      '- Press ENTER to begin -',
    ];

    ctx.font = FONT_SMALL;
    lines.forEach((line, i) => {
      const y = this.storyY + i * 11;
      if (y < -12 || y > VIRTUAL_H + 12) return;
      const fill = line.startsWith('-') ? COLOR_CYAN : COLOR_WHITE;
      this.centeredOutlinedText(ctx, line, VIRTUAL_W / 2, y, fill);
    });

    // Edge fades
    const fadeH = 20;
    const topG = ctx.createLinearGradient(0, 0, 0, fadeH);
    topG.addColorStop(0, '#05050f'); topG.addColorStop(1, 'transparent');
    ctx.fillStyle = topG; ctx.fillRect(0, 0, VIRTUAL_W, fadeH);

    const botG = ctx.createLinearGradient(0, VIRTUAL_H - fadeH, 0, VIRTUAL_H);
    botG.addColorStop(0, 'transparent'); botG.addColorStop(1, '#05050f');
    ctx.fillStyle = botG; ctx.fillRect(0, VIRTUAL_H - fadeH, VIRTUAL_W, fadeH);
  }

  isStoryComplete(): boolean {
    return this.storyY < -(25 * 11);
  }

  resetStoryScroll(): void {
    this.storyY = VIRTUAL_H;
  }

  // ============================================================
  // HUD (drawn at top of screen during gameplay)
  // ============================================================
  renderHUD(ctx: CanvasRenderingContext2D, player: Player, level: LevelInfo): void {
    // Background strip using tiled HUD bg sprite
    for (let x = 0; x < VIRTUAL_W; x += 16) {
      sprites.draw(ctx, 'hud_bg', x, 0);
    }

    // HUD separator glow line
    ctx.fillStyle = '#2a2a5a';
    ctx.fillRect(0, HUD_H - 1, VIRTUAL_W, 1);
    ctx.globalAlpha = 0.3;
    ctx.fillStyle = '#4488cc';
    ctx.fillRect(0, HUD_H, VIRTUAL_W, 1);
    ctx.globalAlpha = 1;

    // Hearts using pixel art sprites
    for (let i = 0; i < PLAYER_MAX_HP; i++) {
      const filled = i < player.hp;
      // Low-HP pulse on last filled heart
      if (filled && player.hp <= 2 && i === player.hp - 1) {
        const pulseScale = 1 + Math.sin(Date.now() * 0.008) * 0.15;
        const hx = 4 + i * 10;
        const hy = 3;
        ctx.save();
        ctx.translate(hx + 4, hy + 5);
        ctx.scale(pulseScale, pulseScale);
        sprites.draw(ctx, 'heart_full', -4, -5);
        ctx.restore();
      } else {
        sprites.draw(ctx, filled ? 'heart_full' : 'heart_empty', 4 + i * 10, 3);
      }
    }

    // Energy bar (smooth interpolation)
    this.displayEnergy += (player.energy - this.displayEnergy) * 0.15;
    const barX = 72;
    const barW = 50;
    const barH = 4;
    sprites.draw(ctx, 'energy_cap_l', barX - 3, 2);
    ctx.fillStyle = '#220044';
    ctx.fillRect(barX, 4, barW, barH);
    const filled = Math.round((this.displayEnergy / PLAYER_MAX_ENERGY) * barW);
    ctx.fillStyle = '#aa44ff';
    ctx.fillRect(barX, 4, filled, barH);
    ctx.fillStyle = '#cc88ff';
    ctx.fillRect(barX, 4, Math.min(filled, 2), barH);
    sprites.draw(ctx, 'energy_cap_r', barX + barW, 2);

    // Energy bar glow
    if (filled > 5) {
      drawGlow(ctx, barX + filled / 2, 6, filled / 2 + 4, '#aa44ff', 0.08);
    }

    // Crystal icon glow + icon + count
    drawGlow(ctx, 129, 6, 6, '#44eeff', 0.1);
    sprites.draw(ctx, 'hud_crystal', 126, 3);
    ctx.font = FONT_SMALL;
    this.outlinedText(ctx, `${level.crystalsCollected}/${level.crystalTotal}`, 135, 10, COLOR_CYAN);

    // Key indicator
    if (level.hasKey) {
      sprites.draw(ctx, 'hud_key', 165, 4);
      ctx.font = FONT_SMALL;
      this.outlinedText(ctx, 'KEY', 174, 10, COLOR_YELLOW);
    }

    // Level
    ctx.font = FONT_SMALL;
    this.outlinedText(ctx, `DECK ${level.id}`, VIRTUAL_W - 34, 10, '#8888aa');
  }

  // ============================================================
  // Pause Menu
  // ============================================================
  renderPause(ctx: CanvasRenderingContext2D, isMuted: boolean): void {
    ctx.fillStyle = 'rgba(0,0,10,0.78)';
    ctx.fillRect(0, 0, VIRTUAL_W, VIRTUAL_H);

    const pw = 130;
    const ph = 100;
    const px = (VIRTUAL_W - pw) / 2;
    const py = (VIRTUAL_H - ph) / 2;

    this.draw9Patch(ctx, px, py, pw, ph);

    ctx.font = FONT_MED;
    this.centeredOutlinedText(ctx, 'PAUSED', VIRTUAL_W / 2, py + 13, COLOR_YELLOW);

    const items = ['RESUME', 'RESTART LEVEL', 'TITLE SCREEN', 'CONTROLS', isMuted ? 'UNMUTE' : 'MUTE'];
    items.forEach((item, i) => {
      const sel = i === this.selectedIndex;
      const fill = sel ? COLOR_YELLOW : '#8888aa';
      ctx.font = FONT_SMALL;
      if (sel) {
        sprites.draw(ctx, 'menu_arrow', px + 6, py + 20 + i * 13);
      }
      this.outlinedText(ctx, item, px + 16, py + 26 + i * 13, fill);
    });
  }

  // ============================================================
  // Level Complete
  // ============================================================
  renderLevelComplete(
    ctx: CanvasRenderingContext2D,
    level: LevelInfo,
    frameCount: number,
  ): void {
    ctx.fillStyle = 'rgba(0,0,10,0.85)';
    ctx.fillRect(0, 0, VIRTUAL_W, VIRTUAL_H);

    // 9-patch panel
    this.draw9Patch(ctx, (VIRTUAL_W - 160) / 2, 48, 160, 95);

    ctx.font = 'bold 11px monospace';
    this.centeredOutlinedText(ctx, 'DECK CLEARED!', VIRTUAL_W / 2, 64, COLOR_YELLOW);

    ctx.font = FONT_MED;
    this.centeredOutlinedText(ctx, level.name.toUpperCase(), VIRTUAL_W / 2, 80, COLOR_WHITE);

    ctx.font = FONT_SMALL;
    this.centeredOutlinedText(ctx, `CRYSTALS: ${level.crystalsCollected} / ${level.crystalTotal}`, VIRTUAL_W / 2, 97, COLOR_CYAN);

    // Star rating with pulse on earned stars
    const pct = level.crystalTotal > 0 ? level.crystalsCollected / level.crystalTotal : 0;
    const starCount = pct >= 1 ? 3 : pct >= 0.67 ? 2 : pct >= 0.33 ? 1 : 0;
    for (let i = 0; i < 3; i++) {
      const earned = i < starCount;
      ctx.fillStyle = earned ? COLOR_YELLOW : '#333355';
      const sx = VIRTUAL_W / 2 - 16 + i * 16;
      const sy = 111;
      if (earned) {
        const starPulse = 1 + Math.sin(frameCount * 0.08 - i * 0.3) * 0.12;
        ctx.save();
        ctx.translate(sx, sy);
        ctx.scale(starPulse, starPulse);
        this.drawStar(ctx, 0, 0, 5);
        ctx.restore();
      } else {
        this.drawStar(ctx, sx, sy, 5);
      }
    }

    const pulsed = 0.5 + Math.sin(frameCount * 0.1) * 0.5;
    ctx.globalAlpha = pulsed;
    ctx.font = FONT_SMALL;
    this.centeredOutlinedText(ctx, 'PRESS ENTER TO CONTINUE', VIRTUAL_W / 2, 134, COLOR_WHITE);
    ctx.globalAlpha = 1;
  }

  // ============================================================
  // Game Over
  // ============================================================
  renderGameOver(ctx: CanvasRenderingContext2D, frameCount: number): void {
    ctx.fillStyle = '#09000f';
    ctx.fillRect(0, 0, VIRTUAL_W, VIRTUAL_H);
    this.renderStarField(ctx, frameCount);

    // Game over banner glow
    const pulseAlpha = 0.05 + Math.sin(frameCount * 0.03) * 0.03;
    drawGlow(ctx, VIRTUAL_W / 2, 64, 60, '#ff2222', pulseAlpha);

    // Game over banner sprite
    const bannerSize = sprites.size('game_over_banner');
    if (bannerSize.w > 0) {
      sprites.draw(ctx, 'game_over_banner', (VIRTUAL_W - bannerSize.w) / 2, 60);
    } else {
      ctx.font = 'bold 14px monospace';
      this.centeredOutlinedText(ctx, 'GAME OVER', VIRTUAL_W / 2, 72, COLOR_RED);
    }

    ctx.font = FONT_SMALL;
    this.centeredOutlinedText(ctx, 'The crystal remains unsealed...', VIRTUAL_W / 2, 82, '#886688');

    // Menu with 9-patch
    const menuW = 120;
    const menuH = 38;
    const menuX = (VIRTUAL_W - menuW) / 2;
    const menuY = 96;
    this.draw9Patch(ctx, menuX, menuY, menuW, menuH);

    const items = ['RETRY LEVEL', 'TITLE SCREEN'];
    items.forEach((item, i) => {
      const sel = i === this.selectedIndex;
      const fill = sel ? COLOR_YELLOW : '#8888aa';
      ctx.font = FONT_MED;
      if (sel) {
        sprites.draw(ctx, 'menu_arrow', menuX + 8, menuY + 8 + i * 16);
      }
      this.outlinedText(ctx, item, menuX + 18, menuY + 14 + i * 16, fill);
    });
  }

  // ============================================================
  // Game Complete / Credits
  // ============================================================
  renderGameComplete(
    ctx: CanvasRenderingContext2D,
    dt: number,
    totalCrystals: number,
    maxCrystals: number,
    characterName = 'Abel',
  ): void {
    ctx.fillStyle = '#05050f';
    ctx.fillRect(0, 0, VIRTUAL_W, VIRTUAL_H);
    this.renderStarField(ctx, Math.floor(Date.now() / 16));

    this.creditsY -= 22 * dt;

    const lines = [
      '*** CONGRATULATIONS ***',
      '',
      `${characterName} has sealed the Time Crystal`,
      'and rescued the Princess Royal',
      'from the time rift.',
      '',
      'The CHRONOS is saved.',
      'Time flows freely once more.',
      '',
      `Crystals: ${totalCrystals} / ${maxCrystals}`,
      '',
      '',
      '- CREDITS -',
      '',
      'Design & Code:',
      'NDC',
      '',
      'Built with',
      'Vite + TypeScript',
      '+ HTML5 Canvas',
      '',
      '',
      'For all the young',
      'explorers out there.',
      '',
      '',
      'Press ENTER to play again',
    ];

    ctx.font = FONT_SMALL;
    lines.forEach((line, i) => {
      const y = this.creditsY + i * 13;
      if (y < -13 || y > VIRTUAL_H + 13) return;
      const fill = line.startsWith('***') || line.startsWith('-') ? COLOR_YELLOW : COLOR_WHITE;
      this.centeredOutlinedText(ctx, line, VIRTUAL_W / 2, y, fill);
    });
  }

  resetCreditsScroll(): void {
    this.creditsY = VIRTUAL_H;
  }

  // ============================================================
  // Controls overlay
  // ============================================================
  renderControls(ctx: CanvasRenderingContext2D): void {
    ctx.fillStyle = 'rgba(0,0,10,0.92)';
    ctx.fillRect(0, 0, VIRTUAL_W, VIRTUAL_H);

    // 9-patch panel
    this.draw9Patch(ctx, 30, 10, VIRTUAL_W - 60, 160);

    ctx.font = FONT_MED;
    this.centeredOutlinedText(ctx, 'CONTROLS', VIRTUAL_W / 2, 26, COLOR_CYAN);

    const rows: [string, string][] = [
      ['MOVE',       'Arrow Keys / WASD'],
      ['JUMP',       'Z'],
      ['BLAST',      'X'],
      ['TIME PULSE', 'Space'],
      ['PAUSE',      'Escape'],
    ];

    rows.forEach(([action, key], i) => {
      ctx.font = FONT_SMALL;
      this.outlinedText(ctx, action, 50, 42 + i * 13, COLOR_YELLOW);
      this.outlinedText(ctx, key, 140, 42 + i * 13, COLOR_WHITE);
    });

    ctx.font = FONT_SMALL;
    this.centeredOutlinedText(ctx, '--- TIPS ---', VIRTUAL_W / 2, 119, '#556688');
    const tips = [
      'Collect crystals for energy.',
      'Jump over holes (Z).',
      'Space triggers a radial Time Pulse.',
    ];
    tips.forEach((t, i) => this.centeredOutlinedText(ctx, t, VIRTUAL_W / 2, 131 + i * 11, '#8888aa'));

    ctx.font = FONT_SMALL;
    this.centeredOutlinedText(ctx, 'Press ESC or ENTER to close', VIRTUAL_W / 2, VIRTUAL_H - 6, '#444466');
  }

  // ============================================================
  // Character Select
  // ============================================================
  renderCharacterSelect(
    ctx: CanvasRenderingContext2D,
    characters: CharacterDef[],
    frameCount: number,
  ): void {
    ctx.fillStyle = '#05050f';
    ctx.fillRect(0, 0, VIRTUAL_W, VIRTUAL_H);
    this.renderStarField(ctx, frameCount);

    ctx.font = FONT_MED;
    this.centeredOutlinedText(ctx, 'CHOOSE YOUR PILOT', VIRTUAL_W / 2, 24, COLOR_CYAN);

    const cardW = 80;
    const gap = 10;
    const totalW = cardW * characters.length + gap * (characters.length - 1);
    const startX = (VIRTUAL_W - totalW) / 2;

    characters.forEach((char, i) => {
      const cx = startX + i * (cardW + gap);
      const sel = i === this.selectedIndex;

      // Card background
      this.draw9Patch(ctx, cx, 36, cardW, 110);

      if (sel) {
        drawGlow(ctx, cx + cardW / 2, 90, 30, char.projColor, 0.08);
      }

      // Character sprite (preview with unique palette)
      const spriteName = `preview_${char.id}`;
      const spriteX = cx + cardW / 2 - 7;
      const bob = sel ? Math.sin(frameCount * 0.06) * 2 : 0;
      sprites.draw(ctx, spriteName, spriteX, 48 + bob);

      // Name
      ctx.font = FONT_MED;
      const nameColor = sel ? COLOR_YELLOW : '#8888aa';
      this.centeredOutlinedText(ctx, char.name, cx + cardW / 2, 76, nameColor);

      // Description
      ctx.font = FONT_SMALL;
      this.centeredOutlinedText(ctx, char.description, cx + cardW / 2, 90, '#666688');

      // Color swatch
      ctx.fillStyle = char.projColor;
      ctx.fillRect(cx + cardW / 2 - 8, 98, 16, 3);

      // Selection indicator
      if (sel) {
        sprites.draw(ctx, 'menu_arrow', cx + 4, 70);
      }
    });

    // Hint
    const pulse = 0.5 + Math.sin(frameCount * 0.08) * 0.5;
    ctx.globalAlpha = pulse;
    ctx.font = FONT_SMALL;
    this.centeredOutlinedText(ctx, 'PRESS ENTER TO SELECT', VIRTUAL_W / 2, 162, COLOR_WHITE);
    ctx.globalAlpha = 1;

    ctx.font = FONT_SMALL;
    this.centeredOutlinedText(ctx, 'LEFT / RIGHT to browse', VIRTUAL_W / 2, 174, '#444466');
  }

  // ============================================================
  // Confirm New Game (erase save)
  // ============================================================
  renderConfirmNewGame(ctx: CanvasRenderingContext2D): void {
    ctx.fillStyle = 'rgba(0,0,10,0.85)';
    ctx.fillRect(0, 0, VIRTUAL_W, VIRTUAL_H);

    this.draw9Patch(ctx, (VIRTUAL_W - 180) / 2, 70, 180, 70);

    ctx.font = FONT_MED;
    this.centeredOutlinedText(ctx, 'START NEW GAME?', VIRTUAL_W / 2, 88, COLOR_YELLOW);

    ctx.font = FONT_SMALL;
    this.centeredOutlinedText(ctx, 'This will erase your save.', VIRTUAL_W / 2, 102, '#aa8888');

    const items = ['YES, NEW GAME', 'CANCEL'];
    items.forEach((item, i) => {
      const sel = i === this.selectedIndex;
      const fill = sel ? COLOR_YELLOW : '#8888aa';
      ctx.font = FONT_SMALL;
      const textY = 118 + i * 12;
      if (sel) {
        sprites.draw(ctx, 'menu_arrow', (VIRTUAL_W - 180) / 2 + 16, textY - 6);
      }
      this.centeredOutlinedText(ctx, item, VIRTUAL_W / 2, textY, fill);
    });
  }

  // ============================================================
  // Story Card (between levels)
  // ============================================================
  renderStoryCard(
    ctx: CanvasRenderingContext2D,
    levelId: number,
    text: string,
    frameCount: number,
  ): void {
    ctx.fillStyle = '#05050f';
    ctx.fillRect(0, 0, VIRTUAL_W, VIRTUAL_H);
    this.renderStarField(ctx, frameCount);

    this.draw9Patch(ctx, 40, 50, VIRTUAL_W - 80, 100);

    ctx.font = FONT_MED;
    this.centeredOutlinedText(ctx, `DECK ${levelId + 1}`, VIRTUAL_W / 2, 68, COLOR_CYAN);

    // Wrap text into lines
    ctx.font = FONT_SMALL;
    const lines = text.split('\n');
    lines.forEach((line, i) => {
      this.centeredOutlinedText(ctx, line, VIRTUAL_W / 2, 88 + i * 11, COLOR_WHITE);
    });

    const pulse = 0.5 + Math.sin(frameCount * 0.08) * 0.5;
    ctx.globalAlpha = pulse;
    ctx.font = FONT_SMALL;
    this.centeredOutlinedText(ctx, 'PRESS ENTER', VIRTUAL_W / 2, 140, '#8888aa');
    ctx.globalAlpha = 1;
  }

  // ============================================================
  // Menu navigation
  // ============================================================
  menuUp(count: number): void {
    this.selectedIndex = (this.selectedIndex - 1 + count) % count;
  }
  menuDown(count: number): void {
    this.selectedIndex = (this.selectedIndex + 1) % count;
  }
  getSelectedIndex(): number { return this.selectedIndex; }
  resetMenuIndex(): void { this.selectedIndex = 0; }

  // ============================================================
  // Helpers
  // ============================================================
  private outlinedText(ctx: CanvasRenderingContext2D, text: string, x: number, y: number, fill: string, outline = '#000000'): void {
    const prevFill = ctx.fillStyle;
    ctx.fillStyle = outline;
    ctx.fillText(text, x - 1, y);
    ctx.fillText(text, x + 1, y);
    ctx.fillText(text, x, y - 1);
    ctx.fillText(text, x, y + 1);
    ctx.fillStyle = fill;
    ctx.fillText(text, x, y);
    ctx.fillStyle = prevFill;
  }

  private centeredOutlinedText(ctx: CanvasRenderingContext2D, text: string, cx: number, y: number, fill: string, outline = '#000000'): void {
    const x = cx - ctx.measureText(text).width / 2;
    this.outlinedText(ctx, text, x, y, fill, outline);
  }

  private centeredText(ctx: CanvasRenderingContext2D, text: string, cx: number, y: number): void {
    ctx.fillText(text, cx - ctx.measureText(text).width / 2, y);
  }

  private renderStarField(ctx: CanvasRenderingContext2D, frameCount: number): void {
    this.stars.forEach(star => {
      const y = (star.y + frameCount * star.speed) % VIRTUAL_H;
      // Alpha twinkle
      const twinkle = 0.6 + Math.sin(frameCount * 0.03 + star.x * 0.1) * 0.4;
      ctx.globalAlpha = twinkle;
      ctx.fillStyle = star.brightness;
      ctx.fillRect(star.x, y, star.size, star.size);
    });
    ctx.globalAlpha = 1;
  }

  private drawStar(ctx: CanvasRenderingContext2D, cx: number, cy: number, r: number): void {
    ctx.beginPath();
    for (let i = 0; i < 5; i++) {
      const a1 = (i * Math.PI * 2) / 5 - Math.PI / 2;
      const a2 = a1 + Math.PI / 5;
      if (i === 0) ctx.moveTo(cx + Math.cos(a1) * r, cy + Math.sin(a1) * r);
      else         ctx.lineTo(cx + Math.cos(a1) * r, cy + Math.sin(a1) * r);
      ctx.lineTo(cx + Math.cos(a2) * r * 0.4, cy + Math.sin(a2) * r * 0.4);
    }
    ctx.closePath();
    ctx.fill();
  }

  /** Draw a 9-patch bordered box. */
  private draw9Patch(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number): void {
    const cs = 8; // corner size

    // Fill interior
    ctx.fillStyle = '#0c0c24';
    ctx.fillRect(x + cs, y + cs, w - cs * 2, h - cs * 2);

    // Corners
    sprites.draw(ctx, 'border_tl', x, y);
    sprites.draw(ctx, 'border_tr', x + w - cs, y);
    sprites.draw(ctx, 'border_bl', x, y + h - cs);
    sprites.draw(ctx, 'border_br', x + w - cs, y + h - cs);

    // Top/bottom edges (stretched via tiling)
    for (let ex = x + cs; ex < x + w - cs; ex += cs) {
      const ew = Math.min(cs, x + w - cs - ex);
      ctx.save();
      ctx.beginPath();
      ctx.rect(ex, y, ew, cs);
      ctx.clip();
      sprites.draw(ctx, 'border_t', ex, y);
      ctx.restore();

      ctx.save();
      ctx.beginPath();
      ctx.rect(ex, y + h - cs, ew, cs);
      ctx.clip();
      sprites.draw(ctx, 'border_b', ex, y + h - cs);
      ctx.restore();
    }

    // Left/right edges
    for (let ey = y + cs; ey < y + h - cs; ey += cs) {
      const eh = Math.min(cs, y + h - cs - ey);
      ctx.save();
      ctx.beginPath();
      ctx.rect(x, ey, cs, eh);
      ctx.clip();
      sprites.draw(ctx, 'border_l', x, ey);
      ctx.restore();

      ctx.save();
      ctx.beginPath();
      ctx.rect(x + w - cs, ey, cs, eh);
      ctx.clip();
      sprites.draw(ctx, 'border_r', x + w - cs, ey);
      ctx.restore();
    }
  }
}
