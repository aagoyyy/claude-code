from sb_common import *
from sb_props import *

# ============================================================ 1. HOOK: top-down, a pack of instant noodles on a warung counter
def panel1():
    doc = Doc(11); b = []
    s, _ = wood_table(doc, (540, -100000), 0, H, [-300, 120, 420, 700, 1000, 1400], ['#D9A56C', '#E5BC8A', '#CFA06A'], 0, 5, -400, 1500)
    b.append(s)
    b.append(f'<rect width="{W}" height="{H}" fill="{RG(doc, (0, "#FFEBC6", .35), (1, "#FFEBC6", 0), c=(.3, .2), r=.8)}"/>')
    # ---- detail layer: a finished bowl, sambal dish, eggs, chopsticks, checkered cloth, crumbs
    b.append(G(f'<rect x="-190" y="-120" width="380" height="240" fill="#F6F0E4"/>' + ''.join(f'<rect x="{-190 + i * 40}" y="{-120 + j * 40}" width="40" height="40" fill="{RED}" opacity=".18"/>' for i in range(10) for j in range(6) if (i + j) % 2 == 0) + f'<rect x="-190" y="-120" width="380" height="240" fill="none" stroke="{INKC}" stroke-width="4"/>', 180, 1480, -8) if False else '')
    b.append(bowl_top(doc, 860, 250, 170, 4))
    for (x0, y0, x1, y1) in ((690, 470, 1010, 150), (720, 490, 1040, 190)):
        b.append(f'<path d="M{x0},{y0} L{x1},{y1}" stroke="{INKC}" stroke-width="16" stroke-linecap="round"/><path d="M{x0},{y0} L{x1},{y1}" stroke="{P(doc, "#E8C98A", "#B8803E")}" stroke-width="10" stroke-linecap="round"/>')
    b.append(shadow(doc, 200, 290, 110, 100, .4, 8) + O(doc, E(190, 270, 100, 100, 1.4, 4), RG(doc, (0, '#FFFFFF'), (1, '#CDBB93'), c=(.35, .3), r=.9), 'fg', f'<circle cx="190" cy="270" r="72" fill="{RG(doc, (0, "#E8453A"), (.7, "#B8281F"), (1, "#7A140F"))}"/><circle cx="170" cy="250" r="22" fill="#fff" opacity=".35"/>' + ''.join(f'<circle cx="{190 + 40 * math.cos(k * 1.3):.0f}" cy="{270 + 34 * math.sin(k * 1.7):.0f}" r="5" fill="#FFB36B" opacity=".8"/>' for k in range(9)), 4, .9))
    for k, (ex, ey, rot) in enumerate(((120, 520, -20), (230, 600, 30))):
        b.append(G(shadow(doc, 14, 16, 40, 54, .4, 5) + O(doc, E(0, 0, 40, 54, 1, 30 + k), RG(doc, (0, '#FFF8EA'), (.6, '#F3DCB4'), (1, '#C9A06A'), c=(.34, .28), r=.9), 'fg', f'<ellipse cx="-12" cy="-22" rx="9" ry="16" fill="#fff" opacity=".8"/>', 30 + k, .8), ex, ey, rot))
    rr = random.Random(9)
    for _ in range(40): b.append(f'<path d="M{rr.uniform(120, 960):.0f},{rr.uniform(1380, 1900):.0f} q6,-8 14,-2" stroke="#E8C25A" stroke-width="4" stroke-linecap="round" fill="none" opacity=".7"/>')
    b.append('<!--FG-->')
    # pack (top-down, pillow shape with crimped fins), rotated
    pk = []
    body = bez((-250, -300), (-268, -120), (-268, 120), (-250, 300), 20)[:-1] + bez((250, 300), (268, 120), (268, -120), (250, -300), 20)
    body = wob(resample(body, 120), 2.0, 3)
    pg = P(doc, '#FFD557', '#F6B93A', '#E48F25', h=True)
    zig = lambda y, sgn: ''.join(f'<path d="M{-250 + i * 25},{y} l12.5,{sgn * 10} l12.5,{-sgn * 10}" stroke="#8A4B12" stroke-width="2" fill="none" opacity=".5"/>' for i in range(20))
    fin_top = f'<rect x="-252" y="-300" width="504" height="46" fill="{P(doc, "#E8A42E", "#F8CB5A")}"/>' + ''.join(f'<line x1="{-250 + i * 12}" y1="-300" x2="{-250 + i * 12}" y2="-254" stroke="#B87318" stroke-width="2.4" opacity=".55"/>' for i in range(42))
    fin_bot = f'<rect x="-252" y="254" width="504" height="46" fill="{P(doc, "#F8CB5A", "#E8A42E")}"/>' + ''.join(f'<line x1="{-250 + i * 12}" y1="254" x2="{-250 + i * 12}" y2="300" stroke="#B87318" stroke-width="2.4" opacity=".55"/>' for i in range(42))
    band = f'<rect x="-260" y="-250" width="520" height="150" fill="{RED}"/><path d="M-260,-100 q130,34 260,0 t260,0 v26 h-520z" fill="{RED}"/>'
    label = f'<ellipse cx="0" cy="40" rx="190" ry="150" fill="{CREAM}" stroke="{INKC}" stroke-width="5"/>'
    clip = doc.clip(d_smooth(ell(0, 40, 178, 138, 60)))
    label += f'<g clip-path="url(#{clip})"><rect x="-190" y="-100" width="380" height="280" fill="{P(doc, "#FFE9B8", "#F4C97A")}"/><g transform="translate(0 20) scale(.55)">{noodle_strands(4, -260, 260, -120, 160, 40, 0)}</g>{egg_half(doc, -60, 70, 70, 48, 5)}{pak_choy(doc, 70, 50, .42, 6)}</g>'
    txt = T(0, -160, 'MIE INSTAN', 78, '#FFF6E3', 900, 'middle', 0, 4) + T(0, -112, 'RASA AYAM BAWANG', 28, '#FFE2B0', 800, 'middle', 0, 6)
    txt += T(0, 226, 'NET 70 g  ·  SIAP MASAK 3 MENIT', 24, '#7A3D0C', 800, 'middle', 0, 2)
    gloss = f'<path d="M-205,-210 C-232,-60 -232,100 -205,240" stroke="#fff" stroke-width="22" fill="none" opacity=".55" stroke-linecap="round"/><path d="M-160,-210 L-160,230" stroke="#fff" stroke-width="5" opacity=".4"/>'
    gloss += f'<path d="M200,-200 C232,-60 232,100 200,230" stroke="#6E2E08" stroke-width="30" fill="none" opacity=".28"/>'
    crinkle = ''.join(f'<path d="M{random.Random(i).uniform(-240, 220):.0f},{random.Random(i + 40).uniform(-220, 240):.0f} l{random.Random(i + 9).uniform(30, 90):.0f},{random.Random(i + 7).uniform(-12, 12):.0f}" stroke="#fff" stroke-width="2.2" opacity=".35" stroke-linecap="round"/>' for i in range(26))
    pk.append(shadow(doc, 26, 30, 270, 330, .5, 18))
    pk.append(O(doc, body, pg, 'fg', band + label + txt + fin_top + fin_bot + gloss + crinkle, 9, 1.1))
    b.append(G(''.join(pk), 540, 800, -14, 1.28))
    b.append(G(tag(doc, 0, 0, 'Rp 3.000', 0, 1.0, RED, 54), 650, 1430, 6, 1.35))
    for i, (x, y, rot) in enumerate(((170, 1560, 0), (270, 1640, 40), (140, 1700, 90))):
        b.append(coin(doc, x, y, 54, '#D8B454' if i != 1 else '#C9CED2', rot, '1000'))
    b.append(coin(doc, 930, 1650, 54, '#C9CED2', 0, '500'))
    # small crumpled receipt
    rc = R(780, 1660, 960, 1860, 3, 3, 5); b.append(G(O(doc, rc, P(doc, '#FFFFFF', '#EFE4CF'), 'mid', ''.join(f'<line x1="796" y1="{1690 + i * 22}" x2="{940 - (i % 3) * 30}" y2="{1690 + i * 22}" stroke="#8A7F72" stroke-width="3" opacity=".7"/>' for i in range(7)), 5, .7), 0, 0, -6, 1, 870, 1760))
    return page(doc, ''.join(b), grain_and_vignette(doc, .34))

