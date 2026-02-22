// Palette definitions for all sprite categories.
// Each palette maps single characters to hex colors.

import { Palette } from './SpriteRenderer';

// ============================================================
// Tile palettes — one per BackgroundPalette theme
// ============================================================

// Character legend for tile sprites:
// W=wall-dark  w=wall-mid  M=mortar  F=floor-dark  f=floor-mid  g=floor-light(grid)
// R=rivet  H=hole-edge  h=hole-inner  S=spike-base  s=spike-tip  r=spike-red
// D=door-dark  d=door-mid  L=door-line  K=key-dark  k=key-light  Y=key-yellow
// C=crystal-dark  c=crystal-mid  B=crystal-bright  b=crystal-glow
// T=switch-dark  t=switch-light  G=switch-green  P=panel  p=panel-light
// V=conveyor-dark  v=conveyor-mid  A=conveyor-arrow
// I=ice-dark  i=ice-mid  j=ice-shine  J=ice-bright

export const TILE_PALETTE_DECK_A: Palette = {
  'W': '#12123a', 'w': '#1a1a4a', 'M': '#0a0a28',
  'F': '#0e0e22', 'f': '#121230', 'g': '#161638',
  'R': '#2a2a50',
  'H': '#080818', 'h': '#000008', 'X': '#040410',
  'S': '#550000', 's': '#cc3333', 'r': '#ff6666', 'Q': '#881111',
  'D': '#1a3344', 'd': '#336688', 'L': '#447799', 'O': '#223344',
  'K': '#443300', 'k': '#665500', 'Y': '#ffdd44', 'y': '#ffee88',
  'C': '#003344', 'c': '#44eeff', 'B': '#88ffff', 'b': '#ffffff',
  'T': '#003300', 't': '#004400', 'G': '#33ff33', 'P': '#225522', 'p': '#44aa44',
  'V': '#181830', 'v': '#282850', 'A': '#5050b0', 'a': '#7070d0',
  'I': '#0a1a2a', 'i': '#1a3050', 'j': '#3366aa', 'J': '#88bbff',
  'E': '#0c0c2a', 'e': '#161640',
  'Z': '#88ff88',
};

export const TILE_PALETTE_DECK_B: Palette = {
  'W': '#1a1210', 'w': '#2a2018', 'M': '#100a08',
  'F': '#140e0a', 'f': '#1c1410', 'g': '#221a16',
  'R': '#3a2a20',
  'H': '#0a0804', 'h': '#040200', 'X': '#060402',
  'S': '#551000', 's': '#cc4422', 'r': '#ff7744', 'Q': '#882211',
  'D': '#2a3020', 'd': '#446030', 'L': '#558040', 'O': '#1a2010',
  'K': '#443300', 'k': '#665500', 'Y': '#ffdd44', 'y': '#ffee88',
  'C': '#003344', 'c': '#44eeff', 'B': '#88ffff', 'b': '#ffffff',
  'T': '#003300', 't': '#004400', 'G': '#33ff33', 'P': '#225522', 'p': '#44aa44',
  'V': '#201818', 'v': '#383028', 'A': '#806040', 'a': '#a08060',
  'I': '#0a1a2a', 'i': '#1a3050', 'j': '#3366aa', 'J': '#88bbff',
  'E': '#180e0a', 'e': '#201610',
  'Z': '#88ff88',
};

export const TILE_PALETTE_REACTOR: Palette = {
  'W': '#1a0a1a', 'w': '#2a1030', 'M': '#0e0610',
  'F': '#120a14', 'f': '#1a0e1e', 'g': '#201426',
  'R': '#3a1a40',
  'H': '#080410', 'h': '#020008', 'X': '#040210',
  'S': '#440022', 's': '#cc2266', 'r': '#ff44aa', 'Q': '#881144',
  'D': '#301a40', 'd': '#553388', 'L': '#7744aa', 'O': '#201030',
  'K': '#443300', 'k': '#665500', 'Y': '#ffdd44', 'y': '#ffee88',
  'C': '#003344', 'c': '#44eeff', 'B': '#88ffff', 'b': '#ffffff',
  'T': '#003300', 't': '#004400', 'G': '#33ff33', 'P': '#225522', 'p': '#44aa44',
  'V': '#201828', 'v': '#302840', 'A': '#6040a0', 'a': '#8060c0',
  'I': '#0a1a2a', 'i': '#1a3050', 'j': '#3366aa', 'J': '#88bbff',
  'E': '#140a16', 'e': '#1c1020',
  'Z': '#88ff88',
};

