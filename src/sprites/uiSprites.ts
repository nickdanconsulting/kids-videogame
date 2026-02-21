// UI sprite definitions: hearts, energy bar pieces, HUD icons,
// title banner, 9-patch border, menu elements.

import { SpriteRenderer } from './SpriteRenderer';
import {
  HEART_FULL_PALETTE, HEART_EMPTY_PALETTE,
  UI_PALETTE, CRYSTAL_PALETTE, KEY_PALETTE,
} from './palettes';

// ============================================================
// Hearts — 9x10
// ============================================================

const HEART_FULL: string[] = [
  ' OOO OOO ',
  'ORRRORRRo',
  'ORRRHRRRO',
  'ORRRRRRRO',
  'ORRRRRRRo',
  ' ORRRRRO ',
  ' ORRRRRo ',
  '  ORRRO  ',
  '  ORRRO  ',
  '   OOO   ',
];

const HEART_EMPTY: string[] = [
  ' OOO OOO ',
  'ODDDODDDO',
  'ODDDDDDDО',
  'ODDDDDDDО',
  'ODDDDDDDО',
  ' ODDDDDО ',
  ' ODDDDDО ',
  '  ODDDO  ',
  '  ODDDO  ',
  '   OOO   ',
];

// ============================================================
// Energy bar pieces — 3x6 caps + 1x6 segment
// ============================================================

const ENERGY_CAP_L: string[] = [
  'BBB',
  'Bbb',
  'Bbb',
  'Bbb',
  'Bbb',
  'BBB',
];

const ENERGY_CAP_R: string[] = [
  'BBB',
  'bbB',
  'bbB',
  'bbB',
  'bbB',
  'BBB',
];

// ============================================================
// HUD icons
// ============================================================

// Crystal icon for HUD counter (7x7)
const HUD_CRYSTAL: string[] = [
  '   C   ',
  '  CcC  ',
  ' CcBcC ',
  'CcBWBcC',
  ' CcBcC ',
  '  CcC  ',
  '   C   ',
];

// Key icon for HUD (7x5)
const HUD_KEY: string[] = [
  ' KKK KK',
  'KkBkKkK',
  'KBBBBbK',
  'KkBkKkK',
  ' KKK KK',
];

// ============================================================
// HUD background tile (16x16)
// ============================================================

const HUD_BG: string[] = [
  'NNNNNNNNNNNNNNNN',
  'GGGGGGGGGGGGGGGG',
  'GGGGGGGGGGGGGGGG',
  'GGGGGGGGGGGGGGGG',
  'GGGGGGGGGGGGGGGG',
  'GGGGGGGGGGGGGGGG',
  'GGGGGGGGGGGGGGGG',
  'GGGGGGGGGGGGGGGG',
  'GGGGGGGGGGGGGGGG',
  'GGGGGGGGGGGGGGGG',
  'GGGGGGGGGGGGGGGG',
  'GGGGGGGGGGGGGGGG',
  'GGGGGGGGGGGGGGGG',
  'GGGGGGGGGGGGGGGG',
  'GGGGGGGGGGGGGGGD',
  'DDDDDDDDDDDDDDDD',
].map(r => r.slice(0, 16));

// ============================================================
// 9-patch border pieces (8x8 corners + 8x1 edges)
// ============================================================

const BORDER_TL: string[] = [
  'HHHHHHHH',
  'HhhhhhHh',
  'HhBBBBhH',
  'HhBBBBhH',
  'HhBBBBhH',
  'HhBBBBhH',
  'HhBBBBhH',
  'HhBBBBhH',
];

const BORDER_TR: string[] = [
  'HHHHHHHH',
  'hHhhhhhH',
  'HhBBBBhH',
  'HhBBBBhH',
  'HhBBBBhH',
  'HhBBBBhH',
  'HhBBBBhH',
  'HhBBBBhH',
];

const BORDER_BL: string[] = [
  'HhBBBBhH',
  'HhBBBBhH',
  'HhBBBBhH',
  'HhBBBBhH',
  'HhBBBBhH',
  'HhBBBBhH',
  'HhhhhhHh',
  'HHHHHHHH',
];

const BORDER_BR: string[] = [
  'HhBBBBhH',
  'HhBBBBhH',
  'HhBBBBhH',
  'HhBBBBhH',
  'HhBBBBhH',
  'HhBBBBhH',
  'hHhhhhhH',
  'HHHHHHHH',
];

const BORDER_T: string[] = [
  'HHHHHHHH',
  'hhhhhhhh',
  'BBBBBBBB',
  'BBBBBBBB',
  'BBBBBBBB',
  'BBBBBBBB',
  'BBBBBBBB',
  'BBBBBBBB',
];

