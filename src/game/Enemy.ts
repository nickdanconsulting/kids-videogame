// Four enemy archetypes: Chaser, Patroller, Shooter, Wanderer.
// Each uses a simple state machine.

import {
  TILE_SIZE, HUD_H,
} from '../constants';
import { EnemyType } from '../types';
import { Camera } from './Camera';
import { Entity } from './Entity';
import { ParticleSystem } from './Particle';
import { Projectile } from './Projectile';
import { Tilemap } from './Tilemap';
import { sprites } from '../sprites';

// Base stats for each archetype (before enemy scale)
const BASE = {
  [EnemyType.Chaser]:    { hp: 3, speed: 58,  shootCooldown: 9999, damage: 1, projectileDamage: 0 },
  [EnemyType.Patroller]: { hp: 4, speed: 55,  shootCooldown: 9999, damage: 1, projectileDamage: 0 },
  [EnemyType.Shooter]:   { hp: 2, speed: 30,  shootCooldown: 2000, damage: 0, projectileDamage: 1 },
  [EnemyType.Wanderer]:  { hp: 2, speed: 50,  shootCooldown: 9999, damage: 1, projectileDamage: 0 },
};

type EnemyState = 'idle' | 'move' | 'charge' | 'shoot';

export class Enemy extends Entity {
  readonly type: EnemyType;
  readonly speed: number;
  readonly shootCooldown: number;
  readonly contactDamage: number;
  readonly projectileDamage: number;

  // Target (set externally by Level before each update)
  targetX = 0;
  targetY = 0;

  private state: EnemyState = 'move';
  private shootTimer = 0;
  private wanderTimer = 0;
  private wanderDirX = 1;
  private wanderDirY = 0;
  private patrolDirX = 1;
  private chargeTimer = 0;
  private chargeDirX = 0;
  private chargeDirY = 0;

  // Flash on hit
  flashTimer = 0;

  // Death animation
  isDying = false;
  private deathTimer = 0;
  private deathProgress = 0;

  // Walk animation
  private walkFrame = 0;
  private animTimer = 0;
  private lastMoveX = 1; // track horizontal facing for sprite selection

  // Idle bob
  private idlePhase = Math.random() * Math.PI * 2;

  // Pending projectiles spawned this frame
  pendingProjectiles: Projectile[] = [];

  private particles: ParticleSystem;

  constructor(
    worldX: number,
    worldY: number,
    type: EnemyType,
    scale: number,
    particles: ParticleSystem,
  ) {
    const base = BASE[type];
    super(worldX, worldY, TILE_SIZE - 2, TILE_SIZE - 2, Math.max(1, Math.round(base.hp * scale)));
    this.type = type;
    this.speed = base.speed * Math.min(scale, 2.5); // cap speed scaling
    this.shootCooldown = Math.max(600, base.shootCooldown / scale);
    this.contactDamage = base.damage;
    this.projectileDamage = base.projectileDamage;
    this.particles = particles;

    // Random initial wander direction
    const angle = Math.random() * Math.PI * 2;
    this.wanderDirX = Math.cos(angle);
    this.wanderDirY = Math.sin(angle);
    this.wanderTimer = 1 + Math.random() * 2;
    this.shootTimer = Math.random() * this.shootCooldown; // stagger
  }

  override takeDamage(amount: number): void {
    super.takeDamage(amount);
    this.flashTimer = 120; // ms
    this.particles.spawn(this.cx, this.cy, 5, '#ff8866', 50);
    if (!this.alive) {
      this.isDying = true;
      this.deathTimer = 300;
      this.deathProgress = 0;
    }
  }

  /** Tick death animation. Returns true when fully dead (remove from list). */
  updateDeath(dt: number): boolean {
    this.deathTimer -= dt * 1000;
    this.deathProgress = 1 - Math.max(0, this.deathTimer) / 300;
    return this.deathTimer <= 0;
  }

  update(dt: number, tilemap: Tilemap): void {
    if (!this.alive) return;
    this.flashTimer = Math.max(0, this.flashTimer - dt * 1000);
    this.pendingProjectiles = [];

    // Walk animation tick
    this.animTimer += dt * 1000;
    if (this.animTimer >= 200) {
      this.animTimer -= 200;
      this.walkFrame = this.walkFrame === 0 ? 1 : 0;
    }

    const prevX = this.x;

    switch (this.type) {
      case EnemyType.Chaser:    this.updateChaser(dt, tilemap);    break;
      case EnemyType.Patroller: this.updatePatroller(dt, tilemap); break;
      case EnemyType.Shooter:   this.updateShooter(dt, tilemap);   break;
      case EnemyType.Wanderer:  this.updateWanderer(dt, tilemap);  break;
    }

    // Track horizontal facing based on movement
    const dx = this.x - prevX;
    if (Math.abs(dx) > 0.1) {
      this.lastMoveX = dx > 0 ? 1 : -1;
    }
  }