# ============================================================ 2. WARMINDO facade at dusk (wide establishing shot)
def panel2():
    doc = Doc(12); b = []
    b.append(f'<rect width="{W}" height="1250" fill="{P(doc, "#232B5C", "#6A4B8C", "#E9855F", "#FFC983")}"/>')
    r = random.Random(3)
    for _ in range(46): b.append(f'<circle cx="{r.uniform(0, W):.0f}" cy="{r.uniform(20, 520):.0f}" r="{r.uniform(1, 2.6):.1f}" fill="#fff" opacity="{r.uniform(.3, .9):.2f}"/>')
    b.append(f'<circle cx="190" cy="200" r="70" fill="{RG(doc, (0, "#FFF8DD", 1), (.55, "#FFF3C4", .95), (.58, "#FFF3C4", .25), (1, "#FFF3C4", 0))}"/>')
    # far skyline
    for i, (x, w, h) in enumerate(((-20, 150, 520), (120, 120, 380), (230, 170, 470), (700, 150, 430), (840, 130, 560), (950, 170, 400))):
        b.append(f'<rect x="{x}" y="{1180 - h}" width="{w}" height="{h}" fill="{mix("#3A3366", "#F2936B", .12 * (i % 3))}" opacity=".85"/>' + ''.join(f'<rect x="{x + 14 + (k % 3) * (w // 3.4):.0f}" y="{1180 - h + 28 + (k // 3) * 46}" width="14" height="20" fill="#FFD58A" opacity="{.8 if (k * 7 + i) % 3 else 0}"/>' for k in range(int(h / 46) * 3)))
    # building body
    b.append(O(doc, R(70, 700, 1010, 1500, 6, 2, 3), P(doc, '#EBD6AE', '#DDBF8E'), 'mid',
               ''.join(f'<line x1="70" y1="{y}" x2="1010" y2="{y}" stroke="#B89460" stroke-width="2" opacity=".35"/>' for y in range(740, 1500, 46)), 4, 1.0))
    b.append(f'<rect x="70" y="700" width="940" height="800" fill="{RG(doc, (0, "#FFB35C", .0), (1, "#2A1B3A", .45), c=(.5, .72), r=.8)}"/>')
    # sign
    sign = R(190, 590, 890, 780, 14, 2, 8)
    b.append(glow(doc, 540, 690, 420, '#FFB35C', .45))
    b.append(O(doc, sign, P(doc, '#2C3A52', NAVY), 'fg', f'<rect x="206" y="606" width="668" height="158" rx="10" fill="none" stroke="#FFD58A" stroke-width="4" opacity=".9"/>', 8, 1.1))
    b.append(T(540, 712, 'WARMINDO', 104, '#FFF2CC', 900, 'middle', 0, 6, 1, f'filter="url(#{doc.blur(0.1)})"'))
    b.append(T(540, 752, 'MIE · KOPI · ES TEH', 34, '#FFB35C', 800, 'middle', 0, 10))
    b.append(glow(doc, 540, 690, 280, '#FFD58A', .28))
    # awning
    aw = Pl([(60, 790), (1020, 790), (1050, 900), (30, 900)], 30, .8, 2)
    stripes = ''.join(f'<polygon points="{60 + i * 120 - (i * 3.75):.0f},790 {180 + i * 120 - (i * 3.75):.0f},790 {180 + i * 120 + 8 - (i * 3.75) + 3:.0f},900 {60 + i * 120 - 8:.0f},900" fill="{RED if i % 2 == 0 else CREAM}"/>' for i in range(8))
    b.append(O(doc, aw, '#fff', 'fg', stripes + f'<rect x="0" y="880" width="1080" height="22" fill="url(#{doc.lg([(0, "#000", 0), (1, "#2A1208", .45)])})"/>', 10, 1.0))
    b.append(''.join(f'<path d="M{60 + i * 120 - 8},900 q60,34 120,0" fill="{RED if i % 2 == 0 else CREAM}" stroke="{INKC}" stroke-width="4"/>' for i in range(8)))
    b.append('<!--FG-->')
    # serving window with warm interior
    win = R(240, 960, 840, 1320, 10, 2, 9)
    inter = f'<rect x="240" y="960" width="600" height="360" fill="{RG(doc, (0, "#FFE7A6"), (.6, "#F7B25A"), (1, "#C26A2E"), c=(.5, .3), r=.9)}"/>'
    inter += f'<rect x="250" y="1010" width="580" height="12" fill="#8A5A32"/><rect x="250" y="1110" width="580" height="12" fill="#8A5A32"/>'
    for k in range(9): inter += f'<rect x="{262 + k * 62}" y="{976 + (k % 2) * 8}" width="34" height="{36 - (k % 2) * 8}" fill="{["#D54F48", "#4E8A5A", "#E8C25A", "#6A8FB5"][k % 4]}" opacity=".9"/>'
    for k in range(7): inter += f'<rect x="{268 + k * 80}" y="{1060 + (k % 2) * 6}" width="44" height="50" rx="6" fill="{["#C9473F", "#FFFBF0", "#5A3622"][k % 3]}" opacity=".9"/>'
    inter += glow(doc, 540, 1000, 160, '#FFF1C0', .9)
    inter += f'<path d="M540,960 L540,1000" stroke="#2A1B15" stroke-width="4"/><ellipse cx="540" cy="1006" rx="26" ry="12" fill="#FFF2CC"/>'
    b.append(O(doc, win, '#2A1B15', 'fg', inter, 12, 1.1))
    # pot + steam on stove behind window
    b.append(f'<g>{steel_body(doc, 360, 520, 1160, 1290, .1, 3, False)}</g>' if False else '')
    b.append(O(doc, R(360, 1160, 520, 1290, 8, 2, 4), P(doc, '#EEF2F5', '#9AA7B3', '#5B6773', h=True), 'mid', '', 5, .9))
    b.append(smoke(doc, [(400, 1160, 150, 16), (470, 1160, 190, 20)], 4, .55, 20, 34, 3))
    # counter shelf + bowls
    b.append(O(doc, R(210, 1310, 870, 1370, 8, 2, 14), P(doc, '#C99B66', '#8A5A32'), 'fg', f'<rect x="210" y="1310" width="660" height="9" fill="#F3DFC0" opacity=".75"/>', 15, 1.1))
    for k, bx in enumerate((300, 480, 640)):
        b.append(shadow(doc, bx + 18, 1312, 70, 10, .4, 4))
        bw = bez((bx - 62, 1274), (bx - 58, 1316), (bx - 24, 1318), (bx, 1318), 10)[:-1] + bez((bx, 1318), (bx + 24, 1318), (bx + 58, 1316), (bx + 62, 1274), 10)
        b.append(O(doc, bw + [(bx - 62, 1274)], P(doc, '#FFFFFF', '#E3D6B8'), 'mid', f'<ellipse cx="{bx}" cy="1274" rx="62" ry="14" fill="#E9B857"/><ellipse cx="{bx - 4}" cy="1272" rx="46" ry="9" fill="#F4CE74"/>', 20 + k, .7))
        b.append(smoke(doc, [(bx, 1262, 110, 12)], 6 + k, .5, 14, 24, 2))
    # menu board (chalk)
    mb = R(110, 1010, 215, 1300, 6, 2, 17)
    b.append(O(doc, mb, '#2F3A34', 'fg', T(162, 1060, 'MENU', 22, '#FFF', 800, 'middle', 0, 3) + ''.join(T(162, 1102 + k * 34, t, 18, '#EADFC4', 700) for k, t in enumerate(('Mie Rebus', 'Mie Goreng', 'Telur +2rb', 'Es Teh'))) + T(162, 1260, '10-15rb', 30, '#FFD58A', 900), 17, .9))
    # string lights
    for (x0, y0, x1, y1, sag) in ((0, 560, 540, 520, 80), (540, 520, 1080, 580, 90)):
        pts = bez((x0, y0), (x0 + (x1 - x0) * .3, y0 + sag * 1.6), (x0 + (x1 - x0) * .7, y1 + sag * 1.6), (x1, y1), 24)
        b.append(f'<path d="{d_smooth(pts, False)}" stroke="#2A1B15" stroke-width="3" fill="none"/>')
        for k in range(2, 23, 2):
            x, y = pts[k]; b.append(glow(doc, x, y + 14, 34, '#FFD58A', .85) + f'<circle cx="{x:.0f}" cy="{y + 14:.0f}" r="9" fill="#FFF7DA" stroke="#2A1B15" stroke-width="2"/>')
    # ground
    b.append(f'<rect y="1500" width="{W}" height="{H - 1500}" fill="{P(doc, "#2B2432", "#1A1520")}"/>')
    b.append(f'<ellipse cx="540" cy="1560" rx="520" ry="90" fill="{RG(doc, (0, "#FFB35C", .6), (1, "#FFB35C", 0))}"/>')
    b.append(f'<path d="M0,1500 L1080,1500" stroke="#FFD58A" stroke-width="3" opacity=".5"/>')
    for k in range(5): b.append(f'<rect x="{80 + k * 220}" y="{1720 + (k % 2) * 40}" width="120" height="10" rx="5" fill="#FFD58A" opacity=".25"/>')
    # no people: a neon BUKA sign beside the window and a service bell on the counter
    b.append(glow(doc, 940, 1050, 90, '#FF6A5A', .35))
    b.append(O(doc, R(868, 1010, 1012, 1090, 16, 2, 31), '#2A1B2A', 'fg', f'<rect x="878" y="1020" width="124" height="60" rx="10" fill="none" stroke="#FF6A5A" stroke-width="5"/>' + T(940, 1066, 'BUKA', 40, '#FFD6CF', 900, 'middle', 0, 6), 31, 1.0))
    b.append(O(doc, E(760, 1306, 26, 10, .8, 7), P(doc, '#F6E7A8', '#B8923A'), 'fg', '', 7, .8) + f'<path d="M744,1306 Q760,1276 776,1306" fill="#F6E7A8" stroke="{INKC}" stroke-width="4"/>')
    # ---- detail layer: bricks, posters, cables, scooter, plants, galon, cooler, wet-road reflections
    b.append(f'<g opacity=".9">{bricks(doc, 70, 1372, 1010, 1500, 6, "#B9704E", 42, 100)}</g>')
    b.append(O(doc, R(890, 1110, 990, 1250, 4, 1.4, 41), P(doc, '#F6E7A8', '#E8C25A'), 'mid', T(940, 1170, 'ES', 34, RED, 900) + T(940, 1208, 'TEH', 34, RED, 900) + T(940, 1238, '3rb', 24, INKC, 800), 41, .6))
    b.append(cable(doc, [(20, 540), (120, 620), (230, 700)], 6) + cable(doc, [(1060, 560), (980, 640), (900, 700)], 6))
    b.append(f'<g opacity=".5">' + ''.join(f'<rect x="{x}" y="1510" width="{w}" height="{h}" fill="{RG(doc, (0, "#FFD58A", .5), (1, "#FFD58A", 0))}"/>' for x, w, h in ((300, 60, 330), (500, 80, 380), (700, 60, 330))) + '</g>')
    b.append(plant(doc, 100, 1500, 1.0, 5) + plant(doc, 990, 1500, .9, 6))
    b.append(scooter(doc, 70, 1760, 1.5, '#4F7CAC'))
    b.append(O(doc, R(700, 1470, 880, 1500, 6, 1, 43), P(doc, '#5C86C9', '#2F4A7A'), 'mid', '', 43, .8) + O(doc, R(710, 1380, 870, 1472, 16, 1.4, 44), P(doc, '#E8F3FA', '#8FB8D8'), 'mid', f'<path d="M722,1392 L722,1458" stroke="#fff" stroke-width="8" opacity=".6"/>', 44, .8))
    for sx in (150, 940):
        b.append(shadow(doc, sx, 1560, 70, 14, .5, 6))
        b.append(O(doc, R(sx - 56, 1470, sx + 56, 1500, 14, 1.2, sx), P(doc, '#F0B454', '#C97E2A'), 'fg', '', sx, .9) + f'<path d="M{sx - 36},1500 L{sx - 56},1570 M{sx + 36},1500 L{sx + 56},1570" stroke="{INKC}" stroke-width="9" stroke-linecap="round"/>')
    return page(doc, ''.join(b), grain_and_vignette(doc, .42))

