"""Storyboard key frames: ONE background (ivory grid like the reference), 15 DIFFERENT layouts. No bottom caption."""
import sys, os, math
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import numpy as np
from PIL import Image, ImageDraw, ImageFont
import full2 as F2
import full as FU
from full import *
from full2 import SPG1_L, SPG3_L, CUST2_L, CROWD2

T = 10.0   # fully revealed
def M(size, bold=True): return F("SpaceMono-Bold.ttf" if bold else "SpaceMono.ttf", size)

def card(w, h, head=None, fill=PAPER, border=INK, bw=4, hc=INK):
    im = Image.new("RGBA", (w, h), fill + (255,)); d = ImageDraw.Draw(im)
    d.rectangle((0, 0, w - 1, h - 1), outline=border + (255,), width=bw)
    if head:
        d.text((22, 18), head, font=M(24), fill=hc + (255,)); d.line((22, 58, w - 22, 58), fill=(150, 146, 134, 255), width=2)
    return im

def put(L, im, cx, cy, scale=1.0, rot=0.0, shadow=True):
    if shadow and not im.info.get('sh'): im = shadowed(im, 30, 12, 10, 90)
    paste(L, im, cx, cy, scale=scale, rot=rot)

def txt(L, text, x, y, size=30, fill=INK, anchor="la", bold=True):
    ImageDraw.Draw(L).text((x, y), text, font=M(size, bold), fill=fill + (255,), anchor=anchor)

def big(L, lines, x, y, size, **kw): return title(L, lines, T, t0=0, x=x, y=y, size=size, **kw)

def dotp(L, x, y, r=22, col=RED):
    d = ImageDraw.Draw(L); d.ellipse((x - r - 18, y - r - 18, x + r + 18, y + r + 18), outline=col + (110,), width=5); d.ellipse((x - r, y - r, x + r, y + r), fill=col + (255,), outline=PAPER + (255,), width=5)

def ln(L, p0, p1, col=INK, w=6): ImageDraw.Draw(L).line((p0[0], p0[1], p1[0], p1[1]), fill=col + (255,), width=w)
def node(L, x, y, col): ImageDraw.Draw(L).ellipse((x - 26, y - 26, x + 26, y + 26), fill=col + (255,), outline=PAPER + (255,), width=6)

def small_cut(im, h): return im.resize((int(im.width * h / im.height), h), Image.LANCZOS)

# ---------------------------------------------------------------- 15 layouts
def b01(L):   # title top-left, small brand cards beside it, big polaroid + stamp (ref: "WHY ZUCKERBERG CAN'T BE FIRED")
    head_chip(L, "STRATEGI GERILYA  /  PROCHIZ", T)
    big(L, [[("KOMPETITOR", INK)], [("MENGUASAI", INK)], [("RAK", INK), ("KEJU.", BLUE)]], SL, 338, 128)
    for i, y in enumerate((340, 500, 660)):
        c = card(120, 130, None); d = ImageDraw.Draw(c); d.rectangle((26, 22, 94, 78), fill=BLUE + (255,)); d.text((60, 105), f"BRAND {'ABC'[i]}", font=M(17), fill=INK + (255,), anchor="mm")
        put(L, c, 880, y + 20, rot=(-4, 3, -2)[i])
    put(L, CARD_KEJU, CX, 1150, rot=-3)
    put(L, STAMP_A, CX, 1190, rot=-8, shadow=False); dotp(L, 520, 1010)

def b02(L):   # subject centre-bottom with red dot + line from the title (ref: Zuckerberg waving, red dot on head)
    head_chip(L, "SERANGAN BALIK", T, bg=RED)
    big(L, [[("PROCHIZ", RED)], [("MENYERANG", INK), ("DARI", INK)], [("RAK", INK), ("ROTI", INK), ("TAWAR!", INK)]], SL, 338, 120)
    paste(L, SPG1_L, 600, 1540 - SPG1_L.height / 2)
    hx, hy = 600, 1540 - SPG1_L.height + 40
    ln(L, (hx, 720), (hx, hy), RED, 5); dotp(L, hx, hy, 14)
    put(L, CARD_ROTI, 340, 1230, scale=0.8, rot=3)

