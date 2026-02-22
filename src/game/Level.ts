// Level manager: loads a LevelDef, manages entity collections, collision,
// screen transitions, objective tracking, and boss gating.

import {
  TILE_SIZE, SCREEN_COLS, SCREEN_ROWS,
  COLOR_YELLOW, VIRTUAL_W, VIRTUAL_H, HUD_H,
  PLAYER_MAX_HP,
} from '../constants';
import { LevelDef, TileType, EnemyType } from '../types';
import { Audio } from './Audio';
import { Boss } from './Boss';
import { Camera } from './Camera';
import { Enemy } from './Enemy';
import { Entity } from './Entity';
import { ParticleSystem, ScreenShake } from './Particle';
import { Pickup } from './Pickup';
import { Player } from './Player';
import { Projectile } from './Projectile';
import { ScreenEffects } from './ScreenEffects';
import { NPC, NPCKind } from './NPC';
import { Tilemap } from './Tilemap';

export class Level {
  readonly def: LevelDef;
  crystalsCollected = 0;
  hasKey = false;
  switchActivated = false;
  bossDefeated = false;
  bossEncountered = false;
  levelComplete = false;

  private camera: Camera;
  private player: Player;
  private audio: Audio;

  // Tilemaps indexed [row][col]
  private tilemaps: Tilemap[][];

  // Active entities (on current + adjacent screens)
  private enemies: Enemy[] = [];
  private boss: Boss | null = null;
  private pickups: Pickup[] = [];
  private projectiles: Projectile[] = [];
  private npcs: NPC[] = [];
  particles = new ParticleSystem();
  shake = new ScreenShake();
  screenEffects = new ScreenEffects();

  // Current active tilemap
  private currentTilemap!: Tilemap;
  private prevTilemap: Tilemap | null = null;

  // Transition state
  private transitioning = false;
  private inputLocked = false;

  // Level complete animation timer
  private completeTimer = 0;

  constructor(def: LevelDef, camera: Camera, player: Player, audio: Audio) {
    this.def = def;
    this.camera = camera;
    this.player = player;
    this.audio = audio;

    // Build all tilemaps
    this.tilemaps = def.screens.map((row, r) =>
      row.map((screenDef, c) => {
        const tm = new Tilemap(screenDef.tiles, c, r);
        tm.palette = def.backgroundPalette;
        return tm;
      })
    );
  }

  load(): void {
    // Carve border openings between adjacent screens for transitions
    this.carveBorderOpenings();

    const { startScreen } = this.def;
    this.camera.setScreen(startScreen.row, startScreen.col);
    this.currentTilemap = this.tilemaps[startScreen.row]![startScreen.col]!;

    // Find player start tile (P) in start screen
    const startPos = this.findTileInScreen(startScreen.row, startScreen.col, TileType.Player);
    if (startPos) {
      this.player.reset(
        this.currentTilemap.originX + startPos.col * TILE_SIZE + 1,
        this.currentTilemap.originY + startPos.row * TILE_SIZE + 1,
      );
    }

    this.player.setParticles(this.particles);

    // Spawn pickups and enemies from all screens
    this.def.screens.forEach((rowArr, r) => {
      rowArr.forEach((screenDef, c) => {
        const tm = this.tilemaps[r]![c]!;
        this.spawnPickupsForScreen(screenDef.tiles, tm);
        screenDef.enemies.forEach(es => {
          const enemy = new Enemy(
            tm.originX + es.x * TILE_SIZE + 1,
            tm.originY + es.y * TILE_SIZE + 1,
            es.type,
            this.def.enemyScale,
            this.particles,
          );
          this.enemies.push(enemy);
        });
      });
    });

    // Spawn boss
    const { bossScreen } = this.def;
    const bossTm = this.tilemaps[bossScreen.row]![bossScreen.col]!;
    const bossPos = this.findTileInScreen(bossScreen.row, bossScreen.col, TileType.Boss);
    if (bossPos) {
      this.boss = new Boss(
        bossTm.originX + bossPos.col * TILE_SIZE,
        bossTm.originY + bossPos.row * TILE_SIZE,
        this.def.bossType,
        this.def.bossParams,
        this.def.enemyScale,
        this.particles,
        this.shake,
      );
    }

    // Random NPC spawn (~35% chance per level)
    if (Math.random() < 0.35) {
      const kind: NPCKind = Math.random() < 0.5 ? 'mom' : 'dad';
      const npcTile = this.findSafeFloorTile(this.def.startScreen.row, this.def.startScreen.col);
      if (npcTile) {
        const startTm = this.tilemaps[this.def.startScreen.row]![this.def.startScreen.col]!;
        this.npcs.push(new NPC(
          startTm.originX + npcTile.col * TILE_SIZE + 1,
          startTm.originY + npcTile.row * TILE_SIZE + 1,
          kind,
        ));
      }
    }
  }

