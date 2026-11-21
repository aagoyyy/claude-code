import React from 'react';
import {S01} from './S01';
import {S1} from './S1';
import {S2} from './S2';
import {S4} from './S4';

export const REG: Record<string, React.FC> = {...S01, ...S1, ...S2, ...S4};

export const Still: React.FC<{id: string}> = ({id}) => {
  const C = REG[id];
  return C ? <C /> : <div style={{width: 1920, height: 1080, background: '#400', color: '#fff', fontSize: 60}}>missing {id}</div>;
};
