import React from 'react';

/** Deterministic helpers (no Math.random): every value is a pure function of the frame / index. */
export const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
export const hash = (n: number) => { const s = Math.sin(n * 127.1 + 311.7) * 43758.5453; return s - Math.floor(s); };
export const ease = (t: number) => { t = clamp(t); return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; };
export const easeOut = (t: number) => 1 - Math.pow(1 - clamp(t), 3);

export const FxDefs: React.FC = () => (
  <defs>
    <radialGradient id="fx-steam"><stop offset="0" stopColor="#fff" stopOpacity=".95" /><stop offset=".55" stopColor="#fff" stopOpacity=".45" /><stop offset="1" stopColor="#fff" stopOpacity="0" /></radialGradient>
    <radialGradient id="fx-glow"><stop offset="0" stopColor="#FFE8A8" stopOpacity=".95" /><stop offset=".4" stopColor="#FFD58A" stopOpacity=".35" /><stop offset="1" stopColor="#FFD58A" stopOpacity="0" /></radialGradient>
    <radialGradient id="fx-glowred"><stop offset="0" stopColor="#FF6A5A" stopOpacity=".9" /><stop offset=".5" stopColor="#FF6A5A" stopOpacity=".3" /><stop offset="1" stopColor="#FF6A5A" stopOpacity="0" /></radialGradient>
    <filter id="fx-soft" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="5" /></filter>
  </defs>
);

/** rising wisps of steam: a column of soft circles that grow, drift sideways and fade */
export const Steam: React.FC<{x: number; y: number; f: number; n?: number; height?: number; width?: number; seed?: number; period?: number; scale?: number; op?: number}> =
  ({x, y, f, n = 5, height = 200, width = 16, seed = 1, period = 70, scale = 1, op = 0.55}) => (
    <g filter="url(#fx-soft)">
      {Array.from({length: n}, (_, i) => {
        const t = (f / period + i / n + hash(seed + i) * 0.2) % 1;
        const cx = x + Math.sin(t * 7 + i * 1.7 + seed) * width * (0.4 + t);
        const cy = y - t * height;
        const r = (12 + 26 * t) * scale;
        return <circle key={i} cx={cx} cy={cy} r={r} fill="url(#fx-steam)" opacity={Math.sin(Math.PI * t) * op} />;
      })}
    </g>
  );

/** four-point sparkle that pulses once per period */
export const Sparkle: React.FC<{x: number; y: number; f: number; size?: number; period?: number; phase?: number; color?: string}> =
  ({x, y, f, size = 28, period = 60, phase = 0, color = '#FFF7D6'}) => {
    const t = ((f + phase) % period) / period;
    const k = Math.pow(Math.max(0, Math.sin(Math.PI * t)), 3);
    if (k < 0.02) return null;
    const s = size * k;
    return <path transform={`translate(${x} ${y}) rotate(${t * 90})`} d={`M0,${-s} C${s * 0.12},${-s * 0.12} ${s * 0.12},${-s * 0.12} ${s},0 C${s * 0.12},${s * 0.12} ${s * 0.12},${s * 0.12} 0,${s} C${-s * 0.12},${s * 0.12} ${-s * 0.12},${s * 0.12} ${-s},0 C${-s * 0.12},${-s * 0.12} ${-s * 0.12},${-s * 0.12} 0,${-s}Z`} fill={color} opacity={0.95} />;
  };

/** a soft light that breathes (lamps, neon, moon) */
export const Glow: React.FC<{x: number; y: number; f: number; r?: number; amp?: number; speed?: number; phase?: number; red?: boolean; base?: number}> =
  ({x, y, f, r = 120, amp = 0.15, speed = 0.12, phase = 0, red = false, base = 0.7}) => {
    const k = base + amp * Math.sin(f * speed + phase) + amp * 0.5 * Math.sin(f * speed * 2.7 + phase * 2);
    return <circle cx={x} cy={y} r={r * (0.95 + 0.05 * k)} fill={red ? 'url(#fx-glowred)' : 'url(#fx-glow)'} opacity={clamp(k)} />;
  };

