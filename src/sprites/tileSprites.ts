// Tile sprite definitions — 16x16 pixel art for each tile type.
// Each string array is a 16x16 grid. Characters map to palette entries.

import { SpriteRenderer } from './SpriteRenderer';
import {
  TILE_PALETTE_DECK_A, TILE_PALETTE_DECK_B,
  TILE_PALETTE_REACTOR, TILE_PALETTE_BRIDGE, TILE_PALETTE_VOID,
  TILE_PALETTE_DECK_A_ALT, TILE_PALETTE_DECK_B_ALT,
  TILE_PALETTE_REACTOR_ALT, TILE_PALETTE_BRIDGE_ALT, TILE_PALETTE_VOID_ALT,
} from './palettes';
import type { Palette } from './SpriteRenderer';

// ============================================================
// Sprite Data (palette-agnostic — chars map to palette keys)
// ============================================================

const FLOOR: string[] = [
  'RggggggggggggggR',
  'gFfFfFfFfFfFfFfg',
  'gfFfFfFfFfFfFfFg',
  'gFfFfFfFfFfFfFfg',
  'geFeFeFeFeFeFeFeg',
  'gfFfFfFfFfFfFfFg',
  'gFfFfFfFfFfFfFfg',
  'gfFfFfFfFfFfFfFg',
  'gFfFfFfFfFfFfFfg',
  'gfFfFfFfFfFfFfFg',
  'gFfFfFfFfFfFfFfg',
  'geFeFeFeFeFeFeFeg',
  'gfFfFfFfFfFfFfFg',
  'gFfFfFfFfFfFfFfg',
  'gfFfFfFfFfFfFfFg',
  'ReeeeeeeeeeeeeeR',
].map(r => r.slice(0, 16));

const WALL: string[] = [
  'MWWWWWWMWWWWWWwM',
  'Weeeeee WWeeeeew',
  'WwwwwwwWWwwwwwwW',
  'WwwwRwwWWwwRwwwW',
  'WMMMMMMWWMMMMMMW',
  'EWWWWWE WWWWWWE ',
  'MWWWWWWMWWWWWWwM',
  'MWWMWWWWWWWMWWWM',
  'Wee ewwwwwwWeee ',
  'WwwWwwRwwwwWwwWW',
  'WwwWwwwwwwwWwwWW',
  'WwwWwwwwwRwWwwWW',
  'WMMWMMMMMMMWMMWW',
  'EWWEWWWWWWWEWWEW',
  'MWWMWWWWWWWMWWWM',
  'MWWWWWWMWWWWWWwM',
].map(r => r.slice(0, 16));

const HOLE: string[] = [
  'HHHHHhhhhhHHHHHH',
  'HHHhhhhhhhhhHHHH',
  'HHhhhXXXXhhhHHHH',
  'HhhhXXXXXXhhhHHH',
  'HhhXXXXXXXXhhHHH',
  'hhXXXXXXXXXXhhHH',
  'hhXXXXXXXXXXhhhH',
  'hXXXXXXXXXXXXhhH',
  'hXXXXXXXXXXXXhhH',
  'hhXXXXXXXXXXhhhH',
  'hhXXXXXXXXXXhhHH',
  'HhhXXXXXXXXhhHHH',
  'HhhhXXXXXXhhhHHH',
  'HHhhhXXXXhhhHHHH',
  'HHHhhhhhhhhhHHHH',
  'HHHHHhhhhhHHHHHH',
].map(r => r.slice(0, 16));

// Spike frame 1 (points up)
const SPIKE_0: string[] = [
  'SSSSSSSSSSSSSSSS',
  'SSSSSSSSSSSSSSSS',
  'SSSSSSSssSSSSSSS',
  'SSSSSSsrrsSSSSSS',
  'SSSSSsrrrrSSSSSS',
  'SSSSsrrrrrsSSSSS',
  'SSSsrrrrrrrsSSS ',
  'SSQrrrrrrrrrQSS ',
  'SQQQQrrQQQrrQQS ',
  'SSSSSssSSSSssSS ',
  'SSSSsrrsSSSsrrS ',
  'SSSsrrrrsssrrrrS',
  'SSQrrrrrrrrrrrQS',
  'SQQQQQQQQQQQQQrQ',
  'SSSSSSSSSSSSSSSS',
  'SSSSSSSSSSSSSSSS',
].map(r => r.slice(0, 16));

