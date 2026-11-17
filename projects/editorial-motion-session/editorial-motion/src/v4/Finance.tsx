import React from 'react';
import {useCurrentFrame, useVideoConfig} from 'remotion';
import {Illustration} from '../illustrations/Illustration';
import {materials as m, derived, palette} from '../visual-system/ColorPalette';
import {ink, inkThin} from '../visual-system/IllustrationStyle';
import {theme} from '../visual-system/ThemeTokens';
import {progress, wobble} from './profiles';
import {formatId} from '../typography/NumberHighlight';
import {hash, clamp} from '../dynamic/math';

const F = theme.font.display;

/** Engraved coin (front). Flat fills + a crescent shade + hatch-like ring marks; no gloss gradients. viewBox 140x140 */
export const Coin4: React.FC<{size?: number; text?: string}> = ({size = 120, text = 'Rp'}) => (
  <Illustration vbW={140} vbH={140} size={size}>
    <ellipse cx="72" cy="130" rx="46" ry="6" fill="rgba(58,30,10,0.3)" />
    <circle cx="70" cy="68" r="58" fill={palette.mustard} {...ink} />
    <path d="M70,10 A58,58 0 0 1 70,126 A44,58 0 0 0 70,10Z" fill={derived.mustardDeep} opacity={0.35} />
    <circle cx="70" cy="68" r="45" fill="none" stroke={derived.mustardDeep} strokeWidth={4} strokeDasharray="3 5" />
    <circle cx="70" cy="68" r="38" fill={derived.mustardLight} {...inkThin} />
    <text x="70" y="82" textAnchor="middle" fontFamily={F} fontWeight={900} fontSize={38} fill={derived.mustardDeep} stroke={derived.outline} strokeWidth={1.8}>{text}</text>
    <path d="M30,46 Q40,26 62,18" fill="none" stroke="#FFFFFF" strokeWidth={5} strokeLinecap="round" opacity={0.4} />
  </Illustration>
);

/** Coin stack seen from the side; `n` coins, the top one can be animated separately by the caller. viewBox 160x(40+n*22) */
export const CoinColumn: React.FC<{n: number; size?: number; hopTop?: number}> = ({n, size = 150, hopTop = 0}) => {
  const h = 40 + n * 22 + 20;
  return (
    <Illustration vbW={160} vbH={h} size={size}>
      <ellipse cx="80" cy={h - 8} rx="62" ry="8" fill="rgba(58,30,10,0.3)" />
      {Array.from({length: n}).map((_, i) => {
        const y = h - 20 - i * 22 - (i === n - 1 ? hopTop : 0);
        const x = 80 + (i % 2 ? 3 : -2) + (i === n - 1 ? 0 : 0);
        return (
          <g key={i}>
            <path d={`M${x - 58},${y} v-16 a58,18 0 0 1 116,0 v16 a58,18 0 0 1 -116,0Z`} fill={derived.mustardDeep} {...ink} />
            <path d={`M${x - 58},${y - 8} a58,18 0 0 0 116,0`} fill="none" stroke={derived.outline} strokeWidth={2.2} opacity={0.5} />
            <ellipse cx={x} cy={y - 16} rx={58} ry={18} fill={palette.mustard} {...ink} />
            <ellipse cx={x} cy={y - 16} rx={38} ry={11} fill="none" stroke={derived.mustardDeep} strokeWidth={3} strokeDasharray="3 4" />
          </g>
        );
      })}
    </Illustration>
  );
};

/**
 * FINANCIAL INFOGRAPHIC CARD — paper card pinned to the scene: two bars (modal vs jual) that grow, coin columns on top
 * that stack up with COIN motion (snappy), and a '+untung' price tag that pops with LABEL motion. Typography uses TYPE motion.
 */
