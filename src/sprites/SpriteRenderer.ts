// SpriteRenderer: bakes string-array sprite definitions to OffscreenCanvas,
// then blits them with drawImage() at runtime.

export type Palette = Record<string, string>;

export class SpriteRenderer {
  private cache = new Map<string, OffscreenCanvas>();

  /** Register a sprite from a string-array definition + palette mapping. */
  register(name: string, data: string[], palette: Palette): void {
    const h = data.length;
    const w = data[0]?.length ?? 0;
    const oc = new OffscreenCanvas(w, h);
    const octx = oc.getContext('2d')!;

    for (let y = 0; y < h; y++) {
      const row = data[y]!;
      for (let x = 0; x < w; x++) {
        const ch = row[x]!;
        const color = palette[ch];
        if (color) {
          octx.fillStyle = color;
          octx.fillRect(x, y, 1, 1);
        }
        // Transparent if no palette entry (space or unmapped char)
      }
    }

    this.cache.set(name, oc);
  }

  /** Register a horizontally-mirrored copy of an existing sprite. */
  registerMirrored(newName: string, sourceName: string): void {
    const src = this.cache.get(sourceName);
    if (!src) return;
    const w = src.width;
    const h = src.height;
    const oc = new OffscreenCanvas(w, h);
    const octx = oc.getContext('2d')!;
    octx.translate(w, 0);
    octx.scale(-1, 1);
    octx.drawImage(src, 0, 0);
    this.cache.set(newName, oc);
  }

  /** Register a palette-swapped variant from existing sprite data. */
  registerVariant(
    newName: string,
    data: string[],
    palette: Palette,
  ): void {
    // Same as register — just uses a different palette on the same data
    this.register(newName, data, palette);
  }

  /** Draw a sprite at (x, y) on the target context. */
  draw(
    ctx: CanvasRenderingContext2D,
    name: string,
    x: number,
    y: number,
  ): void {
    const oc = this.cache.get(name);
    if (!oc) return;
    ctx.drawImage(oc, Math.round(x), Math.round(y));
  }

  /** Draw a white silhouette of the sprite (hit flash effect). */
  drawFlash(
    ctx: CanvasRenderingContext2D,
    name: string,
    x: number,
    y: number,
  ): void {
    const oc = this.cache.get(name);
    if (!oc) return;

    const rx = Math.round(x);
    const ry = Math.round(y);

    // Draw the sprite normally first, then composite white over opaque pixels
    ctx.save();
    ctx.drawImage(oc, rx, ry);
    ctx.globalCompositeOperation = 'source-atop';
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(rx, ry, oc.width, oc.height);
    ctx.restore();
  }

  /** Draw a sprite with a flash override: uses drawFlash when flash=true. */
  drawWithFlash(
    ctx: CanvasRenderingContext2D,
    name: string,
    x: number,
    y: number,
    flash: boolean,
  ): void {
    if (flash) {
      // Manual white flash: draw to temp canvas then blit
      const oc = this.cache.get(name);
      if (!oc) return;
      const tmp = new OffscreenCanvas(oc.width, oc.height);
      const tctx = tmp.getContext('2d')!;
      tctx.drawImage(oc, 0, 0);
      tctx.globalCompositeOperation = 'source-atop';
      tctx.fillStyle = '#ffffff';
      tctx.fillRect(0, 0, oc.width, oc.height);
      ctx.drawImage(tmp, Math.round(x), Math.round(y));
    } else {
      this.draw(ctx, name, x, y);
    }
  }

  /** Check if a sprite is registered. */
  has(name: string): boolean {
    return this.cache.has(name);
  }

  /** Get sprite dimensions (returns {w:0,h:0} if not found). */
  size(name: string): { w: number; h: number } {
    const oc = this.cache.get(name);
    return oc ? { w: oc.width, h: oc.height } : { w: 0, h: 0 };
  }
}
