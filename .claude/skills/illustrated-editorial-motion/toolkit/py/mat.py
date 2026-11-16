"""Material library. Every material has its own SVG technique; all take a depth `d` so they sit in the same atmosphere."""
import math, random
from kit import *

# ---------------------------------------------------------------- STAINLESS STEEL: cylindrical ramp + brushed lines + window reflection + bounce + soot
def steel_body(doc, x0, x1, y0, y1, d=0.0, seed=1, soot=True, flame_glow=None):
    r = random.Random(seed); w = x1 - x0
    g = doc.lg([(0, atm('#56626F', d)), (.07, atm('#C5CED7', d)), (.19, atm('#FFFFFF', d)), (.33, atm('#E2E8ED', d)),
                (.58, atm('#B8C1CA', d)), (.82, atm('#8F9CA8', d)), (1, atm('#525E6B', d))], 0, 0, 1, 0)
    s = f'<rect x="{x0}" y="{y0}" width="{w}" height="{y1 - y0}" fill="url(#{g})"/>'
    for i in range(int((y1 - y0) / 3.3)):                       # brushed grain runs around the circumference
        y = y0 + i * 3.3 + r.uniform(-.6, .6); c = '#FFFFFF' if r.random() < .55 else '#46525E'
        s += f'<line x1="{x0}" y1="{y:.1f}" x2="{x1}" y2="{y + r.uniform(-.5, .5):.1f}" stroke="{c}" stroke-width="{r.uniform(.7, 1.6):.1f}" opacity="{r.uniform(.03, .15):.2f}"/>'
    h = y1 - y0
    # window reflection: tall pane distorted by the cylinder, split by the muntin bar
    rx0, rx1 = x0 + w * .12, x0 + w * .29
    s += f'<path d="M{rx0:.0f},{y0 + 16} L{rx1:.0f},{y0 + 16} L{rx1 + 7:.0f},{y1 - 54} L{rx0 - 3:.0f},{y1 - 54} Z" fill="#fff" opacity="{0.93 - 0.2 * min(1, d * 2.2):.2f}"/>'
    s += f'<rect x="{rx0 - 6:.0f}" y="{y0 + h * .36:.0f}" width="{rx1 - rx0 + 16:.0f}" height="7" fill="{atm("#7E8B97", d)}" opacity=".55"/>'
    s += f'<path d="M{x0 + w * .34:.0f},{y0 + 22} L{x0 + w * .37:.0f},{y0 + 22} L{x0 + w * .385:.0f},{y1 - 70} L{x0 + w * .35:.0f},{y1 - 70} Z" fill="#fff" opacity=".55"/>'
    s += f'<path d="M{x1 - w * .17:.0f},{y0 + 10} L{x1 - w * .08:.0f},{y0 + 10} L{x1 - w * .05:.0f},{y1 - 20} L{x1 - w * .15:.0f},{y1 - 20} Z" fill="{atm("#3F4A57", d)}" opacity=".38"/>'   # core shadow
    s += f'<rect x="{x0}" y="{y1 - h * .24:.0f}" width="{w}" height="{h * .24:.0f}" fill="url(#{doc.lg([(0, "#F0A868", 0), (1, "#F0A868", .42)])})"/>'  # table bounce
    # polished bands & a weld line
    for yy, op in ((y0 + h * .13, .7), (y0 + h * .56, .4)):
        s += f'<path d="M{x0},{yy:.0f} L{x1},{yy:.0f}" stroke="#fff" stroke-width="4" opacity="{op}"/><path d="M{x0},{yy + 5:.0f} L{x1},{yy + 5:.0f}" stroke="#5B6773" stroke-width="2.4" opacity="{op * .8:.2f}"/>'
    if soot: s += f'<ellipse cx="{(x0 + x1) / 2:.0f}" cy="{y1 + 6}" rx="{w * .46:.0f}" ry="{h * .09:.0f}" fill="#0F1218" opacity=".62" filter="url(#{doc.blur(7)})"/>'
    if flame_glow: s += f'<ellipse cx="{(x0 + x1) / 2:.0f}" cy="{y1}" rx="{w * .4:.0f}" ry="{h * .06:.0f}" fill="#8EC8FF" opacity=".6" filter="url(#{doc.blur(8)})"/>'
    return s