export const TILE_PALETTE_BRIDGE: Palette = {
  'W': '#101820', 'w': '#182838', 'M': '#081018',
  'F': '#0a1018', 'f': '#101820', 'g': '#162028',
  'R': '#203040',
  'H': '#040810', 'h': '#000408', 'X': '#020408',
  'S': '#003344', 's': '#2288aa', 'r': '#44bbcc', 'Q': '#115566',
  'D': '#182838', 'd': '#305060', 'L': '#406878', 'O': '#101820',
  'K': '#443300', 'k': '#665500', 'Y': '#ffdd44', 'y': '#ffee88',
  'C': '#003344', 'c': '#44eeff', 'B': '#88ffff', 'b': '#ffffff',
  'T': '#003300', 't': '#004400', 'G': '#33ff33', 'P': '#225522', 'p': '#44aa44',
  'V': '#141e28', 'v': '#243040', 'A': '#406888', 'a': '#608aaa',
  'I': '#0a1a2a', 'i': '#1a3050', 'j': '#3366aa', 'J': '#88bbff',
  'E': '#0c1218', 'e': '#141c24',
  'Z': '#88ff88',
};

export const TILE_PALETTE_VOID: Palette = {
  'W': '#0a0a14', 'w': '#101020', 'M': '#06060e',
  'F': '#060610', 'f': '#0a0a18', 'g': '#0e0e20',
  'R': '#16162a',
  'H': '#020208', 'h': '#000004', 'X': '#010106',
  'S': '#330022', 's': '#aa2244', 'r': '#dd4466', 'Q': '#661133',
  'D': '#141430', 'd': '#282860', 'L': '#3a3a80', 'O': '#0a0a18',
  'K': '#443300', 'k': '#665500', 'Y': '#ffdd44', 'y': '#ffee88',
  'C': '#003344', 'c': '#44eeff', 'B': '#88ffff', 'b': '#ffffff',
  'T': '#003300', 't': '#004400', 'G': '#33ff33', 'P': '#225522', 'p': '#44aa44',
  'V': '#0e0e20', 'v': '#181830', 'A': '#3030a0', 'a': '#5050c0',
  'I': '#0a1a2a', 'i': '#1a3050', 'j': '#3366aa', 'J': '#88bbff',
  'E': '#08080e', 'e': '#0c0c18',
  'Z': '#88ff88',
};

// Alt palettes — shifted hue variants for level color variation

export const TILE_PALETTE_DECK_A_ALT: Palette = {
  'W': '#1a2a12', 'w': '#223a1a', 'M': '#0a1808',
  'F': '#0e1a0e', 'f': '#122812', 'g': '#163816',
  'R': '#2a4020',
  'H': '#081808', 'h': '#000800', 'X': '#041004',
  'S': '#550000', 's': '#cc3333', 'r': '#ff6666', 'Q': '#881111',
  'D': '#1a3444', 'd': '#336688', 'L': '#447799', 'O': '#223344',
  'K': '#443300', 'k': '#665500', 'Y': '#ffdd44', 'y': '#ffee88',
  'C': '#003344', 'c': '#44eeff', 'B': '#88ffff', 'b': '#ffffff',
  'T': '#003300', 't': '#004400', 'G': '#33ff33', 'P': '#225522', 'p': '#44aa44',
  'V': '#182818', 'v': '#284028', 'A': '#508050', 'a': '#70a070',
  'I': '#0a2a1a', 'i': '#1a5030', 'j': '#33aa66', 'J': '#88ffbb',
  'E': '#0c1a0c', 'e': '#163016',
  'Z': '#88ff88',
};

