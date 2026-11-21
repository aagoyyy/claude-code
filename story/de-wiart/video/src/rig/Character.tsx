import React from 'react';
import {RigBody, RigDefs, RigVariant} from './RigArt';
import {Pose, transforms} from './pose';
import {Cam, camT} from '../world/util';

export const CH = {s: 0.567, fx: 800, fy: 935, rx: 505, ry: 1706};
/** rig space -> screen space (before camera) */
export const place = (x: number, y: number): [number, number] => [(x - CH.rx) * CH.s + CH.fx, (y - CH.ry) * CH.s + CH.fy];
const PLACE = `translate(${CH.fx} ${CH.fy}) scale(${CH.s}) translate(${-CH.rx} ${-CH.ry})`;

type Props = {
  pose: Pose;
  variant?: RigVariant;
  cam: Cam;
  depth?: number;
  /** key light strength 0..1 */
  lit?: number;
  /** lighting palette (defaults = low warm sun) + cast-shadow skew/opacity */
  light?: {rim?: string; key?: string; bounce?: string; haze?: string; skew?: number; shadow?: number; halo?: string};
  children?: React.ReactNode; // drawn in the same parallax plane, above the character (hotspots...)
  under?: React.ReactNode;    // drawn below the character (dust, grass)
};

export const Character: React.FC<Props> = ({pose, variant = {}, cam, depth = 1, lit: key = 1, light = {}, children, under}) => {
  const L = {rim: '#ffd9a0', key: '#ffe3b5', bounce: '#d9964c', haze: '#ffcf98', skew: -0.9, shadow: 0.5, halo: '#ffc27a', ...light};
  const T = transforms(pose);
  return (
    <svg width={1920} height={1080} viewBox="0 0 1920 1080" style={{position: 'absolute', left: 0, top: 0, overflow: 'visible'}}>
      <style>{`.stitch{fill:none;stroke:#4f4a2c;stroke-width:1.8;stroke-dasharray:5 4;opacity:.7}
.seam{fill:none;stroke:#3c391f;stroke-width:2.5;stroke-linejoin:round;stroke-linecap:round}`}</style>
      <RigDefs />
      <defs>
        <g id="charArt"><RigBody T={T} V={variant} /></g>

        {/* rim light on silhouette edges that face the sun (left/top) + scene colour grade */}
        <filter id="rimFx" x="-10%" y="-10%" width="120%" height="120%" colorInterpolationFilters="sRGB">
          <feColorMatrix in="SourceGraphic" type="matrix" values="1.05 0 0 0 0  0 .96 0 0 0  0 0 .84 0 0  0 0 0 1 0" result="g" />
          <feOffset in="SourceAlpha" dx="9" dy="6" result="o" />
          <feComposite in="SourceAlpha" in2="o" operator="out" result="edge" />
          <feGaussianBlur in="edge" stdDeviation="1.6" result="eb" />
          <feFlood floodColor={L.rim} floodOpacity={Math.min(1, 0.9 * key)} result="fl" />
          <feComposite in="fl" in2="eb" operator="in" result="rim" />
          <feOffset in="SourceAlpha" dx="-6" dy="-3" result="o2" />
          <feComposite in="SourceAlpha" in2="o2" operator="out" result="edge2" />
          <feGaussianBlur in="edge2" stdDeviation="2" result="eb2" />
          <feFlood floodColor="#7d6a8f" floodOpacity=".55" result="fl2" />
          <feComposite in="fl2" in2="eb2" operator="in" result="rim2" />
          <feMerge><feMergeNode in="g" /><feMergeNode in="rim2" /><feMergeNode in="rim" /></feMerge>
        </filter>
        {/* cast shadow + backlight halo */}
        <filter id="shadowFx" x="-30%" y="-30%" width="160%" height="160%">
          <feFlood floodColor="#1a0e08" result="f" /><feComposite in="f" in2="SourceAlpha" operator="in" result="s" /><feGaussianBlur in="s" stdDeviation="9" />
        </filter>
        <filter id="haloFx" x="-30%" y="-30%" width="160%" height="160%">
          <feFlood floodColor={L.halo} result="f" /><feComposite in="f" in2="SourceAlpha" operator="in" result="s" /><feGaussianBlur in="s" stdDeviation="26" />
        </filter>
        <filter id="blurC"><feGaussianBlur stdDeviation="14" /></filter>
        <linearGradient id="shLen" gradientUnits="userSpaceOnUse" x1="500" y1="0" x2="1650" y2="0">
          <stop offset="0" stopColor="#fff" stopOpacity="1" /><stop offset="1" stopColor="#fff" stopOpacity=".0" />
        </linearGradient>
        <mask id="shMask" maskUnits="userSpaceOnUse" x="-200" y="1500" width="2400" height="800"><rect x="-200" y="1500" width="2400" height="800" fill="url(#shLen)" /></mask>

        {/* in-silhouette lighting overlays (alpha masked by the character) */}
        <mask id="charMask" maskUnits="userSpaceOnUse" x="200" y="300" width="800" height="1500" style={{maskType: 'alpha'} as any}>
          <use href="#charArt" />
        </mask>
        <radialGradient id="keyG" gradientUnits="userSpaceOnUse" cx="330" cy="760" r="640">
          <stop offset="0" stopColor={L.key} stopOpacity={Math.min(0.6, 0.34 * key)} /><stop offset="1" stopColor={L.key} stopOpacity="0" />
        </radialGradient>
        <linearGradient id="shadeG" gradientUnits="userSpaceOnUse" x1="430" y1="0" x2="720" y2="0">
          <stop offset="0" stopColor="#1c1020" stopOpacity="0" /><stop offset="1" stopColor="#1c1020" stopOpacity=".42" />
        </linearGradient>
        <linearGradient id="bounceG" gradientUnits="userSpaceOnUse" x1="0" y1="1440" x2="0" y2="1712">
          <stop offset="0" stopColor={L.bounce} stopOpacity="0" /><stop offset="1" stopColor={L.bounce} stopOpacity=".36" />
        </linearGradient>
        <linearGradient id="skyG" gradientUnits="userSpaceOnUse" x1="0" y1="430" x2="0" y2="760">
          <stop offset="0" stopColor="#a9b8ff" stopOpacity=".2" /><stop offset="1" stopColor="#a9b8ff" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="hazeG" gradientUnits="userSpaceOnUse" x1="0" y1="430" x2="0" y2="1712">
          <stop offset="0" stopColor={L.haze} stopOpacity=".03" /><stop offset="1" stopColor={L.haze} stopOpacity=".12" />
        </linearGradient>
      </defs>

      <g transform={camT(cam, depth)}>
        {under}
        {/* contact + cast shadows on the ground (light from the low sun at left) */}
        <g transform={PLACE}>
          <ellipse cx="500" cy="1708" rx="250" ry="26" fill="#1a0e08" opacity=".55" filter="url(#blurC)" />
          <g mask="url(#shMask)" opacity={L.shadow}>
            <g transform={`matrix(1 0 ${L.skew} -0.12 ${-L.skew * 1700} 1904)`} filter="url(#shadowFx)"><use href="#charArt" /></g>
          </g>
          {/* warm halo behind the silhouette (backlight) */}
          <g opacity={0.16 * key} transform="translate(-14 -4)"><g filter="url(#haloFx)"><use href="#charArt" /></g></g>
          <g filter="url(#rimFx)"><use href="#charArt" /></g>
          <g mask="url(#charMask)">
            <rect x="200" y="300" width="800" height="1500" fill="url(#keyG)" />
            <rect x="200" y="300" width="800" height="1500" fill="url(#shadeG)" />
            <rect x="200" y="300" width="800" height="1500" fill="url(#bounceG)" />
            <rect x="200" y="300" width="800" height="1500" fill="url(#skyG)" />
            <rect x="200" y="300" width="800" height="1500" fill="url(#hazeG)" />
          </g>
        </g>
        {children}
      </g>
    </svg>
  );
};
