"""Realism layer for people: layered skin shading, detailed face, strand hair, fingered hands, fabric texture. Same light logic as the kit (key light upper-left)."""
from sb_common import *

def fabric_noise(doc, x, y, w, h, op=.18, seed=3):
    f = doc.filt(f'<feTurbulence type="fractalNoise" baseFrequency="0.9 0.6" numOctaves="2" seed="{seed}"/><feColorMatrix type="matrix" values="0 0 0 0 .2  0 0 0 0 .15  0 0 0 0 .1  1.2 0 0 0 -.45"/>', '0%', '0%', '100%', '100%')
    return f'<rect x="{x:.0f}" y="{y:.0f}" width="{w:.0f}" height="{h:.0f}" filter="url(#{f})" opacity="{op}"/>'

def soft(doc, shape, col, op, sd):
    return f'<g opacity="{op}" filter="url(#{doc.blur(sd)})">{shape.replace("FILL", col)}</g>'

def skin_base(doc, skin):
    return RG(doc, (0, mix(skin, '#FFFFFF', .30)), (.45, mix(skin, '#FFD9B8', .12)), (.8, skin), (1, mix(skin, '#6A2E24', .28)), c=(.36, .3), r=.95)

def eye(doc, x, y, sg, s, iris='#6B4426'):
    """almond eye: sclera with lid shadow, iris gradient, pupil, catchlights, lid + crease + lashes. (x,y) = eye centre in screen px, s = scale"""
    def p(dx, dy): return (x + dx * s, y + dy * s)
    inner, outer = p(-sg * 12, 2.5), p(sg * 12.5, -1.2)
    up = p(0, -9.2); lo = p(.5, 6)
    shape = f'M{inner[0]:.1f},{inner[1]:.1f} Q{up[0] - sg * 2 * s:.1f},{up[1]:.1f} {outer[0]:.1f},{outer[1]:.1f} Q{lo[0]:.1f},{lo[1] + 1.5 * s:.1f} {inner[0]:.1f},{inner[1]:.1f}Z'
    cid = doc.clip(shape)
    ir = RG(doc, (0, mix(iris, '#E0B070', .45)), (.55, iris), (1, mix(iris, '#140A06', .65)), c=(.5, .6), r=.55)
    sc = P(doc, '#C9B8AA', '#F8F2EA', '#E9DFD2')
    o = f'<path d="{shape}" fill="{sc}"/>'
    o += f'<g clip-path="url(#{cid})"><circle cx="{x + sg * 1.4 * s:.1f}" cy="{y - 1.2 * s:.1f}" r="{7.4 * s:.1f}" fill="{ir}"/><circle cx="{x + sg * 1.4 * s:.1f}" cy="{y - 1.2 * s:.1f}" r="{7.4 * s:.1f}" fill="none" stroke="#1A0E08" stroke-width="{1.4 * s:.1f}" opacity=".75"/>'
    o += f'<circle cx="{x + sg * 1.4 * s:.1f}" cy="{y - 1.2 * s:.1f}" r="{3.1 * s:.1f}" fill="#0C0605"/><circle cx="{x + (sg * 1.4 - 2.6) * s:.1f}" cy="{y - 3.6 * s:.1f}" r="{1.9 * s:.1f}" fill="#fff" opacity=".95"/><circle cx="{x + (sg * 1.4 + 2.4) * s:.1f}" cy="{y + 1.6 * s:.1f}" r="{.9 * s:.1f}" fill="#fff" opacity=".7"/>'
    o += f'<rect x="{x - 14 * s:.1f}" y="{y - 12 * s:.1f}" width="{28 * s:.1f}" height="{9 * s:.1f}" fill="#3A1C14" opacity=".32" filter="url(#{doc.blur(1.6 * s)})"/></g>'
    o += f'<path d="M{inner[0]:.1f},{inner[1]:.1f} Q{up[0] - sg * 2 * s:.1f},{up[1] - .8 * s:.1f} {outer[0]:.1f},{outer[1]:.1f}" fill="none" stroke="#1A0E08" stroke-width="{2.6 * s:.1f}" stroke-linecap="round"/>'
    o += f'<path d="M{inner[0] + sg * 2 * s:.1f},{inner[1] + 2 * s:.1f} Q{lo[0]:.1f},{lo[1] + 1.8 * s:.1f} {outer[0] - sg * 1 * s:.1f},{outer[1] + 1 * s:.1f}" fill="none" stroke="#8A5A44" stroke-width="{1.1 * s:.1f}" opacity=".7" stroke-linecap="round"/>'
    o += f'<path d="M{inner[0] + sg * 3 * s:.1f},{inner[1] - 7 * s:.1f} Q{up[0] - sg * 2 * s:.1f},{up[1] - 5.5 * s:.1f} {outer[0] + sg * 1 * s:.1f},{outer[1] - 4.2 * s:.1f}" fill="none" stroke="#8A5A44" stroke-width="{1.3 * s:.1f}" opacity=".55" stroke-linecap="round"/>'    # lid crease
    for k in range(4): o += f'<path d="M{outer[0] - sg * k * 2.6 * s:.1f},{outer[1] - (k * .9) * s:.1f} l{sg * 2.4 * s:.1f},{-3.4 * s:.1f}" stroke="#1A0E08" stroke-width="{1.1 * s:.1f}" stroke-linecap="round" opacity=".8"/>'
    return o

