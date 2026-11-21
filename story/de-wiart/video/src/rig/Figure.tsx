import React from 'react';
import {SideArt, SideDefs, SideOpts, SidePose} from './Side';

export type LightName = 'warm' | 'desert' | 'night' | 'indoor';
export const LIGHTS: Record<LightName, {rim: string; key: string; bounce: string; haze: string; skew: number; shadow: number; halo: string; grade: [number, number, number]}> = {
  warm:   {rim: '#ffd9a0', key: '#ffe3b5', bounce: '#d9964c', haze: '#ffcf98', skew: -0.9, shadow: 0.5, halo: '#ffc27a', grade: [1.05, 0.96, 0.84]},
  desert: {rim: '#fff0c8', key: '#fff0d0', bounce: '#e8c088', haze: '#fbe2b4', skew: -0.5, shadow: 0.45, halo: '#ffe6b0', grade: [1.05, 1.0, 0.88]},
  night:  {rim: '#cfeedd', key: '#d8ffe8', bounce: '#6a6a50', haze: '#2a3d58', skew: -0.45, shadow: 0.35, halo: '#9fd8c0', grade: [0.88, 1.0, 1.0]},
  indoor: {rim: '#ffcf8a', key: '#ffd9a0', bounce: '#8a5a38', haze: '#3a2a22', skew: -0.6, shadow: 0.4, halo: '#ffb060', grade: [1.05, 0.95, 0.82]},
};

/** put once per <svg> that contains Figures */
export const FigureDefs: React.FC = () => (
  <defs>
    <SideDefs />
    <filter id="fShadow" x="-30%" y="-30%" width="160%" height="160%"><feFlood floodColor="#1a0e08" result="f" /><feComposite in="f" in2="SourceAlpha" operator="in" result="s" /><feGaussianBlur in="s" stdDeviation="10" /></filter>
    <filter id="fBlurC"><feGaussianBlur stdDeviation="12" /></filter>
    <linearGradient id="figShade" gradientUnits="userSpaceOnUse" x1="-20" y1="0" x2="190" y2="0"><stop offset="0" stopColor="#1c1020" stopOpacity="0" /><stop offset="1" stopColor="#1c1020" stopOpacity=".4" /></linearGradient>
    {(Object.keys(LIGHTS) as LightName[]).map((n) => {
      const L = LIGHTS[n];
      return (
        <React.Fragment key={n}>
          <filter id={`fRim_${n}`} x="-10%" y="-10%" width="120%" height="120%" colorInterpolationFilters="sRGB">
            <feColorMatrix in="SourceGraphic" type="matrix" values={`${L.grade[0]} 0 0 0 0  0 ${L.grade[1]} 0 0 0  0 0 ${L.grade[2]} 0 0  0 0 0 1 0`} result="g" />
            <feOffset in="SourceAlpha" dx="9" dy="6" result="o" /><feComposite in="SourceAlpha" in2="o" operator="out" result="e" /><feGaussianBlur in="e" stdDeviation="1.6" result="eb" />
            <feFlood floodColor={L.rim} floodOpacity=".9" result="fl" /><feComposite in="fl" in2="eb" operator="in" result="rim" />
            <feOffset in="SourceAlpha" dx="-6" dy="-3" result="o2" /><feComposite in="SourceAlpha" in2="o2" operator="out" result="e2" /><feGaussianBlur in="e2" stdDeviation="2" result="eb2" />
            <feFlood floodColor="#7d6a8f" floodOpacity=".5" result="fl2" /><feComposite in="fl2" in2="eb2" operator="in" result="rim2" />
            <feMerge><feMergeNode in="g" /><feMergeNode in="rim2" /><feMergeNode in="rim" /></feMerge>
          </filter>
          <radialGradient id={`figKey_${n}`} gradientUnits="userSpaceOnUse" cx="-260" cy="-900" r="720"><stop offset="0" stopColor={L.key} stopOpacity=".34" /><stop offset="1" stopColor={L.key} stopOpacity="0" /></radialGradient>
          <linearGradient id={`figBounce_${n}`} gradientUnits="userSpaceOnUse" x1="0" y1="-260" x2="0" y2="0"><stop offset="0" stopColor={L.bounce} stopOpacity="0" /><stop offset="1" stopColor={L.bounce} stopOpacity=".36" /></linearGradient>
          <linearGradient id={`figHaze_${n}`} gradientUnits="userSpaceOnUse" x1="0" y1="-1280" x2="0" y2="0"><stop offset="0" stopColor={L.haze} stopOpacity=".03" /><stop offset="1" stopColor={L.haze} stopOpacity=".12" /></linearGradient>
        </React.Fragment>
      );
    })}
  </defs>
);

