import React, {useMemo} from 'react';
import {Cam, camT, clamp, H, mix, mulberry32, ridge, W} from './util';

const SUN = {x: 360, y: 610};
const HAZE = '#ffc98e';

export const Layer: React.FC<{cam: Cam; depth: number; blur?: number; blend?: string; opacity?: number; children: React.ReactNode}> = ({cam, depth, blur = 0, blend, opacity, children}) => (
  <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{position: 'absolute', left: 0, top: 0, overflow: 'visible', filter: blur ? `blur(${blur}px)` : undefined, mixBlendMode: blend as any, opacity}}>
    <g transform={camT(cam, depth)}>{children}</g>
  </svg>
);

/** endless horizontal scroll for repeating layers: children must tile with period P */
export const Scroll: React.FC<{off: number; P?: number; children: React.ReactNode}> = ({off, P = 2920, children}) => {
  const o = ((off % P) + P) % P;
  return <><g transform={`translate(${-o} 0)`}>{children}</g><g transform={`translate(${-o + P} 0)`}>{children}</g></>;
};

/* ---------- sky ---------- */
export const Sky: React.FC<{f: number}> = ({f}) => {
  const clouds = useMemo(() => {
    const r = mulberry32(11);
    return Array.from({length: 9}, () => ({x: r() * 2200 - 150, y: 120 + r() * 330, rx: 160 + r() * 260, ry: 14 + r() * 26, a: 0.35 + r() * 0.4, sp: 0.12 + r() * 0.2}));
  }, []);
  return (
    <>
      <defs>
        <linearGradient id="skyBg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#222c48" /><stop offset=".28" stopColor="#4e4a73" /><stop offset=".5" stopColor="#a9667c" />
          <stop offset=".68" stopColor="#e88f62" /><stop offset=".86" stopColor="#ffbf7a" /><stop offset="1" stopColor="#ffe0a8" />
        </linearGradient>
        <radialGradient id="sunGlow" cx=".5" cy=".5" r=".5">
          <stop offset="0" stopColor="#fff4d6" stopOpacity="1" /><stop offset=".12" stopColor="#ffdca0" stopOpacity=".95" />
          <stop offset=".35" stopColor="#ffa561" stopOpacity=".42" /><stop offset="1" stopColor="#ff8a4a" stopOpacity="0" />
        </radialGradient>
        <filter id="cloudB" x="-20%" y="-60%" width="140%" height="220%"><feGaussianBlur stdDeviation="9" /></filter>
      </defs>
      <rect x={-700} y={-300} width={W + 1400} height={1000} fill="url(#skyBg)" />
      <circle cx={SUN.x} cy={SUN.y} r={720} fill="url(#sunGlow)" opacity=".85" />
      <circle cx={SUN.x} cy={SUN.y} r={64} fill="#fff6dc" />
      {clouds.map((c, i) => {
        const x = c.x + f * c.sp;
        const lit = clamp(1 - Math.abs(x - SUN.x) / 1300);
        return (
          <g key={i} opacity={c.a}>
            <ellipse cx={x} cy={c.y + 10} rx={c.rx} ry={c.ry} fill={mix('#7a4f73', '#f6a874', lit)} filter="url(#cloudB)" />
            <ellipse cx={x - c.rx * 0.12} cy={c.y - c.ry * 0.25} rx={c.rx * 0.78} ry={c.ry * 0.5} fill={mix('#d98a78', '#fff0c8', lit)} filter="url(#cloudB)" opacity=".85" />
          </g>
        );
      })}
    </>
  );
};

