import React from 'react';

export type CalloutProps = {
  sx: number; sy: number;          // hotspot (screen)
  hs: number; line?: number; label?: number; // progress 0..1(+ overshoot for hs)
  lx?: number; ly?: number;        // label anchor (screen)
  side?: 'right' | 'left';
  title?: string; sub?: string;
  f: number;
  ink?: string; subInk?: string; accent?: string;
  r?: number;                      // hotspot size
};

export const Callout: React.FC<CalloutProps> = ({sx, sy, hs, line = 0, label = 0, lx = 0, ly = 0, side = 'right', title, sub, f, ink = '#f6e8c8', subInk = '#d9c7a0', accent = '#e0b86a', r = 1}) => {
  const dir = side === 'right' ? 1 : -1;
  const ex = sx + (lx - dir * 16 - sx) * line, ey = sy + (ly - 14 - sy) * line;
  const pulse = (f * 0.045) % 1;
  const anchor = side === 'right' ? 'start' : 'end';
  return (
    <g>
      {hs > 0 && <>
        <circle cx={sx} cy={sy} r={36 * hs * r} fill="#e02a1c" opacity=".4" style={{filter: 'blur(9px)'}} />
        <circle cx={sx} cy={sy} r={14 * r * (1 + pulse * 1.6)} fill="none" stroke={accent} strokeWidth="2.5" opacity={1 - pulse} />
        <circle cx={sx} cy={sy} r={9 * hs * r} fill="#2a1a12" stroke={accent} strokeWidth="2.5" />
        <circle cx={sx} cy={sy} r={3.4 * hs * r} fill={accent} />
      </>}
      {line > 0 && title && <path d={`M${sx} ${sy} L${ex} ${ey}`} stroke={accent} strokeWidth="2.5" strokeLinecap="round" />}
      {title && (
        <g opacity={label} transform={`translate(${(1 - label) * 24 * dir} 0)`}>
          <text x={lx} y={ly} textAnchor={anchor} fontFamily="'Helvetica Neue', Arial, sans-serif" fontWeight={800} fontSize={44} letterSpacing={4} fill={ink}>{title}</text>
          {sub && <text x={lx} y={ly + 36} textAnchor={anchor} fontFamily="'Helvetica Neue', Arial, sans-serif" fontSize={28} fill={subInk}>{sub}</text>}
        </g>
      )}
    </g>
  );
};

/** Victoria Cross: cross pattée on a crimson ribbon, drawn at (x,y) = where the ribbon meets the medal */
export const VictoriaCross: React.FC<{x: number; y: number; s: number; rot: number; glint: number}> = ({x, y, s, rot, glint}) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
    <defs>
      <linearGradient id="vcB" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#e0a56a" /><stop offset=".5" stopColor="#a8693a" /><stop offset="1" stopColor="#5c3418" /></linearGradient>
      <clipPath id="vcClip"><path d="M-6 -4 H6 V-30 H-6 Z M-6 4 H6 V30 H-6 Z M-4 -6 H-30 V6 H-4 Z M4 -6 H30 V6 H4 Z" /></clipPath>
    </defs>
    <path d="M-9 -64 H9 L9 -22 H-9 Z" fill="#a31c2c" stroke="#5a0c16" strokeWidth="1.2" />
    <path d="M-9 -64 L-9 -22" stroke="#e05a6a" strokeWidth="1.5" opacity=".7" />
    <rect x="-12" y="-22" width="24" height="7" rx="2" fill="url(#vcB)" stroke="#3a2010" strokeWidth="1" />
    <g transform="translate(0 9)">
      {[0, 90, 180, 270].map((a) => (
        <path key={a} transform={`rotate(${a})`} d="M-7 -6 L-9 -34 Q0 -40 9 -34 L7 -6 Z" fill="url(#vcB)" stroke="#3a2010" strokeWidth="1.4" />
      ))}
      <circle r="13" fill="url(#vcB)" stroke="#3a2010" strokeWidth="1.4" />
      <path d="M0 -7 L2 -2 L8 -1 L3 3 L4 9 L0 6 L-4 9 L-3 3 L-8 -1 L-2 -2 Z" fill="#3a2010" opacity=".75" />
      {/* lit left edges + glint sweep */}
      <circle r="13" fill="none" stroke="#ffe3b0" strokeWidth="1.4" strokeDasharray="22 60" opacity=".7" transform="rotate(-140)" />
      <g clipPath="url(#vcClip)" opacity={glint}><rect x="-60" y="-8" width="14" height="80" fill="#fff" opacity=".8" transform={`translate(${-40 + glint * 90} -20) rotate(25)`} /></g>
    </g>
  </g>
);
