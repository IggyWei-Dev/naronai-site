declare module "opentype.js" {
  interface Path {
    toPathData(decimalPlaces?: number): string;
  }

  interface Glyph {
    advanceWidth?: number;
    getPath(x: number, y: number, fontSize: number, options?: object, font?: Font): Path;
  }

  interface GlyphSet {
    get(index: number): Glyph | null;
  }

  interface Font {
    unitsPerEm: number;
    glyphs: GlyphSet;
    charToGlyph(char: string): Glyph;
    encoding: { charToGlyphIndex(char: string): number };
  }

  export function parse(buffer: ArrayBuffer, opt?: object): Font;
}