/* ---------- far mountains + haze ---------- */
export const Mountains: React.FC = () => {
  const a = ridge(3, 590, 78, [0.0028, 0.007, 0.017]);
  const b = ridge(7, 612, 66, [0.0035, 0.011, 0.023]);
  return (
    <>
      <defs>
        <linearGradient id="mtA" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#c58a86" /><stop offset=".5" stopColor="#8d6c8a" /><stop offset="1" stopColor="#655a82" /></linearGradient>
        <linearGradient id="mtB" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#a8706a" /><stop offset=".55" stopColor="#74587a" /><stop offset="1" stopColor="#4f4872" /></linearGradient>
        <linearGradient id="mtFade" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#ffcf98" stopOpacity="0" /><stop offset="1" stopColor="#ffcf98" stopOpacity=".78" /></linearGradient>
      </defs>
      <path d={a.fill} fill="url(#mtA)" />
      <path d={a.top} fill="none" stroke="#ffd7a4" strokeWidth="2.5" opacity=".55" />
      <rect x={-600} y={520} width={W + 1200} height={160} fill="url(#mtFade)" opacity=".55" />
      <path d={b.fill} fill="url(#mtB)" />
      <path d={b.top} fill="none" stroke="#ffc88c" strokeWidth="2" opacity=".5" />
      <rect x={-600} y={560} width={W + 1200} height={130} fill="url(#mtFade)" opacity=".6" />
    </>
  );
};

/* ---------- acacia tree ---------- */
export const Acacia: React.FC<{x: number; y: number; s: number; seed: number; haze: number}> = ({x, y, s, seed, haze}) => {
  const r = mulberry32(seed);
  const dark = mix('#2f3320', HAZE, haze), mid = mix('#6a6a33', HAZE, haze), lite = mix('#b3a24a', HAZE, haze), rim = mix('#ffe2a0', HAZE, haze * 0.5);
  const trunkC = mix('#3b2a22', HAZE, haze);
  const blobs = Array.from({length: 7}, (_, i) => ({cx: (i - 3) * 62 * s + (r() - 0.5) * 30 * s, cy: -250 * s + (r() - 0.5) * 36 * s, rx: (110 + r() * 60) * s, ry: (26 + r() * 14) * s}));
  return (
    <g transform={`translate(${x} ${y})`}>
      {/* trunk + branches */}
      <path d={`M${-9 * s} 0 Q${-6 * s} ${-110 * s} ${-18 * s} ${-230 * s} L${6 * s} ${-230 * s} Q${14 * s} ${-110 * s} ${10 * s} 0 Z`} fill={trunkC} />
      <path d={`M${-4 * s} ${-130 * s} Q${-70 * s} ${-170 * s} ${-150 * s} ${-235 * s} M${4 * s} ${-140 * s} Q${70 * s} ${-170 * s} ${150 * s} ${-238 * s} M0 ${-160 * s} Q${10 * s} ${-200 * s} ${20 * s} ${-246 * s}`} stroke={trunkC} strokeWidth={9 * s} fill="none" strokeLinecap="round" />
      <path d={`M${-9 * s} 0 Q${-6 * s} ${-110 * s} ${-18 * s} ${-230 * s}`} stroke={rim} strokeWidth={2 * s} fill="none" opacity=".5" />
      {/* canopy: shade → mid → lit top */}
      {blobs.map((b, i) => <ellipse key={'d' + i} cx={b.cx + 6 * s} cy={b.cy + 16 * s} rx={b.rx} ry={b.ry} fill={dark} />)}
      {blobs.map((b, i) => <ellipse key={'m' + i} cx={b.cx} cy={b.cy} rx={b.rx * 0.95} ry={b.ry * 0.9} fill={mid} />)}
      {blobs.map((b, i) => <ellipse key={'l' + i} cx={b.cx - 10 * s} cy={b.cy - 8 * s} rx={b.rx * 0.7} ry={b.ry * 0.5} fill={lite} />)}
      {blobs.map((b, i) => <path key={'r' + i} d={`M${b.cx - b.rx * 0.8} ${b.cy - b.ry * 0.2} Q${b.cx - b.rx * 0.2} ${b.cy - b.ry * 1.05} ${b.cx + b.rx * 0.3} ${b.cy - b.ry * 0.8}`} stroke={rim} strokeWidth={2.5 * s} fill="none" opacity=".7" strokeLinecap="round" />)}
    </g>
  );
};

