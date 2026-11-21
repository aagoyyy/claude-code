import React from 'react';
import {mix} from '../world/util';

/** Side-view (profile) rig. Local space: feet on y=0, figure faces +x, ~1270 tall. Mirror with `face='left'`. */
export type Pal = {skin: string; hair: string; top: string; bottom: string; belt: string; boots: string; puttee?: string; metal?: string};
export type Head = 'none' | 'brodie' | 'pith' | 'slouch' | 'cap' | 'turban' | 'stahl' | 'bustina';
export type SidePose = Partial<Record<'torso' | 'head' | 'uaN' | 'faN' | 'uaF' | 'faF' | 'thN' | 'shN' | 'ftN' | 'thF' | 'shF' | 'ftF', number>> & {dx?: number; dy?: number; br?: number; blink?: number};

export type SideOpts = {
  pal: Pal;
  head?: Head;
  face?: 'left' | 'right';
  hero?: boolean;                 // Sam Browne strap, ribbons, mustache, scars...
  patch?: boolean; stump?: boolean; young?: boolean; bandages?: boolean;
  gear?: 'none' | 'rifle' | 'pack' | 'rifle+pack' | 'spear';
  mustache?: boolean; beard?: boolean;
  build?: number;                 // width multiplier of the torso/limbs
  hat?: string;                   // headgear colour
};

const sh = (c: string, t: number) => mix(c, '#000000', t);
const hl = (c: string, t: number) => mix(c, '#ffffff', t);

export const SideDefs: React.FC = () => (
  <defs>
    <linearGradient id="sideShade" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stopColor="#fff" stopOpacity=".2" /><stop offset=".3" stopColor="#fff" stopOpacity="0" /><stop offset=".65" stopColor="#000" stopOpacity=".12" /><stop offset="1" stopColor="#000" stopOpacity=".46" />
    </linearGradient>
    <linearGradient id="sideShadeV" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stopColor="#000" stopOpacity=".28" /><stop offset=".25" stopColor="#000" stopOpacity="0" /><stop offset=".8" stopColor="#000" stopOpacity="0" /><stop offset="1" stopColor="#000" stopOpacity=".3" />
    </linearGradient>
    <filter id="sBlur3"><feGaussianBlur stdDeviation="3" /></filter>
  </defs>
);

const OUT = '#2a2418';

/** limb segment hanging down from its pivot, with round caps */
const Seg: React.FC<{len: number; w0: number; w1: number; c: string; out?: string; children?: React.ReactNode}> = ({len, w0, w1, c, out = OUT, children}) => {
  const d = `M${-w0 / 2} 0 L${w0 / 2} 0 L${w1 / 2} ${len} L${-w1 / 2} ${len} Z`;
  return (
    <g>
      <path d={d} fill={c} stroke={out} strokeWidth="3" strokeLinejoin="round" />
      <circle cx={0} cy={len} r={w1 / 2} fill={c} /><circle cx={0} cy={0} r={w0 / 2} fill={c} />
      <path d={d} fill="url(#sideShade)" /><circle cx={0} cy={len} r={w1 / 2} fill="url(#sideShade)" /><circle cx={0} cy={0} r={w0 / 2} fill="url(#sideShade)" />
      <path d={`M${-w0 * 0.3} ${len * 0.05} L${-w1 * 0.3} ${len * 0.95}`} stroke="#fff" strokeWidth="3" opacity=".16" strokeLinecap="round" />
      {children}
    </g>
  );
};

