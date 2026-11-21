import React from 'react';
import {Spec} from '../fx/Battle';
import {askari, dervish, dervishRifle, heroPith, officer} from './SomaliA';
import {ProfileBattle} from './ProfileBattle';
import {kf} from '../rig/pose';

const heroSpec = (extra: Partial<Spec> = {}): Spec => ({id: 'hero', o: {...heroPith('right'), gear: 'rifle'}, x: 900, y: 935, s: 0.567, face: 'right', mode: 'run', fixed: true, ...extra});
// defenders on the fort wall (far layer, world coordinates), firing down at the column
const defenders = (aim: (f: number) => [number, number], from = 4): Spec[] => [-70, 10, 90, 170, 250].map((lx, i) => ({id: `df${i}`, o: dervishRifle('left'), x: 1450 + lx * 0.82, y: 700 - 130 * 0.82 + 2, s: 0.045, face: 'left' as const, mode: 'aim' as const, fireFrom: from + i * 4, period: 14, aim, lo: true}));
const runner = (id: string, x: number, die: number | undefined, s = 0.3, y = 850): Spec => ({id, o: dervish('left'), x, y, s, face: 'left', mode: 'run', vx: -9, stopAt: die, dieAt: die, lo: true});

/* shot 1: the column advances on the fort while dervishes pour out of the gate and are shot down */
export const SomaliShot1: React.FC = () => (
  <ProfileBattle
    kind="desert" frames={132} fadeIn
    T={(f) => f * 13}
    caption={{title: 'SOMALILAND', sub: '1914', from: 10, to: 100}}
    shake={[{t: 70, a: 7}, {t: 104, a: 7}]}
    far={{specs: defenders(() => [880 + (((Math.round(Math.random() * 0)) * 1)) , 925], 4)}}
    mid={{specs: [
      runner('d1', 1750, 62), runner('d2', 1900, 80), runner('d3', 2050, 96), runner('d4', 2200, undefined), runner('d5', 2350, 118),
      {id: 'k1', o: askari('right'), x: 500, y: 846, s: 0.3, face: 'right', mode: 'run', vx: 6.5, stopAt: 34, after: 'kneelAim', fireFrom: 40, period: 12, aim: (f) => [1500 - (f - 40) * 9, 840], lo: true},
      {id: 'k2', o: askari('right'), x: 380, y: 850, s: 0.3, face: 'right', mode: 'run', vx: 6.5, stopAt: 48, after: 'kneelAim', fireFrom: 54, period: 11, aim: (f) => [1500 - (f - 40) * 9, 840], lo: true},
    ]}}
    back={{specs: [
      {id: 'a1', o: officer('right'), x: 640, y: 896, s: 0.44, face: 'right', mode: 'run', vx: 13 * 0.78, lo: true},
      {id: 'a2', o: askari('right'), x: 450, y: 896, s: 0.44, face: 'right', mode: 'run', vx: 13 * 0.78, stopAt: 56, after: 'kneelAim', fireFrom: 62, period: 12, aim: (f) => [1650 - (f - 40) * 9, 880], lo: true},
      {id: 'a3', o: askari('right'), x: 260, y: 896, s: 0.44, face: 'right', mode: 'run', vx: 13 * 0.78, stopAt: 84, dieAt: 84, lo: true},
    ]}}
    hero={{
      specs: [heroSpec()],
      volleys: [{x0: 1650, y0: 600, x1: 950, y1: 928, t0: 6, every: 8, spread: 380, seed: 3, w: 3, r: 26}],
    }}
  />
);

/* shot 3: after the shot — hero staggers with a hand to his face, an askari steadies him, dervishes retreat and fall */
export const SomaliShot3: React.FC = () => (
  <ProfileBattle
    kind="desert" frames={132} fadeOut
    T={() => 0}
    zoom={(f) => 1.02 + f * 0.0006}
    shake={[{t: 20, a: 5}]}
    far={{specs: defenders(() => [880, 925], 0)}}
    mid={{specs: [
      {id: 'k1', o: askari('right'), x: 1100, y: 846, s: 0.3, face: 'right', mode: 'kneelAim', fireFrom: 4, period: 11, aim: () => [1500, 840], lo: true},
      {id: 'k2', o: askari('right'), x: 1240, y: 850, s: 0.3, face: 'right', mode: 'kneelAim', fireFrom: 8, period: 12, aim: () => [1500, 840], lo: true},
      {...runner('d1', 1700, undefined), mode: 'run', vx: 0, x: 1700, face: 'left', o: dervish('left'), dieAt: 26},
      {...runner('d2', 1850, undefined), vx: 0, dieAt: 52},
    ]}}
    back={{specs: [
      {id: 'a1', o: officer('right'), x: 180, y: 896, s: 0.44, face: 'right', mode: 'aim', fireFrom: 6, period: 13, aim: () => [1500, 880], lo: true},
      {id: 'a2', o: askari('right'), x: 1500, y: 896, s: 0.44, face: 'right', mode: 'kneelAim', fireFrom: 3, period: 12, aim: () => [1800, 880], lo: true},
    ]}}
    hero={{
      specs: [
        heroSpec({
          mode: 'idle', x: 950, hero: true,
          o: {...heroPith('right'), gear: 'none', patch: true, scars: true},
          pose: (f, b) => {
            const k = kf(f, [[0, 0], [10, 1], [100, 1], [130, 0.7]]);
            return {...b, head: (b.head || 0) - 14 * k, torso: (b.torso || 0) - 7 * k, uaN: -110 * k + (b.uaN || 0) * (1 - k), faN: -125 * k + (b.faN || 0) * (1 - k), dy: (b.dy || 0) + 4 * Math.sin(f * 0.3) * k};
          },
        } as Partial<Spec>),
        {id: 'helper', o: askari('right', 'rifle'), x: 120, y: 935, s: 0.567, face: 'right', mode: 'run', vx: 11, stopAt: 62, after: 'idle', fixed: true},
        {id: 'guard', o: officer('left'), x: 1360, y: 935, s: 0.567, face: 'right', mode: 'aim', fireFrom: 5, period: 12, aim: () => [1700, 800], fixed: true, lo: false},
      ],
      volleys: [{x0: 1650, y0: 600, x1: 1000, y1: 928, t0: 6, every: 9, spread: 420, seed: 8, w: 3, r: 26}],
    }}
  />
);
