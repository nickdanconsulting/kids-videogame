// Entity sprite definitions: enemies, bosses, pickups, projectiles.

import { SpriteRenderer, Palette } from './SpriteRenderer';
import {
  ENEMY_CHASER_PALETTE, ENEMY_PATROLLER_PALETTE,
  ENEMY_SHOOTER_PALETTE, ENEMY_WANDERER_PALETTE,
  BOSS_PALETTE_BASE, BOSS_PALETTE_PHASE2, BOSS_PALETTE_PHASE3,
  CRYSTAL_PALETTE, KEY_PALETTE,
  PROJ_PLAYER_PALETTE, PROJ_ENEMY_PALETTE,
  NPC_MOM_PALETTE, NPC_DAD_PALETTE,
} from './palettes';

// ============================================================
// Enemy sprites — 14x14
// ============================================================

// Chaser: triangular alien, forward-facing eyes, small legs
const CHASER_RIGHT_0: string[] = [
  '     BBBB     ',
  '    BBbbBB    ',
  '   BDHHHDbBB  ',
  '  BBbHbbHbBB  ',
  '  BEeBDbBEeB  ',
  ' BBbDbbbDbdBB ',
  'BBbbHbDbHbbdBB',
  'DBbbDbbbDbBDD ',
  ' DBbbDbDbBD   ',
  '  DBBbbbBBD   ',
  '   DDBBBDD    ',
  '    LlllL     ',
  '   Ll  Ll     ',
  '   L    L     ',
].map(r => r.slice(0, 14));

const CHASER_RIGHT_1: string[] = [
  '     BBBB     ',
  '    BBbbBB    ',
  '   BDHHHDbBB  ',
  '  BBbHbbHbBB  ',
  '  BEeBDbBEeB  ',
  ' BBbDbbbDbdBB ',
  'BBbbHbDbHbbdBB',
  'DBbbDbbbDbBDD ',
  ' DBbbDbDbBD   ',
  '  DBBbbbBBD   ',
  '   DDBBBDD    ',
  '    LlllL     ',
  '    Ll lL     ',
  '     L L      ',
].map(r => r.slice(0, 14));

// Patroller: boxy armored drone
const PATROLLER_RIGHT_0: string[] = [
  '  DDDDDDDDDD  ',
  ' DBBBBBBBBBBd ',
  ' DBbHbbbHbBBd ',
  ' DBbHHHHHbBBd ',
  ' DBbEeeeeEBBd ',
  ' DBbbbPbbbBBd ',
  ' DBBDDDDDBBBd ',
  ' DBBDBBBBDBBD ',
  ' DBbDbbHbDBBd ',
  ' DBBDbbbbDBBd ',
  ' DddDDDDDDDd  ',
  '  LlLLLlLLL   ',
  '  L L   L L   ',
  '              ',
].map(r => r.slice(0, 14));

const PATROLLER_RIGHT_1: string[] = [
  '  DDDDDDDDDD  ',
  ' DBBBBBBBBBBd ',
  ' DBbHbbbHbBBd ',
  ' DBbHHHHHbBBd ',
  ' DBbEeeeeEBBd ',
  ' DBbbbPbbbBBd ',
  ' DBBDDDDDBBBd ',
  ' DBBDBBBBDBBD ',
  ' DBbDbbHbDBBd ',
  ' DBBDbbbbDBBd ',
  ' DddDDDDDDDd  ',
  '   LlLLLlLL   ',
  '   L L  L L   ',
  '              ',
].map(r => r.slice(0, 14));

// Shooter: floating turret with cannon
const SHOOTER_RIGHT_0: string[] = [
  '              ',
  '    BBBBBB    ',
  '   BBbHbbBB   ',
  '  BBbbHHbbBB  ',
  '  BEebbbbBBcCC',
  '  BBbbHbbbBBCcC',
  '   BBbHbbBB   ',
  '    BBBBBB    ',
  '   DDdHddDD   ',
  '  DDdHddHdDD  ',
  '   DdddHddD   ',
  '    DDDDDD    ',
  '              ',
  '              ',
].map(r => r.slice(0, 14));

const SHOOTER_RIGHT_1: string[] = [
  '              ',
  '    BBBBBB    ',
  '   BBbHbbBB   ',
  '  BBbbHHbbBB  ',
  '  BEebbbbBBCcC',
  '  BBbbHbbbBBcCC',
  '   BBbHbbBB   ',
  '    BBBBBB    ',
  '   DDdHddDD   ',
  '   DDdHddHDD  ',
  '    DdddHdD   ',
  '    DDDDDD    ',
  '              ',
  '              ',
].map(r => r.slice(0, 14));