/* ---------- rock (faceted) with cast shadow ---------- */
export const Rock: React.FC<{x: number; y: number; w: number; h: number; seed: number; haze: number; id: string}> = ({x, y, w, h, seed, haze, id}) => {
  const r = mulberry32(seed);
  const n = 9;
  const pts = Array.from({length: n}, (_, i) => {
    const a = (i / n) * Math.PI * 2;
    return [Math.cos(a) * w * (0.8 + r() * 0.25), Math.sin(a) * h * (0.78 + r() * 0.3)] as [number, number];
  });
  const path = 'M' + pts.map((p) => p.join(' ')).join(' L') + ' Z';
  const litC = mix('#d99a62', HAZE, haze), midC = mix('#8a5a48', HAZE, haze), shC = mix('#4a3040', HAZE, haze * 0.8), topC = mix('#ffd8a0', HAZE, haze * 0.5);
  return (
    <g transform={`translate(${x} ${y - h * 0.5})`}>
      <defs><clipPath id={id}><path d={path} /></clipPath></defs>
      {/* long cast shadow to the right on the ground */}
      <ellipse cx={w * 1.6} cy={h * 0.55} rx={w * 2.2} ry={h * 0.16} fill="#2a1a22" opacity={0.34 * (1 - haze)} />
      <path d={path} fill={midC} />
      <g clipPath={`url(#${id})`}>
        <rect x={-w * 1.2} y={-h * 1.2} width={w * 1.5} height={h * 2.4} fill={litC} />
        <polygon points={`${-w * 0.2},${-h * 1.2} ${w * 0.5},${-h * 1.2} ${-w * 0.1},${h * 1.2} ${-w * 0.9},${h * 1.2}`} fill={litC} opacity=".0" />
        <rect x={w * 0.25} y={-h * 1.2} width={w * 1.2} height={h * 2.4} fill={shC} opacity=".85" />
        <polygon points={`${-w},${-h * 0.1} ${-w * 0.1},${-h * 1.2} ${w * 0.45},${-h * 1.2} ${w * 0.1},${-h * 0.05}`} fill={topC} opacity=".55" />
        <path d={`M${-w * 0.2} ${-h * 0.5} L${w * 0.1} ${h * 0.1} L${-w * 0.05} ${h * 0.6} M${w * 0.2} ${-h * 0.3} L${w * 0.45} ${h * 0.25}`} stroke={shC} strokeWidth="2.5" fill="none" opacity=".6" />
        <rect x={-w * 1.2} y={h * 0.2} width={w * 2.4} height={h} fill="#1d1218" opacity=".28" />
      </g>
      <path d={path} fill="none" stroke={topC} strokeWidth="2" opacity=".35" strokeDasharray={`${w * 0.8} ${w * 4}`} />
    </g>
  );
};