  private findSafeFloorTile(screenRow: number, screenCol: number): { row: number; col: number } | null {
    const screenDef = this.def.screens[screenRow]?.[screenCol];
    if (!screenDef) return null;

    const candidates: Array<{ row: number; col: number }> = [];
    const enemyPositions = new Set(screenDef.enemies.map(e => `${e.x},${e.y}`));

    for (let r = 2; r < SCREEN_ROWS - 2; r++) {
      const row = screenDef.tiles[r];
      if (!row) continue;
      for (let c = 2; c < SCREEN_COLS - 2; c++) {
        const ch = row[c];
        if (ch === '.' && !enemyPositions.has(`${c},${r}`)) {
          candidates.push({ row: r, col: c });
        }
      }
    }

    if (candidates.length === 0) return null;
    return candidates[Math.floor(Math.random() * candidates.length)]!;
  }

  private spawnPickupsForScreen(tiles: string[], tm: Tilemap): void {
    tiles.forEach((row, r) => {
      row.split('').forEach((ch, c) => {
        if (ch === TileType.Crystal) {
          this.pickups.push(new Pickup(
            tm.originX + c * TILE_SIZE + 1,
            tm.originY + r * TILE_SIZE + 1,
            'crystal',
          ));
        } else if (ch === TileType.KeySpot) {
          this.pickups.push(new Pickup(
            tm.originX + c * TILE_SIZE + 1,
            tm.originY + r * TILE_SIZE + 1,
            'key',
          ));
        }
      });
    });
  }

  private findTileInScreen(
    screenRow: number, screenCol: number,
    type: TileType,
  ): { row: number; col: number } | null {
    const screenDef = this.def.screens[screenRow]?.[screenCol];
    if (!screenDef) return null;
    for (let r = 0; r < screenDef.tiles.length; r++) {
      const row = screenDef.tiles[r]!;
      for (let c = 0; c < row.length; c++) {
        if (row[c] === type) return { row: r, col: c };
      }
    }
    return null;
  }

