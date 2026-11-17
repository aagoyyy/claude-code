import React from 'react';
import {AbsoluteFill, Img, Sequence, staticFile, useCurrentFrame} from 'remotion';
import {MieCore, CamFn} from '../mie/MieScene';
import {Pill} from '../mie/Script1';
import {Bubbles, clamp, Drops, Dust, ease, easeOut, FloatHeart, FxDefs, Glow, hash, lerp, Sparkle, Steam} from './fx';

/**
 * FULL STORY VIDEO (24 fps, 1080x1920). 13 scenes from the storyboard.
 * Every scene = camera (eased zoom/pan + handheld drift) + 2 parallax SVG layers + deterministic micro-movement overlays + caption pill.
 * Scenes overlap by OV frames and hand over with a transition (zoom-through / whip pan / iris / fade).
 */
export const FPS = 24;
export const OV = 14;                         // transition overlap (frames)
type TrIn = 'none' | 'zoom' | 'whipL' | 'whipU' | 'fade' | 'iris';
type Key = {f: number; z: number; cx: number; cy: number; rot?: number};
type Scene = {id: string; dur: number; keys: Key[]; cap: [string, string?][]; capSize?: number; tin: TrIn; irisAt?: [number, number]};

const S = (s: number) => Math.round(s * FPS);
export const SCENES: Scene[] = [
  {id: 'p1', dur: S(5.6), tin: 'none', cap: [['Mie instan di warung'], ['cuma', 'Rp 3.000']], keys: [{f: 0, z: 1.02, cx: 540, cy: 930}, {f: 60, z: 1.22, cx: 520, cy: 800, rot: -0.6}, {f: 128, z: 1.38, cx: 640, cy: 1370, rot: 0.5}]},
  {id: 'p2', dur: S(7.6), tin: 'zoom', cap: [['Dimasak di warmindo'], ['laku', 'Rp 10.000–15.000']], capSize: 58, keys: [{f: 0, z: 1.0, cx: 540, cy: 1000}, {f: 80, z: 1.25, cx: 540, cy: 760}, {f: 182, z: 1.55, cx: 540, cy: 1130}]},
  {id: 'p3', dur: S(7.6), tin: 'whipL', cap: [['Kenapa warung mie'], ['nggak pernah sepi?']], keys: [{f: 0, z: 1.12, cx: 760, cy: 780}, {f: 80, z: 1.35, cx: 540, cy: 1090}, {f: 182, z: 1.5, cx: 540, cy: 1290}]},
  {id: 'kv', dur: S(6.6), tin: 'zoom', cap: [['Satu porsi komplit'], ['dijual', 'Rp 12.000']], keys: []},
  {id: 'p5', dur: S(10.6), tin: 'whipU', cap: [['Modal aslinya:'], ['HPP', 'Rp 7.000']], keys: [{f: 0, z: 1.25, cx: 300, cy: 620}, {f: 60, z: 1.25, cx: 790, cy: 740}, {f: 130, z: 1.3, cx: 760, cy: 1180}, {f: 190, z: 1.3, cx: 320, cy: 1240}, {f: 254, z: 1.12, cx: 560, cy: 1620}]},
  {id: 'p10', dur: S(6.6), tin: 'fade', cap: [['Margin kotor'], ['lebih dari', '40%']], keys: [{f: 0, z: 1.45, cx: 250, cy: 1050}, {f: 70, z: 1.2, cx: 540, cy: 860, rot: 0.8}, {f: 158, z: 1.5, cx: 840, cy: 1020, rot: -0.6}]},
  {id: 'p11', dur: S(5.6), tin: 'zoom', cap: [['Kuncinya:', 'perputaran'], ['& jam buka']], keys: [{f: 0, z: 1.3, cx: 540, cy: 1380}, {f: 70, z: 1.5, cx: 540, cy: 520}, {f: 134, z: 1.05, cx: 540, cy: 1000}]},
  {id: 'p6', dur: S(8.6), tin: 'whipL', cap: [['Sewa kios Rp 1,5 jt'], ['listrik & air', 'Rp 500 rb']], capSize: 54, keys: [{f: 0, z: 1.3, cx: 300, cy: 600}, {f: 90, z: 1.3, cx: 700, cy: 520}, {f: 206, z: 1.45, cx: 840, cy: 1000}]},
  {id: 'p12', dur: S(7.6), tin: 'fade', cap: [['Biaya operasional'], ['± Rp 70.000', 'per hari']], keys: [{f: 0, z: 1.0, cx: 540, cy: 960}, {f: 70, z: 1.4, cx: 520, cy: 640}, {f: 182, z: 1.55, cx: 700, cy: 1250, rot: 0.5}]},
  {id: 'p7', dur: S(7.6), tin: 'zoom', cap: [['Jual minimal'], ['15 mangkuk', 'per hari']], keys: [{f: 0, z: 1.5, cx: 300, cy: 1500}, {f: 80, z: 1.25, cx: 700, cy: 1100}, {f: 182, z: 1.18, cx: 780, cy: 560}]},
  {id: 'p13', dur: S(5.6), tin: 'whipU', cap: [['Ramai? Tembus 80 mangkuk'], ['+ es teh manis']], capSize: 52, keys: [{f: 0, z: 1.4, cx: 540, cy: 780}, {f: 134, z: 1.4, cx: 540, cy: 1480}]},
  {id: 'p8', dur: S(7.6), tin: 'iris', irisAt: [540, 800], cap: [['Cuan bersih'], ['Rp 5–7 juta', 'per bulan']], keys: [{f: 0, z: 1.0, cx: 540, cy: 700}, {f: 90, z: 1.35, cx: 540, cy: 600}, {f: 182, z: 1.55, cx: 840, cy: 1280}]},
  {id: 'p9', dur: S(8.6), tin: 'zoom', cap: [['Komen “mulai”'], ['untuk panduan']], keys: [{f: 0, z: 1.25, cx: 540, cy: 520}, {f: 100, z: 1.3, cx: 540, cy: 900}, {f: 206, z: 1.0, cx: 540, cy: 960}]},
];
const starts = SCENES.map((_, i) => SCENES.slice(0, i).reduce((a, s) => a + s.dur - OV, 0));
export const STORY_TOTAL = starts[SCENES.length - 1] + SCENES[SCENES.length - 1].dur;
const nextTin = (i: number): TrIn => (SCENES[i + 1] ? SCENES[i + 1].tin : 'none');

