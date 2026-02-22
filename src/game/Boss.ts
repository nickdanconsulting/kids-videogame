// Four boss templates: Turret, Brute, Blaster, Summoner.
// Boss behavior is data-driven via BossParams from the level definition.

import {
  TILE_SIZE, HUD_H,
} from '../constants';
import { BossParams, BossType, EnemyType } from '../types';
import { Camera } from './Camera';
import { drawGlow } from './Effects';
import { Entity } from './Entity';
import { Enemy } from './Enemy';
import { ParticleSystem, ScreenShake } from './Particle';
import { Projectile } from './Projectile';
import { Tilemap } from './Tilemap';
import { sprites } from '../sprites';

export class Boss extends Entity {
  readonly bossType: BossType;
  private params: BossParams;
  private scale: number;
  readonly contactDamage: number;

  // Behavior state
  private phase = 1;
  private stateTimer = 0;
  private idleTimer = 0;
  phaseChanged = false;
  private shootTimer = 0;
  private spawnTimer = 0;
  private chargeDir = { x: 0, y: 0 };
  private isCharging = false;
  private chargeDuration = 0;
  private barrelAngle = 0;

  // Target position (set externally)
  targetX = 0;
  targetY = 0;

  // Flash on hit
  flashTimer = 0;

  // Outputs produced this frame
  pendingProjectiles: Projectile[] = [];
  pendingSpawns: Enemy[] = [];

  private particles: ParticleSystem;
  private shake: ScreenShake;

  constructor(
    worldX: number,
    worldY: number,
    bossType: BossType,
    params: BossParams,
    enemyScale: number,
    particles: ParticleSystem,
    shake: ScreenShake,
  ) {
    // Boss is 2x2 tiles
    super(worldX, worldY, TILE_SIZE * 2, TILE_SIZE * 2, params.hp);
    this.bossType = bossType;
    this.params = params;
    this.scale = enemyScale;
    this.contactDamage = params.contactDamage ?? 1;
    this.particles = particles;
    this.shake = shake;
  }

  override takeDamage(amount: number): void {
    const oldPhase = this.phase;
    super.takeDamage(amount);
    this.flashTimer = 120;
    this.particles.spawn(this.cx, this.cy, 8, '#ff4466', 80);
    this.shake.trigger(4, 200);

    // Phase transition
    if (this.params.phases >= 2 && this.hp <= Math.floor(this.maxHp * 0.5) && oldPhase < 2) {
      this.phase = 2;
      this.phaseChanged = true;
      this.particles.spawn(this.cx, this.cy, 20, '#ff8800', 120);
      this.shake.trigger(8, 400);
    }
    if (this.params.phases >= 3 && this.hp <= Math.floor(this.maxHp * 0.25) && oldPhase < 3) {
      this.phase = 3;
      this.phaseChanged = true;
      this.particles.spawn(this.cx, this.cy, 30, '#ffcc00', 150);
      this.shake.trigger(12, 600);
    }
  }

  update(dt: number, tilemap: Tilemap): void {
    if (!this.alive) return;
    this.flashTimer = Math.max(0, this.flashTimer - dt * 1000);
    this.stateTimer += dt * 1000;
    this.idleTimer += dt;
    this.pendingProjectiles = [];
    this.pendingSpawns = [];

    const phaseSpeed = this.params.speed * (1 + (this.phase - 1) * 0.25);
    const phaseCooldown = this.params.shootCooldown / (1 + (this.phase - 1) * 0.2);

    switch (this.bossType) {
      case BossType.Turret:   this.updateTurret(dt, phaseCooldown);              break;
      case BossType.Brute:    this.updateBrute(dt, tilemap, phaseSpeed);          break;
      case BossType.Blaster:  this.updateBlaster(dt, tilemap, phaseSpeed, phaseCooldown); break;
      case BossType.Summoner: this.updateSummoner(dt, tilemap, phaseSpeed, phaseCooldown); break;
    }
  }

