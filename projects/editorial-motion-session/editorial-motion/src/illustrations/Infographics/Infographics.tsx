import React from 'react';
import {Illustration, IllustrationProps} from '../Illustration';
import {ink, inkThin} from '../../visual-system/IllustrationStyle';
import {palette, derived} from '../../visual-system/ColorPalette';
import {theme} from '../../visual-system/ThemeTokens';
import {DrawOnPath} from '../../animations/DrawOn';

/**
 * Isometric block (cost box / value bar). Height in viewBox units. viewBox 260 x (height + 130).
 * `grow` 0..1 scales the height so a bar can animate upward.
 */
export const IsoBlock: React.FC<IllustrationProps & {height: number; color: string; shadeColor: string; topColor: string; label?: string; grow?: number}> = ({height, color, shadeColor, topColor, label, grow = 1, ...p}) => {
  const h = Math.max(4, height * grow);
  const base = height + 120;
  const top = base - h;
  return (
    <Illustration vbW={260} vbH={height + 130} {...p}>
      <ellipse cx="130" cy={base + 6} rx="124" ry="14" fill={derived.shadow} />
      {/* front-left face */}
      <path d={`M20,${top + 40} L120,${top + 82} L120,${base} L20,${base - 42}Z`} fill={color} {...ink} />
      {/* right face */}
      <path d={`M120,${top + 82} L240,${top + 36} L240,${base - 46} L120,${base}Z`} fill={shadeColor} {...ink} />
      {/* top */}
      <path d={`M20,${top + 40} L140,${top - 6} L240,${top + 36} L120,${top + 82}Z`} fill={topColor} {...ink} />
      {label && h > 90 && (
        <text x="70" y={(top + base) / 2 + 30} textAnchor="middle" fontFamily={theme.font.display} fontWeight={900} fontSize={30} fill={derived.white} stroke={derived.outline} strokeWidth={2.5} paintOrder="stroke" transform={`rotate(22 70 ${(top + base) / 2 + 30})`}>
          {label}
        </text>
      )}
    </Illustration>
  );
};

/** Curved arrow that draws on. Place directly in a Remotion layer (renders its own svg). */
export const ArrowCurve: React.FC<{delay?: number; size?: number; color?: string; flip?: boolean; width?: number}> = ({delay = 0, size = 320, color = palette.tomato, flip = false, width = 14}) => (
  <svg width={size} height={size * 0.6} viewBox="0 0 320 192" style={{overflow: 'visible', transform: flip ? 'scaleX(-1)' : undefined}}>
    <DrawOnPath d="M10,170 C80,176 190,140 262,36" delay={delay} duration={22} stroke={color} strokeWidth={width} />
    <DrawOnPath d="M214,26 L268,26 L270,82" delay={delay + 16} duration={10} stroke={color} strokeWidth={width} />
  </svg>
);

/** Sparkle star (4-point). */
export const Sparkle: React.FC<{size?: number; color?: string}> = ({size = 40, color = palette.mustard}) => (
  <svg width={size} height={size} viewBox="0 0 40 40" style={{overflow: 'visible'}}>
    <path d="M20,2 L25,15 L38,20 L25,25 L20,38 L15,25 L2,20 L15,15Z" fill={color} stroke={derived.outline} strokeWidth={2.4} strokeLinejoin="round" />
  </svg>
);
