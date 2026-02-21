// Procedural WebAudio music engine.
// 4-voice synthesizer with pattern-based sequencer.
// Shares AudioContext with SFX system.

import { TRACKS, TrackDef, patternToFreqs } from '../data/tracks';

export class MusicEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private muted = false;

  // Current track state
  private currentTrackId: string | null = null;
  private track: TrackDef | null = null;
  private patternIndex = 0;
  private stepIndex = 0;
  private stepTimer = 0;
  private stepDuration = 0; // seconds per step

  // Voice oscillators (recreated per note)
  private voices: {
    bass: { osc: OscillatorNode | null; gain: GainNode | null };
    pad: { osc: OscillatorNode | null; gain: GainNode | null };
    lead: { osc: OscillatorNode | null; gain: GainNode | null };
    arp: { osc: OscillatorNode | null; gain: GainNode | null };
  } = {
    bass: { osc: null, gain: null },
    pad: { osc: null, gain: null },
    lead: { osc: null, gain: null },
    arp: { osc: null, gain: null },
  };

  // Crossfade
  private fadeOutGain: GainNode | null = null;
  private fadeTimer = 0;

  setContext(ctx: AudioContext): void {
    this.ctx = ctx;
    this.masterGain = ctx.createGain();
    this.masterGain.gain.value = this.muted ? 0 : 1;
    this.masterGain.connect(ctx.destination);
  }

  setMuted(muted: boolean): void {
    this.muted = muted;
    if (this.masterGain) {
      this.masterGain.gain.value = muted ? 0 : 1;
    }
  }

  play(trackId: string): void {
    if (trackId === this.currentTrackId) return;
    const newTrack = TRACKS[trackId];
    if (!newTrack) return;

    // Stop current voices
    this.stopVoices();

    this.currentTrackId = trackId;
    this.track = newTrack;
    this.patternIndex = 0;
    this.stepIndex = 0;
    this.stepTimer = 0;
    this.stepDuration = 60 / newTrack.bpm / 4; // 16th note duration
  }

  stop(): void {
    this.stopVoices();
    this.currentTrackId = null;
    this.track = null;
  }

  update(dt: number): void {
    if (!this.ctx || !this.track || !this.masterGain) return;
    if (this.ctx.state === 'suspended') return;

    this.stepTimer += dt;

    while (this.stepTimer >= this.stepDuration && this.stepDuration > 0) {
      this.stepTimer -= this.stepDuration;
      this.playStep();
      this.stepIndex++;
      if (this.stepIndex >= 16) {
        this.stepIndex = 0;
        this.patternIndex = (this.patternIndex + 1) % this.track.patterns.length;
      }
    }
  }

  private playStep(): void {
    if (!this.ctx || !this.track || !this.masterGain) return;

    const pattern = this.track.patterns[this.patternIndex]!;
    const t = this.ctx.currentTime;
    const dur = this.stepDuration * 0.9; // slightly shorter than step for articulation

    // Convert pattern notes to frequencies
    const bassFreqs = patternToFreqs(pattern.bass);
    const padFreqs = patternToFreqs(pattern.pad);
    const leadFreqs = patternToFreqs(pattern.lead);
    const arpFreqs = patternToFreqs(pattern.arp);

    const bassNote = bassFreqs[this.stepIndex] ?? null;
    const padNote = padFreqs[this.stepIndex] ?? null;
    const leadNote = leadFreqs[this.stepIndex] ?? null;
    const arpNote = arpFreqs[this.stepIndex] ?? null;

    if (bassNote !== null) {
      this.playNote(t, bassNote, 'sine', this.track.bassVol, dur * 2, this.masterGain);
    }
    if (padNote !== null) {
      this.playNote(t, padNote, 'triangle', this.track.padVol, dur * 4, this.masterGain);
    }
    if (leadNote !== null) {
      this.playNote(t, leadNote, 'square', this.track.leadVol, dur, this.masterGain);
    }
    if (arpNote !== null) {
      this.playNote(t, arpNote, 'sawtooth', this.track.arpVol, dur * 0.6, this.masterGain);
    }
  }

  private playNote(
    t: number,
    freq: number,
    type: OscillatorType,
    vol: number,
    dur: number,
    dest: GainNode,
  ): void {
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, t);

    gain.gain.setValueAtTime(vol, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + dur);

    osc.connect(gain);
    gain.connect(dest);
    osc.start(t);
    osc.stop(t + dur + 0.01);
  }

  private stopVoices(): void {
    for (const voice of Object.values(this.voices)) {
      try {
        voice.osc?.stop();
      } catch {
        // Already stopped
      }
      voice.osc = null;
      voice.gain = null;
    }
  }
}
