import React from 'react';
import {Spec} from '../fx/Battle';
import {boer, heroYoung, tommy} from './BoerA';
import {ProfileBattle} from './ProfileBattle';
import {kf} from '../rig/pose';

const heroSpec = (extra: Partial<Spec> = {}): Spec => ({id: 'hero', o: {...heroYoung('right'), gear: 'rifle'}, x: 900, y: 935, s: 0.567, face: 'right', mode: 'run', fixed: true, ...extra});
// Boer marksmen hidden behind the kopje: fire along the skirmish line
const enemies = (aimAt: (f: number) => [number, number], from = 6): Spec[] => [1700, 1790, 1880, 1610].map((x, i) => ({id: `bm${i}`, o: boer('left'), x, y: 790 - (i % 2) * 6, s: 0.17, face: 'left' as const, mode: 'aim' as const, fireFrom: from + i * 5, period: 15, aim: aimAt, lo: true}));

/* shot 1: the British skirmish line charges the kopje under rifle fire and a shell burst */
export const BoerShot1: React.FC = () => (
  <ProfileBattle
    kind="savanna" frames={132} fadeIn
    T={(f) => f * 14}
    caption={{title: 'AFRIKA SELATAN', sub: '1899 · Perang Boer', from: 10, to: 100}}
    shake={[{t: 92, a: 11}]}
    far={{specs: enemies((f) => [820 + ((f * 53) % 9) * 36, 925], 4)}}
    mid={{specs: [
      {id: 'k1', o: tommy('right'), x: 560, y: 846, s: 0.3, face: 'right', mode: 'run', vx: 7, stopAt: 46, after: 'kneelAim', fireFrom: 52, period: 12, aim: () => [1330, 640], lo: true},
      {id: 'k2', o: tommy('right', '#c89870'), x: 420, y: 850, s: 0.3, face: 'right', mode: 'run', vx: 7, stopAt: 60, after: 'kneelAim', fireFrom: 66, period: 11, aim: () => [1330, 640], lo: true},
      {id: 'k3', o: tommy('right'), x: 760, y: 842, s: 0.3, face: 'right', mode: 'run', vx: 7, stopAt: 38, after: 'kneelAim', fireFrom: 44, period: 13, aim: () => [1330, 640], lo: true, flinch: [95]},
    ]}}
    back={{
      specs: [
        {id: 'a1', o: tommy('right'), x: 640, y: 896, s: 0.44, face: 'right', mode: 'run', vx: 14 * 0.78, lo: true, flinch: [95]},
        {id: 'a2', o: tommy('right', '#c89870'), x: 440, y: 896, s: 0.44, face: 'right', mode: 'run', vx: 14 * 0.78, lo: true, flinch: [95]},
        {id: 'a3', o: tommy('right'), x: 250, y: 896, s: 0.44, face: 'right', mode: 'run', vx: 14 * 0.78, stopAt: 74, dieAt: 74, lo: true},
        {id: 'a4', o: tommy('right'), x: 790, y: 892, s: 0.44, face: 'right', mode: 'run', vx: 14 * 0.78, lo: true},
      ],
      booms: [{x: 1500 + 14 * 92 * 0.78, y: 905, t: 92, r: 80}],
    }}
    hero={{
      specs: [heroSpec()],
      volleys: [{x0: 1780, y0: 640, x1: 960, y1: 928, t0: 6, every: 9, spread: 380, seed: 2, w: 3, r: 26}],
    }}
  />
);

/* shot 3: aftermath, same battlefield — hero kneels clutching his belly while comrades return fire */
export const BoerShot3: React.FC = () => (
  <ProfileBattle
    kind="savanna" frames={132} fadeOut
    T={() => 0}
    zoom={(f) => 1.02 + f * 0.0006}
    shake={[{t: 38, a: 8}]}
    far={{specs: enemies(() => [800, 915], 0)}}
    mid={{specs: [
      {id: 'k1', o: tommy('right'), x: 1120, y: 846, s: 0.3, face: 'right', mode: 'kneelAim', fireFrom: 4, period: 11, aim: () => [1330, 640], lo: true},
      {id: 'k2', o: tommy('right', '#c89870'), x: 1260, y: 850, s: 0.3, face: 'right', mode: 'kneelAim', fireFrom: 10, period: 12, aim: () => [1330, 640], lo: true},
      {id: 'k3', o: tommy('right'), x: 980, y: 846, s: 0.3, face: 'right', mode: 'kneelAim', fireFrom: 8, period: 13, aim: () => [1330, 640], dieAt: 60, lo: true},
    ]}}
    back={{
      specs: [
        {id: 'a1', o: tommy('right'), x: 130, y: 896, s: 0.44, face: 'right', mode: 'kneelAim', fireFrom: 6, period: 12, aim: () => [1400, 700], lo: true},
        {id: 'a2', o: tommy('right', '#c89870'), x: 1560, y: 896, s: 0.44, face: 'left', mode: 'aim', fireFrom: 3, period: 13, aim: () => [1900, 700], lo: true, dieAt: 84},
        {id: 'a3', o: tommy('right'), x: 1320, y: 900, s: 0.44, face: 'right', mode: 'idle', dieAt: 0, lo: true},
      ],
      booms: [{x: 1580, y: 905, t: 38, r: 90}],
    }}
    hero={{
      specs: [
        heroSpec({
          mode: 'kneel', fixed: true, x: 1000,
          pose: (f, b) => {
            const k = kf(f, [[0, 0], [14, 1], [90, 1], [120, 0.6]]);
            return {...b, torso: (b.torso || 0) + 24 * k, head: (b.head || 0) + 22 * k, uaN: -30 * k + (b.uaN || 0) * (1 - k), faN: -105 * k + (b.faN || 0) * (1 - k), uaF: -34 * k + (b.uaF || 0) * (1 - k), faF: -100 * k + (b.faF || 0) * (1 - k), dy: (b.dy || 0)};
          },
        }),
        // comrade runs in from the left and kneels beside him; another stands guard firing
        {id: 'helper', o: tommy('right'), x: 100, y: 935, s: 0.567, face: 'right', mode: 'run', vx: 12, stopAt: 44, after: 'kneel', fixed: true},
        {id: 'stand', o: tommy('right', '#c89870'), x: 330, y: 935, s: 0.567, face: 'right', mode: 'aim', fireFrom: 6, period: 12, aim: () => [1450, 760], fixed: true},
      ],
      volleys: [{x0: 1780, y0: 640, x1: 1060, y1: 928, t0: 6, every: 10, spread: 420, seed: 5, w: 3, r: 26}],
    }}
  />
);
