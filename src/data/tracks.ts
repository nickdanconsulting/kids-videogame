// Procedural music track definitions.
// Each track has a BPM, key, and patterns for 4 voices.
// Pattern values are MIDI-style note numbers (null = rest).
// Notes: C3=48, D3=50, E3=52, F3=53, G3=55, A3=57, B3=59
//        C4=60, D4=62, E4=64, F4=65, G4=67, A4=69, B4=71
//        C5=72, D5=74, E5=76

function midiToFreq(note: number): number {
  return 440 * Math.pow(2, (note - 69) / 12);
}

export interface TrackPattern {
  bass: (number | null)[];      // 16-step, note numbers
  pad: (number | null)[];       // 16-step
  lead: (number | null)[];      // 16-step
  arp: (number | null)[];       // 16-step
}

export interface TrackDef {
  id: string;
  bpm: number;
  patterns: TrackPattern[];     // cycle through these patterns
  bassVol: number;
  padVol: number;
  leadVol: number;
  arpVol: number;
}

// Helper: convert pattern of MIDI notes to frequencies
export function patternToFreqs(pattern: (number | null)[]): (number | null)[] {
  return pattern.map(n => n !== null ? midiToFreq(n) : null);
}

// ============================================================
// EXPLORATION — calm, arpeggiated synth, Am key
// ============================================================
const EXPLORE_P1: TrackPattern = {
  bass: [57, null, null, null, 57, null, null, null, 52, null, null, null, 52, null, null, null],
  pad:  [57, null, null, null, null, null, null, null, 52, null, null, null, null, null, null, null],
  lead: [null, null, 69, null, null, 72, null, null, null, null, 64, null, null, 67, null, null],
  arp:  [69, null, 72, null, 76, null, 72, null, 64, null, 67, null, 71, null, 67, null],
};

const EXPLORE_P2: TrackPattern = {
  bass: [53, null, null, null, 53, null, null, null, 55, null, null, null, 55, null, null, null],
  pad:  [53, null, null, null, null, null, null, null, 55, null, null, null, null, null, null, null],
  lead: [null, null, 65, null, null, 69, null, null, null, null, 67, null, null, 71, null, null],
  arp:  [65, null, 69, null, 72, null, 69, null, 67, null, 71, null, 74, null, 71, null],
};

// ============================================================
// TENSION — faster, driving, Em key
// ============================================================
const TENSION_P1: TrackPattern = {
  bass: [40, null, 40, null, 40, null, null, 43, 40, null, 40, null, 40, null, null, 43],
  pad:  [52, null, null, null, null, null, null, null, 55, null, null, null, null, null, null, null],
  lead: [64, null, null, 67, null, null, 71, null, 64, null, null, 67, null, null, 71, null],
  arp:  [76, 71, 76, 71, 79, 76, 71, 76, 74, 71, 74, 71, 76, 74, 71, 74],
};

const TENSION_P2: TrackPattern = {
  bass: [43, null, 43, null, 43, null, null, 45, 43, null, 43, null, 43, null, null, 40],
  pad:  [55, null, null, null, null, null, null, null, 52, null, null, null, null, null, null, null],
  lead: [67, null, null, 71, null, null, 74, null, 67, null, null, 64, null, null, 67, null],
  arp:  [79, 74, 79, 74, 76, 74, 71, 74, 76, 71, 76, 71, 79, 76, 74, 71],
};

// ============================================================
// BOSS — heavy, aggressive, Dm key
// ============================================================
const BOSS_P1: TrackPattern = {
  bass: [38, null, 38, 38, null, 38, null, 38, 38, null, 38, 38, null, 38, null, 41],
  pad:  [50, null, null, null, 53, null, null, null, 50, null, null, null, 53, null, null, null],
  lead: [62, null, 65, null, 69, null, 65, null, 62, null, 65, null, 62, null, 57, null],
  arp:  [74, 69, 74, 69, 77, 74, 69, 74, 74, 69, 74, 69, 77, 74, 69, 65],
};

const BOSS_P2: TrackPattern = {
  bass: [41, null, 41, 41, null, 41, null, 38, 41, null, 41, 41, null, 41, null, 38],
  pad:  [53, null, null, null, 50, null, null, null, 53, null, null, null, 50, null, null, null],
  lead: [65, null, 69, null, 74, null, 69, null, 65, null, 69, null, 65, null, 62, null],
  arp:  [77, 74, 77, 74, 74, 77, 74, 69, 77, 74, 77, 74, 74, 77, 74, 69],
};

// ============================================================
// VICTORY — major key fanfare, C major
// ============================================================
const VICTORY_P1: TrackPattern = {
  bass: [48, null, null, null, 48, null, null, null, 55, null, null, null, 55, null, null, null],
  pad:  [60, null, null, null, null, null, null, null, 55, null, null, null, null, null, null, null],
  lead: [72, null, 76, null, 79, null, null, 84, null, null, 79, null, 76, null, null, null],
  arp:  [72, 76, 79, 76, 84, 79, 76, 79, 67, 71, 74, 71, 79, 74, 71, 74],
};

export const TRACKS: Record<string, TrackDef> = {
  exploration: {
    id: 'exploration',
    bpm: 110,
    patterns: [EXPLORE_P1, EXPLORE_P2],
    bassVol: 0.08, padVol: 0.04, leadVol: 0.06, arpVol: 0.05,
  },
  tension: {
    id: 'tension',
    bpm: 130,
    patterns: [TENSION_P1, TENSION_P2],
    bassVol: 0.10, padVol: 0.05, leadVol: 0.07, arpVol: 0.06,
  },
  boss: {
    id: 'boss',
    bpm: 140,
    patterns: [BOSS_P1, BOSS_P2],
    bassVol: 0.12, padVol: 0.06, leadVol: 0.08, arpVol: 0.07,
  },
  victory: {
    id: 'victory',
    bpm: 120,
    patterns: [VICTORY_P1],
    bassVol: 0.08, padVol: 0.05, leadVol: 0.08, arpVol: 0.06,
  },
};
