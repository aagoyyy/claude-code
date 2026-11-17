import React from 'react';
import {C, ST, LW, FONT} from './style';

/** Plain svg wrapper — NO filters, NO textures. size = rendered width in px. */
export const Svg: React.FC<{vbW: number; vbH: number; size: number; style?: React.CSSProperties; children: React.ReactNode}> = ({vbW, vbH, size, style, children}) => (
  <svg width={size} height={(size * vbH) / vbW} viewBox={`0 0 ${vbW} ${vbH}`} style={{overflow: 'visible', display: 'block', ...style}}>{children}</svg>
);
const sw = (vb: number, size: number, px = LW) => (px * vb) / size; // keep outline ~constant in px regardless of illustration size

/** ground shadow (flat ellipse, like the reference) */
export const GroundShadow: React.FC<{rx: number; ry?: number; cx?: number; cy: number}> = ({rx, ry = rx * 0.12, cx = 0, cy}) => <ellipse cx={cx} cy={cy} rx={rx} ry={ry} fill={C.shadow} />;

/* ------------------------------ PACKET ------------------------------ */
export const PacketFlat: React.FC<{size?: number}> = ({size = 560}) => {
  const w = sw(400, size);
  const st = {...ST, strokeWidth: w};
  const crimp = (y: number, up: boolean) => { let d = `M40,${y}`; for (let i = 0; i < 24; i++) d += ` l${(320 / 24).toFixed(1)},${up ? (i % 2 ? 6 : -6) : (i % 2 ? -6 : 6)}`; return d; };
  return (
    <Svg vbW={400} vbH={310} size={size}>
      <defs><clipPath id="pf-clip"><path d="M36,46 Q200,28 364,46 L354,264 Q200,282 46,264Z" /></clipPath></defs>
      <ellipse cx="205" cy="292" rx="150" ry="13" fill={C.shadow} />
      <path d="M36,46 Q200,28 364,46 L354,264 Q200,282 46,264Z" fill={C.mustard} {...st} />
      <g clipPath="url(#pf-clip)">
        <rect x="20" y="20" width="360" height="104" fill={C.tomato} />
        <rect x="20" y="228" width="360" height="70" fill={C.green} />
        <rect x="20" y="214" width="360" height="14" fill="#F7DB82" />
        <path d="M20,124 Q200,142 380,124 L380,134 Q200,152 20,134Z" fill={C.cream} />
        <path d="M44,40 L128,36 L72,264 L44,264Z" fill="#FFFFFF" opacity={0.18} />
        <path d="M250,60 L364,60 L354,264 L262,264Z" fill={C.ink} opacity={0.06} />
      </g>
      <path d={crimp(46, true)} fill="none" stroke={C.ink} strokeWidth={w * 0.7} />
      <path d={crimp(264, false)} fill="none" stroke={C.ink} strokeWidth={w * 0.7} />
      <path d="M36,46 Q200,28 364,46 L354,264 Q200,282 46,264Z" fill="none" {...st} />
      <text x="200" y="104" textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={48} fill={C.white} stroke={C.ink} strokeWidth={w * 1.6} paintOrder="stroke" strokeLinejoin="round">MIE INSTAN</text>
      <ellipse cx="205" cy="190" rx="86" ry="36" fill={C.cream} {...st} />
      <ellipse cx="205" cy="186" rx="72" ry="26" fill={C.broth} stroke={C.ink} strokeWidth={w * 0.7} />
      <path d="M142,184 q14,-14 28,0 t28,0 t28,0 t28,0" fill="none" stroke={C.noodle} strokeWidth={6} strokeLinecap="round" />
      <path d="M150,196 q14,-14 28,0 t28,0 t28,0" fill="none" stroke={C.noodle} strokeWidth={6} strokeLinecap="round" />
      <circle cx="172" cy="178" r="12" fill={C.white} stroke={C.ink} strokeWidth={w * 0.7} /><circle cx="172" cy="178" r="6" fill={C.mustard} />
      <path d="M238,172 q20,-4 18,12 q-12,6 -18,-12Z" fill={C.tomato} stroke={C.ink} strokeWidth={w * 0.7} strokeLinejoin="round" />
    </Svg>
  );
};