// Spike frame 2 (slightly different)
const SPIKE_1: string[] = [
  'SSSSSSSSSSSSSSSS',
  'SSSSSSSSSSSSSSSS',
  'SSSSSSSssSSSSSSS',
  'SSSSSSSrrSSSSSSS',
  'SSSSSSrrrrsSSSSS',
  'SSSSSsrrrrsSSSS ',
  'SSSSQrrrrrrsSSS ',
  'SSSQrrrrrrrrQSS ',
  'SQQQQQQrrQQQQQS ',
  'SSSSSssSSSSssSS ',
  'SSSSssrsSSSsrrS ',
  'SSSsrrrrssssrrrS',
  'SSQrrrrrrrrrrrrQ',
  'SQQQQQQQQQQQQQQQ',
  'SSSSSSSSSSSSSSSS',
  'SSSSSSSSSSSSSSSS',
].map(r => r.slice(0, 16));

const DOOR_CLOSED: string[] = [
  'DDDDDDDDDDDDDDDD',
  'DdddddddddddddDD',
  'DdLLLLddddLLLLdD',
  'DdLdddddddddLddD',
  'DdLdddddddddLddD',
  'DdLdddddddddLddD',
  'DdLLLLddddLLLLdD',
  'DddddddLLddddddD',
  'DddddddLLddddddD',
  'DdLLLLddddLLLLdD',
  'DdLdddddddddLddD',
  'DdLdddddddddLddD',
  'DdLdddddddddLddD',
  'DdLLLLddddLLLLdD',
  'DdddddddddddddDD',
  'DDDDDDDDDDDDDDDD',
].map(r => r.slice(0, 16));

const DOOR_OPEN: string[] = [
  'OOOOOOOOOOOOOOOF',
  'OOOFFFFFFFFFFOoF',
  'OFFFFFFFFFFFFoFF',
  'OFFFFFFFFFFFFFFO',
  'FFFFFFFFFFFFFFFO',
  'FFFFFFFFFFFFFFFF',
  'FFFFFFFFFFFFFFFF',
  'FFFFFFFFFFFFFFFF',
  'FFFFFFFFFFFFFFFF',
  'FFFFFFFFFFFFFFFF',
  'FFFFFFFFFFFFFFFF',
  'OFFFFFFFFFFFFFFO',
  'OFFFFFFFFFFFFFFO',
  'OFFFFFFFFFFFFoFF',
  'OOOFFFFFFFFFFOoF',
  'OOOOOOOOOOOOOOOF',
].map(r => r.slice(0, 16));

const SWITCH_OFF: string[] = [
  'TTTTTTTTTTTTTTTT',
  'TtttttttttttttTT',
  'TtPPPPPPPPPPPtTT',
  'TtPppppppppPPtT ',
  'TtPpGGGGGGpPPtT ',
  'TtPpGGGGGGpPPtT ',
  'TtPppppppppPPtT ',
  'TtPPPPPPPPPPPtT ',
  'TtPPPPPPPPPPPtT ',
  'TtPpGGGGGGpPPtT ',
  'TtPpGGGGGGpPPtT ',
  'TtPppppppppPPtT ',
  'TtPPPPPPPPPPPtT ',
  'TtttttttttttttTT',
  'TTTTTTTTTTTTTTTT',
  'TTTTTTTTTTTTTTTT',
].map(r => r.slice(0, 16));