/* ---------- ground plane with grass texture ---------- */
export const gcol = (y: number) => mix('#e9b070', '#744a2a', clamp((y - 690) / 400));
export const Plains: React.FC<{seed: number; y0: number; y1: number; count: number; haze0: number; haze1: number; fade?: number; sunPatch?: boolean; colorAt?: (y: number) => string; haze?: string}> = ({seed, y0, y1, count, haze0, haze1, fade = 0, sunPatch, colorAt, haze}) => {
  const cAt = colorAt || gcol; const HZ = haze || HAZE;
  const far = cAt(y0), near = cAt(y1);
  const strokes = useMemo(() => {
    const r = mulberry32(seed);
    return Array.from({length: count}, () => {
      const t = Math.pow(r(), 1.6);
      const y = y0 + t * (y1 - y0);
      const k = (y - y0) / (y1 - y0);
      return {x: r() * (W + 1000) - 500, y, l: 6 + k * 48 * (0.4 + r()), c: mix(mix(mix(cAt(y), '#000000', 0.25), mix(cAt(y), '#ffffff', 0.25), r()), HZ, lerpHaze(haze0, haze1, k)), o: 0.35 + r() * 0.4, w: 1 + k * 2.2};
    });
  }, [seed, y0, y1, count, haze0, haze1]);
  return (
    <>
      <defs>
        <linearGradient id={`pl${seed}`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={far} /><stop offset="1" stopColor={near} /></linearGradient>
        <linearGradient id={`pm${seed}`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#000" /><stop offset={fade ? 0.18 : 0} stopColor="#fff" /></linearGradient>
        <mask id={`pmk${seed}`} maskUnits="userSpaceOnUse" x={-4000} y={y0} width={12000} height={y1 - y0 + 420}><rect x={-4000} y={y0} width={12000} height={y1 - y0 + 420} fill={`url(#pm${seed})`} /></mask>
        <linearGradient id={`pls${seed}`} x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#ffd890" stopOpacity=".38" /><stop offset=".55" stopColor="#ffd890" stopOpacity=".0" /><stop offset="1" stopColor="#2a1820" stopOpacity=".22" /></linearGradient>
      </defs>
      <g mask={`url(#pmk${seed})`}>
      <rect x={-4000} y={y0} width={12000} height={y1 - y0 + 400} fill={`url(#pl${seed})`} />
      <rect x={-4000} y={y0} width={12000} height={y1 - y0 + 400} fill={`url(#pls${seed})`} />
      {strokes.map((s, i) => <path key={i} d={`M${s.x} ${s.y} q${s.l * 0.15} ${-s.l * 0.6} ${s.l * 0.3} ${-s.l}`} stroke={s.c} strokeWidth={s.w} opacity={s.o} fill="none" strokeLinecap="round" />)}
      {sunPatch && [0, 1, 2, 3, 4].map((i) => <polygon key={i} points={`${160 + i * 330},${y0} ${260 + i * 330},${y0} ${60 + i * 360},${y1 + 200} ${-140 + i * 360},${y1 + 200}`} fill="#ffe0a0" opacity=".07" />)}
      </g>
    </>
  );
};
const lerpHaze = (a: number, b: number, t: number) => a + (b - a) * t;

/* ---------- animated grass blades ---------- */
export const Grass: React.FC<{f: number; seed: number; count: number; yMin: number; yMax: number; hMin: number; hMax: number; xMin?: number; xMax?: number; cDark: string; cLite: string; sway?: number}> = ({f, seed, count, yMin, yMax, hMin, hMax, xMin = -500, xMax = W + 500, cDark, cLite, sway = 1}) => {
  const blades = useMemo(() => {
    const r = mulberry32(seed);
    return Array.from({length: count}, () => ({x: xMin + r() * (xMax - xMin), y: yMin + r() * (yMax - yMin), h: hMin + r() * (hMax - hMin), b: (r() - 0.5) * 60, w: 2 + r() * 4, ph: r() * 6.28, t: r()}));
  }, [seed, count, yMin, yMax, hMin, hMax, xMin, xMax]);
  return (
    <>
      {blades.map((b, i) => {
        const wind = Math.sin(f * 0.07 + b.x * 0.008 + b.ph) * 9 * sway + Math.sin(f * 0.023 + b.ph) * 5 * sway;
        const tx = b.x + b.b + wind * (b.h / 140), ty = b.y - b.h;
        const cx = b.x + b.b * 0.35 + wind * 0.25;
        const col = mix(cDark, cLite, b.t);
        return (
          <g key={i}>
            <path d={`M${b.x - b.w} ${b.y} Q${cx - b.w * 0.6} ${b.y - b.h * 0.55} ${tx} ${ty} Q${cx + b.w * 0.6} ${b.y - b.h * 0.5} ${b.x + b.w} ${b.y} Z`} fill={col} />
            <path d={`M${b.x - b.w * 0.2} ${b.y} Q${cx - b.w * 0.4} ${b.y - b.h * 0.55} ${tx} ${ty}`} stroke="#ffe7a8" strokeWidth={Math.max(0.8, b.w * 0.28)} fill="none" opacity={0.28 * b.t} />
          </g>
        );
      })}
    </>
  );
};

/* ---------- floating dust motes ---------- */
export const Motes: React.FC<{f: number; seed: number; count: number; size: number; speed: number}> = ({f, seed, count, size, speed}) => {
  const m = useMemo(() => {
    const r = mulberry32(seed);
    return Array.from({length: count}, () => ({x: r() * W, y: 120 + r() * 900, ph: r() * 6.28, s: 0.5 + r(), v: 0.4 + r() * 0.8, a: 0.25 + r() * 0.55}));
  }, [seed, count]);
  return (
    <>
      {m.map((p, i) => {
        const x = ((p.x + f * speed * p.v) % (W + 400)) - 200;
        const y = p.y + Math.sin(f * 0.04 + p.ph) * 18 - f * speed * 0.12;
        const tw = 0.55 + 0.45 * Math.sin(f * 0.08 + p.ph);
        return <circle key={i} cx={x} cy={((y % 1000) + 1000) % 1000 + 40} r={size * p.s} fill="#ffe2ae" opacity={p.a * tw} />;
      })}
    </>
  );
};

/* ---------- god rays from the low sun ---------- */
export const Rays: React.FC<{f: number}> = ({f}) => (
  <>
    <defs>
      <linearGradient id="rayG" gradientUnits="userSpaceOnUse" x1={SUN.x} y1={SUN.y} x2={SUN.x + 1700} y2={SUN.y + 200}>
        <stop offset="0" stopColor="#ffe6b0" stopOpacity=".5" /><stop offset=".6" stopColor="#ffd08a" stopOpacity=".12" /><stop offset="1" stopColor="#ffd08a" stopOpacity="0" />
      </linearGradient>
      <filter id="rayB"><feGaussianBlur stdDeviation="14" /></filter>
    </defs>
    <g filter="url(#rayB)">
      {[0, 1, 2, 3, 4, 5, 6].map((i) => {
        const a = -0.34 + i * 0.1 + Math.sin(f * 0.012 + i) * 0.012;
        const wd = 0.035 + (i % 3) * 0.02;
        const L = 2300;
        const p = (an: number) => `${SUN.x + Math.cos(an) * L},${SUN.y + Math.sin(an) * L}`;
        return <polygon key={i} points={`${SUN.x},${SUN.y} ${p(a - wd)} ${p(a + wd)}`} fill="url(#rayG)" opacity={0.55 + 0.25 * Math.sin(f * 0.02 + i * 1.7)} />;
      })}
    </g>
  </>
);

/* ---------- distant hills with tiny acacias ---------- */
export const Hills: React.FC<{seed: number; base: number; amp: number; haze: number}> = ({seed, base, amp, haze}) => {
  const rd = ridge(seed, base, amp, [0.004, 0.012, 0.03]);
  const trees = useMemo(() => {
    const r = mulberry32(seed + 5);
    return Array.from({length: 26}, () => ({x: r() * (W + 800) - 400, s: 0.06 + r() * 0.06}));
  }, [seed]);
  const yAt = (x: number) => {
    // sample ridge y from path
    const re = new RegExp(`L${Math.round(x / 12) * 12} ([0-9.]+)`);
    const m = rd.top.match(re); return m ? +m[1] : base;
  };
  return (
    <>
      <defs>
        <linearGradient id={`hl${seed}`} x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor={mix('#d79a5c', HAZE, haze)} /><stop offset="1" stopColor={mix('#6d4a42', HAZE, haze)} /></linearGradient>
      </defs>
      <path d={rd.fill} fill={`url(#hl${seed})`} />
      <path d={rd.top} fill="none" stroke="#ffe0a8" strokeWidth="2" opacity=".5" />
      {trees.map((t, i) => <g key={i} opacity=".9"><Acacia x={t.x} y={yAt(t.x) + 4} s={t.s} seed={i + seed} haze={Math.min(0.9, haze + 0.15)} /></g>)}
    </>
  );
};