def b03(L):   # big single heading + tag top-right, document card (store plan) in the middle (ref: "2006 / YAHOO" + cheque)
    c = mk_chip("WAKTU MASUK KE", 28); paste(L, c, SL + c.width / 2, ST + c.height / 2)
    big(L, [[("SUPERMARKET", RED)]], SL, 330, 140)
    tag = mk_chip("PROCHIZ MASUK", 26, bg=RED); put(L, tag, 730, 585, rot=3)
    ln(L, (730, 548), (730, 500), RED, 4)
    plan = card(820, 560, "DENAH TOKO  ·  TAMPAK ATAS"); d = ImageDraw.Draw(plan)
    for i in range(5):
        col = BLUE if i == 1 else (RED if i == 3 else (205, 199, 182)); d.rounded_rectangle((70 + i * 150, 100, 140 + i * 150, 420), 8, fill=col + (255,), outline=INK + (255,), width=4)
    d.line((410, 540, 410, 440), fill=RED + (255,), width=10); d.polygon([(385, 450), (435, 450), (410, 410)], fill=RED + (255,))
    d.text((70, 440), "KEJU", font=M(20), fill=BLUE + (255,)); d.text((505, 440), "ROTI TAWAR", font=M(20), fill=RED + (255,))
    put(L, plan, CX, 1010)
    put(L, duotone_card(A + "aisle/aisle_roti.png", 340, (60, 12, 8), (252, 228, 214)), 300, 1360, rot=-4)
    paste(L, small_cut(SPG2, 480), 850, 1540 - 240)

def b04(L):   # two waffle grids side by side + two big words (ref: "13% / 61%" waffle scene)
    head_chip(L, "RAK KEJU", T, bg=BLUE)
    big(L, [[("TIDAK", INK), ("BISA", INK), ("SEKADAR", INK)], [("MENGANDALKAN", INK)], [("RAK", INK), ("KEJU", BLUE)]], SL, 338, 100)
    for k, (x0, lab, one) in enumerate(((SL + 20, "RAK KEJU", False), (528, "RAK KEJU", True))):
        g = card(400, 470, lab + ("  ·  PROCHIZ" if one else "  ·  KOMPETITOR")); d = ImageDraw.Draw(g)
        for r in range(6):
            for c in range(5):
                col = RED if (one and r == 5 and c == 4) else (BLUE if not one or (r, c) != (5, 4) else RED)
                if one and not (r == 5 and c == 4): col = (205, 199, 182)
                d.rounded_rectangle((26 + c * 68, 84 + r * 62, 26 + c * 68 + 56, 84 + r * 62 + 50), 6, fill=col + (255,), outline=INK + (255,), width=3)
        put(L, g, x0 + 200, 1020, rot=(-1.5, 1.5)[k])
    big(L, [[("BANYAK", INK)]], SL + 20, 1330, 112); big(L, [[("SEDIKIT", RED)]], 548, 1330, 112)
    c = mk_chip("ILUSTRASI", 24, fg=INK, bg=(215, 210, 192)); paste(L, c, SR - c.width / 2 - 6, 1470)

def b05(L):   # huge heading + progress bars, subject bottom-left (ref: "50%+" with bar, Zuck bottom-left)
    big(L, [[("LEBIH", INK), ("DULU", INK)], [("DIKENAL", BLUE)]], SL, 300, 150)
    c = card(860, 330, "TINGKAT DIKENAL  ·  ILUSTRASI"); d = ImageDraw.Draw(c)
    for i, (nm, col, fr) in enumerate((("BRAND LAWAN", BLUE, 0.92), ("PROCHIZ", RED, 0.26))):
        y = 96 + i * 108; d.text((26, y - 4), nm, font=M(22), fill=INK + (255,)); d.rounded_rectangle((26, y + 28, 834, y + 74), 10, fill=(240, 238, 230, 255), outline=INK + (255,), width=3)
        d.rounded_rectangle((30, y + 32, 30 + int(800 * fr), y + 70), 8, fill=col + (255,))
    put(L, c, CX, 880)
    paste(L, small_cut(CUST1, 430), 290, 1540 - 215)
    q = card(430, 150, None, fill=(255, 255, 255)); d = ImageDraw.Draw(q); d.text((215, 75), "mana yang\nProchiz ya?", font=M(30), fill=INK + (255,), anchor="mm", align="center")
    put(L, q, 730, 1400, rot=3)

