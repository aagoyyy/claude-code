"""Food, fire and smoke materials."""
import math, random
from kit import *

# ---------------------------------------------------------------- FIRE: layered tongues (blue shell -> light blue -> white-hot core) + radial glow + heat shimmer
def flame_ring(doc, cx, cy, rx, ry, n=24, scale=1.0, seed=3):
    r = random.Random(seed); s = ''
    gl = doc.rg([(0, '#9FD0FF', .55), (.5, '#4E9BFF', .22), (1, '#4E9BFF', 0)], .5, .5, .5)
    s += f'<ellipse cx="{cx}" cy="{cy - 8}" rx="{rx * 1.7:.0f}" ry="{ry * 3.2:.0f}" fill="url(#{gl})"/>'
    tongues = []
    for i in range(n):
        a = i / n * 2 * math.pi; x, y = cx + rx * math.cos(a), cy + ry * math.sin(a)
        h = (34 + 14 * math.sin(i * 1.7) + 7 * math.cos(i * 2.9) + r.uniform(-4, 4)) * scale; lean = 4 * math.sin(i * 1.1) + r.uniform(-2, 2)
        tongues.append((y, x, h, lean))
    tongues.sort()
    for y, x, h, lean in tongues:
        def tg(k, wk): return (f'M{x - 9 * wk:.1f},{y:.1f} C{x - 12 * wk + lean * .3:.1f},{y - h * k * .55:.1f} {x - 2 * wk + lean * .8:.1f},{y - h * k * .82:.1f} {x + lean:.1f},{y - h * k:.1f} '
                              f'C{x + 3 * wk + lean * .8:.1f},{y - h * k * .82:.1f} {x + 12 * wk + lean * .3:.1f},{y - h * k * .55:.1f} {x + 9 * wk:.1f},{y:.1f} Z')
        s += f'<path d="{tg(1, 1)}" fill="#2F7BE0" opacity=".9"/><path d="{tg(.78, .72)}" fill="#7DC0FF"/><path d="{tg(.5, .42)}" fill="#EAF8FF"/>'
    return s

# ---------------------------------------------------------------- SMOKE / STEAM: volumetric wisps, edges eaten by turbulence displacement
def wisp_d(x, y, h, w):
    return f'M{x},{y} C{x - w},{y - h * .28} {x + w},{y - h * .5} {x},{y - h * .72} S{x - w * .7},{y - h * .96} {x + w * .25},{y - h}'
def smoke(doc, wisps, seed=3, op=.7, th=24, scale=46, blur=4):
    f1 = doc.filt(f'<feTurbulence type="fractalNoise" baseFrequency="0.011 0.02" numOctaves="3" seed="{seed}" result="n"/><feDisplacementMap in="SourceGraphic" in2="n" scale="{scale}" xChannelSelector="R" yChannelSelector="G" result="d"/><feGaussianBlur in="d" stdDeviation="{blur}"/>', '-40%', '-25%', '180%', '150%')
    f2 = doc.filt(f'<feTurbulence type="fractalNoise" baseFrequency="0.016 0.03" numOctaves="2" seed="{seed + 4}" result="n"/><feDisplacementMap in="SourceGraphic" in2="n" scale="{scale * .7:.0f}" xChannelSelector="G" yChannelSelector="R" result="d"/><feGaussianBlur in="d" stdDeviation="{blur * .4:.1f}"/>', '-40%', '-25%', '180%', '150%')
    soft = ''.join(f'<path d="{wisp_d(*w)}" fill="none" stroke="#FFFFFF" stroke-width="{th * 1.8:.0f}" stroke-linecap="round" opacity="{op * .5:.2f}"/>' for w in wisps)
    core = ''.join(f'<path d="{wisp_d(*w)}" fill="none" stroke="#FFF9EC" stroke-width="{th * .75:.0f}" stroke-linecap="round" opacity="{op:.2f}"/>' for w in wisps)
    rim = ''.join(f'<path d="{wisp_d(w[0] - 7, w[1], w[2], w[3])}" fill="none" stroke="#C9B9A2" stroke-width="2.4" stroke-linecap="round" opacity="{op * .55:.2f}"/>' for w in wisps)   # shadowed edge, away from the light
    return f'<g filter="url(#{f1})">{soft}</g><g filter="url(#{f2})">{core}</g><g filter="url(#{f2})">{rim}</g>'
