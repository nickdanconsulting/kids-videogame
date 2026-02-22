// Keyboard + touch input manager.
// Tracks held keys and "just pressed" (rising edge) per frame.
// Touch controls use DOM overlay elements and feed into the same held/pressed sets.

type Action =
  | 'up' | 'down' | 'left' | 'right'
  | 'jump' | 'blast' | 'pulse'
  | 'pause' | 'confirm' | 'select' | 'debug';

const BINDINGS: Record<Action, string[]> = {
  up:      ['ArrowUp',    'KeyW'],
  down:    ['ArrowDown',  'KeyS'],
  left:    ['ArrowLeft',  'KeyA'],
  right:   ['ArrowRight', 'KeyD'],
  jump:    ['KeyZ'],
  blast:   ['KeyX'],
  pulse:   ['Space'],
  pause:   ['Escape'],
  confirm: ['Enter', 'KeyZ'],
  select:  ['ShiftRight', 'Backspace'],
  debug:   ['Backquote'],
};

// All codes that should prevent default browser behavior
const PREVENT_DEFAULT = new Set([
  'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight',
  'Space', 'Enter', 'Backquote',
]);

// D-pad direction-to-code mapping
const DPAD_CODES: Record<string, string> = {
  up: 'ArrowUp',
  down: 'ArrowDown',
  left: 'ArrowLeft',
  right: 'ArrowRight',
};

export class Input {
  private held = new Set<string>();
  private pressedThisFrame = new Set<string>();
  private releasedThisFrame = new Set<string>();

  private _isTouchDevice = false;

  // Track which codes each active touch is holding (by touch identifier)
  private touchHeld = new Map<number, Set<string>>();

  get showTouchControls(): boolean { return this._isTouchDevice; }

  constructor(_canvas?: HTMLCanvasElement) {
    window.addEventListener('keydown', this.onKeyDown);
    window.addEventListener('keyup',   this.onKeyUp);

    if ('ontouchstart' in window || navigator.maxTouchPoints > 0) {
      this._isTouchDevice = true;
      this.setupTouchControls();
    }
  }

  /** Call once per logical update tick to clear frame-scoped sets. */
  update(): void {
    this.pressedThisFrame.clear();
    this.releasedThisFrame.clear();
  }

  isHeld(action: Action): boolean {
    return BINDINGS[action].some(code => this.held.has(code));
  }

  justPressed(action: Action): boolean {
    return BINDINGS[action].some(code => this.pressedThisFrame.has(code));
  }

  // ---- Keyboard ----

  private onKeyDown = (e: KeyboardEvent): void => {
    if (PREVENT_DEFAULT.has(e.code)) e.preventDefault();
    if (!this.held.has(e.code)) {
      this.pressedThisFrame.add(e.code);
    }
    this.held.add(e.code);
  };

  private onKeyUp = (e: KeyboardEvent): void => {
    this.held.delete(e.code);
    this.releasedThisFrame.add(e.code);
  };

  // ---- Touch (DOM overlay) ----

  private setupTouchControls(): void {
    const container = document.getElementById('touch-controls');
    if (!container) return;

    container.classList.add('touch-active');

    // Action buttons
    const buttons = container.querySelectorAll<HTMLElement>('.touch-btn');
    for (const btn of buttons) {
      const code = btn.dataset.code;
      if (!code) continue;

      btn.addEventListener('touchstart', (e) => {
        e.preventDefault();
        for (let i = 0; i < e.changedTouches.length; i++) {
          const t = e.changedTouches[i]!;
          this.touchPress(t.identifier, code);
        }
        btn.classList.add('active');
      }, { passive: false });

      btn.addEventListener('touchend', (e) => {
        e.preventDefault();
        for (let i = 0; i < e.changedTouches.length; i++) {
          const t = e.changedTouches[i]!;
          this.touchRelease(t.identifier, code);
        }
        btn.classList.remove('active');
      }, { passive: false });

      btn.addEventListener('touchcancel', (e) => {
        e.preventDefault();
        for (let i = 0; i < e.changedTouches.length; i++) {
          const t = e.changedTouches[i]!;
          this.touchRelease(t.identifier, code);
        }
        btn.classList.remove('active');
      }, { passive: false });
    }

    // D-pad — angle-from-center approach
    const dpad = document.getElementById('touch-dpad');
    if (!dpad) return;

    dpad.addEventListener('touchstart', (e) => {
      e.preventDefault();
      for (let i = 0; i < e.changedTouches.length; i++) {
        const t = e.changedTouches[i]!;
        this.handleDpadTouch(dpad, t);
      }
    }, { passive: false });

    dpad.addEventListener('touchmove', (e) => {
      e.preventDefault();
      for (let i = 0; i < e.changedTouches.length; i++) {
        const t = e.changedTouches[i]!;
        this.handleDpadTouch(dpad, t);
      }
    }, { passive: false });

    const dpadEnd = (e: TouchEvent) => {
      e.preventDefault();
      for (let i = 0; i < e.changedTouches.length; i++) {
        const t = e.changedTouches[i]!;
        this.releaseDpadTouch(t.identifier);
      }
    };

    dpad.addEventListener('touchend', dpadEnd, { passive: false });
    dpad.addEventListener('touchcancel', dpadEnd, { passive: false });
  }

