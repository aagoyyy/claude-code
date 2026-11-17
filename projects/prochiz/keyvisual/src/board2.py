"""Re-laid-out frames: scenes that had tiny people (3, 5, 7, 11, 12, 15) now use big figures."""
import sys, os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import numpy as np
from PIL import Image, ImageDraw
import board as B
from board import *
from full2 import _cut, SPG3_L, CROWD2

def X(name, src, h, color=False):
    return _cut(A + f"cutouts/{name}.png", h, cell=5 if not color else 4, mix=0.10, color=color, fill_holes=True, src=SRC + src)
SPG2_X = X("spg2", "SPG-2 menawarkan sampel.png", 860, True)
CUST1_X = X("cust1", "CUST-1 bingung.png", 860)
CUST2_X = X("cust2", "CUST-2 pegang roti.png", 860)
CUST3_X = X("cust3", "CUST-3 menunggu.png", 860)
SPG3_X = fade_bottom(X("spg3", "SPG-3 setengah badan.png", 760, True), 100)

def n03(L):   # SPG big, entering; compact store plan; red arrow
    c = mk_chip("WAKTU MASUK KE", 28); paste(L, c, SL + c.width / 2, ST + c.height / 2)
    big(L, [[("SUPERMARKET", RED)]], SL, 330, 140)
    plan = card(500, 440, "DENAH TOKO"); d = ImageDraw.Draw(plan)
    for i in range(4):
        col = BLUE if i == 1 else (RED if i == 2 else (205, 199, 182)); d.rounded_rectangle((50 + i * 106, 96, 106 + i * 106, 330), 8, fill=col + (255,), outline=INK + (255,), width=4)
    d.line((250, 420, 250, 350), fill=RED + (255,), width=10); d.polygon([(228, 362), (272, 362), (250, 326)], fill=RED + (255,))
    d.text((100, 345), "KEJU", font=M(20), fill=BLUE + (255,)); d.text((300, 345), "ROTI", font=M(20), fill=RED + (255,))
    put(L, plan, 335, 950, rot=-2)
    tag = mk_chip("PROCHIZ MASUK", 26, bg=RED); put(L, tag, 330, 1230, rot=2)
    put(L, duotone_card(A + "aisle/aisle_roti.png", 310, (60, 12, 8), (252, 228, 214)), 320, 1370, rot=-3)
    paste(L, SPG2_X, 790, 1540 - SPG2_X.height / 2)

def n05(L):   # customer big on the left looking at a tall vertical bar chart
    big(L, [[("LEBIH", INK), ("DULU", INK)], [("DIKENAL", BLUE)]], SL, 300, 150)
    paste(L, CUST1_X, 290, 1540 - CUST1_X.height / 2)
    c = card(430, 600, "TINGKAT DIKENAL"); d = ImageDraw.Draw(c)
    d.rectangle((60, 130, 180, 470), fill=BLUE + (255,), outline=INK + (255,), width=4); d.rectangle((250, 400, 370, 470), fill=RED + (255,), outline=INK + (255,), width=4)
    d.text((120, 500), "BRAND\nLAWAN", font=M(20), fill=INK + (255,), anchor="ma", align="center"); d.text((310, 500), "PROCHIZ", font=M(20), fill=RED + (255,), anchor="ma")
    d.text((215, 570), "ILUSTRASI", font=M(16, False), fill=(110, 106, 94, 255), anchor="ma")
    put(L, c, 735, 1130, rot=2)
    q = card(360, 130, None, fill=(255, 255, 255)); ImageDraw.Draw(q).text((180, 65), "mana yang\nProchiz ya?", font=M(28), fill=INK + (255,), anchor="mm", align="center")
    put(L, q, 500, 700, rot=-3)

def n07(L):   # giant word + two cards left, SPG big right
    c = mk_chip("PENDEKATAN BERBEDA", 28, bg=RED); paste(L, c, SL + c.width / 2, ST + c.height / 2)
    big(L, [[("BEDA.", RED)]], SL, 330, 300)
    paste(L, SPG2_X, 770, 1540 - SPG2_X.height / 2)
    a = card(380, 200, "RAK KEJU", fill=(232, 230, 222)); ImageDraw.Draw(a).line((40, 90, 340, 180), fill=BLUE + (255,), width=10); ImageDraw.Draw(a).line((40, 180, 340, 90), fill=BLUE + (255,), width=10)
    put(L, a, 290, 940, rot=-3)
    b = card(380, 200, "RAK ROTI TAWAR", hc=RED); ImageDraw.Draw(b).rounded_rectangle((40, 96, 340, 172), 10, fill=RED + (255,))
    put(L, b, 330, 1230, rot=2); arrow(L, (290, 1050), (330, 1120), T, 0, 0.01, w=10, head=26)

