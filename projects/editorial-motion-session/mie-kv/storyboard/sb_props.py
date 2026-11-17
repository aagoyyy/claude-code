"""Detailed reusable props for the storyboard (no people). Same kit, same light logic."""
from sb_common import *

def bowl_top(doc, cx, cy, R_, seed=1, egg=True, herbs=True):
    """top-down bowl of noodles: ceramic ring + red band + broth + noodle strands + egg half + scallions"""
    s = shadow(doc, cx + R_ * .12, cy + R_ * .14, R_ * 1.04, R_ * 1.0, .45, 10)
    s += O(doc, E(cx, cy, R_, R_, 1.2, seed), RG(doc, (0, '#FFFFFF'), (.7, '#F4EAD3'), (1, '#BFAA82'), c=(.35, .3), r=.9), 'fg',
           f'<circle cx="{cx}" cy="{cy}" r="{R_ * .9:.0f}" fill="none" stroke="{RED}" stroke-width="{R_ * .09:.1f}" opacity=".95"/><circle cx="{cx}" cy="{cy}" r="{R_ * .97:.0f}" fill="none" stroke="#fff" stroke-width="3" opacity=".7"/>', seed, 1.0)
    ri = R_ * .8
    cid = doc.clip(d_smooth(ell(cx, cy, ri, ri, 60)))
    k = ri / 200.0
    s += f'<circle cx="{cx}" cy="{cy}" r="{ri:.0f}" fill="{RG(doc, (0, "#F4C86A"), (1, "#B8761E"))}"/>'
    s += f'<g clip-path="url(#{cid})"><g transform="translate({cx} {cy}) scale({k:.3f})">{noodle_strands(seed, -210, 210, -210, 210, 60, 0)}</g></g>'
    if egg: s += f'<g transform="translate({cx - ri * .28:.0f} {cy - ri * .12:.0f}) scale({k:.3f})">{egg_half(doc, 0, 0, 96, 66, seed + 3)}</g>'
    if herbs:
        for i, (ax, ay) in enumerate(((.45, -.35), (.5, .1), (.3, .45), (-.5, .4), (.0, -.6))):
            s += f'<g transform="translate({cx + ri * ax:.0f} {cy + ri * ay:.0f}) scale({k:.3f})">{scallion(doc, 0, 0, 22, 14)}</g>'
    s += f'<ellipse cx="{cx - ri * .5:.0f}" cy="{cy - ri * .55:.0f}" rx="{ri * .3:.0f}" ry="{ri * .08:.0f}" fill="#fff" opacity=".35" transform="rotate(-30 {cx} {cy})"/>'
    return s

def bottle(doc, x, y, w, h, col, label_txt='', cap='#C9473F', seed=1):
    """standing glass bottle; (x,y) = bottom centre"""
    nw = w * .38; sh = h * .22
    pts = [(x - w / 2, y), (x - w / 2, y - h * .6), (x - nw / 2, y - h * .6 - sh), (x - nw / 2, y - h + 14), (x + nw / 2, y - h + 14), (x + nw / 2, y - h * .6 - sh), (x + w / 2, y - h * .6), (x + w / 2, y)]
    pts = Pl(pts, 18, .8, seed)
    g = P(doc, mix(col, '#FFFFFF', .25), col, mix(col, '#1A0A08', .5), h=True)
    inner = f'<rect x="{x - w / 2:.0f}" y="{y - h * .58:.0f}" width="{w:.0f}" height="{h * .42:.0f}" fill="{CREAM}"/>' + T(x, y - h * .34, label_txt, w * .2, INKC, 900) + f'<path d="M{x - w * .36:.0f},{y - h * .6:.0f} L{x - w * .36:.0f},{y - 8:.0f}" stroke="#fff" stroke-width="{max(4, w * .08):.0f}" opacity=".5"/>'
    s = shadow(doc, x + w * .25, y + 4, w * .62, 9, .4, 4) + O(doc, pts, g, 'mid', inner, seed, .8)
    s += O(doc, R(x - nw * .6, y - h, x + nw * .6, y - h + 26, 5, .8, seed + 1), P(doc, mix(cap, '#FFFFFF', .2), cap), 'mid', '', seed + 1, .7)
    return s

def plant(doc, x, y, s=1.0, seed=1):
    """potted plant; (x,y) = bottom centre of the pot"""
    o = shadow(doc, x + 10 * s, y + 4, 60 * s, 10 * s, .4, 5)
    for i, (dx, ang, ln) in enumerate(((-30, -38, 150), (-10, -14, 190), (14, 10, 175), (36, 34, 140), (0, -2, 120))):
        a = math.radians(ang - 90); ex, ey = x + dx * s + math.cos(a) * ln * s, y - 60 * s + math.sin(a) * ln * s
        lf = bez((x + dx * s, y - 60 * s), (x + dx * s + math.cos(a - .4) * ln * .55 * s, y - 60 * s + math.sin(a - .4) * ln * .55 * s), (ex - 8 * s, ey + 20 * s), (ex, ey), 12)[:-1] + bez((ex, ey), (ex + 22 * s, ey + 26 * s), (x + dx * s + math.cos(a + .4) * ln * .5 * s, y - 60 * s + math.sin(a + .4) * ln * .5 * s), (x + dx * s, y - 60 * s), 12)
        o += O(doc, lf, P(doc, '#7DB67E', '#4E9158', '#2B5E37'), 'mid', f'<path d="M{x + dx * s:.0f},{y - 60 * s:.0f} L{ex:.0f},{ey:.0f}" stroke="#E6F1D2" stroke-width="{3 * s:.1f}" opacity=".8"/>', seed + i, .7)
    o += O(doc, [(x - 50 * s, y - 70 * s), (x + 50 * s, y - 70 * s), (x + 38 * s, y), (x - 38 * s, y)], P(doc, '#D9784F', '#B8502E', '#7A2E1A', h=True), 'fg', f'<rect x="{x - 52 * s:.0f}" y="{y - 74 * s:.0f}" width="{104 * s:.0f}" height="{16 * s:.0f}" fill="#E8935F" stroke="{INKC}" stroke-width="3"/>', seed + 9, .9)
    return o