  // ============================================================
  // UPDATE
  // ============================================================
  update(dt: number): void {
    this.shake.update(dt);
    this.camera.update(dt);

    // After camera finishes transition, unlock input
    if (this.transitioning && !this.camera.isTransitioning) {
      this.transitioning = false;
      this.inputLocked = false;
      this.prevTilemap = null;
      this.currentTilemap = this.tilemaps[this.camera.screenRow]![this.camera.screenCol]!;
    }

    if (this.levelComplete) {
      this.completeTimer += dt;
      return;
    }

    const tm = this.currentTilemap;

    // Player
    if (!this.inputLocked) {
      this.player.update(dt, tm);
    }

    // Handle player outputs
    this.projectiles.push(...this.player.pendingProjectiles);

    // Time Pulse
    if (this.player.timePulseTriggered) {
      this.applyTimePulse();
    }

    // Enemies (only update enemies on current screen)
    const activeEnemies = this.enemiesOnScreen(this.camera.screenRow, this.camera.screenCol);
    activeEnemies.forEach(e => {
      e.targetX = this.player.cx;
      e.targetY = this.player.cy;
      e.update(dt, tm);
      this.projectiles.push(...e.pendingProjectiles);
    });

    // Boss
    if (this.boss && this.bossOnCurrentScreen()) {
      if (!this.bossEncountered) this.bossEncountered = true;
      this.boss.targetX = this.player.cx;
      this.boss.targetY = this.player.cy;
      this.boss.update(dt, tm);
      this.projectiles.push(...this.boss.pendingProjectiles);
      // Boss-spawned enemies (capped by maxMinions)
      if (this.boss.pendingSpawns.length > 0) {
        const maxMinions = this.def.bossParams.maxMinions ?? 4;
        const bossRow = this.def.bossScreen.row;
        const bossCol = this.def.bossScreen.col;
        const currentMinions = this.enemiesOnScreen(bossRow, bossCol).length;
        let added = 0;
        for (const spawned of this.boss.pendingSpawns) {
          if (currentMinions + added < maxMinions) {
            this.enemies.push(spawned);
            added++;
          }
        }
      }
      // Boss phase transition flash
      if (this.boss.phaseChanged) {
        this.boss.phaseChanged = false;
        this.screenEffects.triggerDamageFlash();
      }
      if (!this.boss.alive && !this.bossDefeated) {
        this.bossDefeated = true;
        this.audio.play('boss_die');
        this.particles.spawn(this.boss.cx, this.boss.cy, 40, '#ff4466', 150, [4, 8]);
        this.shake.trigger(12, 800);
        setTimeout(() => { this.levelComplete = true; }, 1200);
      }
    }

    // Pickups
    this.pickups.filter(p => p.alive).forEach(p => p.update(dt, tm));

    // NPCs
    this.npcs.forEach(n => n.update(dt));

    // Projectiles
    this.projectiles = this.projectiles.filter(p => p.alive);
    this.projectiles.forEach(p => p.update(dt, tm));

    // Particles
    this.particles.update(dt);

    // Collision checks (skip dying enemies)
    const livingEnemies = activeEnemies.filter(e => !e.isDying);
    this.checkPlayerVsEnemies(livingEnemies);
    this.checkPlayerVsBoss();
    this.checkPlayerVsPickups();
    this.checkProjectileVsEntities(livingEnemies);
    this.checkObjectives(tm);

    // Screen effects
    this.screenEffects.update(dt, this.player.hp, PLAYER_MAX_HP);

    // Cull dead (keep dying enemies until death anim finishes)
    this.enemies = this.enemies.filter(e =>
      e.alive || (e.isDying && !e.updateDeath(dt))
    );
    this.projectiles = this.projectiles.filter(p => p.alive);
    this.pickups = this.pickups.filter(p => p.alive);

    // Screen transition check (player walks off edge)
    if (!this.inputLocked) {
      this.checkScreenTransition();
    }
  }

  // ============================================================
  // COLLISION
  // ============================================================
  private overlaps(
    ax: number, ay: number, aw: number, ah: number,
    bx: number, by: number, bw: number, bh: number,
  ): boolean {
    return ax < bx + bw && ax + aw > bx && ay < by + bh && ay + ah > by;
  }

  private checkPlayerVsEnemies(enemies: Enemy[]): void {
    enemies.forEach(e => {
      if (!e.alive) return;
      if (this.overlaps(this.player.x, this.player.y, this.player.w, this.player.h,
                        e.x, e.y, e.w, e.h)) {
        const hpBefore = this.player.hp;
        this.player.takeDamage(e.contactDamage);
        if (e.contactDamage > 0) {
          this.audio.play('player_hit');
          if (this.player.hp < hpBefore) this.screenEffects.triggerDamageFlash();
        }
      }
    });
  }