const HeadArt: React.FC<{o: SideOpts; near: boolean; blink: number}> = ({o, near, blink}) => {
  const {pal} = o;
  const skinD = sh(pal.skin, 0.28), skinL = hl(pal.skin, 0.2);
  const hatC = o.hat || '#9a9462';
  const faceP = 'M-70 -20 C-80 -90 -40 -100 10 -98 C50 -96 66 -66 66 -44 L69 -30 L66 -10 Q92 14 77 26 L63 31 L61 46 L63 56 Q61 76 48 82 L20 86 Q-20 92 -44 66 L-62 30 Q-78 10 -70 -20 Z';
  const hairP = 'M-72 -14 C-86 -92 -40 -108 12 -104 C46 -102 62 -80 66 -58 Q40 -80 14 -78 Q-20 -74 -34 -54 Q-44 -30 -40 -4 Q-52 10 -58 36 Q-80 20 -72 -14 Z';
  return (
    <g>
      {/* neck */}
      <path d="M-34 56 L38 56 L36 124 L-44 124 Z" fill={sh(pal.skin, 0.12)} stroke={OUT} strokeWidth="3" />
      <path d="M-34 70 Q2 100 38 70 V100 Q2 130 -34 100 Z" fill="#000" opacity=".22" filter="url(#sBlur3)" />
      {/* ear (near side) */}
      <ellipse cx={-14} cy={8} rx={15} ry={24} fill={skinL} stroke={OUT} strokeWidth="2.5" />
      <path d="M-18 -4 Q-6 8 -16 22" stroke={skinD} strokeWidth="2.5" fill="none" />
      <path d={faceP} fill={pal.skin} stroke={OUT} strokeWidth="3" strokeLinejoin="round" />
      <path d={faceP} fill="url(#sideShade)" />
      <ellipse cx={34} cy={34} rx={20} ry={13} fill="#d0705a" opacity=".22" />
      {/* hair / sideburn */}
      {!(o.head === 'turban') && <path d={hairP} fill={pal.hair} stroke={sh(pal.hair, 0.45)} strokeWidth="2.5" />}
      {!(o.head === 'turban') && <path d="M-62 -60 Q-20 -92 24 -88" stroke="#fff" strokeWidth="4" opacity=".28" fill="none" strokeLinecap="round" />}
      {/* brow, eye, nose line, wrinkles */}
      <path d="M26 -52 Q42 -62 58 -50" stroke={sh(pal.hair, 0.15)} strokeWidth="6" fill="none" strokeLinecap="round" />
      {!(o.hero && o.patch && near) && (
        <g transform={`translate(42 -32) scale(1 ${blink}) translate(-42 32)`}>
          <ellipse cx={42} cy={-32} rx={13} ry={8} fill="#fbfbf6" stroke="#6b3f24" strokeWidth="1.5" />
          <circle cx={46} cy={-32} r={6} fill="#4a86b8" /><circle cx={47} cy={-32} r={2.8} fill="#0f1822" /><circle cx={49} cy={-34} r={1.5} fill="#fff" />
        </g>
      )}
      <path d="M30 -38 Q42 -46 56 -36" stroke="#4a2a18" strokeWidth="2.4" fill="none" strokeLinecap="round" />
      <path d="M44 -26 Q50 -4 62 8" stroke={skinD} strokeWidth="2.4" fill="none" strokeLinecap="round" opacity=".5" />
      <path d="M62 42 Q70 52 60 62" stroke={skinD} strokeWidth="2.4" fill="none" opacity=".45" />
      <path d="M24 -64 Q44 -72 60 -62" stroke={skinD} strokeWidth="2" fill="none" opacity=".4" />
      {/* mouth + mustache */}
      <path d="M60 58 Q50 62 40 58" stroke="#a85c46" strokeWidth="4" fill="none" strokeLinecap="round" />
      {(o.mustache ?? o.hero) && (
        <g>
          <path d="M64 34 Q80 36 84 50 Q76 58 62 52 Q40 52 30 46 Q40 36 64 34 Z" fill={sh(pal.hair, 0.1)} stroke={sh(pal.hair, 0.55)} strokeWidth="2.2" />
          <path d="M44 42 q10 6 24 2 M42 50 q12 4 26 0" stroke={sh(pal.hair, 0.45)} strokeWidth="1.8" fill="none" />
        </g>
      )}
      {o.beard && <path d="M20 66 Q50 100 62 56 Q50 70 20 66 Z M40 52 Q62 88 66 52 Z" fill={sh(pal.hair, 0.1)} stroke={sh(pal.hair, 0.5)} strokeWidth="2" />}
      {/* eyepatch strap (always) + patch when the patched eye faces the camera */}
      {o.hero && o.patch && (
        <g>
          <path d="M64 -54 Q8 -72 -68 -46" stroke="#111" strokeWidth="8" fill="none" strokeLinecap="round" />
          {near && <ellipse cx={42} cy={-30} rx={27} ry={23} fill="#151515" stroke="#000" strokeWidth="2" />}
          {near && <ellipse cx={34} cy={-38} rx={11} ry={6} fill="#fff" opacity=".15" />}
          {near && <path d="M16 -36 Q-20 -48 -62 -42" stroke="#111" strokeWidth="7" fill="none" strokeLinecap="round" />}
        </g>
      )}
      {/* headgear */}
      <HeadGear kind={o.head || 'none'} c={hatC} />
    </g>
  );
};

