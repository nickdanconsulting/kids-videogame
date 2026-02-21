// Player sprite definitions — 14x14 space-suited character.
// 4 directions x (1 idle + 2 walk frames). Left = mirrored from right.

import { SpriteRenderer, Palette } from './SpriteRenderer';
import { PLAYER_PALETTE } from './palettes';

// ============================================================
// Down-facing (toward camera)
// ============================================================
const PLAYER_DOWN_IDLE: string[] = [
  '    HHHHHH    ',
  '   HhVVVVhH   ',
  '  HhVvvvVhHH  ',
  '  HhVEVVEVhH  ',
  '  HhVVVVVVhH  ',
  '   HhhhhhHH   ',
  '   SBBbbBBS   ',
  '  SBBbGbBBbS  ',
  '  SBBbbbbBBS  ',
  '  SABBbbBBAS  ',
  '   ABBbbBBA   ',
  '   SBBbbBBS   ',
  '   LllFFllL   ',
  '   LL    LL   ',
].map(r => r.slice(0, 14));

const PLAYER_DOWN_WALK0: string[] = [
  '     HHHHHH   ',
  '    HhVVVVhH  ',
  '   HhVvvvVhHH ',
  '   HhVEVVEVhH ',
  '   HhVVVVVVhH ',
  '    HhhhhhHH  ',
  '   SBBbbBBS   ',
  '  ABBbGbBBSS  ',
  '   SBbbbbBBS  ',
  '   SBBbbBBaS  ',
  '    ABBbbBB   ',
  '   SBBbbBBS   ',
  '    LlFF llL  ',
  '    L     lL  ',
].map(r => r.slice(0, 14));

const PLAYER_DOWN_WALK1: string[] = [
  '   HHHHHH     ',
  '  HhVVVVhH    ',
  ' HhVvvvVhHH   ',
  ' HhVEVVEVhH   ',
  ' HhVVVVVVhH   ',
  '  HhhhhhHH    ',
  '   SBBbbBBS   ',
  '  SSBBbGbBBA  ',
  '  SBBbbbbBS   ',
  '  SaBBbbBBS   ',
  '   BBbbBBA    ',
  '   SBBbbBBS   ',
  '  Lll FFllL   ',
  '  Ll     L    ',
].map(r => r.slice(0, 14));

// ============================================================
// Up-facing (back to camera)
// ============================================================
const PLAYER_UP_IDLE: string[] = [
  '    HHHHHH    ',
  '   HhhhhhHHH  ',
  '  HhhhhhhhHH  ',
  '  HhhhhhhhHH  ',
  '  HhhhhhhhHH  ',
  '   HhhhhhHH   ',
  '   SBBbbBBS   ',
  '  SBBbbbbBbS  ',
  '  SBBbbbbBBS  ',
  '  SABBbbBBAS  ',
  '   ABBbbBBA   ',
  '   SBBbbBBS   ',
  '   LllFFllL   ',
  '   LL    LL   ',
].map(r => r.slice(0, 14));

const PLAYER_UP_WALK0: string[] = [
  '     HHHHHH   ',
  '    HhhhhhHHH ',
  '   HhhhhhhhHH ',
  '   HhhhhhhhHH ',
  '   HhhhhhhhHH ',
  '    HhhhhhHH  ',
  '   SBBbbBBS   ',
  '  ABBbbbbBbSS ',
  '   SBBbbbbBBS ',
  '   SBBbbBBaS  ',
  '    ABBbbBB   ',
  '   SBBbbBBS   ',
  '    LlFF llL  ',
  '    L     lL  ',
].map(r => r.slice(0, 14));

const PLAYER_UP_WALK1: string[] = [
  '   HHHHHH     ',
  ' HHHhhhhhH    ',
  ' HhhhhhhhH    ',
  ' HhhhhhhhH    ',
  ' HhhhhhhhH    ',
  '  HhhhhhHH    ',
  '   SBBbbBBS   ',
  ' SSBbbbbbBBA  ',
  ' SBBbbbbBBS   ',
  '  SaBBbbBBS   ',
  '   BBbbBBA    ',
  '   SBBbbBBS   ',
  '  Lll FFllL   ',
  '  Ll     L    ',
].map(r => r.slice(0, 14));

