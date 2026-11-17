/**
 * MASTER COLOR PALETTE — Illustrated Editorial Explainer Motion Graphics
 *
 * `palette`   : the starting reference palette from the brief (not pixel-verified).
 * `observed`  : values actually sampled (median of small regions) from the reference footage.
 * `derived`   : tints/shades of palette colors, only used for illustration shading.
 *
 * RULE: never write a raw hex inside a component. Add a token here (with a reason) first.
 */
export const palette = {
  // paper / background
  ivory: '#F5F0E5',
  beige: '#E8C99B',
  grid: '#D9D5C9',
  // primary contrast
  navy: '#202A36',
  // accents
  tomato: '#D94B3D',
  green: '#54815C',
  mustard: '#E6B94F',
  brown: '#A66E42',
} as const;

/** Sampled from the reference video (720x1280, frames at 1s/6s/20.5s/30s). Documentation only. */
export const observed = {
  paperSampled: '#F6F4F0',
  gridSampled: '#E8E6E2',
  warmCreamSampled: '#F7F0DE',
  tableSandSampled: '#EBC58F',
  woodMidSampled: '#C8905A',
  tagRedSampled: '#D54F48',
  eggSampled: '#E1A676',
} as const;

/** Derived tints/shades (illustration shading + materials). Each is a shifted version of a palette color. */
export const derived = {
  outline: '#3A2B22', // warm near-black used for every ink outline (reference outlines read dark brown)
  white: '#FFFDF8', // warm white for ceramics / highlights
  skin: '#F0C9A0',
  skinShade: '#DDA877',
  tomatoDeep: '#B53A2F', // shade of tomato
  tomatoLight: '#E8705F',
  greenDeep: '#3F6747',
  greenLight: '#7BA382',
  mustardDeep: '#C99A2E',
  mustardLight: '#F2D486',
  brownDeep: '#7F4F2D',
  brownLight: '#C99466',
  noodle: '#EDC879',
  noodleDeep: '#C99A4B',
  broth: '#C98340',
  steam: '#EDE6DA',
  shadow: 'rgba(32,42,54,0.14)',
  navySoft: '#46525F',
} as const;

export type PaletteKey = keyof typeof palette;
export type DerivedKey = keyof typeof derived;

/**
 * MATERIAL RAMPS — 4-6 tone ramps per material (hi / light / base / shade / core / bounce).
 * Light comes from the top-left; `bounce` is warm light reflected from the wooden table onto lower surfaces.
 * Every ramp is a shifted version of the palette (documented in color-system.md).
 */
export const materials = {
  ceramic: {hi: '#FFFFFF', light: '#FFFDF8', base: '#F4ECDD', shade: '#DDCEB4', core: '#BCAA8E', bounce: '#F3C79A'},
  wood: {hi: '#F7DBAC', light: '#EDC794', base: '#DFAC72', shade: '#C98F58', core: '#A66E42'},
  noodle: {hi: '#FFF2BF', light: '#F8DA84', base: '#EEC25F', shade: '#D49A3C', core: '#A9732A'},
  broth: {hi: '#F0B96C', light: '#E2A04F', base: '#C98340', shade: '#9C5A28', core: '#6E3B18'},
  eggWhite: {hi: '#FFFFFF', base: '#FCF7EB', shade: '#E6DAC0', core: '#C9B999'},
  yolk: {hi: '#FFE88E', base: '#FFC53D', shade: '#F29020', core: '#C9620F'},
  leaf: {hi: '#A8D386', light: '#76AC66', base: '#4F8A4F', shade: '#35703F', core: '#245028'},
  stalk: {hi: '#EAF3C8', base: '#C5DB9A', shade: '#97B872'},
  chili: {hi: '#FF9A84', base: '#E2432F', shade: '#B52A22', core: '#7E1814'},
  meat: {hi: '#C98A5A', base: '#A66E42', shade: '#7F4F2D', core: '#5A3318'},
  packet: {foil: '#FFF6D6', foilShade: '#E3C57A'},
  paperLight: 'rgba(255,240,205,0.45)',
  vignette: 'rgba(110,64,28,0.34)',
} as const;
