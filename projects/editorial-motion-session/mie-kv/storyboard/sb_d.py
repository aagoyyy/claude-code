from sb_common import *
from sb_c import bowl_side
from sb_props import *

def _bg_wall(doc, b, top='#F3E7CF', bot='#E4D2AC', h=1300):
    b.append(f'<rect width="{W}" height="{h}" fill="{P(doc, top, bot)}"/>')
    b.append(f'<rect width="{W}" height="{h}" fill="{RG(doc, (0, "#FFEBC6", .85), (1, "#FFEBC6", 0), c=(.2, .1), r=.9)}"/>')
    r = random.Random(4)
    for _ in range(14): b.append(f'<ellipse cx="{r.uniform(0, W):.0f}" cy="{r.uniform(0, h - 100):.0f}" rx="{r.uniform(90, 220):.0f}" ry="{r.uniform(60, 140):.0f}" fill="{r.choice(["#FFFFFF", "#D7BE98"])}" opacity="{r.uniform(.06, .14):.2f}" filter="url(#{doc.blur(26)})"/>')

def _table(doc, b, y0):
    s, _ = wood_table(doc, (540, -1100), y0, H, [-300, 120, 420, 700, 1000, 1400], ['#D9A56C', '#E5BC8A', '#CFA06A'], 0, 6, -2000, 3000)
    b.append(s); b.append(f'<rect y="{y0}" width="{W}" height="10" fill="#FFEBC6" opacity=".8"/>')

