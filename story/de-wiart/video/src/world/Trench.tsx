import React, {useMemo} from 'react';
import {clamp, easeOut, mix, mulberry32, ridge, W} from './util';

export const NHAZE = '#2a3d58';
export const mcol = (y: number) => mix('#5a5448', '#1a1814', clamp((y - 690) / 400));

export const SkyNight: React.FC<{f: number; glow: number}> = ({f, glow}) => {
  const stars = useMemo(() => {
    const r = mulberry32(77);
    return Array.from({length: 130}, () => ({x: r() * (W + 800) - 400, y: r() * 520, s: 0.6 + r() * 1.6, p: r() * 6}));
  }, []);
  return (
    <>
      <defs>
        <linearGradient id="nSky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#04070e" /><stop offset=".45" stopColor="#101a2c" /><stop offset=".72" stopColor="#2a2a3a" /><stop offset=".88" stopColor="#6a3a2a" /><stop offset="1" stopColor="#a65a2a" />
        </linearGradient>
        <radialGradient id="nFire" cx=".5" cy="1" r="1"><stop offset="0" stopColor="#ff8a3a" stopOpacity=".8" /><stop offset="1" stopColor="#ff6a2a" stopOpacity="0" /></radialGradient>
      </defs>
      <rect x={-700} y={-300} width={W + 1400} height={1000} fill="url(#nSky)" />
      {stars.map((s, i) => <circle key={i} cx={s.x} cy={s.y} r={s.s} fill="#dfe8ff" opacity={(0.35 + 0.5 * Math.sin(f * 0.07 + s.p) ** 2) * (1 - glow * 0.7)} />)}
      <ellipse cx={400} cy={690} rx={700} ry={150} fill="url(#nFire)" opacity={0.7 + glow * 0.4} />
      <ellipse cx={1500} cy={690} rx={500} ry={110} fill="url(#nFire)" opacity={0.5 + glow * 0.3} />
    </>
  );
};

/** crossing searchlight beams (screen blend) */
export const Beams: React.FC<{f: number}> = ({f}) => (
  <>
    <defs>
      <linearGradient id="beamG" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stopColor="#dfeaff" stopOpacity=".5" /><stop offset="1" stopColor="#dfeaff" stopOpacity="0" /></linearGradient>
      <filter id="beamB"><feGaussianBlur stdDeviation="10" /></filter>
    </defs>
    <g filter="url(#beamB)">
      {[0, 1].map((i) => {
        const bx = i ? 1560 : 300, a = (i ? -1 : 1) * (0.22 + 0.1 * Math.sin(f * 0.012 + i * 2));
        return <polygon key={i} points={`${bx - 14},700 ${bx + 14},700 ${bx + 14 + Math.sin(a) * 1200 + 70},-200 ${bx - 14 + Math.sin(a) * 1200 - 70},-200`} fill="url(#beamG)" opacity=".5" />;
      })}
    </g>
  </>
);

/** ruined skyline: church tower, broken walls, chimney stacks */
export const Ruins: React.FC<{haze: number}> = ({haze}) => {
  const c = mix('#0c121e', NHAZE, haze), rim = '#ff8a4a';
  const rd = ridge(41, 690, 22, [0.006, 0.02, 0.05]);
  return (
    <>
      <path d={rd.fill} fill={c} />
      <g fill={c}>
        <path d="M980 700 V470 L1000 430 L1020 470 V700 Z M940 700 V560 L952 540 L964 560 V700 Z M1020 700 V540 L1034 520 L1048 540 V700 Z" />
        <path d="M1060 700 V620 L1090 600 L1100 640 L1130 612 V700 Z M240 700 V600 L262 580 L270 612 L300 590 L330 620 V700 Z M1500 700 V640 L1530 610 L1560 650 V700 Z" />
        <rect x={1185} y={560} width={22} height={140} /><rect x={1230} y={600} width={18} height={100} />
      </g>
      <path d="M980 470 L1000 430 L1020 470" stroke={rim} strokeWidth="2" fill="none" opacity=".4" />
      <path d={rd.top} stroke={rim} strokeWidth="1.5" fill="none" opacity=".25" />
      {/* lit windows */}
      {[[996, 520], [996, 580], [1043, 600]].map(([x, y], i) => <rect key={i} x={x} y={y} width={8} height={18} fill="#ffb25a" opacity=".6" />)}
    </>
  );
};