export const TILE_PALETTE_DECK_B_ALT: Palette = {
  'W': '#10121a', 'w': '#18202a', 'M': '#080a10',
  'F': '#0a0e14', 'f': '#10141c', 'g': '#161a22',
  'R': '#202a3a',
  'H': '#04080a', 'h': '#000204', 'X': '#020406',
  'S': '#551000', 's': '#cc4422', 'r': '#ff7744', 'Q': '#882211',
  'D': '#2a3020', 'd': '#446030', 'L': '#558040', 'O': '#1a2010',
  'K': '#443300', 'k': '#665500', 'Y': '#ffdd44', 'y': '#ffee88',
  'C': '#003344', 'c': '#44eeff', 'B': '#88ffff', 'b': '#ffffff',
  'T': '#003300', 't': '#004400', 'G': '#33ff33', 'P': '#225522', 'p': '#44aa44',
  'V': '#181820', 'v': '#282838', 'A': '#604080', 'a': '#8060a0',
  'I': '#0a1a2a', 'i': '#1a3050', 'j': '#3366aa', 'J': '#88bbff',
  'E': '#0e0e18', 'e': '#161620',
  'Z': '#88ff88',
};

export const TILE_PALETTE_REACTOR_ALT: Palette = {
  'W': '#0a1a1a', 'w': '#103030', 'M': '#061010',
  'F': '#0a1414', 'f': '#0e1e1e', 'g': '#142626',
  'R': '#1a4040',
  'H': '#041010', 'h': '#000808', 'X': '#020a0a',
  'S': '#004422', 's': '#22cc66', 'r': '#44ffaa', 'Q': '#118844',
  'D': '#1a4030', 'd': '#338860', 'L': '#44aa77', 'O': '#103020',
  'K': '#443300', 'k': '#665500', 'Y': '#ffdd44', 'y': '#ffee88',
  'C': '#003344', 'c': '#44eeff', 'B': '#88ffff', 'b': '#ffffff',
  'T': '#003300', 't': '#004400', 'G': '#33ff33', 'P': '#225522', 'p': '#44aa44',
  'V': '#182028', 'v': '#283840', 'A': '#40a060', 'a': '#60c080',
  'I': '#0a2a2a', 'i': '#1a5050', 'j': '#33aaaa', 'J': '#88ffff',
  'E': '#0a1416', 'e': '#101c20',
  'Z': '#88ff88',
};

export const TILE_PALETTE_BRIDGE_ALT: Palette = {
  'W': '#181810', 'w': '#282818', 'M': '#101008',
  'F': '#101810', 'f': '#182018', 'g': '#202820',
  'R': '#303820',
  'H': '#081004', 'h': '#040800', 'X': '#040804',
  'S': '#334400', 's': '#88aa22', 'r': '#bbcc44', 'Q': '#556611',
  'D': '#283018', 'd': '#506030', 'L': '#687840', 'O': '#182010',
  'K': '#443300', 'k': '#665500', 'Y': '#ffdd44', 'y': '#ffee88',
  'C': '#003344', 'c': '#44eeff', 'B': '#88ffff', 'b': '#ffffff',
  'T': '#003300', 't': '#004400', 'G': '#33ff33', 'P': '#225522', 'p': '#44aa44',
  'V': '#1e1e14', 'v': '#303024', 'A': '#688840', 'a': '#8aaa60',
  'I': '#1a2a0a', 'i': '#305018', 'j': '#66aa33', 'J': '#bbff88',
  'E': '#121812', 'e': '#1c241c',
  'Z': '#88ff88',
};

export const TILE_PALETTE_VOID_ALT: Palette = {
  'W': '#140a14', 'w': '#201020', 'M': '#0e060e',
  'F': '#100610', 'f': '#180a18', 'g': '#200e20',
  'R': '#2a162a',
  'H': '#080208', 'h': '#040004', 'X': '#060106',
  'S': '#330033', 's': '#aa22aa', 'r': '#dd44dd', 'Q': '#661166',
  'D': '#301430', 'd': '#602860', 'L': '#803a80', 'O': '#180a18',
  'K': '#443300', 'k': '#665500', 'Y': '#ffdd44', 'y': '#ffee88',
  'C': '#003344', 'c': '#44eeff', 'B': '#88ffff', 'b': '#ffffff',
  'T': '#003300', 't': '#004400', 'G': '#33ff33', 'P': '#225522', 'p': '#44aa44',
  'V': '#200e20', 'v': '#301830', 'A': '#a030a0', 'a': '#c050c0',
  'I': '#2a0a2a', 'i': '#501a50', 'j': '#aa33aa', 'J': '#ff88ff',
  'E': '#0e080e', 'e': '#180c18',
  'Z': '#88ff88',
};

