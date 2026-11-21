import React from 'react';
import {mix} from '../world/util';
import {clock} from './clock';

/** Side-view quadrupeds (horse, camel). Local space: hooves on y=0, faces +x. Same shading language as the people. */
export type AnimalOpts = {kind: 'horse' | 'camel'; coat: string; mane: string; face?: 'left' | 'right'; tack?: boolean; saddle?: string};
export type AnimalPose = {phase: number; stride?: number; dy?: number; head?: number; tail?: number; rear?: number; speed?: number};
const OUT = '#2a2418';
const sh = (c: string, t: number) => mix(c, '#000000', t);
const hl = (c: string, t: number) => mix(c, '#ffffff', t);
let UID = 0;

const Leg: React.FC<{x: number; belly: number; up: number; lo: number; th: number; sh2: number; c: string; w: number}> = ({x, belly, up, lo, th, sh2, c, w}) => (
  <g transform={`translate(${x} ${-belly}) rotate(${th})`}>
    {/* thigh / forearm: thick muscle tapering to the knee */}
    <path d={`M${-w * 0.92} 0 Q${-w * 0.9} ${up * 0.42} ${-w * 0.36} ${up} L${w * 0.36} ${up} Q${w * 0.9} ${up * 0.42} ${w * 0.92} 0 Z`} fill={c} stroke={OUT} strokeWidth="3" strokeLinejoin="round" />
    <path d={`M${-w * 0.4} ${up * 0.1} Q${-w * 0.2} ${up * 0.5} ${-w * 0.16} ${up * 0.9}`} stroke="#fff" strokeWidth="6" fill="none" opacity=".16" />
    <path d={`M${w * 0.3} ${up * 0.1} Q${w * 0.22} ${up * 0.5} ${w * 0.14} ${up * 0.9}`} stroke="#000" strokeWidth="8" fill="none" opacity=".18" />
    <g transform={`translate(0 ${up}) rotate(${sh2})`}>
      <circle cx={0} cy={0} r={w * 0.4} fill={sh(c, 0.1)} stroke={OUT} strokeWidth="2.5" />
      {/* cannon bone, fetlock joint, pastern, hoof */}
      <path d={`M${-w * 0.28} 0 L${w * 0.28} 0 L${w * 0.2} ${lo} L${-w * 0.2} ${lo} Z`} fill={sh(c, 0.1)} stroke={OUT} strokeWidth="2.5" strokeLinejoin="round" />
      <circle cx={0} cy={lo} r={w * 0.2} fill={sh(c, 0.12)} stroke={OUT} strokeWidth="2.5" />
      <path d={`M${-w * 0.2} ${lo} L${w * 0.24} ${lo} L${w * 0.28} ${lo + 30} L${-w * 0.2} ${lo + 30} Z`} fill={sh(c, 0.14)} stroke={OUT} strokeWidth="2.5" />
      <path d={`M${-w * 0.32} ${lo + 26} L${w * 0.4} ${lo + 26} L${w * 0.48} ${lo + 56} L${-w * 0.4} ${lo + 56} Z`} fill="#241a12" stroke={OUT} strokeWidth="2.5" />
      <path d={`M${-w * 0.14} 8 L${-w * 0.1} ${lo - 6}`} stroke="#fff" strokeWidth="3" opacity=".14" />
    </g>
  </g>
);