def steel_dome(doc, cx, cy, rx, ry, d=0.0, seed=2):
    r = random.Random(seed)
    g = doc.rg([(0, '#FFFFFF'), (.28, atm('#E5EAEF', d)), (.65, atm('#A9B4BF', d)), (1, atm('#6D7A87', d))], .34, .22, .95)
    s = f'<rect x="{cx - rx - 20}" y="{cy - ry - 20}" width="{2 * rx + 40}" height="{2 * ry + 60}" fill="url(#{g})"/>'
    for i in range(14):                                          # concentric brushed arcs (spun on a lathe)
        k = .25 + i * .055
        s += f'<ellipse cx="{cx}" cy="{cy + ry * .55}" rx="{rx * k:.0f}" ry="{ry * k * 1.25:.0f}" fill="none" stroke="{"#fff" if i % 2 else "#52606D"}" stroke-width="1.3" opacity="{r.uniform(.05, .16):.2f}"/>'
    s += f'<path d="M{cx - rx * .8:.0f},{cy - ry * .3:.0f} C{cx - rx * .6:.0f},{cy - ry * .92:.0f} {cx - rx * .2:.0f},{cy - ry * 1.02:.0f} {cx + rx * .05:.0f},{cy - ry * 1.02:.0f}" fill="none" stroke="#fff" stroke-width="15" stroke-linecap="round" opacity=".92"/>'
    s += f'<path d="M{cx - rx * .42:.0f},{cy - ry * .62:.0f} L{cx - rx * .06:.0f},{cy - ry * .78:.0f}" stroke="{atm("#6F7C89", d)}" stroke-width="6" opacity=".5"/>'   # muntin
    s += f'<path d="M{cx + rx * .75:.0f},{cy - ry * .2:.0f} C{cx + rx * .6:.0f},{cy - ry * .8:.0f} {cx + rx * .35:.0f},{cy - ry * .95:.0f} {cx + rx * .1:.0f},{cy - ry * 1.0:.0f}" fill="none" stroke="#4A5663" stroke-width="13" stroke-linecap="round" opacity=".28"/>'
    return s

# ---------------------------------------------------------------- CERAMIC: glaze ramp, window-shaped specular, terminator, bounce, hand-painted bands, unglazed foot
def glaze_body(doc, bx, by, w, h, d=0.0, seed=3):
    t = tones('#FFF8E8', d); s = ''
    g = doc.lg([(0, atm('#FFFFFF', d)), (.34, atm('#FFFBF0', d)), (.68, atm('#EBDFC6', d)), (1, atm('#B7A57F', d))], 0, 0, 1, 0)
    s += f'<rect x="{bx}" y="{by}" width="{w}" height="{h}" fill="url(#{g})"/>'
    s += f'<rect x="{bx}" y="{by + h * .52}" width="{w}" height="{h * .5}" fill="url(#{doc.lg([(0, "#8C7752", 0), (1, "#8C7752", .5)])})"/>'          # lower shade
    s += f'<rect x="{bx + w * .76}" y="{by}" width="{w * .24}" height="{h}" fill="url(#{doc.lg([(0, "#8C7752", 0), (1, "#8C7752", .46)], 0, 0, 1, 0)})"/>'  # terminator
    s += f'<rect x="{bx}" y="{by + h * .78}" width="{w * .75}" height="{h * .26}" fill="url(#{doc.lg([(0, "#E7A267", 0), (1, "#E7A267", .5)])})"/>'      # warm bounce from the mat
    return s

def band(cx, cy, rx, ry, wd, col, seed, op=1, wob_amp=3, span=(0, 1)):
    r = random.Random(seed); pts = []
    for k in range(0, 71):
        a = math.pi * (span[0] + (span[1] - span[0]) * k / 70)
        pts.append((cx - rx * math.cos(a), cy + ry * math.sin(a) + math.sin(k * .8 + seed) * wob_amp + r.uniform(-.8, .8)))
    return f'<path d="{d_line(pts)}" fill="none" stroke="{col}" stroke-width="{wd}" opacity="{op}"/>'

