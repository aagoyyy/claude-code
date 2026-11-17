import React from 'react';
import {AbsoluteFill} from 'remotion';
import {materials as m, palette, derived} from '../visual-system/ColorPalette';
import {hash, smoothOpen, Pt} from '../dynamic/math';
import {HatchDefs} from './Texture';

const INK = derived.outline;

/** KITCHEN (side view): tiled wall, window, utensil rail, bowl shelf, stove + pot, wood counter with cabinet front. Counter top at y=1180. */
/** `lite` removes SVG blur filters (soft shadows/steam) — required when the camera zooms > 1.7x, otherwise the filter rasterises at zoomed resolution and renders extremely slowly. */
export const KitchenEnv: React.FC<{blur?: number; t?: number; lite?: boolean}> = ({blur = 0, t = 0, lite = false}) => {
  const sf = lite ? undefined : 'url(#k-soft)';
  const tiles: React.ReactNode[] = [];
  for (let r = 0; r < 8; r++) for (let c = -1; c < 10; c++) {
    const x = c * 124 + (r % 2 ? 62 : 0) - 20, y = 700 + r * 60;
    if (y > 1170) continue;
    tiles.push(<rect key={r + '-' + c} x={x} y={y} width={120} height={56} rx={4} fill={['#F4E7C9', '#EFDEBC', '#F8EDD3'][Math.floor(hash(r * 11 + c + 3) * 3)]} stroke="#C9B58E" strokeWidth={2.6} />);
  }
  const steam: Pt[][] = [0, 1, 2].map((i) => Array.from({length: 14}, (_, s) => { const u = s / 13; return [880 + i * 30 + Math.sin(t * 0.07 + u * 6 + i) * 18 * u, 760 - u * 230] as Pt; }));
  return (
    <AbsoluteFill style={{filter: blur > 0 ? `blur(${blur}px)` : undefined}}>
      <svg width={1080} height={1920} viewBox="-120 -60 1320 2040" style={{position: 'absolute', left: -120, top: -60, width: 1320, height: 2040}}>
        <HatchDefs />
        <defs>
          <linearGradient id="k-wall" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#F2E0BC" /><stop offset="1" stopColor="#E4CC9E" /></linearGradient>
          <linearGradient id="k-wood" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={m.wood.hi} /><stop offset="0.4" stopColor={m.wood.light} /><stop offset="1" stopColor={m.wood.base} /></linearGradient>
          <linearGradient id="k-cab" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#B98050" /><stop offset="1" stopColor="#94623A" /></linearGradient>
          <linearGradient id="k-pot" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#F2F0EA" /><stop offset="0.45" stopColor="#BDBFC2" /><stop offset="1" stopColor="#7C8187" /></linearGradient>
          <linearGradient id="k-sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#BFE0F0" /><stop offset="1" stopColor="#F6EBC8" /></linearGradient>
          <filter id="k-soft" x="-20%" y="-50%" width="140%" height="200%"><feGaussianBlur stdDeviation="12" /></filter>
        </defs>
        <rect x="-120" y="-60" width="1320" height="1300" fill="url(#k-wall)" />
        {tiles}
        <rect x="-120" y="700" width="1320" height="480" fill="url(#hatch-fine)" opacity={0.25} />
        {/* window */}
        <rect x="40" y="280" width="320" height="360" rx="10" fill="url(#k-sky)" stroke={INK} strokeWidth={7} />
        <path d="M200,280 V640 M40,460 H360" stroke={INK} strokeWidth={6} />
        <path d="M70,640 C70,560 110,540 150,560 C170,500 220,500 236,560 C290,540 330,570 330,640Z" fill={m.leaf.light} stroke={INK} strokeWidth={4} opacity={0.9} />
        <rect x="24" y="636" width="352" height="24" rx="6" fill="#B98050" stroke={INK} strokeWidth={6} />
        {/* utensil rail */}
        <line x1="440" y1="330" x2="1040" y2="330" stroke={INK} strokeWidth={7} />
        {[[500, 90], [590, 120], [690, 70], [790, 100]].map(([x, l], i) => (
          <g key={i}>
            <line x1={x} y1={330} x2={x} y2={330 + 26} stroke={INK} strokeWidth={4} />
            <rect x={x - 6} y={356} width={12} height={l} rx={6} fill={i % 2 ? '#8A5A32' : '#C6C9CC'} stroke={INK} strokeWidth={4} />
            <ellipse cx={x} cy={356 + l + 18} rx={i === 1 ? 24 : 18} ry={i === 1 ? 22 : 12} fill={i % 2 ? '#B98050' : '#DADCDF'} stroke={INK} strokeWidth={4} />
          </g>
        ))}
        {/* shelf with bowls */}
        <rect x="620" y="560" width="440" height="22" rx="5" fill="url(#k-cab)" stroke={INK} strokeWidth={6} />
        {[660, 760, 860].map((x, i) => (
          <g key={i}>
            <path d={`M${x},470 q46,64 92,0Z`} fill={m.ceramic.base} stroke={INK} strokeWidth={5} />
            <path d={`M${x + 8},446 q38,52 76,0Z`} fill={m.ceramic.light} stroke={INK} strokeWidth={5} />
            <path d={`M${x + 4},500 q42,24 84,0`} fill="none" stroke={palette.tomato} strokeWidth={6} />
          </g>
        ))}
        <rect x="960" y="480" width="64" height="80" rx="10" fill="#E8C98A" stroke={INK} strokeWidth={5} /><rect x="966" y="470" width="52" height="16" rx="5" fill="#B98050" stroke={INK} strokeWidth={4} />
        {/* stove + pot */}
        <g transform="translate(110,0)">
        <ellipse cx="900" cy="1176" rx="170" ry="16" fill={INK} opacity={0.3} filter={sf} />
        <rect x="740" y="1090" width="320" height="90" rx="14" fill="#4A4F58" stroke={INK} strokeWidth={6} />
        <path d="M780,1090 q20,-26 40,0 M840,1090 q20,-26 40,0 M900,1090 q20,-26 40,0" fill="none" stroke="#F2B24A" strokeWidth={5} />
        <path d="M780,730 L1020,730 L1000,1090 L800,1090Z" fill="url(#k-pot)" stroke={INK} strokeWidth={7} />
        <ellipse cx="900" cy="730" rx="120" ry="18" fill="#6E4A2A" stroke={INK} strokeWidth={6} />
        <ellipse cx="900" cy="724" rx="96" ry="10" fill={m.broth.light} />
        <path d="M770,760 q-34,10 -34,40 M1030,760 q34,10 34,40" fill="none" stroke={INK} strokeWidth={9} strokeLinecap="round" />
        <path d="M800,780 C806,880 812,980 826,1070" fill="none" stroke="#FFFFFF" strokeWidth={9} opacity={0.5} strokeLinecap="round" />
        {steam.map((p, i) => <path key={i} d={smoothOpen(p)} fill="none" stroke="#FFFFFF" strokeWidth={26 - i * 4} strokeLinecap="round" opacity={0.42} filter={sf} />)}
        </g>
        {/* counter */}
        <rect x="-120" y="1180" width="1320" height="86" fill="url(#k-wood)" stroke={INK} strokeWidth={7} />
        <rect x="-120" y="1180" width="1320" height="26" fill="#FFFFFF" opacity={0.3} />
        {Array.from({length: 18}).map((_, i) => { const y = 1206 + hash(i) * 50; return <path key={i} d={`M${-120 + hash(i + 3) * 300},${y} q80,${(hash(i + 9) - 0.5) * 14} 220,0`} fill="none" stroke={m.wood.core} strokeWidth={2.4} opacity={0.35} />; })}
        <rect x="-120" y="1266" width="1320" height="700" fill="url(#k-cab)" />
        <rect x="-120" y="1266" width="1320" height="700" fill="url(#hatch)" opacity={0.18} />
        {[0, 1, 2].map((i) => <g key={i}><rect x={-60 + i * 410} y={1320} width={380} height={500} rx={10} fill="#A66E42" stroke={INK} strokeWidth={6} /><rect x={-34 + i * 410} y={1346} width={328} height={448} rx={6} fill="none" stroke="#7F4F2D" strokeWidth={4} /><circle cx={290 + i * 410} cy={1400} r={12} fill="#E8C98A" stroke={INK} strokeWidth={4} /></g>)}
        <rect x="-120" y="1266" width="1320" height="40" fill={INK} opacity={0.2} filter={sf} />
      </svg>
    </AbsoluteFill>
  );
};