const SWITCH_ON: string[] = [
  'TTTTTTTTTTTTTTTT',
  'TtttttttttttttTT',
  'TtPPPPPPPPPPPtTT',
  'TtPppppppppPPtT ',
  'TtPpZZZZZZpPPtT ',
  'TtPpZZZZZZpPPtT ',
  'TtPppppppppPPtT ',
  'TtPPPPPPPPPPPtT ',
  'TtPPPPPPPPPPPtT ',
  'TtPpZZZZZZpPPtT ',
  'TtPpZZZZZZpPPtT ',
  'TtPppppppppPPtT ',
  'TtPPPPPPPPPPPtT ',
  'TtttttttttttttTT',
  'TTTTTTTTTTTTTTTT',
  'TTTTTTTTTTTTTTTT',
].map(r => r.slice(0, 16));

const KEY_TILE: string[] = [
  'KKKKKKKKKKKKKKK ',
  'KkkkkkkkkkkkkKK ',
  'KkFFFFFFFFFFkKK ',
  'KkFFFFFFFFFfkK  ',
  'KkFFYYYYFFFFkK  ',
  'KkFYYyyYYFFFkK  ',
  'KkFYyFFyYFFFkK  ',
  'KkFYyFFyYYYYkK  ',
  'KkFYyFFyyyyykK  ',
  'KkFYYyyYYFFFkK  ',
  'KkFFYYYYFFFFkK  ',
  'KkFFFFFFFFFfkK  ',
  'KkFFFFFFFFFFkKK ',
  'KkkkkkkkkkkkkKK ',
  'KKKKKKKKKKKKKKK ',
  '                ',
].map(r => r.slice(0, 16));

const CRYSTAL_TILE: string[] = [
  'CCCCCCCCCCCCCCCC',
  'CcccccccccccccCC',
  'CcFFFFFFFFFFFFcC',
  'CcFFFFFFFFFFFFcC',
  'CcFFFFFccFFFFFcC',
  'CcFFFFcBBcFFFFcC',
  'CcFFFcBbBBcFFFcC',
  'CcFFcBbWbBBcFFcC',
  'CcFFcBBbBBcFFFcC',
  'CcFFFcBBBcFFFFcC',
  'CcFFFFccccFFFFFc',
  'CcFFFFFFFFFFFFcC',
  'CcFFFFFFFFFFFFcC',
  'CcccccccccccccCC',
  'CCCCCCCCCCCCCCCC',
  'CCCCCCCCCCCCCCCC',
].map(r => r.slice(0, 16));

// Conveyor — 3 animation frames (chevron belt pattern)
const CONVEYOR_R_0: string[] = [
  'VVVVVVVVVVVVVVVV',
  'VvvvvvvvvvvvvvVV',
  'VvAAAvvAAAvvAAvV',
  'VvvAAvvvAAvvvAvV',
  'VvvvAvvvvAvvvvvV',
  'VvvAAvvvAAvvvAvV',
  'VvAAAvvAAAvvAAvV',
  'VvvvvvvvvvvvvvVV',
  'VvvvvvvvvvvvvvVV',
  'VvAAAvvAAAvvAAvV',
  'VvvAAvvvAAvvvAvV',
  'VvvvAvvvvAvvvvvV',
  'VvvAAvvvAAvvvAvV',
  'VvAAAvvAAAvvAAvV',
  'VvvvvvvvvvvvvvVV',
  'VVVVVVVVVVVVVVVV',
].map(r => r.slice(0, 16));

const CONVEYOR_R_1: string[] = [
  'VVVVVVVVVVVVVVVV',
  'VvvvvvvvvvvvvvVV',
  'VvvAAAvvAAAvvAvV',
  'VvvvAAvvvAAvvvvV',
  'VvvvvAvvvvAvvvvV',
  'VvvvAAvvvAAvvvvV',
  'VvvAAAvvAAAvvAvV',
  'VvvvvvvvvvvvvvVV',
  'VvvvvvvvvvvvvvVV',
  'VvvAAAvvAAAvvAvV',
  'VvvvAAvvvAAvvvvV',
  'VvvvvAvvvvAvvvvV',
  'VvvvAAvvvAAvvvvV',
  'VvvAAAvvAAAvvAvV',
  'VvvvvvvvvvvvvvVV',
  'VVVVVVVVVVVVVVVV',
].map(r => r.slice(0, 16));