/* ------------------------------ NOODLE BRICK ------------------------------ */
export const BrickFlat: React.FC<{size?: number}> = ({size = 360}) => {
  const w = sw(320, size);
  return (
    <Svg vbW={320} vbH={200} size={size}>
      <defs><clipPath id="bk-clip"><rect x="14" y="14" width="292" height="172" rx="28" /></clipPath></defs>
      <rect x="14" y="14" width="292" height="172" rx="28" fill={C.noodle} stroke={C.ink} strokeWidth={w} />
      <g clipPath="url(#bk-clip)">
        {Array.from({length: 9}).map((_, i) => {
          const y = 30 + i * 18; let d = `M10,${y}`; for (let k = 0; k < 10; k++) d += ` q15,${k % 2 ? -9 : 9} 30,0`;
          return <path key={i} d={d} fill="none" stroke={i % 2 ? C.noodleDeep : '#FBE2A0'} strokeWidth={7} strokeLinecap="round" />;
        })}
      </g>
      <rect x="14" y="14" width="292" height="172" rx="28" fill="none" stroke={C.ink} strokeWidth={w} />
    </Svg>
  );
};

/* ------------------------------ BOWL (side) ------------------------------ */
const BODY = 'M50,170 C58,330 150,420 230,424 L370,424 C450,420 542,330 550,170 A250,56 0 0 1 50,170Z';
export const BowlFlat: React.FC<{size?: number; bloom?: number; sx?: number; sy?: number; toppings?: number}> = ({size = 760, bloom = 0, sx = 1, sy = 1, toppings = 0}) => {
  const w = sw(600, size);
  const st = {...ST, strokeWidth: w};
  const strands = Array.from({length: 13}).map((_, i) => {
    const row = i / 12, y = 168 + (row - 0.5) * 50;
    const half = 214 * Math.sqrt(Math.max(0.05, 1 - Math.pow((row - 0.5) * 1.9, 2)));
    const amp = 4 + bloom * 9, lift = bloom * 14 * Math.sin(row * Math.PI);
    let d = `M${300 - half},${y - lift}`; const n = 7;
    for (let k = 0; k < n; k++) d += ` q${(half * 2) / n / 2},${k % 2 ? -amp : amp} ${(half * 2) / n},0`;
    return d;
  });
  return (
    <Svg vbW={600} vbH={480} size={size} style={{transform: `scale(${sx},${sy})`, transformOrigin: '50% 94%'}}>
      <defs><clipPath id="bf-body"><path d={BODY} /></clipPath><clipPath id="bf-broth"><ellipse cx="300" cy="176" rx="226" ry="46" /></clipPath></defs>
      <ellipse cx="302" cy="452" rx="250" ry="22" fill={C.shadow} />
      <path d="M176,414 L424,414 L412,450 Q300,464 188,450Z" fill={C.cream} {...st} />
      <path d={BODY} fill={C.cream} {...st} />
      <g clipPath="url(#bf-body)">
        <path d="M30,248 Q300,312 570,248 L570,298 Q300,364 30,298Z" fill={C.tomato} />
        <path d="M30,248 Q300,312 570,248" fill="none" stroke={C.ink} strokeWidth={w * 0.8} />
        <path d="M30,298 Q300,364 570,298" fill="none" stroke={C.ink} strokeWidth={w * 0.8} />
        <path d="M430,240 C510,268 530,310 508,352 C540,310 528,254 474,230Z" fill={C.creamShade} />
        <path d="M74,200 C84,296 130,370 190,396 C124,352 88,282 82,200Z" fill="#FFFFFF" opacity={0.7} />
      </g>
      <ellipse cx="300" cy="170" rx="250" ry="56" fill={C.cream} {...st} />
      <ellipse cx="300" cy="174" rx="232" ry="47" fill={C.creamShade} stroke={C.ink} strokeWidth={w * 0.6} />
      <ellipse cx="300" cy="178" rx="222" ry="43" fill={C.broth} stroke={C.ink} strokeWidth={w * 0.6} />
      <ellipse cx="270" cy="170" rx="120" ry="18" fill={C.brothDeep} opacity={0.35} />
      <g clipPath="url(#bf-broth)" opacity={Math.min(1, bloom * 2.4)}>
        {strands.map((d, i) => (<g key={i}><path d={d} fill="none" stroke={C.ink} strokeWidth={13 * (1) + 2} strokeLinecap="round" opacity={0.9} /><path d={d} fill="none" stroke={i % 2 ? C.noodle : '#F8DC8C'} strokeWidth={10} strokeLinecap="round" /></g>))}
      </g>
      {toppings >= 1 && (<g transform="translate(205,150)"><path d="M-44,10 C-52,-30 -8,-48 30,-42 C64,-36 70,-4 56,22 C40,44 -8,48 -30,34 C-40,28 -44,18 -44,10Z" fill={C.white} stroke={C.ink} strokeWidth={w} strokeLinejoin="round" /><circle cx="6" cy="2" r="22" fill={C.mustard} stroke={C.ink} strokeWidth={w * 0.8} /></g>)}
      {toppings >= 2 && (<g transform="translate(395,138)"><path d="M-48,16 C-58,-30 -10,-60 36,-48 C70,-40 80,-6 62,22 C42,48 -12,52 -34,38 C-44,32 -48,24 -48,16Z" fill={C.green} stroke={C.ink} strokeWidth={w} strokeLinejoin="round" /><path d="M-30,30 C-6,-6 24,-26 56,-36" fill="none" stroke={C.greenDeep} strokeWidth={5} strokeLinecap="round" /></g>)}
      {toppings >= 3 && (<g transform="translate(300,146) rotate(-10)"><path d="M-62,-6 C-30,-26 34,-20 66,6 C68,18 56,24 46,22 C10,30 -40,20 -60,6 C-66,2 -66,-2 -62,-6Z" fill={C.tomato} stroke={C.ink} strokeWidth={w} strokeLinejoin="round" /></g>)}
    </Svg>
  );
};