def b06(L):   # subject large bottom-right, polaroid left-middle, stamp (ref: Steve Jobs scene)
    head_chip(L, "RAK KEJU", T, bg=BLUE)
    big(L, [[("BEREBUT", INK), ("PERHATIAN", INK)], [("DI", INK), ("RAK", INK), ("KEJU", BLUE)]], SL, 338, 112)
    put(L, CARD_KEJU, 345, 900, scale=0.58, rot=-5)
    paste(L, CROWD2, 520, 1540 - CROWD2.height / 2 + 4)
    paste(L, STAMP_B, 330, 1230, rot=-7)

def b07(L):   # giant word left, two small document cards, small figure (ref: "1985" big number + small cards + figure)
    c = mk_chip("PENDEKATAN BERBEDA", 28, bg=RED); paste(L, c, SL + c.width / 2, ST + c.height / 2)
    big(L, [[("BEDA.", RED)]], SL, 330, 300)
    a = card(400, 210, "RAK KEJU", fill=(232, 230, 222)); ImageDraw.Draw(a).line((40, 90, 360, 190), fill=BLUE + (255,), width=10); ImageDraw.Draw(a).line((40, 190, 360, 90), fill=BLUE + (255,), width=10)
    put(L, a, 300, 880, rot=-3)
    b = card(400, 210, "RAK ROTI TAWAR", hc=RED); ImageDraw.Draw(b).rounded_rectangle((40, 100, 360, 180), 10, fill=RED + (255,))
    put(L, b, 400, 1160, rot=2); arrow(L, (300, 1000), (360, 1050), T, 0, 0.01, w=10, head=26)
    paste(L, small_cut(SPG2, 760), 800, 1540 - 380)

def b08(L):   # one big polaroid on top, subject overlapping its corner, mini-map bottom-left (ref: Meta HQ polaroid + figure)
    big(L, [[("SPG", RED), ("DI", INK), ("LORONG", INK)], [("ROTI", INK), ("TAWAR", INK)]], SL, 338, 112)
    put(L, duotone_card(A + "aisle/aisle_roti.png", 740, (60, 12, 8), (252, 228, 214)), 480, 880, rot=-2)
    dotp(L, 330, 900)
    paste(L, SPG1_L, 760, 1540 - SPG1_L.height / 2)
    mm = card(340, 280, "LORONG"); d = ImageDraw.Draw(mm)
    for i in range(4): d.rectangle((40 + i * 70, 96, 80 + i * 70, 240), fill=((205, 199, 182), RED, (205, 199, 182), (205, 199, 182))[i], outline=INK + (255,), width=3)
    put(L, mm, 270, 1330, rot=-3)

def b09(L):   # subject bottom-left, speech bubbles with arrows, product card right (ref: "TAKE IT, MARK" bubbles)
    big(L, [[("CUSTOMER", INK)], [("CARI", INK), ("ROTI", RED)]], SL, 338, 124)
    paste(L, CUST2_L, 330, 1540 - CUST2_L.height / 2)
    note = Image.new("RGBA", (400, 190), (255, 232, 120, 255)); ImageDraw.Draw(note).text((200, 95), "roti apa ya?", font=M(48), fill=INK + (255,), anchor="mm")
    put(L, note, 730, 930, rot=-4)
    pc = card(330, 360, "ROTI TAWAR"); pc.alpha_composite(small_cut(P_ROTI, 220), (55, 100)); ImageDraw.Draw(pc).text((165, 332), "dicari customer", font=M(24), fill=RED + (255,), anchor="mm")
    put(L, pc, 750, 1290, rot=3)
    ln(L, (560, 1020), (640, 1090), RED, 5)

def b10(L):   # equation row + big result line (ref: "1 SHARE = 10 VOTES")
    big(L, [[("KEJU", RED)], [("PENDAMPING", INK), ("ROTI", INK)]], SL, 338, 120)
    for cx, im, tag, bg in ((290, P_ROTI, "ROTI", INK), (770, P_KEJU, "KEJU", RED)):
        c = card(320, 400, None); c.alpha_composite(small_cut(im, 240), (40, 55)); put(L, c, cx - (0 if cx < 500 else 20), 1000, rot=(-3, 3)[cx > 500])
        chip = mk_chip(tag, 30, bg=bg); paste(L, chip, cx, 1230)
    txt(L, "+", CX, 1000, 150, RED, "mm")
    big(L, [[("ROTI", INK), ("+", RED), ("KEJU", INK), ("=", INK), ("COCOK", RED)]], SL, 1330, 104)