export const DeadTree: React.FC<{x: number; y: number; s: number; haze: number; seed: number}> = ({x, y, s, haze, seed}) => {
  const r = mulberry32(seed);
  const c = mix('#10151c', NHAZE, haze);
  const br = Array.from({length: 6}, (_, i) => ({a: -0.9 + i * 0.35 + (r() - 0.5) * 0.3, l: (60 + r() * 90) * s, y: -(110 + i * 34) * s}));
  return (
    <g transform={`translate(${x} ${y})`}>
      <path d={`M${-10 * s} 0 Q${-6 * s} ${-120 * s} ${-3 * s} ${-300 * s} L${4 * s} ${-296 * s} Q${8 * s} ${-120 * s} ${12 * s} 0 Z`} fill={c} />
      {br.map((b, i) => <path key={i} d={`M0 ${b.y} q${Math.sin(b.a) * b.l * 0.5} ${-b.l * 0.5} ${Math.sin(b.a) * b.l} ${-Math.cos(b.a) * b.l * 0.9}`} stroke={c} strokeWidth={Math.max(2, 6 * s - i)} fill="none" strokeLinecap="round" />)}
      <path d={`M${-10 * s} 0 Q${-6 * s} ${-120 * s} ${-3 * s} ${-300 * s}`} stroke="#ff9a5a" strokeWidth="1.6" fill="none" opacity={0.35 * (1 - haze)} />
    </g>
  );
};

export const Wire: React.FC<{y: number; x0: number; x1: number; s: number; haze: number; seed: number; f?: number; hits?: {x: number; t: number}[]}> = ({y, x0, x1, s, haze, seed, f = 0, hits = []}) => {
  const c = mix('#0d1118', NHAZE, haze);
  const r = mulberry32(seed);
  const posts = [] as number[];
  for (let x = x0; x <= x1; x += 150 * s) posts.push(x + (r() - 0.5) * 20);
  let coil = '';
  for (let k = 0; k < 3; k++) {
    const yy = y - (30 + k * 26) * s;
    coil += `M${x0} ${yy}`;
    for (let x = x0; x < x1; x += 22 * s) coil += ` q${5 * s} ${-12 * s} ${11 * s} 0 t${11 * s} 0`;
  }
  return (
    <g>
      {posts.map((x, i) => { let tilt = 0; hits.forEach((h) => { const age = f - h.t, d = x - h.x; if (age > 0 && Math.abs(d) < 360) tilt += Math.sign(d) * (1 - Math.abs(d) / 360) * 24 * (1 - Math.exp(-age / 4)); }); return <path key={i} d={`M${x} ${y} L${x + (i % 2) * 4 + tilt} ${y - 120 * s * Math.cos(tilt / 40)}`} stroke={c} strokeWidth={5 * s} />; })}
      <path d={coil} stroke={c} strokeWidth={2 * s} fill="none" />
      <path d={coil} stroke="#ff9a5a" strokeWidth={1 * s} fill="none" opacity={0.28 * (1 - haze)} transform="translate(-2 -2)" />
    </g>
  );
};

/** sandbag parapet behind/around the character */
export const Sandbags: React.FC<{y: number; x0: number; x1: number; rows: number; s: number; light: number; seed: number; f?: number; hits?: {x: number; t: number}[]}> = ({y, x0, x1, rows, s, light, seed, f = 0, hits = []}) => {
  const r = mulberry32(seed);
  const bags: React.ReactNode[] = [];
  const bw = 120 * s, bh = 50 * s;
  for (let row = 0; row < rows; row++)
    for (let x = x0 - (row % 2) * bw * 0.5; x < x1; x += bw) {
      const k = r();
      const base = mix('#3a3224', '#8a7a58', clamp(light * 0.7 + k * 0.3));
      const yy = y - row * bh * 0.82;
      // blast reaction: bags near a shell burst are thrown up and sideways, then settle displaced
      let dx = 0, dy = 0, rotB = 0;
      hits.forEach((h) => {
        const age = f - h.t; if (age <= 0) return;
        const d = x + bw / 2 - h.x, amp = clamp(1 - Math.abs(d) / 300); if (amp <= 0) return;
        const vy = -(24 + 26 * amp) * (0.7 + k * 0.6) * (1 + (rows - row) * 0.15), g = 3, aL = (2 * -vy) / g, a = Math.min(age, aL);
        dx += Math.sign(d || 1) * amp * (40 + 60 * k) * (1 - Math.exp(-a / 8));
        dy += vy * a + 0.5 * g * a * a;
        rotB += Math.sign(d || 1) * amp * (a < aL ? a * 6 : 28 + 14 * k);
      });
      bags.push(
        <g key={`${row}-${x}`} transform={`translate(${dx} ${dy}) rotate(${rotB} ${x + bw / 2} ${yy - bh / 2})`}>
          <rect x={x} y={yy - bh} width={bw - 4} height={bh} rx={bh * 0.4} fill={base} stroke="#14100a" strokeWidth={2 * s} />
          <path d={`M${x + bw * 0.12} ${yy - bh * 0.78} Q${x + bw * 0.5} ${yy - bh * 1.02} ${x + bw * 0.86} ${yy - bh * 0.78}`} stroke="#d9c79a" strokeWidth={2.4 * s} fill="none" opacity={0.2 + light * 0.4} strokeLinecap="round" />
          <path d={`M${x + bw * 0.1} ${yy - bh * 0.35} L${x + bw * 0.9} ${yy - bh * 0.4}`} stroke="#14100a" strokeWidth={1.6 * s} opacity=".4" />
        </g>
      );
    }
  return <>{bags}</>;
};