const HeadGear: React.FC<{kind: Head; c: string}> = ({kind, c}) => {
  const d = sh(c, 0.3), l = hl(c, 0.25);
  switch (kind) {
    case 'brodie':
      return (<g><path d="M-92 -36 Q-84 -128 6 -134 Q92 -128 104 -40 L112 -32 L-100 -30 Z" fill={c} stroke={OUT} strokeWidth="3" /><path d="M-92 -36 Q-84 -128 6 -134 Q92 -128 104 -40 L112 -32 L-100 -30 Z" fill="url(#sideShade)" /><path d="M-60 -92 Q-10 -124 50 -112" stroke={l} strokeWidth="4" fill="none" opacity=".5" strokeLinecap="round" /><path d="M-20 -30 Q10 40 40 40" stroke={d} strokeWidth="3" fill="none" /></g>);
    case 'pith':
      return (<g><path d="M-86 -50 Q-86 -140 10 -150 Q96 -140 92 -50 Z" fill={c} stroke={OUT} strokeWidth="3" /><path d="M-86 -50 Q-86 -140 10 -150 Q96 -140 92 -50 Z" fill="url(#sideShade)" /><ellipse cx={4} cy={-48} rx={118} ry={16} fill={l} stroke={OUT} strokeWidth="3" /><ellipse cx={4} cy={-46} rx={118} ry={16} fill="url(#sideShade)" /><rect x={-86} y={-66} width={178} height={14} fill={d} opacity=".7" /></g>);
    case 'slouch':
      return (<g><path d="M-70 -56 Q-70 -126 6 -130 Q82 -126 78 -56 Z" fill={c} stroke={OUT} strokeWidth="3" /><path d="M-150 -44 Q-70 -78 6 -62 Q82 -76 150 -66 Q150 -48 100 -44 Q10 -36 -150 -44 Z" fill={l} stroke={OUT} strokeWidth="3" /><path d="M-70 -70 H78" stroke={d} strokeWidth="10" /><path d="M-70 -56 Q-70 -126 6 -130 Q82 -126 78 -56 Z" fill="url(#sideShade)" /></g>);
    case 'cap':
      return (<g><path d="M-80 -50 Q-80 -122 8 -126 Q84 -120 86 -52 Z" fill={c} stroke={OUT} strokeWidth="3" /><path d="M-80 -50 Q-80 -122 8 -126 Q84 -120 86 -52 Z" fill="url(#sideShade)" /><rect x={-82} y={-62} width={170} height={14} fill={d} /><path d="M86 -52 Q124 -52 130 -42 Q110 -38 84 -44 Z" fill="#14100c" stroke={OUT} strokeWidth="2.5" /><circle cx={60} cy={-56} r={6} fill="#d9b24c" /></g>);
    case 'turban':
      return (<g>{[0, 1, 2, 3].map((i) => <ellipse key={i} cx={4 - i * 3} cy={-62 - i * 22} rx={84 - i * 6} ry={26} fill={i % 2 ? l : c} stroke={OUT} strokeWidth="2.5" transform={`rotate(${-6 + i * 4} 0 ${-62 - i * 22})`} />)}<path d="M-78 -44 Q-100 -10 -88 40 Q-60 10 -64 -30 Z" fill={c} stroke={OUT} strokeWidth="2.5" /></g>);
    case 'stahl':
      return (<g><path d="M-96 -20 Q-96 -130 0 -136 Q90 -130 98 -40 L108 -22 L-90 -6 Q-104 4 -98 24 L-70 22 Z" fill={c} stroke={OUT} strokeWidth="3" /><path d="M-96 -20 Q-96 -130 0 -136 Q90 -130 98 -40 L108 -22 L-90 -6 Z" fill="url(#sideShade)" /></g>);
    case 'bustina':
      return (<g><path d="M-76 -56 Q-60 -118 20 -112 Q70 -96 76 -50 Z" fill={c} stroke={OUT} strokeWidth="3" /><path d="M-76 -56 Q-60 -118 20 -112 Q70 -96 76 -50 Z" fill="url(#sideShade)" /><path d="M-40 -100 L-10 -64" stroke={d} strokeWidth="4" /></g>);
    default:
      return null;
  }
};

