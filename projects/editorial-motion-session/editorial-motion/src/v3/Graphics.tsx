import React from 'react';
import {useCurrentFrame} from 'remotion';
import {derived, palette} from '../visual-system/ColorPalette';
import {theme} from '../visual-system/ThemeTokens';
import {PopIn} from '../animations/PopIn';
import {DrawOnPath} from '../animations/DrawOn';
import {easeOutCubic, easeOutBack, clamp} from '../dynamic/math';
import {formatId} from '../typography/NumberHighlight';

const F = theme.font.display;

/** BLACK HEADLINE LABEL — heavy white text on a black bar (reference header style). Pops in with a tiny tilt. */
export const BlackLabel: React.FC<{text: string; delay?: number; size?: number; x?: number; y?: number; rot?: number; accent?: string}> = ({text, delay = 0, size = 68, x = 540, y = 330, rot = -2, accent}) => {
  const f = useCurrentFrame();
  const p = easeOutBack((f - delay) / 9, 1.5);
  if (f < delay) return null;
  return (
    <div style={{position: 'absolute', left: x, top: y, transform: `translate(-50%,-50%) rotate(${rot * (2 - p)}deg) scale(${p})`}}>
      <div style={{background: '#14110F', color: '#FFFDF8', fontFamily: F, fontWeight: 900, fontSize: size, padding: `${size * 0.16}px ${size * 0.42}px`, borderRadius: 8, letterSpacing: 0.5, whiteSpace: 'nowrap', boxShadow: '8px 8px 0 rgba(58,43,34,0.35)'}}>
        {accent ? <span style={{color: accent}}>{text}</span> : text}
      </div>
    </div>
  );
};

/** SUBTITLE — white text on black box, small (caption look) */
export const Subtitle: React.FC<{text: string; delay?: number; y?: number; size?: number}> = ({text, delay = 0, y = 1440, size = 46}) => {
  const f = useCurrentFrame();
  const p = clamp((f - delay) / 6);
  if (f < delay) return null;
  return <div style={{position: 'absolute', left: 540, top: y, transform: `translate(-50%,-50%) translateY(${(1 - p) * 20}px)`, opacity: p, background: '#14110F', color: '#FFFDF8', fontFamily: F, fontWeight: 800, fontSize: size, padding: '8px 20px', whiteSpace: 'nowrap'}}>{text}</div>;
};

/** CATEGORY LABEL — small tab: tomato/green/mustard with number ("02. Siapkan Porsi" style) */
export const CategoryLabel: React.FC<{no?: string; text: string; delay?: number; x?: number; y?: number; color?: string}> = ({no, text, delay = 0, x = 120, y = 250, color = palette.tomato}) => (
  <PopIn delay={delay} from={0.6} origin="0% 50%" style={{position: 'absolute', left: x, top: y}}>
    <div style={{display: 'flex', alignItems: 'center', gap: 12, fontFamily: F, fontWeight: 900}}>
      {no && <div style={{background: color, color: '#FFFDF8', fontSize: 40, padding: '4px 16px', border: `4px solid ${derived.outline}`, borderRadius: 8}}>{no}</div>}
      <div style={{fontSize: 40, color: palette.navy, letterSpacing: 2}}>{text}</div>
    </div>
  </PopIn>
);

/** ANIMATED INFORMATION PANEL — paper card with rows that slide in, dotted leaders, total that counts up. */
export const InfoPanel: React.FC<{x: number; y: number; w?: number; title: string; rows: [string, number][]; total?: number; totalLabel?: string; delay?: number; rot?: number}> = ({x, y, w = 340, title, rows, total, totalLabel = 'TOTAL', delay = 0, rot = 2}) => {
  const f = useCurrentFrame();
  const pin = easeOutBack((f - delay) / 10, 1.3);
  if (f < delay) return null;
  const rowH = 62;
  const h = 96 + rows.length * rowH + (total !== undefined ? 90 : 0);
  const tot = total !== undefined ? total * easeOutCubic((f - delay - 8 - rows.length * 5) / 12) : 0;
  return (
    <div style={{position: 'absolute', left: x, top: y, width: w, transform: `rotate(${rot}deg) scale(${pin})`, transformOrigin: '50% 0%'}}>
      <div style={{background: '#FFFBF0', border: `6px solid ${derived.outline}`, borderRadius: 14, boxShadow: '10px 10px 0 rgba(58,43,34,0.28)', height: h, position: 'relative', overflow: 'hidden'}}>
        <div style={{background: '#14110F', color: '#FFFDF8', fontFamily: F, fontWeight: 900, fontSize: 34, padding: '10px 16px', letterSpacing: 2}}>{title}</div>
        {rows.map(([n, v], i) => {
          const p = easeOutCubic((f - delay - 6 - i * 5) / 8);
          return (
            <div key={n} style={{display: 'flex', alignItems: 'baseline', padding: '0 16px', height: rowH, marginTop: i === 0 ? 8 : 0, transform: `translateX(${(1 - p) * 120}px)`, opacity: p, fontFamily: F, fontWeight: 800, fontSize: 38, color: palette.navy}}>
              <span>{n}</span>
              <span style={{flex: 1, borderBottom: `4px dotted ${palette.grid}`, margin: '0 8px', transform: 'translateY(-8px)'}} />
              <span>{formatId(v)}</span>
            </div>
          );
        })}
        {total !== undefined && (
          <div style={{position: 'absolute', left: 0, right: 0, bottom: 0, height: 80, background: palette.tomato, borderTop: `5px solid ${derived.outline}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 16px', fontFamily: F, fontWeight: 900, color: '#FFFDF8'}}>
            <span style={{fontSize: 30, letterSpacing: 2}}>{totalLabel}</span>
            <span style={{fontSize: 48}}>{formatId(tot)}</span>
          </div>
        )}
      </div>
    </div>
  );
};

/** Directional arrow that draws on (world svg coordinates). curve control via `d`. */
export const ArrowDraw: React.FC<{d: string; head: string; delay?: number; color?: string; width?: number}> = ({d, head, delay = 0, color = palette.tomato, width = 14}) => (
  <g>
    <DrawOnPath d={d} delay={delay} duration={14} stroke={derived.outline} strokeWidth={width + 8} />
    <DrawOnPath d={d} delay={delay} duration={14} stroke={color} strokeWidth={width} />
    <DrawOnPath d={head} delay={delay + 10} duration={7} stroke={derived.outline} strokeWidth={width + 8} />
    <DrawOnPath d={head} delay={delay + 10} duration={7} stroke={color} strokeWidth={width} />
  </g>
);
