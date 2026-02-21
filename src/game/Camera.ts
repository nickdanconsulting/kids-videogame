// Screen-grid camera with Pokémon-style room transitions.
// The world is divided into screens. When the player crosses an edge,
// the camera tweens to the next screen over CAM_TRANSITION_MS.

import { CAM_TRANSITION_MS, PLAY_W, PLAY_H } from '../constants';

export class Camera {
  // Current logical screen position (top-left world px)
  x = 0;
  y = 0;

  // Which screen grid cell is currently "active"
  screenRow = 0;
  screenCol = 0;

  // Transition state
  isTransitioning = false;
  private elapsed = 0;
  private fromX = 0;
  private fromY = 0;
  private toX = 0;
  private toY = 0;

  // Previous screen (needed for dual-screen render during transition)
  prevRow = 0;
  prevCol = 0;

  setScreen(row: number, col: number): void {
    this.screenRow = row;
    this.screenCol = col;
    this.x = col * PLAY_W;
    this.y = row * PLAY_H;
    this.isTransitioning = false;
  }

  beginTransition(toRow: number, toCol: number): void {
    if (this.isTransitioning) return;

    this.prevRow = this.screenRow;
    this.prevCol = this.screenCol;

    this.fromX = this.x;
    this.fromY = this.y;
    this.toX = toCol * PLAY_W;
    this.toY = toRow * PLAY_H;

    this.screenRow = toRow;
    this.screenCol = toCol;

    this.isTransitioning = true;
    this.elapsed = 0;
  }

  update(dt: number): void {
    if (!this.isTransitioning) return;

    this.elapsed += dt * 1000; // convert to ms
    const t = Math.min(this.elapsed / CAM_TRANSITION_MS, 1);
    const eased = easeInOutCubic(t);

    this.x = lerp(this.fromX, this.toX, eased);
    this.y = lerp(this.fromY, this.toY, eased);

    if (t >= 1) {
      this.x = this.toX;
      this.y = this.toY;
      this.isTransitioning = false;
    }
  }

  /** World-to-screen: convert a world-space X to canvas X */
  worldToScreenX(wx: number): number {
    return wx - this.x;
  }

  worldToScreenY(wy: number): number {
    return wy - this.y;
  }
}

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}