# ---------------------------------------------------------------- WOOD: perspective planks + anisotropic turbulence grain + knots + sheen
def wood_table(doc, VP, y0, y1, seams, tones_, d=0.0, seed=5, x_min=-2000, x_max=3000):
    r = random.Random(seed)
    xat = lambda xb, y: VP[0] + (xb - VP[0]) * (y + -VP[1]) / (y0 - VP[1])
    big = f'{x_min},{y0} {x_max},{y0} {x_max},{y1} {x_min},{y1}'
    base = doc.lg([(0, atm('#E9C092', d)), (.5, atm('#DBA96F', d)), (1, atm('#C48A52', d))])
    s = f'<polygon points="{big}" fill="url(#{base})"/>'
    for i in range(len(seams) - 1):
        a, b = seams[i], seams[i + 1]
        s += f'<polygon points="{xat(a, y0):.1f},{y0} {xat(b, y0):.1f},{y0} {xat(b, y1):.1f},{y1} {xat(a, y1):.1f},{y1}" fill="{atm(tones_[i % len(tones_)], d)}" opacity=".5"/>'
        for g in range(r.randint(5, 8)):
            xb = a + (b - a) * r.uniform(.07, .93); dd = ''
            for k, y in enumerate(range(int(y0), int(y1) + 90, 90)):
                x = xat(xb, y) + math.sin(k * 1.3 + g) * r.uniform(1.5, 5) * (1 + (y - y0) / 500)
                dd += ('M' if k == 0 else ' L') + f'{x:.1f},{y}'
            s += f'<path d="{dd}" fill="none" stroke="#98642F" stroke-width="{r.uniform(1.2, 3.2):.1f}" opacity="{r.uniform(.16, .36):.2f}" stroke-linecap="round"/>'
    # fine fibre: anisotropic fractal noise (SVG filter, deterministic)
    f1 = doc.filt(f'<feTurbulence type="fractalNoise" baseFrequency="0.22 0.010" numOctaves="3" seed="{seed}"/><feColorMatrix type="matrix" values="0 0 0 0 .38  0 0 0 0 .21  0 0 0 0 .09  1.9 0 0 0 -.74"/>', '0%', '0%', '100%', '100%')
    f2 = doc.filt(f'<feTurbulence type="fractalNoise" baseFrequency="0.34 0.018" numOctaves="2" seed="{seed + 9}"/><feColorMatrix type="matrix" values="0 0 0 0 1  0 0 0 0 .92  0 0 0 0 .78  1.5 0 0 0 -.78"/>', '0%', '0%', '100%', '100%')
    s += f'<rect x="{x_min}" y="{y0}" width="{x_max - x_min}" height="{y1 - y0}" filter="url(#{f1})" opacity=".55"/>'
    s += f'<rect x="{x_min}" y="{y0}" width="{x_max - x_min}" height="{y1 - y0}" filter="url(#{f2})" opacity=".4"/>'
    for a in seams:
        s += f'<path d="M{xat(a, y0):.1f},{y0} L{xat(a, y1):.1f},{y1}" stroke="#4E2F19" stroke-width="3.6" opacity=".75"/><path d="M{xat(a, y0) + 3:.1f},{y0} L{xat(a, y1) + 5:.1f},{y1}" stroke="#F6DDB4" stroke-width="2" opacity=".5"/>'
    for (xb, y, rr) in ((300, 1160, 26), (700, 1360, 34), (900, 1640, 30), (60, 1620, 24), (-300, 1500, 28), (1250, 1330, 30)):
        x = xat(xb, y)
        for k, f in enumerate((1, .74, .5, .3)):
            s += f'<ellipse cx="{x:.0f}" cy="{y}" rx="{rr * f * .8:.0f}" ry="{rr * f:.0f}" fill="none" stroke="#6E4222" stroke-width="{2.6 - k * .5:.1f}" opacity=".5"/>'
    for _ in range(26):
        x, y = r.uniform(-200, 1300), r.uniform(y0 + 40, y1 - 80)
        s += f'<path d="M{x:.0f},{y:.0f} l{r.uniform(30, 90):.0f},{r.uniform(-6, 6):.0f}" stroke="#FFE9C4" stroke-width="1.5" opacity=".4" stroke-linecap="round"/>'
    s += f'<rect x="{x_min}" y="{y0}" width="{x_max - x_min}" height="64" fill="url(#{doc.lg([(0, "#3A2214", .48), (1, "#3A2214", 0)])})"/>'
    return s, xat