/** TOP-DOWN wooden table with 5 planks, grain, nails, a placemat and edge shadow. */
export const TopDownTable: React.FC<{blur?: number}> = ({blur = 0}) => {
  const tones = [m.wood.light, m.wood.base, m.wood.hi, m.wood.base, m.wood.light];
  return (
    <AbsoluteFill style={{filter: blur > 0 ? `blur(${blur}px)` : undefined}}>
      <svg width={1080} height={1920} viewBox="-100 -100 1280 2120" style={{position: 'absolute', left: -100, top: -100, width: 1280, height: 2120}}>
        <HatchDefs />
        <defs>
          <linearGradient id="td-edge" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#FFFFFF" stopOpacity="0.35" /><stop offset="1" stopColor="#000000" stopOpacity="0.18" /></linearGradient>
        </defs>
        {tones.map((c, i) => <rect key={i} x={-100 + i * 256} y={-100} width={258} height={2120} fill={c} />)}
        {tones.map((_, i) => <line key={'s' + i} x1={-100 + i * 256} y1={-100} x2={-100 + i * 256} y2={2020} stroke={m.wood.core} strokeWidth={5} opacity={0.55} />)}
        {Array.from({length: 46}).map((_, i) => {
          const x = -80 + hash(i) * 1240;
          const pts: Pt[] = Array.from({length: 10}, (_, k) => [x + Math.sin(k * 0.7 + i) * 9, -100 + k * 240] as Pt);
          return <path key={i} d={smoothOpen(pts)} fill="none" stroke={m.wood.core} strokeWidth={1.8 + hash(i + 2) * 2.6} opacity={0.14 + hash(i + 5) * 0.2} strokeLinecap="round" />;
        })}
        {[[160, 380], [720, 1480], [980, 720], [330, 1700]].map(([x, y], i) => <g key={i} opacity={0.5}>{[40, 28, 17, 8].map((r, j) => <ellipse key={j} cx={x} cy={y} rx={r * 0.9} ry={r * 1.7} fill="none" stroke={m.wood.core} strokeWidth={2.4} />)}</g>)}
        {[0, 1, 2, 3, 4].map((i) => [260, 1760].map((y) => <circle key={i + '-' + y} cx={-100 + i * 256 + 128} cy={y} r={7} fill={m.wood.core} stroke={INK} strokeWidth={2} />))}
        <rect x="-100" y="-100" width="1280" height="2120" fill="url(#hatch-fine)" opacity={0.12} />
        <rect x="-100" y="-100" width="1280" height="2120" fill="url(#td-edge)" />
      </svg>
    </AbsoluteFill>
  );
};
