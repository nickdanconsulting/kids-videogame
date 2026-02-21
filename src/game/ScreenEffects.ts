// Screen-level visual effects: damage flash, low-HP vignette.

export class ScreenEffects {
  private flashAlpha = 0;
  private vignetteAlpha = 0;
  private transitionAlpha = 0;

  triggerDamageFlash(): void {
    this.flashAlpha = 0.35;
  }

  triggerTransitionFlash(): void {
    this.transitionAlpha = 0.25;
  }

  update(dt: number, playerHp: number, maxHp: number): void {
    // Decay damage flash
    if (this.flashAlpha > 0) {
      this.flashAlpha = Math.max(0, this.flashAlpha - 3 * dt);
    }

    // Decay transition flash
    if (this.transitionAlpha > 0) {
      this.transitionAlpha = Math.max(0, this.transitionAlpha - 2 * dt);
    }

    // Low-HP vignette ramps when HP < 33%
    const hpRatio = playerHp / maxHp;
    const targetVignette = hpRatio < 0.33 ? (1 - hpRatio / 0.33) * 0.4 : 0;
    this.vignetteAlpha += (targetVignette - this.vignetteAlpha) * Math.min(1, 4 * dt);
  }

  render(ctx: CanvasRenderingContext2D, w: number, h: number): void {
    // Damage flash — white overlay
    if (this.flashAlpha > 0.001) {
      ctx.globalAlpha = this.flashAlpha;
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, w, h);
      ctx.globalAlpha = 1;
    }

    // Transition flash — black overlay
    if (this.transitionAlpha > 0.001) {
      ctx.globalAlpha = this.transitionAlpha;
      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, w, h);
      ctx.globalAlpha = 1;
    }

    // Low-HP vignette — red radial at screen edges
    if (this.vignetteAlpha > 0.005) {
      const cx = w / 2;
      const cy = h / 2;
      const r = Math.max(w, h) * 0.7;
      const grad = ctx.createRadialGradient(cx, cy, r * 0.5, cx, cy, r);
      grad.addColorStop(0, 'transparent');
      grad.addColorStop(1, '#ff0000');
      ctx.globalAlpha = this.vignetteAlpha;
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);
      ctx.globalAlpha = 1;
    }
  }
}
