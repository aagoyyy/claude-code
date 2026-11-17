import React from 'react';
import {useCurrentFrame} from 'remotion';
import {Illustration} from '../../illustrations/Illustration';
import {materials as m, derived, palette} from '../../visual-system/ColorPalette';
import {ink, inkThin} from '../../visual-system/IllustrationStyle';
import {hash, lerp, smoothClosed, smoothOpen, Pt} from '../math';

export const BOWL2_VB = {w: 600, h: 480};
const BODY = 'M50,170 C58,330 150,420 230,424 L370,424 C450,420 542,330 550,170 A250,56 0 0 1 50,170Z';

export type Bowl2Props = {
  size?: number;
  fill?: number; // liquid level 0..1
  wave?: number; // surface ripple amplitude
  bloom?: number; // noodle mound growth (can overshoot 1.15)
  jig?: number; // secondary jiggle 0..1
  sx?: number;
  sy?: number;
  /** 0..1 — scales white highlights (low = matte hand-drawn look) */
  gloss?: number;
};

/** High-detail ceramic bowl: 5-tone shading, bounce light, lip thickness, patterned band, textured broth, 40+ layered noodle strands. */
export const Bowl2: React.FC<Bowl2Props> = ({size = 900, fill = 0.75, wave = 0, bloom = 0, jig = 0, sx = 1, sy = 1, gloss = 1}) => {
  const f = useCurrentFrame();
  const cx = 300, cy = lerp(212, 180, Math.min(1, fill)), rx = lerp(206, 232, Math.min(1, fill)), ry = lerp(36, 46, Math.min(1, fill));
  const N = 34;
  const surface: Pt[] = Array.from({length: N}, (_, i) => {
    const a = (i / N) * Math.PI * 2;
    const r = 1 + wave * 0.06 * Math.sin(a * 3 - f * 0.8) + wave * 0.035 * Math.sin(a * 5 + f * 0.95);
    return [cx + Math.cos(a) * rx * r, cy + Math.sin(a) * ry * r + wave * 6 * Math.sin(a * 2 + f * 0.7) + Math.sin(a) * wave * 4 * Math.sin(f * 0.5)];
  });
  const surfacePath = smoothClosed(surface);

  const strands = Array.from({length: 64}).map((_, i) => {
    const h1 = hash(i + 1), h2 = hash(i + 7), h3 = hash(i + 13), h4 = hash(i + 21);
    const ang = (h1 - 0.5) * 1.7;
    const L = (80 + h2 * 120) * (0.35 + 0.65 * Math.min(1.1, bloom));
    const cx0 = cx + (h3 - 0.5) * rx * 1.5;
    const edge = 1 - Math.min(1, Math.abs(cx0 - cx) / rx);
    const cy0 = cy + (h4 - 0.5) * ry * 1.25 - bloom * (14 + hash(i + 5) * 40) * (0.3 + 0.7 * edge);
    const ph = hash(i + 33) * 6.28 + f * (0.04 + 0.03 * h1) + jig * Math.sin(f * 0.7 + i) * 0.6;
    const pts: Pt[] = Array.from({length: 13}, (_, k) => {
      const u = k / 12 - 0.5;
      const px = Math.max(cx - rx * 0.97, Math.min(cx + rx * 0.97, cx0 + Math.cos(ang) * u * L + Math.sin(u * 5 + ph) * 12 * bloom));
      return [px, cy0 + Math.sin(ang) * u * L * 0.5 + Math.cos(u * 12 + ph * 1.1) * (6 * bloom + jig * 3) + Math.sin(u * 4 - ph) * 7 * bloom + jig * Math.sin(f * 0.8 + i) * 3] as Pt;
    });
    return {d: smoothOpen(pts), y: cy0, tone: i % 3};
  }).sort((a, b) => a.y - b.y);
  const tones = [m.noodle.light, m.noodle.base, m.noodle.hi];

  return (
    <Illustration vbW={BOWL2_VB.w} vbH={BOWL2_VB.h} size={size} style={{transform: `scale(${sx}, ${sy})`, transformOrigin: '50% 94%'}}>
      <defs>
        <filter id="bw2-blur" x="-20%" y="-50%" width="140%" height="200%"><feGaussianBlur stdDeviation="9" /></filter>
        <linearGradient id="bw2-body" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor={m.ceramic.light} />
          <stop offset="0.22" stopColor={m.ceramic.hi} />
          <stop offset="0.5" stopColor={m.ceramic.base} />
          <stop offset="0.82" stopColor={m.ceramic.shade} />
          <stop offset="1" stopColor={m.ceramic.core} />
        </linearGradient>
        <linearGradient id="bw2-bounce" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0.45" stopColor={m.ceramic.bounce} stopOpacity="0" />
          <stop offset="1" stopColor={m.ceramic.bounce} stopOpacity="0.62" />
        </linearGradient>
        <linearGradient id="bw2-top" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#FFFFFF" stopOpacity={0.55 * gloss} />
          <stop offset="0.3" stopColor="#FFFFFF" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="bw2-band" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor={derived.tomatoLight} /><stop offset="0.4" stopColor={palette.tomato} /><stop offset="1" stopColor={derived.tomatoDeep} />
        </linearGradient>
        <linearGradient id="bw2-foot" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor={m.ceramic.hi} /><stop offset="0.6" stopColor={m.ceramic.shade} /><stop offset="1" stopColor={m.ceramic.core} />
        </linearGradient>
        <linearGradient id="bw2-wall" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={m.ceramic.core} /><stop offset="0.5" stopColor={m.ceramic.shade} /><stop offset="1" stopColor={m.ceramic.base} />
        </linearGradient>
        <radialGradient id="bw2-broth" cx="0.4" cy="0.35" r="0.8">
          <stop offset="0" stopColor={m.broth.hi} /><stop offset="0.45" stopColor={m.broth.light} /><stop offset="0.8" stopColor={m.broth.base} /><stop offset="1" stopColor={m.broth.shade} />
        </radialGradient>
        <clipPath id="bw2-body-clip"><path d={BODY} /></clipPath>
        <clipPath id="bw2-mound-clip">
          <path d={surfacePath} />
          <rect x="84" y="70" width="432" height={Math.max(10, cy - 70)} />
        </clipPath>
      </defs>

      {/* contact + ambient shadow */}
      <ellipse cx="302" cy="452" rx="250" ry="26" fill="rgba(70,36,14,0.32)" filter="url(#bw2-blur)" />
      <ellipse cx="300" cy="448" rx="172" ry="12" fill={m.wood.core} opacity={0.5} />
      {/* foot ring */}
      <path d="M176,414 L424,414 L412,450 Q300,466 188,450Z" fill="url(#bw2-foot)" {...ink} />
      <path d="M190,432 Q300,448 410,432" fill="none" stroke={m.ceramic.core} strokeWidth={3} opacity={0.6} />
      {/* body */}
      <path d={BODY} fill="url(#bw2-body)" {...ink} />
      <g clipPath="url(#bw2-body-clip)">
        <rect x="30" y="170" width="540" height="270" fill="url(#bw2-bounce)" />
        <rect x="30" y="170" width="540" height="150" fill="url(#bw2-top)" />
        {/* band with pinstripes */}
        <path d="M30,246 Q300,310 570,246 L570,298 Q300,366 30,298Z" fill="url(#bw2-band)" />
        <path d="M30,246 Q300,310 570,246" fill="none" stroke={derived.outline} strokeWidth={3.2} />
        <path d="M30,298 Q300,366 570,298" fill="none" stroke={derived.outline} strokeWidth={3.2} />
        <path d="M30,232 Q300,296 570,232" fill="none" stroke={m.ceramic.hi} strokeWidth={4} opacity={0.9} />
        <path d="M30,312 Q300,380 570,312" fill="none" stroke={m.ceramic.hi} strokeWidth={4} opacity={0.9} />
        <path d="M30,260 Q300,324 570,260 L570,276 Q300,342 30,276Z" fill="#FFFFFF" opacity={0.14} />
        {/* glaze reflections */}
        <path d="M70,196 C80,296 130,372 190,398 C122,352 84,282 80,196Z" fill="#FFFFFF" opacity={0.75 * gloss} />
        <path d="M96,210 C100,260 118,306 140,336" fill="none" stroke="#FFFFFF" strokeWidth={4} strokeLinecap="round" opacity={0.7 * gloss} />
        <path d="M430,236 C506,264 526,304 508,346 C540,304 526,250 474,226Z" fill={derived.outline} opacity={0.08} />
      </g>
      {/* rim lip */}
      <ellipse cx="300" cy="170" rx="250" ry="56" fill={m.ceramic.hi} {...ink} />
      <ellipse cx="300" cy="173" rx="236" ry="48" fill="url(#bw2-wall)" stroke={m.ceramic.shade} strokeWidth={3} />
      <path d="M64,176 A236,48 0 0 1 536,176 A236,30 0 0 0 64,176Z" fill={m.ceramic.core} opacity={0.5} />
      <path d="M70,142 Q150,106 270,102" fill="none" stroke="#FFFFFF" strokeWidth={9} strokeLinecap="round" opacity={0.85 * gloss} />
      <path d="M336,104 Q440,110 516,146" fill="none" stroke="#FFFFFF" strokeWidth={5} strokeLinecap="round" opacity={0.5 * gloss} />

      {/* broth */}
      <path d={surfacePath} fill="url(#bw2-broth)" {...inkThin} />
      {[0.55, 0.78].map((k, i) => <ellipse key={i} cx={cx - 14} cy={cy - 6} rx={rx * k} ry={ry * k} fill="none" stroke={m.broth.hi} strokeWidth={2.4} opacity={0.4 * (1 - bloom * 0.6)} />)}
      <path d={`M${cx - rx * 0.7},${cy - ry * 0.45} Q${cx - rx * 0.2},${cy - ry * 0.85} ${cx + rx * 0.2},${cy - ry * 0.7}`} fill="none" stroke="#FFFFFF" strokeWidth={6} strokeLinecap="round" opacity={0.4 * gloss} />
      {Array.from({length: 16}).map((_, i) => {
        const a = hash(i) * 6.28 + f * 0.003 * (i % 3), r = Math.sqrt(hash(i + 20)) * 0.86;
        const x = cx + Math.cos(a) * rx * r, y = cy + Math.sin(a) * ry * r;
        const kind = i % 4;
        return kind === 0 ? <rect key={i} x={x} y={y} width={7} height={3.4} transform={`rotate(${hash(i) * 180} ${x} ${y})`} fill={m.chili.base} opacity={0.85 * (1 - bloom * 0.5)} /> : kind === 1 ? <circle key={i} cx={x} cy={y} r={3.2} fill={m.leaf.light} opacity={0.9 * (1 - bloom * 0.5)} /> : kind === 2 ? <circle key={i} cx={x} cy={y} r={4} fill="none" stroke="#FFF3D0" strokeWidth={1.6} opacity={0.7 * (1 - bloom * 0.6)} /> : <ellipse key={i} cx={x} cy={y} rx={9} ry={2.6} fill={m.broth.hi} opacity={0.7 * (1 - bloom * 0.6)} />;
      })}

      {/* noodle mound: 46 layered strands, 3 strokes each (shadow / body / highlight) */}
      <g clipPath="url(#bw2-mound-clip)">
        {bloom > 0.02 && <ellipse cx={cx} cy={cy + 8} rx={rx * 0.9} ry={ry * 0.8} fill={m.broth.core} opacity={0.45 * Math.min(1, bloom)} />}
        {strands.map((s, i) => (
          <g key={i} opacity={Math.min(1, bloom * 2.2)}>
            <path d={s.d} fill="none" stroke={m.noodle.core} strokeWidth={18} strokeLinecap="round" transform="translate(0,4.5)" opacity={0.8} />
            <path d={s.d} fill="none" stroke={m.noodle.shade} strokeWidth={15} strokeLinecap="round" />
            <path d={s.d} fill="none" stroke={tones[s.tone]} strokeWidth={11.5} strokeLinecap="round" />
            <path d={s.d} fill="none" stroke={m.noodle.hi} strokeWidth={3.4} strokeLinecap="round" opacity={0.9} transform="translate(-1.6,-3)" />
          </g>
        ))}
        {bloom > 0.3 && Array.from({length: 7}).map((_, i) => <ellipse key={i} cx={cx + (hash(i + 50) - 0.5) * rx * 1.3} cy={cy - 6 + (hash(i + 60) - 0.5) * ry} rx={9} ry={3} fill={m.broth.hi} opacity={0.55} />)}
      </g>
    </Illustration>
  );
};