export type FigureProps = {
  uid: string; x: number; y: number; s?: number; o: SideOpts; p: SidePose;
  light?: LightName; lit?: number; lo?: boolean; shadow?: number; alpha?: number;
  glow?: {x: number; y: number; k: number; color?: string};   // dynamic light (muzzle flash / blast) in figure-local space
  art?: React.ReactNode; box?: [number, number, number, number];   // custom artwork (animals) + its bounding box
};

/** A lit profile character standing on (x,y). Render inside an <svg> that has <FigureDefs/>. */
export const Figure: React.FC<FigureProps> = ({uid, x, y, s = 0.567, o, p, light = 'warm', lit = 1, lo = false, shadow, alpha = 1, glow, art, box = [-520, -1500, 1040, 1640]}) => {
  const L = LIGHTS[light];
  const sh = shadow ?? L.shadow;
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`} opacity={alpha}>
      <defs>
        <g id={`${uid}a`}>{art ?? <SideArt o={lo ? {...o, fine: false} : o} p={p} />}</g>
        {!lo && <mask id={`${uid}m`} maskUnits="userSpaceOnUse" x={box[0]} y={box[1]} width={box[2]} height={box[3]} style={{maskType: 'alpha'} as any}><use href={`#${uid}a`} /></mask>}
      </defs>
      <ellipse cx={20} cy={4} rx={190} ry={22} fill="#1a0e08" opacity={0.5 * sh / 0.5} filter={lo ? undefined : 'url(#fBlurC)'} />
      {!lo && (
        <g opacity={sh}>
          <g transform={`matrix(1 0 ${L.skew} -0.12 0 0)`} filter="url(#fShadow)"><use href={`#${uid}a`} /></g>
        </g>
      )}
      {!lo ? <g filter={`url(#fRim_${light})`}><use href={`#${uid}a`} /></g> : <use href={`#${uid}a`} />}
      {!lo && (
        <g mask={`url(#${uid}m)`} opacity={Math.min(1, 0.4 + lit * 0.6 + (glow ? glow.k * 0.5 : 0))}>
          <rect x={box[0]} y={box[1]} width={box[2]} height={box[3]} fill={`url(#figKey_${light})`} />
          <rect x={box[0]} y={box[1]} width={box[2]} height={box[3]} fill="url(#figShade)" />
          <rect x={box[0]} y={box[1]} width={box[2]} height={box[3]} fill={`url(#figBounce_${light})`} />
          <rect x={box[0]} y={box[1]} width={box[2]} height={box[3]} fill={`url(#figHaze_${light})`} />
          {glow && glow.k > 0.02 && (<>
            <defs><radialGradient id={`${uid}g`} gradientUnits="userSpaceOnUse" cx={glow.x} cy={glow.y} r={1100}><stop offset="0" stopColor={glow.color ?? '#ffb24a'} stopOpacity={Math.min(0.85, glow.k)} /><stop offset=".45" stopColor={glow.color ?? '#ff8a2a'} stopOpacity={glow.k * 0.35} /><stop offset="1" stopColor="#ff7a1a" stopOpacity="0" /></radialGradient></defs>
            <rect x={box[0]} y={box[1]} width={box[2]} height={box[3]} fill={`url(#${uid}g)`} />
          </>)}
        </g>
      )}
    </g>
  );
};