export const SideArt: React.FC<{o: SideOpts; p: SidePose}> = ({o, p}) => {
  const {pal} = o;
  const flip = o.face === 'left';
  const B = o.build ?? 1;
  const top = pal.top, bot = pal.bottom;
  const metal = pal.metal || '#6b6a62';
  const nearIsLeftArm = flip;                    // facing left shows the person's LEFT side
  const stumpNear = o.hero && o.stump && nearIsLeftArm, stumpFar = o.hero && o.stump && !nearIsLeftArm;
  const rot = (a?: number) => `rotate(${(a || 0).toFixed(2)})`;

  const Arm: React.FC<{near: boolean; ua?: number; fa?: number; stump?: boolean}> = ({near, ua, fa, stump}) => {
    const c = near ? top : sh(top, 0.22);
    return (
      <g transform={`translate(0 -666) ${rot(p.torso)} translate(-6 -300) ${rot(ua)}`}>
        <Seg len={175} w0={64 * B} w1={56 * B} c={c} />
        <g transform={`translate(0 175) ${rot(fa)}`}>
          <Seg len={190} w0={54 * B} w1={44 * B} c={c}>
            <rect x={-26} y={150} width={52} height={22} rx={4} fill={sh(c, 0.18)} stroke={OUT} strokeWidth="2.5" />
          </Seg>
          {stump ? (
            <g transform="translate(0 196)">
              <path d="M-26 -16 L26 -16 Q38 30 20 62 Q0 74 -20 62 Q-38 30 -26 -16 Z" fill="#efeadb" stroke="#7d7767" strokeWidth="2.5" />
              <path d="M-30 4 Q0 12 30 4 M-32 22 Q0 30 32 22 M-30 40 Q0 48 30 40" stroke="#aaa392" strokeWidth="2" fill="none" />
              <ellipse cx={4} cy={40} rx={14} ry={16} fill="#c4281c" opacity=".55" filter="url(#sBlur3)" />
            </g>
          ) : (
            <g transform="translate(0 200)">
              <ellipse cx={0} cy={26} rx={30} ry={38} fill={pal.skin} stroke="#6b3f24" strokeWidth="3" />
              <ellipse cx={0} cy={26} rx={30} ry={38} fill="url(#sideShade)" />
              <path d="M-14 8 H22 M-16 26 H24 M-14 44 H20" stroke="#9c6b46" strokeWidth="3" strokeLinecap="round" />
            </g>
          )}
          {near && (o.gear === 'rifle' || o.gear === 'rifle+pack') && (
            <g transform="translate(0 220) rotate(-3)">
              <rect x={-7} y={-250} width={14} height={470} rx={5} fill="#5a3a22" stroke={OUT} strokeWidth="2.5" />
              <rect x={-5} y={80} width={10} height={150} fill={metal} />
              <rect x={-5} y={-250} width={10} height={90} fill="#3a2414" />
              <path d="M-4 -250 V220" stroke="#d9a977" strokeWidth="2" opacity=".5" />
            </g>
          )}
          {near && o.gear === 'spear' && (
            <g transform="translate(0 220)"><rect x={-5} y={-420} width={10} height={720} fill="#6a4a2a" stroke={OUT} strokeWidth="2" /><path d="M0 -520 L18 -420 L-18 -420 Z" fill="#aab0b8" stroke={OUT} strokeWidth="2" /></g>
          )}
        </g>
      </g>
    );
  };

  const Leg: React.FC<{near: boolean; th?: number; shn?: number; ft?: number}> = ({near, th, shn, ft}) => {
    const c = near ? bot : sh(bot, 0.24), bc = near ? pal.boots : sh(pal.boots, 0.25);
    const pt = pal.puttee;
    return (
      <g transform={`translate(0 -666) ${rot(th)}`}>
        <Seg len={300} w0={134 * B} w1={96 * B} c={c} />
        <g transform={`translate(0 300) ${rot(shn)}`}>
          <Seg len={260} w0={94 * B} w1={66 * B} c={pt ? (near ? pt : sh(pt, 0.22)) : c}>
            {pt && [60, 100, 140, 180, 220].map((y) => <path key={y} d={`M-40 ${y} L40 ${y - 14}`} stroke={sh(pt, 0.4)} strokeWidth="5" opacity=".7" />)}
          </Seg>
          <g transform={`translate(0 260) ${rot(ft)}`}>
            <path d="M-46 -20 L38 -20 L44 38 Q150 40 178 70 L180 106 L-62 106 L-62 20 Z" fill={bc} stroke={OUT} strokeWidth="3" strokeLinejoin="round" />
            <path d="M-46 -20 L38 -20 L44 38 Q150 40 178 70 L180 106 L-62 106 L-62 20 Z" fill="url(#sideShade)" />
            <rect x={-62} y={98} width={244} height={10} rx={4} fill="#17100a" />
            <path d="M52 44 Q110 54 150 76" stroke={hl(bc, 0.3)} strokeWidth="3" fill="none" opacity=".6" />
          </g>
        </g>
      </g>
    );
  };

  const torsoP = 'M-34 -352 L44 -352 Q100 -336 120 -270 Q134 -190 130 -110 Q126 -50 104 -4 L-92 -4 Q-112 -60 -114 -130 Q-118 -230 -104 -296 Q-90 -340 -34 -352 Z';
  const art = (
    <g>
      <Arm near={false} ua={p.uaF} fa={p.faF} stump={stumpFar} />
      <Leg near={false} th={p.thF} shn={p.shF} ft={p.ftF} />
      <Leg near th={p.thN} shn={p.shN} ft={p.ftN} />
      {(o.gear === 'pack' || o.gear === 'rifle+pack') && (
        <g transform={`translate(0 -666) ${rot(p.torso)}`}>
          <rect x={-200} y={-330} width={110} height={250} rx={26} fill={sh('#8a8458', 0.2)} stroke={OUT} strokeWidth="3" />
          <rect x={-200} y={-330} width={110} height={250} rx={26} fill="url(#sideShade)" />
          <path d="M-190 -250 H-96 M-190 -170 H-96" stroke={OUT} strokeWidth="3" opacity=".5" />
          <rect x={-176} y={-350} width={70} height={28} rx={12} fill="#6a6040" stroke={OUT} strokeWidth="2.5" />
        </g>
      )}
      <g transform={`translate(0 -666) ${rot(p.torso)} scale(1 ${p.br || 1})`}>
        <ellipse cx={0} cy={0} rx={96 * B} ry={64} fill={bot} stroke={OUT} strokeWidth="3" />
        <path d={torsoP} fill={top} stroke={OUT} strokeWidth="3" strokeLinejoin="round" />
        <path d={torsoP} fill="url(#sideShade)" /><path d={torsoP} fill="url(#sideShadeV)" opacity=".7" />
        <path d="M-92 -250 Q-100 -150 -88 -20" stroke="#fff" strokeWidth="6" opacity=".14" fill="none" filter="url(#sBlur3)" />
        <path d="M112 -250 L122 -40" stroke={sh(top, 0.35)} strokeWidth="3" opacity=".6" />
        {[-250, -180, -110, -50].map((y) => <circle key={y} cx={114 - (y > -120 ? 0 : 2)} cy={y} r={5} fill="#d9b24c" stroke="#6b5214" strokeWidth="1" />)}
        <path d="M-60 -200 Q0 -176 70 -200 M-70 -120 Q-10 -96 80 -120" stroke={sh(top, 0.4)} strokeWidth="3" fill="none" opacity=".35" />
        {/* pocket */}
        <rect x={18} y={-262} width={66} height={58} rx={5} fill={hl(top, 0.06)} stroke={OUT} strokeWidth="2.5" />
        <rect x={18} y={-262} width={66} height={20} rx={5} fill={sh(top, 0.1)} stroke={OUT} strokeWidth="2.5" />
        <circle cx={51} cy={-244} r={5} fill="#d9b24c" />
        {o.hero && (
          <g>
            <path d="M-62 -340 L-28 -350 L128 -150 L120 -108 Z" fill="#7a4a2a" stroke="#2a170c" strokeWidth="3" />
            <path d="M-50 -336 L116 -126" stroke="#d9ab78" strokeWidth="2" strokeDasharray="9 6" opacity=".85" />
            <rect x={64} y={-282} width={14} height={26} fill="#8c1f2a" /><rect x={78} y={-282} width={14} height={26} fill="#2a4a9a" /><rect x={92} y={-282} width={14} height={26} fill="#2a4a9a" /><rect x={106} y={-282} width={14} height={26} fill="#e6c53c" />
          </g>
        )}
        {/* belt */}
        <rect x={-96 * B} y={-26} width={206 * B} height={32} fill={pal.belt} stroke={OUT} strokeWidth="3" />
        <path d={`M${-92 * B} -20 H${106 * B}`} stroke="#d9ab78" strokeWidth="2" strokeDasharray="8 6" opacity=".6" />
        <rect x={86 * B} y={-30} width={32} height={40} rx={4} fill="#c9a24c" stroke="#5e4614" strokeWidth="3" /><rect x={94 * B} y={-20} width={16} height={20} fill="#3a2a0c" />
        {/* head */}
        <g transform={`translate(5 -352) ${rot(p.head)}`}>
          <g transform="translate(10 -106)"><HeadArt o={o} near={nearIsLeftArm} blink={p.blink === undefined ? 1 : p.blink} /></g>
        </g>
        {o.hero && o.bandages && (
          <g transform="translate(0 0)"><rect x={-5} y={0} width={0} height={0} /></g>
        )}
      </g>
      <Arm near ua={p.uaN} fa={p.faN} stump={stumpNear} />
    </g>
  );
  return <g transform={`translate(${(p.dx || 0).toFixed(1)} ${(p.dy || 0).toFixed(1)}) ${flip ? 'scale(-1 1)' : ''}`}>{art}</g>;
};