# ---------------------------------------------------------------- GLASS: tint, back wall, fresnel edges, refracted content, caustic
def glass_cyl(doc, x0, x1, ytop, ybot, d, liquid=None, liq_top=None, ice=False, seed=8, ry=14):
    r = random.Random(seed); w = x1 - x0; cx = (x0 + x1) / 2; rx = w / 2; s = ''
    body = rrect(x0, ytop, x1, ybot, 3, 3, 14, 14)
    s += f'<path d="{d_smooth(body)}" fill="{atm("#DDEBEC", d)}" opacity=".3"/>'
    s += f'<ellipse cx="{cx}" cy="{ytop}" rx="{rx}" ry="{ry}" fill="{atm("#9DB4B6", d)}" opacity=".45"/>'                       # far rim (seen through glass)
    if liquid:
        lt = liq_top or ytop + 30
        lg_ = doc.lg([(0, atm(liquid[0], d)), (.6, atm(liquid[1], d)), (1, atm(liquid[2], d))])
        s += f'<path d="M{x0 + 3},{lt} Q{cx},{lt + ry * 1.4} {x1 - 3},{lt} L{x1 - 6},{ybot - 8} Q{cx},{ybot + 8} {x0 + 6},{ybot - 8} Z" fill="url(#{lg_})" opacity=".92"/>'
        s += f'<ellipse cx="{cx}" cy="{lt}" rx="{rx - 3}" ry="{ry - 3}" fill="{atm(liquid[0], d)}"/><ellipse cx="{cx - 8}" cy="{lt - 2}" rx="{rx * .55:.0f}" ry="{ry * .4:.0f}" fill="#fff" opacity=".45"/>'
        # refraction: content appears shifted inside the walls
        s += f'<path d="M{x0 + 10},{lt + 6} L{x0 + 10},{ybot - 12}" stroke="{atm(liquid[2], d)}" stroke-width="6" opacity=".5"/>'
    if ice:
        for (ix, iy, sz, rot) in ((cx - 26, ytop + 56, 38, -12), (cx + 14, ytop + 92, 42, 10), (cx - 12, ytop + 132, 40, -6), (cx + 22, ytop + 40, 30, 20)):
            sq = rrect(ix - sz / 2, iy - sz / 2, ix + sz / 2, iy + sz / 2, 8, 8, 8, 8, 5)
            s += f'<g transform="rotate({rot} {ix} {iy})"><path d="{d_smooth(sq)}" fill="#F4FBFF" opacity=".55" stroke="#FFFFFF" stroke-width="2.4"/><path d="M{ix - sz * .3:.0f},{iy - sz * .2:.0f} L{ix + sz * .1:.0f},{iy - sz * .3:.0f}" stroke="#fff" stroke-width="3" opacity=".9"/><circle cx="{ix + sz * .15:.0f}" cy="{iy + sz * .15:.0f}" r="3" fill="#fff" opacity=".7"/></g>'
    # fresnel edges, specular strips, condensation
    s += f'<path d="M{x0 + 2},{ytop} L{x0 + 5},{ybot - 10}" stroke="{atm("#2F6F72", d)}" stroke-width="5" opacity=".5"/><path d="M{x1 - 2},{ytop} L{x1 - 5},{ybot - 10}" stroke="{atm("#1E4E52", d)}" stroke-width="6" opacity=".55"/>'
    s += f'<path d="M{x0 + w * .22:.0f},{ytop + 14} L{x0 + w * .24:.0f},{ybot - 24}" stroke="#fff" stroke-width="9" stroke-linecap="round" opacity=".9"/><path d="M{x0 + w * .36:.0f},{ytop + 30} L{x0 + w * .37:.0f},{ybot - 60}" stroke="#fff" stroke-width="3.4" stroke-linecap="round" opacity=".7"/>'
    for _ in range(18):
        px, py = r.uniform(x0 + 6, x1 - 6), r.uniform(ytop + 30, ybot - 14); pr = r.uniform(1.6, 3.6)
        s += f'<circle cx="{px:.1f}" cy="{py:.1f}" r="{pr:.1f}" fill="#fff" opacity=".5"/><circle cx="{px - pr * .3:.1f}" cy="{py - pr * .3:.1f}" r="{pr * .35:.1f}" fill="#fff" opacity=".95"/><path d="M{px - pr:.1f},{py + pr * .8:.1f} q{pr * .9:.1f},{pr * 1.3:.1f} {pr * 2:.1f},0" stroke="#305F63" stroke-width=".8" fill="none" opacity=".45"/>'
    # near rim ellipse = thin lip with highlight
    s += f'<ellipse cx="{cx}" cy="{ytop}" rx="{rx}" ry="{ry}" fill="none" stroke="{atm("#F4FFFF", d)}" stroke-width="3"/><path d="M{x0 + 6},{ytop + 3} Q{cx - 10},{ytop + ry + 3} {cx + 14},{ytop + ry + 2}" fill="none" stroke="#fff" stroke-width="3.4" stroke-linecap="round" opacity=".9"/>'
    return s