def bricks(doc, x0, y0, x1, y1, seed=1, base='#C9805E', bh=46, bw=110):
    r = random.Random(seed); o = f'<rect x="{x0}" y="{y0}" width="{x1 - x0}" height="{y1 - y0}" fill="#8A6A55"/>'
    cid = doc.clip(f'M{x0},{y0} L{x1},{y0} L{x1},{y1} L{x0},{y1}Z'); inner = ''
    for ri_, y in enumerate(range(int(y0), int(y1), bh)):
        for x in range(int(x0) - (bw // 2 if ri_ % 2 else 0), int(x1), bw):
            c = mix(base, r.choice(['#FFFFFF', '#3A1C26', '#E8B070']), r.uniform(.02, .22))
            inner += f'<rect x="{x + 3}" y="{y + 3}" width="{bw - 6}" height="{bh - 6}" rx="3" fill="{c}"/><rect x="{x + 3}" y="{y + 3}" width="{bw - 6}" height="7" fill="#fff" opacity=".18"/>'
            if r.random() < .25: inner += f'<circle cx="{x + r.uniform(10, bw - 10):.0f}" cy="{y + r.uniform(10, bh - 10):.0f}" r="{r.uniform(3, 9):.0f}" fill="#5A3A2A" opacity=".25"/>'
    return f'{o}<g clip-path="url(#{cid})">{inner}</g>'

def cable(doc, pts, w=7, col='#1B1B1F'):
    d = d_smooth(pts, False)
    return f'<path d="{d}" stroke="{INKC}" stroke-width="{w + 4}" fill="none" stroke-linecap="round"/><path d="{d}" stroke="{col}" stroke-width="{w}" fill="none" stroke-linecap="round"/><path d="{d}" stroke="#fff" stroke-width="1.6" fill="none" opacity=".25" transform="translate(-1.5 -1.5)"/>'

def scooter(doc, x, y, s=1.0, col='#D9544A'):
    """parked scooter, side view; (x,y) = ground under the rear wheel centre"""
    def W_(cx, cy, r):
        o = f'<circle cx="{cx}" cy="{cy}" r="{r}" fill="#1B1B1F" stroke="{INKC}" stroke-width="5"/><circle cx="{cx}" cy="{cy}" r="{r * .62:.0f}" fill="{P(doc, "#E8ECEF", "#7D8791")}" stroke="{INKC}" stroke-width="4"/>'
        o += ''.join(f'<line x1="{cx}" y1="{cy}" x2="{cx + r * .6 * math.cos(math.radians(a)):.0f}" y2="{cy + r * .6 * math.sin(math.radians(a)):.0f}" stroke="#5B6773" stroke-width="4"/>' for a in range(0, 360, 60))
        return o + f'<circle cx="{cx}" cy="{cy}" r="{r * .16:.0f}" fill="#3A4047"/>'
    o = shadow(doc, x + 120 * s, y + 6, 190 * s, 14, .5, 8)
    o += G(W_(0, -44, 44), x, y, 0, s) + G(W_(0, -44, 44), x + 230 * s, y, 0, s)
    body = bez((-30, -60), (-40, -130), (60, -150), (150, -118), 14)[:-1] + bez((150, -118), (200, -140), (230, -150), (250, -112), 12)[:-1] + bez((250, -112), (262, -80), (236, -44), (214, -44), 10)[:-1] + bez((214, -44), (170, -50), (80, -56), (30, -48), 12)[:-1] + bez((30, -48), (0, -44), (-30, -44), (-30, -60), 8)
    o += G(O(doc, tr(body, 0, 0, 1), P(doc, mix(col, '#FFFFFF', .28), col, mix(col, '#2A1020', .5)), 'fg', f'<path d="M40,-120 Q110,-140 170,-124" stroke="#fff" stroke-width="8" fill="none" opacity=".5" stroke-linecap="round"/>', 7, 1.0), x, y, 0, s)
    o += G(O(doc, R(10, -150, 120, -128, 12, 1, 8), P(doc, '#3A2A24', '#1B1210'), 'fg', '', 8, .9), x, y, 0, s)           # seat
    o += G(f'<path d="M228,-148 L214,-208 M196,-212 L236,-206" stroke="{INKC}" stroke-width="14" stroke-linecap="round"/><path d="M228,-148 L214,-208" stroke="#8E98A3" stroke-width="7" stroke-linecap="round"/><ellipse cx="248" cy="-190" rx="14" ry="22" fill="#FFF3C4" stroke="{INKC}" stroke-width="4"/>', x, y, 0, s)
    return o
