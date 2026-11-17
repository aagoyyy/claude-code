import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {hash, clamp, easeOutBack} from '../math';
import {derived, materials as m, palette} from '../../visual-system/ColorPalette';

/** Directional motion blur (deterministic). bx/by = blur std-dev in px. */
export const MotionBlur: React.FC<{id: string; bx?: number; by?: number; children: React.ReactNode}> = ({id, bx = 0, by = 0, children}) => {
  if (bx < 0.4 && by < 0.4) return <>{children}</>;
  return (
    <>
      <svg width={0} height={0} style={{position: 'absolute'}}>
        <filter id={id} x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation={`${bx} ${by}`} /></filter>
      </svg>
      <div style={{filter: `url(#${id})`}}>{children}</div>
    </>
  );
};

/** Comic impact star burst (pop + fade) */
export const ImpactBurst: React.FC<{x: number; y: number; start: number; size?: number}> = ({x, y, start, size = 520}) => {
  const f = useCurrentFrame();
  const t = f - start;
  if (t < 0 || t > 12) return null;
  const s = easeOutBack(t / 5, 1.5) * (1 - clamp((t - 5) / 7) * 0.5);
  const pts = Array.from({length: 20}).map((_, i) => { const a = (i / 20) * Math.PI * 2, r = i % 2 ? size * 0.34 : size * 0.5; return `${(Math.cos(a) * r).toFixed(1)},${(Math.sin(a) * r * 0.62).toFixed(1)}`; }).join(' ');
  return (
    <svg width={1080} height={1920} style={{position: 'absolute', inset: 0, pointerEvents: 'none'}}>
      <g transform={`translate(${x},${y}) scale(${s}) rotate(${t * 2})`} opacity={0.92 * (1 - clamp((t - 4) / 8))}>
        <polygon points={pts} fill={palette.mustard} stroke={derived.outline} strokeWidth={8} strokeLinejoin="round" />
        <polygon points={pts} fill="#FFF3C0" transform="scale(0.72)" />
      </g>
    </svg>
  );
};

/** Burst of foil flecks / confetti-like particles */
export const Flecks: React.FC<{x: number; y: number; start: number; count?: number; colors?: string[]}> = ({x, y, start, count = 22, colors = [palette.mustard, palette.tomato, '#FFF6D6']}) => {
  const f = useCurrentFrame();
  const t = f - start;
  if (t < 0 || t > 26) return null;
  return (
    <svg width={1080} height={1920} style={{position: 'absolute', inset: 0, pointerEvents: 'none'}}>
      {Array.from({length: count}).map((_, i) => {
        const a = hash(i) * 6.283, v = 8 + hash(i + 9) * 18;
        const px = x + Math.cos(a) * v * t * 0.8, py = y + Math.sin(a) * v * t * 0.8 + 0.5 * 1.2 * t * t;
        const w = 12 + hash(i + 3) * 18, h = 6 + hash(i + 4) * 8;
        return <rect key={i} x={-w / 2} y={-h / 2} width={w} height={h} rx={2} fill={colors[i % colors.length]} stroke={derived.outline} strokeWidth={2.4} transform={`translate(${px},${py}) rotate(${hash(i + 6) * 360 + t * (hash(i) - 0.5) * 60})`} opacity={1 - clamp((t - 16) / 10)} />;
      })}
    </svg>
  );
};

/** Droplets with ground bounce (landing on the table) + ripple rings on the surface */
export const Droplets: React.FC<{x: number; y: number; ground: number; start: number; count?: number}> = ({x, y, ground, start, count = 24}) => {
  const f = useCurrentFrame();
  const t = f - start;
  if (t < 0 || t > 60) return null;
  return (
    <svg width={1080} height={1920} style={{position: 'absolute', inset: 0, pointerEvents: 'none'}}>
      {[0, 5, 10].map((d, k) => {
        const u = clamp((t - d) / 20);
        return u > 0 ? <ellipse key={k} cx={x} cy={y} rx={70 + u * 290} ry={14 + u * 62} fill="none" stroke="#FFF1CC" strokeWidth={9 * (1 - u)} opacity={0.9 * (1 - u)} /> : null;
      })}
      {Array.from({length: count}).map((_, i) => {
        const a = -Math.PI / 2 + (hash(i) - 0.5) * 2.2;
        const v = 7 + hash(i + 40) * 14;
        let py = y + Math.sin(a) * v * t + 0.5 * 1.15 * t * t;
        const px = x + Math.cos(a) * v * t * 1.5 + (hash(i + 1) - 0.5) * 40;
        let bounced = false;
        if (py > ground) { py = ground - (py - ground) * 0.0 - Math.abs(Math.sin((py - ground) * 0.08)) * 18; bounced = true; }
        const r = 5 + hash(i + 11) * 9;
        const life = 46;
        if (t > life) return null;
        return <ellipse key={i} cx={px} cy={py} rx={r * (bounced ? 1.3 : 1)} ry={r * (bounced ? 0.6 : 1)} fill={m.broth.light} stroke={derived.outline} strokeWidth={2.6} opacity={1 - clamp((t - 30) / 16)} />;
      })}
    </svg>
  );
};

/** Final grade: warm vignette, top-left light glow, fine grain */
export const Grade: React.FC = () => (
  <AbsoluteFill style={{pointerEvents: 'none'}}>
    <AbsoluteFill style={{background: `radial-gradient(ellipse at 50% 46%, rgba(0,0,0,0) 44%, ${m.vignette} 100%)`, mixBlendMode: 'multiply'}} />
    <AbsoluteFill style={{background: `radial-gradient(circle at 18% 12%, ${m.paperLight}, rgba(255,240,205,0) 55%)`, mixBlendMode: 'soft-light', opacity: 0.6}} />
    <svg width={1080} height={1920} style={{position: 'absolute', inset: 0, mixBlendMode: 'overlay', opacity: 0.16}}>
      <filter id="gr-grain"><feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" seed="11" /><feColorMatrix values="0 0 0 0 0.5  0 0 0 0 0.45  0 0 0 0 0.4  0 0 0 0.9 0" /></filter>
      <rect width="100%" height="100%" filter="url(#gr-grain)" />
    </svg>
  </AbsoluteFill>
);
