"""The noodle-stall world. One light (window, upper-left), three depth tiers (bg / mid / fg), purposeful props only.
Story props:  window = morning light / place,  jar + bottle = bumbu,  stacked bowls = service,  pot+flame = it is cooked fresh,
              es teh = the usual pairing,  bowl = the product,  chopsticks = it is meant to be eaten,  tag = the price."""
import math, random
from kit import *
from mat import *
from mat2 import *

VP = (560, -1100)
def fill_for(doc, c1, c2, x=False): return doc.lg([(0, c1), (1, c2)], 0, 0, 1 if x else 0, 0 if x else 1)

def build(doc, anim=False):
    L = {k: [] for k in ('wall', 'table', 'mid', 'fg', 'fx')}
    LAYERS = []; META = {}
    def new(name):
        lst = []; LAYERS.append((name, lst)); return lst
    # ============================================================ WALL (bg tier, d=.8)
    w = new('wall'); d_bg = .8
    g = doc.lg([(0, atm('#F6EBD7', d_bg)), (.55, atm('#EEDFC3', d_bg)), (1, atm('#E2CFAC', d_bg))])
    w.append(f'<rect x="-1200" y="-1000" width="3600" height="2030" fill="url(#{g})"/>')
    pl = doc.filt('<feTurbulence type="fractalNoise" baseFrequency="0.007" numOctaves="4" seed="4"/><feColorMatrix type="matrix" values="0 0 0 0 .62  0 0 0 0 .48  0 0 0 0 .3  1.5 0 0 0 -.62"/>', '0%', '0%', '100%', '100%')
    w.append(f'<rect x="-1200" y="-1000" width="3600" height="2030" filter="url(#{pl})" opacity=".26"/>')
    r = random.Random(11)
    for _ in range(22):
        x, y, rr = r.uniform(-300, 1400), r.uniform(-100, 1000), r.uniform(90, 260)
        w.append(f'<ellipse cx="{x:.0f}" cy="{y:.0f}" rx="{rr:.0f}" ry="{rr * .7:.0f}" fill="{r.choice(["#FFFFFF", "#D7BE98"])}" opacity="{r.uniform(.06, .15):.2f}" filter="url(#{doc.blur(26)})"/>')
    # --- window (place + time of day)
    fr = wob(rrect(-90, 66, 336, 604, 8, 8, 6, 6), 2.4, 12)
    sky = doc.lg([(0, atm('#BCD4E6', d_bg - .25)), (.7, atm('#E6EEE9', d_bg - .25)), (1, atm('#F8F0DA', d_bg - .25))])
    glass = f'<rect x="-40" y="108" width="326" height="452" fill="url(#{sky})"/>'
    for (x, bw, bh) in ((-30, 56, 130), (36, 42, 210), (90, 70, 112), (170, 50, 176), (228, 58, 124)):
        glass += f'<rect x="{x}" y="{556 - bh}" width="{bw}" height="{bh + 6}" fill="{atm("#8FA6B5", .6)}" opacity=".6"/>' + ''.join(f'<rect x="{x + 8}" y="{556 - bh + 12 + k * 32}" width="{bw - 16}" height="9" fill="#CFDCE0" opacity=".6"/>' for k in range(int(bh / 32)))
    glass += f'<ellipse cx="60" cy="520" rx="150" ry="60" fill="{atm("#86A084", .5)}" opacity=".55" filter="url(#{doc.blur(8)})"/>'
    glass += f'<circle cx="240" cy="150" r="70" fill="url(#{doc.rg([(0, "#FFFFFF", .95), (1, "#FFF3C8", 0)])})"/>'
    glass += f'<polygon points="-40,120 40,108 286,500 200,562" fill="#fff" opacity=".12"/>'                                           # diagonal glare on the pane
    w.append(solid(doc, fr, atm('#F8F1E2', d_bg), 'bg', glass + f'<rect x="-40" y="318" width="326" height="15" fill="#F8F1E2"/><rect x="118" y="108" width="15" height="452" fill="#F8F1E2"/>'
                   f'<path d="M-40,108 L-40,560 M-40,318 L286,318 M118,108 L118,560" stroke="{TIER["bg"]["c"]}" stroke-width="1.4" opacity=".6" fill="none"/>', 12)[0])
    w.append(f'<path d="{d_smooth(wob(rrect(-130, 604, 390, 632, 2, 2, 2, 2), 1.5, 14))}" fill="{atm("#E9D9B9", d_bg)}" stroke="{TIER["bg"]["c"]}" stroke-width="2.6"/>')
    w.append(f'<rect x="-130" y="630" width="520" height="12" fill="#6E4C2E" opacity=".25" filter="url(#{doc.blur(4)})"/>')
    # --- shelf with condiments (bumbu) and the serving stack
    w.append(f'<ellipse cx="860" cy="530" rx="280" ry="26" fill="#6E4C2E" opacity=".22" filter="url(#{doc.blur(9)})"/>')
    shelf = wob(rrect(600, 474, 1130, 506, 3, 3, 3, 3), 1.6, 15)
    w.append(solid(doc, shelf, fill_for(doc, atm('#C99B66', d_bg), atm('#A57445', d_bg)) and f'url(#{fill_for(doc, atm("#C99B66", d_bg), atm("#A57445", d_bg))})', 'bg', f'<rect x="600" y="474" width="530" height="8" fill="#F3DFC0" opacity=".7"/>', 15)[0])
    for bx in (650, 1060):
        w.append(solid(doc, wob([(bx, 506), (bx + 50, 506), (bx, 560)], 1.2, bx), atm('#A27040', d_bg), 'bg', '', bx)[0])
    # sambal in a glass jar
    w.append(contact(doc, 692, 474, 48, 7, .4, 3))
    w.append(f'<g>{glass_cyl(doc, 652, 732, 366, 472, .72, ("#E85B3A", "#C2301F", "#8A1B12"), 392, False, 8, 12)}</g>')
    w.append(solid(doc, wob(rrect(646, 342, 738, 368, 7, 7, 3, 3), 1, 3), atm('#C9473F', .72), 'bg', f'<rect x="646" y="344" width="92" height="5" fill="#fff" opacity=".4"/>', 3)[0])
    # kecap in a dark glass bottle
    bottle = wob(resample(bez((784, 474), (780, 440), (782, 408), (798, 388), 12)[:-1] + bez((798, 388), (806, 376), (806, 364), (806, 346), 8)[:-1] +
                           bez((806, 346), (822, 346), (838, 346), (838, 346), 4)[:-1] + bez((838, 346), (838, 364), (838, 376), (846, 388), 8)[:-1] +
                           bez((846, 388), (862, 408), (864, 440), (860, 474), 12) + [(784, 474)], 110), 1.4, 5)
    bl = doc.lg([(0, atm('#2A1810', d_bg)), (.3, atm('#5A3622', d_bg)), (1, atm('#150A07', d_bg))], 0, 0, 1, 0)
    w.append(contact(doc, 822, 474, 36, 6, .4, 3))
    w.append(solid(doc, bottle, f'url(#{bl})', 'bg', f'<rect x="784" y="412" width="78" height="46" fill="{atm("#F1E5C9", d_bg)}"/><path d="M792,428 L852,428 M792,438 L840,438" stroke="#C9473F" stroke-width="3"/>'
                   f'<path d="M792,392 L792,468" stroke="#fff" stroke-width="5" opacity=".5"/><rect x="800" y="338" width="44" height="14" fill="{atm("#C9473F", d_bg)}"/>', 6)[0])
    # stacked serving bowls
    for k, (bw, by) in enumerate(((120, 470), (108, 446), (96, 422))):
        bp = wob(bez((1020 - bw / 2, by - 22), (1020 - bw / 2 + 6, by + 6), (1020 - 20, by + 8), (1020, by + 8), 12)[:-1] + [(x, y) for x, y in bez((1020, by + 8), (1020 + 20, by + 8), (1020 + bw / 2 - 6, by + 6), (1020 + bw / 2, by - 22), 12)], 1, k)
        bp = bp + [(1020 + bw / 2 - 4, by - 26), (1020 - bw / 2 + 4, by - 26)]
        w.append(solid(doc, bp, atm('#F6EEDA', d_bg), 'bg', f'<path d="M{1020 - bw / 2},{by - 10} Q1020,{by + 4} {1020 + bw / 2},{by - 10}" stroke="{atm("#C9473F", d_bg)}" stroke-width="3" fill="none"/>', k)[0])

    # ============================================================ TABLE (wood) + counter front
    t = new('table')
    seams = [-1800, -1500, -1230, -1030, -830, -630, -430, -230, -30, 170, 380, 600, 800, 1010, 1210, 1420, 1650, 1900, 2150, 2400, 2700]
    tn = ['#E2B27C', '#DCA970', '#E6B985', '#D8A46B', '#E0B07A', '#DAA76D', '#E4B67F', '#D9A56C', '#E1B27B']
    ts, xat = wood_table(doc, VP, 1010, 1810, seams, tn, 0.0, 5)
    t.append(ts)
    t.append(f'<line x1="-1200" y1="1010" x2="2400" y2="1010" stroke="#4A301E" stroke-width="4"/>')
    cab = doc.lg([(0, '#C48D54'), (.1, '#B07A47'), (1, '#6F4727')])
    t.append(f'<rect x="-1200" y="1810" width="3600" height="1100" fill="url(#{cab})"/><rect x="-1200" y="1810" width="3600" height="18" fill="#EBC797"/><rect x="-1200" y="1828" width="3600" height="10" fill="#7C5230" opacity=".75"/>')
    t.append(f'<line x1="-1200" y1="1812" x2="2400" y2="1812" stroke="#3A2518" stroke-width="5"/>')
    for (x0, x1) in ((-300, 380), (480, 1160)):
        t.append(f'<path d="{d_smooth(wob(rrect(x0, 1940, x1, 2500, 8, 8, 8, 8), 1.4, x0))}" fill="#A06E40" opacity=".5" stroke="#4A2D18" stroke-width="3"/><path d="M{x0 + 10},1950 L{x1 - 10},1950" stroke="#E9C595" stroke-width="3" opacity=".6"/>')

    # ============================================================ MIDGROUND (d=.35): stove, pot, lid, fire, steam, es teh
    m = new('stove'); dm = .35; T = TIER['mid']
    m.append(f'<polygon points="110,1190 640,1190 940,1290 330,1300" fill="#3B2214" opacity=".34" filter="url(#{doc.blur(14)})"/>')
    m.append(contact(doc, 360, 1198, 290, 14, .55, 4))
    # --- stove: enamelled sheet steel (flat colour, crisp edge highlight, dark core on the shade side)
    st = tones('#D2463D', dm)
    sbody = wob(rrect(96, 1046, 624, 1196, 24, 24, 20, 20), 2.0, 21)
    sg = doc.lg([(0, st['light']), (.35, st['mid']), (1, st['core'])])
    inner = f'<rect x="96" y="1046" width="528" height="150" fill="url(#{sg})"/><rect x="96" y="1046" width="9" height="150" fill="#FFC4B8" opacity=".75"/><rect x="560" y="1046" width="64" height="150" fill="#5A1814" opacity=".32"/>'
    inner += f'<rect x="96" y="1046" width="528" height="13" fill="#CBD1D8"/><rect x="96" y="1046" width="528" height="4" fill="#fff" opacity=".85"/><rect x="96" y="1056" width="528" height="3" fill="#6C7681" opacity=".6"/>'
    for i in range(6): inner += f'<path d="M132,{1092 + i * 14} L262,{1092 + i * 14}" stroke="#5A1814" stroke-width="6" stroke-linecap="round" opacity=".85"/><path d="M132,{1090 + i * 14} L262,{1090 + i * 14}" stroke="#F08076" stroke-width="2" opacity=".55"/>'
    inner += f'<rect x="430" y="1104" width="56" height="30" rx="5" fill="#F1E5C9"/><path d="M438,1114 L478,1114 M438,1124 L466,1124" stroke="#9A3B33" stroke-width="2.4"/>'
    m.append(solid(doc, sbody, st['mid'], 'mid', inner, 21)[0])
    m.append(f'<circle cx="540" cy="1122" r="38" fill="#1E232C"/><circle cx="540" cy="1122" r="28" fill="#39414E"/><path d="M540,1122 L560,1100" stroke="#F0E9D6" stroke-width="8" stroke-linecap="round"/><path d="M520,1108 Q528,1096 542,1094" stroke="#fff" stroke-width="3" fill="none" opacity=".6"/>'
             + ink(wob(ell(540, 1122, 38, 38, 60), 1.2, 3), 'mid', True, .9, 3))
    plate = wob(resample([(150, 988), (570, 988), (630, 1050), (90, 1050)], 120), 1.6, 22)
    pg = doc.lg([(0, '#4F5B6C'), (1, '#222A35')])
    m.append(solid(doc, plate, f'url(#{pg})', 'mid', '<path d="M160,996 L560,996 L604,1040 L118,1040 Z" fill="#6A7688" opacity=".5"/><path d="M160,998 L390,998" stroke="#fff" stroke-width="3" opacity=".5"/>'
                   '<ellipse cx="480" cy="1022" rx="34" ry="8" fill="#101419" opacity=".5"/><ellipse cx="228" cy="1030" rx="26" ry="6" fill="#101419" opacity=".4"/>', 22)[0])
    m.append(f'<ellipse cx="360" cy="1014" rx="132" ry="26" fill="#12161C"/><ellipse cx="360" cy="1012" rx="104" ry="19" fill="#2A323E"/><ellipse cx="360" cy="1010" rx="70" ry="12" fill="#12161C"/>')
    for ang in (10, 70, 130):
        rr = math.radians(ang)
        m.append(f'<line x1="{360 - 150 * math.cos(rr):.0f}" y1="{1014 - 24 * math.sin(rr):.0f}" x2="{360 + 150 * math.cos(rr):.0f}" y2="{1014 + 24 * math.sin(rr):.0f}" stroke="#12161C" stroke-width="10" stroke-linecap="round"/>'
                 f'<line x1="{360 - 148 * math.cos(rr):.0f}" y1="{1012 - 24 * math.sin(rr):.0f}" x2="{360 + 148 * math.cos(rr):.0f}" y2="{1012 + 24 * math.sin(rr):.0f}" stroke="#7A879A" stroke-width="3" stroke-linecap="round" opacity=".8"/>')
    for x in (126, 548): m.append(f'<rect x="{x}" y="1192" width="54" height="14" rx="5" fill="#1E232C"/>')
    # --- pot (stainless)
    m = new('pot')
    pot = wob(rrect(190, 688, 530, 1004, 3, 3, 40, 40, 12), 2.2, 31)
    for side in (-1, 1):                                                              # handles drawn first: bracket + bakelite loop
        x0 = 190 if side < 0 else 530; xe = x0 + side * 90
        m.append(solid(doc, wob(rrect(min(x0, x0 + side * 30), 740, max(x0, x0 + side * 30), 782, 2, 2, 2, 2), 1, side), 'url(#' + doc.lg([(0, '#B8C1CA'), (1, '#6E7A86')], 0, 0, 1, 0) + ')', 'mid', f'<circle cx="{x0 + side * 12}" cy="753" r="4" fill="#E9EDF1"/><circle cx="{x0 + side * 12}" cy="769" r="4" fill="#E9EDF1"/>', 6)[0])
        loop = wob(resample([(x0 + side * 30, 744), (xe + side * 4, 742), (xe + side * 12, 758), (xe + side * 6, 782), (x0 + side * 30, 778)], 90), 1.4, 7 + side)
        m.append(solid(doc, loop, 'url(#' + doc.lg([(0, '#3A3F4B'), (.3, '#171B22'), (1, '#0C0F14')], 0, 0, 1, 0) + ')', 'mid', f'<path d="{d_smooth([(x0 + side * 42, 752), (xe, 750), (xe + side * 2, 762)], False)}" stroke="#7A8598" stroke-width="3.4" fill="none" opacity=".85" stroke-linecap="round"/>', 8 + side)[0])
    m.append(solid(doc, pot, '#C8D0D8', 'mid', steel_body(doc, 190, 530, 688, 1004, dm, 31, True, True), 31)[0])
    m.append(f'<path d="M190,700 L190,962" stroke="#E4E9EE" stroke-width="3" opacity=".85"/>')       # outline breaks on the lit side
    rim = wob(ell(360, 688, 172, 40, 140), 1.6, 32)
    m.append(solid(doc, rim, 'url(#' + doc.lg([(0, '#5F6B77'), (.2, '#FFFFFF'), (.5, '#CBD3DB'), (1, '#6B7783')], 0, 0, 1, 0) + ')', 'mid', '', 32)[0])
    m.append(f'<ellipse cx="360" cy="690" rx="158" ry="32" fill="#46515E"/>')
    wcl = doc.clip(d_smooth(ell(360, 693, 154, 29, 90)))
    m.append(f'<ellipse cx="360" cy="694" rx="154" ry="29" fill="url(#{doc.lg([(0, "#EAF7FF"), (.6, "#B9E0F6"), (1, "#8DC3E6")])})"/><g clip-path="url(#{wcl})">'
             + ''.join(f'<ellipse cx="{300 + k * 30}" cy="{694 + (k % 2) * 4}" rx="{60 - k * 6}" ry="{8 - k}" fill="none" stroke="#fff" stroke-width="2" opacity=".6"/>' for k in range(5))
             + '<path d="M230,684 C290,676 330,676 380,682" stroke="#fff" stroke-width="5" opacity=".8" fill="none" stroke-linecap="round"/></g>')
    for (bx, by, br) in (() if anim else ((318, 696, 13), (354, 688, 9), (396, 698, 15), (430, 690, 10), (290, 690, 8), (452, 696, 7), (372, 704, 7))):
        m.append(f'<circle cx="{bx}" cy="{by}" r="{br}" fill="#F7FCFF" opacity=".92" stroke="#6FA8D4" stroke-width="2.2"/><circle cx="{bx - br * .3:.1f}" cy="{by - br * .3:.1f}" r="{br * .28:.1f}" fill="#fff"/>')
    # --- fire under the pot
    m = new('flame')
    if not anim: m.append(flame_ring(doc, 360, 1014, 92, 15, 24, .9, 3))
    # --- steam (pressure lifts the lid: no hand needed)
    if not anim:
        m.append(smoke(doc, [(255, 662, 190, 28), (455, 662, 165, 26), (360, 668, 230, 32)], 3, .7, 24, 46, 4))
        for (x, y, rr, sd) in ((176, 668, 24, 1), (150, 636, 17, 2), (182, 612, 12, 3), (548, 668, 24, 4), (576, 636, 17, 5), (550, 610, 12, 6)):
            m.append(puff(doc, x, y, rr, sd))
    # --- lid (floating, lifted by steam)
    lid = wob(resample(bez((158, 606), (176, 512), (258, 468), (360, 468), 30)[:-1] + bez((360, 468), (462, 468), (544, 512), (562, 606), 30)[:-1] + bez((562, 606), (530, 646), (190, 646), (158, 606), 40), 150), 2.0, 41)
    m = new('lid')
    if not anim: m.append(f'<g transform="translate(8,-62) rotate(-9 360 600)">')
    m.append(solid(doc, lid, '#C8D0D8', 'mid', steel_dome(doc, 360, 540, 205, 90, dm, 42) + f'<path d="M170,612 C230,648 490,648 550,612" fill="none" stroke="#7B8691" stroke-width="9" stroke-linecap="round" opacity=".8"/>', 41)[0])
    m.append(f'<path d="M170,572 C186,512 250,476 330,470" fill="none" stroke="#EEF2F5" stroke-width="3.2" opacity=".85"/>')
    kn = wob(rrect(334, 430, 386, 476, 5, 5, 8, 8), 1.2, 9)
    m.append(solid(doc, kn, 'url(#' + doc.lg([(0, '#3A3F4B'), (.3, '#171B22'), (1, '#0C0F14')], 0, 0, 1, 0) + ')', 'mid', '<path d="M345,440 L350,470" stroke="#7C879A" stroke-width="3" opacity=".8" stroke-linecap="round"/>', 9)[0])
    if not anim: m.append('</g>')
    # --- es teh: glass material on the right (the usual pairing)
    m = new('glass')
    gx0, gx1, gt, gb = 868, 972, 948, 1190
    m.append(f'<path d="M{gx0 - 6},{gb + 4} L{gx1 + 120},{gb + 64} L{gx1 + 40},{gb + 86} L{gx0 + 6},{gb + 14} Z" fill="#B5651B" opacity=".36" filter="url(#{doc.blur(8)})"/>')       # tinted shadow through the tea
    m.append(f'<ellipse cx="{(gx0 + gx1) / 2 + 74}" cy="{gb + 52}" rx="62" ry="16" fill="#FFE2A0" opacity=".7" filter="url(#{doc.blur(5)})"/>')                                    # caustic
    m.append(contact(doc, (gx0 + gx1) / 2, gb + 6, 56, 8, .55, 3))
    m.append(glass_cyl(doc, gx0, gx1, gt, gb, dm, ('#EDA94E', '#C9741F', '#8F4710'), gt + 34, True, 18, 15))
    straw = [(930, gb - 40), (926, gt + 6), (936, gt - 84)]
    m.append(f'<path d="{d_smooth(straw, False)}" fill="none" stroke="#2A1B15" stroke-width="13" stroke-linecap="round"/><path d="{d_smooth(straw, False)}" fill="none" stroke="#FFFFFF" stroke-width="8" stroke-linecap="round"/>'
             f'<path d="{d_smooth(straw, False)}" fill="none" stroke="#D9473B" stroke-width="8" stroke-linecap="round" stroke-dasharray="12 16"/>')
    lem = wob(ell(962, gt - 4, 34, 34, 60), 1, 3)
    m.append(f'<path d="M928,{gt - 4} A34,34 0 0 1 996,{gt - 4} Z" fill="#F6D54A" stroke="{T["c"]}" stroke-width="3"/><path d="M936,{gt - 6} A26,26 0 0 1 988,{gt - 6}" fill="none" stroke="#FFF2A8" stroke-width="3"/><path d="M962,{gt - 6} L962,{gt - 34} M962,{gt - 6} L942,{gt - 26} M962,{gt - 6} L982,{gt - 26}" stroke="#E9B82B" stroke-width="2"/>')

    # ============================================================ FOREGROUND (d=0): placemat, bowl, chopsticks, tag
    f = new('placemat')
    mat = wob(resample([(230, 1548), (1010, 1548), (1100, 1800), (70, 1800)], 200), 2.2, 51)
    f.append(f'<ellipse cx="620" cy="1812" rx="560" ry="30" fill="#2A160B" opacity=".25" filter="url(#{doc.blur(8)})"/>')
    mi = linen(doc, mat, 0, 21)
    mi += f'<polygon points="244,1566 996,1566 1076,1786 96,1786" fill="none" stroke="#B9473E" stroke-width="7" opacity=".92"/><polygon points="262,1584 982,1584 1050,1770 126,1770" fill="none" stroke="#B9473E" stroke-width="2.4" stroke-dasharray="9 7" opacity=".85"/><polygon points="230,1548 1010,1548 1020,1580 220,1580" fill="#fff" opacity=".24"/>'
    f.append(solid(doc, mat, '#EFE5CF', 'fg', mi, 51, .55)[0])
    r2 = random.Random(5)
    for k in range(60):                                                              # frayed front edge
        x = 76 + k * 17.4; yy = 1800 + r2.uniform(0, 9)
        f.append(f'<path d="M{x:.0f},1800 L{x + r2.uniform(-3, 3):.0f},{yy:.0f}" stroke="#CDBA95" stroke-width="1.3" opacity=".8"/>')
    # --- bowl
    f = new('bowl')
    f.append(f'<ellipse cx="720" cy="1800" rx="470" ry="44" fill="#2A160B" opacity=".42" filter="url(#{doc.blur(14)})"/>')
    f.append(contact(doc, 640, 1796, 330, 22, .6, 4))
    foot = wob(resample([(510, 1748), (770, 1748), (772, 1778), (752, 1800), (528, 1800), (508, 1778)], 90), 1.5, 61)
    fg = doc.lg([(0, '#F0E2BF'), (1, '#C9B589')], 0, 0, 1, 0)
    ftr = ''.join(f'<circle cx="{r2.uniform(510, 770):.0f}" cy="{r2.uniform(1756, 1798):.0f}" r="{r2.uniform(.8, 1.7):.1f}" fill="#9A6F42" opacity=".55"/>' for _ in range(40))
    f.append(solid(doc, foot, f'url(#{fg})', 'fg', ftr + '<path d="M520,1790 C600,1806 680,1806 760,1790" fill="none" stroke="#9A6F42" stroke-width="5" opacity=".6"/>', 61)[0])
    body = wob(resample([(240, 1480)] + bez((240, 1480), (240, 1660), (392, 1768), (640, 1768), 60)[1:] + bez((640, 1768), (888, 1768), (1040, 1660), (1040, 1480), 60)[1:], 220), 2.4, 62)
    bi = glaze_body(doc, 230, 1480, 820, 300, 0.0, 3)
    bi += band(640, 1574, 410, 112, 34, '#C9473F', 3) + band(640, 1564, 410, 112, 5, '#8E2F29', 4, .7) + band(640, 1584, 410, 112, 4, '#E4776D', 5, .6) + band(640, 1668, 392, 108, 12, '#C9473F', 6)
    for k in range(14):
        a = .12 + k * .22; bi += f'<circle cx="{640 - 360 * math.cos(a):.0f}" cy="{1626 + 102 * math.sin(a):.0f}" r="5" fill="#C9473F" opacity=".75"/>'
    for _ in range(9):
        x, y = r2.uniform(300, 980), r2.uniform(1560, 1740); bi += f'<path d="M{x:.0f},{y:.0f} l{r2.uniform(8, 22):.0f},{r2.uniform(6, 22):.0f} l{r2.uniform(-10, 10):.0f},{r2.uniform(6, 16):.0f}" fill="none" stroke="#8C7752" stroke-width="1" opacity=".28"/>'
    bi += '<path d="M288,1536 C286,1620 330,1696 420,1740 L462,1726 C392,1682 350,1612 350,1540 Z" fill="#fff" opacity=".96"/><rect x="296" y="1600" width="170" height="7" fill="#8C7752" opacity=".35" transform="rotate(34 380 1620)"/>'   # window specular + muntin gap
    bi += '<path d="M470,1752 C530,1762 590,1764 650,1762" fill="none" stroke="#fff" stroke-width="8" stroke-linecap="round" opacity=".85"/><ellipse cx="900" cy="1646" rx="14" ry="30" transform="rotate(-18 900 1646)" fill="#fff" opacity=".4"/>'
    f.append(solid(doc, body, '#FFF8E8', 'fg', bi, 62)[0])
    f.append('<path d="M240,1500 C240,1640 330,1736 470,1762" fill="none" stroke="#FCF8EA" stroke-width="4.4" opacity=".8"/>')
    rimo = wob(ell(640, 1480, 400, 104, 200), 2.0, 63)
    f.append(solid(doc, rimo, '#FFFBF0', 'fg', '<path d="M270,1456 C330,1402 470,1380 590,1378" fill="none" stroke="#fff" stroke-width="7" stroke-linecap="round" opacity=".95"/><path d="M980,1522 C940,1556 860,1578 780,1583" fill="none" stroke="#C9B995" stroke-width="6" stroke-linecap="round" opacity=".8"/>', 63)[0])
    wi = wob(ell(640, 1484, 372, 94, 180), 1.6, 64)
    f.append(solid(doc, wi, 'url(#' + doc.lg([(0, '#D6C7A6'), (1, '#FFFBF0')]) + ')', 'fg', '<path d="M300,1470 C330,1420 440,1398 560,1394" fill="none" stroke="#fff" stroke-width="4" opacity=".6"/>', 64, .55)[0])
    bro = doc.lg([(0, '#8E4F1F'), (.6, '#B86E2A'), (1, '#6F3A14')])
    inner_cl = doc.clip(d_smooth(ell(640, 1486, 366, 90, 140)))
    bs = f'<ellipse cx="640" cy="1500" rx="352" ry="82" fill="url(#{bro})"/><g clip-path="url(#{inner_cl})">'
    for (x, y, rx, ry) in ((480, 1536, 60, 9), (700, 1546, 80, 10), (860, 1520, 46, 7), (560, 1514, 34, 5)): bs += f'<ellipse cx="{x}" cy="{y}" rx="{rx}" ry="{ry}" fill="none" stroke="#F3C16B" stroke-width="3" opacity=".6"/>'
    for _ in range(34):
        x, y = r2.uniform(330, 950), r2.uniform(1470, 1556); rr = r2.uniform(3, 9)
        bs += f'<ellipse cx="{x:.0f}" cy="{y:.0f}" rx="{rr:.1f}" ry="{rr * .6:.1f}" fill="#E8761F" opacity=".8"/><ellipse cx="{x - rr * .3:.0f}" cy="{y - rr * .2:.0f}" rx="{rr * .35:.1f}" ry="{rr * .2:.1f}" fill="#FFD9A0" opacity=".9"/>'
    bs += '</g>'
    f.append(bs)
    f = new('noodles')
    mound = doc.clip('M296,1492 C284,1410 420,1336 640,1330 C860,1336 996,1410 984,1492 C954,1568 840,1584 640,1584 C440,1584 326,1568 296,1492 Z')
    f.append(f'<g clip-path="url(#{mound})">{noodle_strands(9, 310, 970, 1350, 1566, 118)}</g>')
    f = new('egg'); META['egg'] = (466, 1450); f.append(egg_half(doc, 466, 1450, 104, 72, 4))
    f = new('sawi'); META['sawi'] = (790, 1420); f.append(pak_choy(doc, 790, 1420, .92, 6))
    f = new('ball1'); META['ball1'] = (790, 1510); f.append(meatball(doc, 790, 1510, 46, 1))
    f = new('ball2'); META['ball2'] = (688, 1528); f.append(meatball(doc, 688, 1528, 40, 2))
    for i, (x, y, rr) in enumerate(((586, 1436, 20), (630, 1458, 17), (548, 1472, 15), (640, 1412, 14), (950, 1460, 15))):
        f = new(f'chili{i}'); META[f'chili{i}'] = (x, y); f.append(chili_slice(doc, x, y, rr, int(x)))
    for i, (x, y) in enumerate(((560, 1500), (610, 1512), (900, 1484), (520, 1424), (684, 1448), (860, 1512))):
        f = new(f'scal{i}'); META[f'scal{i}'] = (x, y); f.append(scallion(doc, x, y))
    f = new('garnish')
    for _ in range(60):
        x, y = r2.uniform(380, 940), r2.uniform(1380, 1556)
        if ((x - 466) / 116) ** 2 + ((y - 1452) / 80) ** 2 < 1 or (680 < x < 905 and 1330 < y < 1500) or ((x - 790) / 54) ** 2 + ((y - 1510) / 54) ** 2 < 1 or ((x - 688) / 48) ** 2 + ((y - 1528) / 48) ** 2 < 1: continue
        f.append(f'<path d="M{x:.0f},{y:.0f} q5,-5 11,-1" fill="none" stroke="#7A4A18" stroke-width="3" stroke-linecap="round" opacity=".8"/>')
    for _ in range(40):
        x, y = r2.uniform(340, 940), r2.uniform(1370, 1556); f.append(f'<circle cx="{x:.0f}" cy="{y:.0f}" r="{r2.uniform(1, 1.9):.1f}" fill="#1B0E06" opacity=".7"/>')
    f = new('lip')
    lip = wob(resample([(240, 1486)] + bez((240, 1486), (262, 1556), (420, 1584), (640, 1584), 40)[1:] + bez((640, 1584), (860, 1584), (1018, 1556), (1040, 1486), 40)[1:] +
                       bez((1040, 1486), (1018, 1566), (880, 1584), (640, 1584), 40)[1:] + bez((640, 1584), (400, 1584), (260, 1566), (240, 1486), 40)[1:], 200), 1.2, 65, True)
    f.append(f'<path d="M240,1486 C262,1556 420,1584 640,1584 C860,1584 1018,1556 1040,1486 C1020,1566 880,1584 640,1584 C400,1584 260,1566 240,1486 Z" fill="#FFFBF0"/>')
    f.append(f'<path d="M244,1496 C292,1574 450,1586 640,1586 C830,1586 988,1574 1036,1496" fill="none" stroke="{TIER["fg"]["c"]}" stroke-width="3.6" stroke-linecap="round"/><path d="M300,1556 C380,1580 500,1590 600,1590" fill="none" stroke="#fff" stroke-width="5" stroke-linecap="round" opacity=".9"/>')
    if not anim: f.append(smoke(doc, [(540, 1372, 240, 40), (672, 1364, 280, 44), (792, 1376, 220, 36)], 9, .62, 26, 52, 5))
    f = new('chopsticks')
    # --- chopsticks (lacquered handle, bare-wood tip) resting on the mat
    def stick(x1, y1, x2, y2, w1, w2):
        dx, dy = x2 - x1, y2 - y1; Ln = math.hypot(dx, dy); nx, ny = -dy / Ln, dx / Ln
        return [(x1 + nx * w1, y1 + ny * w1), (x2 + nx * w2, y2 + ny * w2), (x2 - nx * w2, y2 - ny * w2), (x1 - nx * w1, y1 - ny * w1)], (nx, ny)
    for (x1, y1, x2, y2) in ((-30, 1742, 372, 1628), (-24, 1806, 356, 1684)):
        p4, (nx, ny) = stick(x1, y1, x2, y2, 11, 5.5)
        sp = wob(resample(p4, 60), .8, int(y1))
        f.append(f'<path d="{d_smooth(sp)}" fill="#2A160B" opacity=".4" transform="translate(10,14)" filter="url(#{doc.blur(2)})"/>')
        lac = stick(x1, y1, x1 + (x2 - x1) * .4, y1 + (y2 - y1) * .4, 11, 9)[0]
        wd = 'url(#' + doc.lg([(0, '#EAD2A6'), (1, '#BF8F5A')], 0, 0, 0, 1) + ')'
        inner = f'<polygon points="{" ".join(f"{x:.1f},{y:.1f}" for x, y in lac)}" fill="#8E2F29"/><path d="M{x1 + nx * 5:.1f},{y1 + ny * 5:.1f} L{x1 + (x2 - x1) * .4 + nx * 3:.1f},{y1 + (y2 - y1) * .4 + ny * 3:.1f}" stroke="#F08076" stroke-width="3" opacity=".85"/>'
        inner += f'<path d="M{x1 + (x2 - x1) * .42 + nx * 6:.1f},{y1 + (y2 - y1) * .42 + ny * 6:.1f} l{(x2 - x1) * .5:.1f},{(y2 - y1) * .5:.1f}" stroke="#FFF1D4" stroke-width="2.4" opacity=".8" stroke-linecap="round"/>'
        f.append(solid(doc, sp, wd, 'fg', inner, int(y1), .6)[0])
    # --- price tag (paper card, twine, brass eyelet)
    f = new('tag')
    f.append('<g transform="translate(-78,-30) rotate(5 850 1752)">')
    f.append(f'<rect x="650" y="1722" width="420" height="104" rx="18" fill="#2A160B" opacity=".4" transform="translate(10,14)" filter="url(#{doc.blur(4)})"/>')
    f.append('<path d="M662,1736 C630,1740 610,1762 618,1784" fill="none" stroke="#2A1B15" stroke-width="9" stroke-linecap="round"/><path d="M662,1736 C630,1740 610,1762 618,1784" fill="none" stroke="#E6CC9D" stroke-width="4.5" stroke-linecap="round" stroke-dasharray="5 3"/>')
    tag = wob(resample([(700, 1704), (1030, 1704), (1066, 1740), (1066, 1788), (1030, 1824), (700, 1824), (644, 1764)], 170), 1.4, 71)
    ti = f'<rect x="640" y="1704" width="430" height="46" fill="#fff" opacity=".17"/><rect x="640" y="1806" width="430" height="20" fill="#7E2723" opacity=".22"/>' + ''.join(f'<path d="M{r2.uniform(660, 1060):.0f},{r2.uniform(1708, 1820):.0f} l{r2.uniform(6, 16):.0f},{r2.uniform(-3, 3):.0f}" stroke="#fff" stroke-width="1" opacity=".18"/>' for _ in range(40))
    f.append(solid(doc, tag, 'url(#' + doc.lg([(0, '#E3665D'), (1, '#BD3F38')]) + ')', 'fg', ti, 71)[0])
    f.append(f'<circle cx="684" cy="1764" r="16" fill="#E7C777"/><circle cx="684" cy="1764" r="16" fill="none" stroke="#2A1B15" stroke-width="3.6"/><circle cx="684" cy="1764" r="6.5" fill="#7E2723"/><path d="M674,1758 A11,11 0 0 1 686,1752" fill="none" stroke="#FFF3C8" stroke-width="2.6" stroke-linecap="round"/>')
    f.append('<text x="880" y="1777" text-anchor="middle" font-family="DejaVu Sans Mono, Menlo, monospace" font-weight="700" font-size="32" fill="#fff" stroke="#7E2723" stroke-width="2" paint-order="stroke">Rp 10.000 - 15.000</text></g>')

    # ============================================================ FX: shafts, spotlight (hierarchy), grade
    x = new('fx')
    sh = doc.lg([(0, '#FFF6DC', .6), (1, '#FFF6DC', 0)], 0, 0, 1, 1)
    x.append(f'<polygon points="330,120 330,570 960,1110 1130,1010 1130,760 600,260" fill="url(#{sh})" opacity=".5" filter="url(#{doc.blur(14)})"/>')
    x.append(f'<polygon points="120,560 330,580 840,1560 420,1500" fill="#FFF3D4" opacity=".14" filter="url(#{doc.blur(26)})"/>')
    spot = doc.rg([(0, '#FFE9B8', .42), (.55, '#FFE9B8', .13), (1, '#FFE9B8', 0)], 640, 1480, 620, user=True)
    x.append(f'<ellipse cx="640" cy="1480" rx="640" ry="520" fill="url(#{spot})"/>')
    vig = doc.rg([(0, '#000', 0), (.55, '#000', 0), (1, '#2A1408', .5)], 540, 1000, 1150, user=True)
    x.append(f'<rect x="-1200" y="-1000" width="3600" height="4000" fill="url(#{vig})"/>')
    return L if not anim else (LAYERS, META)
