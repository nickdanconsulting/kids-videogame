// Fixed-timestep game loop using requestAnimationFrame.
// update() runs at a fixed 60fps step; render() runs every frame.

export class GameLoop {
  private running = false;
  private rafId = 0;
  private lastTime = 0;
  private readonly fixedStep = 1000 / 60; // ~16.67ms
  private accumulator = 0;

  constructor(
    private readonly onUpdate: (dt: number) => void,
    private readonly onRender: () => void,
    private readonly maxDeltaMs: number = 50,
  ) {}

  start(): void {
    if (this.running) return;
    this.running = true;
    this.lastTime = performance.now();
    this.rafId = requestAnimationFrame(this.tick);
  }

  stop(): void {
    this.running = false;
    cancelAnimationFrame(this.rafId);
  }

  private tick = (now: number): void => {
    if (!this.running) return;

    const raw = now - this.lastTime;
    this.lastTime = now;

    // Clamp to prevent spiral-of-death when tab is backgrounded
    const delta = Math.min(raw, this.maxDeltaMs);
    this.accumulator += delta;

    // Run fixed-step updates
    while (this.accumulator >= this.fixedStep) {
      this.onUpdate(this.fixedStep / 1000); // pass seconds
      this.accumulator -= this.fixedStep;
    }

    this.onRender();
    this.rafId = requestAnimationFrame(this.tick);
  };
}