export const Rain: React.FC<{f: number; seed: number; count: number}> = ({f, seed, count}) => {
  const d = useMemo(() => {
    const r = mulberry32(seed);
    return Array.from({length: count}, () => ({x: r() * (W + 400), y: r() * 1200, l: 30 + r() * 50, v: 40 + r() * 30, a: 0.1 + r() * 0.2}));
  }, [seed, count]);
  return (
    <>
      {d.map((p, i) => {
        const y = (p.y + f * p.v) % 1300 - 100, x = p.x - y * 0.18;
        return <line key={i} x1={x} y1={y} x2={x - p.l * 0.18} y2={y + p.l} stroke="#bcd0e8" strokeWidth="1.4" opacity={p.a} />;
      })}
    </>
  );
};

/** illumination flare: light + glow + trail. t = frames since ignition */
export const flareLight = (t: number, life = 150) => (t < 0 || t > life ? 0 : easeOut(t / 6) * (0.78 + 0.22 * Math.sin(t * 1.9)) * (1 - clamp((t - life * 0.6) / (life * 0.4))));
export const Flare: React.FC<{x: number; y0: number; t: number; drop: number; life?: number}> = ({x, y0, t, drop, life = 150}) => {
  if (t < 0 || t > life) return null;
  const I = flareLight(t, life);
  const y = y0 - Math.max(0, 40 - t) * 6 + t * drop, sx = x + Math.sin(t * 0.05) * 18;
  return (
    <g>
      <defs><radialGradient id="flG" cx=".5" cy=".5" r=".5"><stop offset="0" stopColor="#f4fff0" /><stop offset=".12" stopColor="#d8ffe0" stopOpacity=".9" /><stop offset=".4" stopColor="#9fd8c0" stopOpacity=".28" /><stop offset="1" stopColor="#6fb8a0" stopOpacity="0" /></radialGradient></defs>
      <circle cx={sx} cy={y} r={420 * I + 40} fill="url(#flG)" opacity={0.9} />
      <circle cx={sx} cy={y} r={9} fill="#fff" opacity={I} />
      {[1, 2, 3, 4, 5].map((i) => <circle key={i} cx={sx - Math.sin((t - i * 3) * 0.05) * 4} cy={y - i * 16} r={4 - i * 0.5} fill="#d8ffe0" opacity={0.4 * I / i} />)}
    </g>
  );
};

/** hanging smoke columns */
export const Smoke: React.FC<{f: number; x: number; y: number; seed: number; w: number}> = ({f, x, y, seed, w}) => {
  const r = mulberry32(seed);
  return (
    <>
      {Array.from({length: 9}, (_, i) => {
        const k = ((f * 0.4 + i * 22) % 200) / 200;
        return <ellipse key={i} cx={x + (r() - 0.5) * w * 0.4 + k * 120 + Math.sin(f * 0.02 + i) * 14} cy={y - k * 460} rx={(w * 0.3) * (0.6 + k * 1.6)} ry={(w * 0.2) * (0.6 + k * 1.4)} fill="#1a1c24" opacity={0.55 * (1 - k)} />;
      })}
    </>
  );
};

/** puddles reflecting the sky glow; rain makes rings */
export const Puddles: React.FC<{f: number; seed: number; y0: number; y1: number; glow: number; count?: number}> = ({f, seed, y0, y1, glow, count = 9}) => {
  const r = mulberry32(seed);
  return (
    <>
      {Array.from({length: count}, (_, i) => {
        const x = r() * 2920 - 500, y = y0 + r() * (y1 - y0), w = 90 + r() * 220, k = (y - y0) / (y1 - y0);
        return (
          <g key={i}>
            <ellipse cx={x} cy={y} rx={w * (0.6 + k)} ry={w * 0.09 * (0.6 + k)} fill="#0c1018" opacity=".7" />
            <ellipse cx={x} cy={y - 1} rx={w * (0.6 + k) * 0.9} ry={w * 0.06 * (0.6 + k)} fill={mix('#3a4a66', '#ff9a4a', 0.3 + 0.5 * glow)} opacity={0.55 + 0.3 * glow} />
            {[0, 1].map((j) => { const ph = ((f * 0.05 + i * 0.37 + j * 0.5) % 1); return <ellipse key={j} cx={x + Math.sin(i * 3 + j) * w * 0.3} cy={y} rx={w * 0.4 * ph * (0.6 + k)} ry={w * 0.05 * ph * (0.6 + k)} fill="none" stroke="#9fb4d8" strokeWidth="2" opacity={0.6 * (1 - ph)} />; })}
          </g>
        );
      })}
    </>
  );
};
