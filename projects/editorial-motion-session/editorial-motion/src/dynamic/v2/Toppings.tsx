import React from 'react';
import {Illustration} from '../../illustrations/Illustration';
import {materials as m, derived, palette} from '../../visual-system/ColorPalette';
import {ink, inkThin} from '../../visual-system/IllustrationStyle';
import {hash} from '../math';

/** Half boiled egg with glossy yolk. viewBox 240x210 */
export const EggHalf: React.FC<{size?: number}> = ({size = 240}) => (
  <Illustration vbW={240} vbH={210} size={size}>
    <defs>
      <radialGradient id="eg-white" cx="0.35" cy="0.28" r="0.85">
        <stop offset="0" stopColor={m.eggWhite.hi} />
        <stop offset="0.55" stopColor={m.eggWhite.base} />
        <stop offset="1" stopColor={m.eggWhite.shade} />
      </radialGradient>
      <radialGradient id="eg-yolk" cx="0.38" cy="0.3" r="0.8">
        <stop offset="0" stopColor={m.yolk.hi} />
        <stop offset="0.5" stopColor={m.yolk.base} />
        <stop offset="1" stopColor={m.yolk.shade} />
      </radialGradient>
      <clipPath id="eg-clip"><path d="M24,112 C20,50 70,18 120,18 C170,18 220,50 216,112 C212,162 170,192 120,192 C70,192 28,162 24,112Z" /></clipPath>
    </defs>
    <ellipse cx="124" cy="200" rx="92" ry="9" fill="rgba(70,36,14,0.28)" />
    <path d="M24,112 C20,50 70,18 120,18 C170,18 220,50 216,112 C212,162 170,192 120,192 C70,192 28,162 24,112Z" fill="url(#eg-white)" {...ink} />
    <g clipPath="url(#eg-clip)">
      <path d="M24,112 C28,170 70,196 120,196 C176,196 214,160 218,112 C206,168 170,184 120,184 C70,184 34,166 24,112Z" fill={m.eggWhite.core} opacity={0.35} />
      <path d="M44,60 C60,36 96,26 130,28" fill="none" stroke="#FFFFFF" strokeWidth={9} strokeLinecap="round" opacity={0.85} />
    </g>
    <ellipse cx="128" cy="118" rx="54" ry="50" fill={m.eggWhite.core} opacity={0.35} />
    <circle cx="120" cy="108" r="52" fill="url(#eg-yolk)" {...inkThin} />
    <path d="M78,104 C80,72 108,58 136,62" fill="none" stroke={m.yolk.hi} strokeWidth={6} strokeLinecap="round" opacity={0.7} />
    <ellipse cx="102" cy="88" rx="15" ry="9" transform="rotate(-28 102 88)" fill="#FFFFFF" opacity={0.9} />
    <ellipse cx="146" cy="136" rx="14" ry="5" transform="rotate(-20 146 136)" fill={m.yolk.core} opacity={0.35} />
  </Illustration>
);

/** Bok choy: layered leaf lobes, veins, pale stalk. viewBox 280x260 */
export const BokChoy: React.FC<{size?: number}> = ({size = 280}) => (
  <Illustration vbW={280} vbH={260} size={size}>
    <defs>
      <linearGradient id="bc-back" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor={m.leaf.light} /><stop offset="0.6" stopColor={m.leaf.base} /><stop offset="1" stopColor={m.leaf.shade} />
      </linearGradient>
      <linearGradient id="bc-front" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor={m.leaf.hi} /><stop offset="0.5" stopColor={m.leaf.light} /><stop offset="1" stopColor={m.leaf.base} />
      </linearGradient>
      <linearGradient id="bc-stalk" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stopColor={m.stalk.hi} /><stop offset="0.6" stopColor={m.stalk.base} /><stop offset="1" stopColor={m.stalk.shade} />
      </linearGradient>
    </defs>
    <ellipse cx="140" cy="248" rx="100" ry="9" fill="rgba(70,36,14,0.25)" />
    <path d="M30,152 C8,72 80,20 152,26 C232,34 274,102 248,162 C228,212 152,230 100,216 C60,206 36,182 30,152Z" fill="url(#bc-back)" {...ink} />
    <path d="M42,160 C30,108 82,66 132,80 C156,126 126,196 72,208 C56,198 46,182 42,160Z" fill="url(#bc-front)" {...ink} />
    <path d="M118,214 C126,246 168,250 184,218 C172,198 142,194 118,214Z" fill="url(#bc-stalk)" {...ink} />
    <path d="M150,212 C150,150 172,92 206,52 M158,206 C176,160 212,128 238,114 M146,200 C128,150 138,112 150,84" fill="none" stroke={m.leaf.core} strokeWidth={3.2} strokeLinecap="round" opacity={0.7} />
    <path d="M60,150 C60,112 92,84 128,90" fill="none" stroke={m.leaf.core} strokeWidth={2.6} strokeLinecap="round" opacity={0.6} />
    <path d="M40,120 C50,60 110,30 170,34" fill="none" stroke={m.leaf.hi} strokeWidth={6} strokeLinecap="round" opacity={0.7} />
    <path d="M214,70 C244,96 252,140 238,176" fill="none" stroke={m.leaf.hi} strokeWidth={4} strokeLinecap="round" opacity={0.45} />
    <path d="M110,216 C104,226 110,238 122,242" fill="none" stroke="#FFFFFF" strokeWidth={4} strokeLinecap="round" opacity={0.7} />
  </Illustration>
);