// Wanderer: organic blob with multiple eyes
const WANDERER_RIGHT_0: string[] = [
  '              ',
  '    BBBBBB    ',
  '   BBbTbbBB   ',
  '  BBbEbEbbBB  ',
  '  BbbebeBHbB  ',
  ' BBbtBbbtBbBB ',
  ' BbHbTbTbHbBB ',
  ' BBbtBbbtBbBB ',
  '  BBbbHbbbBB  ',
  '   BBDDbDBB   ',
  '   TtTTTtT    ',
  '  Tt T  Tt    ',
  '  T  T  T     ',
  '              ',
].map(r => r.slice(0, 14));

const WANDERER_RIGHT_1: string[] = [
  '              ',
  '    BBBBBB    ',
  '   BBbTbbBB   ',
  '  BBbEbEbbBB  ',
  '  BbbebeBHbB  ',
  ' BBbtBbbtBbBB ',
  ' BbHbTbTbHbBB ',
  ' BBbtBbbtBbBB ',
  '  BBbbHbbbBB  ',
  '   BBDDbDBB   ',
  '    TtTTtT    ',
  '   Tt  Tt     ',
  '   T    T     ',
  '              ',
].map(r => r.slice(0, 14));

// ============================================================
// Boss sprites — 32x32
// ============================================================

// Turret boss: circular platform with mechanical body
const BOSS_TURRET: string[] = [
  '        BBBBBBBBBBBBBBBB        ',
  '      BBBbbbbbbbbbbbbbBBB       ',
  '    BBBbbbbbbbbbbbbbbbbBBBB     ',
  '   BBbbbbbbbbbbbbbbbbbbbbBB     ',
  '  BBbbbbbbbbbbbbbbbbbbbbbBBB    ',
  '  BBbbbbbbDDDDDDDDbbbbbbbbBB    ',
  ' BBbbbbbDDddMddMddDDbbbbbBBB   ',
  ' BBbbbbDddddddddddddDDbbbbBBB  ',
  ' BBbbbDdddDDddddDDdddDbbbbBB   ',
  'BBbbbDddddDMddddMDdddddbbBBB   ',
  'BBbbDdddddddddddddddddddBBBB  ',
  'BBbbDddddddddGGddddddddDBBBB  ',
  'BBbbDddddddddGGddddddddDBBBB  ',
  'BBbbDdddddddddddddddddddBBBB  ',
  'BBbbbDddddDMddddMDdddddbbBBB   ',
  ' BBbbbDdddDDddddDDdddDbbbbBB   ',
  ' BBbbbbDddddddddddddDDbbbbBBB  ',
  ' BBbbbbbDDddMddMddDDbbbbbBBB   ',
  '  BBbbbbbbDDDDDDDDbbbbbbbbBB    ',
  '  BBbbbbbbbbbbbbbbbbbbbbbBBB    ',
  '   BBbbbbbbbbbbbbbbbbbbbbBB     ',
  '    BBBbbbbbbbbbbbbbbbbBBBB     ',
  '      BBBbbbbbbbbbbbbbBBB       ',
  '        BBBBBBBBBBBBBBBB        ',
  '          AAAAAAAAAA            ',
  '         AaaaaaaaaAAA           ',
  '        AaaaaaaaaaaAA           ',
  '         AaaaaaaaaAAA           ',
  '          AAAAAAAAAA            ',
  '                                ',
  '                                ',
  '                                ',
].map(r => r.slice(0, 32));