const CONVEYOR_R_2: string[] = [
  'VVVVVVVVVVVVVVVV',
  'VvvvvvvvvvvvvvVV',
  'VvvvAAAvvAAAvvvV',
  'VvvvvAAvvvAAvvvV',
  'VvvvvvAvvvvAvvvV',
  'VvvvvAAvvvAAvvvV',
  'VvvvAAAvvAAAvvvV',
  'VvvvvvvvvvvvvvVV',
  'VvvvvvvvvvvvvvVV',
  'VvvvAAAvvAAAvvvV',
  'VvvvvAAvvvAAvvvV',
  'VvvvvvAvvvvAvvvV',
  'VvvvvAAvvvAAvvvV',
  'VvvvAAAvvAAAvvvV',
  'VvvvvvvvvvvvvvVV',
  'VVVVVVVVVVVVVVVV',
].map(r => r.slice(0, 16));

const ICE: string[] = [
  'IIIIIIIIIIIIIiII',
  'IiiiiiiiiiiiiiII',
  'IiiiiiiiiiijiiII',
  'IiiiiiiiiiJjiiII',
  'IiiiiiiiiJjjiiII',
  'IiiiiiiiJjiiiiII',
  'IiiiiiiJjiiiiIII',
  'IiiiiiJjiiiiiiII',
  'IiiiijjiiiiiiiII',
  'IiiijjiiiiiiiiII',
  'IiiiiiiiiiiiiIII',
  'IiiijiiiiiiiiIII',
  'IiijJiiiiiiiIIII',
  'IiiijiiiiiiiiIII',
  'IiiiiiiiiiiiiiII',
  'IIIIIIIIIIIIIIII',
].map(r => r.slice(0, 16));

// ============================================================
// Floor alternate variants (one per zone, uses existing palette chars)
// ============================================================

// deck-a: Grating — 4 panels divided by e grid lines
const FLOOR_ALT_A: string[] = [
  'eeeeeeeeeeeeeeee',
  'eFfFfFfeeFfFfFfe',
  'efFfFfFeefFfFfFe',
  'eFfFfFfeeFfFfFfe',
  'eeeeeeeeeeeeeeee',
  'eFfFfFfeeFfFfFfe',
  'efFfFfFeefFfFfFe',
  'eFfFfFfeeFfFfFfe',
  'eeeeeeeeeeeeeeee',
  'eFfFfFfeeFfFfFfe',
  'efFfFfFeefFfFfFe',
  'eFfFfFfeeFfFfFfe',
  'eeeeeeeeeeeeeeee',
  'eFfFfFfFfFfFfFfe',
  'efFfFfFfFfFfFfFe',
  'eeeeeeeeeeeeeeee',
].map(r => r.slice(0, 16));

// deck-b: Cargo — riveted border panel
const FLOOR_ALT_B: string[] = [
  'ReeeeeeeeeeeeeeR',
  'eRfFfFfFfFfFfRfe',
  'efFfFfFfFfFfFfFe',
  'eFfFfFfFfFfFfFfe',
  'efFfFfFfFfFfFfFe',
  'eFfFfFfFfFfFfFfe',
  'efFfFfFfFfFfFfFe',
  'eFfFfFfFfFfFfFfe',
  'efFfFfFfFfFfFfFe',
  'eFfFfFfFfFfFfFfe',
  'efFfFfFfFfFfFfFe',
  'eFfFfFfFfFfFfFfe',
  'efFfFfFfFfFfFfFe',
  'eFfFfFfFfFfFfFfe',
  'eRfFfFfFfFfFfRfe',
  'ReeeeeeeeeeeeeeR',
].map(r => r.slice(0, 16));

