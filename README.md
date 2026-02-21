# Abel and the Time Crystal

A top-down browser adventure game for kids. Fight through 20 decks of a spaceship to seal the Time Crystal before the CHRONOS is lost to eternity.

## How to Play

### Controls
| Action     | Keys           |
|------------|----------------|
| Move       | Arrow Keys / WASD |
| Jump       | Z              |
| Blast      | X              |
| Time Pulse | Space          |
| Pause      | Escape / Enter |
| Confirm    | Enter / Z      |

### Mechanics
- **6 Hearts** — lose hearts from enemies, spikes, and falling in holes
- **Energy bar** — regenerates slowly; spend it on Blast (8) and Time Pulse (50)
- **Jump** — hold Space to arc over holes; land on the far side
- **Time Pulse** — radial shockwave that clears nearby enemy bullets and deals damage
- **Crystals** — collect them for energy + some levels require a threshold to open the boss door
- **Keys** — pick up to unlock the boss door
- **Switches** — walk over them to open the boss door

### Level Structure
- 20 levels in 4 themed groups: Outer Deck, Engineering, Reactor, Command, Time Core
- Each level ends with a boss fight; defeat the boss to advance
- Progress is saved automatically

## Development Setup

### Prerequisites
- Node.js v18+ (LTS)
- npm

### Install & Run
```bash
npm install
npm run dev        # dev server at http://localhost:5173
npm run build      # production build → dist/
npm run preview    # preview the production build
```

### Tech Stack
- **Vite** — bundler / dev server
- **Vanilla TypeScript** — no frameworks
- **HTML5 Canvas 2D** — all rendering
- **WebAudio API** — synthesized SFX (no audio files)
- **localStorage** — save progress

## Project Structure
```
src/
├── main.ts             # Canvas setup + game init
├── constants.ts        # All magic numbers (sizes, speeds, colors)
├── types.ts            # Shared interfaces and enums
├── styles.css          # Pixel-perfect canvas scaling
├── game/
│   ├── Game.ts         # State machine (title/story/play/pause/etc.)
│   ├── GameLoop.ts     # Fixed-timestep requestAnimationFrame loop
│   ├── Input.ts        # Keyboard state (held + justPressed)
│   ├── Camera.ts       # Screen-grid transitions (Pokémon style)
│   ├── Tilemap.ts      # Tile rendering + AABB collision resolution
│   ├── Entity.ts       # Abstract base class for all game objects
│   ├── Player.ts       # Abel: movement, jump, blast, Time Pulse
│   ├── Enemy.ts        # 4 archetypes: Chaser, Patroller, Shooter, Wanderer
│   ├── Boss.ts         # 4 templates: Turret, Brute, Blaster, Summoner
│   ├── Projectile.ts   # Player/enemy bullets with sub-step collision
│   ├── Pickup.ts       # Crystal and Key pickups
│   ├── Particle.ts     # Hit sparks + screen shake
│   ├── Level.ts        # Level loader, entity management, objectives
│   ├── UI.ts           # All screen rendering (HUD, menus, overlays)
│   ├── Audio.ts        # WebAudio oscillator SFX
│   └── Save.ts         # localStorage wrapper
└── data/
    └── levels.ts       # All 20 level definitions
```

## How to Add / Edit Levels

Open `src/data/levels.ts`. Each level is a `LevelDef` object.

### Tile Key
```
.  floor        #  wall         O  hole (jumpable)
^  spike        D  door         S  switch (opens doors)
K  key spawn    C  crystal      P  player start
B  boss marker  >  conveyor →   <  conveyor ←
V  conveyor ↓   A  conveyor ↑   I  ice (slippery)
```

### Screen grid
Each level has a `screens: ScreenDef[][]` (rows × cols). Each `ScreenDef`:
```ts
{
  tiles: string[],    // 13 strings of exactly 20 chars
  enemies: [{ type: EnemyType.Chaser, x: 5, y: 3 }],
}
```
The `x` and `y` in enemy spawns are **tile coordinates** (0–19, 0–12).

### Boss types
- `BossType.Turret` — stationary, rotating barrels (`numBarrels` param)
- `BossType.Brute` — charges at player (`chargeSpeed` param)
- `BossType.Blaster` — strafes + fires spread shots (`speed`, `shootCooldown`)
- `BossType.Summoner` — spawns minions + bullet rings (`spawnRate`, `spawnType`)

Set `enemyScale` to increase enemy HP and speed for later levels (1.0 → 2.0).

## Deployment (Vercel)

1. Push repo to GitHub
2. Import project on [vercel.com](https://vercel.com)
3. Framework preset: **Vite**
4. Build command: `npm run build`
5. Output directory: `dist`
6. Deploy — no environment variables needed

The `vercel.json` in the repo root handles the rest.

## V2 Roadmap
- [ ] Mobile touch controls (on-screen D-pad + buttons)
- [ ] Sprite sheet support (replace colored rectangles with pixel art)
- [ ] Background music (procedural or chiptune)
- [ ] Level select screen (unlock by completing levels)
- [ ] Power-up system (blast upgrade, shield, speed boost)
- [ ] Save per-level crystal scores / star ratings
- [ ] Boss intro cutscene (name card + brief animation)
- [ ] Enemy variety (flying types, splitter enemies)
- [ ] Minimap overlay (toggle with Tab)
- [ ] Gamepad / controller support
- [ ] Screen transitions with wipe/fade effects
- [ ] Sound settings (volume slider)
- [ ] Accessibility: colorblind mode, larger HUD option
- [ ] Leaderboard (Supabase backend for crystal scores)
- [ ] Level editor (in-browser tile painting)
- [ ] New game+ mode (higher enemy scale)
