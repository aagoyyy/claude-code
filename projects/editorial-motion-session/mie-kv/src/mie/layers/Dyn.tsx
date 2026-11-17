import React from 'react';

/** Frame-driven SVG elements (fire, boiling, steam). Same techniques as the static art: layered tongues, turbulence-displaced volumetric steam. Deterministic. */
const rnd = (n: number) => { const x = Math.sin(n * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };
const clamp = (x: number, a = 0, b = 1) => Math.min(b, Math.max(a, x));
const prog = (f: number, a: number, b: number) => clamp((f - a) / (b - a));
const eo = (t: number) => 1 - Math.pow(1 - clamp(t), 3);

/* ------------------------------------------------ FIRE */
export const Flame: React.FC<{f: number; at: number}> = ({f, at}) => {
  const t = f - at;
  if (t < 0) return null;
  const k = Math.max(0, 1 - Math.exp(-t / 2.6) * Math.cos(t * 0.9));          // ignition pop with overshoot
  const cx = 360, cy = 1014, rx = 92, ry = 15, n = 24;
  const tongues = Array.from({length: n}).map((_, i) => {
    const a = (i / n) * Math.PI * 2;
    const x = cx + rx * Math.cos(a), y = cy + ry * Math.sin(a);
    const flick = 1 + 0.2 * Math.sin(f * 0.95 + i * 1.3) + 0.1 * Math.sin(f * 2.1 + i * 2.4);
    const h = (34 + 14 * Math.sin(i * 1.7) + 7 * Math.cos(i * 2.9) + (rnd(i) * 8 - 4)) * 0.9 * k * flick;
    const lean = 4 * Math.sin(i * 1.1) + (rnd(i + 9) * 4 - 2) + 3 * Math.sin(f * 0.5 + i);
    return {x, y, h, lean};
  }).sort((a, b) => a.y - b.y);
  const tg = (x: number, y: number, h: number, lean: number, kk: number, wk: number) =>
    `M${x - 9 * wk},${y} C${x - 12 * wk + lean * 0.3},${y - h * kk * 0.55} ${x - 2 * wk + lean * 0.8},${y - h * kk * 0.82} ${x + lean},${y - h * kk} ` +
    `C${x + 3 * wk + lean * 0.8},${y - h * kk * 0.82} ${x + 12 * wk + lean * 0.3},${y - h * kk * 0.55} ${x + 9 * wk},${y} Z`;
  const glow = 0.85 + 0.15 * Math.sin(f * 0.8);
  return (
    <g>
      <defs>
        <radialGradient id="dynGlow" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stopColor="#9FD0FF" stopOpacity="0.55" /><stop offset="0.5" stopColor="#4E9BFF" stopOpacity="0.22" /><stop offset="1" stopColor="#4E9BFF" stopOpacity="0" /></radialGradient>
      </defs>
      <ellipse cx={cx} cy={cy - 8} rx={rx * 1.7} ry={ry * 3.2} fill="url(#dynGlow)" opacity={Math.min(1, k) * glow} />
      {tongues.map((o, i) => (
        <g key={i}>
          <path d={tg(o.x, o.y, o.h, o.lean, 1, 1)} fill="#2F7BE0" opacity={0.9} />
          <path d={tg(o.x, o.y, o.h, o.lean, 0.78, 0.72)} fill="#7DC0FF" />
          <path d={tg(o.x, o.y, o.h, o.lean, 0.5, 0.42)} fill="#EAF8FF" />
        </g>
      ))}
    </g>
  );
};

/* ------------------------------------------------ BOILING */
const BUB: [number, number, number, number][] = [[318, 696, 13, 0], [354, 688, 9, 5], [396, 698, 15, 9], [430, 690, 10, 3], [290, 690, 8, 12], [452, 696, 7, 7], [372, 704, 7, 2], [330, 702, 6, 14], [412, 704, 8, 6]];
export const Bubbles: React.FC<{f: number; start: number}> = ({f, start}) => {
  if (f < start) return null;
  const heat = prog(f, start, start + 24);                               // more bubbles as the water heats
  return (
    <g>
      {BUB.map(([x, y, r, off], i) => {
        if (i / BUB.length > heat) return null;
        const cyc = 16, u = ((f + off) % cyc) / cyc;
        const rr = r * Math.min(1, u * 3.2) * (1 + 0.06 * Math.sin(f * 0.8 + i));
        const o = u > 0.84 ? 1 - (u - 0.84) / 0.16 : 1;
        const yy = y - 3 * u;
        return (
          <g key={i} opacity={0.92 * o}>
            <circle cx={x} cy={yy} r={rr} fill="#F7FCFF" stroke="#6FA8D4" strokeWidth={2.2} />
            <circle cx={x - rr * 0.3} cy={yy - rr * 0.3} r={rr * 0.28} fill="#fff" />
          </g>
        );
      })}
    </g>
  );
};

/* ------------------------------------------------ STEAM (volumetric wisps) */
export type Wisp = {x: number; y: number; h: number; w: number; start: number};
const wispD = (x: number, y: number, h: number, w: number) =>
  `M${x},${y} C${x - w},${y - h * 0.28} ${x + w},${y - h * 0.5} ${x},${y - h * 0.72} S${x - w * 0.7},${y - h * 0.96} ${x + w * 0.25},${y - h}`;
export const Steam: React.FC<{f: number; id: string; wisps: Wisp[]; op?: number; th?: number; scale?: number; seed?: number; fade?: number}> = ({f, id, wisps, op = 0.7, th = 24, scale = 46, seed = 3, fade = 1}) => {
  const bf = (a: number, b: number) => `${a + 0.0012 * Math.sin(f * 0.06)} ${b + 0.002 * Math.cos(f * 0.05)}`;
  return (
    <g opacity={fade}>
      <defs>
        <filter id={`${id}a`} x="-40%" y="-25%" width="180%" height="150%" colorInterpolationFilters="sRGB">
          <feTurbulence type="fractalNoise" baseFrequency={bf(0.011, 0.02)} numOctaves={3} seed={seed} result="n" />
          <feDisplacementMap in="SourceGraphic" in2="n" scale={scale} xChannelSelector="R" yChannelSelector="G" result="d" />
          <feGaussianBlur in="d" stdDeviation={4} />
        </filter>
        <filter id={`${id}b`} x="-40%" y="-25%" width="180%" height="150%" colorInterpolationFilters="sRGB">
          <feTurbulence type="fractalNoise" baseFrequency={bf(0.016, 0.03)} numOctaves={2} seed={seed + 4} result="n" />
          <feDisplacementMap in="SourceGraphic" in2="n" scale={scale * 0.7} xChannelSelector="G" yChannelSelector="R" result="d" />
          <feGaussianBlur in="d" stdDeviation={1.6} />
        </filter>
      </defs>
      {(['a', 'b', 'c'] as const).map((layer) => (
        <g key={layer} filter={`url(#${id}${layer === 'a' ? 'a' : 'b'})`}>
          {wisps.map((w, i) => {
            const t = f - w.start;
            if (t < 0) return null;
            const env = clamp(t / 10) * op;
            const grow = 0.35 + 0.65 * eo(t / 14);
            const sway = Math.sin(f * 0.08 + i * 1.7) * 6;
            const d = wispD(w.x, w.y, w.h, w.w);
            const base = `translate(${sway} 0) translate(${w.x} ${w.y}) scale(1 ${grow}) translate(${-w.x} ${-w.y})`;
            const flow = -(f * 0.018 + i * 0.23);
            if (layer === 'a') return <path key={i} d={d} transform={base} fill="none" stroke="#FFFFFF" strokeWidth={th * 1.8} strokeLinecap="round" opacity={env * 0.5} />;
            if (layer === 'b') return <path key={i} d={d} transform={base} fill="none" stroke="#FFF9EC" strokeWidth={th * 0.75} strokeLinecap="round" opacity={env} strokeDasharray="0.62 0.38" pathLength={1} strokeDashoffset={flow} />;
            return <path key={i} d={wispD(w.x - 7, w.y, w.h, w.w)} transform={base} fill="none" stroke="#C9B9A2" strokeWidth={2.4} strokeLinecap="round" opacity={env * 0.55} />;
          })}
        </g>
      ))}
    </g>
  );
};

/* ------------------------------------------------ PRESSURE PUFFS escaping under the lid */
const PUFF: [number, number, number, number, number][] = [[176, 668, 24, -1, 0], [150, 636, 17, -1, 3], [182, 612, 12, -1, 6], [548, 668, 24, 1, 1], [576, 636, 17, 1, 4], [550, 610, 12, 1, 7]];
export const Puffs: React.FC<{f: number; start: number; lidY: number}> = ({f, start, lidY}) => {
  if (f < start) return null;
  return (
    <g>
      <defs>
        <filter id="dynPuff" x="-40%" y="-40%" width="180%" height="180%" colorInterpolationFilters="sRGB">
          <feTurbulence type="fractalNoise" baseFrequency="0.03" numOctaves={3} seed={5} result="n" />
          <feDisplacementMap in="SourceGraphic" in2="n" scale={20} xChannelSelector="R" yChannelSelector="G" />
          <feGaussianBlur stdDeviation={1.4} />
        </filter>
      </defs>
      {PUFF.map(([x, y, r, side, off], i) => {
        const cyc = 26, t = (f - start - off * 1.5 + 100 * cyc) % cyc, u = t / cyc;
        if (f - start - off * 1.5 < 0) return null;
        const life = eo(u * 1.6), a = u < 0.7 ? 1 : 1 - (u - 0.7) / 0.3;
        const dx = side * 26 * life, dy = -46 * life - (lidY < 0 ? 0 : 0);
        const s = (0.35 + 0.8 * life);
        return (
          <g key={i} filter="url(#dynPuff)" opacity={0.95 * a} transform={`translate(${x + dx} ${y + dy}) scale(${s}) translate(${-x} ${-y})`}>
            <circle cx={x} cy={y} r={r} fill="#FFFDF6" />
            <circle cx={x + r * 0.5} cy={y + r * 0.35} r={r * 0.7} fill="#E9DFCB" opacity={0.6} />
            <circle cx={x - r * 0.35} cy={y - r * 0.3} r={r * 0.5} fill="#fff" />
          </g>
        );
      })}
    </g>
  );
};