// ============================================================
// Right-facing (left sprites will be auto-mirrored)
// ============================================================
const PLAYER_RIGHT_IDLE: string[] = [
  '    HHHHHH    ',
  '   HhhhhVhH   ',
  '  HhhhhhVVhH  ',
  '  HhhhhEVVhH  ',
  '  HhhhhhVVhH  ',
  '   HhhhhhHH   ',
  '   SBBbbBBS   ',
  '  SBBbGbbBbS  ',
  '  SBBbbbbBBS  ',
  '   ABBbbBBAS  ',
  '   ABBbbBBA   ',
  '   SBBbbBBS   ',
  '   LllFFllL   ',
  '   LL    LL   ',
].map(r => r.slice(0, 14));

const PLAYER_RIGHT_WALK0: string[] = [
  '    HHHHHH    ',
  '   HhhhhVhH   ',
  '  HhhhhhVVhH  ',
  '  HhhhhEVVhH  ',
  '  HhhhhhVVhH  ',
  '   HhhhhhHH   ',
  '    SBBbbBBS  ',
  '   ABBbGbbBbS ',
  '   SBBbbbbBBS ',
  '   SBBbbBBaS  ',
  '    ABBbbBB   ',
  '   SBBbbBBS   ',
  '    LlFF llL  ',
  '    L     lL  ',
].map(r => r.slice(0, 14));

const PLAYER_RIGHT_WALK1: string[] = [
  '    HHHHHH    ',
  '   HhhhhVhH   ',
  '  HhhhhhVVhH  ',
  '  HhhhhEVVhH  ',
  '  HhhhhhVVhH  ',
  '   HhhhhhHH   ',
  '  SBBbbBBS    ',
  ' SBbGbbBBBA   ',
  ' SBBbbbbBBS   ',
  '  SaBBbbBBS   ',
  '   BBbbBBA    ',
  '   SBBbbBBS   ',
  '  Lll FFllL   ',
  '  Ll     L    ',
].map(r => r.slice(0, 14));

// ============================================================
// Jump sprites (3 directions, left mirrored from right)
// ============================================================
const PLAYER_DOWN_JUMP: string[] = [
  '    HHHHHH    ',
  '   HhVVVVhH   ',
  '  HhVvvvVhHH  ',
  '  HhVEVVEVhH  ',
  '  HhVVVVVVhH  ',
  '   HhhhhhHH   ',
  '  ASBBbbBBSA  ',
  '  SBBbGbBBbS  ',
  '  SBBbbbbBBS  ',
  '  SSBBbbBBSS  ',
  '   SBBbbBBS   ',
  '   SBBbbBBS   ',
  '    LlLLlL    ',
  '     LLLL     ',
].map(r => r.slice(0, 14));

const PLAYER_UP_JUMP: string[] = [
  '    HHHHHH    ',
  '   HhhhhhHHH  ',
  '  HhhhhhhhHH  ',
  '  HhhhhhhhHH  ',
  '  HhhhhhhhHH  ',
  '   HhhhhhHH   ',
  '  ASBBbbBBSA  ',
  '  SBBbbbbBbS  ',
  '  SBBbbbbBBS  ',
  '  SSBBbbBBSS  ',
  '   SBBbbBBS   ',
  '   SBBbbBBS   ',
  '    LlLLlL    ',
  '     LLLL     ',
].map(r => r.slice(0, 14));

const PLAYER_RIGHT_JUMP: string[] = [
  '    HHHHHH    ',
  '   HhhhhVhH   ',
  '  HhhhhhVVhH  ',
  '  HhhhhEVVhH  ',
  '  HhhhhhVVhH  ',
  '   HhhhhhHH   ',
  '   SBBbbBBSA  ',
  '  SBBbGbbBbA  ',
  '  SBBbbbbBBS  ',
  '   SBBbbBBSS  ',
  '   SBBbbBBS   ',
  '   SBBbbBBS   ',
  '    LlLLlL    ',
  '     LLLL     ',
].map(r => r.slice(0, 14));