/** walking cycle (phase in radians); stride scales the swing */
export const walkPose = (phase: number, stride = 1): SidePose => {
  const s = Math.sin(phase), c = Math.cos(phase), sF = Math.sin(phase + Math.PI), cF = Math.cos(phase + Math.PI);
  const leg = (sv: number, cv: number) => ({th: -27 * stride * sv, sh: 8 + 46 * stride * Math.max(0, cv) ** 2, ft: 0});
  const n = leg(s, c), f = leg(sF, cF);
  return {
    thN: n.th, shN: n.sh, ftN: -(n.th + n.sh) * 0.7, thF: f.th, shF: f.sh, ftF: -(f.th + f.sh) * 0.7,
    uaN: 24 * stride * s, faN: -22 - 10 * Math.max(0, -s), uaF: -24 * stride * s, faF: -22 - 10 * Math.max(0, s),
    torso: -2.5 * s, head: 1.5 * s, dy: -9 * Math.abs(s) * stride,
  };
};
export const idlePose = (t: number): SidePose => ({torso: 0.6 * Math.sin(t), br: 1 + 0.006 * Math.sin(t), head: 0.8 * Math.sin(t * 0.7), uaN: 3, faN: -12, uaF: -2, faF: -10, shN: 3, shF: 3});
export const aimPose = (t: number): SidePose => ({torso: -3, head: 4, uaN: -78, faN: -14, uaF: -70, faF: -30, thN: -4, thF: 6, shN: 6, shF: 4, br: 1 + 0.004 * Math.sin(t)});
export const kneelPose = (t: number): SidePose => ({torso: -8, head: 10, thN: -88, shN: 88, ftN: 0, thF: 0, shF: 90, ftF: -70, uaN: -45, faN: -50, uaF: -38, faF: -40, dy: 316, br: 1 + 0.005 * Math.sin(t)});