def b11(L):   # two stacked lanes (ref: seat diagram, top vs bottom)
    big(L, [[("MENUNGGU", (120, 116, 104)), ("vs", INK)], [("MENDATANGI", RED)]], SL, 338, 112)
    for y, tag, col, who, cross in ((880, "MENUNGGU", INK, CUST3, True), (1290, "MENDATANGI", RED, SPG2, False)):
        c = card(840, 380, tag, hc=col); d = ImageDraw.Draw(c)
        c.alpha_composite(small_cut(who, 270), (560, 90))
        d.rounded_rectangle((40, 130, 250, 320), 8, outline=INK + (255,), width=4, fill=(230, 226, 214, 255)); d.text((145, 225), "RAK", font=M(26), fill=INK + (255,), anchor="mm")
        if cross: d.line((270, 225, 520, 225), fill=(150, 146, 134, 255), width=6); d.text((395, 190), "tidak datang", font=M(20), fill=INK + (255,), anchor="mm"); d.line((370, 205, 420, 245), fill=RED + (255,), width=6); d.line((420, 205, 370, 245), fill=RED + (255,), width=6)
        else: d.line((270, 225, 520, 225), fill=RED + (255,), width=10); d.polygon([(520, 200), (560, 225), (520, 250)], fill=RED + (255,))
        put(L, c, CX, y, rot=(-1, 1)[not cross])

def b12(L):   # vertical timeline with cards to the right (ref: seat/vertical diagrams)
    big(L, [[("TEPAT", INK), ("SAAT", INK)], [("KEBUTUHAN", RED), ("MUNCUL.", INK)]], SL, 338, 112)
    ln(L, (150, 800), (150, 1470), INK, 10)
    items = ((830, "AMBIL ROTI", INK, CUST2, "customer pilih roti"), (1130, "KEBUTUHAN MUNCUL", RED, None, "butuh pendamping"), (1430, "TAWARKAN KEJU", BLUE, SPG2, "SPG menyodorkan keju"))
    for y, tag, col, who, note in items:
        node(L, 150, y, col)
        c = card(640, 220, tag, hc=col); ImageDraw.Draw(c).text((22, 100), note, font=M(24, False), fill=INK + (255,))
        if who: c.alpha_composite(small_cut(who, 190), (440, 18))
        else: ImageDraw.Draw(c).ellipse((470, 80, 570, 180), fill=RED + (255,))
        put(L, c, 560, y, rot=(1, -1, 1)[items.index((y, tag, col, who, note))])
    dotp(L, 150, 1130, 26)

def b13(L):   # two giant words split by a rule, subject half-body bottom-centre (ref: "13% | 61%" end frames)
    big(L, [[("STRATEGI", INK)]], SL, 340, 150); ln(L, (SL, 520), (SR, 520), INK, 6)
    big(L, [[("GERILYA", RED)]], SL, 560, 150)
    txt(L, "PROCHIZ  ·  SUPERMARKET", SL, 800, 28, INK)
    paste(L, SPG3_L, 600, 1540 - SPG3_L.height / 2 + 6)

def b14(L):   # list card + subject pointing at it (ref: "WHO SHOULD I BREAK DOWN NEXT?")
    big(L, [[("MEREBUT", INK)], [("PERHATIAN", RED)], [("CUSTOMER", INK)]], SL, 338, 120)
    c = card(520, 420, "MOMEN CUSTOMER"); d = ImageDraw.Draw(c)
    for i, (tx, col) in enumerate((("CARI ROTI", INK), ("BUTUH PENDAMPING", BLUE), ("TERTARIK KEJU", RED))):
        d.rectangle((26, 90 + i * 100, 494, 160 + i * 100), fill=col + (255,)); d.text((260, 125 + i * 100), tx, font=M(26), fill=(255, 255, 255, 255), anchor="mm")
    put(L, c, 345, 1000, rot=-2)
    paste(L, small_cut(CUST4, 800), 740, 1540 - 400)
    arrow(L, (620, 1180), (560, 1080), T, 0, 0.01, w=8, head=22)