# ============================================================ 6. Margin: a brass balance, the Rp12.000 bowl outweighs the Rp7.000 cost
def panel10():
    doc = Doc(21); b = []; _bg_wall(doc, b); _table(doc, b, 1300)
    # ---- detail layer: wall shelf with bottles and bowls, window light, plant, brass weights
    b.append(f'<polygon points="0,0 380,0 760,1300 120,1300" fill="#fff" opacity=".10"/>')
    b.append(O(doc, R(40, 480, 1040, 520, 4, 1.4, 91), P(doc, '#C99B66', '#8A5A32'), 'fg', f'<rect x="40" y="480" width="1000" height="8" fill="#FFEBC6" opacity=".7"/>', 91, 1.0))
    b.append(bottle(doc, 120, 480, 90, 210, '#5A3622', 'KECAP', '#C9473F', 92) + bottle(doc, 240, 480, 80, 180, '#C2301F', 'SAMBAL', '#2A1B15', 93) + bottle(doc, 350, 480, 80, 170, '#E8C25A', 'MINYAK', '#8A5A32', 94))
    for k_, bx_ in enumerate((760, 880, 990)): b.append(bowl_side(doc, bx_, 478, 150 - k_ * 8, 95 + k_, False))
    b.append(plant(doc, 50, 1300, 1.0, 98))
    for k_, (wx_, ws_) in enumerate(((930, 70), (1000, 54), (880, 46))):
        b.append(O(doc, Pl([(wx_ - ws_, 1290), (wx_ + ws_, 1290), (wx_ + ws_ * .8, 1290 - ws_ * 1.1), (wx_ - ws_ * .8, 1290 - ws_ * 1.1)], 20, .8, 100 + k_), P(doc, '#F6E7A8', '#C9A24A', '#8A6A20', h=True), 'fg', T(wx_, 1290 - ws_ * .4, '1 kg' if ws_ > 60 else '500', ws_ * .5, '#6A4A10', 900), 100 + k_, .8))
    b.append('<!--FG-->')
    cx = 540; ty = 760; tilt = -9                       # beam tilts down on the left (price > cost)
    brass = P(doc, '#F6E7A8', '#C9A24A', '#8A6A20', h=True)
    b.append(shadow(doc, cx + 20, 1310, 260, 26, .4, 12))
    b.append(O(doc, R(cx - 220, 1250, cx + 220, 1306, 20, 2, 3), brass, 'fg', f'<rect x="{cx - 220}" y="1250" width="440" height="14" fill="#fff" opacity=".4"/>', 3, 1.0))
    b.append(O(doc, R(cx - 26, 800, cx + 26, 1256, 12, 1.6, 4), brass, 'fg', f'<rect x="{cx - 14}" y="810" width="8" height="430" fill="#fff" opacity=".5"/>', 4, 1.0))
    L = (cx - 330 * math.cos(math.radians(9)), ty + 330 * math.sin(math.radians(9)))
    Rg = (cx + 330 * math.cos(math.radians(9)), ty - 330 * math.sin(math.radians(9)))
    # beam
    b.append(f'<path d="M{L[0]:.0f},{L[1]:.0f} L{Rg[0]:.0f},{Rg[1]:.0f}" stroke="{INKC}" stroke-width="30" stroke-linecap="round"/><path d="M{L[0]:.0f},{L[1]:.0f} L{Rg[0]:.0f},{Rg[1]:.0f}" stroke="{brass}" stroke-width="20" stroke-linecap="round"/>')
    b.append(O(doc, E(cx, ty, 40, 40, 1, 5), brass, 'fg', '', 5, 1.0))
    pans = {}
    for name, (px, py) in (('L', L), ('R', Rg)):
        pdrop = 300
        by = py + pdrop
        pans[name] = (px, by)
        b.append(f'<path d="M{px},{py} L{px - 150},{by - 30} M{px},{py} L{px + 150},{by - 30} M{px},{py} L{px},{by - 30}" stroke="{INKC}" stroke-width="5" opacity=".85"/>')
        b.append(O(doc, E(px, py, 14, 14, .6, 9), brass, 'mid', '', 9, .8))
    # left pan: the bowl + tag
    px, by = pans['L']
    b.append(shadow(doc, px + 10, by + 30, 170, 18, .35, 8))
    b.append(O(doc, [(px - 170, by - 30), (px + 170, by - 30), (px + 120, by + 24), (px - 120, by + 24)], brass, 'fg', f'<rect x="{px - 170}" y="{by - 30}" width="340" height="10" fill="#fff" opacity=".4"/>', 11, 1.0) if False else O(doc, Pl([(px - 170, by - 30), (px + 170, by - 30), (px + 120, by + 24), (px - 120, by + 24)], 30, 1, 11), brass, 'fg', f'<rect x="{px - 170}" y="{by - 30}" width="340" height="10" fill="#fff" opacity=".4"/>', 11, 1.0))
    b.append(bowl_side(doc, px, by - 28, 250, 12, True))
    b.append(smoke(doc, [(px - 30, by - 150, 170, 16), (px + 40, by - 150, 150, 14)], 3, .6, 14, 26, 3))
    b.append(tag(doc, px + 90, by + 110, 'Rp 12.000', -4, .85, RED, 52))
    # right pan: the ingredients (cost): coin stacks + a noodle brick + egg
    px, by = pans['R']
    b.append(shadow(doc, px + 10, by + 30, 170, 18, .35, 8))
    b.append(O(doc, Pl([(px - 170, by - 30), (px + 170, by - 30), (px + 120, by + 24), (px - 120, by + 24)], 30, 1, 12), brass, 'fg', f'<rect x="{px - 170}" y="{by - 30}" width="340" height="10" fill="#fff" opacity=".4"/>', 12, 1.0))
    for k, (dx, n) in enumerate(((-90, 3), (-30, 4), (30, 2), (90, 3))):
        for j in range(n): b.append(coin(doc, px + dx, by - 48 - j * 18, 36, '#D8B454' if (k + j) % 2 else '#C9CED2', 0, '1000').replace('<ellipse', '<ellipse', 1))
    b.append(O(doc, E(px - 150, by - 54, 34, 44, 1, 14), RG(doc, (0, '#FFF8EA'), (.55, '#F3DCB4'), (1, '#C9A06A'), c=(.34, .28), r=.9), 'mid', '', 14, .8))
    b.append(tag(doc, px, by + 110, 'Rp 7.000', 4, .9, '#3A6FA8', 52))
    return page(doc, ''.join(b), grain_and_vignette(doc, .34))

