import sys
from kit import *
import scene

def assemble(doc, L, cam=(540, 960, 1.0, 0), dof=None):
    """camera = (centre x, centre y, zoom, roll degrees). dof = blur for (wall, mid) in world px."""
    cx, cy, z, roll = cam
    w, h = 1080 / z, 1920 / z
    vb = f'{cx - w / 2:.1f} {cy - h / 2:.1f} {w:.1f} {h:.1f}'
    def grp(items, blur=None):
        s = ''.join(items)
        return f'<g filter="url(#{doc.blur(blur)})">{s}</g>' if blur else f'<g>{s}</g>'
    wb = mb = None
    if dof: wb, mb = dof
    body = grp(L['wall'], wb) + grp(L['table'], mb and mb * .5) + grp(L['mid'], mb) + grp(L['fg']) + grp(L['fx'])
    if roll: body = f'<g transform="rotate({roll} {cx} {cy})">{body}</g>'
    return (f'<svg xmlns="http://www.w3.org/2000/svg" width="1080" height="1920" viewBox="{vb}"><defs>{"".join(doc.defs)}</defs>{body}</svg>')

if __name__ == '__main__':
    doc = Doc(1); L = scene.build(doc)
    svg = assemble(doc, L)
    open('/home/user/editorial-motion/frame/frame3.svg', 'w').write(svg)
    print('ok', len(svg))
