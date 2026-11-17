"""Storyboard helpers. Same kit as the key visual (kit/*.py): one key light upper-left, tiered ink, posterised tone ramps, wobble."""
import sys, os, math, random
HERE = os.path.dirname(os.path.abspath(__file__)); KIT = os.path.join(HERE, '..', 'kit')
sys.path.insert(0, KIT)
import kit as _kit
_h2r = _kit.h2r
_kit.h2r = lambda h: _h2r('#' + ''.join(c * 2 for c in h.lstrip('#')) if len(h.lstrip('#')) == 3 else h)   # accept #RGB without touching the shared kit
from kit import *
from mat import *
from mat2 import *
W, H = 1080, 1920
FONT = "'Inter Display','Inter','Helvetica Neue',Arial,sans-serif"
INKC = '#2A1B15'; RED = '#D54F48'; CREAM = '#FFFBF0'; NAVY = '#1F2A37'; GREEN = '#4E8A5A'

def O(doc, pts, fill, tier='fg', inner='', seed=0, k=1.0): return solid(doc, pts, fill, tier, inner, seed, k)[0]
def R(x0, y0, x1, y1, r=10, amp=1.6, seed=1, n=8): return wob(rrect(x0, y0, x1, y1, r, r, r, r, n), amp, seed)
def Pl(pts, step=36, amp=1.2, seed=1):
    out = []
    for i, a in enumerate(pts):
        b = pts[(i + 1) % len(pts)]; n = max(1, int(math.hypot(b[0] - a[0], b[1] - a[1]) / step))
        out += [(a[0] + (b[0] - a[0]) * k / n, a[1] + (b[1] - a[1]) * k / n) for k in range(n)]
    return wob(out, amp, seed)
def E(cx, cy, rx, ry, amp=1.6, seed=1, n=90): return wob(ell(cx, cy, rx, ry, n), amp, seed)
def P(doc, *cols, h=False): return f'url(#{doc.lg([(i / (len(cols) - 1), c) for i, c in enumerate(cols)], 0, 0, 1 if h else 0, 0 if h else 1)})'
def RG(doc, *stops, c=(.5, .5), r=.5): return f'url(#{doc.rg(list(stops), c[0], c[1], r)})'
def T(x, y, s, size, fill=INKC, weight=800, anchor='middle', rot=0, ls=0, op=1, extra=''):
    return f'<text x="{x}" y="{y}" font-family="{FONT}" font-weight="{weight}" font-size="{size}" fill="{fill}" text-anchor="{anchor}" letter-spacing="{ls}" opacity="{op}" transform="rotate({rot} {x} {y})" {extra}>{s}</text>'
def G(content, x=0, y=0, rot=0, s=1, ox=0, oy=0): return f'<g transform="translate({x + ox} {y + oy}) rotate({rot}) scale({s}) translate({-ox} {-oy})">{content}</g>'
def tr(pts, x=0, y=0, s=1): return [(x + px * s, y + py * s) for px, py in pts]
def glow(doc, x, y, r, col='#FFD58A', op=.8): return f'<circle cx="{x}" cy="{y}" r="{r}" fill="{RG(doc, (0, col, op), (.4, col, op * .35), (1, col, 0))}"/>'
def shadow(doc, x, y, rx, ry, op=.4, sd=8, col='#1B0C0A'): return f'<ellipse cx="{x}" cy="{y}" rx="{rx}" ry="{ry}" fill="{col}" opacity="{op}" filter="url(#{doc.blur(sd)})"/>'

def tag(doc, x, y, text, rot=0, sc=1, col=RED, size=50):
    pts = wob([(-112, -52), (108, -52), (156, 0), (108, 52), (-112, 52), (-150, 8), (-150, -8)], 1.4, 7)
    g = P(doc, mix(col, '#FFFFFF', .22), col, mix(col, '#4A1010', .35))
    hole = f'<circle cx="-106" cy="0" r="13" fill="#2A1B15" opacity=".85"/><circle cx="-106" cy="0" r="9" fill="#EADCC3"/>'
    inner = f'<rect x="-150" y="-52" width="320" height="22" fill="#fff" opacity=".16"/>' + hole + f'<path d="M-96,-40 L100,-40 M-96,40 L100,40" stroke="#fff" stroke-width="2" opacity=".35" stroke-dasharray="6 6"/>'
    cord = f'<path d="M-106,0 C-160,-50 -150,-120 -92,-140" stroke="#B88B50" stroke-width="5" fill="none" stroke-linecap="round"/>'
    body = cord + shadow(doc, 8, 40, 150, 26, .35, 8) + O(doc, pts, g, 'fg', inner, int(x) % 97, .8) + T(26, size * .34, text, size, '#FFF4E6', 800, 'middle', 0, 1)
    return G(body, x, y, rot, sc)