/* steam: pale outlined curls (reference style) */
export const SteamFlat: React.FC<{size?: number; k?: number; t?: number}> = ({size = 360, k = 1, t = 0}) => (
  <Svg vbW={300} vbH={260} size={size}>
    {[60, 150, 240].map((x, i) => { const s = Math.sin((t + i * 9) * 0.1) * 8; const d = `M${x},250 C${x - 36 + s},200 ${x + 36 + s},170 ${x},120 C${x - 28 - s},80 ${x + 26 - s},50 ${x},10`; return <path key={i} d={d} fill="none" stroke="#E1DACB" strokeWidth={16} strokeLinecap="round" opacity={0.85 * k} />; })}
  </Svg>
);

/* ------------------------------ BOWL (top-down) ------------------------------ */
export const BowlTopFlat: React.FC<{size?: number; ripple?: number; toppings?: {egg: [number, number, number]; choy: [number, number, number]; chili: [number, number, number]; ball: [number, number, number]}}> = ({size = 760, ripple = 0, toppings}) => {
  const R = 300, w = sw(2 * R + 60, size);
  const strands = Array.from({length: 24}).map((_, i) => { const a = (i / 24) * Math.PI * 2 + 0.5, r = 40 + (i % 5) * 44; const cx = Math.cos(a) * r * 0.62, cy = Math.sin(a) * r * 0.62; let d = `M${cx - 95},${cy}`; for (let k = 0; k < 5; k++) d += ` q19,${k % 2 ? -16 : 16} 38,0`; return d; });
  const sh = (p: [number, number, number]) => `translate(${p[0]},${p[1]}) scale(${p[2]})`;
  return (
    <Svg vbW={2 * R + 60} vbH={2 * R + 60} size={size}>
      <g transform={`translate(${R + 30},${R + 30})`}>
        <ellipse cx={18} cy={22} rx={R} ry={R} fill={C.shadow} />
        <circle r={R} fill={C.cream} stroke={C.ink} strokeWidth={w} />
        <circle r={R * 0.93} fill="none" stroke={C.tomato} strokeWidth={R * 0.07} />
        <circle r={R * 0.964} fill="none" stroke={C.ink} strokeWidth={w * 0.6} /><circle r={R * 0.896} fill="none" stroke={C.ink} strokeWidth={w * 0.6} />
        <circle r={R * 0.8} fill={C.broth} stroke={C.ink} strokeWidth={w * 0.7} />
        <clipPath id="bt-clip"><circle r={R * 0.78} /></clipPath>
        <g clipPath="url(#bt-clip)">{strands.map((d, i) => (<g key={i}><path d={d} fill="none" stroke={C.ink} strokeWidth={17} strokeLinecap="round" /><path d={d} fill="none" stroke={i % 2 ? C.noodle : '#F8DC8C'} strokeWidth={13} strokeLinecap="round" /></g>))}</g>
        {ripple > 0 && <circle r={R * 0.8 * (0.4 + 0.6 * ripple)} fill="none" stroke="#FFF1CC" strokeWidth={8 * (1 - ripple)} opacity={0.9 * (1 - ripple)} />}
        {toppings && (
          <>
            <g transform={sh(toppings.choy)}><path d="M-80,10 C-90,-44 -34,-80 18,-72 C76,-64 98,-14 84,34 C66,80 6,88 -38,70 C-66,58 -78,34 -80,10Z" fill={C.green} stroke={C.ink} strokeWidth={w} strokeLinejoin="round" /><path d="M-58,16 C-58,-26 -24,-52 14,-52 C-18,-26 -30,12 -20,50 C-44,42 -56,32 -58,16Z" fill="#78B07F" /><path d="M-18,52 C-2,8 32,-30 70,-48" fill="none" stroke={C.greenDeep} strokeWidth={5} strokeLinecap="round" /></g>
            <g transform={sh(toppings.egg)}><path d="M-68,6 C-74,-44 -28,-66 16,-60 C64,-54 78,-14 64,26 C50,60 4,68 -34,56 C-58,48 -66,28 -68,6Z" fill={C.white} stroke={C.ink} strokeWidth={w} strokeLinejoin="round" /><circle cx={0} cy={-2} r={30} fill={C.mustard} stroke={C.ink} strokeWidth={w * 0.8} /></g>
            <g transform={sh(toppings.chili)}><path d="M-64,-8 C-30,-30 36,-22 70,8 C74,20 62,26 50,24 C14,32 -40,20 -62,6 C-70,2 -70,-4 -64,-8Z" fill={C.tomato} stroke={C.ink} strokeWidth={w} strokeLinejoin="round" /></g>
            <g transform={sh(toppings.ball)}><circle r={36} fill={C.brown} stroke={C.ink} strokeWidth={w} /><path d="M-20,-14 C-12,-26 2,-30 14,-28" fill="none" stroke="#D9A06A" strokeWidth={5} strokeLinecap="round" /></g>
          </>
        )}
      </g>
    </Svg>
  );
};