  private checkPlayerVsBoss(): void {
    if (!this.boss || !this.boss.alive) return;
    if (this.overlaps(this.player.x, this.player.y, this.player.w, this.player.h,
                      this.boss.x, this.boss.y, this.boss.w, this.boss.h)) {
      const hpBefore = this.player.hp;
      this.player.takeDamage(this.boss!.contactDamage);
      this.audio.play('player_hit');
      if (this.player.hp < hpBefore) this.screenEffects.triggerDamageFlash();
    }
  }

  private checkPlayerVsPickups(): void {
    this.pickups.forEach(p => {
      if (!p.alive) return;
      if (this.overlaps(this.player.x, this.player.y, this.player.w, this.player.h,
                        p.x, p.y, p.w, p.h)) {
        // Screen-space position for fly particle origin
        const fromX = this.camera.worldToScreenX(p.cx);
        const fromY = this.camera.worldToScreenY(p.cy) + HUD_H;

        if (p.kind === 'crystal') {
          this.crystalsCollected++;
          this.player.energy = Math.min(100, this.player.energy + p.energyRestore);
          this.audio.play('crystal_pickup');
          this.particles.spawnFly(fromX, fromY, 129, 6, '#44eeff');
        } else {
          this.hasKey = true;
          this.audio.play('key_pickup');
          this.particles.spawnFly(fromX, fromY, 165, 6, '#ffdd44');
        }
        p.alive = false;
      }
    });
  }

  private checkProjectileVsEntities(enemies: Enemy[]): void {
    this.projectiles.forEach(proj => {
      if (!proj.alive) return;

      if (proj.owner === 'player') {
        // vs enemies
        enemies.forEach(e => {
          if (!e.alive || !proj.alive) return;
          if (proj.overlaps(e.x, e.y, e.w, e.h)) {
            e.takeDamage(proj.damage);
            proj.alive = false;
            this.audio.play('enemy_hit');
            if (!e.alive) this.audio.play('enemy_die');
          }
        });
        // vs boss
        if (this.boss && this.boss.alive && proj.alive) {
          if (proj.overlaps(this.boss.x, this.boss.y, this.boss.w, this.boss.h)) {
            this.boss.takeDamage(proj.damage);
            proj.alive = false;
            this.audio.play('boss_hit');
          }
        }
      } else {
        // vs player
        if (!this.player.isInvulnerable && proj.alive) {
          if (proj.overlaps(this.player.x, this.player.y, this.player.w, this.player.h)) {
            const hpBefore = this.player.hp;
            this.player.takeDamage(proj.damage);
            proj.alive = false;
            this.audio.play('player_hit');
            if (this.player.hp < hpBefore) this.screenEffects.triggerDamageFlash();
          }
        }
      }
    });
  }

  private applyTimePulse(): void {
    const pulseRadius = 80;
    const pulseX = this.player.cx;
    const pulseY = this.player.cy;

    // Kill nearby enemy projectiles
    this.projectiles.forEach(p => {
      if (p.owner === 'enemy') {
        const dx = p.x - pulseX;
        const dy = p.y - pulseY;
        if (Math.sqrt(dx * dx + dy * dy) < pulseRadius) {
          p.alive = false;
        }
      }
    });

    // Damage nearby enemies
    const currentEnemies = this.enemiesOnScreen(this.camera.screenRow, this.camera.screenCol);
    currentEnemies.forEach(e => {
      if (e.distanceTo(pulseX, pulseY) < pulseRadius) {
        e.takeDamage(2);
        this.audio.play('enemy_hit');
        if (!e.alive) this.audio.play('enemy_die');
      }
    });

    // Damage boss
    if (this.boss && this.boss.alive) {
      if (this.boss.distanceTo(pulseX, pulseY) < pulseRadius + this.boss.w) {
        this.boss.takeDamage(2);
        this.audio.play('boss_hit');
      }
    }

    this.audio.play('time_pulse');
  }

