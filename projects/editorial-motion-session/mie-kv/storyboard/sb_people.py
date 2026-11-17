"""People for the storyboard: stylised-realistic proportions (head ~1/7.5 of height, shoulder width ~2.3 heads), same light logic as the kit."""
from sb_common import *

SKINS = ['#D9A47A', '#C98F63', '#B97B50', '#E5B98F']

def _skin(doc, skin, horiz=True):
    return P(doc, mix(skin, '#FFFFFF', .14), skin, mix(skin, '#3A1C26', .38), h=horiz)

def person_back(doc, cx, by, s, shirt, skin=None, hair='#241612', seed=1, kind='short', cap=None, arms=True):
    """Seen from behind. by = baseline at the waist, figure ~ 520*s tall. kind: short | long | hijab | cap | kupluk."""
    skin = skin or SKINS[seed % 4]
    def Q(p): return tr(p, cx, by, s)
    k = 1.0
    out = shadow(doc, cx, by + 30 * s, 140 * s, 18 * s, .38, 8)
    # ---- torso (shoulder slope, trapezius, waist taper)
    L = bez((-104, 0), (-112, -70), (-118, -120), (-124, -170), 12)[:-1] + bez((-124, -170), (-128, -206), (-104, -232), (-62, -246), 10)[:-1] + bez((-62, -246), (-44, -254), (-34, -262), (-30, -272), 8)
    Rr = [(-x, y) for x, y in L][::-1]
    torso = Q(wob(L + Rr, 2.0, seed, False)) + [(cx + 104 * s, by + 40 * s), (cx - 104 * s, by + 40 * s)]
    tg = P(doc, mix(shirt, '#FFFFFF', .22), shirt, mix(shirt, '#2A1020', .5), h=True)
    inner = f'<path d="{d_smooth(Q([(0, -258), (2, -200), (0, -110), (-2, -20)]), False)}" stroke="{mix(shirt, "#2A1020", .45)}" stroke-width="{3.4 * s:.1f}" fill="none" opacity=".45"/>'                 # spine seam
    inner += f'<path d="{d_smooth(Q([(-96, -176), (-60, -150), (-20, -148)]), False)}" stroke="{mix(shirt, "#2A1020", .4)}" stroke-width="{3 * s:.1f}" fill="none" opacity=".35" stroke-linecap="round"/>'  # shoulder-blade fold
    inner += f'<path d="{d_smooth(Q([(20, -148), (70, -152), (104, -176)]), False)}" stroke="{mix(shirt, "#2A1020", .4)}" stroke-width="{3 * s:.1f}" fill="none" opacity=".3" stroke-linecap="round"/>'
    inner += f'<path d="{d_smooth(Q(bez((-62, -246), (-96, -224), (-118, -190), (-120, -120), 10)), False)}" stroke="{KEY}" stroke-width="{9 * s:.1f}" fill="none" opacity=".7" stroke-linecap="round"/>'               # rim light
    inner += f'<rect x="{cx + 40 * s:.0f}" y="{by - 270 * s:.0f}" width="{90 * s:.0f}" height="{290 * s:.0f}" fill="{mix(shirt, "#2A1020", .5)}" opacity=".22"/>'                                           # terminator
    out += O(doc, torso, tg, 'mid', inner, seed, .9)
    # ---- arms (sleeve + forearm + hand), separate shapes
    if arms:
        for sg, ph in ((-1, 0), (1, 1)):
            arm = bez((sg * 112, -206), (sg * 142, -190), (sg * 150, -130), (sg * 146, -86), 12)[:-1] + bez((sg * 146, -86), (sg * 144, -50), (sg * 138, -20), (sg * 128, 6), 10) + bez((sg * 92, 6), (sg * 100, -40), (sg * 100, -100), (sg * 98, -150), 10)
            ag = P(doc, mix(shirt, '#FFFFFF', .12), mix(shirt, '#2A1020', .12), mix(shirt, '#2A1020', .5), h=True) if sg < 0 else P(doc, mix(shirt, '#2A1020', .2), mix(shirt, '#2A1020', .45), h=True)
            out += O(doc, Q(wob(arm, 1.6, seed + 10 + ph, False)), ag, 'mid',
                     f'<path d="{d_smooth(Q([(sg * 146, -86), (sg * 124, -80), (sg * 100, -88)]), False)}" stroke="{mix(shirt, "#2A1020", .5)}" stroke-width="{3 * s:.1f}" fill="none" opacity=".5"/>', seed + 10 + ph, .8)
            hand = O(doc, Q(wob(ell(sg * 118, 22, 20, 30, 24), 1.2, seed + 12 + ph)), _skin(doc, skin), 'mid', '', seed + 12 + ph, .6)
            out += hand
    # ---- neck + collar
    out += O(doc, Q(R(-24, -306, 24, -262, 10, .8, seed + 2)), _skin(doc, mix(skin, '#3A1C26', .12)), 'mid', f'<rect x="{cx - 30 * s:.0f}" y="{by - 306 * s:.0f}" width="{60 * s:.0f}" height="{22 * s:.0f}" fill="#2A1020" opacity=".3"/>', seed + 2, .6)
    out += f'<path d="{d_smooth(Q(bez((-44, -262), (-30, -246), (30, -246), (44, -262), 14)), False)}" stroke="{INKC}" stroke-width="{12 * s:.1f}" fill="none" stroke-linecap="round"/><path d="{d_smooth(Q(bez((-44, -262), (-30, -246), (30, -246), (44, -262), 14)), False)}" stroke="{mix(shirt, "#FFFFFF", .35)}" stroke-width="{7 * s:.1f}" fill="none" stroke-linecap="round"/>'
    # ---- head
    HY = -352
    head_pts = bez((-48, HY + 6), (-52, HY - 44), (-30, HY - 70), (0, HY - 70), 12)[:-1] + bez((0, HY - 70), (30, HY - 70), (52, HY - 44), (48, HY + 6), 12)[:-1] + bez((48, HY + 6), (44, HY + 40), (22, HY + 56), (0, HY + 56), 12)[:-1] + bez((0, HY + 56), (-22, HY + 56), (-44, HY + 40), (-48, HY + 6), 12)
    hair_c = hair
    # ears first (behind hair)
    for sg in (-1, 1):
        if kind in ('long', 'hijab'): continue
        out += O(doc, Q(wob(ell(sg * 51, HY + 10, 9, 15, 24), .8, seed + 20 + sg)), _skin(doc, skin, False), 'mid', '', seed + 20 + sg, .5)
    if kind == 'hijab':
        sc = '#C9588A' if seed % 2 else '#4E7FA8'
        sh = bez((-62, HY + 22), (-70, HY - 60), (-40, HY - 84), (0, HY - 84), 14)[:-1] + bez((0, HY - 84), (40, HY - 84), (70, HY - 60), (62, HY + 22), 14)[:-1] + bez((62, HY + 22), (78, HY + 70), (112, -270), (118, -226), 14)[:-1] + [(0, -214)] + bez((-118, -226), (-112, -270), (-78, HY + 70), (-62, HY + 22), 14)[::-1][::-1]
        sh = [(x, y) for x, y in sh]
        out += O(doc, Q(wob(sh, 2, seed + 30, False)), P(doc, mix(sc, '#FFFFFF', .25), sc, mix(sc, '#2A1020', .45), h=True), 'mid',
                 f'<path d="{d_smooth(Q([(-20, HY - 60), (-30, HY), (-40, -250)]), False)}" stroke="{mix(sc, "#2A1020", .45)}" stroke-width="{3 * s:.1f}" fill="none" opacity=".5"/><path d="{d_smooth(Q([(30, HY - 60), (40, HY + 10), (60, -240)]), False)}" stroke="{mix(sc, "#2A1020", .45)}" stroke-width="{3 * s:.1f}" fill="none" opacity=".4"/><path d="{d_smooth(Q(bez((-48, HY - 46), (-24, HY - 76), (16, HY - 78), (40, HY - 54), 10)), False)}" stroke="#fff" stroke-width="{6 * s:.1f}" fill="none" opacity=".4" stroke-linecap="round"/>', seed + 30, .9)
        return out
    out += O(doc, Q(wob(head_pts, 1.6, seed + 3)), _skin(doc, skin, False), 'mid', '', seed + 3, .8)
    # hair mass (covers crown + back of head, leaves nape + ears)
    if kind == 'long':
        hm = bez((-54, HY + 4), (-62, HY - 56), (-34, HY - 76), (0, HY - 76), 12)[:-1] + bez((0, HY - 76), (34, HY - 76), (62, HY - 56), (54, HY + 4), 12)[:-1] + bez((54, HY + 4), (70, HY + 80), (80, -250), (58, -196), 14)[:-1] + bez((58, -196), (30, -186), (-30, -186), (-58, -196), 10)[:-1] + bez((-58, -196), (-80, -250), (-70, HY + 80), (-54, HY + 4), 14)
    else:
        hm = bez((-52, HY + 10), (-58, HY - 50), (-32, HY - 74), (0, HY - 74), 12)[:-1] + bez((0, HY - 74), (32, HY - 74), (58, HY - 50), (52, HY + 10), 12)[:-1] + bez((52, HY + 10), (50, HY + 22), (40, HY + 34), (26, HY + 46), 8)[:-1] + bez((26, HY + 46), (10, HY + 54), (-10, HY + 54), (-26, HY + 46), 8)[:-1] + bez((-26, HY + 46), (-40, HY + 34), (-50, HY + 22), (-52, HY + 10), 8)
    hg = RG(doc, (0, mix(hair, '#7A5A48', .55)), (.5, hair), (1, mix(hair, '#000000', .55)), c=(.32, .22), r=.95)
    strands = ''.join(f'<path d="{d_smooth(Q([(sx * 6, HY - 70 + abs(sx) * 2), (sx * 16, HY - 20), (sx * 14, HY + 24)]), False)}" stroke="{mix(hair, "#FFFFFF", .22)}" stroke-width="{1.8 * s:.1f}" fill="none" opacity=".45"/>' for sx in range(-4, 5))
    strands += f'<path d="{d_smooth(Q(bez((-44, HY - 40), (-26, HY - 66), (14, HY - 68), (34, HY - 52), 10)), False)}" stroke="#fff" stroke-width="{6 * s:.1f}" fill="none" opacity=".38" stroke-linecap="round"/>'
    out += O(doc, Q(wob(hm, 1.8, seed + 4)), hg, 'mid', strands, seed + 4, .9)
    if kind == 'long':
        out += f'<rect x="{cx - 20 * s:.0f}" y="{by + (-200) * s:.0f}" width="{40 * s:.0f}" height="{12 * s:.0f}" rx="5" fill="{RED}" stroke="{INKC}" stroke-width="2.4"/>'
    if kind == 'cap':
        c = cap or '#2F6FA8'
        cp = bez((-56, HY + 2), (-60, HY - 60), (-30, HY - 86), (0, HY - 86), 12)[:-1] + bez((0, HY - 86), (30, HY - 86), (60, HY - 60), (56, HY + 2), 12) + [(46, HY + 6), (-46, HY + 6)]
        out += O(doc, Q(wob(cp, 1.4, seed + 6)), P(doc, mix(c, '#FFFFFF', .22), c, mix(c, '#2A1020', .45), h=True), 'mid',
                 f'<path d="{d_smooth(Q([(0, HY - 86), (0, HY + 4)]), False)}" stroke="{mix(c, "#2A1020", .4)}" stroke-width="{3 * s:.1f}" fill="none"/><circle cx="{cx:.0f}" cy="{by + (HY - 86) * s:.0f}" r="{5 * s:.1f}" fill="{mix(c, "#2A1020", .4)}"/><rect x="{cx - 26 * s:.0f}" y="{by + (HY - 6) * s:.0f}" width="{52 * s:.0f}" height="{10 * s:.0f}" rx="3" fill="{mix(c, "#2A1020", .3)}"/>', seed + 6, .8)
    if kind == 'kupluk':
        c = cap or '#8A5A3A'
        cp = bez((-54, HY - 16), (-58, HY - 74), (-30, HY - 96), (0, HY - 96), 12)[:-1] + bez((0, HY - 96), (30, HY - 96), (58, HY - 74), (54, HY - 16), 12) + [(58, HY - 6), (-58, HY - 6)]
        out += O(doc, Q(wob(cp, 1.4, seed + 7)), P(doc, mix(c, '#FFFFFF', .2), c, mix(c, '#2A1020', .45), h=True), 'mid', ''.join(f'<path d="{d_smooth(Q([(-52 + i * 13, HY - 12), (-50 + i * 13, HY - 70)]), False)}" stroke="{mix(c, "#2A1020", .4)}" stroke-width="{3 * s:.1f}" fill="none" opacity=".55"/>' for i in range(9)), seed + 7, .8)
    return out