// reactor: Energy conduit — vertical g stripe at center
const FLOOR_ALT_C: string[] = [
  'FfFfFfFgFfFfFfFf',
  'fFfFfFfgfFfFfFfF',
  'FfFfFfFgFfFfFfFf',
  'fFfFfFfgfFfFfFfF',
  'FfFfFfFgFfFfFfFf',
  'fFfFfFfgfFfFfFfF',
  'FfFfFfFgFfFfFfFf',
  'fFfFfFfgfFfFfFfF',
  'FfFfFfFgFfFfFfFf',
  'fFfFfFfgfFfFfFfF',
  'FfFfFfFgFfFfFfFf',
  'fFfFfFfgfFfFfFfF',
  'FfFfFfFgFfFfFfFf',
  'fFfFfFfgfFfFfFfF',
  'FfFfFfFgFfFfFfFf',
  'fFfFfFfgfFfFfFfF',
].map(r => r.slice(0, 16));

// bridge: Console grid — small panel outlines
const FLOOR_ALT_D: string[] = [
  'eeeeeeeeeeeeeeee',
  'eFfFfFfeeFfFfFfe',
  'efFfFfFeefFfFfFe',
  'eFfFfFfeeFfFfFfe',
  'efFfFfFeefFfFfFe',
  'eeeeeeeeeeeeeeee',
  'eFfFfFfFfFfFfFfe',
  'efFfFfFfFfFfFfFe',
  'eFfFfFfFfFfFfFfe',
  'efFfFfFfFfFfFfFe',
  'eeeeeeeeeeeeeeee',
  'eFfFfFfeeFfFfFfe',
  'efFfFfFeefFfFfFe',
  'eFfFfFfeeFfFfFfe',
  'efFfFfFeefFfFfFe',
  'eeeeeeeeeeeeeeee',
].map(r => r.slice(0, 16));

// void: Cracked — diagonal e crack line
const FLOOR_ALT_E: string[] = [
  'eFfFfFfFfFfFfFfe',
  'feFfFfFfFfFfFfFf',
  'FfeFfFfFfFfFfFfF',
  'fFfeFfFfFfFfFfFf',
  'FfFfeFfFfFfFfFfF',
  'fFfFfeFfFfFfFfFf',
  'FfFfFfeFfFfFfFfF',
  'fFfFfFfeFfFfFfFf',
  'FfFfFfFfeFfFfFfF',
  'fFfFfFfFfeFfFfFf',
  'FfFfFfFfFfeFfFfF',
  'fFfFfFfFfFfeFfFf',
  'FfFfFfFfFfFfeFfF',
  'fFfFfFfFfFfFfeFf',
  'FfFfFfFfFfFfFfeF',
  'eFfFfFfFfFfFfFfe',
].map(r => r.slice(0, 16));

// ============================================================
// Wall alternate variants (one per zone)
// ============================================================

// deck-a: Porthole — R rivet ring in top-left brick
const WALL_ALT_A: string[] = [
  'MWWWWWWMWWWWWWwM',
  'WeeRRee WWeeeeew',
  'WwRwwRwWWwwwwwwW',
  'WwRwwRwWWwwRwwwW',
  'WMMRRMMWWMMMMMMW',
  'EWWWWWE WWWWWWE ',
  'MWWWWWWMWWWWWWwM',
  'MWWMWWWWWWWMWWWM',
  'Wee ewwwwwwWeee ',
  'WwwWwwRwwwwWwwWW',
  'WwwWwwwwwwwWwwWW',
  'WwwWwwwwwRwWwwWW',
  'WMMWMMMMMMMWMMWW',
  'EWWEWWWWWWWEWWEW',
  'MWWMWWWWWWWMWWWM',
  'MWWWWWWMWWWWWWwM',
].map(r => r.slice(0, 16));

