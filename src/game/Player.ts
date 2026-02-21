// Abel — the player character.
// Handles movement, jump arc, blast, Time Pulse, HP, energy, i-frames.

import {
  TILE_SIZE, HUD_H,
  PLAYER_SPEED, PLAYER_MAX_HP, PLAYER_MAX_ENERGY,
  PLAYER_ENERGY_REGEN, PLAYER_BLAST_COST, PLAYER_PULSE_COST,
  PLAYER_FIRE_COOLDOWN, PLAYER_IFRAMES_MS, PLAYER_JUMP_MS,
} from '../constants';
import { Camera } from './Camera';
import { Entity } from './Entity';
import { Input } from './Input';
import { ParticleSystem } from './Particle';
import { Projectile } from './Projectile';
import { Tilemap } from './Tilemap';
import { sprites } from '../sprites';

export class Player extends Entity {
  energy: number = PLAYER_MAX_ENERGY;

  // Jump
  isJumping = false;
  private jumpTimer = 0;
  get jumpProgress(): number {
    return this.isJumping ? Math.sin((1 - this.jumpTimer / PLAYER_JUMP_MS) * Math.PI) : 0;
  }

  // I-frames
  private iFrameTimer = 0;
  get isInvulnerable(): boolean { return this.iFrameTimer > 0; }

  // Blast cooldown
  private fireCooldown = 0;

  // Blast visual flash timer (ms)
  private blastFlashTimer = 0;

  // Visual flash (i-frames blink)
  private blinkOn = true;

  // Facing direction
  private faceX = 1;
  private faceY = 0;

  // Walk animation
  private walkFrame = 0;
  private animTimer = 0;
  private moving = false;

  // Idle breathing
  private idleTimer = 0;
  private breathOffset = 0;

  // Outputs
  pendingProjectiles: Projectile[] = [];
  timePulseTriggered = false;

  private input: Input;
  private particles: ParticleSystem;

  constructor(x: number, y: number, input: Input, particles?: ParticleSystem) {
    super(x, y, TILE_SIZE - 2, TILE_SIZE - 2, PLAYER_MAX_HP);
    this.input = input;
    this.particles = particles ?? new ParticleSystem();
  }

  setParticles(p: ParticleSystem): void {
    this.particles = p;
  }

  /** Reset for new level */
  reset(wx: number, wy: number): void {
    this.x = wx;
    this.y = wy;
    this.hp = PLAYER_MAX_HP;
    this.energy = PLAYER_MAX_ENERGY;
    this.isJumping = false;
    this.jumpTimer = 0;
    this.iFrameTimer = 0;
    this.fireCooldown = 0;
    this.vx = 0;
    this.vy = 0;
    this.alive = true;
  }

  override takeDamage(amount: number): void {
    if (this.iFrameTimer > 0) return;
    super.takeDamage(amount);
    this.iFrameTimer = PLAYER_IFRAMES_MS;
    this.particles.spawn(this.cx, this.cy, 8, '#55ddff', 60);
  }

  /** Map faceX/faceY to direction name for sprite lookup */
  private get directionName(): 'up' | 'down' | 'left' | 'right' {
    if (this.faceY < 0) return 'up';
    if (this.faceY > 0) return 'down';
    if (this.faceX < 0) return 'left';
    return 'right';
  }

