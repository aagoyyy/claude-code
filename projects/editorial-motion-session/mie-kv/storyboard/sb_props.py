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
    """parked automatic scooter, side view facing right; (x,y) = ground contact under the rear wheel"""
    body_g = P(doc, mix(col, '#FFFFFF', .30), col, mix(col, '#2A1020', .55))
    dark_g = P(doc, '#4A4F57', '#23262B', '#101215')
    def wheel(cx, cy, r, disc=False):
        o = O(doc, E(cx, cy, r, r, .6, int(cx) % 50 + 1), '#1B1B1F', 'fg', f'<circle cx="{cx}" cy="{cy}" r="{r * .88:.0f}" fill="none" stroke="#3A3F46" stroke-width="3" opacity=".8"/>', int(cx) % 50 + 1, .9)
        o += O(doc, E(cx, cy, r * .66, r * .66, .5, 3), RG(doc, (0, '#F4F6F7'), (.6, '#B9C1C8'), (1, '#6E7882'), c=(.35, .3), r=.9), 'mid', '', 3, .8)
        for a in range(0, 360, 72):
            a0, a1 = math.radians(a - 16), math.radians(a + 16)
            o += f'<path d="M{cx + r * .18 * math.cos(a0):.1f},{cy + r * .18 * math.sin(a0):.1f} L{cx + r * .6 * math.cos(a0):.1f},{cy + r * .6 * math.sin(a0):.1f} L{cx + r * .6 * math.cos(a1):.1f},{cy + r * .6 * math.sin(a1):.1f} L{cx + r * .18 * math.cos(a1):.1f},{cy + r * .18 * math.sin(a1):.1f}Z" fill="#4A525B" opacity=".85"/>'
        if disc: o += f'<circle cx="{cx}" cy="{cy}" r="{r * .5:.0f}" fill="none" stroke="#2A2F35" stroke-width="3" stroke-dasharray="6 5"/>'
        return o + f'<circle cx="{cx}" cy="{cy}" r="{r * .16:.0f}" fill="#E8ECEF" stroke="{INKC}" stroke-width="3"/>'
    o = ''
    o += wheel(0, -54, 54)
    # exhaust (muffler) under the rear body
    o += O(doc, Pl([(30, -50), (150, -56), (160, -38), (160, -26), (30, -26)], 14, .8, 11), P(doc, '#D5DBE0', '#7E8A96', '#3A4047'), 'mid', f'<rect x="40" y="-52" width="110" height="9" fill="#fff" opacity=".5"/><rect x="110" y="-58" width="42" height="34" fill="#23262B" opacity=".55"/>', 11, .9)
    # rear shock
    o += f'<path d="M20,-150 L8,-66" stroke="{INKC}" stroke-width="12" stroke-linecap="round"/><path d="M20,-150 L8,-66" stroke="#E8C25A" stroke-width="7" stroke-linecap="round" stroke-dasharray="6 4"/>'
    # rear cowl / side cover (big sweeping body over the rear wheel)
    cowl = bez((-62, -88), (-70, -150), (-30, -180), (40, -176), 14)[:-1] + bez((40, -176), (90, -174), (130, -168), (176, -150), 12)[:-1] + bez((176, -150), (168, -112), (160, -86), (150, -70), 10)[:-1] + bez((150, -70), (96, -78), (60, -100), (48, -92), 10)[:-1] + bez((48, -92), (36, -72), (-10, -62), (-62, -88), 10)
    o += O(doc, Pl(cowl, 16, 1.0, 12), body_g, 'fg', f'<path d="M-30,-150 Q40,-176 150,-158" fill="none" stroke="#fff" stroke-width="9" opacity=".5" stroke-linecap="round"/><path d="M-20,-102 Q50,-84 140,-96" fill="none" stroke="{mix(col, "#2A1020", .5)}" stroke-width="4" opacity=".7"/><rect x="60" y="-150" width="80" height="26" rx="6" fill="{mix(col, "#2A1020", .35)}" opacity=".35"/>', 12, 1.0)
    o += O(doc, R(-72, -140, -56, -112, 6, .8, 13), P(doc, '#FF6A5A', '#B8281F'), 'fg', '', 13, .8)                                           # tail light
    # seat
    seat = bez((-16, -176), (0, -196), (110, -200), (170, -186), 14)[:-1] + bez((170, -186), (180, -176), (176, -166), (160, -164), 6)[:-1] + bez((160, -164), (90, -170), (20, -170), (-10, -166), 10)
    o += O(doc, Pl(seat, 14, .8, 14), P(doc, '#4A3A34', '#2A1E1A', '#120D0B'), 'fg', f'<path d="M0,-190 Q80,-198 160,-184" stroke="#fff" stroke-width="5" fill="none" opacity=".25" stroke-linecap="round"/>', 14, .9)
    # floorboard
    o += O(doc, R(150, -72, 232, -52, 8, .8, 15), P(doc, '#4A4F57', '#1E2227'), 'fg', ''.join(f'<line x1="{160 + k * 14}" y1="-70" x2="{160 + k * 14}" y2="-54" stroke="#8E98A3" stroke-width="3" opacity=".6"/>' for k in range(5)), 15, .8)
    # front wheel, fork, fender
    o += wheel(262, -54, 54, True)
    o += f'<path d="M232,-196 L262,-54" stroke="{INKC}" stroke-width="18" stroke-linecap="round"/><path d="M232,-196 L262,-54" stroke="{P(doc, "#E8ECEF", "#7E8A96", h=True)}" stroke-width="11" stroke-linecap="round"/>'
    fend = bez((222, -70), (232, -108), (296, -112), (312, -74), 12)
    o += O(doc, Pl(fend + [(300, -62), (234, -62)], 12, .6, 16), body_g, 'fg', '', 16, .9)
    # leg shield + front cowl
    shield = bez((190, -72), (196, -150), (206, -208), (240, -214), 14)[:-1] + bez((240, -214), (276, -214), (286, -170), (282, -128), 10)[:-1] + bez((282, -128), (280, -100), (262, -80), (244, -72), 8)
    o += O(doc, Pl(shield, 14, .9, 17), body_g, 'fg', f'<path d="M205,-170 Q214,-204 238,-206" fill="none" stroke="#fff" stroke-width="8" opacity=".5" stroke-linecap="round"/><path d="M214,-100 Q250,-92 272,-112" fill="none" stroke="{mix(col, "#2A1020", .5)}" stroke-width="4" opacity=".7"/>', 17, 1.0)
    # handlebar, grip, mirror, headlight, dash
    o += f'<path d="M238,-212 L226,-246" stroke="{INKC}" stroke-width="14" stroke-linecap="round"/><path d="M238,-212 L226,-246" stroke="#8E98A3" stroke-width="7" stroke-linecap="round"/>'
    o += O(doc, R(196, -258, 250, -240, 8, .8, 18), P(doc, '#4A4F57', '#101215'), 'fg', '', 18, .8)
    o += f'<path d="M232,-250 L252,-300" stroke="{INKC}" stroke-width="6" stroke-linecap="round"/>' + O(doc, E(260, -306, 22, 14, .6, 19), P(doc, '#E8ECEF', '#7E8A96'), 'mid', f'<ellipse cx="256" cy="-308" rx="12" ry="6" fill="#fff" opacity=".6"/>', 19, .7)
    o += O(doc, E(286, -202, 17, 23, .8, 20), RG(doc, (0, '#FFFFFF'), (.5, '#FFF3C4'), (1, '#E8C25A'), c=(.4, .4), r=.8), 'fg', '', 20, .9)
    o += O(doc, R(212, -246, 240, -228, 6, .6, 21), P(doc, '#23262B', '#101215'), 'mid', f'<circle cx="226" cy="-237" r="6" fill="#3A6FA8"/>', 21, .6)
    o += glow(doc, 300, -202, 50, '#FFE8A8', .4)
    return shadow(doc, x + 140 * s, y + 6, 230 * s, 14 * s, .5, 8) + G(o, x, y, 0, s)