// deck-b: Heavy bolt — extra R rivets scattered
const WALL_ALT_B: string[] = [
  'MWWWWWWMWWWWWWwM',
  'WReeRee WWeReeew',
  'WwwwwwwWWwwwwwwW',
  'WwRwRwwWWwRwRwwW',
  'WMMMMMMWWMMMMMMW',
  'EWWWWWE WWWWWWE ',
  'MWWWWWWMWWWWWWwM',
  'MWWMWWWWWWWMWWWM',
  'Wee ewwwwwwWeee ',
  'WwwWRwRwwwwWwwWW',
  'WwwWwwwwwwwWwwWW',
  'WwwWRwwwwRwWwwWW',
  'WMMWMMMMMMMWMMWW',
  'EWWEWWWWWWWEWWEW',
  'MWWMWWWWWWWMWWWM',
  'MWWWWWWMWWWWWWwM',
].map(r => r.slice(0, 16));

// reactor: Conduit — vertical e energy line at col 7
const WALL_ALT_C: string[] = [
  'MWWWWWWeMWWWWWwM',
  'WeeeeeeeeWeeeeew',
  'WwwwwwweWwwwwwwW',
  'WwwwRwweWwwRwwwW',
  'WMMMMMMeWMMMMMMW',
  'EWWWWWEeWWWWWWE ',
  'MWWWWWWeMWWWWWwM',
  'MWWMWWWewwwmwwwm',
  'Wee ewweWwwWeee ',
  'WwwWwwRewwwWwwWW',
  'WwwWwwwewwwWwwWW',
  'WwwWwwwewRwWwwWW',
  'WMMWMMMeMMMWMMWW',
  'EWWEWWWewwwEWWEW',
  'MWWMWWWewwwmwwwm',
  'MWWWWWWeMWWWWWwM',
].map(r => r.slice(0, 16));

// bridge: Panel — horizontal e accent stripe at row 3
const WALL_ALT_D: string[] = [
  'MWWWWWWMWWWWWWwM',
  'Weeeeee WWeeeeew',
  'WwwwwwwWWwwwwwwW',
  'WeeeeeeeWeeeeeew',
  'WMMMMMMWWMMMMMMW',
  'EWWWWWE WWWWWWE ',
  'MWWWWWWMWWWWWWwM',
  'MWWMWWWWWWWMWWWM',
  'Wee ewwwwwwWeee ',
  'WwwWwwRwwwwWwwWW',
  'WeeeeeeeeeeeeeWW',
  'WwwWwwwwwRwWwwWW',
  'WMMWMMMMMMMWMMWW',
  'EWWEWWWWWWWEWWEW',
  'MWWMWWWWWWWMWWWM',
  'MWWWWWWMWWWWWWwM',
].map(r => r.slice(0, 16));

// void: Fractured — irregular e crack lines
const WALL_ALT_E: string[] = [
  'MWWWWWWMWWWWWWwM',
  'Weeeeee WWeeeeew',
  'WwwewwwWWwwwwwwW',
  'WwwwRwwWWwweewwW',
  'WMMMMMMWWMMMMMMW',
  'EWWWWWE WWWWWWE ',
  'MWWWWWWMWWWWWWwM',
  'MWWMWWWWWWWMWWWM',
  'Wee ewwwwwwWeee ',
  'WwwWwwRwwwwWwwWW',
  'WwwWwwewwwwWwwWW',
  'WwwWwwwewRwWwwWW',
  'WMMWMMMMMMMWMMWW',
  'EWWEWWWeWwwEWWEW',
  'MWWMWWWWWWWMWWWM',
  'MWWWWWWMWWWWWWwM',
].map(r => r.slice(0, 16));

// ============================================================
// Floor/wall alt lookup maps
// ============================================================
const FLOOR_ALT_MAP: Record<string, string[]> = {
  'deck-a': FLOOR_ALT_A,
  'deck-b': FLOOR_ALT_B,
  'reactor': FLOOR_ALT_C,
  'bridge': FLOOR_ALT_D,
  'void': FLOOR_ALT_E,
  'deck-a-alt': FLOOR_ALT_A,
  'deck-b-alt': FLOOR_ALT_B,
  'reactor-alt': FLOOR_ALT_C,
  'bridge-alt': FLOOR_ALT_D,
  'void-alt': FLOOR_ALT_E,
};

