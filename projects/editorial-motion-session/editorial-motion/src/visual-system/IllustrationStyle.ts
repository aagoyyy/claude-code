import {derived} from './ColorPalette';
import {theme} from './ThemeTokens';

/** Master illustration rules — every SVG object must spread `ink` on outlined shapes. */
export const ink = {
  stroke: derived.outline,
  strokeWidth: theme.outline.width,
  strokeLinejoin: theme.outline.join,
  strokeLinecap: theme.outline.cap,
} as const;

/** thin detail lines (veins, noodle strands) = 0.6 x master width */
export const inkThin = {...ink, strokeWidth: theme.outline.width * 0.6} as const;
/** ceramic/packet highlight: white at low opacity, never a gradient */
export const highlight = {fill: '#FFFFFF', opacity: 0.32} as const;
/** flat shade: a darker copy of a shape, clipped inside it, offset toward the lower-right (light from top-left) */
export const shade = {opacity: 0.16, fill: derived.outline} as const;
/** organic outline wobble. Applied on illustration root groups via <InkFilter/> */
export const roughness = {baseFrequency: 0.018, scale: 3, octaves: 2, seed: 3} as const;
