// Simple particle system for hit sparks, death bursts, etc.

import { PARTICLE_LIFETIME_MS } from '../constants';
import { Camera } from './Camera';
import { HUD_H } from '../constants';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;    // 0..1 (1 = just spawned)
  color: string;
  size: number;
}

export class ParticleSystem {
  private particles: Particle[] = [];

  spawn(
    wx: number,
    wy: number,
    count: number,
    color: string,
    speedRange = 60,
    sizeRange = [2, 4],
  ): void {
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * speedRange + 20;
      this.particles.push({
        x: wx,
        y: wy,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 1,
        color,
        size: sizeRange[0]! + Math.random() * (sizeRange[1]! - sizeRange[0]!),
      });
    }
  }

  update(dt: number): void {
    const decay = dt * 1000 / PARTICLE_LIFETIME_MS;
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i]!;
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.vy += 60 * dt; // slight gravity for feel
      p.life -= decay;
      if (p.life <= 0) this.particles.splice(i, 1);
    }
  }

  render(ctx: CanvasRenderingContext2D, camera: Camera): void {
    for (const p of this.particles) {
      const sx = camera.worldToScreenX(p.x);
      const sy = camera.worldToScreenY(p.y) + HUD_H;
      ctx.globalAlpha = p.life;
      ctx.fillStyle = p.color;
      ctx.fillRect(sx - p.size / 2, sy - p.size / 2, p.size, p.size);
    }
    ctx.globalAlpha = 1;
  }

  // ============================================================
  // Fly-to-HUD particles (screen-space)
  // ============================================================
  private flyParticles: FlyParticle[] = [];

  spawnFly(fromX: number, fromY: number, toX: number, toY: number, color: string): void {
    this.flyParticles.push({
      fromX, fromY, toX, toY,
      x: fromX, y: fromY,
      life: 1,
      color,
      size: 4,
    });
  }

  renderFly(ctx: CanvasRenderingContext2D): void {
    for (let i = this.flyParticles.length - 1; i >= 0; i--) {
      const fp = this.flyParticles[i]!;
      // Decay (333ms lifetime)
      fp.life -= (1 / 0.333) * (1 / 60); // approximate per frame
      if (fp.life <= 0) {
        this.flyParticles.splice(i, 1);
        continue;
      }
      const t = 1 - fp.life;
      // Arc toward target
      fp.x = fp.fromX + (fp.toX - fp.fromX) * t;
      fp.y = fp.fromY + (fp.toY - fp.fromY) * t - Math.sin(t * Math.PI) * 20;
      const s = fp.size * fp.life;

      ctx.globalAlpha = fp.life;
      ctx.fillStyle = fp.color;
      ctx.fillRect(fp.x - s / 2, fp.y - s / 2, s, s);
    }
    ctx.globalAlpha = 1;
  }

  clear(): void {
    this.particles = [];
    this.flyParticles = [];
  }
}

interface FlyParticle {
  fromX: number;
  fromY: number;
  toX: number;
  toY: number;
  x: number;
  y: number;
  life: number;
  color: string;
  size: number;
}

// ============================================================
// Screen shake
// ============================================================
export class ScreenShake {
  private intensity = 0;
  private remaining = 0;
  offsetX = 0;
  offsetY = 0;

  trigger(intensity: number, durationMs: number): void {
    this.intensity = intensity;
    this.remaining = durationMs;
  }

  update(dt: number): void {
    if (this.remaining <= 0) {
      this.offsetX = 0;
      this.offsetY = 0;
      return;
    }
    this.remaining -= dt * 1000;
    const scale = this.remaining > 0 ? this.intensity * (this.remaining / 300) : 0;
    this.offsetX = (Math.random() - 0.5) * scale * 2;
    this.offsetY = (Math.random() - 0.5) * scale * 2;
  }
}