// Brute boss: heavy mech with armored body
const BOSS_BRUTE: string[] = [
  '          BBBBBBBBBBBB          ',
  '        BBBbbbbbbbbbBBBB        ',
  '       BBbbbbbbbbbbbbBBBB       ',
  '      BBbbbHHbbbbHHbbbBBB       ',
  '     BBbbbbbbbbbbbbbbbbBBB      ',
  '    BBbbbEebbbbbbbbEebbbBBB     ',
  '    BBbbbbbbbbbbbbbbbbbBBBB     ',
  '   BBBbbbbbbbbbbbbbbbbBBBBB     ',
  '   BBBBBBBBBBBBBBBBBBBBBBB      ',
  '  AADDDDDDDDDDDDDDDDDDDDDDAa   ',
  '  AaaaaaaaaaaaaaaaaaaaaaaAAAa   ',
  ' AAaaMMAaaGGGGGGaAMMaaaaaAAa   ',
  ' AAaaMMaaaaaGGGGaaMMaaaaaAAa    ',
  ' AADDDDDDDDDDDDDDDDDDDDDDAAa   ',
  ' AAaaaaaaaaaaaaaaaaaaaaaaAAa    ',
  ' AAaaaDDaaaDDDDaaaDDaaaaAAa     ',
  '  AAaaaaaDDDddddDDDaaaaaAAa    ',
  '  AAaaaaDddddddddddDaaaaAA     ',
  '   AAaaaDddddddddddDaaaaA      ',
  '   AAaDDaDDDddddDDDaDDaAAA     ',
  '    AAaaaaaaDDDDaaaaaaAAAa      ',
  '    AAaaaaaaaaaaaaaaaaaAAa      ',
  '     AAaaaaaaaaaaaaaaaaAA       ',
  '      AAAAAAAAAAAAAAAAAa        ',
  '       AAAA      AAAA          ',
  '      LLlll    LLlll           ',
  '     LLllll   LLllll           ',
  '     LL  ll   LL  ll           ',
  '     LL  ll   LL  ll           ',
  '     LL       LL               ',
  '                                ',
  '                                ',
].map(r => r.slice(0, 32));

// Blaster boss: sleek angular drone
const BOSS_BLASTER: string[] = [
  '                                ',
  '           BBBBBBBBBB           ',
  '         BBBbbbbbbbbBBB         ',
  '        BBbbbDDDDbbbbbBBBB      ',
  '       BBbbbbbHHbbbbbbbBBB      ',
  '      BBbbbDbbbbbbDbbbbbBBB     ',
  '     BBbbbEebbbbbbbbEebbbBBB   ',
  '     BBbbbbbbbbbbbbbbbbBBBBH   ',
  '    BBbbbbbbbbGGbbbbbbbbbbBB    ',
  '   ccCBBbbbbbGGGGbbbbbbbBBBB   ',
  '  ccCBBBbbbbDbbbbDbbbbbbbBBBB  ',
  ' ccCBBBBBbbbbbbbbbbbbbbbbBBBH  ',
  ' ccCBBBBBbbbbbbbbbbbbbbbbBBBH  ',
  '  ccCBBBbbbbDbbbbDbbbbbbbBBBB  ',
  '   ccCBBbbbbbGGGGbbbbbbbBBBB   ',
  '    BBbbbbbbbbGGbbbbbbbbbbBB    ',
  '     BBbbbbbbbbbbbbbbbbBBBBH   ',
  '     BBbbbDbbbbbbDbbbbBBBB     ',
  '      BBbbbDDDDDDDbbbBBBB      ',
  '       BBbbbbbbbbbbbbbBBB       ',
  '        BBBbbbbbbbbBBBBB        ',
  '         BBBBBBBBBBBBb          ',
  '          BBBBBBBBB             ',
  '            DDDDD              ',
  '           DDdddDD             ',
  '          DDdddddDD            ',
  '           DDdddDD             ',
  '            DDDDD              ',
  '                                ',
  '                                ',
  '                                ',
  '                                ',
].map(r => r.slice(0, 32));

// Summoner boss: cloaked floating form with energy core
const BOSS_SUMMONER: string[] = [
  '          DDDDDDDDDDDD         ',
  '        DDDdddddddddDDDD       ',
  '       DDddDdddddDddddDDDD     ',
  '      DDddddddddddddddDDD      ',
  '     DDddDddddddddddDddDDD     ',
  '     DDddddEebbbbEedddDDDD     ',
  '    DDdddDdddbbbbdDdddddDDD    ',
  '    DDddddddbbbbbbdddddDDD     ',
  '   DDddddDBBGGGGGGBBDddddDD   ',
  '   DDddddBGGGGGGGGGGBdddDD    ',
  '   DDdddBGGGGGGGGGGGGBdddDD   ',
  '   DDddddBGGGGGGGGGGBddddDD   ',
  '   DDddddBGGGGGGGGGGBddddDD   ',
  '   DDdddBGGGGGGGGGGGGBdddDD   ',
  '   DDddddBBGGGGGGGGBBddddDD   ',
  '    DDddddddBBGGBBddddddDD    ',
  '    DDdDddddddBBdddddDddDDD    ',
  '     DDdddddddddddddddDDD      ',
  '     DDddDdddddddddDddDDDD     ',
  '      DDddddddddddddDDDD       ',
  '       DDDddddddddDDDDD        ',
  '        DDDDDDDDDDDDDd          ',
  '          DDDDDDDDD            ',
  '         DDdddddDDD            ',
  '        DDddddddDDD            ',
  '       DDdddddddDDD            ',
  '        DDddddddDD             ',
  '         DDddddDD              ',
  '          DDDDDD               ',
  '                                ',
  '                                ',
  '                                ',
].map(r => r.slice(0, 32));

