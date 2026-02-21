// Base class for all game entities (Player, Enemy, Boss, Projectile, Pickup).

import { Camera } from './Camera';
import { Tilemap } from './Tilemap';

let nextId = 0;

export abstract class Entity {
  readonly id: number;
  x: number;
  y: number;
  vx = 0;
  vy = 0;
  w: number;
  h: number;
  hp: number;
  maxHp: number;
  alive = true;

  constructor(x: number, y: number, w: number, h: number, hp: number) {
    this.id = nextId++;
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.hp = hp;
    this.maxHp = hp;
  }

  get cx(): number { return this.x + this.w / 2; }
  get cy(): number { return this.y + this.h / 2; }

  distanceTo(ox: number, oy: number): number {
    const dx = this.cx - ox;
    const dy = this.cy - oy;
    return Math.sqrt(dx * dx + dy * dy);
  }

  takeDamage(amount: number): void {
    this.hp = Math.max(0, this.hp - amount);
    if (this.hp === 0) this.alive = false;
  }

  abstract update(dt: number, tilemap: Tilemap): void;
  abstract render(ctx: CanvasRenderingContext2D, camera: Camera): void;
}
