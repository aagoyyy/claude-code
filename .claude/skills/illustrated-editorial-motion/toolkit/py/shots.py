from kit import *
import scene, topdown
from build import assemble

SHOTS = {   # name: (camera (cx, cy, zoom, roll), depth-of-field blur (wall, mid))
    'hero_three_quarter': ((540, 960, 1.0, 0), None),
    'wide_establishing':  ((560, 800, .72, 0), None),
    'medium':             ((470, 1020, 1.45, 0), (2.5, 0)),
    'closeup':            ((640, 1470, 2.0, 0), (6, 4)),
    'extreme_closeup':    ((450, 1445, 4.2, 0), (9, 7)),
    'dynamic_dutch':      ((520, 1260, 1.5, -7), (3, 2)),
}
if __name__ == '__main__':
    for name, (cam, dof) in SHOTS.items():
        doc = Doc(1); L = scene.build(doc)
        open(f'./shot_{name}.svg', 'w').write(assemble(doc, L, cam, dof))
    doc = Doc(2); top = topdown.build_top(doc)
    open('./shot_top_down.svg', 'w').write(
        f'<svg xmlns="http://www.w3.org/2000/svg" width="1080" height="1920" viewBox="0 0 1080 1920"><defs>{"".join(doc.defs)}</defs>{"".join(top)}</svg>')
    print('shots ok')