def cook_front(doc, cx, by, s=1.0, seed=3):
    """frontal waist-up cook with a headband, white shirt, red apron, one arm holding the wok handle, one raising a spatula."""
    def Q(p): return tr(p, cx, by, s)
    skin = '#D9A47A'; out = ''
    # torso
    tor = bez((-130, 0), (-136, -120), (-132, -220), (-108, -280), 14)[:-1] + bez((-108, -280), (-80, -310), (-50, -322), (-34, -326), 8)[:-1] + bez((34, -326), (50, -322), (80, -310), (108, -280), 8)[:-1] + bez((108, -280), (132, -220), (136, -120), (130, 0), 14)
    out += O(doc, Q(wob(tor, 2, seed, False)), P(doc, '#FFFFFF', '#F1E9D8', '#BFB093', h=True), 'mid', f'<path d="{d_smooth(Q(bez((-108, -280), (-96, -230), (-92, -160), (-96, -90), 10)), False)}" stroke="{KEY}" stroke-width="{8 * s:.1f}" fill="none" opacity=".7"/><rect x="{cx + 70 * s:.0f}" y="{by - 320 * s:.0f}" width="{70 * s:.0f}" height="{330 * s:.0f}" fill="#6E5A3A" opacity=".16"/>', seed, .9)
    # neck + collar
    out += O(doc, Q(R(-26, -372, 26, -322, 10, .8, seed + 1)), _skin(doc, mix(skin, '#3A1C26', .1)), 'mid', f'<path d="M{cx - 26 * s:.0f},{by - 340 * s:.0f} q{26 * s:.0f},{26 * s:.0f} {52 * s:.0f},0" stroke="#3A1C26" stroke-width="{8 * s:.1f}" fill="none" opacity=".25"/>', seed + 1, .6)
    out += f'<path d="{d_smooth(Q(bez((-44, -330), (-22, -300), (22, -300), (44, -330), 14)), False)}" stroke="{INKC}" stroke-width="{13 * s:.1f}" fill="none" stroke-linecap="round"/><path d="{d_smooth(Q(bez((-44, -330), (-22, -300), (22, -300), (44, -330), 14)), False)}" stroke="#FFFFFF" stroke-width="{8 * s:.1f}" fill="none" stroke-linecap="round"/>'
    # apron (bib with neck strap, pocket, waist tie)
    ap = R(-74, -270, 74, 10, 20, 1.6, seed + 2)
    out += f'<path d="{d_smooth(Q([(-50, -318), (-62, -270)]), False)}" stroke="{INKC}" stroke-width="{11 * s:.1f}" fill="none"/><path d="{d_smooth(Q([(-50, -318), (-62, -270)]), False)}" stroke="#B8383A" stroke-width="{6 * s:.1f}" fill="none"/><path d="{d_smooth(Q([(50, -318), (62, -270)]), False)}" stroke="{INKC}" stroke-width="{11 * s:.1f}" fill="none"/><path d="{d_smooth(Q([(50, -318), (62, -270)]), False)}" stroke="#B8383A" stroke-width="{6 * s:.1f}" fill="none"/>'
    out += O(doc, Q(ap), P(doc, '#E85A4F', RED, '#8E2A28', h=True), 'mid',
             f'<path d="{d_smooth(Q([(-66, -250), (0, -236), (66, -250)]), False)}" stroke="#fff" stroke-width="{3 * s:.1f}" fill="none" opacity=".4"/><rect x="{cx - 44 * s:.0f}" y="{by - 130 * s:.0f}" width="{88 * s:.0f}" height="{66 * s:.0f}" rx="{8 * s:.0f}" fill="#B8383A" stroke="{INKC}" stroke-width="{3 * s:.1f}"/><path d="{d_smooth(Q([(-44, -118), (44, -118)]), False)}" stroke="{INKC}" stroke-width="{2.4 * s:.1f}" opacity=".5"/>', seed + 2, .8)
    # arms: left (viewer's left) forward to the wok handle, right raised with a spatula
    arm_l = bez((-108, -280), (-150, -240), (-186, -150), (-176, -70), 12)[:-1] + bez((-176, -70), (-172, -30), (-150, -8), (-130, -10), 10)[:-1] + bez((-96, -20), (-120, -90), (-118, -190), (-90, -250), 12)
    out += O(doc, Q(wob(arm_l, 1.6, seed + 4, False)), P(doc, '#FFFFFF', '#E8DEC8', '#B8A98A', h=True), 'mid', f'<path d="{d_smooth(Q([(-176, -70), (-152, -62), (-128, -76)]), False)}" stroke="#8A7A58" stroke-width="{3 * s:.1f}" fill="none" opacity=".5"/>', seed + 4, .8)
    out += O(doc, Q(wob(ell(-156, 6, 26, 24, 24), 1, seed + 5)), _skin(doc, skin), 'mid', '', seed + 5, .6)
    arm_r = bez((108, -280), (160, -280), (196, -230), (200, -170), 12)[:-1] + bez((200, -170), (202, -150), (180, -140), (166, -148), 8)[:-1] + bez((140, -170), (130, -210), (116, -250), (92, -250), 10)
    out += O(doc, Q(wob(arm_r, 1.6, seed + 6, False)), P(doc, '#FFFFFF', '#E8DEC8', '#B8A98A', h=True), 'mid', '', seed + 6, .8)
    out += O(doc, Q(wob(ell(184, -176, 24, 24, 24), 1, seed + 7)), _skin(doc, skin), 'mid', '', seed + 7, .6)
    sp = f'<path d="M{cx + 186 * s:.0f},{by - 190 * s:.0f} L{cx + 210 * s:.0f},{by - 360 * s:.0f}" stroke="{INKC}" stroke-width="{14 * s:.1f}" stroke-linecap="round"/><path d="M{cx + 186 * s:.0f},{by - 190 * s:.0f} L{cx + 210 * s:.0f},{by - 360 * s:.0f}" stroke="#8A5A32" stroke-width="{8 * s:.1f}" stroke-linecap="round"/>'
    sp += O(doc, Q(R(188, -450, 236, -350, 12, 1, seed + 8)), P(doc, '#E8ECEF', '#8E98A3', h=True), 'mid', f'<path d="{d_smooth(Q([(198, -440), (200, -366)]), False)}" stroke="#fff" stroke-width="{5 * s:.1f}" fill="none" opacity=".7"/>', seed + 8, .7)
    out += sp
    # head
    HY = -430
    head = bez((-52, HY + 4), (-54, HY - 50), (-30, HY - 76), (0, HY - 76), 12)[:-1] + bez((0, HY - 76), (30, HY - 76), (54, HY - 50), (52, HY + 4), 12)[:-1] + bez((52, HY + 4), (50, HY + 38), (28, HY + 66), (0, HY + 66), 12)[:-1] + bez((0, HY + 66), (-28, HY + 66), (-50, HY + 38), (-52, HY + 4), 12)
    for sg in (-1, 1): out += O(doc, Q(wob(ell(sg * 54, HY + 8, 10, 17, 24), .8, seed + 10 + sg)), _skin(doc, skin, False), 'mid', f'<path d="M{cx + sg * 54 * s:.0f},{by + (HY + 2) * s:.0f} q{sg * 4 * s:.0f},{8 * s:.0f} 0,{14 * s:.0f}" stroke="#8A5A3A" stroke-width="{2 * s:.1f}" fill="none" opacity=".6"/>', seed + 10 + sg, .5)
    face = _skin(doc, skin, False)
    fi = ''
    # brows, eyes, nose, mouth, cheeks, light stubble shadow under nose
    for sg in (-1, 1):
        ex = sg * 22
        fi += f'<path d="{d_smooth(Q([(ex - 14, HY - 18), (ex, HY - 24), (ex + 14, HY - 18)]), False)}" stroke="#2A1B15" stroke-width="{5 * s:.1f}" fill="none" stroke-linecap="round"/>'
        fi += f'<ellipse cx="{cx + ex * s:.1f}" cy="{by + (HY - 4) * s:.1f}" rx="{12 * s:.1f}" ry="{8 * s:.1f}" fill="#FFFFFF" stroke="{INKC}" stroke-width="{2.2 * s:.1f}"/><circle cx="{cx + (ex + sg * 1.5) * s:.1f}" cy="{by + (HY - 3) * s:.1f}" r="{6.4 * s:.1f}" fill="#3A2418"/><circle cx="{cx + (ex + sg * 1.5) * s:.1f}" cy="{by + (HY - 3) * s:.1f}" r="{3 * s:.1f}" fill="#120A06"/><circle cx="{cx + (ex - 1) * s:.1f}" cy="{by + (HY - 6) * s:.1f}" r="{2 * s:.1f}" fill="#fff"/>'
        fi += f'<ellipse cx="{cx + sg * 34 * s:.1f}" cy="{by + (HY + 26) * s:.1f}" rx="{14 * s:.1f}" ry="{8 * s:.1f}" fill="#E8826E" opacity=".45"/>'
    fi += f'<path d="{d_smooth(Q([(-3, HY - 4), (-8, HY + 22), (0, HY + 28), (10, HY + 24)]), False)}" stroke="#9A6444" stroke-width="{3.4 * s:.1f}" fill="none" stroke-linecap="round" stroke-linejoin="round"/><path d="{d_smooth(Q([(-12, HY + 31), (0, HY + 35), (12, HY + 31)]), False)}" stroke="#C98F63" stroke-width="{6 * s:.1f}" fill="none" opacity=".35"/>'
    fi += f'<path d="{d_smooth(Q(bez((-24, HY + 44), (-12, HY + 62), (12, HY + 62), (24, HY + 44), 10)), False)}" stroke="{INKC}" stroke-width="{4 * s:.1f}" fill="#FFFFFF" stroke-linecap="round" stroke-linejoin="round"/><path d="{d_smooth(Q([(-24, HY + 44), (0, HY + 49), (24, HY + 44)]), False)}" stroke="{INKC}" stroke-width="{3 * s:.1f}" fill="none" stroke-linecap="round"/>'
    fi += f'<path d="{d_smooth(Q(bez((-30, HY + 52), (-20, HY + 70), (20, HY + 70), (30, HY + 52), 8)), False)}" stroke="#2A1B15" stroke-width="{2 * s:.1f}" fill="none" opacity=".18"/><rect x="{cx - 32 * s:.0f}" y="{by + (HY + 12) * s:.0f}" width="{64 * s:.0f}" height="{4 * s:.0f}" fill="none"/>'
    fi += f'<rect x="{cx + 20 * s:.0f}" y="{by + (HY - 70) * s:.0f}" width="{34 * s:.0f}" height="{140 * s:.0f}" fill="#6E3A1A" opacity=".16"/>'
    out += O(doc, Q(wob(head, 1.6, seed + 12)), face, 'mid', fi, seed + 12, .9)
    # hair + headband
    hair = bez((-54, HY - 18), (-58, HY - 66), (-30, HY - 88), (0, HY - 88), 12)[:-1] + bez((0, HY - 88), (30, HY - 88), (58, HY - 66), (54, HY - 18), 12)[:-1] + [(40, HY - 36), (20, HY - 44), (0, HY - 42), (-20, HY - 44), (-40, HY - 36)]
    out += O(doc, Q(wob(hair, 1.4, seed + 13)), RG(doc, (0, '#4A3A30'), (.6, '#241612'), (1, '#0E0806'), c=(.3, .2), r=.9), 'mid', f'<path d="{d_smooth(Q(bez((-40, HY - 62), (-20, HY - 84), (20, HY - 84), (38, HY - 66), 10)), False)}" stroke="#fff" stroke-width="{5 * s:.1f}" fill="none" opacity=".35" stroke-linecap="round"/>', seed + 13, .8)
    out += O(doc, Q(R(-58, HY - 40, 58, HY - 22, 6, 1, seed + 14)), P(doc, '#E85A4F', '#B8383A'), 'mid', f'<path d="{d_smooth(Q([(-50, HY - 34), (50, HY - 34)]), False)}" stroke="#fff" stroke-width="{2 * s:.1f}" stroke-dasharray="8 8" fill="none" opacity=".5"/>', seed + 14, .7)
    return out
