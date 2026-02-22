// Keyboard + touch input manager.
// Tracks held keys and "just pressed" (rising edge) per frame.
// Touch controls inject synthetic key codes into the same held/pressed sets.

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

// Touch zone definitions in virtual (320x240) coordinates
interface TouchZone {
  x: number; y: number; w: number; h: number;
  codes: string[];
}

const TOUCH_ZONES: TouchZone[] = [
  // D-pad (bottom-left, centered on 40,200)
  { x: 22, y: 162, w: 36, h: 30, codes: ['ArrowUp'] },
  { x: 22, y: 208, w: 36, h: 30, codes: ['ArrowDown'] },
  { x: 2,  y: 182, w: 30, h: 36, codes: ['ArrowLeft'] },
  { x: 48, y: 182, w: 30, h: 36, codes: ['ArrowRight'] },
  // Action buttons (bottom-right)
  { x: 258, y: 198, w: 28, h: 28, codes: ['KeyZ'] },      // Jump
  { x: 286, y: 176, w: 28, h: 28, codes: ['KeyX'] },      // Blast
  { x: 258, y: 164, w: 28, h: 28, codes: ['Space'] },     // Pulse
  { x: 290, y: 148, w: 22, h: 22, codes: ['Escape'] },    // Pause
];

export class Input {
  private held = new Set<string>();
  private pressedThisFrame = new Set<string>();
  private releasedThisFrame = new Set<string>();

  // Touch state
  private canvas: HTMLCanvasElement | null = null;
  private activeTouches = new Map<number, string[]>();
  private _isTouchDevice = false;

  get showTouchControls(): boolean { return this._isTouchDevice; }

  constructor(canvas?: HTMLCanvasElement) {
    window.addEventListener('keydown', this.onKeyDown);
    window.addEventListener('keyup',   this.onKeyUp);

    if (canvas && ('ontouchstart' in window || navigator.maxTouchPoints > 0)) {
      this.canvas = canvas;
      this._isTouchDevice = true;
      canvas.addEventListener('touchstart',  this.onTouchStart, { passive: false });
      canvas.addEventListener('touchmove',   this.onTouchMove,  { passive: false });
      canvas.addEventListener('touchend',    this.onTouchEnd,   { passive: false });
      canvas.addEventListener('touchcancel', this.onTouchEnd,   { passive: false });
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

  // ---- Touch ----

  private screenToVirtual(clientX: number, clientY: number): { x: number; y: number } {
    const rect = this.canvas!.getBoundingClientRect();
    return {
      x: ((clientX - rect.left) / rect.width) * 320,
      y: ((clientY - rect.top) / rect.height) * 240,
    };
  }

  private hitTest(vx: number, vy: number): string[] {
    const codes: string[] = [];
    for (const zone of TOUCH_ZONES) {
      if (vx >= zone.x && vx < zone.x + zone.w &&
          vy >= zone.y && vy < zone.y + zone.h) {
        codes.push(...zone.codes);
      }
    }
    return codes;
  }

  private isCodeHeldByOtherTouch(code: string, excludeId: number): boolean {
    for (const [id, codes] of this.activeTouches) {
      if (id !== excludeId && codes.includes(code)) return true;
    }
    return false;
  }

  private onTouchStart = (e: TouchEvent): void => {
    e.preventDefault();
    for (let i = 0; i < e.changedTouches.length; i++) {
      const t = e.changedTouches[i]!;
      const v = this.screenToVirtual(t.clientX, t.clientY);
      const codes = this.hitTest(v.x, v.y);
      this.activeTouches.set(t.identifier, codes);
      for (const code of codes) {
        if (!this.held.has(code)) this.pressedThisFrame.add(code);
        this.held.add(code);
      }
    }
  };

  private onTouchMove = (e: TouchEvent): void => {
    e.preventDefault();
    for (let i = 0; i < e.changedTouches.length; i++) {
      const t = e.changedTouches[i]!;
      const v = this.screenToVirtual(t.clientX, t.clientY);
      const oldCodes = this.activeTouches.get(t.identifier) ?? [];
      const newCodes = this.hitTest(v.x, v.y);

      // Release codes no longer under this touch
      for (const code of oldCodes) {
        if (!newCodes.includes(code) && !this.isCodeHeldByOtherTouch(code, t.identifier)) {
          this.held.delete(code);
        }
      }
      // Press newly entered codes
      for (const code of newCodes) {
        if (!this.held.has(code)) this.pressedThisFrame.add(code);
        this.held.add(code);
      }
      this.activeTouches.set(t.identifier, newCodes);
    }
  };

  private onTouchEnd = (e: TouchEvent): void => {
    e.preventDefault();
    for (let i = 0; i < e.changedTouches.length; i++) {
      const t = e.changedTouches[i]!;
      const codes = this.activeTouches.get(t.identifier) ?? [];
      this.activeTouches.delete(t.identifier);
      for (const code of codes) {
        if (!this.isCodeHeldByOtherTouch(code, t.identifier)) {
          this.held.delete(code);
          this.releasedThisFrame.add(code);
        }
      }
    }
  };
}
