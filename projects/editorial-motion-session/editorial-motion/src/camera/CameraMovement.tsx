import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {easings} from '../visual-system/MotionPresets';
import {CANVAS} from '../visual-system/ThemeTokens';

export type CameraKey = {
  frame: number;
  /** zoom (1 = full frame) */
  scale?: number;
  /** world point (canvas px) placed at screen centre */
  x?: number;
  y?: number;
  /** degrees, keep tiny (<= 1.5) */
  rotate?: number;
};

const CX = CANVAS.width / 2;
const CY = CANVAS.height / 2;

/** Resolve a camera state at `frame` from sorted keyframes (bezier ease between each pair, clamped outside). */
export const resolveCamera = (keys: CameraKey[], frame: number, easing: (t: number) => number = easings.inOut) => {
  const ks = keys.map((k) => ({frame: k.frame, scale: k.scale ?? 1, x: k.x ?? CX, y: k.y ?? CY, rotate: k.rotate ?? 0}));
  const frames = ks.map((k) => k.frame);
  const f = (key: 'scale' | 'x' | 'y' | 'rotate') =>
    ks.length === 1 ? ks[0][key] : interpolate(frame, frames, ks.map((k) => k[key]), {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing});
  const rotate = f('rotate');
  // Overscan rule: rotation needs extra scale so canvas corners never show (about +3.5% per degree).
  const scale = Math.max(f('scale'), 1 + Math.abs(rotate) * 0.035);
  // Clamp rule: the visible window must stay inside the 1080x1920 canvas (no black edges).
  const halfW = CX / scale;
  const halfH = CY / scale;
  const x = Math.min(CANVAS.width - halfW, Math.max(halfW, f('x')));
  const y = Math.min(CANVAS.height - halfH, Math.max(halfH, f('y')));
  return {scale, x, y, rotate};
};

export type CameraRigProps = {keys: CameraKey[]; easing?: (t: number) => number; children: React.ReactNode; style?: React.CSSProperties};

/** Scene-level camera: wraps the *world* layer. Captions/UI should sit outside the rig. */
export const CameraRig: React.FC<CameraRigProps> = ({keys, easing, children, style}) => {
  const frame = useCurrentFrame();
  const c = resolveCamera(keys, frame, easing);
  return (
    <AbsoluteFill style={{transformOrigin: '0 0', transform: `translate(${CX}px, ${CY}px) rotate(${c.rotate}deg) scale(${c.scale}) translate(${-c.x}px, ${-c.y}px)`, ...style}}>
      {children}
    </AbsoluteFill>
  );
};

/* ---------- presets: return keyframes ---------- */
export const cameraPresets = {
  /** 1. static */
  static: (): CameraKey[] => [{frame: 0, scale: 1}],
  /** 2. gentle push-in toward (x,y) */
  pushIn: (dur: number, amount = 0.08, x = CX, y = CY, start = 0): CameraKey[] => [
    {frame: start, scale: 1, x: CX, y: CY},
    {frame: start + dur, scale: 1 + amount, x: CX + (x - CX) * 0.35, y: CY + (y - CY) * 0.35},
  ],
  /** 3. gentle pull-out from a closer framing */
  pullOut: (dur: number, from = 1.14, x = CX, y = CY, start = 0): CameraKey[] => [
    {frame: start, scale: from, x, y},
    {frame: start + dur, scale: 1, x: CX, y: CY},
  ],
  /** 4. horizontal reframing */
  panX: (dur: number, fromX: number, toX: number, scale = 1.1, start = 0): CameraKey[] => [
    {frame: start, scale, x: fromX},
    {frame: start + dur, scale, x: toX},
  ],
  /** 5. vertical reframing */
  panY: (dur: number, fromY: number, toY: number, scale = 1.0, start = 0): CameraKey[] => [
    {frame: start, scale, y: fromY},
    {frame: start + dur, scale, y: toY},
  ],
  /** 6. scale-based focus on a point */
  focus: (start: number, dur: number, x: number, y: number, scale = 1.3, back?: number): CameraKey[] => {
    const k: CameraKey[] = [{frame: 0, scale: 1}, {frame: start, scale: 1}, {frame: start + dur, scale, x, y}];
    if (back !== undefined) k.push({frame: back, scale: 1});
    return k;
  },
  /** 7. top-down: tiny rotate + gentle push (for overhead tables) */
  topDown: (dur: number): CameraKey[] => [
    {frame: 0, scale: 1.02, rotate: -0.8},
    {frame: dur, scale: 1.09, rotate: 0.6},
  ],
};

/** SHOT SIZES — wide / medium / close / extreme close-up (+ top-down & side-view helpers). */
export const shotScale = {wide: 1.0, medium: 1.22, close: 1.5, extreme: 2.0} as const;
export type ShotSize = keyof typeof shotScale;
export const cameraShots = {
  /** hold a framing; `drift` = slow push (+) or pull (-) over `dur` frames */
  frame: (size: ShotSize, x: number, y: number, dur: number, drift = 0.05, driftX = 0, driftY = 0): CameraKey[] => [
    {frame: 0, scale: shotScale[size], x, y},
    {frame: dur, scale: shotScale[size] * (1 + drift), x: x + driftX, y: y + driftY},
  ],
  /** reframe from one shot size/point to another */
  reframe: (from: {size: ShotSize; x: number; y: number}, to: {size: ShotSize; x: number; y: number}, start: number, dur: number): CameraKey[] => [
    {frame: 0, scale: shotScale[from.size], x: from.x, y: from.y},
    {frame: start, scale: shotScale[from.size], x: from.x, y: from.y},
    {frame: start + dur, scale: shotScale[to.size], x: to.x, y: to.y},
  ],
  /** overhead: slight rotation + push */
  topDown: (dur: number, x = 540, y = 960, rot = 1.2): CameraKey[] => [
    {frame: 0, scale: 1.04, x, y, rotate: -rot},
    {frame: dur, scale: 1.12, x: x + 14, y: y + 20, rotate: rot * 0.4},
  ],
  /** side view: gentle lateral track */
  sideView: (dur: number, fromX: number, toX: number, y = 1000, size: ShotSize = 'medium'): CameraKey[] => [
    {frame: 0, scale: shotScale[size], x: fromX, y},
    {frame: dur, scale: shotScale[size] * 1.04, x: toX, y: y + 12},
  ],
};