export const TILE_PALETTES: Record<string, Palette> = {
  'deck-a': TILE_PALETTE_DECK_A,
  'deck-b': TILE_PALETTE_DECK_B,
  'reactor': TILE_PALETTE_REACTOR,
  'bridge': TILE_PALETTE_BRIDGE,
  'void': TILE_PALETTE_VOID,
  'deck-a-alt': TILE_PALETTE_DECK_A_ALT,
  'deck-b-alt': TILE_PALETTE_DECK_B_ALT,
  'reactor-alt': TILE_PALETTE_REACTOR_ALT,
  'bridge-alt': TILE_PALETTE_BRIDGE_ALT,
  'void-alt': TILE_PALETTE_VOID_ALT,
};

// ============================================================
// Player palette
// ============================================================
export const PLAYER_PALETTE: Palette = {
  'H': '#334466', 'h': '#445588', // helmet dark/mid
  'V': '#88ddff', 'v': '#aaeeff', // visor
  'B': '#3388aa', 'b': '#44aacc', // suit body
  'S': '#225577', 's': '#2a6688', // suit shadow
  'G': '#bbddee', 'g': '#ddeeff', // suit highlight/glint
  'A': '#446688', 'a': '#557799', // arm
  'L': '#223355', 'l': '#334466', // leg/boot
  'F': '#1a2844',                   // boot sole
  'E': '#001122', 'e': '#112233', // eye
  'W': '#ffffff',                   // white accent
};

// ============================================================
// Enemy palettes
// ============================================================
export const ENEMY_CHASER_PALETTE: Palette = {
  'B': '#cc4422', 'b': '#ff6644', // body
  'D': '#882211', 'd': '#aa3322', // dark/shadow
  'E': '#ffcc00', 'e': '#ffffff', // eye
  'L': '#993322', 'l': '#aa4433', // leg
  'H': '#ff8855',                  // highlight
};

export const ENEMY_PATROLLER_PALETTE: Palette = {
  'B': '#556688', 'b': '#6688aa', // body (armored)
  'D': '#334455', 'd': '#445566', // dark
  'E': '#ff4444', 'e': '#ff8888', // visor eye
  'L': '#445566', 'l': '#556677', // legs
  'H': '#88aacc',                  // highlight
  'P': '#77aadd',                  // patrol light
};

export const ENEMY_SHOOTER_PALETTE: Palette = {
  'B': '#cc6622', 'b': '#ee8844', // body
  'D': '#884411', 'd': '#aa5522', // dark
  'E': '#ffdd00', 'e': '#ffffff', // eye
  'C': '#664422', 'c': '#886633', // cannon
  'H': '#ffaa66',                  // highlight
};

export const ENEMY_WANDERER_PALETTE: Palette = {
  'B': '#44aa66', 'b': '#66cc88', // body (organic)
  'D': '#227744', 'd': '#338855', // dark
  'E': '#ffff44', 'e': '#ffffff', // eyes
  'T': '#338866', 't': '#44aa77', // tentacle
  'H': '#88eebb',                  // highlight
};

// ============================================================
// NPC palettes
// ============================================================
export const NPC_MOM_PALETTE: Palette = {
  'B': '#9944aa', 'b': '#bb66cc',  // body (purple dress)
  'D': '#663377', 'd': '#774488',  // dark/shadow
  'H': '#dd88ee',                   // highlight
  'S': '#884499', 's': '#995588',  // skirt
  'A': '#cc88dd', 'a': '#ddaaee',  // apron/accent
  'E': '#442266', 'e': '#553377',  // eye
  'L': '#553366', 'l': '#664477',  // legs
  'F': '#663388',                   // feet
  'W': '#ffffff',                   // white accent
};