def brow(doc, x, y, sg, s, col='#2A1B15', seed=1):
    r = random.Random(seed + sg); o = ''
    pts = [(-sg * 14, 3), (-sg * 6, -2), (sg * 6, -4.4), (sg * 17, -1.2), (sg * 24, 4)]
    for i in range(34):
        t = i / 33; dx = -sg * 14 + (sg * 24 + sg * 14) * t; arch = -4.6 * math.sin(math.pi * t * .92 + .1) + 2.4 * (1 - t) * (-0 if False else 0)
        yy = 3.6 - 7.6 * math.sin(math.pi * (t * .85 + .05)) + t * 3
        th = 3.6 * (1 - t * .55) * s
        a = x + dx * s; b = y + yy * s
        o += f'<path d="M{a:.1f},{b + th / 2:.1f} q{sg * 3 * s:.1f},{-th - r.uniform(0, 1.5) * s:.1f} {sg * 5 * s:.1f},{-th * .5 - 1:.1f}" stroke="{col}" stroke-width="{1.2 * s:.1f}" fill="none" stroke-linecap="round" opacity="{r.uniform(.55, .95):.2f}"/>'
    return o

def face_front(doc, cx, cy, s, skin, seed=1):
    """returns (inner_svg_for_head_clip). Head centre (cx,cy) = middle of the face, width ~104*s, height ~142*s."""
    o = ''
    def X(dx): return cx + dx * s
    def Y(dy): return cy + dy * s
    # --- light & shadow planes (clipped by caller)
    o += f'<ellipse cx="{X(-4)}" cy="{Y(-30)}" rx="{34 * s:.0f}" ry="{20 * s:.0f}" fill="#FFF3E0" opacity=".34" filter="url(#{doc.blur(7 * s)})"/>'               # forehead sheen
    o += f'<rect x="{X(24):.0f}" y="{Y(-80):.0f}" width="{40 * s:.0f}" height="{160 * s:.0f}" fill="{mix(skin, "#3A1C26", .6)}" opacity=".34" filter="url(#{doc.blur(9 * s)})"/>'  # shadow side
    o += f'<ellipse cx="{X(0)}" cy="{Y(66)}" rx="{44 * s:.0f}" ry="{14 * s:.0f}" fill="{mix(skin, "#3A1C26", .6)}" opacity=".4" filter="url(#{doc.blur(6 * s)})"/>'           # under chin
    for sg in (-1, 1):
        o += f'<ellipse cx="{X(sg * 33)}" cy="{Y(24)}" rx="{15 * s:.0f}" ry="{10 * s:.0f}" fill="#E8826E" opacity=".34" filter="url(#{doc.blur(6 * s)})"/>'                  # cheek blood colour
        o += f'<ellipse cx="{X(sg * 22)}" cy="{Y(-14)}" rx="{20 * s:.0f}" ry="{8 * s:.0f}" fill="#7A4630" opacity=".26" filter="url(#{doc.blur(4 * s)})"/>'                  # eye-socket shadow
    # --- nose (planes, not an outline)
    o += f'<path d="M{X(7)},{Y(-6)} Q{X(10)},{Y(14)} {X(12)},{Y(26)}" stroke="#8A4E32" stroke-width="{7 * s:.1f}" fill="none" opacity=".24" filter="url(#{doc.blur(3 * s)})" stroke-linecap="round"/>'
    o += f'<path d="M{X(-5)},{Y(-4)} Q{X(-6)},{Y(14)} {X(-6)},{Y(24)}" stroke="#FFF1DC" stroke-width="{5 * s:.1f}" fill="none" opacity=".45" filter="url(#{doc.blur(2.4 * s)})" stroke-linecap="round"/>'
    o += f'<ellipse cx="{X(-1)}" cy="{Y(25)}" rx="{7 * s:.1f}" ry="{5 * s:.1f}" fill="#FFF1DC" opacity=".42" filter="url(#{doc.blur(2 * s)})"/>'
    o += f'<path d="M{X(-16)},{Y(23)} Q{X(-17)},{Y(33)} {X(-8)},{Y(33)} Q{X(0)},{Y(37)} {X(8)},{Y(33)} Q{X(17)},{Y(33)} {X(16)},{Y(23)}" stroke="#7A4630" stroke-width="{2.2 * s:.1f}" fill="none" opacity=".6" stroke-linecap="round"/>'
    for sg in (-1, 1): o += f'<ellipse cx="{X(sg * 7.4)}" cy="{Y(32.5)}" rx="{3.8 * s:.1f}" ry="{2.2 * s:.1f}" fill="#2A1008" opacity=".65"/>'
    o += f'<ellipse cx="{X(0)}" cy="{Y(38)}" rx="{14 * s:.0f}" ry="{4.4 * s:.1f}" fill="#5A2A1C" opacity=".28" filter="url(#{doc.blur(2.4 * s)})"/>'
    # --- eyes + brows
    for sg in (-1, 1):
        o += eye(doc, X(sg * 24), Y(-4), sg, s, '#6B4426' if seed % 2 else '#4A2E1A')
        o += brow(doc, X(sg * 23), Y(-20), sg, s, '#2A1B15', seed)
    # --- mouth: closed slight smile
    my = 52
    up = f'M{X(-20)},{Y(my - 1)} Q{X(-12)},{Y(my - 7)} {X(-4)},{Y(my - 6)} Q{X(0)},{Y(my - 4)} {X(4)},{Y(my - 6)} Q{X(12)},{Y(my - 7)} {X(20)},{Y(my - 1)} Q{X(0)},{Y(my + 2.4)} {X(-20)},{Y(my - 1)}Z'
    lo_ = f'M{X(-20)},{Y(my - 1)} Q{X(0)},{Y(my + 2.4)} {X(20)},{Y(my - 1)} Q{X(14)},{Y(my + 10)} {X(0)},{Y(my + 11)} Q{X(-14)},{Y(my + 10)} {X(-20)},{Y(my - 1)}Z'
    o += f'<path d="{lo_}" fill="{P(doc, "#D88478", "#B8605A")}"/><path d="{up}" fill="{P(doc, "#B8605A", "#8E403C")}"/>'
    o += f'<path d="M{X(-8)},{Y(my + 5)} Q{X(0)},{Y(my + 7.4)} {X(8)},{Y(my + 5)}" stroke="#FFD8CC" stroke-width="{2.6 * s:.1f}" fill="none" opacity=".6" stroke-linecap="round"/>'
    o += f'<path d="M{X(-21)},{Y(my - 1.6)} Q{X(0)},{Y(my + 3)} {X(21)},{Y(my - 1.6)}" stroke="#5A2420" stroke-width="{1.8 * s:.1f}" fill="none" stroke-linecap="round"/><path d="M{X(-21)},{Y(my - 1.6)} q{-3 * s:.1f},{-2 * s:.1f} {-4.4 * s:.1f},{-4 * s:.1f} M{X(21)},{Y(my - 1.6)} q{3 * s:.1f},{-2 * s:.1f} {4.4 * s:.1f},{-4 * s:.1f}" stroke="#7A4630" stroke-width="{1.4 * s:.1f}" fill="none" opacity=".5" stroke-linecap="round"/>'
    o += f'<path d="M{X(-3)},{Y(40)} Q{X(0)},{Y(43)} {X(3)},{Y(40)}" stroke="#9A5A44" stroke-width="{1.4 * s:.1f}" fill="none" opacity=".5"/>'          # philtrum
    o += f'<ellipse cx="{X(0)}" cy="{Y(68)}" rx="{13 * s:.0f}" ry="{6 * s:.0f}" fill="#7A4630" opacity=".22" filter="url(#{doc.blur(3 * s)})"/>'
    o += f'<path d="M{X(-28)},{Y(40)} Q{X(-22)},{Y(52)} {X(-22)},{Y(62)} M{X(28)},{Y(40)} Q{X(22)},{Y(52)} {X(22)},{Y(62)}" stroke="#8A5236" stroke-width="{1.6 * s:.1f}" fill="none" opacity=".3" filter="url(#{doc.blur(1.2 * s)})"/>'   # smile lines
    r = random.Random(seed)
    for _ in range(95):                                       # light stubble over the jaw + upper lip
        a = r.uniform(0, math.pi); rr = r.uniform(.55, 1.0)
        x = 46 * rr * math.cos(a) * (1 if r.random() < .5 else -1); y = 20 + 52 * rr * math.sin(a) * .98
        if y < 34 and abs(x) < 30: continue
        o += f'<circle cx="{X(x):.1f}" cy="{Y(y):.1f}" r="{r.uniform(.4, .7) * s:.2f}" fill="#2A1B15" opacity="{r.uniform(.15, .34):.2f}"/>'
    return o

