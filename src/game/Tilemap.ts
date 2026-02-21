// Tilemap: parses a ScreenDef tile string array, provides collision queries,
// tile rendering, and special tile interactions (doors, switches, conveyors).

import {
  TILE_SIZE, SCREEN_COLS, SCREEN_ROWS,
  COLOR_FLOOR, CONVEYOR_SPEED, HUD_H,
} from '../constants';
import { TileType, BackgroundPalette } from '../types';
import { Camera } from './Camera';
import { sprites } from '../sprites';

export class Tilemap {
  readonly cols: number;
  readonly rows: number;
  private grid: TileType[][];
  // World origin of this tilemap (top-left of first tile in screen coords)
  readonly originX: number;
  readonly originY: number;

  // Door open state (per-door tile index)
  private openDoors = new Set<number>();

  // Switch activated visual state
  switchActivated = false;

  // Palette name for sprite lookups
  palette: BackgroundPalette = 'deck-a';

  constructor(tileStrings: string[], screenCol: number, screenRow: number) {
    this.cols = SCREEN_COLS;
    this.rows = SCREEN_ROWS;
    this.originX = screenCol * (SCREEN_COLS * TILE_SIZE);
    this.originY = screenRow * (SCREEN_ROWS * TILE_SIZE);

    this.grid = tileStrings.map(row =>
      row.split('').map(ch => ch as TileType)
    );

    // Pad/trim to exact dimensions
    while (this.grid.length < SCREEN_ROWS) {
      this.grid.push(Array(SCREEN_COLS).fill(TileType.Floor));
    }
    this.grid = this.grid.slice(0, SCREEN_ROWS);
    this.grid.forEach((row, r) => {
      while (row.length < SCREEN_COLS) row.push(TileType.Floor);
      this.grid[r] = row.slice(0, SCREEN_COLS);
    });
  }

  getTile(col: number, row: number): TileType {
    if (row < 0 || row >= this.rows || col < 0 || col >= this.cols) {
      return TileType.Wall;
    }
    return this.grid[row]![col]!;
  }

  setTile(col: number, row: number, tile: TileType): void {
    if (row >= 0 && row < this.rows && col >= 0 && col < this.cols) {
      this.grid[row]![col] = tile;
    }
  }

  tileIndex(col: number, row: number): number {
    return row * this.cols + col;
  }

  openDoor(col: number, row: number): void {
    this.openDoors.add(this.tileIndex(col, row));
  }

  /** Open ALL door tiles on this screen */
  openAllDoors(): void {
    for (let r = 0; r < this.rows; r++) {
      for (let c = 0; c < this.cols; c++) {
        if (this.grid[r]![c] === TileType.Door) {
          this.openDoors.add(this.tileIndex(c, r));
        }
      }
    }
  }

  isDoorOpen(col: number, row: number): boolean {
    return this.openDoors.has(this.tileIndex(col, row));
  }

  /** Is this tile solid (blocks movement)? */
  isSolid(col: number, row: number): boolean {
    const t = this.getTile(col, row);
    if (t === TileType.Wall) return true;
    if (t === TileType.Door && !this.openDoors.has(this.tileIndex(col, row))) return true;
    return false;
  }

  isHole(col: number, row: number): boolean {
    return this.getTile(col, row) === TileType.Hole;
  }

  isSpike(col: number, row: number): boolean {
    return this.getTile(col, row) === TileType.Spike;
  }

  isSwitchTile(col: number, row: number): boolean {
    return this.getTile(col, row) === TileType.Switch;
  }

  /** Returns conveyor velocity contribution for an entity standing on this tile */
  conveyorVelocity(col: number, row: number): { vx: number; vy: number } {
    const t = this.getTile(col, row);
    switch (t) {
      case TileType.ConveyorR: return { vx: CONVEYOR_SPEED, vy: 0 };
      case TileType.ConveyorL: return { vx: -CONVEYOR_SPEED, vy: 0 };
      case TileType.ConveyorD: return { vx: 0, vy: CONVEYOR_SPEED };
      case TileType.ConveyorU: return { vx: 0, vy: -CONVEYOR_SPEED };
      default: return { vx: 0, vy: 0 };
    }
  }

  isIce(col: number, row: number): boolean {
    return this.getTile(col, row) === TileType.Ice;
  }

  /**
   * Resolve AABB movement against solid tiles.
   * Moves X then Y independently to allow sliding along walls.
   * Returns the final position after collision resolution.
   */
  resolveMovement(
    x: number, y: number,
    w: number, h: number,
    dx: number, dy: number,
  ): { x: number; y: number } {
    // -- X axis --
    const nx = x + dx;
    if (!this.rectSolid(nx, y, w, h)) {
      x = nx;
    } else {
      // Snap to tile boundary using attempted position (nx) to find the wall
      if (dx > 0) {
        x = Math.floor((nx + w) / TILE_SIZE) * TILE_SIZE - w - 0.01;
      } else if (dx < 0) {
        x = Math.ceil(nx / TILE_SIZE) * TILE_SIZE + 0.01;
      }
    }

    // -- Y axis --
    const ny = y + dy;
    if (!this.rectSolid(x, ny, w, h)) {
      y = ny;
    } else {
      if (dy > 0) {
        y = Math.floor((ny + h) / TILE_SIZE) * TILE_SIZE - h - 0.01;
      } else if (dy < 0) {
        y = Math.ceil(ny / TILE_SIZE) * TILE_SIZE + 0.01;
      }
    }

    return { x, y };
  }