export const AnimalArt: React.FC<{o: AnimalOpts; p: AnimalPose}> = ({o, p}) => {
  const camel = o.kind === 'camel';
  const c = o.coat, flip = o.face === 'left';
  const spd = p.speed ?? 6.5;
  const st = spd === 0 ? 0 : (p.stride ?? 1);
  const ph = p.phase + clock.t * spd;
  const pHead = (p.head ?? 0) + (spd === 0 ? 2.5 * Math.sin(clock.t * 0.8) : 3 * Math.sin(ph * 2) * st);
  const pDy = (p.dy || 0) - (spd === 0 ? 0 : 7 * Math.abs(Math.sin(ph)) * st);
  const belly = camel ? 790 : 650, up = camel ? 400 : 310, lo = camel ? 360 : 290;
  const gait = (off: number) => ({th: -22 * st * Math.sin(ph + off), sh2: 6 + 42 * st * Math.max(0, Math.cos(ph + off)) ** 2});
  const legs = [
    {x: camel ? 250 : 230, k: gait(0), far: false}, {x: camel ? -250 : -240, k: gait(Math.PI), far: false},
    {x: camel ? 250 : 230, k: gait(Math.PI), far: true}, {x: camel ? -250 : -240, k: gait(0), far: true},
  ];
  const id = `an${++UID}`;
  const body = camel
    ? 'M-360 -900 Q-380 -1130 -240 -1230 Q-120 -1330 0 -1290 Q60 -1380 140 -1370 Q230 -1360 250 -1260 Q360 -1210 380 -1060 Q360 -900 260 -850 Q0 -800 -260 -840 Z'
    : 'M-350 -700 Q-410 -930 -250 -1010 Q0 -1090 250 -1020 Q400 -980 410 -800 Q380 -640 260 -600 Q0 -570 -270 -610 Z';
  const neck = camel
    ? 'M130 -1120 Q330 -1230 370 -1400 Q390 -1520 480 -1560 L610 -1540 Q550 -1500 566 -1420 Q560 -1250 480 -1000 Z'
    : 'M110 -1020 Q300 -1270 440 -1310 L610 -1210 Q540 -1130 510 -860 L240 -800 Z';
  const head = camel
    ? 'M500 -1580 Q630 -1630 730 -1536 Q750 -1506 720 -1488 Q630 -1506 590 -1506 Q550 -1506 520 -1516 Z'
    : 'M440 -1290 Q590 -1340 730 -1200 Q752 -1146 704 -1106 Q640 -1100 596 -1152 Q544 -1204 470 -1196 Z';
  const art = (
    <g>
      <defs><clipPath id={id}><path d={body} /><path d={neck} /><path d={head} /></clipPath></defs>
      {legs.filter((l) => l.far).map((l, i) => <Leg key={'f' + i} x={l.x} belly={belly} up={up} lo={lo} th={l.k.th} sh2={l.k.sh2} c={sh(c, 0.3)} w={camel ? 124 : 122} />)}
      {/* tail */}
      <path d={`M-340 ${camel ? -1100 : -900} Q${-430 - 20 * Math.sin(ph)} ${camel ? -900 : -760} ${-400 + 30 * Math.sin(ph * 2)} ${camel ? -560 : -420}`} stroke={o.mane} strokeWidth={camel ? 20 : 34} fill="none" strokeLinecap="round" />
      {camel && <ellipse cx={-60} cy={-1290} rx={170} ry={130} fill={c} stroke={OUT} strokeWidth="3.5" />}
      <path d={body} fill={c} stroke={OUT} strokeWidth="3.5" />
      <path d={neck} fill={c} stroke={OUT} strokeWidth="3.5" />
      <g transform={`rotate(${pHead} ${camel ? 480 : 440} ${camel ? -1540 : -1230})`}><path d={head} fill={c} stroke={OUT} strokeWidth="3.5" /></g>
      <g clipPath={`url(#${id})`}>
        <rect x={-460} y={-1800} width={1300} height={1300} fill="url(#sideShade)" />
        <rect x={-460} y={-1800} width={1300} height={1300} fill="url(#sideShadeV)" opacity=".7" />
        <rect x={-460} y={-1800} width={1300} height={1300} fill="url(#weaveS)" opacity=".5" />
        <path d={`M-300 ${camel ? -900 : -680} Q0 ${camel ? -840 : -640} 280 ${camel ? -880 : -690}`} stroke="#000" strokeWidth="46" fill="none" opacity=".25" filter="url(#sBlur6)" />
        <path d={`M-330 ${camel ? -1240 : -960} Q-100 ${camel ? -1330 : -1040} 200 ${camel ? -1300 : -1000}`} stroke="#fff" strokeWidth="26" fill="none" opacity=".16" filter="url(#sBlur6)" />
        <path d={`M200 ${camel ? -980 : -860} Q150 ${camel ? -900 : -760} 190 ${camel ? -850 : -690} M-210 ${camel ? -980 : -860} Q-170 ${camel ? -900 : -760} -230 ${camel ? -850 : -690}`} stroke={sh(c, 0.4)} strokeWidth="4" fill="none" opacity=".5" />
        <ellipse cx={camel ? 200 : 190} cy={camel ? -1020 : -800} rx={camel ? 130 : 120} ry={camel ? 190 : 160} fill="#fff" opacity=".1" />
        <path d={`M-260 ${camel ? -1000 : -820} Q-150 ${camel ? -1160 : -960} -40 ${camel ? -1000 : -830}`} stroke="#fff" strokeWidth="18" fill="none" opacity=".12" filter="url(#sBlur6)" />
        <ellipse cx={camel ? -230 : -210} cy={camel ? -1040 : -800} rx={camel ? 160 : 150} ry={camel ? 210 : 180} fill="#fff" opacity=".07" />
        <path d={`M300 ${camel ? -1250 : -1000} Q380 ${camel ? -1100 : -900} 340 ${camel ? -900 : -760}`} stroke="#000" strokeWidth="22" fill="none" opacity=".2" filter="url(#sBlur6)" />
      </g>
      {/* mane / hump fur / forelock */}
      <path d={camel ? 'M250 -1180 Q340 -1280 392 -1420 Q430 -1520 510 -1556' : 'M260 -1000 Q360 -1190 462 -1252 Q420 -1150 350 -1030 Z'} stroke={o.mane} strokeWidth={camel ? 12 : 8} fill={camel ? 'none' : o.mane} strokeLinecap="round" />
      {camel && <path d="M-60 -1290 Q0 -1340 60 -1370 Q120 -1380 150 -1370" stroke={o.mane} strokeWidth="10" fill="none" />}
      {/* eye, nostril, mouth, ear */}
      <g transform={`rotate(${pHead} ${camel ? 480 : 440} ${camel ? -1540 : -1230})`}>
        <ellipse cx={camel ? 626 : 590} cy={camel ? -1556 : -1220} rx={11} ry={8} fill="#1a1008" /><circle cx={camel ? 629 : 593} cy={camel ? -1559 : -1223} r={3} fill="#fff" opacity=".7" />
        <circle cx={camel ? 716 : 694} cy={camel ? -1504 : -1140} r={6} fill="#1a1008" opacity=".8" />
        <path d={camel ? 'M630 -1506 Q680 -1494 722 -1498' : 'M600 -1140 Q650 -1128 690 -1128'} stroke="#3a2418" strokeWidth="3" fill="none" />
        <path d={camel ? 'M560 -1530 Q600 -1500 640 -1504' : 'M520 -1190 Q560 -1130 640 -1130'} stroke={sh(c, 0.35)} strokeWidth="5" fill="none" opacity=".6" />
        <path d={camel ? 'M540 -1600 L526 -1656 L570 -1612 Z' : 'M500 -1250 L480 -1330 L540 -1262 Z'} fill={sh(c, 0.2)} stroke={OUT} strokeWidth="3" />
      </g>
      {/* tack: blanket, saddle, girth, bridle, reins */}
      {o.tack && (
        <g>
          <path d={camel ? 'M-170 -1260 Q0 -1380 190 -1280 L200 -1000 Q0 -960 -180 -1000 Z' : 'M-150 -1000 Q0 -1070 170 -1000 L170 -790 Q0 -750 -160 -790 Z'} fill="#9a3a2a" stroke={OUT} strokeWidth="3" />
          <path d={camel ? 'M-150 -1250 H180 M-155 -1210 H185' : 'M-140 -990 H160 M-142 -950 H162'} stroke="#e8c070" strokeWidth="5" opacity=".8" />
          <path d={camel ? 'M-110 -1320 Q0 -1400 120 -1340 L110 -1250 Q0 -1230 -110 -1250 Z' : 'M-100 -1050 Q0 -1100 110 -1050 L100 -970 Q0 -950 -100 -970 Z'} fill={o.saddle || '#6a3a1c'} stroke={OUT} strokeWidth="3" />
          <path d={camel ? 'M10 -1010 Q20 -880 10 -820' : 'M10 -800 Q20 -700 10 -650'} stroke="#3a2010" strokeWidth="14" fill="none" />
          <path d={camel ? 'M560 -1520 Q560 -1480 600 -1460' : 'M520 -1190 Q540 -1150 590 -1128'} stroke="#2a1810" strokeWidth="6" fill="none" />
          <path d={camel ? 'M600 -1470 Q400 -1360 190 -1280' : 'M590 -1130 Q420 -1080 150 -1040'} stroke="#2a1810" strokeWidth="5" fill="none" />
        </g>
      )}
      {legs.filter((l) => !l.far).map((l, i) => <Leg key={'n' + i} x={l.x} belly={belly} up={up} lo={lo} th={l.k.th} sh2={l.k.sh2} c={c} w={camel ? 128 : 126} />)}
    </g>
  );
  return <g transform={`translate(0 ${pDy}) ${flip ? 'scale(-1 1)' : ''}`}>{art}</g>;
};

/** height of the saddle above the ground (for placing a rider) */
export const saddleHeight = (k: 'horse' | 'camel') => (k === 'camel' ? 1240 : 1050);