  // ---- TURRET: stationary, fires rotating barrels ----
  private updateTurret(dt: number, cooldown: number): void {
    const numBarrels = this.params.numBarrels ?? 2;
    const angularSpeed = (0.8 + (this.phase - 1) * 0.4) * dt; // faster in later phases
    this.barrelAngle += angularSpeed;

    this.shootTimer += dt * 1000;
    if (this.shootTimer >= cooldown) {
      this.shootTimer = 0;
      // Fire from each barrel
      for (let i = 0; i < numBarrels; i++) {
        const angle = this.barrelAngle + (i * Math.PI * 2) / numBarrels;
        this.pendingProjectiles.push(
          new Projectile(this.cx, this.cy, Math.cos(angle), Math.sin(angle), 'enemy', 1)
        );
      }
      // Phase 3: also fire between barrels
      if (this.phase >= 3 && numBarrels >= 4) {
        for (let i = 0; i < numBarrels; i++) {
          const angle = this.barrelAngle + (i * Math.PI * 2) / numBarrels + Math.PI / numBarrels;
          this.pendingProjectiles.push(
            new Projectile(this.cx, this.cy, Math.cos(angle), Math.sin(angle), 'enemy', 1)
          );
        }
      }
    }
  }

  // ---- BRUTE: charges at player, then rests ----
  private updateBrute(dt: number, tilemap: Tilemap, speed: number): void {
    if (this.isCharging) {
      this.chargeDuration -= dt * 1000;
      const moved = tilemap.resolveMovement(
        this.x, this.y, this.w, this.h,
        this.chargeDir.x * speed * dt * 1.2,
        this.chargeDir.y * speed * dt * 1.2,
      );
      const blocked = Math.abs(moved.x - this.x) < 0.1 && Math.abs(moved.y - this.y) < 0.1;
      this.x = moved.x;
      this.y = moved.y;

      if (this.chargeDuration <= 0 || blocked) {
        this.isCharging = false;
        this.stateTimer = 0;
        if (blocked) this.particles.spawn(this.cx, this.cy, 10, '#ff8800', 80);
      }
    } else {
      // Telegraph then charge
      const telegraphTime = 1000 - (this.phase - 1) * 150;
      if (this.stateTimer >= telegraphTime) {
        // Aim at player and charge
        const dx = this.targetX - this.cx;
        const dy = this.targetY - this.cy;
        const dist = Math.sqrt(dx * dx + dy * dy) || 1;
        this.chargeDir = { x: dx / dist, y: dy / dist };
        this.isCharging = true;
        this.chargeDuration = 600;
        this.stateTimer = 0;
      }
    }
  }

  // ---- BLASTER: moves + shoots player with spread ----
  private updateBlaster(dt: number, tilemap: Tilemap, speed: number, cooldown: number): void {
    // Circle-strafe around player
    const dx = this.targetX - this.cx;
    const dy = this.targetY - this.cy;
    const dist = Math.sqrt(dx * dx + dy * dy) || 1;
    const targetDist = 100;

    let mvx = 0;
    let mvy = 0;
    if (dist > targetDist + 10) {
      mvx = (dx / dist) * speed;
      mvy = (dy / dist) * speed;
    } else if (dist < targetDist - 10) {
      mvx = -(dx / dist) * speed;
      mvy = -(dy / dist) * speed;
    } else {
      // Strafe perpendicular
      mvx = (-dy / dist) * speed * 0.6;
      mvy = (dx / dist) * speed * 0.6;
    }

    const moved = tilemap.resolveMovement(this.x, this.y, this.w, this.h, mvx * dt, mvy * dt);
    this.x = moved.x;
    this.y = moved.y;

    // Shoot
    this.shootTimer += dt * 1000;
    if (this.shootTimer >= cooldown) {
      this.shootTimer = 0;
      const nx = dx / dist;
      const ny = dy / dist;

      // Phase 1: single shot; Phase 2: triple spread; Phase 3: 5-way
      const spreadCount = this.phase === 1 ? 1 : this.phase === 2 ? 3 : 5;
      const spreadAngle = Math.PI / 8;
      const baseAngle = Math.atan2(ny, nx);

      for (let i = 0; i < spreadCount; i++) {
        const offset = spreadCount > 1
          ? (i - Math.floor(spreadCount / 2)) * spreadAngle
          : 0;
        const angle = baseAngle + offset;
        this.pendingProjectiles.push(
          new Projectile(this.cx, this.cy, Math.cos(angle), Math.sin(angle), 'enemy', 1)
        );
      }
    }
  }