export const NPC_DAD_PALETTE: Palette = {
  'B': '#447744', 'b': '#559955',  // body (green shirt)
  'D': '#335533', 'd': '#446644',  // dark/shadow
  'H': '#77bb77',                   // highlight
  'S': '#554433', 's': '#665544',  // pants (brown)
  'A': '#558855', 'a': '#66aa66',  // arm
  'E': '#223322', 'e': '#334433',  // eye
  'L': '#443322', 'l': '#554433',  // legs/boots
  'F': '#332211',                   // feet
  'W': '#ffffff',                   // white accent
};

// ============================================================
// Boss palettes (base + phase variants)
// ============================================================
export const BOSS_PALETTE_BASE: Palette = {
  'B': '#cc2244', 'b': '#ff3366', // body
  'D': '#881133', 'd': '#aa2244', // dark
  'E': '#ff0000', 'e': '#ff4444', // eyes
  'A': '#cc2244', 'a': '#ee3355', // armor
  'H': '#ff6688',                  // highlight
  'G': '#ffcc00',                  // glow
  'M': '#992244',                  // metal
  'C': '#cc3355', 'c': '#dd4466', // cannon/barrel
};

export const BOSS_PALETTE_PHASE2: Palette = {
  'B': '#cc6600', 'b': '#ff8800', // orange shift
  'D': '#884400', 'd': '#aa5500',
  'E': '#ff4400', 'e': '#ff8844',
  'A': '#cc6600', 'a': '#ee7711',
  'H': '#ffaa44',
  'G': '#ffdd44',
  'M': '#995500',
  'C': '#cc6622', 'c': '#dd7733',
};

export const BOSS_PALETTE_PHASE3: Palette = {
  'B': '#cc8800', 'b': '#ffaa00', // red/gold shift
  'D': '#886600', 'd': '#aa7700',
  'E': '#ff2200', 'e': '#ff6644',
  'A': '#ccaa00', 'a': '#eebb11',
  'H': '#ffcc66',
  'G': '#ffffff',
  'M': '#997700',
  'C': '#ccaa22', 'c': '#ddbb33',
};

// ============================================================
// Pickup palettes
// ============================================================
export const CRYSTAL_PALETTE: Palette = {
  'D': '#0088aa', 'd': '#00aacc', // dark facets
  'C': '#44eeff', 'c': '#66ffff', // crystal body
  'B': '#88ffff', 'b': '#aaffff', // bright
  'W': '#ffffff',                   // sparkle white
  'G': '#ccffff',                   // glow
};

export const KEY_PALETTE: Palette = {
  'K': '#cc9900', 'k': '#ffbb00', // key body
  'B': '#ffdd44', 'b': '#ffee88', // bright/edge
  'D': '#885500', 'd': '#aa7700', // dark
  'G': '#ffff88',                   // glow
  'W': '#ffffff',
};

// ============================================================
// Projectile palettes
// ============================================================
export const PROJ_PLAYER_PALETTE: Palette = {
  'C': '#44eeff', 'B': '#88ffff', 'W': '#ffffff',
};

export const PROJ_ENEMY_PALETTE: Palette = {
  'C': '#ff8833', 'B': '#ffaa66', 'W': '#ffffff',
};

// ============================================================
// UI palettes
// ============================================================
export const HEART_FULL_PALETTE: Palette = {
  'O': '#660011', // outline
  'R': '#cc2233', 'r': '#ff3344', // red body
  'H': '#ff8899', // highlight
  'D': '#881122', // dark
};

export const HEART_EMPTY_PALETTE: Palette = {
  'O': '#331122', // outline
  'D': '#1a0a0e', // inner dark
};

export const UI_PALETTE: Palette = {
  'C': '#44eeff', 'c': '#88ffff', // crystal icon
  'K': '#ffdd44', 'k': '#ffee88', // key icon
  'B': '#0c0c24', 'b': '#181838', // border dark
  'H': '#44eeff', 'h': '#2288aa', // border highlight
  'G': '#08081a',                   // HUD background
  'N': '#2a2a4a',                   // HUD highlight row
  'D': '#1a1a3a',                   // HUD separator
  'W': '#ffffff',
};