  // ============================================================
  // OBJECTIVES / GATING
  // ============================================================
  private checkObjectives(tm: Tilemap): void {
    // Switch: if player stands on switch tile, activate
    if (!this.switchActivated) {
      const { col, row } = tm.worldToTile(this.player.cx, this.player.cy);
      if (tm.isSwitchTile(col, row)) {
        this.switchActivated = true;
        this.audio.play('ui_confirm');
        // Open all doors on ALL screens + update switch visual
        this.tilemaps.forEach(rowArr => rowArr.forEach(t => {
          t.openAllDoors();
          t.switchActivated = true;
        }));
      }
    }

    // Key: auto-open all doors when player has key
    if (this.hasKey) {
      this.tilemaps.forEach(rowArr => rowArr.forEach(t => t.openAllDoors()));
    }

    // Crystals threshold: open doors when enough collected
    if (this.def.gatingType === 'crystals' && this.def.crystalThreshold !== undefined) {
      if (this.crystalsCollected >= this.def.crystalThreshold) {
        this.tilemaps.forEach(rowArr => rowArr.forEach(t => t.openAllDoors()));
      }
    }
  }

  // ============================================================
  // SCREEN TRANSITIONS
  // ============================================================
  private checkScreenTransition(): void {
    const p = this.player;
    const tm = this.currentTilemap;

    const leftEdge   = tm.originX;
    const rightEdge  = tm.originX + SCREEN_COLS * TILE_SIZE;
    const topEdge    = tm.originY;
    const bottomEdge = tm.originY + SCREEN_ROWS * TILE_SIZE;

    let toRow = this.camera.screenRow;
    let toCol = this.camera.screenCol;
    let moved = false;

    if (p.x < leftEdge + 1 && this.camera.screenCol > 0) {
      toCol--;
      moved = true;
      // Place player at right edge of target screen
      const targetTm = this.tilemaps[toRow]![toCol]!;
      p.x = targetTm.originX + SCREEN_COLS * TILE_SIZE - p.w - 4;
    } else if (p.x + p.w > rightEdge - 1 && this.camera.screenCol < (this.def.screens[toRow]?.length ?? 1) - 1) {
      toCol++;
      moved = true;
      p.x = this.tilemaps[toRow]![toCol]!.originX + 4;
    } else if (p.y < topEdge + 1 && this.camera.screenRow > 0) {
      toRow--;
      moved = true;
      p.y = this.tilemaps[toRow]![toCol]!.originY + SCREEN_ROWS * TILE_SIZE - p.h - 4;
    } else if (p.y + p.h > bottomEdge - 1 && this.camera.screenRow < this.def.screens.length - 1) {
      toRow++;
      moved = true;
      p.y = this.tilemaps[toRow]![toCol]!.originY + 4;
    }

    if (moved && (toRow !== this.camera.screenRow || toCol !== this.camera.screenCol)) {
      this.prevTilemap = this.currentTilemap;
      this.camera.beginTransition(toRow, toCol);
      this.transitioning = true;
      this.inputLocked = true;
      this.screenEffects.triggerTransitionFlash();
    }
  }

  // ============================================================
  // BORDER CARVING — create passable openings between screens
  // ============================================================
  private carveBorderOpenings(): void {
    const screens = this.def.screens;
    const bossR = this.def.bossScreen.row;
    const bossC = this.def.bossScreen.col;

    for (let r = 0; r < screens.length; r++) {
      const screenRow = screens[r]!;
      for (let c = 0; c < screenRow.length; c++) {
        // Horizontal neighbor (right)
        if (c + 1 < screenRow.length) {
          const gated = (r === bossR && c === bossC) || (r === bossR && c + 1 === bossC);
          const tile = gated ? TileType.Door : TileType.Floor;
          const tmL = this.tilemaps[r]![c]!;
          const tmR = this.tilemaps[r]![c + 1]!;
          for (let rr = 5; rr <= 7; rr++) {
            tmL.setTile(19, rr, tile);
            tmR.setTile(0, rr, tile);
          }
        }
        // Vertical neighbor (below)
        if (r + 1 < screens.length && c < screens[r + 1]!.length) {
          const gated = (r === bossR && c === bossC) || (r + 1 === bossR && c === bossC);
          const tile = gated ? TileType.Door : TileType.Floor;
          const tmT = this.tilemaps[r]![c]!;
          const tmB = this.tilemaps[r + 1]![c]!;
          for (let cc = 8; cc <= 10; cc++) {
            tmT.setTile(cc, 12, tile);
            tmB.setTile(cc, 0, tile);
          }
        }
      }
    }
  }