def ear(doc, x, y, sg, s, skin):
    sh = E(x, y, 10 * s, 17 * s, .5, 3)
    inner = f'<path d="M{x - sg * 3 * s:.1f},{y - 10 * s:.1f} Q{x + sg * 5 * s:.1f},{y - 8 * s:.1f} {x + sg * 4 * s:.1f},{y + 4 * s:.1f} Q{x + sg * 2 * s:.1f},{y + 12 * s:.1f} {x - sg * 2 * s:.1f},{y + 10 * s:.1f}" stroke="#9A5A3C" stroke-width="{1.6 * s:.1f}" fill="none" opacity=".7"/>'
    inner += f'<ellipse cx="{x:.1f}" cy="{y + 1 * s:.1f}" rx="{3.2 * s:.1f}" ry="{6 * s:.1f}" fill="#7A3E28" opacity=".4"/><ellipse cx="{x:.1f}" cy="{y + 14 * s:.1f}" rx="{3.4 * s:.1f}" ry="{3 * s:.1f}" fill="#D98E78" opacity=".7"/>'
    return O(doc, sh, skin_base(doc, skin), 'mid', inner, int(x), .45)

def hand(doc, x, y, rot, s, skin, side=1, curled=False):
    """relaxed hand built from capsule fingers (ink pass + skin pass + highlight pass)."""
    o = ''
    def cap(pts, w):
        d = d_smooth(pts, False); nonlocal o
        o += f'<path d="{d}" stroke="{INKC}" stroke-width="{(w + 4.6) * s:.1f}" fill="none" stroke-linecap="round" stroke-linejoin="round"/>'
    fingers = [((-24, 12), (-26, 40), (-24, 62), 11), ((-8, 14), (-9, 48), (-8, 74), 12), ((8, 14), (9, 46), (9, 70), 11.4), ((24, 12), (27, 40), (27, 58), 9.6)]
    pal = [(x + (px) * s, y + (py) * s) for px, py in [(-30, -6), (30, -6), (30, 22), (-30, 22)]]
    def T_(p): return (x + p[0] * s * side, y + p[1] * s)
    body = ''
    for (a, b, c, w) in fingers:
        pts = [T_(a), T_(b), T_(c)]
        if curled: pts = [T_(a), T_((b[0] * 1.1, b[1] * .7)), T_((c[0] * .6, c[1] * .5 + 12))]
        d = d_smooth(pts, False)
        body += f'<path d="{d}" stroke="{INKC}" stroke-width="{(w + 4.6) * s:.1f}" fill="none" stroke-linecap="round"/>'
    body += f'<path d="{d_smooth([T_((28, 6)), T_((44, 30)), T_((38, 52))], False)}" stroke="{INKC}" stroke-width="{(14 + 4.6) * s:.1f}" fill="none" stroke-linecap="round"/>'                 # thumb ink
    body += f'<path d="{d_smooth([T_((-30, -6)), T_((30, -6)), T_((32, 22)), T_((-30, 22))])}" fill="{INKC}" stroke="{INKC}" stroke-width="{4.6 * s:.1f}"/>'
    sk = skin_base(doc, skin); sk2 = mix(skin, '#3A1C26', .25)
    for (a, b, c, w) in fingers:
        pts = [T_(a), T_(b), T_(c)]
        if curled: pts = [T_(a), T_((b[0] * 1.1, b[1] * .7)), T_((c[0] * .6, c[1] * .5 + 12))]
        d = d_smooth(pts, False)
        body += f'<path d="{d}" stroke="{skin}" stroke-width="{w * s:.1f}" fill="none" stroke-linecap="round"/><path d="{d}" stroke="#fff" stroke-width="{w * .25 * s:.1f}" fill="none" stroke-linecap="round" opacity=".28" transform="translate({-2 * s} {-1 * s})"/>'
        body += f'<path d="{d}" stroke="{sk2}" stroke-width="{w * .22 * s:.1f}" fill="none" stroke-linecap="round" opacity=".35" transform="translate({3 * s} {1 * s})"/>'
    body += f'<path d="{d_smooth([T_((28, 6)), T_((44, 30)), T_((38, 52))], False)}" stroke="{skin}" stroke-width="{14 * s:.1f}" fill="none" stroke-linecap="round"/>'
    body += f'<path d="{d_smooth([T_((-30, -6)), T_((30, -6)), T_((32, 22)), T_((-30, 22))])}" fill="{skin}"/>'
    body += f'<path d="{d_smooth([T_((-26, 16)), T_((0, 20)), T_((26, 16))], False)}" stroke="{sk2}" stroke-width="{2 * s:.1f}" fill="none" opacity=".5"/>'
    return f'<g transform="rotate({rot} {x} {y})">{body}</g>'

def hair_strands(doc, outline_pts, cx, cy, s, col, seed, n=90, spread=60, length=70, flow=(0, 1)):
    """fine strokes that fan out from the crown and follow the skull; lighter on the key-light side."""
    r = random.Random(seed); o = ''
    a, b = 50 * s, 62 * s
    for i in range(n):
        u = r.uniform(-.96, .96)
        x0, y0 = cx + u * a * .22, cy - b * .98
        xc, yc = cx + u * a * 1.12, cy - b * .15 + r.uniform(-6, 6) * s
        x1, y1 = cx + u * a * r.uniform(.86, 1.0), cy + b * (.62 - .25 * abs(u)) + r.uniform(-4, 6) * s
        lit = u < -.15
        c = mix(col, '#C2A58A', r.uniform(.25, .5)) if lit and r.random() < .6 else mix(col, '#000000', r.uniform(.1, .5))
        o += f'<path d="M{x0:.1f},{y0:.1f} Q{xc:.1f},{yc:.1f} {x1:.1f},{y1:.1f}" stroke="{c}" stroke-width="{r.uniform(.9, 2.1) * s:.2f}" fill="none" stroke-linecap="round" opacity="{r.uniform(.3, .75):.2f}"/>'
    return o