// ============================================================
// Blast sprites (3 directions, left mirrored from right)
// ============================================================
const PLAYER_DOWN_BLAST: string[] = [
  '    HHHHHH    ',
  '   HhVVVVhH   ',
  '  HhVvvvVhHH  ',
  '  HhVEVVEVhH  ',
  '  HhVVVVVVhH  ',
  '   HhhhhhHH   ',
  '   SBBbbBBS   ',
  '  SBBbGbBBbS  ',
  '  SBBbbbbBBS  ',
  '  SABBbbBBAS  ',
  '   ABBbbBBA   ',
  '   SBBbbBBS   ',
  '   LllWWllL   ',
  '   LL WW LL   ',
].map(r => r.slice(0, 14));

const PLAYER_UP_BLAST: string[] = [
  '   WHHHHHHW   ',
  '   HhhhhhHHH  ',
  '  HhhhhhhhHH  ',
  '  HhhhhhhhHH  ',
  '  HhhhhhhhHH  ',
  '   HhhhhhHH   ',
  '   SBBbbBBS   ',
  '  SBBbbbbBbS  ',
  '  SBBbbbbBBS  ',
  '  SABBbbBBAS  ',
  '   ABBbbBBA   ',
  '   SBBbbBBS   ',
  '   LllFFllL   ',
  '   LL    LL   ',
].map(r => r.slice(0, 14));

const PLAYER_RIGHT_BLAST: string[] = [
  '    HHHHHH    ',
  '   HhhhhVhH   ',
  '  HhhhhhVVhH  ',
  '  HhhhhEVVhH  ',
  '  HhhhhhVVhH  ',
  '   HhhhhhHH   ',
  '   SBBbbBBSAW ',
  '  SBBbGbbBbAW ',
  '  SBBbbbbBBS  ',
  '   ABBbbBBAS  ',
  '   ABBbbBBA   ',
  '   SBBbbBBS   ',
  '   LllFFllL   ',
  '   LL    LL   ',
].map(r => r.slice(0, 14));

// ============================================================
// Registration
// ============================================================

export function registerPlayerSprites(sr: SpriteRenderer): void {
  reRegisterPlayerSprites(sr, PLAYER_PALETTE);
}

/** Register a preview sprite (idle down) for a character. */
export function registerCharacterPreview(sr: SpriteRenderer, charId: string, palette: Palette): void {
  sr.register(`preview_${charId}`, PLAYER_DOWN_IDLE, palette);
}

/** Re-register all player sprites with a different palette (for character select). */
export function reRegisterPlayerSprites(sr: SpriteRenderer, p: Palette): void {
  // Down
  sr.register('player_down_0', PLAYER_DOWN_IDLE, p);
  sr.register('player_down_1', PLAYER_DOWN_WALK0, p);
  sr.register('player_down_2', PLAYER_DOWN_WALK1, p);

  // Up
  sr.register('player_up_0', PLAYER_UP_IDLE, p);
  sr.register('player_up_1', PLAYER_UP_WALK0, p);
  sr.register('player_up_2', PLAYER_UP_WALK1, p);

  // Right
  sr.register('player_right_0', PLAYER_RIGHT_IDLE, p);
  sr.register('player_right_1', PLAYER_RIGHT_WALK0, p);
  sr.register('player_right_2', PLAYER_RIGHT_WALK1, p);

  // Left = mirrored from right
  sr.registerMirrored('player_left_0', 'player_right_0');
  sr.registerMirrored('player_left_1', 'player_right_1');
  sr.registerMirrored('player_left_2', 'player_right_2');

  // Jump sprites
  sr.register('player_down_jump', PLAYER_DOWN_JUMP, p);
  sr.register('player_up_jump', PLAYER_UP_JUMP, p);
  sr.register('player_right_jump', PLAYER_RIGHT_JUMP, p);
  sr.registerMirrored('player_left_jump', 'player_right_jump');

  // Blast sprites
  sr.register('player_down_blast', PLAYER_DOWN_BLAST, p);
  sr.register('player_up_blast', PLAYER_UP_BLAST, p);
  sr.register('player_right_blast', PLAYER_RIGHT_BLAST, p);
  sr.registerMirrored('player_left_blast', 'player_right_blast');
}
