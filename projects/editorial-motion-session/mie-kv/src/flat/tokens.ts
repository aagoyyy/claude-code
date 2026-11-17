/** Premium flat-vector character system. One ink colour, one stroke width, warm palette, few tones per material. */
export const INK = '#2B1B17';
export const SW = 2.6;                       // outline width in character units (character is drawn ~1.45x on a 1080 canvas)
export const SKIN = {
  light: {base: '#F6D2AE', shade: '#E3AE84', blush: '#F0957E'},
  tan: {base: '#E8B88C', shade: '#CF9468', blush: '#E57F6C'},
  brown: {base: '#C98F63', shade: '#A9714A', blush: '#C9644F'},
};
export type SkinKey = keyof typeof SKIN;
export const HAIR = {black: {base: '#1D1512', mid: '#2C211C', hi: '#6A5A50'}, brown: {base: '#3A2418', mid: '#4D3324', hi: '#8A6A52'}};
export type HairKey = keyof typeof HAIR;
export const WHITE = '#FBF7F1', WHITE_SHADE = '#E6DED2';
export const RED = '#B8282D', RED_DARK = '#8C1D22', BRASS = '#C28A3E';
export const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