/* ---------------- camera ---------------- */
function cam(keys: Key[], f: number) {
  let i = 0; while (i < keys.length - 2 && f >= keys[i + 1].f) i++;
  const a = keys[i], b = keys[Math.min(i + 1, keys.length - 1)];
  const t = ease(b.f === a.f ? 1 : (f - a.f) / (b.f - a.f));
  const rot = lerp(a.rot ?? 0, b.rot ?? 0, t);
  const z = Math.max(1.07, lerp(a.z, b.z, t));
  const hx = 540 / z + 14, hy = 960 / z + 20;                 // keep the view inside the 1080x1920 panel (margin for drift + rotation)
  const cx0 = clamp(lerp(a.cx, b.cx, t), hx, 1080 - hx), cy0 = clamp(lerp(a.cy, b.cy, t), hy, 1920 - hy);
  return {
    z,
    cx: cx0 + 3.2 * Math.sin(f / 31) + 1.6 * Math.sin(f / 13),       // handheld drift
    cy: cy0 + 2.6 * Math.cos(f / 37),
    rot: rot + 0.1 * Math.sin(f / 53),
  };
}
const tf = (z: number, cx: number, cy: number, rot: number) => `translate(540px,960px) rotate(${rot}deg) scale(${z}) translate(${-cx}px,${-cy}px)`;

/* ---------------- transitions ---------------- */
function trStyle(inT: TrIn, inP: number, outT: TrIn, outP: number, irisAt?: [number, number]): React.CSSProperties {
  let tr = '', op = 1, filter = '', clip: string | undefined;
  const ei = ease(inP), eo = ease(outP);
  if (inP < 1) {
    if (inT === 'zoom') { op = ei; tr += ` scale(${lerp(1.3, 1, ei)})`; }
    if (inT === 'fade') op = ei;
    if (inT === 'whipL') { tr += ` translateX(${(1 - ei) * 1080}px)`; filter = `blur(${Math.sin(Math.PI * inP) * 14}px)`; }
    if (inT === 'whipU') { tr += ` translateY(${(1 - ei) * 1920}px)`; filter = `blur(${Math.sin(Math.PI * inP) * 14}px)`; }
    if (inT === 'iris') { const [x, y] = irisAt ?? [540, 960]; clip = `circle(${ei * 2100}px at ${x}px ${y}px)`; }
  }
  if (outP > 0) {
    if (outT === 'zoom') tr += ` scale(${lerp(1, 1.3, eo)})`;
    if (outT === 'whipL') { tr += ` translateX(${-eo * 1080}px)`; filter = `blur(${Math.sin(Math.PI * outP) * 14}px)`; }
    if (outT === 'whipU') { tr += ` translateY(${-eo * 1920}px)`; filter = `blur(${Math.sin(Math.PI * outP) * 14}px)`; }
  }
  return {transform: tr || undefined, opacity: op, filter: filter || undefined, clipPath: clip};
}

