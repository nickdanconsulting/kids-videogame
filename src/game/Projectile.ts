// Player and enemy projectiles with wall collision.

import {
  PROJECTILE_SIZE, PROJECTILE_SPEED_PLAYER, PROJECTILE_SPEED_ENEMY,
  HUD_H, TILE_SIZE,
} from '../constants';
import { Camera } from './Camera';
import { drawGlow } from './Effects';
import { Tilemap } from './Tilemap';
import { sprites } from '../sprites';

export type ProjectileOwner = 'player' | 'enemy';

export class Projectile {
  // Character-specific player projectile colors (set by character select)
  static playerTrailColor = '#44eeff';
  static playerBrightColor = '#88ffff';

  x: number;
  y: number;
  vx: number;
  vy: number;
  readonly w = PROJECTILE_SIZE;
  readonly h = PROJECTILE_SIZE;
  readonly owner: ProjectileOwner;
  readonly damage: number;
  alive = true;

  // Trail ring buffer
  private trail: Array<{ x: number; y: number }> = [];
  private trailIdx = 0;
  private readonly TRAIL_LEN = 5;

  constructor(
    startX: number,
    startY: number,
    dirX: number,
    dirY: number,
    owner: ProjectileOwner,
    damage = 1,
    speedOverride?: number,
  ) {
    this.x = startX;
    this.y = startY;
    this.owner = owner;
    this.damage = damage;

    const speed = speedOverride ?? (owner === 'player' ? PROJECTILE_SPEED_PLAYER : PROJECTILE_SPEED_ENEMY);
    const len = Math.sqrt(dirX * dirX + dirY * dirY) || 1;
    this.vx = (dirX / len) * speed;
    this.vy = (dirY / len) * speed;
  }

  update(dt: number, tilemap: Tilemap): void {
    if (!this.alive) return;

    // Record trail position before moving
    if (this.trail.length < this.TRAIL_LEN) {
      this.trail.push({ x: this.x, y: this.y });
    } else {
      this.trail[this.trailIdx] = { x: this.x, y: this.y };
      this.trailIdx = (this.trailIdx + 1) % this.TRAIL_LEN;
    }

    // Sub-step to prevent tunneling at high speeds
    const steps = Math.max(1, Math.ceil(Math.max(Math.abs(this.vx), Math.abs(this.vy)) * dt / TILE_SIZE));
    const subDt = dt / steps;

    for (let i = 0; i < steps; i++) {
      this.x += this.vx * subDt;
      this.y += this.vy * subDt;

      const col = Math.floor((this.x - tilemap.originX) / TILE_SIZE);
      const row = Math.floor((this.y - tilemap.originY) / TILE_SIZE);
      if (tilemap.isSolid(col, row)) {
        this.alive = false;
        return;
      }
    }

    // Kill if out of bounds (well outside any screen)
    if (this.x < -100 || this.x > 10000 || this.y < -100 || this.y > 10000) {
      this.alive = false;
    }
  }

  overlaps(ex: number, ey: number, ew: number, eh: number): boolean {
    return this.x < ex + ew &&
           this.x + this.w > ex &&
           this.y < ey + eh &&
           this.y + this.h > ey;
  }

  render(ctx: CanvasRenderingContext2D, camera: Camera): void {
    if (!this.alive) return;

    const trailColor = this.owner === 'player' ? Projectile.playerTrailColor : '#ff8833';

    // Draw trail (oldest to newest, fading/shrinking)
    const len = this.trail.length;
    for (let i = 0; i < len; i++) {
      // Walk from oldest to newest
      const idx = (this.trailIdx + i) % len;
      const t = this.trail[idx]!;
      const age = (len - i) / len; // 1 = oldest, ~0 = newest
      const tx = camera.worldToScreenX(t.x) + this.w / 2;
      const ty = camera.worldToScreenY(t.y) + HUD_H + this.h / 2;
      ctx.globalAlpha = (1 - age) * 0.5;
      ctx.fillStyle = trailColor;
      const s = Math.max(1, (1 - age) * 3);
      ctx.fillRect(tx - s / 2, ty - s / 2, s, s);
    }
    ctx.globalAlpha = 1;

    const sx = camera.worldToScreenX(this.x);
    const sy = camera.worldToScreenY(this.y) + HUD_H;

    // Glow halo
    drawGlow(ctx, sx + this.w / 2, sy + this.h / 2, 8, trailColor, 0.2);

    const spriteName = this.owner === 'player' ? 'proj_player' : 'proj_enemy';
    sprites.draw(ctx, spriteName, sx, sy);
  }
}
