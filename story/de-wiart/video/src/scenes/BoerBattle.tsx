import React from 'react';
import {Spec} from '../fx/Battle';
import {boer, civilianWoman, heroYoung, horseOfficer, tommy} from './BoerA';
import {mob, talk} from '../fx/Battle';
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
    zoom={(f) => kf(f, [[0, 0.74], [50, 0.98], [132, 1.06]])}
    roll={(f) => (f >= 92 ? 2.4 * Math.exp(-(f - 92) / 14) : 0)}
    far={{specs: [...enemies((f) => [820 + ((f * 53) % 9) * 36, 925], 4), ...mob('fi', 14, {id: 'x', o: tommy('right'), x: 0, y: 770, s: 0.11, face: 'right', mode: 'run', vx: 14 * 0.33 * 0.5, lo: true}, {x0: -160, dx: 70, jx: 40, dy: 8, seed: 3})]}}
    mid={{mounts: [0, 1, 2, 3].map((i) => ({id: 'cv' + i, a: {kind: 'horse' as const, coat: ['#7a4a2a', '#4a3020', '#9a7a52', '#2e2218'][i], mane: '#241810', tack: true}, x: 1500 + i * 210, y: 842 + (i % 2) * 6, s: 0.3, face: 'right' as const, vx: 14 * 0.5 + 2.6, stride: 1.4, phaseOff: i * 1.3, rider: horseOfficer('right'), lo: true})),
    specs: [...mob('inf', 9, {id: 'x', o: tommy('right'), x: 0, y: 850, s: 0.3, face: 'right', mode: 'run', vx: 7, lo: true}, {x0: 120, dx: 120, jx: 70, dy: 14, seed: 5}),
      {id: 'k1', o: tommy('right'), x: 560, y: 846, s: 0.3, face: 'right', mode: 'run', vx: 7, stopAt: 46, after: 'kneelAim', fireFrom: 52, period: 12, aim: () => [1330, 640], lo: true},
      {id: 'k2', o: tommy('right', '#c89870'), x: 420, y: 850, s: 0.3, face: 'right', mode: 'run', vx: 7, stopAt: 60, after: 'kneelAim', fireFrom: 66, period: 11, aim: () => [1330, 640], lo: true},
      {id: 'k3', o: tommy('right'), x: 760, y: 842, s: 0.3, face: 'right', mode: 'run', vx: 7, stopAt: 38, after: 'kneelAim', fireFrom: 44, period: 13, aim: () => [1330, 640], lo: true, flinch: [95]},
      {id: 'w1', o: civilianWoman('left'), x: 1200 + 7 * 90, y: 850, s: 0.3, face: 'left', mode: 'idle', lo: false, flinch: [95], fixed: false},
    ]}}
    back={{
      specs: [
        {id: 'a1', o: {...tommy('right'), bayonet: true}, x: 640, y: 896, s: 0.44, face: 'right', mode: 'run', vx: 14 * 0.78, lo: true, flinch: [95]},
        {id: 'a2', o: {...tommy('right', '#c89870'), bayonet: true}, x: 440, y: 896, s: 0.44, face: 'right', mode: 'run', vx: 14 * 0.78, lo: true, flinch: [95]},
        {id: 'a3', o: tommy('right'), x: 250, y: 896, s: 0.44, face: 'right', mode: 'run', vx: 14 * 0.78, stopAt: 74, dieAt: 74, die: 'stumble' as const, lo: false},
        {id: 'a4', o: tommy('right'), x: 790, y: 892, s: 0.44, face: 'right', mode: 'run', vx: 14 * 0.78, stopAt: 92, dieAt: 92, die: 'blast' as const, lo: false},
      ],
      booms: [{x: 1500 + 14 * 92 * 0.78, y: 905, t: 92, r: 80}],
      mounts: [{id: 'hz1', a: {kind: 'horse', coat: '#7a4a2a', mane: '#241810', tack: true}, x: 1380, y: 900, s: 0.44, face: 'right', vx: 14 * 0.78, stride: 1.25, rider: horseOfficer('right')}],
    }}
    focus={(f) => kf(f, [[0, 1], [40, 1], [80, 0.6], [132, 1]])}
    hero={{
      specs: [heroSpec({pose: (f, b) => ({...b, mouth: talk(f, 14, 70), brow: -0.4, grimace: 0.3})})],
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
      {id: 'k3', o: tommy('right'), x: 980, y: 846, s: 0.3, face: 'right', mode: 'kneelAim', fireFrom: 8, period: 13, aim: () => [1330, 640], dieAt: 60, die: 'forward' as const, lo: false},
    ]}}
    back={{
      specs: [
        {id: 'a1', o: tommy('right'), x: 130, y: 896, s: 0.44, face: 'right', mode: 'kneelAim', fireFrom: 6, period: 12, aim: () => [1400, 700], lo: true},
        {id: 'a2', o: tommy('right', '#c89870'), x: 1560, y: 896, s: 0.44, face: 'left', mode: 'aim', fireFrom: 3, period: 13, aim: () => [1900, 700], lo: false, dieAt: 84, die: 'crawl' as const},
        {id: 'a3', o: tommy('right'), x: 1320, y: 900, s: 0.44, face: 'right', mode: 'idle', dieAt: 0, lo: false, xf: (f: number) => 1320 - f * 0.6},
        {id: 'dr', o: tommy('left'), x: 0, y: 898, s: 0.44, face: 'left', mode: 'walk', phase: 0, xf: (f: number) => 1320 - f * 0.6 - 560, lo: false, pose: (f: number, b: any) => ({...b, uaN: -22, faN: -34, uaF: -26, faF: -30, torso: 8, sling: false})},
      ],
      booms: [{x: 1580, y: 905, t: 38, r: 90}],
    }}
    hero={{
      specs: [
        heroSpec({
          mode: 'kneel', fixed: true, x: 1000,
          pose: (f, b) => {
            const k = kf(f, [[0, 0], [14, 1], [90, 1], [120, 0.6]]);
            return {...b, grimace: k, squint: 0.7 * k, mouth: 0.25 * k * (0.5 + 0.5 * Math.sin(f * 0.5)), brow: -0.8 * k, torso: (b.torso || 0) + 24 * k, head: (b.head || 0) + 22 * k, uaN: -30 * k + (b.uaN || 0) * (1 - k), faN: -105 * k + (b.faN || 0) * (1 - k), uaF: -34 * k + (b.uaF || 0) * (1 - k), faF: -100 * k + (b.faF || 0) * (1 - k), dy: (b.dy || 0)};
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
