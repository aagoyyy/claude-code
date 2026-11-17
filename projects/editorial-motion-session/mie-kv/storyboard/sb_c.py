from sb_common import *
from sb_props import *

def bowl_side(doc, cx, by, w, seed=1, filled=False):
    """side-view bowl: by = bottom of the foot. returns svg."""
    h = w * .48
    body = bez((cx - w / 2, by - h), (cx - w / 2 + 10, by - h * .25), (cx - w * .22, by - 14), (cx - w * .14, by - 12), 12)[:-1] + [(cx - w * .14, by), (cx + w * .14, by)] + \
           bez((cx + w * .14, by - 12), (cx + w * .22, by - 14), (cx + w / 2 - 10, by - h * .25), (cx + w / 2, by - h), 12)
    g = P(doc, '#FFFFFF', '#F4EAD3', '#CDBB93', h=True)
    inner = f'<path d="M{cx - w / 2 + 6},{by - h * .52} Q{cx},{by - h * .3} {cx + w / 2 - 6},{by - h * .52}" stroke="{RED}" stroke-width="{max(5, w * .045):.1f}" fill="none"/>'
    inner += f'<path d="M{cx - w / 2 + 14},{by - h * .9} Q{cx - w * .34},{by - h * .4} {cx - w * .2},{by - 16}" stroke="#fff" stroke-width="{max(4, w * .035):.1f}" fill="none" opacity=".8" stroke-linecap="round"/>'
    inner += f'<rect x="{cx + w * .2}" y="{by - h}" width="{w * .3}" height="{h}" fill="#6E5A3A" opacity=".16"/>'
    out = shadow(doc, cx + 10, by + 4, w * .5, 10, .4, 5) + O(doc, body, g, 'mid', inner, seed, .8)
    out += f'<ellipse cx="{cx}" cy="{by - h}" rx="{w / 2}" ry="{w * .1:.1f}" fill="{P(doc, "#FFFFFF", "#E8DCC0")}" stroke="{INKC}" stroke-width="3.2"/>'
    if filled: out += f'<ellipse cx="{cx}" cy="{by - h}" rx="{w / 2 - 6}" ry="{w * .1 - 4:.1f}" fill="{RG(doc, (0, "#F4C86A"), (1, "#B8761E"))}"/>'
    else: out += f'<ellipse cx="{cx}" cy="{by - h + 3}" rx="{w / 2 - 6}" ry="{w * .1 - 3:.1f}" fill="#D9CDB0"/>'
    return out