  // ---- SUMMONER: spawns minions + fires bullet rings ----
  private updateSummoner(dt: number, tilemap: Tilemap, speed: number, cooldown: number): void {
    // Slow drift toward player
    const dx = this.targetX - this.cx;
    const dy = this.targetY - this.cy;
    const dist = Math.sqrt(dx * dx + dy * dy) || 1;

    if (dist > 90) {
      const moved = tilemap.resolveMovement(
        this.x, this.y, this.w, this.h,
        (dx / dist) * speed * 0.4 * dt,
        (dy / dist) * speed * 0.4 * dt,
      );
      this.x = moved.x;
      this.y = moved.y;
    }

    // Fire bullet ring
    this.shootTimer += dt * 1000;
    if (this.shootTimer >= cooldown) {
      this.shootTimer = 0;
      const ringCount = 5 + (this.phase - 1) * 2;
      for (let i = 0; i < ringCount; i++) {
        const angle = (i / ringCount) * Math.PI * 2 + this.stateTimer * 0.001;
        this.pendingProjectiles.push(
          new Projectile(this.cx, this.cy, Math.cos(angle), Math.sin(angle), 'enemy', 1, 80)
        );
      }
    }

    // Spawn minions
    const spawnRate = (this.params.spawnRate ?? 5000) / (1 + (this.phase - 1) * 0.25);
    this.spawnTimer += dt * 1000;
    if (this.spawnTimer >= spawnRate) {
      this.spawnTimer = 0;
      const count = this.phase;
      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const spawnX = this.cx + Math.cos(angle) * 48;
        const spawnY = this.cy + Math.sin(angle) * 48;
        this.pendingSpawns.push(
          new Enemy(spawnX, spawnY, this.params.spawnType ?? EnemyType.Chaser, this.scale, this.particles)
        );
      }
    }
  }

  render(ctx: CanvasRenderingContext2D, camera: Camera): void {
    if (!this.alive) return;

    const sx = Math.round(camera.worldToScreenX(this.x));
    const idleBob = Math.sin(this.idleTimer * 2.5) * 1.5;
    const sy = Math.round(camera.worldToScreenY(this.y)) + HUD_H + idleBob;
    const w = this.w;

    const flashing = this.flashTimer > 0 && (Math.floor(this.flashTimer / 50) % 2 === 0);
    const spriteName = `boss_${this.bossType}_p${this.phase}`;

    // Core glow (scales with phase)
    drawGlow(ctx, sx + w / 2, sy + w / 2, 20, '#ff4466', 0.1 * this.phase);

    sprites.drawWithFlash(ctx, spriteName, sx, sy, flashing);

    // Turret: draw rotating barrel indicators on top of sprite
    if (this.bossType === BossType.Turret) {
      const numBarrels = this.params.numBarrels ?? 2;
      ctx.fillStyle = '#cc2244';
      for (let i = 0; i < numBarrels; i++) {
        const angle = this.barrelAngle + (i * Math.PI * 2) / numBarrels;
        const bx = sx + w / 2 + Math.cos(angle) * 10;
        const by = sy + w / 2 + Math.sin(angle) * 10;
        ctx.fillRect(bx - 2, by - 2, 4, 4);
      }
    }

    // HP bar
    const barW = w;
    const filled = Math.round((this.hp / this.maxHp) * barW);
    ctx.fillStyle = '#330000';
    ctx.fillRect(sx, sy - 4, barW, 3);
    ctx.fillStyle = '#ff2244';
    ctx.fillRect(sx, sy - 4, filled, 3);
    ctx.fillStyle = '#ff8899';
    ctx.fillRect(sx, sy - 4, Math.min(filled, 2), 3);
  }
}
