// WebAudio oscillator-based SFX. No external files needed.
// All sounds are synthesized from oscillators and noise.

type SoundId =
  | 'player_shoot'
  | 'player_hit'
  | 'player_jump'
  | 'enemy_hit'
  | 'enemy_die'
  | 'boss_hit'
  | 'boss_die'
  | 'crystal_pickup'
  | 'key_pickup'
  | 'time_pulse'
  | 'level_complete'
  | 'game_over'
  | 'ui_confirm'
  | 'ui_move';

export class Audio {
  private ctx: AudioContext | null = null;
  muted = false;

  /** Must call after first user gesture */
  private ensureCtx(): AudioContext | null {
    if (this.muted) return null;
    if (!this.ctx) {
      try {
        this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      } catch {
        return null;
      }
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  /** Expose AudioContext for music engine (creates if needed). */
  getContext(): AudioContext | null {
    if (!this.ctx) {
      try {
        this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      } catch {
        return null;
      }
    }
    return this.ctx;
  }

  play(id: SoundId): void {
    const ctx = this.ensureCtx();
    if (!ctx) return;
    const t = ctx.currentTime;
    switch (id) {
      case 'player_shoot':  this.playBlip(ctx, t, 880, 0.05, 'square', 0.06); break;
      case 'player_hit':    this.playHit(ctx, t, 200, 0.15); break;
      case 'player_jump':   this.playBlip(ctx, t, 440, 0.08, 'sine', 0.1, 660); break;
      case 'enemy_hit':     this.playBlip(ctx, t, 330, 0.06, 'square', 0.08); break;
      case 'enemy_die':     this.playHit(ctx, t, 150, 0.1); break;
      case 'boss_hit':      this.playHit(ctx, t, 110, 0.2); break;
      case 'boss_die':      this.playFanfare(ctx, t, false); break;
      case 'crystal_pickup':this.playBlip(ctx, t, 1320, 0.06, 'sine', 0.12); break;
      case 'key_pickup':    this.playBlip(ctx, t, 990, 0.1, 'sine', 0.15, 1320); break;
      case 'time_pulse':    this.playPulse(ctx, t); break;
      case 'level_complete':this.playFanfare(ctx, t, true); break;
      case 'game_over':     this.playGameOver(ctx, t); break;
      case 'ui_confirm':    this.playBlip(ctx, t, 660, 0.05, 'square', 0.08); break;
      case 'ui_move':       this.playBlip(ctx, t, 440, 0.03, 'square', 0.04); break;
    }
  }

  private master(ctx: AudioContext): GainNode {
    const g = ctx.createGain();
    g.gain.value = 0.25;
    g.connect(ctx.destination);
    return g;
  }

  private playBlip(
    ctx: AudioContext,
    t: number,
    freq: number,
    vol: number,
    type: OscillatorType,
    dur: number,
    endFreq?: number,
  ): void {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const m = this.master(ctx);

    osc.type = type;
    osc.frequency.setValueAtTime(freq, t);
    if (endFreq !== undefined) osc.frequency.linearRampToValueAtTime(endFreq, t + dur);

    gain.gain.setValueAtTime(vol, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + dur);

    osc.connect(gain);
    gain.connect(m);
    osc.start(t);
    osc.stop(t + dur);
  }

  private playHit(ctx: AudioContext, t: number, freq: number, vol: number): void {
    // Noise burst
    const bufSize = ctx.sampleRate * 0.15;
    const buf = ctx.createBuffer(1, bufSize, ctx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < bufSize; i++) data[i] = Math.random() * 2 - 1;

    const src = ctx.createBufferSource();
    src.buffer = buf;

    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.value = freq;
    filter.Q.value = 2;

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(vol, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.15);

    const m = this.master(ctx);
    src.connect(filter);
    filter.connect(gain);
    gain.connect(m);
    src.start(t);
    src.stop(t + 0.15);
  }

  private playPulse(ctx: AudioContext, t: number): void {
    for (let i = 0; i < 3; i++) {
      const freq = 440 / (1 + i * 0.5);
      this.playBlip(ctx, t + i * 0.05, freq, 0.15, 'sawtooth', 0.3, freq * 0.3);
    }
  }

  private playFanfare(ctx: AudioContext, t: number, win: boolean): void {
    const notes = win
      ? [523, 659, 784, 1047]
      : [330, 277, 220, 185];
    notes.forEach((freq, i) => {
      this.playBlip(ctx, t + i * 0.12, freq, 0.12, 'square', 0.1);
    });
  }

  private playGameOver(ctx: AudioContext, t: number): void {
    const notes = [440, 330, 220, 165];
    notes.forEach((freq, i) => {
      this.playBlip(ctx, t + i * 0.18, freq, 0.12, 'sawtooth', 0.16);
    });
  }
}