# ============================================================ 3. Inside the stall: crowded counter, cook at the wok (eye-level, customers' backs in the foreground)
def panel3():
    doc = Doc(13); b = []
    b.append(f'<rect width="{W}" height="{H}" fill="{P(doc, "#F2E3C4", "#E4CCA0")}"/>')
    b.append(f'<rect width="{W}" height="{H}" fill="{RG(doc, (0, "#FFE7A6", .9), (.5, "#FFE7A6", .25), (1, "#FFE7A6", 0), c=(.5, .12), r=.75)}"/>')
    # back wall tiles + shelf
    for y in range(560, 1100, 70):
        for x in range(-20, 1100, 140): b.append(f'<rect x="{x + (y // 70 % 2) * 70}" y="{y}" width="134" height="64" rx="4" fill="#F6EEDC" stroke="#CDBA94" stroke-width="2"/>')
    b.append(O(doc, R(0, 330, 1080, 372, 4, 1.4, 3), P(doc, '#C99B66', '#8A5A32'), 'mid', '', 4, 1))
    for k, (x, col) in enumerate(((120, '#C9473F'), (260, '#5A3622'), (400, '#4E8A5A'), (860, '#E8C25A'), (980, '#6A8FB5'))):
        b.append(O(doc, R(x - 40, 240, x + 40, 332, 10, 1.4, k), P(doc, mix(col, '#fff', .3), col, mix(col, '#2A1020', .4), h=True), 'mid', f'<rect x="{x - 40}" y="262" width="80" height="38" fill="{CREAM}" opacity=".9"/>', k, .8))
    # hanging lamp
    b.append(f'<path d="M540,0 L540,250" stroke="{INKC}" stroke-width="5"/>' + O(doc, [(470, 330), (610, 330), (570, 258), (510, 258)], P(doc, '#F2E8D2', '#BFAE8E'), 'fg', '', 5, .9) + glow(doc, 540, 340, 190, '#FFE8A8', 1))
    # cook: frontal waist-up behind the counter
    # wok + flame
    b.append(flame_ring(doc, 540, 1150, 110, 26, 22, 1.2, 4))
    wk = bez((350, 1060), (370, 1200), (470, 1230), (540, 1230), 14)[:-1] + bez((540, 1230), (610, 1230), (710, 1200), (730, 1060), 14)
    b.append(O(doc, wk + [(350, 1060)], P(doc, '#4A4F57', '#23262B', '#101215'), 'fg', f'<ellipse cx="540" cy="1060" rx="190" ry="34" fill="#15171A"/><path d="M420,1130 Q470,1190 540,1196" stroke="#8C95A0" stroke-width="10" fill="none" opacity=".55" stroke-linecap="round"/>', 11, 1.1))
    b.append(f'<ellipse cx="540" cy="1062" rx="176" ry="26" fill="{RG(doc, (0, "#F6C45E"), (1, "#C87A1E"))}"/>')
    b.append(smoke(doc, [(470, 1040, 170, 20), (620, 1040, 200, 22)], 5, .5, 22, 40, 4))
    b.append('<!--FG-->')
    # counter
    b.append(O(doc, Pl([(-40, 1180), (1120, 1180), (1120, 1500), (-40, 1500)], 40, 1.2, 3), P(doc, '#D9A56C', '#B07A44'), 'fg', f'<rect x="-40" y="1180" width="1160" height="14" fill="#FFEBC6" opacity=".7"/>' + ''.join(f'<path d="M-40,{1215 + k * 38} L1120,{1215 + k * 38 + 6}" stroke="#8A5A32" stroke-width="2" opacity=".3"/>' for k in range(7)), 12, 1.1))
    bowls = []
    for k, bx in enumerate((250, 540, 830)):
        by = 1330 - (k % 2) * 6
        bowls.append(shadow(doc, bx + 24, by + 30, 150, 22, .45, 8))
        bw = bez((bx - 130, by - 40), (bx - 120, by + 50), (bx - 50, by + 54), (bx, by + 54), 14)[:-1] + bez((bx, by + 54), (bx + 50, by + 54), (bx + 120, by + 50), (bx + 130, by - 40), 14)
        bowls.append(O(doc, bw + [(bx - 130, by - 40)], P(doc, '#FFFFFF', '#EBDFC6', '#BFAA82'), 'fg', f'<path d="M{bx - 118},{by + 6} Q{bx},{by + 40} {bx + 118},{by + 6}" stroke="{RED}" stroke-width="12" fill="none" opacity=".9"/>', 13 + k, 1.0))
        bowls.append(f'<ellipse cx="{bx}" cy="{by - 40}" rx="130" ry="34" fill="#C58A2A"/>' + f'<g clip-path="url(#{doc.clip(d_smooth(ell(bx, by - 40, 122, 29, 40)))})"><g transform="translate({bx - 540} {by - 1450 + 30 - 40 + 40})">{noodle_strands(30 + k, bx - 140 + 540 - 540 + 0, bx + 140 + 0, 1432, 1470, 26, 0)}</g></g>' if False else '')
        bowls.append(f'<ellipse cx="{bx}" cy="{by - 40}" rx="130" ry="34" fill="{RG(doc, (0, "#F4C86A"), (1, "#B8761E"))}"/><g clip-path="url(#{doc.clip(d_smooth(ell(bx, by - 40, 124, 30, 50)))})"><g transform="translate({bx} {by - 40}) scale(.62 .17)">{noodle_strands(70 + k, -210, 210, -210, 210, 60, 0)}</g></g><ellipse cx="{bx - 30}" cy="{by - 44}" rx="48" ry="12" fill="#FFE7A0" opacity=".25"/>' + egg_half(doc, bx - 28, by - 46, 38, 22, 5 + k) + f'<ellipse cx="{bx + 52}" cy="{by - 40}" rx="24" ry="10" fill="#4E9158"/>')
        bowls.append(smoke(doc, [(bx - 20, by - 60, 220, 18), (bx + 40, by - 60, 190, 16)], 3 + k, .6, 16, 28, 3))
    b.append(''.join(bowls))
    # customers (backs, big, in the foreground) — silhouettes against the warm room
    # ---- detail layer: wall clock, menu board, counter props, floor
    b.insert(len(b) - 6, O(doc, E(930, 650, 80, 80, 1, 60), RG(doc, (0, '#FFFFFF'), (1, '#E0D6C2'), c=(.4, .3), r=.9), 'fg', ''.join(f'<line x1="{930 + 62 * math.cos(math.radians(k * 30)):.0f}" y1="{650 + 62 * math.sin(math.radians(k * 30)):.0f}" x2="{930 + 72 * math.cos(math.radians(k * 30)):.0f}" y2="{650 + 72 * math.sin(math.radians(k * 30)):.0f}" stroke="{INKC}" stroke-width="4"/>' for k in range(12)) + f'<line x1="930" y1="650" x2="930" y2="596" stroke="{INKC}" stroke-width="5" stroke-linecap="round"/><line x1="930" y1="650" x2="968" y2="668" stroke="{INKC}" stroke-width="7" stroke-linecap="round"/><circle cx="930" cy="650" r="7" fill="{RED}"/>', 60, 1.0))
    b.insert(len(b) - 6, O(doc, R(90, 800, 330, 1000, 8, 1.6, 61), '#2F3A34', 'fg', T(210, 850, 'MENU', 36, '#F4EBD4', 900, 'middle', 0, 6) + ''.join(T(210, 900 + k * 34, t, 24, '#EADFC4', 700) for k, t in enumerate(('Mie Rebus  10rb', 'Mie Goreng  12rb', 'Telur  +2rb'))), 61, .9))
    b.append(bottle(doc, 90, 1180, 90, 200, '#5A3622', 'KECAP', '#C9473F', 3) + bottle(doc, 200, 1180, 84, 180, '#C2301F', 'SAMBAL', '#2A1B15', 4))
    b.append(O(doc, R(860, 1090, 940, 1180, 10, 1.4, 62), P(doc, '#E8ECEF', '#8E98A3', h=True), 'fg', ''.join(f'<rect x="{868 + k * 12}" y="1060" width="7" height="46" fill="{["#E8C98A", "#B8803E"][k % 2]}" stroke="{INKC}" stroke-width="2"/>' for k in range(5)), 62, .8))
    b.append(f'<g opacity=".45">' + ''.join(f'<rect x="{x}" y="1860" width="{w}" height="60" fill="#B88A55"/><line x1="{x}" y1="1860" x2="{x}" y2="1920" stroke="{INKC}" stroke-width="3" opacity=".5"/>' for x, w in ((0, 200), (200, 280), (480, 220), (700, 250), (950, 130))) + '</g>')
    # utensil rack on the tiled wall (where the cook used to stand)
    b.insert(len(b) - 6, f'<path d="M190,560 L890,560" stroke="{INKC}" stroke-width="12" stroke-linecap="round"/><path d="M190,560 L890,560" stroke="{P(doc, "#E8ECEF", "#8E98A3")}" stroke-width="6" stroke-linecap="round"/>')
    for k_, x_ in enumerate((260, 400, 540, 680, 820)):
        b.insert(len(b) - 6, f'<path d="M{x_},560 L{x_},700" stroke="{INKC}" stroke-width="9" stroke-linecap="round"/><path d="M{x_},560 L{x_},700" stroke="#9A5B2E" stroke-width="5" stroke-linecap="round"/>' + O(doc, E(x_, 744, 34, 42, 1, 40 + k_), P(doc, '#E8ECEF', '#8E98A3', h=True), 'mid', f'<ellipse cx="{x_ - 8}" cy="738" rx="10" ry="22" fill="#fff" opacity=".55"/>', 40 + k_, .8))
    # order-ticket spike + service bell on the counter, empty stools in the foreground
    b.append(f'<path d="M960,1180 L960,1020" stroke="{INKC}" stroke-width="10" stroke-linecap="round"/><ellipse cx="960" cy="1186" rx="46" ry="12" fill="#6E7782" stroke="{INKC}" stroke-width="5"/>')
    for k_ in range(7): b.append(G(O(doc, R(920, 1150 - k_ * 20, 1010, 1186 - k_ * 20, 2, 1, 50 + k_), P(doc, '#FFFFFF', '#F3EAD6'), 'mid', ''.join(f'<line x1="930" y1="{1162 - k_ * 20 + i_ * 9}" x2="{1000 - i_ * 8}" y2="{1162 - k_ * 20 + i_ * 9}" stroke="#8A7F72" stroke-width="2"/>' for i_ in range(3)), 50 + k_, .5), 0, 0, k_ * 3 - 9, 1, 960, 1170))
    for sx in (200, 540, 880):
        b.append(shadow(doc, sx + 14, 1850, 120, 20, .5, 8))
        b.append(O(doc, E(sx, 1700, 120, 34, 1.5, sx), P(doc, '#F0B454', '#C97E2A'), 'fg', f'<ellipse cx="{sx - 30}" cy="1694" rx="50" ry="10" fill="#fff" opacity=".35"/>', sx, 1.0))
        b.append(f'<path d="M{sx - 90},1722 L{sx - 110},1860 M{sx + 90},1722 L{sx + 110},1860 M{sx},1730 L{sx},1860" stroke="{INKC}" stroke-width="14" stroke-linecap="round"/><path d="M{sx - 90},1722 L{sx - 110},1860 M{sx + 90},1722 L{sx + 110},1860" stroke="#8E98A3" stroke-width="7" stroke-linecap="round"/>')
    return page(doc, ''.join(b), grain_and_vignette(doc, .45))
