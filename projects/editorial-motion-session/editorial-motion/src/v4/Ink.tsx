import React from 'react';
import {AbsoluteFill} from 'remotion';
import {RoughContext} from '../illustrations/Illustration';

/**
 * INK LINE WORLD (V4): organic outline wobble + PEN-PRESSURE variation.
 * 1) low-frequency displacement bends every line slightly (hand drawn)
 * 2) dark pixels (the outline) are extracted, dilated, roughened and masked by a second noise field,
 *    so the line gets thicker in patches and thinner elsewhere (variable line weight)
 * Wrap WORLD layers only (not typography).
 */
export const InkLineWorld: React.FC<{id?: string; wobble?: number; pressure?: number; children: React.ReactNode}> = ({id = 'ink4', wobble = 4.5, pressure = 1.3, children}) => (
  <>
    <svg width={0} height={0} style={{position: 'absolute'}}>
      <filter id={id} x="-2%" y="-2%" width="104%" height="104%" colorInterpolationFilters="sRGB">
        <feTurbulence type="fractalNoise" baseFrequency="0.011 0.014" numOctaves={2} seed={5} result="n1" />
        <feDisplacementMap in="SourceGraphic" in2="n1" scale={wobble} xChannelSelector="R" yChannelSelector="G" result="d" />
        <feColorMatrix in="d" type="matrix" values="0 0 0 0 0.227  0 0 0 0 0.169  0 0 0 0 0.133  -2.3 -2.3 -2.3 0 1.95" result="dark" />
        <feMorphology in="dark" operator="dilate" radius={pressure} result="dil" />
        <feTurbulence type="fractalNoise" baseFrequency="0.028" numOctaves={2} seed={9} result="n2" />
        <feDisplacementMap in="dil" in2="n2" scale={3} xChannelSelector="G" yChannelSelector="R" result="dil2" />
        <feColorMatrix in="n2" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  5 0 0 0 -2.3" result="mask" />
        <feComposite in="dil2" in2="mask" operator="in" result="thick" />
        <feMerge><feMergeNode in="d" /><feMergeNode in="thick" /></feMerge>
      </filter>
    </svg>
    <RoughContext.Provider value={false}>
      <div style={{position: 'absolute', inset: 0, filter: `url(#${id})`}}>
        {/* clip BEFORE filtering: otherwise the filter input spans the whole zoomed world and renders extremely slowly */}
        <div style={{position: 'absolute', inset: 0, overflow: 'hidden', contain: 'paint'}}>{children}</div>
      </div>
    </RoughContext.Provider>
  </>
);

/** Paper + ink texture overlay: fibres, speckle and uneven ink density (multiply). */
export const PaperInk: React.FC<{strength?: number}> = ({strength = 1}) => (
  <AbsoluteFill style={{pointerEvents: 'none'}}>
    <svg width={1080} height={1920} style={{position: 'absolute', inset: 0, mixBlendMode: 'multiply', opacity: 0.34 * strength}}>
      <filter id="pi-fibre"><feTurbulence type="fractalNoise" baseFrequency="0.02 0.6" numOctaves={3} seed={3} /><feColorMatrix values="0 0 0 0 0.45  0 0 0 0 0.36  0 0 0 0 0.26  0 0 0 0.9 -0.15" /></filter>
      <rect width="100%" height="100%" filter="url(#pi-fibre)" />
    </svg>
    <svg width={1080} height={1920} style={{position: 'absolute', inset: 0, mixBlendMode: 'multiply', opacity: 0.22 * strength}}>
      <filter id="pi-blot"><feTurbulence type="fractalNoise" baseFrequency="0.006" numOctaves={3} seed={21} /><feColorMatrix values="0 0 0 0 0.5  0 0 0 0 0.38  0 0 0 0 0.25  0 0 0 1.6 -0.5" /></filter>
      <rect width="100%" height="100%" filter="url(#pi-blot)" />
    </svg>
    <AbsoluteFill style={{background: 'radial-gradient(ellipse at 52% 46%, rgba(0,0,0,0) 46%, rgba(110,64,28,0.3) 100%)', mixBlendMode: 'multiply'}} />
    <AbsoluteFill style={{background: 'radial-gradient(circle at 16% 10%, rgba(255,240,205,0.5), rgba(255,240,205,0) 55%)', mixBlendMode: 'soft-light', opacity: 0.55}} />
  </AbsoluteFill>
);