  // ============================================================
  // HELPERS
  // ============================================================
  private enemiesOnScreen(screenRow: number, screenCol: number): Enemy[] {
    const tm = this.tilemaps[screenRow]?.[screenCol];
    if (!tm) return [];
    const ox = tm.originX;
    const oy = tm.originY;
    const maxX = ox + SCREEN_COLS * TILE_SIZE;
    const maxY = oy + SCREEN_ROWS * TILE_SIZE;
    return this.enemies.filter(e =>
      e.x >= ox - 4 && e.x < maxX + 4 &&
      e.y >= oy - 4 && e.y < maxY + 4
    );
  }

  private npcsOnScreen(screenRow: number, screenCol: number): NPC[] {
    const tm = this.tilemaps[screenRow]?.[screenCol];
    if (!tm) return [];
    const ox = tm.originX;
    const oy = tm.originY;
    const maxX = ox + SCREEN_COLS * TILE_SIZE;
    const maxY = oy + SCREEN_ROWS * TILE_SIZE;
    return this.npcs.filter(n =>
      n.x >= ox && n.x < maxX && n.y >= oy && n.y < maxY
    );
  }

  private bossOnCurrentScreen(): boolean {
    return (
      this.camera.screenRow === this.def.bossScreen.row &&
      this.camera.screenCol === this.def.bossScreen.col
    );
  }

  // Expose as LevelInfo for the UI
  get id(): number { return this.def.id; }
  get name(): string { return this.def.name; }
  get crystalTotal(): number { return this.def.crystalTotal; }
  get gatingType(): string { return this.def.gatingType; }

  // ============================================================
  // RENDER
  // ============================================================
  render(ctx: CanvasRenderingContext2D): void {
    const shakeX = Math.round(this.shake.offsetX);
    const shakeY = Math.round(this.shake.offsetY);

    ctx.save();
    ctx.translate(shakeX, shakeY);

    // Render current tilemap
    this.currentTilemap.render(ctx, this.camera);

    // Also render previous tilemap during camera transition
    if (this.transitioning && this.prevTilemap) {
      this.prevTilemap.render(ctx, this.camera);
    }

    // Shadows (after tilemap, before entities)
    this.renderShadows(ctx);

    // Pickups
    this.pickups.forEach(p => p.render(ctx, this.camera));

    // NPCs on current screen
    this.npcsOnScreen(this.camera.screenRow, this.camera.screenCol)
      .forEach(n => n.render(ctx, this.camera));

    // Enemies on current screen (including dying ones)
    this.enemiesOnScreen(this.camera.screenRow, this.camera.screenCol)
      .forEach(e => e.render(ctx, this.camera));

    // Boss
    if (this.boss && this.bossOnCurrentScreen()) {
      this.boss.render(ctx, this.camera);
    }

    // Player
    this.player.render(ctx, this.camera);

    // Projectiles
    this.projectiles.forEach(p => p.render(ctx, this.camera));

    // Particles (world-space)
    this.particles.render(ctx, this.camera);

    // Boss gate warning (when boss door is visible and locked)
    this.renderBossGateHint(ctx);

    ctx.restore();

    // Particles (screen-space fly particles)
    this.particles.renderFly(ctx);

    // Screen effects (after restore — not affected by shake)
    this.screenEffects.render(ctx, VIRTUAL_W, VIRTUAL_H);
  }