export const CostChart: React.FC<{x: number; y: number; w?: number; cost: number; price: number; delay?: number; rot?: number; zoom?: number}> = ({x, y, w = 430, cost, price, delay = 0, rot = 2, zoom = 1}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const pIn = progress('label', f, delay, fps);
  if (f < delay) return null;
  const H = 640, base = 520, maxBar = 330;
  const grow = (st: number) => progress('type', f, st, fps, 12);
  const bars = [
    {label: 'MODAL', v: cost, c: palette.mustard, d: derived.mustardDeep, t: derived.mustardLight, st: delay + 4, coins: 3},
    {label: 'JUAL', v: price, c: palette.green, d: derived.greenDeep, t: derived.greenLight, st: delay + 8, coins: 5},
  ];
  const profit = price - cost;
  const tagK = progress('label', f, delay + 20, fps);
  const cnt = (st: number, v: number) => formatId(v * clamp(grow(st)));
  return (
    <div style={{position: 'absolute', left: x, top: y, width: w, height: H, transform: `rotate(${rot}deg) scale(${Math.max(0.01, pIn) * zoom})`, transformOrigin: '50% 0%'}}>
      <div style={{position: 'absolute', inset: 0, background: '#FFFBF0', border: `6px solid ${derived.outline}`, borderRadius: 12, boxShadow: '10px 10px 0 rgba(58,43,34,0.28)', overflow: 'hidden'}}>
        <div style={{background: '#14110F', color: '#FFFDF8', fontFamily: F, fontWeight: 900, fontSize: 38, padding: '10px 16px', letterSpacing: 2}}>UNTUNG PER MANGKUK</div>
        <svg width={w - 12} height={H - 60} style={{position: 'absolute', left: 0, top: 54}}>
          <line x1="20" y1={base - 40} x2={w - 32} y2={base - 40} stroke={derived.outline} strokeWidth={5} />
          {[0.25, 0.5, 0.75, 1].map((k) => <line key={k} x1="20" y1={base - 40 - maxBar * k} x2={w - 32} y2={base - 40 - maxBar * k} stroke={palette.grid} strokeWidth={2.4} strokeDasharray="8 8" />)}
        </svg>
        {bars.map((b, i) => {
          const g = grow(b.st);
          const bh = (b.v / price) * maxBar * g;
          const bx = 62 + i * 190;
          const hop = progress('coin', f, b.st + 10 + 0, fps);
          return (
            <React.Fragment key={b.label}>
              <div style={{position: 'absolute', left: bx, top: 54 + base - 40 - bh, width: 130, height: bh, background: b.c, border: `5px solid ${derived.outline}`, borderRadius: '6px 6px 0 0'}}>
                <div style={{position: 'absolute', left: 0, top: 0, bottom: 0, width: 30, background: b.d, opacity: 0.5}} />
                <div style={{position: 'absolute', left: 8, top: 6, right: 8, height: 8, background: b.t, opacity: 0.7, borderRadius: 4}} />
              </div>
              <div style={{position: 'absolute', left: bx - 10, top: 54 + base - 40 - bh - 20 - (40 + b.coins * 22 + 20) * 0.62 * Math.min(1, hop), width: 150, transform: `scale(${0.4 + 0.6 * Math.min(1.2, hop)})`, transformOrigin: '50% 100%', opacity: hop > 0.02 ? 1 : 0}}>
                <CoinColumn n={b.coins} size={150 * 0.8} hopTop={Math.max(0, wobble('coin', f, b.st + 14, 14))} />
              </div>
              <div style={{position: 'absolute', left: bx, width: 130, top: 54 + base - 30, textAlign: 'center', fontFamily: F, fontWeight: 900, fontSize: 34, color: palette.navy, letterSpacing: 1}}>{b.label}</div>
              <div style={{position: 'absolute', left: bx - 15, width: 160, top: 54 + base + 6, textAlign: 'center', fontFamily: F, fontWeight: 900, fontSize: 50, color: i ? palette.green : derived.mustardDeep}}>{cnt(b.st, b.v)}</div>
            </React.Fragment>
          );
        })}
      </div>
      {/* +untung tag (label profile) */}
      <div style={{position: 'absolute', right: -28, top: 150, transform: `rotate(${-6 + 10 * (1 - Math.min(1, tagK))}deg) scale(${Math.max(0.01, tagK)})`, transformOrigin: '10% 50%', opacity: tagK > 0.02 ? 1 : 0}}>
        <div style={{background: palette.tomato, color: '#FFFDF8', fontFamily: F, fontWeight: 900, fontSize: 60, padding: '10px 26px 10px 40px', border: `5px solid ${derived.outline}`, borderRadius: '4px 14px 14px 4px', clipPath: 'polygon(0 50%, 22px 0, 100% 0, 100% 100%, 22px 100%)', boxShadow: '6px 6px 0 rgba(58,43,34,0.3)'}}>+{formatId(profit * clamp(tagK))}</div>
      </div>
    </div>
  );
};
void hash; void m;
