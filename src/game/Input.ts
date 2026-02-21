// Keyboard input manager.
// Tracks held keys and "just pressed" (rising edge) per frame.

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

export class Input {
  private held = new Set<string>();
  private pressedThisFrame = new Set<string>();
  private releasedThisFrame = new Set<string>();

  constructor() {
    window.addEventListener('keydown', this.onKeyDown);
    window.addEventListener('keyup',   this.onKeyUp);
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
}
