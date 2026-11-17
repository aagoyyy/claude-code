import React from 'react';
import {AbsoluteFill} from 'remotion';
import {C, LW, FONT} from './style';

const I = C.ink;
/** ILLUSTRATED KITCHEN (flat). counter top at y=1180. Bright; no textures. */
export const KitchenFlat: React.FC = () => (
  <AbsoluteFill style={{background: '#F7F1E1'}}>
    <svg width={1080} height={1920} style={{position: 'absolute', inset: 0}}>
      {/* tiles */}
      {Array.from({length: 9}).map((_, r) => Array.from({length: 10}).map((__, c) => { const x = c * 120 + (r % 2 ? 60 : 0) - 60, y = 700 + r * 60; return y < 1180 ? <rect key={r + '-' + c} x={x} y={y} width={120} height={60} fill={(r + c) % 3 === 0 ? '#FFFBF0' : '#FBF4E2'} stroke="#E4D9BF" strokeWidth={2.5} /> : null; }))}
      <g transform="translate(0,150)">
      {/* window */}
      <rect x="60" y="300" width="300" height="320" rx="10" fill="#D6EBF3" stroke={I} strokeWidth={LW} />
      <path d="M210,300 V620 M60,460 H360" stroke={I} strokeWidth={LW} />
      <path d="M90,620 C90,560 130,540 166,556 C184,506 232,506 246,556 C290,540 330,570 330,620Z" fill={C.green} stroke={I} strokeWidth={LW} strokeLinejoin="round" />
      <rect x="44" y="616" width="332" height="22" rx="6" fill={C.cream} stroke={I} strokeWidth={LW} />
      {/* shelf + bowls */}
      <rect x="560" y="520" width="440" height="20" rx="5" fill={C.brown} stroke={I} strokeWidth={LW} />
      {[600, 710, 820].map((x, i) => (<g key={i}><path d={`M${x},430 q50,70 100,0Z`} fill={C.cream} stroke={I} strokeWidth={LW} strokeLinejoin="round" /><path d={`M${x + 8},470 q42,22 84,0`} fill="none" stroke={C.tomato} strokeWidth={7} /></g>))}
      {/* rail utensils */}
      <line x1="430" y1="300" x2="1000" y2="300" stroke={I} strokeWidth={LW + 1} />
      {[[500, 86], [590, 112], [690, 70]].map(([x, l], i) => (<g key={i}><line x1={x} y1={300} x2={x} y2={324} stroke={I} strokeWidth={LW} /><rect x={x - 7} y={324} width={14} height={l} rx={7} fill={i % 2 ? C.brown : '#CFD3D6'} stroke={I} strokeWidth={LW} /><ellipse cx={x} cy={324 + l + 14} rx={i === 1 ? 22 : 17} ry={i === 1 ? 20 : 11} fill={i % 2 ? C.brown : '#E4E6E8'} stroke={I} strokeWidth={LW} /></g>))}
      </g>
      {/* stove + pot */}
      <rect x="760" y="1096" width="300" height="84" rx="12" fill="#5A6470" stroke={I} strokeWidth={LW} />
      <path d="M800,740 L1020,740 L1004,1096 L816,1096Z" fill="#D9DDE0" stroke={I} strokeWidth={LW} strokeLinejoin="round" />
      <ellipse cx="910" cy="740" rx="110" ry="16" fill="#9AA2AA" stroke={I} strokeWidth={LW} />
      <path d="M790,770 q-30,10 -30,36 M1030,770 q30,10 30,36" fill="none" stroke={I} strokeWidth={LW + 3} strokeLinecap="round" />
      <path d="M826,770 C830,880 836,980 846,1070" fill="none" stroke="#FFFFFF" strokeWidth={9} opacity={0.7} strokeLinecap="round" />
      {/* counter */}
      <rect x="-20" y="1180" width="1120" height="80" fill={C.sand} stroke={I} strokeWidth={LW} />
      <rect x="-20" y="1260" width="1120" height="700" fill="#D7A06A" />
      {[0, 1, 2].map((i) => (<g key={i}><rect x={-30 + i * 370} y={1300} width={340} height={520} rx={8} fill="#E3B27A" stroke={I} strokeWidth={LW} /><rect x={-4 + i * 370} y={1328} width={288} height={464} rx={6} fill="none" stroke="#C48C57" strokeWidth={4} /><circle cx={286 + i * 370} cy={1380} r={11} fill={C.mustard} stroke={I} strokeWidth={LW} /></g>))}
    </svg>
  </AbsoluteFill>
);

/** ILLUSTRATED FOOD STALL (flat), centred on (cx, baseY = ground) */
export const StallFlat: React.FC<{cx?: number; ground?: number; size?: number; sign?: string}> = ({cx = 330, ground = 1350, size = 760, sign = 'MIE'}) => {
  const k = size / 520, w = LW / k;
  return (
    <svg width={1080} height={1920} style={{position: 'absolute', inset: 0}}>
      <g transform={`translate(${cx - 260 * k},${ground - 452 * k}) scale(${k})`}>
        <ellipse cx="260" cy="456" rx="230" ry="14" fill={C.shadow} />
        <rect x="70" y="150" width="380" height="250" fill="#F6E2BD" stroke={I} strokeWidth={w} strokeLinejoin="round" />
        <path d="M40,150 L260,36 L480,150Z" fill={C.brown} stroke={I} strokeWidth={w} strokeLinejoin="round" />
        <rect x="190" y="104" width="140" height="44" rx="8" fill={C.white} stroke={I} strokeWidth={w} />
        <text x="260" y="136" textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={28} fill={C.navy}>{sign}</text>
        {Array.from({length: 8}).map((_, i) => <path key={i} d={`M${48 + i * 53},160 h53 v34 q-26.5,22 -53,0Z`} fill={i % 2 ? C.white : C.tomato} stroke={I} strokeWidth={w * 0.8} strokeLinejoin="round" />)}
        <rect x="70" y="300" width="380" height="100" fill={C.brown} stroke={I} strokeWidth={w} />
        <rect x="58" y="284" width="404" height="22" rx="6" fill="#D9A66F" stroke={I} strokeWidth={w} />
        <path d="M110,284 q30,34 60,0Z" fill={C.cream} stroke={I} strokeWidth={w} strokeLinejoin="round" />
        <path d="M350,284 q40,40 80,0Z" fill={C.cream} stroke={I} strokeWidth={w} strokeLinejoin="round" />
        {[110, 410].map((x) => (<g key={x}><rect x={x - 28} y={410} width={56} height={14} rx={6} fill={C.brown} stroke={I} strokeWidth={w} /><path d={`M${x - 20},424 l-8,28 M${x + 20},424 l8,28`} stroke={I} strokeWidth={w * 1.6} strokeLinecap="round" /></g>))}
      </g>
    </svg>
  );
};