def n11(L):   # two big figures facing each other, red arrow between them
    big(L, [[("MENUNGGU", (120, 116, 104)), ("vs", INK)], [("MENDATANGI", RED)]], SL, 338, 112)
    paste(L, CUST3_X, 270, 1540 - CUST3_X.height / 2)
    paste(L, SPG2_X, 790, 1540 - SPG2_X.height / 2)
    c1 = mk_chip("MENUNGGU", 34, bg=INK); put(L, c1, 270, 1470, rot=-2); c2 = mk_chip("MENDATANGI", 34, bg=RED); put(L, c2, 790, 1470, rot=2)
    arrow(L, (640, 1060), (440, 1060), T, 0, 0.01, w=16, head=40)
    q = card(300, 110, None, fill=(255, 255, 255)); ImageDraw.Draw(q).text((150, 55), "tidak ada yang\ndatang...", font=M(24), fill=INK + (255,), anchor="mm", align="center")
    put(L, q, 540, 800, rot=-3); ln(L, (470, 850), (400, 930), INK, 4)

def n12(L):   # vertical timeline, compact cards left, customer big right
    big(L, [[("TEPAT", INK), ("SAAT", INK)], [("KEBUTUHAN", RED), ("MUNCUL.", INK)]], SL, 338, 112)
    paste(L, CUST2_X, 800, 1540 - CUST2_X.height / 2)
    ln(L, (150, 800), (150, 1470), INK, 10)
    items = ((830, "AMBIL ROTI", INK, P_ROTI), (1130, "KEBUTUHAN MUNCUL", RED, None), (1430, "TAWARKAN KEJU", BLUE, P_KEJU))
    for k, (y, tag, col, ic) in enumerate(items):
        node(L, 150, y, col)
        c = card(480, 220, tag, hc=col)
        if ic is not None: c.alpha_composite(small_cut(ic, 130), (300, 66))
        else: ImageDraw.Draw(c).ellipse((330, 86, 430, 186), fill=RED + (255,))
        ImageDraw.Draw(c).text((22, 110), ("customer\npilih roti", "butuh\npendamping", "SPG sodorkan\nkeju")[k], font=M(24, False), fill=INK + (255,))
        put(L, c, 410, y, rot=(1.5, -1.5, 1.5)[k])
    dotp(L, 150, 1130, 26)

def n15(L):   # SPG large on the left, compact proposal card on the right (no overlap on her sash)
    big(L, [[("MEMPERLUAS", INK)], [("PENETRASI", BLUE)], [("PASAR.", INK)]], SL, 338, 112)
    sp = fade_bottom(X("spg3", "SPG-3 setengah badan.png", 690, True), 100)
    paste(L, sp, 100 + sp.width / 2, 1540 - sp.height / 2 + 4)
    c = card(380, 470, "PENETRASI PASAR"); d = ImageDraw.Draw(c)
    d.text((22, 84), "PROCHIZ", font=M(26), fill=INK + (255,)); d.rounded_rectangle((22, 130, 358, 210), 12, fill=(240, 238, 230, 255), outline=INK + (255,), width=4); d.rounded_rectangle((26, 134, 26 + int(328 * 0.82), 206), 9, fill=RED + (255,))
    d.text((22, 250), "tersebar di\nlebih banyak\nrak", font=M(24, False), fill=INK + (255,)); d.text((22, 392), "TERUS NAIK", font=M(32), fill=RED + (255,))
    put(L, c, 760, 1140, rot=2)

FIX = [(3, n03), (5, n05), (7, n07), (11, n11), (12, n12), (15, n15)]

if __name__ == "__main__":
    bad = 0
    for num, fn in FIX:
        base, L = frame_of(fn); base.save(R + f"prochiz_test/frame_{num:02d}.png")
        bb = L.getchannel("A").point(lambda v: 255 if v > 125 else 0).getbbox()
        if bb and (bb[0] < SL - 6 or bb[2] > SR + 6 or bb[1] < ST - 6 or bb[3] > SB + 6): bad += 1; print("OUT", num, bb)
    print("violations:", bad)
    ims = [Image.open(R + f"prochiz_test/frame_{n:02d}.png").resize((432, 768)) for n, _ in FIX]
    sh = Image.new("RGB", (432 * 6 + 14 * 7, 768 + 28), (28, 28, 32))
    for i, im in enumerate(ims): sh.paste(im, (14 + i * 446, 14))
    sh.save(R + "prochiz_test/fix_sheet.png")
