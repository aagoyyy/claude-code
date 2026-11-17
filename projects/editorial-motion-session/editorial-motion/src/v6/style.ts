/**
 * V6 CLEAN EDITORIAL STYLE (re-derived from reference frames).
 * Reference (sampled): paper ~#F6F4F0 with a very faint grid, sand table band ~#EBC58F + one thin dark line,
 * tag red ~#D54F48, thin dark-brown outline (~2-3px @360w  => ~4px @1080w), soft cel shading, flat ellipse ground shadow.
 */
export const C = {
  paper: '#F8F5EC',
  grid: '#E9E4D6',
  sand: '#EBC58F',
  sandLine: '#3B2A20',
  ink: '#2E2019',
  navy: '#1F2A37',
  tomato: '#D54F48',
  tomatoDeep: '#B13E39',
  green: '#4E8A5A',
  greenDeep: '#3A6B45',
  mustard: '#E8B93C',
  mustardDeep: '#C99A22',
  brown: '#B77A45',
  cream: '#FFFDF6',
  creamShade: '#EDE5D2',
  noodle: '#F2C96B',
  noodleDeep: '#D9A43E',
  broth: '#C97E3C',
  brothDeep: '#A9652B',
  white: '#FFFFFF',
  shadow: 'rgba(46,32,25,0.16)',
} as const;
/** outline weight in px at 1080 wide (reference ~ 4px). viewBox illustrations scale this via size. */
export const LW = 3.4;
export const ST = {stroke: C.ink, strokeWidth: LW, strokeLinejoin: 'round' as const, strokeLinecap: 'round' as const};
/** type scale (px @1080x1920) */
export const TYPE = {headline: 84, headline2: 64, number: 120, price: 76, label: 40, small: 34};
export const FONT = "'Inter Display','Inter','Helvetica Neue',Arial,sans-serif";