# ============================================================ 7. Opening hours: roll-up shutter half open at dawn, wall clock, BUKA sign
def panel11():
    doc = Doc(22); b = []
    b.append(f'<rect width="{W}" height="900" fill="{P(doc, "#7FA8D0", "#F7C98B", "#FFE9B8")}"/>')
    b.append(f'<circle cx="840" cy="560" r="130" fill="{RG(doc, (0, "#FFF8DD", 1), (.5, "#FFE9A8", .7), (1, "#FFE9A8", 0))}"/>')
    # facade
    b.append(O(doc, R(0, 640, W, H, 2, 2, 3), P(doc, '#EBD6AE', '#CDAA74'), 'mid', ''.join(f'<line x1="0" y1="{y}" x2="{W}" y2="{y}" stroke="#B89460" stroke-width="2" opacity=".3"/>' for y in range(680, 1900, 46)), 4, 1.0))
    # ---- detail layer: brick plinth, plaster stains, cables, plant, scooter, wall lamp
    b.append(bricks(doc, 0, 1660, W, H, 99, '#B9704E', 46, 110))
    rr_ = random.Random(3)
    for _ in range(10): b.append(f'<ellipse cx="{rr_.uniform(0, W):.0f}" cy="{rr_.uniform(700, 1300):.0f}" rx="{rr_.uniform(40, 120):.0f}" ry="{rr_.uniform(20, 70):.0f}" fill="#8A6A40" opacity="{rr_.uniform(.05, .12):.2f}" filter="url(#{doc.blur(12)})"/>')
    b.append(cable(doc, [(0, 700), (200, 780), (90, 900)], 7) + cable(doc, [(W, 660), (880, 740), (980, 860)], 7))
    b.append(O(doc, R(10, 790, 80, 860, 6, 1.4, 96), P(doc, '#E8ECEF', '#8E98A3'), 'fg', '', 96, .8) + O(doc, [(1000, 770), (1070, 770), (1060, 830), (1010, 830)], P(doc, '#F2E8D2', '#BFAE8E'), 'fg', '', 97, .8) + glow(doc, 1035, 850, 70, '#FFE8A8', .8))
    b.append('<!--FG-->')
    # shutter frame + opening (warm interior glow)
    b.append(O(doc, R(90, 780, 990, 1640, 10, 2, 5), '#2A1B15', 'fg', f'<rect x="100" y="1340" width="880" height="290" fill="{RG(doc, (0, "#FFE7A6"), (.6, "#F7B25A"), (1, "#C26A2E"), c=(.5, .9), r=.8)}"/>' + ''.join(f'<rect x="{150 + k * 90}" y="{1500 - (k % 3) * 18}" width="60" height="{130 + (k % 3) * 18}" fill="{["#C9473F", "#FFFBF0", "#5A3622"][k % 3]}" opacity=".55"/>' for k in range(9)), 5, 1.1))
    # shutter slats (rolled up to y=1340)
    for k, y in enumerate(range(790, 1340, 34)):
        b.append(f'<rect x="100" y="{y}" width="880" height="32" fill="{P(doc, "#B8C4CE", "#7E8C98")}" stroke="{INKC}" stroke-width="3"/><rect x="100" y="{y + 3}" width="880" height="6" fill="#fff" opacity=".35"/><line x1="100" y1="{y + 16}" x2="980" y2="{y + 16}" stroke="#5B6773" stroke-width="2" opacity=".4"/>')
    b.append(O(doc, R(90, 1328, 990, 1360, 6, 1.4, 6), P(doc, '#9AA7B3', '#5B6773'), 'fg', f'<rect x="90" y="1328" width="900" height="8" fill="#fff" opacity=".4"/>', 6, 1.0))
    b.append(f'<path d="M520,1360 L520,1420 L560,1420 L560,1360" fill="none" stroke="{INKC}" stroke-width="8"/>')
    # steam coming out of the opening + light spill on the floor
    b.append(smoke(doc, [(340, 1600, 220, 22), (540, 1600, 260, 26), (740, 1600, 230, 22)], 5, .5, 20, 36, 4))
    b.append(f'<ellipse cx="540" cy="1740" rx="520" ry="120" fill="{RG(doc, (0, "#FFD58A", .6), (1, "#FFD58A", 0))}"/>')
    # wall clock (above the shutter), reads 07:00
    cx, cy = 540, 450
    b.append(shadow(doc, cx + 14, cy + 20, 170, 170, .35, 10))
    b.append(O(doc, E(cx, cy, 168, 168, 1.2, 7), P(doc, '#9A5B2E', '#6A3A1C'), 'fg', '', 7, 1.1))
    b.append(O(doc, E(cx, cy, 140, 140, 1, 8), RG(doc, (0, '#FFFFFF'), (.8, '#F6F0E4'), (1, '#E0D6C2'), c=(.4, .3), r=.9), 'fg',
               ''.join(f'<line x1="{cx + 114 * math.cos(math.radians(a - 90)):.0f}" y1="{cy + 114 * math.sin(math.radians(a - 90)):.0f}" x2="{cx + 130 * math.cos(math.radians(a - 90)):.0f}" y2="{cy + 130 * math.sin(math.radians(a - 90)):.0f}" stroke="{INKC}" stroke-width="{7 if a % 90 == 0 else 4}" stroke-linecap="round"/>' for a in range(0, 360, 30)) +
               f'<line x1="{cx}" y1="{cy}" x2="{cx + 70 * math.cos(math.radians(210 - 90)):.0f}" y2="{cy + 70 * math.sin(math.radians(210 - 90)):.0f}" stroke="{INKC}" stroke-width="12" stroke-linecap="round"/>'
               f'<line x1="{cx}" y1="{cy}" x2="{cx}" y2="{cy - 108}" stroke="{INKC}" stroke-width="7" stroke-linecap="round"/><circle cx="{cx}" cy="{cy}" r="11" fill="{RED}" stroke="{INKC}" stroke-width="4"/>' +
               f'<path d="M{cx - 90},{cy - 90} Q{cx - 30},{cy - 124} {cx + 20},{cy - 118}" stroke="#fff" stroke-width="10" fill="none" opacity=".6" stroke-linecap="round"/>', 8, 1.0))
    b.append(plant(doc, 960, 1900, 1.4, 98))
    b.append(scooter(doc, 60, 1880, 1.1, '#D9544A'))
    # hanging BUKA sign on the shutter handle
    b.append(f'<path d="M820,1360 L820,1450" stroke="{INKC}" stroke-width="5"/>')
    b.append(G(O(doc, R(740, 1440, 900, 1530, 12, 1.5, 9), P(doc, '#E85A4F', RED), 'fg', T(820, 1502, 'BUKA', 46, '#FFF6E3', 900, 'middle', 0, 4), 9, 1.0), 0, 0, 5, 1, 820, 1440))
    return page(doc, ''.join(b), grain_and_vignette(doc, .34))