def puff(doc, x, y, r, seed=1):
    f = doc.filt(f'<feTurbulence type="fractalNoise" baseFrequency="0.03" numOctaves="3" seed="{seed}" result="n"/><feDisplacementMap in="SourceGraphic" in2="n" scale="{r * .9:.0f}" xChannelSelector="R" yChannelSelector="G"/><feGaussianBlur stdDeviation="{r * .08:.1f}"/>', '-40%', '-40%', '180%', '180%')
    return (f'<g filter="url(#{f})"><circle cx="{x}" cy="{y}" r="{r}" fill="#FFFDF6" opacity=".95"/><circle cx="{x + r * .5}" cy="{y + r * .35}" r="{r * .7:.0f}" fill="#E9DFCB" opacity=".6"/>'
            f'<circle cx="{x - r * .35}" cy="{y - r * .3}" r="{r * .5:.0f}" fill="#fff"/></g>')

# ---------------------------------------------------------------- FOOD
def noodle_strands(seed, x0, x1, y0, y1, count=120, ymid=1450):
    r = random.Random(seed); strands = []
    for _ in range(count):
        cx, cy = r.uniform(x0, x1), r.uniform(y0, y1)
        L = r.uniform(190, 340); th = r.uniform(-.5, .5) + r.choice([0, 0, 0, 1.0, -1.0]) * r.random()
        amp = r.uniform(13, 28); f = r.uniform(1.4, 2.6); ph = r.uniform(0, 6.28); w = r.uniform(9.5, 14); pts = []
        for k in range(17):
            t = k / 16; u = (t - .5) * L; v = amp * math.sin(2 * math.pi * f * t + ph)
            pts.append((cx + u * math.cos(th) - v * math.sin(th), cy + u * math.sin(th) + v * math.cos(th)))
        strands.append((cy, w, pts))
    strands.sort(key=lambda s: s[0])
    def sm(p, dx=0, dy=0):
        d = f'M{p[0][0] + dx:.1f},{p[0][1] + dy:.1f}'
        for i in range(1, len(p) - 1):
            d += f' Q{p[i][0] + dx:.1f},{p[i][1] + dy:.1f} {(p[i][0] + p[i + 1][0]) / 2 + dx:.1f},{(p[i][1] + p[i + 1][1]) / 2 + dy:.1f}'
        return d
    s = ''
    for cy, w, p in strands:
        k = max(0, min(1, (cy - y0) / (y1 - y0)))
        s += f'<path d="{sm(p, 2.5, 3.5)}" fill="none" stroke="#6C3A0E" stroke-width="{w + 5:.1f}" opacity="{.32 + .28 * k:.2f}" stroke-linecap="round"/>'      # occlusion under each strand
        s += f'<path d="{sm(p)}" fill="none" stroke="#C0832A" stroke-width="{w + 2.4:.1f}" stroke-linecap="round"/>'                                         # shade side
        s += f'<path d="{sm(p)}" fill="none" stroke="#F0BD58" stroke-width="{w - 1:.1f}" stroke-linecap="round"/>'                                           # body
        s += f'<path d="{sm(p, -1.8, -2.4)}" fill="none" stroke="#FFE7A0" stroke-width="{max(2, w * .32):.1f}" stroke-linecap="round" opacity=".92"/>'     # lit crest
        mid = p[len(p) // 2]                                                                                                                                 # sauce glint
        if r.random() < .55: s += f'<path d="M{mid[0] - 7:.0f},{mid[1] - 4:.0f} l12,-2" stroke="#FFFFFF" stroke-width="2.6" stroke-linecap="round" opacity=".9"/>'
    return s

def egg_half(doc, cx, cy, rx, ry, seed=4):
    r = random.Random(seed); w = wob(ell(cx, cy, rx, ry, 110), 3.0, seed)
    gw = doc.rg([(0, '#FFFFFF'), (.7, '#F6EEDD'), (1, '#DCCFB0')], .35, .3, .85)
    s = f'<path d="{d_smooth(wob(ell(cx + 10, cy + 12, rx, ry, 110), 3, seed))}" fill="#3A1D08" opacity=".34" filter="url(#{doc.blur(5)})"/>'
    inner = f'<ellipse cx="{cx}" cy="{cy}" rx="{rx * .9:.0f}" ry="{ry * .88:.0f}" fill="none" stroke="#EADFC4" stroke-width="5" opacity=".9"/>'
    inner += f'<ellipse cx="{cx - rx * .3:.0f}" cy="{cy - ry * .45:.0f}" rx="{rx * .38:.0f}" ry="{ry * .14:.0f}" fill="#fff" opacity=".9" transform="rotate(-18 {cx} {cy})"/>'
    sd, cid = solid(doc, w, f'url(#{gw})', 'fg', inner, seed, .55)
    s += sd
    yk = doc.rg([(0, '#FFD05A'), (.5, '#F5A02A'), (1, '#D06C14')], .38, .32, .8)
    yw = wob(ell(cx + 4, cy + 4, rx * .5, ry * .55, 90), 2.2, seed + 1)
    sd, _ = solid(doc, yw, f'url(#{yk})', 'fg',
                  f'<ellipse cx="{cx - rx * .12:.0f}" cy="{cy - ry * .12:.0f}" rx="{rx * .2:.0f}" ry="{ry * .12:.0f}" fill="#FFF4C8" transform="rotate(-24 {cx} {cy})"/>'
                  f'<path d="M{cx + rx * .12:.0f},{cy + ry * .38:.0f} q{rx * .2:.0f},{ry * .08:.0f} {rx * .3:.0f},-{ry * .16:.0f}" stroke="#B85A0E" stroke-width="3" fill="none" opacity=".5"/>', seed + 1, .5)
    s += sd
    for _ in range(14):
        x, y = cx + r.uniform(-rx * .65, rx * .65), cy + r.uniform(-ry * .6, ry * .6)
        if ((x - cx) / (rx * .55)) ** 2 + ((y - cy) / (ry * .6)) ** 2 < 1: continue
        s += f'<circle cx="{x:.0f}" cy="{y:.0f}" r="{r.uniform(1.3, 2.4):.1f}" fill="#2A1B15" opacity=".75"/>'
    return s

def pak_choy(doc, cx, cy, sc=1.0, seed=6):
    def P(pts): return [(cx + x * sc, cy + y * sc) for x, y in pts]
    s = f'<ellipse cx="{cx + 14 * sc:.0f}" cy="{cy + 26 * sc:.0f}" rx="{110 * sc:.0f}" ry="{44 * sc:.0f}" fill="#3A1D08" opacity=".3" filter="url(#{doc.blur(6)})"/>'
    leaf = wob(resample(bez((-110, 60), (-150, -20), (-110, -110), (-30, -140), 24)[:-1] + bez((-30, -140), (60, -170), (150, -110), (122, -30), 24)[:-1] +
                         bez((122, -30), (106, 22), (20, 66), (-110, 60), 24), 130), 3.4 * sc, seed)
    leaf = P([(x, y) for x, y in leaf])
    g = doc.lg([(0, '#9AD08F'), (.45, '#4E9158'), (1, '#2B5E37')], 0, 0, 1, 1)
    inner = ''
    # backlit translucent margin + vein network + puckered ripples
    leaf_inner = bez((-95, 52), (-124, -14), (-96, -92), (-30, -118), 20)[:-1] + bez((-30, -118), (54, -142), (128, -96), (104, -28), 20)[:-1] + bez((104, -28), (90, 14), (18, 54), (-95, 52), 20)
    inner += f'<path d="{d_smooth(P(wob(resample(leaf_inner, 100), 2.6, seed + 3)))}" fill="#7DB67E" opacity=".9"/>'
    mid = [(-100, 56), (-30, 0), (40, -60), (116, -126)]
    inner += f'<path d="{d_smooth(P(mid), False)}" fill="none" stroke="#F0F7DD" stroke-width="{9 * sc:.1f}" stroke-linecap="round"/><path d="{d_smooth(P([(x + 2, y + 6) for x, y in mid]), False)}" fill="none" stroke="#2B5E37" stroke-width="2.4" opacity=".6"/>'
    for (a, b) in (((-70, 30), (-76, -40)), ((-40, 10), (-30, -76)), ((-4, -20), (30, -104)), ((30, -46), (96, -96)), ((-60, 40), (0, 36)), ((-20, 8), (60, 4)), ((20, -28), (92, -30))):
        inner += f'<path d="{d_smooth(P([a, ((a[0] + b[0]) / 2 + 6, (a[1] + b[1]) / 2), b]), False)}" fill="none" stroke="#E6F1D2" stroke-width="{2.8 * sc:.1f}" stroke-linecap="round" opacity=".85"/>'
    inner += f'<path d="M{cx - 40 * sc:.0f},{cy - 100 * sc:.0f} q{60 * sc:.0f},{-24 * sc:.0f} {120 * sc:.0f},{10 * sc:.0f}" stroke="#fff" stroke-width="{5 * sc:.1f}" fill="none" opacity=".5" stroke-linecap="round"/>'
    sd, _ = solid(doc, leaf, f'url(#{g})', 'fg', inner, seed, .55)
    s += sd
    stem = wob(resample([(-110, 60), (-150, 78), (-132, 104), (-84, 98), (-40, 76), (-60, 52)], 70), 1.8, seed + 7); stem = P(stem)
    sd, _ = solid(doc, stem, '#DCEBC3', 'fg', f'<path d="{d_smooth(P([(-140, 84), (-96, 92), (-58, 70)]), False)}" stroke="#fff" stroke-width="3" fill="none" opacity=".8"/>', seed + 8, .5)
    return s + sd

def meatball(doc, cx, cy, r_, seed=1):
    rr = random.Random(seed); pts = wob(ell(cx, cy, r_, r_ * .95, 90), 3.2, seed)
    g = doc.rg([(0, '#D79B62'), (.55, '#A9683A'), (1, '#6A3C1D')], .35, .3, .8)
    inner = ''.join(f'<circle cx="{cx + rr.uniform(-r_, r_) * .8:.0f}" cy="{cy + rr.uniform(-r_, r_) * .8:.0f}" r="{rr.uniform(1.3, 3.2):.1f}" fill="#4C2711" opacity=".5"/>' for _ in range(22))
    inner += f'<ellipse cx="{cx - r_ * .34:.0f}" cy="{cy - r_ * .42:.0f}" rx="{r_ * .28:.0f}" ry="{r_ * .16:.0f}" fill="#FFE5C2" opacity=".9" transform="rotate(-30 {cx} {cy})"/>'
    inner += f'<path d="M{cx - r_ * .6:.0f},{cy + r_ * .5:.0f} Q{cx + r_ * .1:.0f},{cy + r_ * .98:.0f} {cx + r_ * .8:.0f},{cy + r_ * .2:.0f}" stroke="#4A2410" stroke-width="{r_ * .22:.0f}" fill="none" opacity=".4"/>'
    s = f'<ellipse cx="{cx + 12}" cy="{cy + r_ * .6:.0f}" rx="{r_ * 1.05:.0f}" ry="{r_ * .5:.0f}" fill="#2A1206" opacity=".42" filter="url(#{doc.blur(5)})"/>'
    return s + solid(doc, pts, f'url(#{g})', 'fg', inner, seed, .6)[0]

def chili_slice(doc, cx, cy, r_, seed=1):
    pts = wob(ell(cx, cy, r_, r_ * .78, 40), 1.2, seed)
    inner = f'<ellipse cx="{cx}" cy="{cy}" rx="{r_ * .64:.1f}" ry="{r_ * .48:.1f}" fill="#F7B1A2"/>' + ''.join(f'<circle cx="{cx + r_ * .32 * math.cos(k * 1.26):.1f}" cy="{cy + r_ * .24 * math.sin(k * 1.26):.1f}" r="1.9" fill="#FFF0C9"/>' for k in range(5))
    s = f'<ellipse cx="{cx + 5}" cy="{cy + 6}" rx="{r_}" ry="{r_ * .6:.0f}" fill="#2A1206" opacity=".3" filter="url(#{doc.blur(3)})"/>'
    return s + solid(doc, pts, '#D9473B', 'fg', inner, seed, .4)[0]

def scallion(doc, cx, cy, rx=17, ry=11):
    return (f'<ellipse cx="{cx}" cy="{cy}" rx="{rx}" ry="{ry}" fill="none" stroke="#2A1B15" stroke-width="11" opacity=".8"/><ellipse cx="{cx}" cy="{cy}" rx="{rx}" ry="{ry}" fill="none" stroke="#7CB37E" stroke-width="6.5"/>'
            f'<ellipse cx="{cx - 3}" cy="{cy - 3}" rx="{rx * .55:.0f}" ry="{ry * .45:.0f}" fill="none" stroke="#DDF0C6" stroke-width="2" opacity=".9"/>')
