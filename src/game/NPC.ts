// Non-interactive friendly NPC — stands in place with idle animation.
// Appears randomly at ~35% of levels. No collision, no HP.

import { TILE_SIZE, HUD_H } from '../constants';
import { Camera } from './Camera';
import { drawGlow } from './Effects';
import { sprites } from '../sprites';

export type NPCKind = 'mom' | 'dad';

export class NPC {
  readonly kind: NPCKind;
  readonly x: number;
  readonly y: number;
  readonly w = TILE_SIZE - 2;
  readonly h = TILE_SIZE - 2;
  private breathTimer = Math.random() * Math.PI * 2;
  private heartBob = 0;

  constructor(worldX: number, worldY: number, kind: NPCKind) {
    this.kind = kind;
    this.x = worldX;
    this.y = worldY;
  }

  update(dt: number): void {
    this.breathTimer += dt * 2.5;
    this.heartBob += dt * 4;
  }

  render(ctx: CanvasRenderingContext2D, camera: Camera): void {
    const sx = Math.round(camera.worldToScreenX(this.x));
    const sy = Math.round(camera.worldToScreenY(this.y)) + HUD_H;
    const breathY = Math.sin(this.breathTimer) * 0.7;

    // Soft glow
    drawGlow(ctx, sx + this.w / 2, sy + this.h / 2, 10,
      this.kind === 'mom' ? '#cc66aa' : '#66aa66', 0.08);

    // Sprite
    sprites.draw(ctx, `npc_${this.kind}`, sx, sy + breathY);

    // Floating heart icon above
    const heartY = sy - 8 + Math.sin(this.heartBob) * 1.5;
    sprites.draw(ctx, 'heart_full', sx + 2, heartY);
  }
}