# ============================================================ 7. Bowl towers: low-angle, the small stack (15) vs. the huge stack (80) + es teh
def panel7():
    doc = Doc(17); b = []
    b.append(f'<rect width="{W}" height="{H}" fill="{P(doc, "#F3E3C2", "#E7C998")}"/>')
    b.append(f'<rect width="{W}" height="{H}" fill="{RG(doc, (0, "#FFEBC6", .9), (1, "#FFEBC6", 0), c=(.8, .1), r=.9)}"/>')
    r = random.Random(7)
    for _ in range(16): b.append(f'<ellipse cx="{r.uniform(0, W):.0f}" cy="{r.uniform(0, 1500):.0f}" rx="{r.uniform(80, 200):.0f}" ry="{r.uniform(60, 140):.0f}" fill="{r.choice(["#FFFFFF", "#D7BE98"])}" opacity="{r.uniform(.06, .14):.2f}" filter="url(#{doc.blur(26)})"/>')
    # blurred stall interior behind: bokeh lights + shelf
    for _ in range(26): b.append(f'<circle cx="{r.uniform(0, W):.0f}" cy="{r.uniform(80, 700):.0f}" r="{r.uniform(18, 50):.0f}" fill="#FFE6A8" opacity="{r.uniform(.25, .6):.2f}" filter="url(#{doc.blur(4)})"/>')
    b.append(f'<rect y="1120" width="{W}" height="{H - 1120}" fill="{P(doc, "#E2B27A", "#B07A44")}"/>')
    s, _ = wood_table(doc, (540, -1100), 1120, H, [-300, 120, 420, 700, 1000, 1400], ['#D9A56C', '#E5BC8A', '#CFA06A'], .0, 6, -2000, 3000)
    b.append(s)
    b.append(f'<rect y="1120" width="{W}" height="10" fill="#FFEBC6" opacity=".8"/>')
    b.append('<!--FG-->')
    # small stack (left): 5 bowls with a chalk board "15"
    for k in range(5): b.append(bowl_side(doc, 250, 1600 - k * 66, 300 - k * 4, 10 + k, False))
    # huge stack (right): tall, runs off the top
    for k in range(22): b.append(bowl_side(doc, 780 + (k % 3 - 1) * 2, 1640 - k * 64 + (0), 340, 30 + k, False))
    # es teh glasses on the table (front)
    for k, gx in enumerate((470, 560, 650)):
        b.append(shadow(doc, gx + 14, 1752, 50, 12, .4, 4))
        b.append(glass_cyl(doc, gx - 40, gx + 40, 1560, 1750, 0, ('#E6A24B', '#C2701F', '#8A4710'), 1600, True, 8 + k, 14))
        b.append(f'<path d="M{gx + 14},1500 L{gx + 6},1630" stroke="#FFFFFF" stroke-width="9" stroke-linecap="round"/><path d="M{gx + 14},1500 L{gx + 6},1630" stroke="{RED}" stroke-width="4" stroke-dasharray="12 12" stroke-linecap="round"/>')
    # ---- detail layer: wall shelf with bottles and bowls, window light, plant, napkin box, chopstick cup, bell
    b.insert(3, f'<polygon points="0,0 420,0 820,1120 160,1120" fill="#fff" opacity=".08"/>')
    b.insert(4, O(doc, R(30, 620, 520, 656, 4, 1.4, 91), P(doc, '#C99B66', '#8A5A32'), 'fg', f'<rect x="30" y="620" width="490" height="8" fill="#FFEBC6" opacity=".7"/>', 91, 1.0) + bottle(doc, 110, 620, 80, 190, '#5A3622', 'KECAP', '#C9473F', 92) + bottle(doc, 220, 620, 72, 160, '#C2301F', 'SAMBAL', '#2A1B15', 93) + bottle(doc, 330, 620, 72, 150, '#E8C25A', 'MINYAK', '#8A5A32', 94) + bowl_side(doc, 440, 618, 110, 95, False))
    b.append(plant(doc, 80, 1130, 1.1, 99))
    b.append(O(doc, R(540, 1030, 640, 1124, 8, 1.4, 96), P(doc, '#E8ECEF', '#8E98A3', h=True), 'fg', ''.join(f'<rect x="{548 + k_ * 12}" y="990" width="7" height="50" fill="{["#E8C98A", "#B8803E"][k_ % 2]}" stroke="{INKC}" stroke-width="2"/>' for k_ in range(7)), 96, .8))
    b.append(O(doc, R(660, 1050, 770, 1124, 8, 1.4, 97), P(doc, '#F6F0E4', '#CDBB93', h=True), 'fg', T(715, 1096, 'TISU', 26, RED, 900), 97, .8))
    # order-ticket spike (right edge)
    b.append(f'<path d="M1000,1700 L1000,1500" stroke="{INKC}" stroke-width="10" stroke-linecap="round"/>' + f'<ellipse cx="1000" cy="1706" rx="50" ry="14" fill="#6E7782" stroke="{INKC}" stroke-width="5"/>')
    for k in range(6): b.append(G(O(doc, R(960, 1650 - k * 22, 1050, 1690 - k * 22, 2, 1, 40 + k), P(doc, '#FFFFFF', '#F3EAD6'), 'mid', ''.join(f'<line x1="970" y1="{1662 - k * 22 + i * 10}" x2="{1040 - i * 8}" y2="{1662 - k * 22 + i * 10}" stroke="#8A7F72" stroke-width="2"/>' for i in range(3)), 40 + k, .5), 0, 0, k * 4 - 10, 1, 1000, 1670))
    # chalkboard
    b.append(G(O(doc, R(60, 1790, 400, 1900, 10, 2, 50), '#2F3A34', 'fg', T(230, 1862, '15 / hari', 70, '#F4EBD4', 800, 'middle', 0, 2) + f'<path d="M80,1810 L380,1810" stroke="#fff" stroke-width="2" opacity=".3"/>', 50, 1.0), 0, 0, -2, 1, 230, 1845))
    return page(doc, ''.join(b), grain_and_vignette(doc, .38))