// ============================================================
// Pickup sprites — 12x12
// ============================================================

// Crystal pickup — faceted gem
const CRYSTAL_0: string[] = [
  '     CC      ',
  '    CccC     ',
  '   CcBBcC    ',
  '  CcBBBBcC   ',
  ' CcBBbBBBcC  ',
  'CcBBbWbBBBcC ',
  ' CcBBbBBBcC  ',
  '  CcBBBBcC   ',
  '   CcBBcC    ',
  '    CccC     ',
  '     CC      ',
  '     GG      ',
].map(r => r.slice(0, 12));

const CRYSTAL_1: string[] = [
  '     CC      ',
  '    CccC     ',
  '   CcBBcC    ',
  '  CcBBBBcC   ',
  ' CcBBBBBBcC  ',
  'CcBBBBbBBBcC ',
  ' CcBBBWBBcC  ',
  '  CcBBBBcC   ',
  '   CcBBcC    ',
  '    CccC     ',
  '     CC      ',
  '     GG      ',
].map(r => r.slice(0, 12));

const CRYSTAL_2: string[] = [
  '     CC      ',
  '    CccC     ',
  '   CcBBcC    ',
  '  CcBBBBcC   ',
  ' CcBBBBBBcC  ',
  'CcBBBBBBBBcC ',
  ' CcBBBbBBcC  ',
  '  CcBBWBcC   ',
  '   CcBBcC    ',
  '    CccC     ',
  '     CC      ',
  '     GG      ',
].map(r => r.slice(0, 12));

// Key pickup — electronic keycard
const KEY_PICKUP: string[] = [
  '  KKKKKKKK   ',
  ' KkBBBBBBkK  ',
  ' KkBbbbbbkK  ',
  ' KkBbGGbbkK  ',
  ' KkBbGGbbkK  ',
  ' KkBbbbbbkK  ',
  ' KkBBBBBBkK  ',
  ' KkBbDDbBkK  ',
  ' KkBbDDbBkK  ',
  ' KkBBBBBBkK  ',
  '  KKKKKKKK   ',
  '            ',
].map(r => r.slice(0, 12));

// ============================================================
// Projectile sprites — 5x5
// ============================================================

const PROJ_PLAYER: string[] = [
  ' CCC ',
  'CBBBC',
  'CBWBC',
  'CBBBC',
  ' CCC ',
];

const PROJ_ENEMY: string[] = [
  ' CCC ',
  'CBBBC',
  'CBWBC',
  'CBBBC',
  ' CCC ',
];

// ============================================================
// NPC sprites — 14x14 (friendly, non-interactive)
// ============================================================

// Mom: dress with apron, warm stance
const NPC_MOM: string[] = [
  '    DDDDDD    ',
  '   DDbbbbDD   ',
  '  DDbEbbEbDD  ',
  '  DDbbbbbbbD  ',
  '   DDbbbDD    ',
  '  AABBbbBBAA  ',
  '  ABBaaBBBBA  ',
  '  ABBaaBBBBA  ',
  '  AABBbbBBAA  ',
  '   SSBBBbSS   ',
  '   SSsBBsSS   ',
  '   SSssssS    ',
  '    LlLlL     ',
  '    L   L     ',
].map(r => r.slice(0, 14));

// Dad: casual shirt, sturdy stance
const NPC_DAD: string[] = [
  '    DDDDDD    ',
  '   DDbbbbDD   ',
  '  DDbEbbEbDD  ',
  '  DDbbbbbbbD  ',
  '   DDbbbbD    ',
  '  AABBbbBBAA  ',
  '  ABBBbBBBBA  ',
  '  ABBBbBBBBA  ',
  '  AABBbbBBAA  ',
  '   SSBBBbSS   ',
  '   SSssssS    ',
  '   SSssssS    ',
  '    LlLlL     ',
  '    L   L     ',
].map(r => r.slice(0, 14));

