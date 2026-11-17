"""usage: python3 -I emit_layers.py <toolkit/py dir> <out Layers.tsx> [price text]"""
import re, json, sys, os
KIT, OUT = os.path.abspath(sys.argv[1]), os.path.abspath(sys.argv[2])
PRICE = sys.argv[3] if len(sys.argv) > 3 else None
sys.path.insert(0, KIT); os.chdir(KIT)
from kit import *
import scene

def camel(m):
    p = m.group(1).split('-'); return p[0] + ''.join(x.title() for x in p[1:]) + '='
def jsx(s):
    s = re.sub(r'\b([a-z]+(?:-[a-z]+)+)=', camel, s)
    s = s.replace('xlink:href', 'xlinkHref')
    return s.replace('Rp 10.000 - 15.000', PRICE) if PRICE else s

doc = Doc(1)
layers, meta = scene.build(doc, True)
out = ["import React from 'react';", '', '/** GENERATED - 100% SVG static art layers of the mie key visual. */',
       'export const Defs: React.FC = () => (', '  <defs>' + jsx(''.join(doc.defs)) + '</defs>', ');', '',
       'export const LAYERS: Record<string, React.FC> = {']
for name, lst in layers:
    out.append(f"  {name}: () => (<g>{jsx(''.join(lst))}</g>),")
out += ['};', 'export const META: Record<string, [number, number]> = ' + json.dumps(meta) + ';']
os.makedirs(os.path.dirname(OUT), exist_ok=True)
open(OUT, 'w').write('\n'.join(out))
print('layers', len(layers), 'bytes', sum(len(x) for x in out))
