import {theme} from './ThemeTokens';
import {palette, derived} from './ColorPalette';
import type {CSSProperties} from 'react';

/** Type scale for 1080x1920. Minimum readable body size on a phone is 44px. */
export const type = {
  hero: {fontSize: 132, fontWeight: 900, lineHeight: 1.0, letterSpacing: -2},
  headline: {fontSize: 92, fontWeight: 900, lineHeight: 1.04, letterSpacing: -1},
  section: {fontSize: 64, fontWeight: 800, lineHeight: 1.1, letterSpacing: 0},
  sub: {fontSize: 48, fontWeight: 700, lineHeight: 1.2, letterSpacing: 0},
  body: {fontSize: 44, fontWeight: 600, lineHeight: 1.3, letterSpacing: 0},
  label: {fontSize: 40, fontWeight: 800, lineHeight: 1.1, letterSpacing: 1},
  price: {fontSize: 104, fontWeight: 900, lineHeight: 1, letterSpacing: -1},
} as const;

export const textColors = {
  primary: palette.navy,
  muted: derived.navySoft,
  onAccent: derived.white,
  accent: palette.tomato,
  positive: palette.green,
  highlight: palette.mustard,
} as const;

export const textStyle = (k: keyof typeof type, color: string = textColors.primary): CSSProperties => ({
  fontFamily: theme.font.display,
  color,
  margin: 0,
  ...type[k],
});
