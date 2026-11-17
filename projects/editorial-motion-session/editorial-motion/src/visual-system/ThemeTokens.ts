import {palette, derived} from './ColorPalette';

export const FPS = 30;
export const CANVAS = {width: 1080, height: 1920} as const;

/** 9:16 mobile safe zone (px). Keep text + hero objects inside. Platform UI covers the rest. */
export const SAFE = {top: 220, bottom: 420, left: 60, right: 100} as const;
export const SAFE_RECT = {
  x: SAFE.left,
  y: SAFE.top,
  w: CANVAS.width - SAFE.left - SAFE.right,
  h: CANVAS.height - SAFE.top - SAFE.bottom,
} as const;

export const theme = {
  colors: {
    bg: palette.ivory,
    text: palette.navy,
    textMuted: derived.navySoft,
    textOnAccent: derived.white,
    outline: derived.outline,
    accent: palette.tomato,
    positive: palette.green,
    highlight: palette.mustard,
    warm: palette.brown,
  },
  /** Every illustration is authored in a local viewBox. Stroke widths are in viewBox units. */
  outline: {width: 5, join: 'round' as const, cap: 'round' as const},
  radius: {sm: 10, md: 22, lg: 36},
  font: {
    display: "'Inter Display','Inter','Montserrat','Helvetica Neue',Arial,sans-serif",
    body: "'Inter','Helvetica Neue',Arial,sans-serif",
  },
} as const;

export type Theme = typeof theme;