/* ------------------------------ COIN / TAG ------------------------------ */
export const CoinFlat: React.FC<{size?: number}> = ({size = 120}) => (
  <Svg vbW={140} vbH={140} size={size}>
    <ellipse cx="72" cy="130" rx="46" ry="6" fill={C.shadow} />
    <circle cx="70" cy="68" r="58" fill={C.mustard} stroke={C.ink} strokeWidth={sw(140, size)} />
    <circle cx="70" cy="68" r="42" fill="#F4CE62" stroke={C.mustardDeep} strokeWidth={4} />
    <text x="70" y="82" textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={38} fill={C.mustardDeep}>Rp</text>
  </Svg>
);
export const PriceTagFlat: React.FC<{text: string; width?: number; fs?: number}> = ({text, width = 560, fs}) => {
  const w = sw(420, width);
  return (
    <Svg vbW={420} vbH={150} size={width}>
      <path d="M22,74 C-8,54 12,14 44,34 C58,44 62,58 58,70" fill="none" stroke={C.ink} strokeWidth={w} strokeLinecap="round" />
      <path d="M44,75 L84,22 H394 Q410,22 410,38 V112 Q410,128 394,128 H84Z" fill={C.tomato} stroke={C.ink} strokeWidth={w} strokeLinejoin="round" />
      <path d="M84,22 L44,75 L84,128 L100,128 L62,75 L100,22Z" fill={C.tomatoDeep} opacity={0.5} />
      <circle cx="76" cy="75" r="12" fill={C.paper} stroke={C.ink} strokeWidth={w * 0.8} />
      <text x="262" y="98" textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={fs ?? (text.length > 8 ? 58 : 66)} fill={C.white}>{text}</text>
    </Svg>
  );
};