# ---------------------------------------------------------------- FABRIC: thread-level weave, fold shading, stitching, frayed edge
def linen(doc, poly_pts, d, seed=21):
    r = random.Random(seed); xs = [p[0] for p in poly_pts]; ys = [p[1] for p in poly_pts]
    x0, x1, y0, y1 = min(xs), max(xs), min(ys), max(ys)
    s = f'<rect x="{x0}" y="{y0}" width="{x1 - x0}" height="{y1 - y0}" fill="url(#{doc.lg([(0, atm("#F4ECD9", d)), (1, atm("#E4D6B8", d))])})"/>'
    f = doc.filt('<feTurbulence type="fractalNoise" baseFrequency="0.55 0.05" numOctaves="2" seed="4"/><feColorMatrix type="matrix" values="0 0 0 0 .55  0 0 0 0 .44  0 0 0 0 .28  1.6 0 0 0 -.62"/>', '0%', '0%', '100%', '100%')
    f_ = doc.filt('<feTurbulence type="fractalNoise" baseFrequency="0.05 0.55" numOctaves="2" seed="8"/><feColorMatrix type="matrix" values="0 0 0 0 .55  0 0 0 0 .44  0 0 0 0 .28  1.6 0 0 0 -.62"/>', '0%', '0%', '100%', '100%')
    s += f'<rect x="{x0}" y="{y0}" width="{x1 - x0}" height="{y1 - y0}" filter="url(#{f})" opacity=".5"/><rect x="{x0}" y="{y0}" width="{x1 - x0}" height="{y1 - y0}" filter="url(#{f_})" opacity=".5"/>'
    # soft folds (a lit ridge beside a shaded valley)
    for (fx, fy, fl, ang) in ((x0 + (x1 - x0) * .22, y0 + 40, 230, 80), (x0 + (x1 - x0) * .7, y0 + 60, 200, 100), (x0 + (x1 - x0) * .48, y0 + 20, 170, 90)):
        a = math.radians(ang); ex, ey = fx + fl * math.cos(a), fy + fl * math.sin(a)
        s += f'<path d="M{fx:.0f},{fy:.0f} L{ex:.0f},{ey:.0f}" stroke="#fff" stroke-width="22" opacity=".28" stroke-linecap="round" filter="url(#{doc.blur(7)})"/><path d="M{fx + 20:.0f},{fy:.0f} L{ex + 22:.0f},{ey:.0f}" stroke="#6E5A3A" stroke-width="20" opacity=".16" stroke-linecap="round" filter="url(#{doc.blur(8)})"/>'
    return s