def b15(L):   # proposal-card layout (ref: "GIVE EVERY SHARE ONE VOTE" card + bar + small figure)
    big(L, [[("MEMPERLUAS", INK)], [("PENETRASI", BLUE)], [("PASAR.", INK)]], SL, 338, 112)
    c = card(860, 440, "PROPOSAL  ·  PENETRASI PASAR"); d = ImageDraw.Draw(c)
    d.text((26, 90), "PENETRASI PASAR PROCHIZ", font=M(26), fill=INK + (255,)); d.rounded_rectangle((26, 150, 834, 230), 12, fill=(240, 238, 230, 255), outline=INK + (255,), width=4); d.rounded_rectangle((30, 154, 30 + int(800 * 0.82), 226), 9, fill=RED + (255,))
    d.line((430, 140, 430, 245), fill=INK + (255,), width=3)
    d.text((26, 290), "tersebar di lebih banyak rak", font=M(24, False), fill=INK + (255,)); d.text((26, 340), "TERUS NAIK", font=M(30), fill=RED + (255,))
    put(L, c, CX, 960)
    paste(L, small_cut(SPG2, 330), 800, 1540 - 165); paste(L, small_cut(CUST2, 300), 280, 1540 - 150)

SCN = [
    ("00:00", "Kompetitor menguasai rak keju.", b01), ("01:59", "Prochiz justru menyerang dari rak roti tawar!", b02),
    ("04:07", "Waktu masuk ke supermarket, Prochiz sadar satu hal:", b03), ("07:05", "tidak bisa sekadar mengandalkan rak keju", b04),
    ("09:15", "untuk bersaing dengan brand yang sudah jauh lebih dulu dikenal.", b05), ("12:09", "Daripada hanya berebut perhatian customer di rak keju,", b06),
    ("15:03", "Prochiz mengambil pendekatan berbeda.", b07), ("17:12", "Mereka menempatkan SPG di lorong roti tawar,", b08),
    ("20:03", "tempat customer sedang mencari roti.", b09), ("23:05", "Di momen itulah Prochiz menawarkan keju sebagai pendamping roti.", b10),
    ("26:24", "Alih-alih menunggu... Prochiz mendatangi customer lebih dulu,", b11), ("31:23", "tepat ketika kebutuhan mereka muncul.", b12),
    ("35:22", "Inilah salah satu strategi gerilya Prochiz", b13), ("38:10", "untuk merebut perhatian customer", b14),
    ("39:29", "dan memperluas penetrasi pasar.", b15),
]

def frame_of(fn):
    base = BG.copy(); L = Image.new("RGBA", (W, H), (0, 0, 0, 0)); fn(L); base.alpha_composite(L); return base.convert("RGB"), L

if __name__ == "__main__":
    mode = sys.argv[1] if len(sys.argv) > 1 else "sheet"
    if mode == "safe":
        bad = 0
        for i, (tm, vo, fn) in enumerate(SCN):
            L = frame_of(fn)[1]; bb = L.getchannel("A").point(lambda v: 255 if v > 125 else 0).getbbox()
            if bb and (bb[0] < SL - 6 or bb[2] > SR + 6 or bb[1] < ST - 6 or bb[3] > SB + 6): bad += 1; print(i + 1, fn.__name__, bb)
        print("violations:", bad)
    else:
        PW, PH = 432, 768; gap = 20; cols = 5; rows = 3
        sheet = Image.new("RGB", (cols * (PW + gap) + gap, rows * (PH + 96) + gap), (28, 28, 32)); d = ImageDraw.Draw(sheet)
        hf = ImageFont.truetype("/usr/share/fonts/opentype/inter/Inter-Bold.otf", 22); nf = ImageFont.truetype("/usr/share/fonts/opentype/inter/Inter-Medium.otf", 17)
        for i, (tm, vo, fn) in enumerate(SCN):
            im = frame_of(fn)[0].resize((PW, PH), Image.LANCZOS)
            x = gap + (i % cols) * (PW + gap); y = gap + (i // cols) * (PH + 96)
            d.text((x, y + 2), f"{i + 1:02d}", font=hf, fill=(255, 210, 90)); d.text((x + 46, y + 2), f"{tm.replace(':', '.')}s", font=hf, fill=(200, 200, 200))
            sheet.paste(im, (x, y + 34))
            d.rectangle((x + int(SL * PW / W), y + 34 + int(ST * PH / H), x + int(SR * PW / W), y + 34 + int(SB * PH / H)), outline=(0, 150, 255), width=1)
            words = vo.split(); line = ""; ly = y + 34 + PH + 6
            for w_ in words:
                if nf.getlength(line + " " + w_) > PW: d.text((x, ly), line, font=nf, fill=(235, 235, 235)); ly += 22; line = w_
                else: line = (line + " " + w_).strip()
            d.text((x, ly), line, font=nf, fill=(235, 235, 235))
        sheet.save(R + "prochiz_test/storyboard_v4.png"); print(sheet.size)