  // ---- Chaser: moves directly toward player ----
  private updateChaser(dt: number, tilemap: Tilemap): void {
    const dx = this.targetX - this.cx;
    const dy = this.targetY - this.cy;
    const dist = Math.sqrt(dx * dx + dy * dy) || 1;
    const nx = dx / dist;
    const ny = dy / dist;

    const moved = tilemap.resolveMovement(this.x, this.y, this.w, this.h, nx * this.speed * dt, ny * this.speed * dt);
    this.x = moved.x;
    this.y = moved.y;
  }

  // ---- Patroller: follows a horizontal path, turns at walls ----
  private updatePatroller(dt: number, tilemap: Tilemap): void {
    const dx = this.patrolDirX * this.speed * dt;
    const moved = tilemap.resolveMovement(this.x, this.y, this.w, this.h, dx, 0);
    // If we didn't move, flip direction
    if (Math.abs(moved.x - this.x) < 0.1) {
      this.patrolDirX *= -1;
    }
    this.x = moved.x;
    this.y = moved.y;
  }

  // ---- Shooter: keeps distance from player, fires projectiles ----
  private updateShooter(dt: number, tilemap: Tilemap): void {
    const dx = this.targetX - this.cx;
    const dy = this.targetY - this.cy;
    const dist = Math.sqrt(dx * dx + dy * dy) || 1;

    // Maintain distance: move away if too close, idle if far
    if (dist < 80) {
      const nx = dx / dist;
      const ny = dy / dist;
      const moved = tilemap.resolveMovement(this.x, this.y, this.w, this.h, -nx * this.speed * dt, -ny * this.speed * dt);
      this.x = moved.x;
      this.y = moved.y;
    }

    this.shootTimer += dt * 1000;
    // Cap timer at cooldown to prevent burst fire after re-approach
    if (this.shootTimer > this.shootCooldown) this.shootTimer = this.shootCooldown;
    if (this.shootTimer >= this.shootCooldown && dist < 200) {
      this.shootTimer = 0;
      const nx = dx / dist;
      const ny = dy / dist;
      this.pendingProjectiles.push(
        new Projectile(this.cx, this.cy, nx, ny, 'enemy', this.projectileDamage)
      );
    }
  }

  // ---- Wanderer: random direction changes, occasionally charges ----
  private updateWanderer(dt: number, tilemap: Tilemap): void {
    this.wanderTimer -= dt;
    if (this.wanderTimer <= 0) {
      // Pick new random direction
      if (Math.random() < 0.3) {
        // Occasionally charge toward player
        const dx = this.targetX - this.cx;
        const dy = this.targetY - this.cy;
        const dist = Math.sqrt(dx * dx + dy * dy) || 1;
        this.wanderDirX = dx / dist;
        this.wanderDirY = dy / dist;
        this.wanderTimer = 0.4;
      } else {
        const angle = Math.random() * Math.PI * 2;
        this.wanderDirX = Math.cos(angle);
        this.wanderDirY = Math.sin(angle);
        this.wanderTimer = 0.8 + Math.random() * 1.5;
      }
    }

    const moved = tilemap.resolveMovement(
      this.x, this.y, this.w, this.h,
      this.wanderDirX * this.speed * dt,
      this.wanderDirY * this.speed * dt,
    );
    // If blocked, pick new direction next frame
    if (Math.abs(moved.x - this.x) < 0.1 && Math.abs(moved.y - this.y) < 0.1) {
      this.wanderTimer = 0;
    }
    this.x = moved.x;
    this.y = moved.y;
  }

  render(ctx: CanvasRenderingContext2D, camera: Camera): void {
    if (!this.alive && !this.isDying) return;

    const sx = Math.round(camera.worldToScreenX(this.x));
    const bob = Math.sin(this.idlePhase + Date.now() * 0.003) * 0.5;
    const sy = Math.round(camera.worldToScreenY(this.y)) + HUD_H + (this.isDying ? 0 : bob);

    const facing = this.lastMoveX >= 0 ? 'right' : 'left';
    const spriteName = `${this.type}_${facing}_${this.walkFrame}`;
    const flashing = this.flashTimer > 0 && (Math.floor(this.flashTimer / 40) % 2 === 0);

    if (this.isDying) {
      const scale = 1 - this.deathProgress * 0.6;
      const alpha = 1 - this.deathProgress;
      const deathFlash = Math.floor(this.deathProgress * 10) % 2 === 0;
      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.translate(sx + this.w / 2, sy + this.h / 2);
      ctx.scale(scale, scale);
      sprites.drawWithFlash(ctx, spriteName, -this.w / 2, -this.h / 2, deathFlash);
      ctx.restore();
      ctx.globalAlpha = 1;
      return;
    }

    sprites.drawWithFlash(ctx, spriteName, sx, sy, flashing);

    // HP indicator (small bar)
    if (this.hp < this.maxHp) {
      const barW = this.w;
      const filled = Math.round((this.hp / this.maxHp) * barW);
      ctx.fillStyle = '#440000';
      ctx.fillRect(sx, sy - 3, barW, 2);
      ctx.fillStyle = '#ff4444';
      ctx.fillRect(sx, sy - 3, filled, 2);
    }
  }
}
