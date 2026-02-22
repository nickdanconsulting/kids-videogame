// Entry point: set up canvas, scale to fit screen, start game.

import { VIRTUAL_W, VIRTUAL_H } from './constants';
import { Game } from './game/Game';
import { initAllSprites } from './sprites';

const canvas = document.getElementById('game-canvas') as HTMLCanvasElement;
if (!canvas) throw new Error('Canvas element not found');

// Set the virtual (logical) resolution
canvas.width  = VIRTUAL_W;
canvas.height = VIRTUAL_H;

// 2D context — disable anti-aliasing for pixel art
const ctx = canvas.getContext('2d')!;
ctx.imageSmoothingEnabled = false;

// Scale canvas CSS size to fill the window while preserving aspect ratio
function resize(): void {
  const scaleX = window.innerWidth  / VIRTUAL_W;
  const scaleY = window.innerHeight / VIRTUAL_H;
  const scale  = Math.min(scaleX, scaleY);

  const finalScale = scale;

  canvas.style.width  = `${VIRTUAL_W  * finalScale}px`;
  canvas.style.height = `${VIRTUAL_H * finalScale}px`;
}

window.addEventListener('resize', resize);
resize();

// Bake all sprites to OffscreenCanvas before starting
initAllSprites();

// Start the game
const game = new Game(ctx, canvas);
game.start();