/** ambient floating dust / bokeh over the whole panel */
export const Dust: React.FC<{f: number; n?: number; seed?: number; color?: string; maxOp?: number}> = ({f, n = 22, seed = 0, color = '#FFF1CF', maxOp = 0.5}) => (
  <g>
    {Array.from({length: n}, (_, i) => {
      const bx = hash(seed + i * 3.1) * 1080, by = hash(seed + i * 7.7 + 5) * 1920;
      const sp = 0.25 + hash(seed + i) * 0.7, r = 2 + hash(seed + i * 5) * 5;
      const y = ((by - f * sp * 1.6) % 1920 + 1920) % 1920;
      const x = bx + Math.sin(f / (40 + i * 3) + i) * 18;
      const tw = 0.4 + 0.6 * Math.abs(Math.sin(f / (30 + i * 2) + i));
      return <circle key={i} cx={x} cy={y} r={r} fill={color} opacity={maxOp * tw * (0.3 + 0.7 * hash(seed + i * 11))} />;
    })}
  </g>
);

/** falling water drop with a ripple at the bottom */
export const Drops: React.FC<{x: number; y0: number; y1: number; f: number; period?: number; rippleY?: number; rippleRx?: number}> = ({x, y0, y1, f, period = 20, rippleY, rippleRx = 60}) => {
  const t = (f % period) / period;
  const fall = t < 0.7 ? t / 0.7 : 1;
  const y = lerp(y0, y1, fall * fall);
  const rt = t >= 0.7 ? (t - 0.7) / 0.3 : 0;
  return (
    <g>
      {t < 0.7 && <path d={`M${x},${y - 16} c-9,13 -10,22 0,26 c10,-4 9,-13 0,-26z`} fill="#BFE6FF" stroke="#2F6F96" strokeWidth={2.4} />}
      {rippleY !== undefined && rt > 0 && <ellipse cx={x} cy={rippleY} rx={rippleRx * rt} ry={rippleRx * rt * 0.22} fill="none" stroke="#fff" strokeWidth={3} opacity={1 - rt} />}
    </g>
  );
};

/** bubbles rising inside a rectangle (carbonation / boiling) */
export const Bubbles: React.FC<{x0: number; x1: number; y0: number; y1: number; f: number; n?: number; seed?: number}> = ({x0, x1, y0, y1, f, n = 18, seed = 2}) => (
  <g>
    {Array.from({length: n}, (_, i) => {
      const t = (f / (60 + hash(seed + i) * 50) + hash(seed + i * 3)) % 1;
      const x = lerp(x0, x1, hash(seed + i * 9)) + Math.sin(t * 9 + i) * 8;
      const y = lerp(y1, y0, t);
      const r = 3 + hash(seed + i * 5) * 6;
      return <g key={i} opacity={Math.sin(Math.PI * t) * 0.8}><circle cx={x} cy={y} r={r} fill="#fff" opacity=".35" /><circle cx={x} cy={y} r={r} fill="none" stroke="#fff" strokeWidth={1.6} /><circle cx={x - r * 0.3} cy={y - r * 0.3} r={r * 0.25} fill="#fff" /></g>;
    })}
  </g>
);

/** heart that floats up and fades (CTA) */
export const FloatHeart: React.FC<{x: number; y: number; f: number; phase?: number; period?: number; size?: number}> = ({x, y, f, phase = 0, period = 70, size = 34}) => {
  const t = ((f + phase) % period) / period;
  const s = size * (0.6 + 0.6 * easeOut(t * 3));
  const cx = x + Math.sin(t * 6 + phase) * 26, cy = y - t * 260;
  return <path transform={`translate(${cx} ${cy})`} d={`M0,${s * 0.35} c${-s},${-s * 0.8} ${-s * 0.2},${-s * 1.2} 0,${-s * 0.55} c${s * 0.2},${-s * 0.65} ${s},${-s * 0.25} 0,${s * 0.55}z`} fill="#D54F48" opacity={Math.sin(Math.PI * t) * 0.9} />;
};