/** Glossy red chili. viewBox 270x130 */
export const ChiliPepper: React.FC<{size?: number}> = ({size = 270}) => (
  <Illustration vbW={270} vbH={130} size={size}>
    <defs>
      <linearGradient id="ch-body" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor={m.chili.hi} /><stop offset="0.3" stopColor={m.chili.base} /><stop offset="1" stopColor={m.chili.shade} />
      </linearGradient>
    </defs>
    <ellipse cx="140" cy="120" rx="100" ry="7" fill="rgba(70,36,14,0.25)" />
    <path d="M34,44 C110,8 214,28 252,78 C260,92 244,108 230,108 C160,122 70,104 36,74 C20,60 22,50 34,44Z" fill="url(#ch-body)" {...ink} />
    <path d="M34,44 C14,36 12,16 22,8 C34,16 46,30 50,46Z" fill={m.leaf.base} {...ink} />
    <path d="M26,12 C34,22 44,34 48,44" fill="none" stroke={m.leaf.hi} strokeWidth={3} opacity={0.8} />
    <path d="M58,50 C110,30 184,38 226,74" fill="none" stroke="#FFFFFF" strokeWidth={8} strokeLinecap="round" opacity={0.65} />
    <path d="M70,92 C130,104 196,100 236,90" fill="none" stroke={m.chili.core} strokeWidth={5} strokeLinecap="round" opacity={0.35} />
  </Illustration>
);

/** Meatball with a bumpy surface. viewBox 130x130 */
export const Meatball: React.FC<{size?: number}> = ({size = 130}) => (
  <Illustration vbW={130} vbH={130} size={size}>
    <defs>
      <radialGradient id="mb-g" cx="0.35" cy="0.3" r="0.85">
        <stop offset="0" stopColor={m.meat.hi} /><stop offset="0.55" stopColor={m.meat.base} /><stop offset="1" stopColor={m.meat.core} />
      </radialGradient>
    </defs>
    <ellipse cx="66" cy="122" rx="48" ry="7" fill="rgba(70,36,14,0.25)" />
    <circle cx="65" cy="64" r="52" fill="url(#mb-g)" {...ink} />
    {Array.from({length: 14}).map((_, i) => {
      const a = hash(i) * 6.28, r = Math.sqrt(hash(i + 9)) * 40;
      return <circle key={i} cx={65 + Math.cos(a) * r} cy={64 + Math.sin(a) * r} r={2 + hash(i + 2) * 3} fill={m.meat.core} opacity={0.45} />;
    })}
    <path d="M30,46 C36,28 54,18 74,18" fill="none" stroke="#FFFFFF" strokeWidth={8} strokeLinecap="round" opacity={0.5} />
  </Illustration>
);

/** Spring-onion ring. viewBox 60x60 */
export const ScallionRing: React.FC<{size?: number}> = ({size = 56}) => (
  <Illustration vbW={60} vbH={60} size={size} rough={false}>
    <circle cx="30" cy="30" r="24" fill={m.leaf.light} stroke={derived.outline} strokeWidth={3} />
    <circle cx="30" cy="30" r="14" fill={m.stalk.hi} stroke={m.leaf.shade} strokeWidth={2.4} />
    <circle cx="30" cy="30" r="5" fill={m.stalk.base} />
    <path d="M14,20 C18,12 26,8 34,8" fill="none" stroke="#FFFFFF" strokeWidth={3} strokeLinecap="round" opacity={0.7} />
  </Illustration>
);
void palette;