# ============================================================ 8. Cash drawer, 3/4 view: notes, coins, ledger, calculator, es teh
def note(doc, x, y, w, h, col, rot, seed):
    rr = R(-w / 2, -h / 2, w / 2, h / 2, 3, 1.4, seed)
    g = P(doc, mix(col, '#FFFFFF', .35), col, mix(col, '#2A1020', .25), h=True)
    inner = f'<rect x="{-w / 2 + 12}" y="{-h / 2 + 12}" width="{w - 24}" height="{h - 24}" fill="none" stroke="#fff" stroke-width="3" opacity=".5"/><circle cx="{-w / 4}" cy="0" r="{h * .26}" fill="#fff" opacity=".3"/><circle cx="{w * .22}" cy="0" r="{h * .18}" fill="none" stroke="#fff" stroke-width="3" opacity=".4"/>'
    inner += ''.join(f'<path d="M{-w / 2 + 20},{-h / 2 + 22 + i * 14} q{w * .3},{(-1) ** i * 5} {w * .6},0" stroke="#fff" stroke-width="2" fill="none" opacity=".35"/>' for i in range(5))
    return G(shadow(doc, 6, 8, w / 2, h / 2, .35, 4) + O(doc, rr, g, 'mid', inner, seed, .7), x, y, rot)

