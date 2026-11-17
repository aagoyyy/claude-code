import React from 'react';
import {AbsoluteFill} from 'remotion';
import {C, ST, LW, FONT, TYPE} from './style';
import {fmtNum} from './data';

/* ---------- BACKGROUND MODES ---------- */
/** A. clean ivory grid (default). B. plain ivory: grid={false}. `surface` adds the flat sand table band + one thin line (reference). */
export const Bg: React.FC<{grid?: boolean; surface?: number; children?: React.ReactNode}> = ({grid = true, surface, children}) => (
  <AbsoluteFill style={{background: C.paper}}>
    {grid && (
      <svg width={1080} height={1920} style={{position: 'absolute', inset: 0}}>
        {Array.from({length: 21}).map((_, i) => <line key={'v' + i} x1={i * 54} y1={0} x2={i * 54} y2={1920} stroke={C.grid} strokeWidth={2} />)}
        {Array.from({length: 36}).map((_, i) => <line key={'h' + i} x1={0} y1={i * 54} x2={1080} y2={i * 54} stroke={C.grid} strokeWidth={2} />)}
      </svg>
    )}
    {surface !== undefined && (
      <>
        <div style={{position: 'absolute', left: 0, right: 0, top: surface, bottom: 0, background: C.sand}} />
        <div style={{position: 'absolute', left: 0, right: 0, top: surface, height: 4, background: C.sandLine}} />
      </>
    )}
    {children}
  </AbsoluteFill>
);

/* ---------- TYPOGRAPHY SYSTEM ---------- */
export const Headline: React.FC<{lines: string[]; accent?: string[]; y?: number; size?: number; opacity?: number; dy?: number}> = ({lines, accent = [], y = 250, size = TYPE.headline, opacity = 1, dy = 0}) => (
  <div style={{position: 'absolute', left: 60, right: 60, top: y, textAlign: 'center', fontFamily: FONT, fontWeight: 900, fontSize: size, lineHeight: 1.06, color: C.navy, letterSpacing: -1, opacity, transform: `translateY(${dy}px)`}}>
    {lines.map((l, i) => (
      <div key={i}>{l.split(' ').map((w, j) => <span key={j} style={{color: accent.includes(w) ? C.tomato : C.navy}}>{w}{' '}</span>)}</div>
    ))}
  </div>
);
export const Eyebrow: React.FC<{text: string; y?: number; opacity?: number}> = ({text, y = 190, opacity = 1}) => (
  <div style={{position: 'absolute', left: 0, right: 0, top: y, textAlign: 'center', fontFamily: FONT, fontWeight: 800, fontSize: TYPE.small, letterSpacing: 6, color: C.navy, opacity}}>{text}</div>
);
export const Callout: React.FC<{x: number; y: number; text: string; opacity?: number; dy?: number; solid?: boolean; scale?: number}> = ({x, y, text, opacity = 1, dy = 0, solid = false, scale = 1}) => (
  <div style={{position: 'absolute', left: x, top: y, transform: `translate(-50%,-50%) translateY(${dy}px) scale(${scale})`, opacity, fontFamily: FONT, fontWeight: 900, fontSize: solid ? TYPE.price - 10 : TYPE.label, color: solid ? C.white : C.navy, background: solid ? C.tomato : C.white, border: `${LW}px solid ${C.ink}`, borderRadius: 14, padding: solid ? '8px 26px' : '10px 22px', whiteSpace: 'nowrap'}}>{text}</div>
);

/* ---------- INFOGRAPHIC: cost vs price comparison ---------- */
const FACE = {modal: {f: C.mustard, s: C.mustardDeep, t: '#F4CE62'}, jual: {f: C.green, s: C.greenDeep, t: '#6FA97B'}};
export const ChartFlat: React.FC<{modal: number; price: number; gModal?: number; gPrice?: number; arrow?: number; tag?: number; numOpacity?: number}> = ({modal, price, gModal = 1, gPrice = 1, arrow = 1, tag = 1, numOpacity = 1}) => {
  const base = 1380, k = 0.06, cw = 250, sideW = 56, topH = 34;
  const cols = [
    {x: 200, v: modal, g: gModal, c: FACE.modal, label: 'MODAL', numColor: C.navy},
    {x: 640, v: price, g: gPrice, c: FACE.jual, label: 'JUAL', numColor: C.white},
  ];
  return (
    <svg width={1080} height={1920} style={{position: 'absolute', inset: 0}}>
      <line x1={90} y1={base} x2={990} y2={base} stroke={C.ink} strokeWidth={LW} strokeLinecap="round" />
      {cols.map((c) => {
        const h = c.v * k * c.g;
        const y = base - h;
        return (
          <g key={c.label}>
            <ellipse cx={c.x + cw / 2 + 20} cy={base + 8} rx={cw * 0.62} ry={14} fill={C.shadow} />
            <path d={`M${c.x},${y} h${cw} v${h} h${-cw}Z`} fill={c.c.f} stroke={C.ink} strokeWidth={LW} strokeLinejoin="round" />
            <path d={`M${c.x + cw},${y} l${sideW},${-topH} v${h} l${-sideW},${topH}Z`} fill={c.c.s} stroke={C.ink} strokeWidth={LW} strokeLinejoin="round" />
            <path d={`M${c.x},${y} l${sideW},${-topH} h${cw} l${-sideW},${topH}Z`} fill={c.c.t} stroke={C.ink} strokeWidth={LW} strokeLinejoin="round" />
            {h > 120 && <text x={c.x + cw / 2} y={y + 84} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={TYPE.price} fill={c.numColor} opacity={numOpacity}>{fmtNum(c.v)}</text>}
            <text x={c.x + cw / 2 + 20} y={base + 74} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={TYPE.label + 6} fill={C.navy} letterSpacing={3}>{c.label}</text>
          </g>
        );
      })}
      {arrow > 0 && (() => {
        const sx = 200 + cw / 2, sy = base - modal * k - 70, ex = 640 - 36, ey = base - price * k - 20;
        const d = `M${sx},${sy} C${sx},${sy - 200} ${ex - 160},${ey - 40} ${ex},${ey}`;
        const head = `M${ex - 44},${ey - 40} L${ex},${ey} L${ex - 52},${ey + 18}`;
        return (
          <g>
            <path d={d} fill="none" stroke={C.ink} strokeWidth={LW + 12} strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - arrow} />
            <path d={d} fill="none" stroke={C.tomato} strokeWidth={12} strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - arrow} />
            {arrow > 0.9 && <><path d={head} fill="none" stroke={C.ink} strokeWidth={LW + 12} strokeLinecap="round" strokeLinejoin="round" /><path d={head} fill="none" stroke={C.tomato} strokeWidth={12} strokeLinecap="round" strokeLinejoin="round" /></>}
          </g>
        );
      })()}
    </svg>
  );
};
