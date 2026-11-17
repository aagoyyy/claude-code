from sb_common import *
from sb_people import person_back, cook_front

# ============================================================ 1. HOOK: top-down, a pack of instant noodles on a warung counter
def panel1():
    doc = Doc(11); b = []
    s, _ = wood_table(doc, (540, -100000), 0, H, [-300, 120, 420, 700, 1000, 1400], ['#D9A56C', '#E5BC8A', '#CFA06A'], 0, 5, -400, 1500)
    b.append(s)
    b.append(f'<rect width="{W}" height="{H}" fill="{RG(doc, (0, "#FFEBC6", .35), (1, "#FFEBC6", 0), c=(.3, .2), r=.8)}"/>')
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
    # queue of customers at the window (backs) + stools
    for (cx, by, sc, col, kd) in ((330, 1480, .62, '#4F7CAC', 'short'), (560, 1490, .68, '#D9A441', 'cap'), (780, 1480, .62, '#8A5A9C', 'long')):
        b.append(person_back(doc, cx, by, sc, col, seed=int(cx), hair=['#1A100C', '#2A1B15', '#3A2418'][int(cx) % 3], kind=kd, cap='#2F6FA8'))
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
    b.append(cook_front(doc, 540, 1170, 1.25, 3))
    # wok + flame
    b.append(flame_ring(doc, 540, 1150, 110, 26, 22, 1.2, 4))
    wk = bez((350, 1060), (370, 1200), (470, 1230), (540, 1230), 14)[:-1] + bez((540, 1230), (610, 1230), (710, 1200), (730, 1060), 14)
    b.append(O(doc, wk + [(350, 1060)], P(doc, '#4A4F57', '#23262B', '#101215'), 'fg', f'<ellipse cx="540" cy="1060" rx="190" ry="34" fill="#15171A"/><path d="M420,1130 Q470,1190 540,1196" stroke="#8C95A0" stroke-width="10" fill="none" opacity=".55" stroke-linecap="round"/>', 11, 1.1))
    b.append(f'<ellipse cx="540" cy="1062" rx="176" ry="26" fill="{RG(doc, (0, "#F6C45E"), (1, "#C87A1E"))}"/>')
    b.append(smoke(doc, [(470, 1040, 170, 20), (620, 1040, 200, 22)], 5, .5, 22, 40, 4))
    # counter
    b.append(O(doc, Pl([(-40, 1180), (1120, 1180), (1120, 1500), (-40, 1500)], 40, 1.2, 3), P(doc, '#D9A56C', '#B07A44'), 'fg', f'<rect x="-40" y="1180" width="1160" height="14" fill="#FFEBC6" opacity=".7"/>' + ''.join(f'<path d="M-40,{1215 + k * 38} L1120,{1215 + k * 38 + 6}" stroke="#8A5A32" stroke-width="2" opacity=".3"/>' for k in range(7)), 12, 1.1))
    bowls = []
    for k, bx in enumerate((250, 540, 830)):
        by = 1330 - (k % 2) * 6
        bowls.append(shadow(doc, bx + 24, by + 30, 150, 22, .45, 8))
        bw = bez((bx - 130, by - 40), (bx - 120, by + 50), (bx - 50, by + 54), (bx, by + 54), 14)[:-1] + bez((bx, by + 54), (bx + 50, by + 54), (bx + 120, by + 50), (bx + 130, by - 40), 14)
        bowls.append(O(doc, bw + [(bx - 130, by - 40)], P(doc, '#FFFFFF', '#EBDFC6', '#BFAA82'), 'fg', f'<path d="M{bx - 118},{by + 6} Q{bx},{by + 40} {bx + 118},{by + 6}" stroke="{RED}" stroke-width="12" fill="none" opacity=".9"/>', 13 + k, 1.0))
        bowls.append(f'<ellipse cx="{bx}" cy="{by - 40}" rx="130" ry="34" fill="#C58A2A"/>' + f'<g clip-path="url(#{doc.clip(d_smooth(ell(bx, by - 40, 122, 29, 40)))})"><g transform="translate({bx - 540} {by - 1450 + 30 - 40 + 40})">{noodle_strands(30 + k, bx - 140 + 540 - 540 + 0, bx + 140 + 0, 1432, 1470, 26, 0)}</g></g>' if False else '')
        bowls.append(f'<ellipse cx="{bx}" cy="{by - 40}" rx="130" ry="34" fill="{RG(doc, (0, "#F4C86A"), (1, "#B8761E"))}"/><ellipse cx="{bx - 30}" cy="{by - 44}" rx="48" ry="12" fill="#FFE7A0" opacity=".7"/>' + egg_half(doc, bx - 28, by - 46, 38, 22, 5 + k) + f'<ellipse cx="{bx + 52}" cy="{by - 40}" rx="24" ry="10" fill="#4E9158"/>')
        bowls.append(smoke(doc, [(bx - 20, by - 60, 220, 18), (bx + 40, by - 60, 190, 16)], 3 + k, .6, 16, 28, 3))
    b.append(''.join(bowls))
    # customers (backs, big, in the foreground) — silhouettes against the warm room
    b.append(person_back(doc, 110, 2040, 1.55, '#3E5A86', seed=21, hair='#1A100C', kind='short'))
    b.append(person_back(doc, 560, 2090, 1.7, '#B24A4A', seed=22, hair='#2A1B15', kind='cap', cap='#2A2F3A'))
    b.append(person_back(doc, 1010, 2040, 1.55, '#4A7A5A', seed=23, hair='#3A2418', kind='hijab'))
    return page(doc, ''.join(b), grain_and_vignette(doc, .45))