  update(dt: number, tilemap: Tilemap): void {
    if (!this.alive) return;

    this.pendingProjectiles = [];
    this.timePulseTriggered = false;

    // Timer ticks
    this.iFrameTimer = Math.max(0, this.iFrameTimer - dt * 1000);
    this.fireCooldown = Math.max(0, this.fireCooldown - dt * 1000);
    this.blastFlashTimer = Math.max(0, this.blastFlashTimer - dt * 1000);
    this.blinkOn = Math.floor(this.iFrameTimer / 80) % 2 === 0;

    // Energy regen
    this.energy = Math.min(PLAYER_MAX_ENERGY, this.energy + PLAYER_ENERGY_REGEN * dt);

    // Movement
    let mvx = 0;
    let mvy = 0;
    if (this.input.isHeld('left'))  { mvx -= 1; this.faceX = -1; this.faceY = 0; }
    if (this.input.isHeld('right')) { mvx += 1; this.faceX =  1; this.faceY = 0; }
    if (this.input.isHeld('up'))    { mvy -= 1; this.faceY = -1; this.faceX = 0; }
    if (this.input.isHeld('down'))  { mvy += 1; this.faceY =  1; this.faceX = 0; }

    // Normalize diagonal
    if (mvx !== 0 && mvy !== 0) {
      mvx *= 0.707;
      mvy *= 0.707;
    }

    // Track movement for walk animation
    this.moving = mvx !== 0 || mvy !== 0;
    if (this.moving) {
      this.animTimer += dt * 1000;
      if (this.animTimer >= 150) {
        this.animTimer -= 150;
        this.walkFrame = this.walkFrame === 1 ? 2 : 1;
      }
      this.idleTimer = 0;
    } else {
      this.walkFrame = 0;
      this.animTimer = 0;
      this.idleTimer += dt * 3;
      this.breathOffset = Math.sin(this.idleTimer) * 0.7;
    }

    // Conveyor force
    const { col, row } = tilemap.worldToTile(this.cx, this.cy);
    const conv = tilemap.conveyorVelocity(col, row);
    // Ice: reduce control
    const onIce = tilemap.isIce(col, row);
    const ctrlScale = onIce ? 0.3 : 1.0;

    const dx = (mvx * PLAYER_SPEED * ctrlScale + conv.vx) * dt;
    const dy = (mvy * PLAYER_SPEED * ctrlScale + conv.vy) * dt;

    const moved = tilemap.resolveMovement(this.x, this.y, this.w, this.h, dx, dy);
    this.x = moved.x;
    this.y = moved.y;

    // Jump
    if (this.input.justPressed('jump') && !this.isJumping) {
      this.isJumping = true;
      this.jumpTimer = PLAYER_JUMP_MS;
    }
    if (this.isJumping) {
      this.jumpTimer -= dt * 1000;
      if (this.jumpTimer <= 0) {
        this.isJumping = false;
        this.jumpTimer = 0;
      }
    }

    // Hole check (only when not jumping)
    if (!this.isJumping && tilemap.centerIsHole(this.cx, this.cy)) {
      this.fallInHole(tilemap);
    }

    // Spike check
    if (tilemap.rectIsSpike(this.x, this.y, this.w, this.h)) {
      this.takeDamage(1);
    }

    // Blast
    if (this.input.justPressed('blast') && this.fireCooldown <= 0 && this.energy >= PLAYER_BLAST_COST) {
      this.energy -= PLAYER_BLAST_COST;
      this.fireCooldown = PLAYER_FIRE_COOLDOWN;
      this.blastFlashTimer = 150;
      this.pendingProjectiles.push(
        new Projectile(this.cx, this.cy, this.faceX, this.faceY, 'player', 1)
      );
    }

    // Time Pulse
    if (this.input.justPressed('pulse') && this.energy >= PLAYER_PULSE_COST) {
      this.energy -= PLAYER_PULSE_COST;
      this.timePulseTriggered = true;
      this.particles.spawn(this.cx, this.cy, 20, '#aaffff', 120, [3, 6]);
    }
  }

  private fallInHole(tilemap: Tilemap): void {
    this.takeDamage(1);
    // Respawn near the tile above (safe tile search)
    const { col, row } = tilemap.worldToTile(this.cx, this.cy);
    const safeRow = Math.max(0, row - 1);
    this.x = tilemap.originX + col * TILE_SIZE + 1;
    this.y = tilemap.originY + safeRow * TILE_SIZE + 1;
    this.iFrameTimer = Math.max(this.iFrameTimer, PLAYER_IFRAMES_MS);
  }

  render(ctx: CanvasRenderingContext2D, camera: Camera): void {
    if (!this.alive) return;
    // Blink during i-frames
    if (!this.blinkOn) return;

    const sx = Math.round(camera.worldToScreenX(this.x));
    const sy = Math.round(camera.worldToScreenY(this.y)) + HUD_H;
    const w = this.w;
    const h = this.h;

    // Jump visual: slight scale/offset to suggest arc
    const jp = this.jumpProgress;
    const jumpOffsetY = -jp * 7;
    const jumpScale = 1 + jp * 0.1;

    // Idle breathing offset (only when not jumping)
    const breathY = this.isJumping ? 0 : this.breathOffset;

    const dir = this.directionName;
    const frame = this.walkFrame;
    const spriteName = this.isJumping
      ? `player_${dir}_jump`
      : this.blastFlashTimer > 0
      ? `player_${dir}_blast`
      : `player_${dir}_${frame}`;

    ctx.save();
    ctx.translate(sx + w / 2, sy + h / 2 + jumpOffsetY + breathY);
    ctx.scale(jumpScale, jumpScale);

    sprites.draw(ctx, spriteName, -w / 2, -h / 2);

    ctx.restore();
    ctx.globalAlpha = 1;
  }

  isDead(): boolean {
    return !this.alive || this.hp <= 0;
  }
}
