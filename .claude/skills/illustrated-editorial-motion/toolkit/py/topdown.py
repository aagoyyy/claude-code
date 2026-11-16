"""Top-down shot: same material library, different projection (planks run parallel, circles not ellipses)."""
import math, random
from kit import *
from mat import *
from mat2 import *

def build_top(doc):
    r = random.Random(77); out = []; A = out.append
    # wood (parallel planks = top-down perspective)
    seams = [-180, 0, 170, 360, 540, 700, 880, 1080, 1260]
    tn = ['#E2B27C', '#DCA970', '#E6B985', '#D8A46B', '#E0B07A', '#DAA76D', '#E4B67F', '#D9A56C']
    ts, _ = wood_table(doc, (540, -9_000_000), 0, 1920, seams, tn, 0.0, 15, -100, 1300)
    A(ts)
    # placemat (slightly rotated, thickness + shadow)
    mat = wob(resample([(120, 380), (960, 360), (990, 1560), (100, 1590)], 220), 2.2, 3)
    A(f'<path d="{d_smooth(mat)}" fill="#2A160B" opacity=".34" transform="translate(16,22)" filter="url(#{doc.blur(12)})"/>')
    mi = linen(doc, mat, 0, 21) + '<path d="M150,410 L930,392 L958,1530 L132,1556 Z" fill="none" stroke="#B9473E" stroke-width="8" opacity=".9"/><path d="M172,432 L910,416 L936,1508 L154,1532 Z" fill="none" stroke="#B9473E" stroke-width="2.4" stroke-dasharray="9 7" opacity=".85"/>'
    A(solid(doc, mat, '#EFE5CF', 'fg', mi, 3, .55)[0])
    # es teh from above (glass material: ring + liquid + ice + straw)
    gx, gy, gr = 800, 1360, 96
    A(f'<ellipse cx="{gx + 38}" cy="{gy + 46}" rx="{gr + 20}" ry="{gr}" fill="#B5651B" opacity=".34" filter="url(#{doc.blur(14)})"/><ellipse cx="{gx + 70}" cy="{gy + 80}" rx="64" ry="34" fill="#FFE2A0" opacity=".6" filter="url(#{doc.blur(7)})"/>')
    A(f'<circle cx="{gx}" cy="{gy}" r="{gr}" fill="#DDEBEC" opacity=".45"/><circle cx="{gx}" cy="{gy}" r="{gr - 12}" fill="url(#{doc.rg([(0, "#F2B35C"), (.7, "#D07F25"), (1, "#8F4710")], .38, .34, .8)})"/>')
    for (ix, iy, sz, rot) in ((gx - 34, gy - 22, 52, -14), (gx + 22, gy + 12, 56, 12), (gx - 10, gy + 40, 48, -4), (gx + 32, gy - 38, 40, 22)):
        A(f'<g transform="rotate({rot} {ix} {iy})"><path d="{d_smooth(rrect(ix - sz / 2, iy - sz / 2, ix + sz / 2, iy + sz / 2, 10, 10, 10, 10, 5))}" fill="#F4FBFF" opacity=".6" stroke="#fff" stroke-width="3"/><path d="M{ix - sz * .3},{iy - sz * .2} L{ix + sz * .1},{iy - sz * .3}" stroke="#fff" stroke-width="4" opacity=".9"/></g>')
    A(f'<circle cx="{gx}" cy="{gy}" r="{gr}" fill="none" stroke="#2F6F72" stroke-width="5" opacity=".5"/><circle cx="{gx}" cy="{gy}" r="{gr - 6}" fill="none" stroke="#fff" stroke-width="3" opacity=".85"/><path d="M{gx - 70},{gy - 52} A86,86 0 0 1 {gx - 20},{gy - 84}" fill="none" stroke="#fff" stroke-width="9" stroke-linecap="round" opacity=".95"/>')
    A(f'<path d="M{gx + 6},{gy + 8} L{gx + 66},{gy - 74}" stroke="#2A1B15" stroke-width="15" stroke-linecap="round"/><path d="M{gx + 6},{gy + 8} L{gx + 66},{gy - 74}" stroke="#fff" stroke-width="10" stroke-linecap="round"/><path d="M{gx + 6},{gy + 8} L{gx + 66},{gy - 74}" stroke="#D9473B" stroke-width="10" stroke-linecap="round" stroke-dasharray="12 16"/>')
    # bowl
    bx, by = 500, 880
    A(f'<circle cx="{bx + 44}" cy="{by + 58}" r="388" fill="#2A160B" opacity=".42" filter="url(#{doc.blur(16)})"/>')
    ring = wob(ell(bx, by, 372, 372, 220), 2.4, 5)
    A(solid(doc, ring, 'url(#' + doc.rg([(0, '#FFFFFF'), (.75, '#FFFBF0'), (1, '#CDBE9A')], .34, .3, .9) + ')', 'fg',
            f'<circle cx="{bx}" cy="{by}" r="360" fill="none" stroke="#C9473F" stroke-width="30" opacity=".95"/><circle cx="{bx}" cy="{by}" r="320" fill="none" stroke="#C9473F" stroke-width="7" opacity=".9"/>'
            f'<path d="M{bx - 300},{by - 150} A340,340 0 0 1 {bx - 120},{by - 322}" fill="none" stroke="#fff" stroke-width="12" stroke-linecap="round" opacity=".95"/>'
            f'<circle cx="{bx}" cy="{by}" r="372" fill="none" stroke="#8C7752" stroke-width="26" opacity=".18" transform="translate(10,12)"/>', 5)[0])
    wall = wob(ell(bx, by, 292, 292, 200), 1.6, 6)
    A(solid(doc, wall, 'url(#' + doc.rg([(0, '#FFFBF0'), (1, '#CDBE9A')], .5, .5, .55) + ')', 'fg', '', 6, .55)[0])
    inner = doc.clip(d_smooth(ell(bx, by, 268, 268, 160)))
    A(f'<circle cx="{bx}" cy="{by}" r="268" fill="url(#{doc.rg([(0, "#B86E2A"), (1, "#6F3A14")])})"/>')
    A(f'<g clip-path="url(#{inner})">{noodle_strands(31, bx - 270, bx + 270, by - 270, by + 270, 150)}</g>')
    A(egg_half(doc, bx - 98, by - 74, 104, 74, 4)); A(pak_choy(doc, bx + 96, by - 84, 1.0, 6))
    A(meatball(doc, bx + 86, by + 86, 48, 1)); A(meatball(doc, bx - 22, by + 108, 42, 2))
    for (x, y, rr) in ((bx - 6, by - 6, 20), (bx + 30, by + 14, 17), (bx - 60, by + 36, 15), (bx + 150, by + 20, 15), (bx - 160, by + 80, 14)): A(chili_slice(doc, x, y, rr, int(x)))
    for (x, y) in ((bx - 44, by + 70), (bx + 20, by + 150), (bx + 168, by - 20), (bx - 150, by - 4), (bx + 4, by - 140)): A(scallion(doc, x, y))
    for _ in range(26):
        a, d_ = r.uniform(0, 6.28), r.uniform(0, 250); x, y = bx + d_ * math.cos(a), by + d_ * math.sin(a)
        A(f'<path d="M{x:.0f},{y:.0f} q5,-5 11,-1" fill="none" stroke="#7A4A18" stroke-width="3" stroke-linecap="round" opacity=".8"/>')
    # steam seen from above = a soft, lit bloom
    A(f'<ellipse cx="{bx + 20}" cy="{by - 10}" rx="270" ry="250" fill="url(#{doc.rg([(0, "#FFFFFF", .5), (.6, "#FFF8E8", .2), (1, "#FFF8E8", 0)])})"/>')
    # chopsticks laid beside the bowl
    for (x1, y1, x2, y2, w_) in ((960, 520, 880, 1500, 11), (1010, 524, 934, 1506, 11)):
        dx, dy = x2 - x1, y2 - y1; Ln = math.hypot(dx, dy); nx, ny = -dy / Ln, dx / Ln
        p4 = [(x1 + nx * w_, y1 + ny * w_), (x2 + nx * 5.5, y2 + ny * 5.5), (x2 - nx * 5.5, y2 - ny * 5.5), (x1 - nx * w_, y1 - ny * w_)]
        sp = wob(resample(p4, 70), .8, int(x1))
        A(f'<path d="{d_smooth(sp)}" fill="#2A160B" opacity=".4" transform="translate(14,14)" filter="url(#{doc.blur(3)})"/>')
        lac = [(x1 + nx * w_, y1 + ny * w_), (x1 + dx * .4 + nx * 9, y1 + dy * .4 + ny * 9), (x1 + dx * .4 - nx * 9, y1 + dy * .4 - ny * 9), (x1 - nx * w_, y1 - ny * w_)]
        inn = f'<polygon points="{" ".join(f"{a:.1f},{b:.1f}" for a, b in lac)}" fill="#8E2F29"/><path d="M{x1 + nx * 5},{y1 + ny * 5} L{x1 + dx * .4 + nx * 3},{y1 + dy * .4 + ny * 3}" stroke="#F08076" stroke-width="3" opacity=".85"/>'
        A(solid(doc, sp, 'url(#' + doc.lg([(0, '#EAD2A6'), (1, '#BF8F5A')], 0, 0, 1, 0) + ')', 'fg', inn, int(x1), .6)[0])
    # price tag lying on the mat
    A('<g transform="translate(150,1330) rotate(-8)">')
    A(f'<rect x="0" y="0" width="420" height="104" rx="18" fill="#2A160B" opacity=".4" transform="translate(12,16)" filter="url(#{doc.blur(5)})"/>')
    tag = wob(resample([(56, 0), (386, 0), (422, 36), (422, 68), (386, 104), (56, 104), (0, 44)], 170), 1.4, 71)
    A(solid(doc, tag, 'url(#' + doc.lg([(0, '#E3665D'), (1, '#BD3F38')]) + ')', 'fg', '<rect x="0" y="0" width="430" height="46" fill="#fff" opacity=".17"/>', 71)[0])
    A('<circle cx="40" cy="44" r="16" fill="#E7C777"/><circle cx="40" cy="44" r="16" fill="none" stroke="#2A1B15" stroke-width="3.6"/><circle cx="40" cy="44" r="6.5" fill="#7E2723"/>')
    A('<text x="236" y="58" text-anchor="middle" font-family="DejaVu Sans Mono, Menlo, monospace" font-weight="700" font-size="32" fill="#fff" stroke="#7E2723" stroke-width="2" paint-order="stroke">Rp 10.000 - 15.000</text></g>')
    # window light + vignette (same key light, now from the upper-left)
    sh = doc.lg([(0, '#FFF6DC', .5), (1, '#FFF6DC', 0)], 0, 0, 1, 1)
    A(f'<polygon points="-100,-100 700,-100 1200,1200 300,1100" fill="url(#{sh})" opacity=".5" filter="url(#{doc.blur(16)})"/>')
    A(f'<rect x="-200" y="-200" width="1500" height="2400" fill="url(#{doc.rg([(0, "#000", 0), (.55, "#000", 0), (1, "#2A1408", .46)], 540, 960, 1150, user=True)})"/>')
    return out