# ============================================================ 9. Daily operating cost: a bill pad with a red stamp, top-down
def panel12():
    doc = Doc(23); b = []
    s, _ = wood_table(doc, (540, -100000), 0, H, [-300, 150, 460, 760, 1060, 1400], ['#CBA070', '#D9B386', '#C29463'], 0, 9, -400, 1500)
    b.append(s)
    b.append(f'<rect width="{W}" height="{H}" fill="{RG(doc, (0, "#FFEBC6", .35), (1, "#FFEBC6", 0), c=(.25, .15), r=.9)}"/>')
    b.append('<!--FG-->')
    pad = Pl([(150, 300), (930, 270), (960, 1560), (180, 1590)], 50, 3, 3)
    b.append(shadow(doc, 560, 960, 460, 700, .4, 24))
    ledger = ''.join(f'<line x1="200" y1="{420 + i * 78}" x2="900" y2="{405 + i * 78}" stroke="#7BA4C8" stroke-width="2.4" opacity=".6"/>' for i in range(15))
    ledger += f'<path d="M290,300 L305,1560" stroke="{RED}" stroke-width="3" opacity=".7"/>'
    ledger += T(540, 380, 'BIAYA HARIAN', 62, INKC, 900, 'middle', -1, 6)
    for i, (t, v) in enumerate((('Sewa kios', '1.500.000 / bln'), ('Listrik & air', '500.000 / bln'))):
        y = 520 + i * 100
        ledger += T(330, y, t.replace('&', '&amp;'), 40, '#2F4468', 700, 'start', -1) + T(880, y - 10, v, 36, '#2F4468', 700, 'end', -1)
    ledger += f'<path d="M200,800 L910,785" stroke="{INKC}" stroke-width="6"/>'
    ledger += T(330, 900, 'Total / hari', 44, INKC, 800, 'start', -1) + T(880, 890, '± Rp 70.000', 56, RED, 900, 'end', -1)
    b.append(O(doc, pad, P(doc, '#FFFFFF', '#F1E8D2'), 'fg', ledger, 3, 1.0))
    # red stamp
    b.append(G(f'<g opacity=".9"><circle cx="0" cy="0" r="150" fill="none" stroke="{RED}" stroke-width="12"/><circle cx="0" cy="0" r="126" fill="none" stroke="{RED}" stroke-width="4"/>' + T(0, -10, 'HARIAN', 54, RED, 900, 'middle', 0, 6) + T(0, 54, '70 rb', 66, RED, 900) + '</g>', 700, 1250, -14))
    # pen + coins
    b.append(G(O(doc, R(-12, -170, 12, 170, 6, .8, 9), P(doc, '#3A6FA8', '#1E4A7C', h=True), 'fg', f'<rect x="-12" y="-170" width="24" height="26" fill="{INKC}"/><rect x="-3" y="-140" width="5" height="250" fill="#fff" opacity=".4"/>', 9, .8) + f'<polygon points="-12,170 12,170 0,210" fill="{INKC}"/>', 170, 1440, 62))
    for i, (x, y) in enumerate(((140, 1700), (230, 1760), (110, 1800), (860, 1720), (940, 1790))): b.append(coin(doc, x, y, 54, '#D8B454' if i % 2 else '#C9CED2', 0, '1000'))
    b.append(f'<g>' + shadow(doc, 904, 1100, 90, 90, .4, 10) + O(doc, E(880, 1080, 88, 88, 1.2, 60), RG(doc, (0, '#FFFFFF'), (1, '#CDBB93'), c=(.35, .3), r=.9), 'fg', f'<circle cx="880" cy="1080" r="62" fill="{RG(doc, (0, "#7A4A2A"), (1, "#2E1A0E"))}"/><circle cx="860" cy="1060" r="18" fill="#fff" opacity=".3"/>', 60, 1.0) + f'<path d="M960,1050 Q1010,1060 1004,1110 Q996,1150 950,1130" fill="none" stroke="{INKC}" stroke-width="14"/><path d="M960,1050 Q1010,1060 1004,1110 Q996,1150 950,1130" fill="none" stroke="#F4EAD3" stroke-width="8"/></g>')
    b.append(G(O(doc, R(-60, -34, 60, 34, 8, 1.2, 61), P(doc, '#3A3F46', '#1E2227'), 'fg', f'<rect x="-46" y="-20" width="92" height="40" rx="6" fill="{RG(doc, (0, "#E8453A"), (1, "#8A1C16"))}"/>', 61, .9), 880, 1390, -8))
    b.append(G(O(doc, R(-22, -260, 22, 260, 4, .8, 62), P(doc, '#F6E7A8', '#C9A24A', h=True), 'fg', ''.join(f'<line x1="-22" y1="{k_ * 26 - 250}" x2="{-22 + (16 if k_ % 5 == 0 else 9)}" y2="{k_ * 26 - 250}" stroke="{INKC}" stroke-width="2.4"/>' for k_ in range(20)), 62, .8), 60, 700, 4))
    return page(doc, ''.join(b), grain_and_vignette(doc, .34))