const BORDER_B: string[] = [
  'BBBBBBBB',
  'BBBBBBBB',
  'BBBBBBBB',
  'BBBBBBBB',
  'BBBBBBBB',
  'BBBBBBBB',
  'hhhhhhhh',
  'HHHHHHHH',
];

const BORDER_L: string[] = [
  'HhBBBBBB',
  'HhBBBBBB',
  'HhBBBBBB',
  'HhBBBBBB',
  'HhBBBBBB',
  'HhBBBBBB',
  'HhBBBBBB',
  'HhBBBBBB',
];

const BORDER_R: string[] = [
  'BBBBBBhH',
  'BBBBBBhH',
  'BBBBBBhH',
  'BBBBBBhH',
  'BBBBBBhH',
  'BBBBBBhH',
  'BBBBBBhH',
  'BBBBBBhH',
];

// ============================================================
// Menu arrow cursor (5x7)
// ============================================================
const MENU_ARROW: string[] = [
  'H    ',
  'HH   ',
  'HhH  ',
  'HhhH ',
  'HhH  ',
  'HH   ',
  'H    ',
];

// ============================================================
// Title "ABEL" banner — pixel art (~80x12)
// ============================================================
const TITLE_ABEL: string[] = [
  '   HH   HHHH  HHHHH HH     ',
  '  HhhH  HhhhH HhhhhHHhH    ',
  ' Hh  hH Hh  hHHh    Hh     ',
  'Hh    hHHh  hHHh    Hh     ',
  'HhhhhhHHHhhhH HhhhH Hh     ',
  'HhhhhhHHHhhhH HhhhH Hh     ',
  'Hh    hHHh  hHHh    Hh     ',
  'Hh    hHHh  hHHh    Hh     ',
  'Hh    hHHhhhH HhhhhHHhhhhH ',
  'Hh    hHHHHH  HHHHH HHHHH  ',
  '                            ',
  '                            ',
].map(r => r.slice(0, 29));

// ============================================================
// "GAME OVER" banner (~80x10)
// ============================================================
const GAME_OVER_BANNER: string[] = [
  ' HHH   HH  Hh   hH HHHHH    HH  Hh   hH HHHHH HHHH  ',
  'Hh hH HhhH HhH HhH Hh       hh  Hh   hH Hh    Hh hH ',
  'Hh    Hh hHHh HhHhH Hh      Hh hHHh   hH Hh    Hh  hH',
  'Hh HHHhh hHHh   hHH HhhhH   Hh hHHh   hH HhhhH HhhhH ',
  'Hh  hHhhhhHHh   hHH Hh      Hh hH Hh hHH Hh    HhhhH ',
  'Hh  hHhh hHHh   hHH Hh      Hh hH Hh hHH Hh    Hh hH ',
  ' HHHHHh   hHh   hHH HHHHH    HHH   HhHH  HHHHH Hh  hH',
  '                                                        ',
].map(r => r.slice(0, 55));

// ============================================================
// Registration
// ============================================================

export function registerUISprites(sr: SpriteRenderer): void {
  sr.register('heart_full', HEART_FULL, HEART_FULL_PALETTE);
  sr.register('heart_empty', HEART_EMPTY, HEART_EMPTY_PALETTE);

  sr.register('energy_cap_l', ENERGY_CAP_L, UI_PALETTE);
  sr.register('energy_cap_r', ENERGY_CAP_R, UI_PALETTE);

  sr.register('hud_crystal', HUD_CRYSTAL, CRYSTAL_PALETTE);
  sr.register('hud_key', HUD_KEY, KEY_PALETTE);
  sr.register('hud_bg', HUD_BG, UI_PALETTE);

  // 9-patch border
  sr.register('border_tl', BORDER_TL, UI_PALETTE);
  sr.register('border_tr', BORDER_TR, UI_PALETTE);
  sr.register('border_bl', BORDER_BL, UI_PALETTE);
  sr.register('border_br', BORDER_BR, UI_PALETTE);
  sr.register('border_t', BORDER_T, UI_PALETTE);
  sr.register('border_b', BORDER_B, UI_PALETTE);
  sr.register('border_l', BORDER_L, UI_PALETTE);
  sr.register('border_r', BORDER_R, UI_PALETTE);

  sr.register('menu_arrow', MENU_ARROW, UI_PALETTE);

  sr.register('title_abel', TITLE_ABEL, UI_PALETTE);
  sr.register('game_over_banner', GAME_OVER_BANNER, {
    'H': '#ff3333', 'h': '#cc1111',
  });
}
