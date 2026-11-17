import React from 'react';
import {useCurrentFrame} from 'remotion';
import {Illustration} from '../illustrations/Illustration';
import {derived, palette} from '../visual-system/ColorPalette';
import {ink, inkThin} from '../visual-system/IllustrationStyle';
import {lerp, smoothClosed, smoothOpen, hash, Pt} from './math';

export const BOWL_VB = {w: 600, h: 480};

export type DynBowlProps = {
  size?: number;
  /** liquid level 0..1 */
  fill?: number;
  /** surface wave amplitude (0..1) */
  wave?: number;
  /** noodles blooming on the surface 0..1 */
  noodle?: number;
  sx?: number;
  sy?: number;
};

/** Dynamic ceramic bowl: gradients, animated liquid surface, procedural noodle strands. Everything is a function of props + frame. */
export const DynBowl: React.FC<DynBowlProps> = ({size = 820, fill = 0.7, wave = 0, noodle = 0, sx = 1, sy = 1}) => {
  const f = useCurrentFrame();
  const cx = 300;
  const cy = lerp(214, 178, fill);
  const rx = lerp(206, 232, fill);
  const ry = lerp(36, 47, fill);
  // liquid surface blob with travelling ripple
  const N = 28;
  const surface: Pt[] = Array.from({length: N}, (_, i) => {
    const a = (i / N) * Math.PI * 2;
    const r = 1 + wave * 0.07 * Math.sin(a * 3 - f * 0.75) + wave * 0.04 * Math.sin(a * 5 + f * 0.9);
    return [cx + Math.cos(a) * rx * r, cy + Math.sin(a) * ry * r + wave * 5 * Math.sin(a * 2 + f * 0.8)];
  });
  const surfacePath = smoothClosed(surface);
  // noodle strands: wavy curves across the surface, amplitude blooms with `noodle`
  const strands = Array.from({length: 24}).map((_, i) => {
    const row = i / 23;
    const yy = cy + (row - 0.5) * ry * 1.7;
    const half = rx * Math.sqrt(Math.max(0, 1 - Math.pow((row - 0.5) * 1.75, 2))) * 0.98;
    const amp = noodle * (9 + 8 * hash(i)) + 1.5;
    const ph = hash(i + 3) * 6.28 + f * (0.045 + 0.02 * hash(i));
    const pts: Pt[] = Array.from({length: 9}, (_, k) => {
      const u = k / 8;
      const x = cx - half + u * half * 2;
      const lift = noodle * Math.sin(u * Math.PI) * (10 + 9 * hash(i + 9));
      return [x, yy - lift + Math.sin(u * 9 + ph) * amp * 0.6 + Math.sin(u * 4 - ph * 1.3) * amp * 0.5];
    });
    return smoothOpen(pts);
  });
  const moundRy = noodle * 46;

  return (
    <Illustration vbW={BOWL_VB.w} vbH={BOWL_VB.h} size={size} style={{transform: `scale(${sx}, ${sy})`, transformOrigin: '50% 94%'}}>
      <defs>
        <linearGradient id="dbowl-body" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#FFFFFF" />
          <stop offset="0.35" stopColor={derived.white} />
          <stop offset="0.78" stopColor="#ECE2D0" />
          <stop offset="1" stopColor="#CDBFA7" />
        </linearGradient>
        <linearGradient id="dbowl-band" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor={derived.tomatoLight} />
          <stop offset="0.45" stopColor={palette.tomato} />
          <stop offset="1" stopColor={derived.tomatoDeep} />
        </linearGradient>
        <radialGradient id="dbowl-broth" cx="0.45" cy="0.4" r="0.75">
          <stop offset="0" stopColor="#E3A85E" />
          <stop offset="0.7" stopColor={derived.broth} />
          <stop offset="1" stopColor="#9C5A28" />
        </radialGradient>
        <linearGradient id="dbowl-inner" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#C9BCA5" />
          <stop offset="1" stopColor="#F1E9DA" />
        </linearGradient>
        <linearGradient id="dbowl-noodle" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#F6D88E" />
          <stop offset="1" stopColor={derived.noodleDeep} />
        </linearGradient>
        <clipPath id="dbowl-body-clip">
          <path d="M50,170 C58,330 150,420 230,424 L370,424 C450,420 542,330 550,170 A250,56 0 0 1 50,170Z" />
        </clipPath>
        <clipPath id="dbowl-liquid-clip">
          <path d={surfacePath} />
        </clipPath>
      </defs>
      {/* soft contact shadow */}
      <ellipse cx="300" cy="448" rx={230} ry={20} fill={derived.shadow} />
      <ellipse cx="300" cy="448" rx={170} ry={12} fill="rgba(32,42,54,0.12)" />
      {/* foot */}
      <path d="M176,418 L424,418 L410,452 Q300,466 190,452Z" fill="url(#dbowl-body)" {...ink} />
      {/* body */}
      <path d="M50,170 C58,330 150,420 230,424 L370,424 C450,420 542,330 550,170 A250,56 0 0 1 50,170Z" fill="url(#dbowl-body)" {...ink} />
      <g clipPath="url(#dbowl-body-clip)">
        <path d="M30,252 Q300,316 570,252 L570,296 Q300,364 30,296Z" fill="url(#dbowl-band)" />
        <path d="M30,252 Q300,316 570,252" fill="none" stroke={derived.outline} strokeWidth={3.5} />
        <path d="M30,296 Q300,364 570,296" fill="none" stroke={derived.outline} strokeWidth={3.5} />
        <path d="M70,196 C80,296 130,372 188,396 C120,350 84,280 80,196Z" fill="#FFFFFF" opacity={0.55} />
        <path d="M420,230 C500,260 520,300 500,340 C530,300 520,250 470,226Z" fill={derived.outline} opacity={0.07} />
      </g>
      {/* rim */}
      <ellipse cx="300" cy="170" rx="250" ry="56" fill="url(#dbowl-inner)" {...ink} />
      <ellipse cx="300" cy="174" rx="232" ry="46" fill="#B9AA92" opacity={0.55} />
      {/* liquid */}
      <path d={surfacePath} fill="url(#dbowl-broth)" {...inkThin} />
      {Array.from({length: 9}).map((_, i) => {
        const a = hash(i) * 6.28, r = Math.sqrt(hash(i + 20)) * 0.8;
        return <ellipse key={i} cx={cx + Math.cos(a) * rx * r} cy={cy + Math.sin(a) * ry * r} rx={7 + 6 * hash(i + 4)} ry={2.6} fill="#F2C887" opacity={0.55 * (1 - noodle * 0.7)} />;
      })}
      <g clipPath="url(#dbowl-liquid-clip)">
        {moundRy > 1 && <ellipse cx={cx} cy={cy - moundRy * 0.4} rx={rx * 0.9} ry={moundRy + ry * 0.7} fill="url(#dbowl-noodle)" />}
        {strands.map((d, i) => (
          <g key={i}>
            <path d={d} fill="none" stroke={derived.noodleDeep} strokeWidth={11} strokeLinecap="round" opacity={0.9} transform="translate(0,3)" />
            <path d={d} fill="none" stroke={i % 2 ? '#F2D184' : '#EFC96F'} strokeWidth={8} strokeLinecap="round" opacity={0.5 + 0.5 * Math.min(1, noodle * 1.6)} />
          </g>
        ))}
      </g>
      {/* rim highlight */}
      <path d="M92,150 Q160,116 260,112" fill="none" stroke="#FFFFFF" strokeWidth={9} strokeLinecap="round" opacity={0.75} />
      <path d="M332,114 Q430,118 500,152" fill="none" stroke="#FFFFFF" strokeWidth={5} strokeLinecap="round" opacity={0.45} />
    </Illustration>
  );
};