/* ---------------- micro-movement overlays (panel coordinates) ---------------- */
const BULBS = (() => {
  const seg = (p0: number[], p3: number[], sag: number) => {
    const c1 = [p0[0] + (p3[0] - p0[0]) * 0.3, p0[1] + sag * 1.6], c2 = [p0[0] + (p3[0] - p0[0]) * 0.7, p3[1] + sag * 1.6];
    return Array.from({length: 11}, (_, j) => { const t = (2 + j * 2) / 24, u = 1 - t;
      return [u ** 3 * p0[0] + 3 * u * u * t * c1[0] + 3 * u * t * t * c2[0] + t ** 3 * p3[0], u ** 3 * p0[1] + 3 * u * u * t * c1[1] + 3 * u * t * t * c2[1] + t ** 3 * p3[1] + 14]; });
  };
  return [...seg([0, 560], [540, 520], 80), ...seg([540, 520], [1080, 580], 90)];
})();
const fmt = (n: number) => Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
const sc5 = (x: number, y: number): [number, number] => [540 + (x - 540) * 1.1, 960 + (y - 960) * 1.1];

const Overlay: React.FC<{id: string; f: number}> = ({id, f}) => {
  switch (id) {
    case 'p1': return (<g>
      <Steam x={860} y={240} f={f} n={5} height={170} width={22} seed={1} />
      {[[170, 1560], [270, 1640], [140, 1700], [930, 1650]].map(([x, y], i) => <Sparkle key={i} x={x - 18} y={y - 18} f={f} size={26} period={70} phase={i * 19} />)}
      <Sparkle x={500} y={560} f={f} size={34} period={90} phase={10} /><Sparkle x={640} y={1400} f={f} size={22} period={64} phase={30} />
      <Dust f={f} seed={1} n={16} />
    </g>);
    case 'p2': return (<g>
      {BULBS.map(([x, y], i) => <Glow key={i} x={x} y={y} f={f} r={46} amp={0.28} speed={0.2 + (i % 4) * 0.03} phase={i * 1.9} base={0.65} />)}
      <Glow x={940} y={1050} f={f} r={150} red amp={0.2} speed={0.35} base={0.75} />
      <Glow x={95} y={200} f={f} r={150} amp={0.1} speed={0.05} base={0.55} />
      {[300, 480, 640].map((x, i) => <Steam key={i} x={x} y={1250} f={f + i * 9} n={4} height={170} width={12} seed={2 + i} period={64} scale={0.8} />)}
      <Steam x={400} y={1150} f={f} n={5} height={220} width={16} seed={9} /><Steam x={470} y={1150} f={f + 20} n={5} height={240} width={16} seed={12} />
      {Array.from({length: 8}, (_, i) => <Sparkle key={i} x={hash(i * 3.3) * 1000 + 40} y={hash(i * 5.9) * 480 + 30} f={f} size={14 + hash(i) * 12} period={50 + i * 7} phase={i * 17} color="#E8F1FF" />)}
      <Dust f={f} seed={2} n={20} color="#FFE7B0" maxOp={0.35} />
    </g>);
    case 'p3': return (<g>
      <Glow x={540} y={350} f={f} r={260} amp={0.08} speed={0.09} base={0.6} />
      <Steam x={470} y={1030} f={f} n={5} height={260} width={20} seed={4} /><Steam x={620} y={1030} f={f + 14} n={5} height={280} width={20} seed={5} />
      {[250, 540, 830].map((x, i) => <Steam key={i} x={x} y={1275} f={f + i * 11} n={4} height={200} width={14} seed={6 + i} period={60} scale={0.9} />)}
      <Dust f={f} seed={3} n={18} />
    </g>);
    case 'p5': return (<g>
      {[sc5(360, 855), sc5(830, 825), sc5(450, 1470), sc5(860, 1450)].map(([x, y], i) => <Sparkle key={i} x={x} y={y} f={f} size={30} period={80} phase={i * 23} />)}
      <Sparkle x={560} y={1775} f={f} size={36} period={72} phase={6} />
      <Dust f={f} seed={5} n={14} />
    </g>);
    case 'p10': return (<g>
      <Steam x={205} y={1005} f={f} n={5} height={190} width={14} seed={11} />
      {[[806, 960], [866, 930], [926, 960], [770, 990]].map(([x, y], i) => <Sparkle key={i} x={x} y={y} f={f} size={24} period={66} phase={i * 17} />)}
      <Sparkle x={580} y={730} f={f} size={26} period={84} phase={20} />
      <Dust f={f} seed={6} n={16} />
    </g>);
    case 'p11': {
      const u = ease(clamp((f - 4) / 72));
      const mAng = -30 * (1 - ease(clamp(f / 60))), hAng = 207.5 + 2.5 * ease(clamp(f / 60));
      const pt = (a: number, r: number) => [540 + r * Math.cos(((a - 90) * Math.PI) / 180), 450 + r * Math.sin(((a - 90) * Math.PI) / 180)];
      return (<g>
        <defs><linearGradient id="slat" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#B8C4CE" /><stop offset="1" stopColor="#7E8C98" /></linearGradient><clipPath id="shclip"><rect x="100" y="1340" width="880" height="290" /></clipPath></defs>
        <g clipPath="url(#shclip)">
          {Array.from({length: 11}, (_, k) => <g key={k} transform={`translate(0 ${1340 + k * 34 - u * 290})`}><rect x="100" y="0" width="880" height="32" fill="url(#slat)" stroke="#2B1B17" strokeWidth="3" /><rect x="100" y="3" width="880" height="6" fill="#fff" opacity=".35" /></g>)}
          <rect x="90" y={1634 - u * 290} width="900" height="28" rx="6" fill="#7E8C98" stroke="#2B1B17" strokeWidth="4" />
        </g>
        <circle cx="540" cy="450" r="138" fill="#F8F3E8" />
        {Array.from({length: 12}, (_, k) => { const [x1, y1] = pt(k * 30, 114), [x2, y2] = pt(k * 30, 130); return <line key={k} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#2B1B17" strokeWidth={k % 3 === 0 ? 7 : 4} strokeLinecap="round" />; })}
        <line x1="540" y1="450" x2={pt(hAng, 70)[0]} y2={pt(hAng, 70)[1]} stroke="#2B1B17" strokeWidth="12" strokeLinecap="round" />
        <line x1="540" y1="450" x2={pt(mAng, 108)[0]} y2={pt(mAng, 108)[1]} stroke="#2B1B17" strokeWidth="7" strokeLinecap="round" />
        <circle cx="540" cy="450" r="11" fill="#D54F48" stroke="#2B1B17" strokeWidth="4" />
        <Glow x={840} y={560} f={f} r={260} amp={0.1} speed={0.07} base={0.6} />
        {[340, 540, 740].map((x, i) => <Steam key={i} x={x} y={1610 - u * 20} f={f + i * 13} n={4} height={240} width={16} seed={20 + i} period={66} scale={0.9} op={0.5 * u} />)}
        <Dust f={f} seed={7} n={18} />
      </g>);
    }
    case 'p6': return (<g>
      <Drops x={840} y0={940} y1={1040} f={f} period={22} rippleY={1030} rippleRx={74} />
      <Glow x={392} y={332} f={f} r={90} amp={0.3} speed={0.45} base={0.6} />
      <Sparkle x={690} y={380} f={f} size={22} period={72} phase={8} /><Sparkle x={560} y={330} f={f} size={18} period={90} phase={40} />
      <Dust f={f} seed={8} n={14} />
    </g>);
    case 'p12': return (<g>
      <Steam x={880} y={1010} f={f} n={5} height={180} width={12} seed={30} scale={0.8} />
      {[[140, 1700], [230, 1760], [860, 1720], [940, 1790]].map(([x, y], i) => <Sparkle key={i} x={x - 14} y={y - 14} f={f} size={24} period={70} phase={i * 21} />)}
      <Dust f={f} seed={9} n={14} />
    </g>);
    case 'p7': return (<g>
      <rect x="640" y={lerp(1800, -300, (f % 96) / 96)} width="280" height="280" fill="#fff" opacity=".07" filter="url(#fx-soft)" />
      {[[470, 1590], [560, 1580], [650, 1595]].map(([x, y], i) => <Sparkle key={i} x={x} y={y} f={f} size={20} period={58} phase={i * 19} color="#E8F7FF" />)}
      <Dust f={f} seed={10} n={22} />
    </g>);
    case 'p13': return (<g>
      <Bubbles x0={275} x1={805} y0={520} y1={1080} f={f} n={22} seed={3} />
      <Drops x={585} y0={1150} y1={1210} f={f} period={26} />
      {[[360, 700], [700, 640], [540, 900]].map(([x, y], i) => <Sparkle key={i} x={x} y={y} f={f} size={26} period={70} phase={i * 23} color="#FFFCE8" />)}
      <Dust f={f} seed={11} n={18} />
    </g>);
    case 'p8': {
      const val = Math.round(5500000 * easeOut(clamp(f / 84)));
      return (<g>
        <rect x="696" y="1146" width="288" height="110" rx="12" fill="#C7E0B8" />
        <text x="710" y="1178" fontFamily="Inter, sans-serif" fontWeight={800} fontSize="20" letterSpacing="3" fill="#4E6A44">CUAN</text>
        <text x="972" y="1234" textAnchor="end" fontFamily="Inter, sans-serif" fontWeight={800} fontSize="46" fill="#1C2A18">{fmt(val)}</text>
        {[[170, 830], [406, 830], [642, 914], [878, 830]].map(([x, y], i) => <Sparkle key={i} x={x} y={y} f={f} size={26} period={64} phase={i * 17} />)}
        <Sparkle x={300} y={560} f={f} size={34} period={80} phase={12} />
        <Dust f={f} seed={12} n={14} />
      </g>);
    }
    case 'p9': {
      const k = (f % 40) / 40;
      return (<g>
        <rect x={350 - 14 * k} y={872 - 14 * k} width={350 + 28 * k} height={96 + 28 * k} rx={30 + 12 * k} fill="none" stroke="#D54F48" strokeWidth={5} opacity={(1 - k) * 0.9} />
        {[0, 17, 34, 51].map((ph, i) => <FloatHeart key={i} x={792} y={900} f={f} phase={ph} period={70} size={26 + (i % 2) * 10} />)}
        <Dust f={f} seed={13} n={20} color="#FFD6CF" maxOp={0.6} />
      </g>);
    }
    default: return null;
  }
};

/* ---------------- one scene ---------------- */
const KV_CAM: CamFn = (g) => {          // after the master 5 s, push to the bowl (same logic as Part1)
  const f = g - 120, t = ease(clamp(f / 70)), z = lerp(1.05, 1.45, t), sy = lerp(960, 1180, t);
  const wx = lerp(556, 610, t), wy = lerp(1040, 1430, t);
  return {cx: wx, cy: wy - (sy - 960) / z, z};
};

const SceneView: React.FC<{i: number}> = ({i}) => {
  const f = useCurrentFrame();
  const sc = SCENES[i];
  const inP = i === 0 ? 1 : clamp(f / OV), outP = clamp((f - (sc.dur - OV)) / OV);
  const style = trStyle(sc.tin, inP, nextTin(i), i === SCENES.length - 1 ? 0 : outP, sc.irisAt);
  const c = sc.id === 'kv' ? null : cam(sc.keys, f);
  const capIn = easeOut(clamp((f - 10) / 14));
  return (
    <AbsoluteFill style={style}>
      <AbsoluteFill style={{background: '#EADCC3'}}>
        {sc.id === 'kv' ? (
          <MieCore f={36 + f} cam={KV_CAM} tag2={128} />
        ) : (
          <>
            <div style={{position: 'absolute', left: 0, top: 0, width: 1080, height: 1920, transformOrigin: '0 0', transform: tf(c!.z, c!.cx, c!.cy, c!.rot)}}>
              <Img src={staticFile(`sb/${sc.id}_bg.svg`)} style={{width: 1080, height: 1920, display: 'block'}} />
            </div>
            <div style={{position: 'absolute', left: 0, top: 0, width: 1080, height: 1920, transformOrigin: '0 0', transform: tf(c!.z * 1.025 + (c!.z - 1) * 0.1, c!.cx, c!.cy, c!.rot)}}>
              <Img src={staticFile(`sb/${sc.id}_fg.svg`)} style={{width: 1080, height: 1920, display: 'block'}} />
              <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{position: 'absolute', left: 0, top: 0, overflow: 'visible'}}><FxDefs /><Overlay id={sc.id} f={f} /></svg>
            </div>
          </>
        )}
        <AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 46%, rgba(0,0,0,0) 58%, rgba(42,18,8,0.30) 100%)', pointerEvents: 'none'}} />
        {sc.id === 'kv' && <AbsoluteFill style={{pointerEvents: 'none'}}><svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{position: 'absolute'}} /></AbsoluteFill>}
      </AbsoluteFill>
      <div style={{opacity: capIn * (1 - clamp((f - (sc.dur - OV - 4)) / 8))}}>
        <Pill lines={sc.cap} y={230} size={sc.capSize ?? 64} dy={(1 - capIn) * 26} o={1} />
      </div>
    </AbsoluteFill>
  );
};

export const Story: React.FC = () => (
  <AbsoluteFill style={{background: '#140808'}}>
    {SCENES.map((sc, i) => (
      <Sequence key={sc.id} from={starts[i]} durationInFrames={sc.dur}><SceneView i={i} /></Sequence>
    ))}
  </AbsoluteFill>
);