def panel8():
    doc = Doc(18); b = []
    s, _ = wood_table(doc, (540, -100000), 0, H, [-300, 150, 460, 760, 1060, 1400], ['#CBA070', '#D9B386', '#C29463'], 0, 9, -400, 1500)
    b.append(s)
    b.append(f'<rect width="{W}" height="{H}" fill="{RG(doc, (0, "#FFEBC6", .35), (1, "#FFEBC6", 0), c=(.25, .15), r=.9)}"/>')
    b.append('<!--FG-->')
    # cash box: top-down, open, with 4 compartments
    bx0, by0, bx1, by1 = 70, 240, 1010, 1020
    box = R(bx0, by0, bx1, by1, 26, 2, 5)
    b.append(shadow(doc, 560, 1050, 500, 400, .45, 24))
    b.append(O(doc, box, P(doc, '#7A5A3A', '#4E361F'), 'fg', f'<rect x="{bx0 + 28}" y="{by0 + 28}" width="{bx1 - bx0 - 56}" height="{by1 - by0 - 56}" rx="14" fill="{P(doc, "#2A1B15", "#4A3322")}"/>', 5, 1.2))
    cols = [('#5C86C9', 'a'), ('#D9544A', 'b'), ('#5FA06E', 'c')]
    cw = (bx1 - bx0 - 56 - 80) / 3
    for i in range(3):
        x0 = bx0 + 44 + i * (cw + 20)
        b.append(f'<rect x="{x0}" y="{by0 + 44}" width="{cw}" height="{(by1 - by0) * .62}" rx="10" fill="#241810" opacity=".7"/>')
        for k in range(6): b.append(note(doc, x0 + cw / 2 + (k % 2 - .5) * 6, by0 + 190 + k * 52 - (k % 2) * 3, cw - 24, 150, cols[i][0], (k % 3 - 1) * 1.6, 60 + i * 9 + k))
    for i in range(3):
        x0_ = bx0 + 44 + i * (cw + 20)
        b.append(f'<rect x="{x0_ + cw / 2 - 34:.0f}" y="{by0 + 230}" width="68" height="260" fill="#F6F0E4" stroke="{INKC}" stroke-width="3" opacity=".92"/>' + T(x0_ + cw / 2, by0 + 372, '100', 30, INKC, 800))
    # coin tray
    b.append(f'<rect x="{bx0 + 44}" y="{by0 + 530}" width="{bx1 - bx0 - 88}" height="190" rx="14" fill="#241810" opacity=".8"/>')
    for k in range(14): b.append(coin(doc, bx0 + 100 + (k % 7) * 118, by0 + 590 + (k // 7) * 84, 40, '#D8B454' if k % 3 else '#C9CED2', k * 20, '500' if k % 3 else '1000'))
    # ledger (notebook) with handwriting
    lx, ly = 140, 1130
    page_ = Pl([(lx, ly), (lx + 500, ly - 20), (lx + 530, ly + 430), (lx + 30, ly + 450)], 40, 1.6, 8)
    ledger = ''.join(f'<line x1="{lx + 30}" y1="{ly + 70 + i * 48}" x2="{lx + 510}" y2="{ly + 55 + i * 48}" stroke="#7BA4C8" stroke-width="2" opacity=".6"/>' for i in range(8))
    ledger += f'<path d="M{lx + 110},{ly - 10} L{lx + 125},{ly + 440}" stroke="{RED}" stroke-width="3" opacity=".7"/>'
    r = random.Random(3)
    for i in range(7):
        y = ly + 56 + i * 48 - i * 2
        ledger += f'<path d="M{lx + 140},{y} q{r.uniform(10, 30):.0f},-12 {r.uniform(50, 90):.0f},0 t{r.uniform(40, 80):.0f},-2" stroke="#2F4468" stroke-width="3.2" fill="none" stroke-linecap="round" opacity=".85"/><path d="M{lx + 380},{y - 4} q18,-12 36,0 t38,-2" stroke="#2F4468" stroke-width="3.2" fill="none" opacity=".85"/>'
    ledger += T(lx + 380, ly + 396, '5-7 jt', 52, RED, 900, 'middle', -2, 0)
    b.append(shadow(doc, lx + 310, ly + 240, 340, 230, .4, 14) + O(doc, page_, P(doc, '#FFFFFF', '#F1E8D2'), 'fg', ledger, 8, 1.0))
    b.append(G(O(doc, R(-12, -150, 12, 150, 6, .8, 9), P(doc, '#D9544A', '#8A2A24', h=True), 'fg', f'<rect x="-12" y="-150" width="24" height="26" fill="{INKC}"/><rect x="-3" y="-120" width="5" height="230" fill="#fff" opacity=".4"/>', 9, .8) + f'<polygon points="-12,150 12,150 0,190" fill="{INKC}"/>', 800, 1350, 62))
    # calculator
    kx, ky = 840, 1160
    b.append(shadow(doc, kx + 14, ky + 20, 180, 250, .4, 12) + O(doc, R(kx - 170, ky - 40, kx + 170, ky + 470, 24, 1.8, 11), P(doc, '#3C4650', '#232A31', h=False), 'fg',
             f'<rect x="{kx - 144}" y="{ky - 14}" width="288" height="110" rx="12" fill="#C7E0B8"/>' + T(kx + 130, ky + 74, '5.500.000', 46, '#1C2A18', 800, 'end') + T(kx - 130, ky + 16, 'CUAN', 20, '#4E6A44', 800, 'start', 0, 3) +
             ''.join(f'<rect x="{kx - 144 + (i % 4) * 74}" y="{ky + 130 + (i // 4) * 80}" width="64" height="62" rx="12" fill="{RED if i == 15 else "#F1E8D2"}"/>' + T(kx - 112 + (i % 4) * 74, ky + 172 + (i // 4) * 80, '789C456+123-0.=x'[i % 16] if i != 15 else '=', 32, INKC if i != 15 else '#fff', 800) for i in range(16)), 11, 1.0))
    # es teh, top-down circle at the corner
    gx, gy = 930, 1790
    b.append(shadow(doc, gx + 24, gy + 20, 100, 100, .4, 10) + O(doc, E(gx, gy, 96, 96, 1.4, 12), RG(doc, (0, '#F4C58A'), (.7, '#C2701F'), (1, '#8A4710'), c=(.4, .35), r=.8), 'fg',
             f'<circle cx="{gx}" cy="{gy}" r="76" fill="none" stroke="#fff" stroke-width="5" opacity=".6"/><circle cx="{gx - 24}" cy="{gy - 18}" r="30" fill="#F4FBFF" opacity=".6" stroke="#fff" stroke-width="3"/><circle cx="{gx + 28}" cy="{gy + 20}" r="26" fill="#F4FBFF" opacity=".55" stroke="#fff" stroke-width="3"/><circle cx="{gx}" cy="{gy}" r="9" fill="{RED}"/><path d="M{gx},{gy} L{gx + 56},{gy - 70}" stroke="{RED}" stroke-width="9" stroke-linecap="round"/>', 12, .9))
    for i, col in enumerate(('#D8B454', '#C9CED2', '#D8B454')):
        b.append(O(doc, R(80 + i * 300, 100, 340 + i * 300, 160, 24, 1.2, 70 + i), P(doc, mix(col, '#FFFFFF', .3), col, mix(col, '#3A1C26', .45)), 'fg', ''.join(f'<line x1="{100 + i * 300 + k_ * 20}" y1="100" x2="{100 + i * 300 + k_ * 20}" y2="160" stroke="#6A4A10" stroke-width="2" opacity=".4"/>' for k_ in range(12)) + f'<rect x="{80 + i * 300}" y="124" width="260" height="12" fill="{RED}" opacity=".85"/>', 70 + i, .8))
    b.append(G(O(doc, E(0, 0, 40, 40, 1, 77), P(doc, '#F6E7A8', '#C9A24A', '#8A6A20'), 'fg', f'<circle cx="0" cy="0" r="16" fill="#EADCC3" stroke="{INKC}" stroke-width="4"/>', 77, .9) + O(doc, R(-12, 40, 12, 190, 5, .8, 78), P(doc, '#F6E7A8', '#B8923A', h=True), 'fg', '', 78, .7) + O(doc, [(12, 150), (50, 150), (50, 176), (30, 176), (30, 190), (12, 190)], P(doc, '#F6E7A8', '#B8923A'), 'fg', '', 79, .7), 560, 1770, 28))
    return page(doc, ''.join(b), grain_and_vignette(doc, .34))

# ============================================================ 9. CTA: phone with the comment thread, resting on the counter beside a glass of es teh
def panel9():
    doc = Doc(19); b = []
    b.append(f'<rect width="{W}" height="{H}" fill="{P(doc, "#E85A4F", RED, "#A3302C")}"/>')
    r = random.Random(5)
    for k in range(5): b.append(f'<ellipse cx="{r.uniform(0, W):.0f}" cy="{r.uniform(0, H):.0f}" rx="{r.uniform(160, 360):.0f}" ry="{r.uniform(100, 240):.0f}" fill="{r.choice(["#FF8A7E", "#7A1F1C"])}" opacity=".25" filter="url(#{doc.blur(60)})"/>')
    b.append('<!--FG-->')
    px, py, pw, ph = 190, 200, 700, 1420
    b.append(shadow(doc, px + pw / 2 + 28, py + ph / 2 + 60, pw / 2 + 30, ph / 2, .5, 30))
    scr = R(px + 28, py + 30, px + pw - 28, py + ph - 30, 44, 1.2, 4)
    ui = f'<rect x="{px}" y="{py}" width="{pw}" height="{ph}" fill="#fff"/>'
    ui += f'<rect x="{px + 28}" y="{py + 30}" width="{pw - 56}" height="86" fill="#FFFFFF"/>' + T(px + pw / 2, py + 118, 'Komentar', 38, INKC, 800) + f'<line x1="{px + 28}" y1="{py + 140}" x2="{px + pw - 28}" y2="{py + 140}" stroke="#E6DFD2" stroke-width="3"/>'
    # post header with bowl thumb
    ui += f'<rect x="{px + 60}" y="{py + 150}" width="120" height="120" rx="18" fill="{P(doc, "#F4C86A", "#B8761E")}"/><ellipse cx="{px + 120}" cy="{py + 220}" rx="48" ry="26" fill="#FFF6E0"/><ellipse cx="{px + 120}" cy="{py + 206}" rx="40" ry="14" fill="#E9B857"/>'
    ui += T(px + 200, py + 196, 'Bedah bisnis warmindo', 34, INKC, 800, 'start') + T(px + 200, py + 240, 'Bisnis apa lagi yang mau dibedah?', 28, '#8A7F72', 600, 'start')
    comments = [('A', '#5C86C9', 'Lebih cuan warmindo!', 0), ('R', '#5FA06E', 'Bedah bisnis es teh dong', 0), ('M', RED, 'mulai', 1), ('D', '#D9A441', 'Modal buka warmindo?', 0), ('S', '#8A5A9C', 'Mantap, lanjut bedah!', 0)]
    for i, (ch, col, txt, hi) in enumerate(comments):
        y = py + 350 + i * 164
        ui += f'<circle cx="{px + 98}" cy="{y + 40}" r="40" fill="{col}"/>' + T(px + 98, y + 54, ch, 40, '#fff', 800)
        bw = 440 if not hi else 300
        ui += f'<rect x="{px + 160}" y="{y - 6}" width="{pw - 240 if not hi else 350}" height="96" rx="30" fill="{"#FFE9E7" if hi else "#F4EFE6"}" stroke="{RED if hi else "none"}" stroke-width="5"/>'
        ui += T(px + 190, y + 56, txt, 32 if not hi else 52, RED if hi else INKC, 800 if hi else 600, 'start')
        ui += f'<path d="M{px + pw - 98},{y + 30} c-12,-14 -34,0 -22,18 l22,22 l22,-22 c12,-18 -10,-32 -22,-18z" fill="{RED if hi else "#D8D0C2"}"/>'
    ui += T(px + 80, py + 64, '9:41', 28, INKC, 800, 'start') + T(px + pw - 80, py + 64, '100%', 24, INKC, 800, 'end') + ''.join(T(px + 192, py + 350 + i * 164 + 118, 'Balas  ·  ' + ('2j', '3j', '5j', '8j', '1h')[i], 22, '#8A7F72', 600, 'start') for i in range(5))
    ui += f'<rect x="{px + 60}" y="{py + ph - 230}" width="{pw - 120}" height="110" rx="55" fill="{INKC}"/>' + T(px + pw / 2, py + ph - 160, 'klik link di bio', 44, '#fff', 800, 'middle', 0, 1)
    ui += f'<path d="M{px + 90},{py + ph - 180} l10,-16 l10,16" stroke="#fff" stroke-width="0" fill="none"/>'
    r2_ = random.Random(11)
    for k_ in range(18):
        hx_, hy_ = r2_.choice([r2_.uniform(20, 160), r2_.uniform(920, 1060)]), r2_.uniform(80, 1860); hs_ = r2_.uniform(22, 54)
        b.append(f'<path d="M{hx_:.0f},{hy_ + hs_ * .35:.0f} c-{hs_:.0f},-{hs_ * .8:.0f} -{hs_ * .2:.0f},-{hs_ * 1.2:.0f} 0,-{hs_ * .55:.0f} c{hs_ * .2:.0f},-{hs_ * .65:.0f} {hs_:.0f},-{hs_ * .25:.0f} 0,{hs_ * .55:.0f}z" fill="#fff" opacity="{r2_.uniform(.14, .32):.2f}"/>')
    phone = R(px, py, px + pw, py + ph, 70, 1.6, 6)
    b.append(O(doc, phone, P(doc, '#2D2A33', '#14121A'), 'fg', '', 6, 1.2))
    cid = doc.clip(d_smooth(scr))
    b.append(f'<g clip-path="url(#{cid})">{ui}</g>')
    b.append(f'<rect x="{px + pw / 2 - 90}" y="{py + 40}" width="180" height="40" rx="20" fill="#14121A"/>')
    b.append(f'<path d="M{px + 70},{py + 80} C{px + 40},{py + 400} {px + 40},{py + 900} {px + 80},{py + ph - 90}" stroke="#fff" stroke-width="12" fill="none" opacity=".12" stroke-linecap="round"/>')
    return page(doc, ''.join(b), grain_and_vignette(doc, .3))
