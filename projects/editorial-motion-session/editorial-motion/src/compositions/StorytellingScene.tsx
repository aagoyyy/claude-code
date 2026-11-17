import React from 'react';
import {AbsoluteFill} from 'remotion';
import {CameraRig, CameraKey} from '../camera/CameraMovement';
import {SafeZoneGuide} from '../camera/SceneFraming';

export type StorytellingSceneProps = {
  /** background component (rendered under the camera? no: backgrounds are part of the WORLD so they move with the camera) */
  background: React.ReactNode;
  camera?: CameraKey[];
  /** world layer: illustrations and labels (move with camera) */
  children?: React.ReactNode;
  /** screen layer: headline, captions (do NOT move with camera) */
  overlay?: React.ReactNode;
  showSafeZone?: boolean;
};

/**
 * Generic scene shell: [world = background + children, moved by CameraRig] + [overlay = fixed typography].
 * All composition templates are thin presets of this component.
 */
export const StorytellingScene: React.FC<StorytellingSceneProps> = ({background, camera, children, overlay, showSafeZone}) => (
  <AbsoluteFill>
    <CameraRig keys={camera ?? [{frame: 0, scale: 1}]}>
      {background}
      {children}
    </CameraRig>
    {overlay}
    <SafeZoneGuide show={showSafeZone} />
  </AbsoluteFill>
);
