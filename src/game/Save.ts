// localStorage save/load. Gracefully handles unavailable storage.

const KEY_LEVEL     = 'abel_highest_level';
const KEY_MUTE      = 'abel_muted';
const KEY_CHARACTER  = 'abel_character';
const KEY_LAST_PLAYED = 'abel_last_played';

export class Save {
  private _highestLevel = 1;
  private _muted = false;
  private _character = 'abel';
  private _lastPlayed = 1;

  constructor() {
    this.load();
  }

  private load(): void {
    try {
      const lvl = localStorage.getItem(KEY_LEVEL);
      if (lvl !== null) this._highestLevel = Math.max(1, parseInt(lvl, 10) || 1);
      const mute = localStorage.getItem(KEY_MUTE);
      if (mute !== null) this._muted = mute === 'true';
      const char = localStorage.getItem(KEY_CHARACTER);
      if (char !== null) this._character = char;
      const last = localStorage.getItem(KEY_LAST_PLAYED);
      if (last !== null) this._lastPlayed = Math.max(1, parseInt(last, 10) || 1);
    } catch {
      // Storage unavailable — use defaults
    }
  }

  private save(): void {
    try {
      localStorage.setItem(KEY_LEVEL, String(this._highestLevel));
      localStorage.setItem(KEY_MUTE, String(this._muted));
      localStorage.setItem(KEY_CHARACTER, this._character);
      localStorage.setItem(KEY_LAST_PLAYED, String(this._lastPlayed));
    } catch {
      // Storage unavailable — silently ignore
    }
  }

  get highestUnlockedLevel(): number { return this._highestLevel; }
  get muted(): boolean { return this._muted; }
  get character(): string { return this._character; }
  get lastPlayedLevel(): number { return this._lastPlayed; }

  hasSave(): boolean { return this._highestLevel > 1; }

  setCharacter(id: string): void {
    this._character = id;
    this.save();
  }

  unlockLevel(id: number): void {
    if (id > this._highestLevel && id <= 20) {
      this._highestLevel = id;
    }
    this._lastPlayed = id;
    this.save();
  }

  // Not used yet but available for future score tracking
  saveHighScore(_levelId: number, _crystals: number): void {
    // TODO: persist per-level crystal scores in V2
  }

  toggleMute(): boolean {
    this._muted = !this._muted;
    this.save();
    return this._muted;
  }

  clearAll(): void {
    try {
      localStorage.removeItem(KEY_LEVEL);
      localStorage.removeItem(KEY_MUTE);
      localStorage.removeItem(KEY_CHARACTER);
      localStorage.removeItem(KEY_LAST_PLAYED);
    } catch {
      //
    }
    this._highestLevel = 1;
    this._muted = false;
    this._character = 'abel';
    this._lastPlayed = 1;
  }
}
