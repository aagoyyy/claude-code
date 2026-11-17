import {palette, derived, observed} from './ColorPalette';

export const backgroundTokens = {
  paper: {base: palette.ivory, grain: 0.06},
  grid: {size: 54, color: palette.grid, opacity: 0.55, majorEvery: 4, majorOpacity: 0.8, lineWidth: 2},
  /** warm cream used behind isolated objects (reference scenes alternate paper / warm cream) */
  cream: {base: '#F7F0DE', vignette: 'rgba(166,110,66,0.10)'},
  table: {top: palette.beige, edge: derived.brownLight, plank: palette.brown, plankOpacity: 0.22},
  wood: {base: palette.beige, dark: palette.brown, grain: derived.brownDeep},
  environmentWall: {base: observed.warmCreamSampled, tile: palette.grid},
} as const;