def coin(doc, x, y, r, col='#D8B454', rot=0, label='1000'):
    g = RG(doc, (0, mix(col, '#FFFFFF', .55)), (.6, col), (1, mix(col, '#4A2B3A', .5)), c=(.35, .3), r=.85)
    return (shadow(doc, x + r * .28, y + r * .42, r, r * .55, .45, 3) + O(doc, E(x, y, r, r * .96, .8, int(x)), g, 'mid',
            f'<circle cx="{x}" cy="{y}" r="{r * .78}" fill="none" stroke="{mix(col, "#4A2B3A", .45)}" stroke-width="2.2"/>' + T(x, y + r * .2, label, r * .52, mix(col, '#3A1C26', .55), 800) +
            f'<path d="M{x - r * .6},{y - r * .45} Q{x - r * .1},{y - r * .9} {x + r * .4},{y - r * .7}" stroke="#fff" stroke-width="3" fill="none" opacity=".8" stroke-linecap="round"/>', int(y), .6))

def grain_and_vignette(doc, strength=.38, grain=.18):
    vig = RG(doc, (0, '#000', 0), (.62, '#2A1208', 0), (1, '#2A1208', strength), r=.78)
    gr = doc.filt('<feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" seed="3"/><feColorMatrix type="matrix" values="0 0 0 0 .3  0 0 0 0 .22  0 0 0 0 .14  0 0 0 .55 0"/>', '0%', '0%', '100%', '100%')
    return f'<rect width="{W}" height="{H}" fill="{vig}"/><rect width="{W}" height="{H}" filter="url(#{gr})" opacity="{grain}"/>'

def page(doc, body, overlay=''):
    return (f'<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="{W}" height="{H}" viewBox="0 0 {W} {H}"><defs>{"".join(doc.defs)}</defs>'
            f'<rect width="{W}" height="{H}" fill="#EADCC3"/>{body}{overlay}</svg>')

def person_back(doc, cx, by, s, shirt, skin='#C98F63', hair='#241612', seed=1, cap=None):
    """seated/standing figure seen from behind. by = baseline (bottom of torso). ~520*s tall."""
    def Pn(p): return tr(p, cx, by, s)
    torso = bez((-120, 0), (-128, -120), (-118, -190), (-72, -232), 14)[:-1] + bez((-72, -232), (-40, -250), (-26, -262), (-24, -276), 8)[:-1] + [(24, -276)] + \
            bez((24, -276), (26, -262), (40, -250), (72, -232), 8)[:-1] + bez((72, -232), (118, -190), (128, -120), (120, 0), 14)
    torso = Pn(wob(resample(torso, 90, False), 2.4, seed, False))
    g = P(doc, mix(shirt, '#FFFFFF', .12), shirt, mix(shirt, '#2A1020', .45), h=True)
    rim = f'<path d="{d_smooth(Pn(bez((-72, -232), (-100, -200), (-116, -150), (-118, -90), 10)), False)}" stroke="{KEY}" stroke-width="{7 * s:.1f}" fill="none" opacity=".75" stroke-linecap="round"/>'
    fold = f'<path d="{d_smooth(Pn([(0, -250), (4, -150), (-2, -60)]), False)}" stroke="{mix(shirt, "#2A1020", .5)}" stroke-width="{3 * s:.1f}" fill="none" opacity=".5"/>'
    out = O(doc, torso + [(cx + 120 * s, by + 40 * s), (cx - 120 * s, by + 40 * s)], g, 'mid', rim + fold, seed, .9)
    neck = O(doc, Pn(R(-26, -300, 26, -262, 8, .8, seed + 2)), P(doc, mix(skin, '#FFFFFF', .1), mix(skin, '#4A2B3A', .35)), 'mid', '', seed + 2, .7)
    hd = Pn(wob(ell(0, -340, 56, 62, 80), 2, seed + 3))
    hg = RG(doc, (0, mix(hair, '#6B4A3A', .6)), (.5, hair), (1, mix(hair, '#000000', .5)), c=(.35, .25), r=.9)
    ear = O(doc, tr(ell(0, 0, 9, 14, 20), cx - 56 * s, by - 336 * s, s), skin, 'mid', '', seed + 4, .5) + O(doc, tr(ell(0, 0, 9, 14, 20), cx + 56 * s, by - 336 * s, s), mix(skin, '#4A2B3A', .25), 'mid', '', seed + 5, .5)
    head = O(doc, hd, hg, 'mid', f'<path d="{d_smooth(Pn(bez((-40, -380), (-10, -396), (28, -392), (46, -366), 10)), False)}" stroke="#fff" stroke-width="{5 * s:.1f}" fill="none" opacity=".35" stroke-linecap="round"/>', seed + 3, .9)
    capx = ''
    if cap:
        cp = Pn(wob(bez((-60, -352), (-58, -410), (58, -410), (60, -352), 14) + [(66, -344), (-66, -344)], 1.2, seed + 6))
        capx = O(doc, cp, P(doc, mix(cap, '#FFFFFF', .2), cap, h=True), 'mid', '', seed + 6, .8)
    return shadow(doc, cx, by + 40 * s, 130 * s, 18 * s, .4, 8) + out + neck + ear + head + capx
