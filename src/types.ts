// ============================================================
// Shared types and interfaces
// ============================================================

export interface Vec2 {
  x: number;
  y: number;
}

export interface Rect {
  x: number;
  y: number;
  w: number;
  h: number;
}

// ============================================================
// Tile types
// Each character maps to a tile type in level screen strings
// ============================================================
export enum TileType {
  Floor   = '.',
  Wall    = '#',
  Hole    = 'O',
  Spike   = '^',
  Door    = 'D',
  Switch  = 'S',
  KeySpot = 'K',
  Crystal = 'C',
  Player  = 'P',
  Boss    = 'B',
  // Conveyors
  ConveyorR = '>',
  ConveyorL = '<',
  ConveyorD = 'V',
  ConveyorU = 'A',
  // Ice
  Ice     = 'I',
}

// ============================================================
// Game states
// ============================================================
export enum GameState {
  Title           = 'title',
  CharacterSelect = 'characterSelect',
  Story           = 'story',
  StoryCard       = 'storyCard',
  Play            = 'play',
  Pause           = 'pause',
  Transition      = 'transition',
  LevelComplete   = 'levelComplete',
  GameOver        = 'gameOver',
  GameComplete    = 'gameComplete',
}

// ============================================================
// Enemy types
// ============================================================
export enum EnemyType {
  Chaser    = 'chaser',
  Patroller = 'patroller',
  Shooter   = 'shooter',
  Wanderer  = 'wanderer',
}

// ============================================================
// Boss types
// ============================================================
export enum BossType {
  Turret   = 'turret',   // stationary, rotating barrels
  Brute    = 'brute',    // charges at player
  Blaster  = 'blaster',  // moves + shoots patterns
  Summoner = 'summoner', // spawns minions + bullet rings
}

// ============================================================
// Boss parameters (varies per level)
// ============================================================
export interface BossParams {
  hp: number;
  speed: number;
  shootCooldown: number; // ms between shots
  phases: number;        // 1, 2, or 3

  // Turret specific
  numBarrels?: number;

  // Brute specific
  chargeSpeed?: number;

  // Summoner specific
  spawnRate?: number;       // ms between spawns
  spawnType?: EnemyType;
}

// ============================================================
// Enemy spawn definition (used in ScreenDef)
// ============================================================
export interface EnemySpawn {
  type: EnemyType;
  x: number; // tile column
  y: number; // tile row
}

// ============================================================
// Screen definition — one room of tiles + entity spawns
// ============================================================
export interface ScreenDef {
  tiles: string[];        // array of 13 strings, each 20 chars
  enemies: EnemySpawn[];
}

// ============================================================
// Level definition
// ============================================================
export type GatingType = 'key' | 'switch' | 'crystals';
export type BackgroundPalette = 'deck-a' | 'deck-b' | 'reactor' | 'bridge' | 'void'
  | 'deck-a-alt' | 'deck-b-alt' | 'reactor-alt' | 'bridge-alt' | 'void-alt';

export interface LevelDef {
  id: number;
  name: string;
  screens: ScreenDef[][];    // [row][col]
  startScreen: { row: number; col: number };
  bossScreen: { row: number; col: number };
  bossType: BossType;
  bossParams: BossParams;
  crystalTotal: number;
  gatingType: GatingType;
  crystalThreshold?: number; // only used when gatingType === 'crystals'
  enemyScale: number;        // multiplier on base enemy stats
  backgroundPalette: BackgroundPalette;
}