  private renderShadows(ctx: CanvasRenderingContext2D): void {
    ctx.fillStyle = '#000000';

    // Helper to draw a single ellipse shadow
    const drawShadow = (wx: number, wy: number, w: number, h: number, alpha: number, scale = 1) => {
      const sx = this.camera.worldToScreenX(wx + w / 2);
      const sy = this.camera.worldToScreenY(wy + h) + HUD_H;
      ctx.globalAlpha = alpha;
      ctx.beginPath();
      ctx.ellipse(sx, sy, (w / 2) * 0.8 * scale, 2 * scale, 0, 0, Math.PI * 2);
      ctx.fill();
    };

    // Player shadow (shrinks during jump)
    if (this.player.alive) {
      const jp = this.player.jumpProgress;
      const shadowScale = 1 - jp * 0.5;
      const shadowAlpha = 0.25 * (1 - jp * 0.6);
      drawShadow(this.player.x, this.player.y, this.player.w, this.player.h, shadowAlpha, shadowScale);
    }

    // Enemy shadows
    const screenEnemies = this.enemiesOnScreen(this.camera.screenRow, this.camera.screenCol);
    screenEnemies.forEach(e => {
      if (!e.isDying) drawShadow(e.x, e.y, e.w, e.h, 0.2);
    });

    // Boss shadow
    if (this.boss && this.boss.alive && this.bossOnCurrentScreen()) {
      drawShadow(this.boss.x, this.boss.y, this.boss.w, this.boss.h, 0.2);
    }

    // Pickup shadows
    this.pickups.forEach(p => {
      if (p.alive) drawShadow(p.x, p.y, p.w, p.h, 0.15);
    });

    // NPC shadows
    this.npcsOnScreen(this.camera.screenRow, this.camera.screenCol).forEach(n => {
      drawShadow(n.x, n.y, n.w, n.h, 0.15);
    });

    ctx.globalAlpha = 1;
  }

  private renderBossGateHint(ctx: CanvasRenderingContext2D): void {
    if (this.bossDefeated) return;
    const { bossScreen } = this.def;
    if (this.camera.screenRow !== bossScreen.row || this.camera.screenCol !== bossScreen.col) {
      // Show gating hint only near the boss screen
      const pr = this.camera.screenRow;
      const pc = this.camera.screenCol;
      const near = Math.abs(pr - bossScreen.row) + Math.abs(pc - bossScreen.col) === 1;
      if (!near) return;
    }

    // Check if door is still locked
    const tm = this.currentTilemap;
    let showHint = false;
    if (this.def.gatingType === 'key' && !this.hasKey) showHint = true;
    if (this.def.gatingType === 'switch' && !this.switchActivated) showHint = true;
    if (this.def.gatingType === 'crystals' && this.crystalsCollected < (this.def.crystalThreshold ?? 999)) showHint = true;

    if (!showHint) return;

    ctx.fillStyle = 'rgba(0,0,0,0.5)';
    ctx.fillRect(0, VIRTUAL_H - 22, VIRTUAL_W, 14);
    ctx.font = '7px monospace';
    const msg = this.def.gatingType === 'key'
      ? 'Find the KEY to open the boss door'
      : this.def.gatingType === 'switch'
      ? 'Find the SWITCH to open the boss door'
      : `Collect ${this.def.crystalThreshold} crystals to open the boss door`;
    const mx = (VIRTUAL_W - ctx.measureText(msg).width) / 2;
    ctx.fillStyle = '#000000';
    ctx.fillText(msg, mx - 1, VIRTUAL_H - 12);
    ctx.fillText(msg, mx + 1, VIRTUAL_H - 12);
    ctx.fillText(msg, mx, VIRTUAL_H - 13);
    ctx.fillText(msg, mx, VIRTUAL_H - 11);
    ctx.fillStyle = COLOR_YELLOW;
    ctx.fillText(msg, mx, VIRTUAL_H - 12);
  }
}

