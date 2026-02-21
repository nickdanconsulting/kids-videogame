// Crystal and Key pickups.

import { TILE_SIZE, HUD_H, CRYSTAL_ENERGY_RESTORE } from '../constants';
import { Camera } from './Camera';
import { drawGlow } from './Effects';
import { Entity } from './Entity';
import { Tilemap } from './Tilemap';
import { sprites } from '../sprites';

export type PickupKind = 'crystal' | 'key';

export class Pickup extends Entity {
  readonly kind: PickupKind;
  private bobPhase: number;

  constructor(worldX: number, worldY: number, kind: PickupKind) {
    super(worldX, worldY, TILE_SIZE - 4, TILE_SIZE - 4, 1);
    this.kind = kind;
    this.bobPhase = Math.random() * Math.PI * 2;
  }

  get energyRestore(): number {
    return this.kind === 'crystal' ? CRYSTAL_ENERGY_RESTORE : 0;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  update(_dt: number, _tilemap: Tilemap): void {
    this.bobPhase += _dt * 3;
  }

  render(ctx: CanvasRenderingContext2D, camera: Camera): void {
    if (!this.alive) return;
    const bob = Math.sin(this.bobPhase) * 2;
    const sx = camera.worldToScreenX(this.x + 2);
    const sy = camera.worldToScreenY(this.y + 2) + HUD_H + bob;
    const cxScreen = sx + this.w / 2;
    const cyScreen = sy + this.h / 2;

    // Pulsing glow halo
    const glowAlpha = 0.08 + Math.sin(this.bobPhase * 2) * 0.075;
    const glowColor = this.kind === 'crystal' ? '#44eeff' : '#ffdd44';
    drawGlow(ctx, cxScreen, cyScreen, 12, glowColor, glowAlpha);

    // Scale pulse
    const scalePulse = 1 + Math.sin(this.bobPhase * 2) * 0.06;
    ctx.save();
    ctx.translate(cxScreen, cyScreen);
    ctx.scale(scalePulse, scalePulse);

    if (this.kind === 'crystal') {
      const sparkleFrame = Math.floor(this.bobPhase * 2) % 3;
      sprites.draw(ctx, `crystal_${sparkleFrame}`, -this.w / 2, -this.h / 2);
    } else {
      sprites.draw(ctx, 'key_pickup', -this.w / 2, -this.h / 2);
    }
    ctx.restore();
  }
}