// ============================================================
// Registration
// ============================================================

export function registerEntitySprites(sr: SpriteRenderer): void {
  // Enemies — register right-facing, then mirror for left
  sr.register('chaser_right_0', CHASER_RIGHT_0, ENEMY_CHASER_PALETTE);
  sr.register('chaser_right_1', CHASER_RIGHT_1, ENEMY_CHASER_PALETTE);
  sr.registerMirrored('chaser_left_0', 'chaser_right_0');
  sr.registerMirrored('chaser_left_1', 'chaser_right_1');

  sr.register('patroller_right_0', PATROLLER_RIGHT_0, ENEMY_PATROLLER_PALETTE);
  sr.register('patroller_right_1', PATROLLER_RIGHT_1, ENEMY_PATROLLER_PALETTE);
  sr.registerMirrored('patroller_left_0', 'patroller_right_0');
  sr.registerMirrored('patroller_left_1', 'patroller_right_1');

  sr.register('shooter_right_0', SHOOTER_RIGHT_0, ENEMY_SHOOTER_PALETTE);
  sr.register('shooter_right_1', SHOOTER_RIGHT_1, ENEMY_SHOOTER_PALETTE);
  sr.registerMirrored('shooter_left_0', 'shooter_right_0');
  sr.registerMirrored('shooter_left_1', 'shooter_right_1');

  sr.register('wanderer_right_0', WANDERER_RIGHT_0, ENEMY_WANDERER_PALETTE);
  sr.register('wanderer_right_1', WANDERER_RIGHT_1, ENEMY_WANDERER_PALETTE);
  sr.registerMirrored('wanderer_left_0', 'wanderer_right_0');
  sr.registerMirrored('wanderer_left_1', 'wanderer_right_1');

  // Bosses — 3 phase variants each
  sr.register('boss_turret_p1', BOSS_TURRET, BOSS_PALETTE_BASE);
  sr.registerVariant('boss_turret_p2', BOSS_TURRET, BOSS_PALETTE_PHASE2);
  sr.registerVariant('boss_turret_p3', BOSS_TURRET, BOSS_PALETTE_PHASE3);

  sr.register('boss_brute_p1', BOSS_BRUTE, BOSS_PALETTE_BASE);
  sr.registerVariant('boss_brute_p2', BOSS_BRUTE, BOSS_PALETTE_PHASE2);
  sr.registerVariant('boss_brute_p3', BOSS_BRUTE, BOSS_PALETTE_PHASE3);

  sr.register('boss_blaster_p1', BOSS_BLASTER, BOSS_PALETTE_BASE);
  sr.registerVariant('boss_blaster_p2', BOSS_BLASTER, BOSS_PALETTE_PHASE2);
  sr.registerVariant('boss_blaster_p3', BOSS_BLASTER, BOSS_PALETTE_PHASE3);

  sr.register('boss_summoner_p1', BOSS_SUMMONER, BOSS_PALETTE_BASE);
  sr.registerVariant('boss_summoner_p2', BOSS_SUMMONER, BOSS_PALETTE_PHASE2);
  sr.registerVariant('boss_summoner_p3', BOSS_SUMMONER, BOSS_PALETTE_PHASE3);

  // Pickups
  sr.register('crystal_0', CRYSTAL_0, CRYSTAL_PALETTE);
  sr.register('crystal_1', CRYSTAL_1, CRYSTAL_PALETTE);
  sr.register('crystal_2', CRYSTAL_2, CRYSTAL_PALETTE);
  sr.register('key_pickup', KEY_PICKUP, KEY_PALETTE);

  // Projectiles
  sr.register('proj_player', PROJ_PLAYER, PROJ_PLAYER_PALETTE);
  sr.register('proj_enemy', PROJ_ENEMY, PROJ_ENEMY_PALETTE);

  // NPCs
  sr.register('npc_mom', NPC_MOM, NPC_MOM_PALETTE);
  sr.register('npc_dad', NPC_DAD, NPC_DAD_PALETTE);
}

/** Re-register player projectile sprite with character-specific colors. */
export function reRegisterPlayerProjectile(sr: SpriteRenderer, color: string, bright: string): void {
  const palette: Palette = { 'C': color, 'B': bright, 'W': '#ffffff' };
  sr.register('proj_player', PROJ_PLAYER, palette);
}
