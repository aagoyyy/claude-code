import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {clock} from '../rig/clock';
import {CamCtx} from './lib';
import {REG} from './Still';
import {SHOTS} from './shots';

export const FILM_FPS = 12;
const XF = 6; // crossfade frames
const starts: number[] = [];
let acc = 0;
SHOTS.forEach((s) => { starts.push(acc); acc += s.dur * FILM_FPS; });
export const FILM_FRAMES = acc;
export const shotStart = (id: string) => starts[SHOTS.findIndex((s) => s.id === id)];

const hash = (id: string) => { let h = 7; for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) >>> 0; return h; };

const ShotView: React.FC<{id: string; local: number; len: number; op: number}> = ({id, local, len, op}) => {
  clock.t = Math.max(0.0001, local / FILM_FPS); clock.dur = len / FILM_FPS;
  const C = REG[id];
  const p = Math.min(1, local / Math.max(1, len));
  const e = p * p * (3 - 2 * p);
  const kind = hash(id) % 5;
  const zoom = kind === 0 ? 1 + 0.07 * e : kind === 1 ? 1.07 - 0.07 * e : 1.035 + 0.01 * e;
  const camx = kind === 2 ? -60 + 120 * e : kind === 3 ? 60 - 120 * e : (kind === 4 ? -24 + 48 * e : 0);
  return (
    <AbsoluteFill style={{opacity: op}}>
      <div style={{position: 'absolute', inset: 0, transform: `scale(${zoom})`, transformOrigin: '50% 58%'}}>
        <CamCtx.Provider value={{x: camx, y: 0, zoom: 1}}>{C ? <C /> : null}</CamCtx.Provider>
      </div>
    </AbsoluteFill>
  );
};

export const Film: React.FC = () => {
  const f = useCurrentFrame();
  const out: React.ReactNode[] = [];
  for (let i = 0; i < SHOTS.length; i++) {
    const a = starts[i], len = SHOTS[i].dur * FILM_FPS, b = a + len;
    if (f >= a - 0 && f < b + XF) {
      const local = f - a;
      const op = i === 0 ? 1 : Math.min(1, (f - a + 1) / XF);
      out.push(<ShotView key={SHOTS[i].id} id={SHOTS[i].id} local={local} len={len} op={op} />);
    }
  }
  const fadeIn = Math.min(1, f / 12), fadeOut = Math.min(1, (FILM_FRAMES - f) / 24);
  return <AbsoluteFill style={{background: '#000'}}>{out}<AbsoluteFill style={{background: '#000', opacity: 1 - Math.min(fadeIn, fadeOut)}} /></AbsoluteFill>;
};
