// Sprite system singleton and initialization.

import { SpriteRenderer } from './SpriteRenderer';
import { registerTileSprites } from './tileSprites';
import { registerPlayerSprites, registerCharacterPreview } from './playerSprites';
import { registerEntitySprites } from './entitySprites';
import { registerUISprites } from './uiSprites';
import { CHARACTERS } from '../data/characters';

export const sprites = new SpriteRenderer();

/** Call once before game.start() to bake all sprites to OffscreenCanvas. */
export function initAllSprites(): void {
  registerTileSprites(sprites);
  registerPlayerSprites(sprites);
  registerEntitySprites(sprites);
  registerUISprites(sprites);

  // Character select preview sprites
  for (const char of CHARACTERS) {
    registerCharacterPreview(sprites, char.id, char.palette);
  }
}
