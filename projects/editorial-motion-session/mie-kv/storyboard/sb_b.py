from sb_common import *
from sb_props import *

# ============================================================ 5. HPP: top-down flat lay, four ingredients each with its own price tag
def panel5():
    doc = Doc(15); b = []
    s, _ = wood_table(doc, (540, -100000), 0, H, [-300, 150, 460, 760, 1060, 1400], ['#CBA070', '#D9B386', '#C29463'], 0, 7, -400, 1500)
    b.append(s)
    # linen cloth under the items
    cloth = Pl([(40, 330), (1040, 360), (1030, 1640), (50, 1620)], 50, 5, 4)
    b.append(shadow(doc, 560, 1000, 520, 640, .35, 24))
    b.append(O(doc, cloth, '#EADFC8', 'mid', linen(doc, cloth, 0, 21), 5, .8))
    b.append(f'<path d="{d_smooth(tr(cloth, 0, 0, 1))}" fill="none" stroke="{RED}" stroke-width="3" stroke-dasharray="14 10" opacity=".0"/>')
    it = []
    # ---- detail layer: chopping board with a knife under the greens, stitched cloth edge, wooden spoon, garlic
    board = Pl([(60, 960), (530, 940), (550, 1500), (80, 1520)], 40, 2, 71)
    it.append(shadow(doc, 310, 1240, 270, 300, .35, 14) + O(doc, board, P(doc, '#E5BC8A', '#C99B66'), 'fg', ''.join(f'<path d="M{70 + k * 60},{950 + k} L{90 + k * 60},1515" stroke="#8A5A32" stroke-width="2.4" opacity=".3"/>' for k in range(8)) + f'<ellipse cx="500" cy="990" rx="16" ry="10" fill="#4E3A28" opacity=".6"/>', 71, 1.0))
    it.append(G(O(doc, R(-14, -150, 14, 30, 8, 1, 72), P(doc, '#9A5B2E', '#6A3A1C', h=True), 'fg', '', 72, .8) + O(doc, Pl([(-14, 30), (14, 30), (20, 250), (-14, 250)], 30, 1, 73), P(doc, '#E8ECEF', '#8E98A3', h=True), 'fg', f'<path d="M-8,40 L-8,240" stroke="#fff" stroke-width="5" opacity=".7"/>', 73, .8), 470, 1180, 28))
    for k_, (gx_, gy_) in enumerate(((120, 1060), (180, 1090), (140, 1140))):
        it.append(O(doc, E(gx_, gy_, 28, 22, 1, 80 + k_), RG(doc, (0, '#FFFFFF'), (1, '#D9CFB8'), c=(.35, .3), r=.9), 'mid', f'<path d="M{gx_ - 4},{gy_ - 20} Q{gx_ + 6},{gy_ - 40} {gx_ + 10},{gy_ - 24}" stroke="#B8A27A" stroke-width="3" fill="none"/>', 80 + k_, .6))
    # ---- (a) noodle brick in a clear wrapper (top-left)
    brick = []
    bx, by = 290, 640
    wrap = Pl([(bx - 190, by - 150), (bx + 190, by - 150), (bx + 190, by + 150), (bx - 190, by + 150)], 30, 1.6, 6)
    nd = f'<rect x="{bx - 190}" y="{by - 150}" width="380" height="300" fill="#E7B258"/>' + ''.join(
        f'<path d="M{bx - 190},{by - 140 + i * 17} q{25},{(-1) ** i * 9} 50,0 t50,0 t50,0 t50,0 t50,0 t50,0 t50,0 t50,0" stroke="{["#F6D58A", "#D9A444", "#FFE9AE"][i % 3]}" stroke-width="9" fill="none" stroke-linecap="round" opacity=".95"/>' for i in range(18))
    nd += f'<path d="M{bx - 190},{by - 150} L{bx + 190},{by - 150} L{bx + 190},{by - 118} L{bx - 190},{by - 118}Z" fill="#fff" opacity=".35"/>'
    nd += f'<rect x="{bx - 190}" y="{by - 150}" width="380" height="300" fill="{P(doc, "#FFFFFF", "#6E3A0A")}" opacity=".16"/><path d="M{bx - 170},{by - 130} L{bx - 90},{by - 130} L{bx - 170},{by - 40}Z" fill="#fff" opacity=".5"/>'
    brick.append(shadow(doc, bx + 14, by + 22, 200, 160, .45, 14) + O(doc, wrap, '#EFC36A', 'fg', nd, 3, 1.0))
    it.append(''.join(brick))
    it.append(tag(doc, bx + 70, by + 215, 'Rp 3.500', -5, .8, RED, 52))
    # ---- (b) one egg on a small plate (top-right)
    ex, ey = 790, 610
    it.append(shadow(doc, ex + 10, ey + 20, 170, 130, .4, 12))
    it.append(O(doc, E(ex, ey, 170, 150, 2, 8), P(doc, '#FFFFFF', '#E6DAC0'), 'fg', f'<ellipse cx="{ex}" cy="{ey}" rx="136" ry="118" fill="none" stroke="#C9B48A" stroke-width="5" opacity=".7"/><ellipse cx="{ex - 40}" cy="{ey - 70}" rx="60" ry="14" fill="#fff" opacity=".8" transform="rotate(-20 {ex} {ey})"/>', 8, 1.0))
    egg = E(ex + 6, ey + 4, 58, 76, 1.4, 9, 70)
    it.append(shadow(doc, ex + 26, ey + 24, 60, 76, .4, 8) + O(doc, egg, RG(doc, (0, '#FFF8EA'), (.55, '#F3DCB4'), (1, '#C9A06A'), c=(.34, .28), r=.9), 'fg',
             f'<ellipse cx="{ex - 18}" cy="{ey - 36}" rx="16" ry="30" fill="#fff" opacity=".85" transform="rotate(-18 {ex} {ey})"/>' + ''.join(f'<circle cx="{ex + random.Random(i).uniform(-34, 40):.0f}" cy="{ey + random.Random(i + 9).uniform(-44, 50):.0f}" r="{random.Random(i + 3).uniform(1, 2.2):.1f}" fill="#9A7448" opacity=".5"/>' for i in range(16)), 9, .9))
    it.append(tag(doc, ex + 40, ey + 215, 'Rp 2.000', 4, .8, RED, 52))
    # ---- (c) greens + chili + sachets (bottom-left)
    gx, gy = 280, 1180
    it.append(pak_choy(doc, gx - 30, gy - 40, .95, 11))
    it.append(chili_slice(doc, gx + 150, gy + 70, 44, 3) + chili_slice(doc, gx + 215, gy + 110, 36, 5) + chili_slice(doc, gx + 120, gy + 150, 32, 8))
    for k, (sx, sy, rot, col) in enumerate(((gx - 90, gy + 170, -14, '#C9473F'), (gx + 30, gy + 205, 8, '#E8B23A'))):
        sc = R(-60, -80, 60, 80, 3, 2, 12 + k)
        zz = ''.join(f'<line x1="{-58 + i * 10}" y1="{-80}" x2="{-58 + i * 10}" y2="{-66}" stroke="#000" stroke-width="2" opacity=".3"/>' for i in range(12))
        it.append(G(shadow(doc, 12, 16, 62, 86, .4, 6) + O(doc, sc, P(doc, mix(col, '#FFFFFF', .25), col, mix(col, '#2A1020', .4)), 'mid', zz + f'<rect x="-60" y="-80" width="120" height="14" fill="#fff" opacity=".3"/>' + T(0, 8, 'BUMBU', 26, '#FFF6E3', 900, 'middle', 0, 2) + T(0, 36, 'RACIK', 20, '#FFE7C2', 800, 'middle', 0, 2) + f'<path d="M-44,-60 L-44,60" stroke="#fff" stroke-width="7" opacity=".4"/>', 13 + k, .8), sx, sy, rot))
    it.append(tag(doc, gx + 170, gy + 290, 'Rp 500', -4, .8, RED, 52))
    # ---- (d) portable gas canister (bottom-right)
    cx_, cy_ = 800, 1160
    can = R(cx_ - 78, cy_ - 220, cx_ + 78, cy_ + 220, 22, 1.6, 15)
    cg = P(doc, '#9A2E28', '#D9544A', '#F4A59B', '#C9473F', '#7A1E1A', h=True)
    cin = f'<rect x="{cx_ - 78}" y="{cy_ - 220}" width="156" height="60" fill="{P(doc, "#C7CDD3", "#8E98A3")}"/><rect x="{cx_ - 78}" y="{cy_ + 160}" width="156" height="60" fill="{P(doc, "#8E98A3", "#C7CDD3")}"/>'
    cin += T(cx_, cy_ - 40, 'GAS', 56, '#FFF6E3', 900, 'middle', -90, 6) .replace('rotate(-90', 'rotate(-90') + f'<path d="M{cx_ - 40},{cy_ - 196} L{cx_ - 40},{cy_ + 200}" stroke="#fff" stroke-width="9" opacity=".5"/>'
    cin += f'<path d="M{cx_ + 52},{cy_ - 200} L{cx_ + 52},{cy_ + 200}" stroke="#2A0A0A" stroke-width="22" opacity=".28"/>'
    it.append(shadow(doc, cx_ + 24, cy_ + 28, 90, 232, .45, 12) + O(doc, can, cg, 'fg', cin, 15, 1.0))
    it.append(f'<circle cx="{cx_}" cy="{cy_ - 224}" r="26" fill="{P(doc, "#E8EBEE", "#7D8791")}" stroke="{INKC}" stroke-width="5"/><circle cx="{cx_}" cy="{cy_ - 224}" r="11" fill="#3A4047"/>')
    it.append(tag(doc, cx_ + 60, cy_ + 290, 'Rp 1.000', 5, .8, RED, 52))
    b.append(G(''.join(it), 0, 0, 0, 1.1, 540, 960))
    # ---- total plate, hand-written style
    tot = R(260, 1700, 860, 1850, 26, 2, 16)
    b.append(shadow(doc, 560, 1790, 330, 90, .4, 14) + O(doc, tot, P(doc, '#E85A4F', RED, '#A3302C'), 'fg', f'<rect x="260" y="1700" width="600" height="34" fill="#fff" opacity=".16"/>' + T(560, 1744, 'TOTAL HPP', 34, '#FFE6D0', 800, 'middle', 0, 8) + T(560, 1832, 'Rp 7.000', 84, '#FFFFFF', 900), 16, 1.1))
    b.append(f'<path d="{d_smooth(Pl([(48, 338), (1032, 366), (1022, 1632), (58, 1612)], 50, 3, 4))}" fill="none" stroke="#B8503E" stroke-width="3" stroke-dasharray="14 10" opacity=".7" transform="translate(0 0)"/>')
    return page(doc, ''.join(b), grain_and_vignette(doc, .32))