  /** True if the rect overlaps any solid tile */
  private rectSolid(x: number, y: number, w: number, h: number): boolean {
    const ox = this.originX;
    const oy = this.originY;

    const c0 = Math.floor((x - ox) / TILE_SIZE);
    const r0 = Math.floor((y - oy) / TILE_SIZE);
    const c1 = Math.floor((x - ox + w - 0.01) / TILE_SIZE);
    const r1 = Math.floor((y - oy + h - 0.01) / TILE_SIZE);

    for (let r = r0; r <= r1; r++) {
      for (let c = c0; c <= c1; c++) {
        if (this.isSolid(c, r)) return true;
      }
    }
    return false;
  }

  /** Check if entity center is over a hole (used when not jumping) */
  centerIsHole(cx: number, cy: number): boolean {
    const col = Math.floor((cx - this.originX) / TILE_SIZE);
    const row = Math.floor((cy - this.originY) / TILE_SIZE);
    return this.isHole(col, row);
  }

  /** Check if entity rect overlaps a spike tile */
  rectIsSpike(x: number, y: number, w: number, h: number): boolean {
    const ox = this.originX;
    const oy = this.originY;

    const c0 = Math.floor((x - ox) / TILE_SIZE);
    const r0 = Math.floor((y - oy) / TILE_SIZE);
    const c1 = Math.floor((x - ox + w - 0.01) / TILE_SIZE);
    const r1 = Math.floor((y - oy + h - 0.01) / TILE_SIZE);

    for (let r = r0; r <= r1; r++) {
      for (let c = c0; c <= c1; c++) {
        if (this.isSpike(c, r)) return true;
      }
    }
    return false;
  }

  /** World tile column/row for a world-space point */
  worldToTile(wx: number, wy: number): { col: number; row: number } {
    return {
      col: Math.floor((wx - this.originX) / TILE_SIZE),
      row: Math.floor((wy - this.originY) / TILE_SIZE),
    };
  }

  render(ctx: CanvasRenderingContext2D, camera: Camera): void {
    const offX = this.originX - camera.x;
    const offY = this.originY - camera.y + HUD_H;
    const pfx = `tile_${this.palette}_`;
    const now = Date.now();
    const convFrame = Math.floor(now / 200) % 3;
    const spikeFrame = Math.floor(now / 500) % 2;
    const sparkleFrame = Math.floor(now / 250) % 3;

    for (let r = 0; r < this.rows; r++) {
      for (let c = 0; c < this.cols; c++) {
        const tile = this.grid[r]![c]!;
        const px = offX + c * TILE_SIZE;
        const py = offY + r * TILE_SIZE;

        // Skip tiles completely off screen
        if (px > 320 || py > 240 || px < -TILE_SIZE || py < -TILE_SIZE) continue;

        // Conveyors need rotation — draw with canvas transform
        if (tile === TileType.ConveyorL || tile === TileType.ConveyorD || tile === TileType.ConveyorU) {
          const convSprite = `${pfx}conveyor_r_${convFrame}`;
          const cx = px + TILE_SIZE / 2;
          const cy = py + TILE_SIZE / 2;
          ctx.save();
          ctx.translate(cx, cy);
          if (tile === TileType.ConveyorL) ctx.rotate(Math.PI);
          else if (tile === TileType.ConveyorD) ctx.rotate(Math.PI / 2);
          else ctx.rotate(-Math.PI / 2);
          sprites.draw(ctx, convSprite, -TILE_SIZE / 2, -TILE_SIZE / 2);
          ctx.restore();
        } else {
          // Determine which sprite to draw
          const spriteName = this.tileSpriteKey(tile, c, r, pfx, convFrame, spikeFrame);
          if (spriteName) {
            sprites.draw(ctx, spriteName, px, py);
          } else {
            // Fallback for player/boss start tiles — render as floor
            sprites.draw(ctx, `${pfx}floor`, px, py);
          }
        }

        // Crystal sparkle overlay
        if (tile === TileType.Crystal) {
          sprites.draw(ctx, `${pfx}crystal_sparkle_${sparkleFrame}`, px, py);
        }
      }
    }
  }

  private tileSpriteKey(
    tile: TileType, col: number, row: number,
    pfx: string, convFrame: number, spikeFrame: number,
  ): string | null {
    switch (tile) {
      case TileType.Floor: {
        const fHash = ((col * 7 + row * 13) ^ (col + row * 3)) & 0xFF;
        return fHash < 77 ? `${pfx}floor_alt` : `${pfx}floor`;  // ~30% alt
      }
      case TileType.Wall: {
        const wHash = ((col * 11 + row * 17) ^ (col * 3 + row)) & 0xFF;
        return wHash < 51 ? `${pfx}wall_alt` : `${pfx}wall`;  // ~20% alt
      }
      case TileType.Hole:     return `${pfx}hole`;
      case TileType.Spike:    return `${pfx}spike_${spikeFrame}`;
      case TileType.Door:
        return this.isDoorOpen(col, row) ? `${pfx}door_open` : `${pfx}door_closed`;
      case TileType.Switch:   return this.switchActivated ? `${pfx}switch_on` : `${pfx}switch`;
      case TileType.KeySpot:  return `${pfx}key`;
      case TileType.Crystal:  return `${pfx}crystal_0`;
      case TileType.Ice:      return `${pfx}ice`;

      // Conveyors: use the right-facing frame, draw rotated for other dirs
      case TileType.ConveyorR: return `${pfx}conveyor_r_${convFrame}`;
      case TileType.ConveyorL: return `${pfx}conveyor_r_${convFrame}`;
      case TileType.ConveyorD: return `${pfx}conveyor_r_${convFrame}`;
      case TileType.ConveyorU: return `${pfx}conveyor_r_${convFrame}`;

      // Player/boss spawn tiles render as floor
      case TileType.Player:
      case TileType.Boss:
        return null;

      default: return `${pfx}floor`;
    }
  }
}
