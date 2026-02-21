// Character definitions for the 3 playable characters.
// Each has a unique palette that replaces PLAYER_PALETTE at runtime.

import { Palette } from '../sprites/SpriteRenderer';

export interface CharacterDef {
  id: string;
  name: string;
  palette: Palette;
  projColor: string;     // projectile trail/glow color
  projBright: string;     // projectile bright highlight
  description: string;
}

// Abel — default cyan space suit
const ABEL_PALETTE: Palette = {
  'H': '#334466', 'h': '#445588',
  'V': '#88ddff', 'v': '#aaeeff',
  'B': '#3388aa', 'b': '#44aacc',
  'S': '#225577', 's': '#2a6688',
  'G': '#bbddee', 'g': '#ddeeff',
  'A': '#446688', 'a': '#557799',
  'L': '#223355', 'l': '#334466',
  'F': '#1a2844',
  'E': '#001122', 'e': '#112233',
  'W': '#ffffff',
};

// Saint — gold/warm bronze suit
const SAINT_PALETTE: Palette = {
  'H': '#554422', 'h': '#665533',
  'V': '#ffdd66', 'v': '#ffee88',
  'B': '#aa8833', 'b': '#ccaa44',
  'S': '#775522', 's': '#886633',
  'G': '#eeddbb', 'g': '#ffeecc',
  'A': '#886644', 'a': '#997755',
  'L': '#553322', 'l': '#664433',
  'F': '#3a2818',
  'E': '#221100', 'e': '#332211',
  'W': '#ffffff',
};

// Riah — pink/magenta suit
const RIAH_PALETTE: Palette = {
  'H': '#553355', 'h': '#664466',
  'V': '#ff88cc', 'v': '#ffaadd',
  'B': '#aa3388', 'b': '#cc44aa',
  'S': '#772255', 's': '#882266',
  'G': '#eeccee', 'g': '#ffddff',
  'A': '#884466', 'a': '#995577',
  'L': '#442244', 'l': '#553355',
  'F': '#2a1830',
  'E': '#110022', 'e': '#221133',
  'W': '#ffffff',
};

export const CHARACTERS: CharacterDef[] = [
  {
    id: 'abel',
    name: 'ABEL',
    palette: ABEL_PALETTE,
    projColor: '#44eeff',
    projBright: '#88ffff',
    description: 'Engineer. Balanced.',
  },
  {
    id: 'saint',
    name: 'SAINT',
    palette: SAINT_PALETTE,
    projColor: '#ffdd44',
    projBright: '#ffee88',
    description: 'Navigator. Bold.',
  },
  {
    id: 'riah',
    name: 'RIAH',
    palette: RIAH_PALETTE,
    projColor: '#ff66aa',
    projBright: '#ff99cc',
    description: 'Pilot. Fearless.',
  },
];

export function getCharacter(id: string): CharacterDef {
  return CHARACTERS.find(c => c.id === id) ?? CHARACTERS[0]!;
}