# ============================================================ 6. Operating costs: the kios wall (meter, tap, calendar, key)
def panel6():
    doc = Doc(16); b = []
    b.append(f'<rect width="{W}" height="1180" fill="{P(doc, "#F3E7CF", "#E4D2AC")}"/>')
    b.append(f'<rect width="{W}" height="1180" fill="{RG(doc, (0, "#FFEBC6", .8), (1, "#FFEBC6", 0), c=(.2, .1), r=.9)}"/>')
    r = random.Random(4)
    for _ in range(14): b.append(f'<ellipse cx="{r.uniform(0, W):.0f}" cy="{r.uniform(0, 1100):.0f}" rx="{r.uniform(90, 220):.0f}" ry="{r.uniform(60, 140):.0f}" fill="{r.choice(["#FFFFFF", "#D7BE98"])}" opacity="{r.uniform(.06, .14):.2f}" filter="url(#{doc.blur(26)})"/>')
    # tiled lower wall
    for y in range(1180, 1920, 92):
        for x in range(-40, 1120, 92): b.append(f'<rect x="{x + ((y - 1180) // 92 % 2) * 46}" y="{y}" width="88" height="88" rx="5" fill="{P(doc, "#EEF4EE", "#CFDCCF")}" stroke="#A9B8A9" stroke-width="2"/>')
    b.append(f'<rect y="1180" width="{W}" height="26" fill="{P(doc, "#B87B48", "#8A5A32")}"/><rect y="1180" width="{W}" height="6" fill="#FFE2B0" opacity=".7"/>')
    # --- electricity meter (left)
    mx, my = 270, 560
    box = R(mx - 190, my - 270, mx + 190, my + 290, 26, 2, 3)
    b.append(shadow(doc, mx + 22, my + 40, 200, 300, .4, 16))
    b.append(O(doc, box, P(doc, '#D9DEE2', '#9AA4AC', '#6D7882'), 'fg', f'<rect x="{mx - 190}" y="{my - 270}" width="380" height="40" fill="#fff" opacity=".3"/>', 3, 1.1))
    win = E(mx, my - 40, 128, 128, 1.2, 4, 80)
    b.append(O(doc, win, RG(doc, (0, '#FFFFFF'), (.7, '#F2F4F0'), (1, '#CBD3CC'), c=(.4, .3), r=.9), 'fg',
               ''.join(f'<line x1="{mx + 108 * math.cos(math.radians(a)):.0f}" y1="{my - 40 + 108 * math.sin(math.radians(a)):.0f}" x2="{mx + 120 * math.cos(math.radians(a)):.0f}" y2="{my - 40 + 120 * math.sin(math.radians(a)):.0f}" stroke="{INKC}" stroke-width="4"/>' for a in range(0, 360, 30)) +
               f'<g transform="rotate(-38 {mx} {my - 40})"><rect x="{mx - 3}" y="{my - 40 - 96}" width="6" height="96" fill="{RED}"/></g><circle cx="{mx}" cy="{my - 40}" r="12" fill="{INKC}"/>' +
               T(mx, my + 20, 'kWh', 28, INKC, 800), 4, 1.0))
    b.append(O(doc, R(mx - 120, my + 110, mx + 120, my + 190, 8, 1.2, 5), '#1E2326', 'mid', ''.join(f'<rect x="{mx - 108 + i * 40}" y="{my + 120}" width="34" height="60" fill="#F2F0E6"/>' + T(mx - 91 + i * 40, my + 168, str((i * 3 + 4) % 10), 46, INKC, 800) for i in range(6)), 6, .8))
    b.append(f'<path d="M{mx - 150},{my - 20} q-40,20 -20,60" stroke="#fff" stroke-width="10" fill="none" opacity=".45" stroke-linecap="round"/>')
    b.append(f'<path d="M{mx},{my - 270} L{mx},{my - 400}" stroke="{INKC}" stroke-width="16"/><path d="M{mx},{my - 270} L{mx},{my - 400}" stroke="#6D7882" stroke-width="9"/>')
    b.append(f'<g>{glow(doc, mx + 120, my - 230, 40, "#FFD83A", .5)}<polygon points="{mx + 130},{my - 262} {mx + 100},{my - 214} {mx + 124},{my - 214} {mx + 108},{my - 178} {mx + 150},{my - 230} {mx + 126},{my - 230}" fill="#FFD83A" stroke="{INKC}" stroke-width="4"/></g>')
    # --- tap with bucket (center-right)
    tx, ty = 730, 760
    pipe = [(tx - 250, ty - 120), (tx + 30, ty - 120), (tx + 30, ty), (tx + 110, ty), (tx + 110, ty + 110)]
    b.append(f'<path d="{d_line(pipe)}" stroke="{INKC}" stroke-width="58" fill="none" stroke-linejoin="round" stroke-linecap="round"/>')
    b.append(f'<path d="{d_line(pipe)}" stroke="{P(doc, "#E8ECEF", "#9BA7B2")}" stroke-width="46" fill="none" stroke-linejoin="round" stroke-linecap="round"/>')
    b.append(f'<path d="{d_line(pipe)}" stroke="#fff" stroke-width="9" fill="none" stroke-linejoin="round" stroke-linecap="round" opacity=".7" transform="translate(-9 -9)"/>')
    b.append(O(doc, R(tx + 78, ty + 90, tx + 142, ty + 168, 10, 1, 7), P(doc, '#D5DBE0', '#7E8A96', h=True), 'fg', '', 7, .9))
    b.append(O(doc, E(tx + 30, ty - 120, 44, 44, 1, 8, 40), RED, 'fg', f'<circle cx="{tx + 30}" cy="{ty - 120}" r="20" fill="#B8383A"/><path d="M{tx + 30 - 36},{ty - 120} L{tx + 30 + 36},{ty - 120}" stroke="#fff" stroke-width="6" opacity=".6"/>', 8, .9))
    for k in range(3):
        y = ty + 190 + k * 68; wob_ = 6 * (k % 2)
        b.append(f'<path d="M{tx + 110},{y} c-12,18 -14,30 0,38 c14,-8 12,-20 0,-38z" fill="{RG(doc, (0, "#DFF4FF"), (1, "#5AAFD8"), c=(.4, .3), r=.8)}" stroke="#2F6F96" stroke-width="2.4" opacity="{1 - k * .2:.1f}" transform="translate({wob_} 0)"/>')
    bk = [(tx + 20, 1020), (tx + 230, 1020), (tx + 200, 1250), (tx + 50, 1250)]
    b.append(shadow(doc, tx + 150, 1262, 150, 22, .45, 8))
    b.append(O(doc, Pl(bk, 40, 1.4, 9), P(doc, '#4E8FD0', '#2F6AA8', '#1E4A7C', h=True), 'fg', f'<rect x="{tx + 14}" y="1020" width="228" height="28" fill="#1B3F66"/><path d="M{tx + 62},1060 L{tx + 78},1240" stroke="#fff" stroke-width="10" opacity=".4"/><ellipse cx="{tx + 125}" cy="1022" rx="105" ry="12" fill="#BFE6FF"/>', 9, 1.0))
    b.append(f'<path d="M{tx + 24},1024 C{tx - 30},940 {tx + 50},900 {tx + 125},900 S{tx + 238},940 {tx + 228},1024" stroke="{INKC}" stroke-width="6" fill="none" opacity=".85"/>')
    # --- calendar (upper right)
    cx_, cy_ = 905, 240
    cal = R(cx_ - 170, cy_ - 150, cx_ + 170, cy_ + 190, 12, 1.6, 10)
    b.append(shadow(doc, cx_ + 12, cy_ + 30, 180, 190, .38, 12) + O(doc, cal, P(doc, '#FFFFFF', '#F3EAD6'), 'fg',
             f'<rect x="{cx_ - 170}" y="{cy_ - 150}" width="340" height="78" fill="{RED}"/>' + T(cx_, cy_ - 94, 'BULAN INI', 40, '#FFF', 900, 'middle', 0, 6) +
             ''.join(T(cx_ - 138 + i * 46, cy_ - 38, 'SSRKJSM'[i], 22, '#8A7F72', 800) for i in range(7)) +
             ''.join((f'<circle cx="{cx_ - 138 + (d % 7) * 46}" cy="{cy_ + 4 + (d // 7) * 46}" r="21" fill="none" stroke="{RED}" stroke-width="5"/>' if d == 0 else '') + T(cx_ - 138 + (d % 7) * 46, cy_ + 12 + (d // 7) * 46, str(d + 1), 25, INKC if d != 0 else RED, 800) for d in range(28)), 10, 1.0))
    for k in (-60, 60): b.append(f'<circle cx="{cx_ + k}" cy="{cy_ - 150}" r="11" fill="#2A1B15"/><circle cx="{cx_ + k}" cy="{cy_ - 150}" r="5" fill="#EADCC3"/>')
    # --- key on a nail with tag (right of meter)
    kx, ky = 600, 120
    b.append(f'<circle cx="{kx}" cy="{ky}" r="14" fill="{P(doc, "#E8ECEF", "#7D8791")}" stroke="{INKC}" stroke-width="4"/>')
    ring = f'<ellipse cx="{kx}" cy="{ky + 78}" rx="56" ry="60" fill="none" stroke="{INKC}" stroke-width="18"/><ellipse cx="{kx}" cy="{ky + 78}" rx="56" ry="60" fill="none" stroke="{P(doc, "#F6E7A8", "#B8923A")}" stroke-width="10"/>'
    shaft = O(doc, R(kx - 20, ky + 134, kx + 20, ky + 320, 6, 1, 11), P(doc, '#F6E7A8', '#C9A24A', '#8A6A20', h=True), 'fg', f'<rect x="{kx - 6}" y="{ky + 140}" width="6" height="170" fill="#fff" opacity=".6"/>', 11, .8)
    teeth = O(doc, [(kx + 20, ky + 250), (kx + 80, ky + 250), (kx + 80, ky + 286), (kx + 54, ky + 286), (kx + 54, ky + 268), (kx + 20, ky + 268)], P(doc, '#F6E7A8', '#B8923A'), 'fg', '', 12, .8)
    b.append(ring + shaft + teeth)
    b.append(tag(doc, kx + 40, ky + 365, 'Sewa 1,5 jt', -6, .72, '#3A6FA8', 40))
    # price-note stuck to the wall
    note = R(70, 1010, 250, 1160, 4, 2, 14)
    b.append(G(shadow(doc, 14, 18, 100, 80, .3, 6) + O(doc, note, P(doc, '#FFF3A8', '#F6DC62'), 'mid', T(160, 1068, 'LISTRIK', 26, '#7A5A10', 800) + T(160, 1098, '&amp; AIR', 26, '#7A5A10', 800) + T(160, 1140, '500rb', 40, RED, 900), 14, .7), 0, 0, -5, 1, 160, 1085))
    # ---- detail layer: ledge items, cables, mop, plant, wall stain
    b.append(bottle(doc, 380, 1180, 80, 170, '#4E8A5A', 'SABUN', '#FFFBF0', 81) + bottle(doc, 480, 1180, 70, 140, '#6A8FB5', 'PEL', '#2A1B15', 82))
    b.append(plant(doc, 590, 1180, .8, 83))
    b.append(cable(doc, [(mx, my - 400), (mx + 120, my - 470), (mx + 380, my - 440), (W, my - 470)], 8) + cable(doc, [(mx + 190, my + 200), (mx + 260, my + 300), (mx + 200, my + 420)], 6))
    b.append(f'<path d="M960,700 L930,1180" stroke="{INKC}" stroke-width="16" stroke-linecap="round"/><path d="M960,700 L930,1180" stroke="#C9A26A" stroke-width="9" stroke-linecap="round"/>' + O(doc, Pl([(880, 1150), (990, 1160), (980, 1200), (872, 1190)], 20, 1, 84), P(doc, '#E8E0D2', '#B8AE9A'), 'fg', ''.join(f'<line x1="{880 + k_ * 12}" y1="1150" x2="{872 + k_ * 12}" y2="1195" stroke="#8A7F72" stroke-width="2.4"/>' for k_ in range(9)), 84, .8))
    b.append(f'<ellipse cx="860" cy="860" rx="90" ry="46" fill="#8A6A40" opacity=".12" filter="url(#{doc.blur(14)})"/>')
    return page(doc, ''.join(b), grain_and_vignette(doc, .34))
