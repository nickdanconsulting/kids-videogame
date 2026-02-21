// Virtual (logical) resolution — all game logic runs at this size
export const VIRTUAL_W = 320;
export const VIRTUAL_H = 240;

// Tile size in pixels (at virtual resolution)
export const TILE_SIZE = 16;

// Tiles per screen
export const SCREEN_COLS = 20; // VIRTUAL_W / TILE_SIZE
export const SCREEN_ROWS = 13; // playfield rows (leaves 16px for HUD at top)

// HUD height in pixels
export const HUD_H = 16;

// HUD is rendered in the top 16px; gameplay canvas origin is (0, HUD_H)
// Effective playfield pixel dimensions
export const PLAY_W = VIRTUAL_W;            // 320
export const PLAY_H = VIRTUAL_H - HUD_H;    // 224  (14 tile rows)

// Camera transition duration (ms)
export const CAM_TRANSITION_MS = 280;

// Game loop
export const MAX_DELTA_MS = 50; // clamp dt to 50ms to avoid spiral-of-death

// Player stats
export const PLAYER_SPEED     = 110;   // px/s
export const PLAYER_MAX_HP    = 6;     // hearts
export const PLAYER_MAX_ENERGY = 100;
export const PLAYER_ENERGY_REGEN = 8;  // per second
export const PLAYER_BLAST_COST = 8;
export const PLAYER_PULSE_COST = 50;
export const PLAYER_FIRE_COOLDOWN = 320;  // ms between blasts
export const PLAYER_IFRAMES_MS   = 1200;  // invulnerability after hit (ms)
export const PLAYER_JUMP_MS      = 590;   // jump arc duration (ms)

// Projectile
export const PROJECTILE_SPEED_PLAYER  = 260; // px/s
export const PROJECTILE_SPEED_ENEMY   = 110;
export const PROJECTILE_SIZE          = 5;   // square hitbox px

// Pickup
export const CRYSTAL_ENERGY_RESTORE = 15;

// Particle
export const PARTICLE_LIFETIME_MS = 400;

// Colors (palette)
export const COLOR_BG       = '#05050f';
export const COLOR_WALL     = '#1a1a3a';
export const COLOR_FLOOR    = '#0e0e22';
export const COLOR_HOLE     = '#000008';
export const COLOR_SPIKE    = '#cc3333';
export const COLOR_DOOR     = '#336688';
export const COLOR_DOOR_OPEN= '#223344';
export const COLOR_SWITCH   = '#44aa44';
export const COLOR_CRYSTAL  = '#44eeff';
export const COLOR_KEY      = '#ffdd44';
export const COLOR_PLAYER   = '#55ddff';
export const COLOR_ENEMY    = '#ff6644';
export const COLOR_BOSS     = '#ff3366';
export const COLOR_PROJ_PLAYER = '#88ffff';
export const COLOR_PROJ_ENEMY  = '#ff8833';
export const COLOR_WHITE    = '#e8e8f8';
export const COLOR_YELLOW   = '#ffdd44';
export const COLOR_CYAN     = '#44eeff';
export const COLOR_RED      = '#ff3333';
export const COLOR_GREEN    = '#44cc44';

// Conveyor speed
export const CONVEYOR_SPEED = 60; // px/s

// Font sizes (canvas fonts)
export const FONT_LARGE  = 'bold 12px monospace';
export const FONT_MED    = '9px monospace';
export const FONT_SMALL  = '7px monospace';