# ============================================================ 11. Es teh manis: big glass dispenser + glasses with straws
def panel13():
    doc = Doc(24); b = []; _bg_wall(doc, b, h=1150)
    r = random.Random(7)
    for _ in range(22): b.append(f'<circle cx="{r.uniform(0, W):.0f}" cy="{r.uniform(60, 700):.0f}" r="{r.uniform(18, 46):.0f}" fill="#FFE6A8" opacity="{r.uniform(.25, .55):.2f}" filter="url(#{doc.blur(4)})"/>')
    _table(doc, b, 1150)
    # ---- detail layer: tea tins on a shelf, sugar jar, syrup bottle, lemon board
    b.append(O(doc, R(0, 360, W, 396, 4, 1.4, 71), P(doc, '#C99B66', '#8A5A32'), 'fg', '', 71, 1.0))
    for k_, (tx_, tc_) in enumerate(((90, '#B82D32'), (210, '#4E8A5A'), (330, '#E8C25A'), (850, '#356CAE'), (970, '#80502F'))):
        b.append(O(doc, R(tx_ - 50, 250, tx_ + 50, 360, 10, 1.4, 72 + k_), P(doc, mix(tc_, '#FFFFFF', .25), tc_, mix(tc_, '#1A0A08', .45), h=True), 'mid', f'<rect x="{tx_ - 50}" y="278" width="100" height="40" fill="{CREAM}"/>' + T(tx_, 306, 'TEH', 30, INKC, 900), 72 + k_, .8))
    b.append(bottle(doc, 950, 1150, 90, 210, '#E8A23A', 'SIRUP', '#8A5A32', 78) + O(doc, R(60, 1050, 200, 1150, 14, 1.6, 79), P(doc, '#F6F0E4', '#CDBB93', h=True), 'fg', T(130, 1110, 'GULA', 28, INKC, 900), 79, .8))
    b.append(O(doc, Pl([(40, 1170), (250, 1160), (260, 1230), (50, 1240)], 30, 1.2, 80), P(doc, '#E5BC8A', '#C99B66'), 'fg', '', 80, .9) + ''.join(O(doc, E(100 + k_ * 56, 1190, 24, 18, 1, 81 + k_), RG(doc, (0, '#FFF3A8'), (.8, '#F4D03A'), (1, '#C9A020'), c=(.4, .35), r=.9), 'mid', '', 81 + k_, .5) for k_ in range(3)))
    b.append('<!--FG-->')
    # dispenser (large glass jar with tea, ice, lemon slices, tap + stand)
    x0, x1, yt, yb = 250, 830, 430, 1130
    b.append(shadow(doc, 560, 1148, 360, 30, .45, 14))
    b.append(O(doc, R(x0 + 40, 1090, x1 - 40, 1150, 14, 2, 3), P(doc, '#9A5B2E', '#6A3A1C'), 'fg', '', 3, 1.0))
    b.append(glass_cyl(doc, x0, x1, yt, yb - 40, 0, ('#E6A24B', '#C2701F', '#8A4710'), yt + 90, True, 12, 30))
    for k, (lx, ly) in enumerate(((420, 640), (620, 700), (520, 560))):
        b.append(O(doc, E(lx, ly, 56, 56, 1.2, 20 + k), RG(doc, (0, '#FFF3A8'), (.8, '#F4D03A'), (1, '#C9A020'), c=(.4, .35), r=.9), 'mid',
                   ''.join(f'<line x1="{lx}" y1="{ly}" x2="{lx + 52 * math.cos(math.radians(a)):.0f}" y2="{ly + 52 * math.sin(math.radians(a)):.0f}" stroke="#FFFBE0" stroke-width="3" opacity=".8"/>' for a in range(0, 360, 45)), 20 + k, .6))
    b.append(O(doc, R(x0 + 10, yt - 40, x1 - 10, yt + 4, 12, 1.6, 4), P(doc, '#C9CED2', '#8E98A3'), 'fg', '', 4, 1.0))
    b.append(O(doc, R(530, 1050, 640, 1090, 8, 1.4, 5), P(doc, '#E8ECEF', '#7D8791'), 'fg', '', 5, 1.0) + O(doc, R(572, 1088, 598, 1140, 6, 1, 6), P(doc, '#E8ECEF', '#7D8791', h=True), 'fg', '', 6, .8))
    b.append(f'<path d="M585,1146 q-8,24 0,40 q8,-16 0,-40z" fill="#E6A24B" stroke="#8A4710" stroke-width="2.4"/>')
    # three glasses with straws in the foreground
    for k, gx in enumerate((180, 540, 900)):
        sx0, sx1 = gx - 90, gx + 90
        b.append(shadow(doc, gx + 24, 1700, 110, 22, .45, 8))
        b.append(glass_cyl(doc, sx0, sx1, 1330, 1690, 0, ('#E6A24B', '#C2701F', '#8A4710'), 1380, True, 30 + k, 24))
        b.append(f'<path d="M{gx + 34},1240 L{gx + 6},1560" stroke="#FFFFFF" stroke-width="16" stroke-linecap="round"/><path d="M{gx + 34},1240 L{gx + 6},1560" stroke="{RED}" stroke-width="7" stroke-dasharray="22 22" stroke-linecap="round"/>')
        b.append(O(doc, E(gx - 70, 1336, 44, 44, 1, 40 + k), RG(doc, (0, '#FFF3A8'), (.8, '#F4D03A'), (1, '#C9A020'), c=(.4, .35), r=.9), 'mid', '', 40 + k, .6))
    return page(doc, ''.join(b), grain_and_vignette(doc, .36))
