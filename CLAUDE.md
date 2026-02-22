# Abel and the Time Crystal — Claude Code Instructions

## Project
Top-down browser adventure game for kids. 20 levels across a spaceship. Vanilla TypeScript + HTML5 Canvas 2D.

## Stack
- Vite + Vanilla TypeScript (no frameworks)
- HTML5 Canvas 2D rendering
- WebAudio API (oscillator SFX, no audio files)
- localStorage for save data
- Deploy: Vercel (static site, no backend)

## Commands
- `npm run dev` — dev server at localhost:5173
- `npm run build` — `tsc && vite build` → dist/
- `npm run preview` — preview production build

## Live URL
https://kids-videogame.vercel.app/

## Architecture
- Virtual resolution: 320x240, tile size: 16px, screen: 20x13 tiles
- HUD: top 16px strip; playfield below
- Camera: screen-grid transitions (Pokemon style), 280ms ease-in-out tween
- State machine in Game.ts: Title/Story/Play/Pause/LevelComplete/GameOver/GameComplete
- Fixed timestep game loop (60fps steps, clamped to 50ms)

## Key Files
- `src/main.ts` — canvas setup + game init
- `src/game/Game.ts` — state machine orchestrator
- `src/data/levels.ts` — all 20 level definitions
- `src/constants.ts` — sizes, colors, speeds
- `src/types.ts` — shared interfaces and enums

## Tile Key (levels.ts)
```
.  floor    #  wall     O  hole     ^  spike    D  door
S  switch   K  key      C  crystal  P  player   B  boss
>  conv-R   <  conv-L   V  conv-D   A  conv-U   I  ice
```

## Level Format
Each level: `screens: ScreenDef[][]` (rows x cols). Each screen has `tiles: string[]` (13 strings of 20 chars) and `enemies: [{type, x, y}]` in tile coords.

## Boss Types
Turret (stationary), Brute (charges), Blaster (strafe+spread), Summoner (spawns minions)

## V3 Status
Complete and building clean. Deployed on Vercel.

### V2 Changes
- Mobile touch controls via DOM overlay (D-pad + action buttons)
- Difficulty tuning: HP regen, Mom/Dad NPCs

### V3 Changes
- Touch controls moved from canvas-rendered to real HTML DOM elements (properly thumb-sized)
- Boss difficulty rebalanced across all 20 levels (HP, speed, cooldowns, phase scaling)
- Boss rooms redesigned with wall pillars and environmental hazards for strategic cover
- BossParams extended with `contactDamage` and `maxMinions`
- Minion cap enforcement for Summoner bosses
- Enemy scales reduced across all level tiers

## Guidelines
- Keep the game lightweight — no heavy dependencies
- All SFX via WebAudio oscillators, no audio files
- Test changes with `npm run build` to catch TypeScript errors
- Tile maps are 20 chars wide x 13 rows per screen — maintain exact dimensions when editing levels