  private handleDpadTouch(dpad: HTMLElement, touch: Touch): void {
    const rect = dpad.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = touch.clientX - cx;
    const dy = touch.clientY - cy;

    // Dead zone — if touch is very near center, release all directions
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist < 8) {
      this.releaseDpadTouch(touch.identifier);
      return;
    }

    const angle = Math.atan2(dy, dx); // -PI to PI

    // Determine which directions are active
    // Use 67.5-degree sectors (allowing diagonals with overlap)
    const newDirs = new Set<string>();

    // Right: -67.5 to 67.5 degrees
    if (angle > -1.178 && angle < 1.178) newDirs.add('right');
    // Left: |angle| > 112.5 degrees
    if (angle > 1.963 || angle < -1.963) newDirs.add('left');
    // Down: 22.5 to 157.5 degrees
    if (angle > 0.393 && angle < 2.749) newDirs.add('down');
    // Up: -157.5 to -22.5 degrees
    if (angle > -2.749 && angle < -0.393) newDirs.add('up');

    // Get previous directions for this touch
    const prevCodes = this.touchHeld.get(touch.identifier) ?? new Set<string>();
    const newCodes = new Set<string>();
    for (const dir of newDirs) {
      const code = DPAD_CODES[dir];
      if (code) newCodes.add(code);
    }

    // Release directions no longer held
    for (const code of prevCodes) {
      if (!newCodes.has(code) && !this.isCodeHeldByOtherTouch(code, touch.identifier)) {
        this.held.delete(code);
        this.releasedThisFrame.add(code);
      }
    }

    // Press newly held directions
    for (const code of newCodes) {
      if (!this.held.has(code)) {
        this.pressedThisFrame.add(code);
      }
      this.held.add(code);
    }

    this.touchHeld.set(touch.identifier, newCodes);
  }

  private releaseDpadTouch(touchId: number): void {
    const codes = this.touchHeld.get(touchId);
    if (!codes) return;
    this.touchHeld.delete(touchId);
    for (const code of codes) {
      if (!this.isCodeHeldByOtherTouch(code, touchId)) {
        this.held.delete(code);
        this.releasedThisFrame.add(code);
      }
    }
  }

  private touchPress(touchId: number, code: string): void {
    let codes = this.touchHeld.get(touchId);
    if (!codes) {
      codes = new Set<string>();
      this.touchHeld.set(touchId, codes);
    }
    codes.add(code);
    if (!this.held.has(code)) {
      this.pressedThisFrame.add(code);
    }
    this.held.add(code);
  }

  private touchRelease(touchId: number, code: string): void {
    const codes = this.touchHeld.get(touchId);
    if (codes) {
      codes.delete(code);
      if (codes.size === 0) this.touchHeld.delete(touchId);
    }
    if (!this.isCodeHeldByOtherTouch(code, touchId)) {
      this.held.delete(code);
      this.releasedThisFrame.add(code);
    }
  }

  private isCodeHeldByOtherTouch(code: string, excludeId: number): boolean {
    for (const [id, codes] of this.touchHeld) {
      if (id !== excludeId && codes.has(code)) return true;
    }
    return false;
  }
}