const WALL_ALT_MAP: Record<string, string[]> = {
  'deck-a': WALL_ALT_A,
  'deck-b': WALL_ALT_B,
  'reactor': WALL_ALT_C,
  'bridge': WALL_ALT_D,
  'void': WALL_ALT_E,
  'deck-a-alt': WALL_ALT_A,
  'deck-b-alt': WALL_ALT_B,
  'reactor-alt': WALL_ALT_C,
  'bridge-alt': WALL_ALT_D,
  'void-alt': WALL_ALT_E,
};

// ============================================================
// Crystal sparkle animation frames (overlay)
// ============================================================
const CRYSTAL_SPARKLE_0: string[] = [
  '                ',
  '                ',
  '                ',
  '       b        ',
  '                ',
  '                ',
  '                ',
  '                ',
  '                ',
  '                ',
  '                ',
  '    b           ',
  '                ',
  '                ',
  '                ',
  '                ',
];

const CRYSTAL_SPARKLE_1: string[] = [
  '                ',
  '                ',
  '                ',
  '                ',
  '                ',
  '          b     ',
  '                ',
  '                ',
  '                ',
  '   b            ',
  '                ',
  '                ',
  '                ',
  '                ',
  '                ',
  '                ',
];

const CRYSTAL_SPARKLE_2: string[] = [
  '                ',
  '                ',
  '                ',
  '                ',
  '                ',
  '                ',
  '                ',
  '      b         ',
  '                ',
  '                ',
  '                ',
  '                ',
  '         b      ',
  '                ',
  '                ',
  '                ',
];

// ============================================================
// Registration
// ============================================================

const PALETTE_NAMES = [
  'deck-a', 'deck-b', 'reactor', 'bridge', 'void',
  'deck-a-alt', 'deck-b-alt', 'reactor-alt', 'bridge-alt', 'void-alt',
] as const;
const PALETTE_MAP: Record<string, Palette> = {
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

export function registerTileSprites(sr: SpriteRenderer): void {
  for (const pName of PALETTE_NAMES) {
    const pal = PALETTE_MAP[pName]!;
    const pfx = `tile_${pName}_`;

    sr.register(`${pfx}floor`, FLOOR, pal);
    sr.register(`${pfx}floor_alt`, FLOOR_ALT_MAP[pName]!, pal);
    sr.register(`${pfx}wall`, WALL, pal);
    sr.register(`${pfx}wall_alt`, WALL_ALT_MAP[pName]!, pal);
    sr.register(`${pfx}hole`, HOLE, pal);
    sr.register(`${pfx}spike_0`, SPIKE_0, pal);
    sr.register(`${pfx}spike_1`, SPIKE_1, pal);
    sr.register(`${pfx}door_closed`, DOOR_CLOSED, pal);
    sr.register(`${pfx}door_open`, DOOR_OPEN, pal);
    sr.register(`${pfx}switch`, SWITCH_OFF, pal);
    sr.register(`${pfx}switch_on`, SWITCH_ON, pal);
    sr.register(`${pfx}key`, KEY_TILE, pal);
    sr.register(`${pfx}crystal_0`, CRYSTAL_TILE, pal);
    sr.register(`${pfx}crystal_sparkle_0`, CRYSTAL_SPARKLE_0, pal);
    sr.register(`${pfx}crystal_sparkle_1`, CRYSTAL_SPARKLE_1, pal);
    sr.register(`${pfx}crystal_sparkle_2`, CRYSTAL_SPARKLE_2, pal);
    sr.register(`${pfx}conveyor_r_0`, CONVEYOR_R_0, pal);
    sr.register(`${pfx}conveyor_r_1`, CONVEYOR_R_1, pal);
    sr.register(`${pfx}conveyor_r_2`, CONVEYOR_R_2, pal);
    sr.register(`${pfx}ice`, ICE, pal);
  }
}
