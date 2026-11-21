import React from 'react';
import {Spec} from '../fx/Battle';
import {german, heroTrench, tommyW1} from './YpresA';
import {mob, talk} from '../fx/Battle';
import {kf} from '../rig/pose';
import {ProfileBattle} from './ProfileBattle';

const germans = (aim: (f: number) => [number, number], from = 4): Spec[] => [1010, 1090, 1180, 1290, 1380].map((x, i) => ({id: `gm${i}`, o: german('left'), x, y: 784 - (i % 2) * 5, s: 0.17, face: 'left' as const, mode: 'aim' as const, fireFrom: from + i * 4, period: 13, aim, lo: true}));

/* shot 1: trench raid — soldiers return fire over the parapet, shells land in no-man's land, a man falls */
export const YpresShot1: React.FC = () => (
  <ProfileBattle
    kind="trench" frames={132}
    T={(f) => f * 9}
    caption={{title: 'YPRES, BELGIA', sub: '1915 · Perang Dunia I', from: 10, to: 100}}
    shake={[{t: 36, a: 12}, {t: 78, a: 14}, {t: 112, a: 10}]}
    zoom={(f) => kf(f, [[0, 0.78], [50, 1.0], [132, 1.05]])}
    roll={(f) => [36, 78, 112].reduce((a, t) => a + (f >= t ? (t === 78 ? 2.8 : 1.6) * Math.exp(-(f - t) / 12) : 0), 0)}
    flash={(f) => [36, 78, 112].reduce((a, t) => a + (f >= t && f < t + 8 ? Math.exp(-(f - t) / 2) : 0), 0)}
    bagHits={[{x: 1666, t: 36}, {x: 2276, t: 78}, {x: 2126, t: 112}]}
    focus={(f) => kf(f, [[0, 1.6], [36, 1.0], [100, 0.5], [132, 1.0]])}
    far={{specs: [...germans(() => [900, 760]), ...mob('gx', 10, {id: 'x', o: german('left'), x: 0, y: 784, s: 0.15, face: 'left', mode: 'aim', fireFrom: 6, period: 12, aim: () => [900, 760], lo: true}, {x0: 1000, dx: 60, jx: 30, dy: 6, seed: 7})]}}
    mid={{
      specs: [
        {id: 'r1', o: tommyW1('right'), x: 640, y: 846, s: 0.3, face: 'right', mode: 'run', vx: 4.5, stopAt: 60, dieAt: 60, die: 'stumble' as const, lo: false},
        {id: 'r2', o: tommyW1('right', '#c89870'), x: 500, y: 850, s: 0.3, face: 'right', mode: 'run', vx: 4.5, lo: true, flinch: [78]},
        {id: 'r3', o: tommyW1('right'), x: 360, y: 848, s: 0.3, face: 'right', mode: 'run', vx: 4.5, stopAt: 90, after: 'kneelAim', fireFrom: 96, period: 12, aim: () => [1250, 790], lo: true},
      ],
      booms: [{x: 1400 + 9 * 36 * 0.5, y: 850, t: 36, r: 70}, {x: 1700 + 9 * 78 * 0.5, y: 850, t: 78, r: 80}, {x: 1300 + 9 * 112 * 0.5, y: 850, t: 112, r: 70}],
    }}
    back={{specs: [
      {id: 'p1', o: tommyW1('right'), x: 260, y: 930, s: 0.46, face: 'right', mode: 'aim', fireFrom: 5, period: 12, aim: () => [1250, 790], lo: true},
      {id: 'p2', o: tommyW1('right', '#c89870'), x: 470, y: 930, s: 0.46, face: 'right', mode: 'aim', fireFrom: 9, period: 13, aim: () => [1250, 790], lo: false, dieAt: 84, die: 'back' as const},
      {id: 'p3', o: tommyW1('right'), x: 1500, y: 930, s: 0.46, face: 'right', mode: 'aim', fireFrom: 3, period: 11, aim: () => [1300, 790], lo: true, flinch: [78]},
      {id: 'p4', o: tommyW1('right', '#c89870'), x: 1720, y: 930, s: 0.46, face: 'right', mode: 'aim', fireFrom: 12, period: 12, aim: () => [1300, 790], lo: true},
    ]}}
    hero={{
      specs: [{id: 'hero', o: {...heroTrench('right'), gear: 'rifle'}, x: 900, y: 935, s: 0.567, face: 'right', mode: 'walk', fixed: true, pose: (f, b) => ({...b, dy: (b.dy || 0) + 6, torso: (b.torso || 0) + 6, mouth: talk(f, 8, 84), brow: -0.5, grimace: 0.4 * (f > 78 ? 1 : 0)})}],
      volleys: [{x0: 1500, y0: 760, x1: 940, y1: 928, t0: 8, every: 9, spread: 360, seed: 6, w: 3, r: 24}],
    }}
  />
);
