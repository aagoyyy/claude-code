"""Brand pass: real Prochiz logo + real product packs, brand palette. Frames for the scenes that carry the brand."""
import sys, os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import numpy as np
from PIL import Image, ImageDraw, ImageFont
import board as B
import board2 as B2
from board import *
from board2 import SPG2_X, CUST1_X, CUST2_X, CUST3_X, SPG3_X, X
from full2 import SPG1_L, SPG3_L, CUST2_L, CROWD2

BR = A + "brand/"
LOGO_P = Image.open(BR + "logo.png").convert("RGBA")
GOLD_P = Image.open(BR + "gold_slices.png").convert("RGBA")
BOX_P = Image.open(BR + "premium_cheddar.png").convert("RGBA")

def wfit(im, w): return im.resize((w, int(im.height * w / im.width)), Image.LANCZOS)

from PIL import ImageFilter
def shape_shadow(im, blur=14, dy=12, alpha=95, pad=40):
    """Drop shadow that follows the artwork's own silhouette (alpha), not a rectangle."""
    out = Image.new("RGBA", (im.width + 2 * pad, im.height + 2 * pad), (0, 0, 0, 0))
    m = Image.new("L", out.size, 0); m.paste(im.getchannel("A").point(lambda v: int(v * alpha / 255)), (pad, pad + dy))
    out.putalpha(m.filter(ImageFilter.GaussianBlur(blur))); out.alpha_composite(im, (pad, pad)); return out

def logo(L, cx, cy, w, rot=0.0, shadow=True):
    im = wfit(LOGO_P, w)
    paste(L, shape_shadow(im) if shadow else im, cx, cy, rot=rot)

def m02(L):   # text PROCHIZ headline; red target dot ABOVE the head (not on the face)
    head_chip(L, "SERANGAN BALIK", T, bg=RED)
    big(L, [[("PROCHIZ", RED)], [("MENYERANG", INK), ("DARI", INK)], [("RAK", INK), ("ROTI", INK), ("TAWAR!", INK)]], SL, 338, 120)
    top = 1540 - SPG1_L.height
    paste(L, SPG1_L, 600, 1540 - SPG1_L.height / 2)
    ln(L, (600, 735), (600, top + 4), RED, 5); dotp(L, 600, top + 4, 14)
    put(L, CARD_ROTI, 330, 1250, scale=0.8, rot=3)

def m03(L):   # logo tag points at the entrance
    c = mk_chip("WAKTU MASUK KE", 28); paste(L, c, SL + c.width / 2, ST + c.height / 2)
    big(L, [[("SUPERMARKET", RED)]], SL, 330, 140)
    plan = card(500, 440, "DENAH TOKO"); d = ImageDraw.Draw(plan)
    for i in range(4):
        col = BLUE if i == 1 else (RED if i == 2 else (205, 199, 182)); d.rounded_rectangle((50 + i * 106, 96, 106 + i * 106, 330), 8, fill=col + (255,), outline=INK + (255,), width=4)
    d.line((250, 420, 250, 350), fill=RED + (255,), width=10); d.polygon([(228, 362), (272, 362), (250, 326)], fill=RED + (255,))
    d.text((100, 345), "KEJU", font=M(20), fill=BLUE + (255,)); d.text((300, 345), "ROTI", font=M(20), fill=RED + (255,))
    put(L, plan, 335, 950, rot=-2)
    logo(L, 330, 1250, 260, rot=2)
    ln(L, (330, 1180), (330, 1110), RED, 5)
    put(L, duotone_card(A + "aisle/aisle_roti.png", 300, (60, 12, 8), (252, 228, 214)), 300, 1420, rot=-3, shadow=True) if False else None
    paste(L, SPG2_X, 790, 1540 - SPG2_X.height / 2)

def m07(L):   # BEDA + real pack on the bread-aisle card
    c = mk_chip("PENDEKATAN BERBEDA", 28, bg=RED); paste(L, c, SL + c.width / 2, ST + c.height / 2)
    big(L, [[("BEDA.", RED)]], SL, 330, 300)
    paste(L, SPG2_X, 780, 1540 - SPG2_X.height / 2)
    a = card(360, 190, "RAK KEJU", fill=(232, 230, 222)); ImageDraw.Draw(a).line((40, 90, 320, 170), fill=BLUE + (255,), width=10); ImageDraw.Draw(a).line((40, 170, 320, 90), fill=BLUE + (255,), width=10)
    put(L, a, 280, 920, rot=-3)
    b = card(420, 250, "RAK ROTI TAWAR", hc=RED); ImageDraw.Draw(b).text((26, 110), "ada Prochiz\ndi sini", font=M(30), fill=INK + (255,))
    put(L, b, 300, 1220, rot=2)
    paste(L, shape_shadow(wfit(GOLD_P, 270)), 430, 1290, rot=-6)
    arrow(L, (280, 1020), (300, 1090), T, 0, 0.01, w=10, head=26)

def m10(L):   # ROTI + real Prochiz range
    big(L, [[("KEJU", RED)], [("PENDAMPING", INK), ("ROTI", INK)]], SL, 338, 120)
    c = card(320, 420, None); c.alpha_composite(small_cut(P_ROTI, 250), (35, 80)); put(L, c, 270, 1010, rot=-3)
    chip = mk_chip("ROTI", 30, bg=INK); paste(L, chip, 270, 1260)
    c2 = card(410, 520, None); c2.alpha_composite(wfit(GOLD_P, 340), (35, 30)); c2.alpha_composite(wfit(BOX_P, 340), (35, 290)); put(L, c2, 735, 1010, rot=3)
    chip2 = mk_chip("PROCHIZ", 30, bg=RED); paste(L, chip2, 735, 1320)
    txt(L, "+", 505, 1010, 140, RED, "mm")
    big(L, [[("ROTI", INK), ("+", RED), ("KEJU", INK), ("=", INK), ("COCOK", RED)]], SL, 1420, 104)

def m12(L):   # timeline with the real pack on step 3
    big(L, [[("TEPAT", INK), ("SAAT", INK)], [("KEBUTUHAN", RED), ("MUNCUL.", INK)]], SL, 338, 112)
    paste(L, CUST2_X, 800, 1540 - CUST2_X.height / 2)
    ln(L, (150, 800), (150, 1470), INK, 10)
    items = ((830, "AMBIL ROTI", INK, "roti"), (1130, "KEBUTUHAN MUNCUL", RED, None), (1430, "TAWARKAN KEJU", RED, "pack"))
    for k, (y, tag, col, ic) in enumerate(items):
        node(L, 150, y, col)
        c = card(480, 220, tag, hc=col)
        if ic == "roti": c.alpha_composite(small_cut(P_ROTI, 130), (300, 66))
        elif ic == "pack": c.alpha_composite(wfit(GOLD_P, 190), (270, 78))
        else: ImageDraw.Draw(c).ellipse((330, 86, 430, 186), fill=RED + (255,))
        ImageDraw.Draw(c).text((22, 110), ("customer\npilih roti", "butuh\npendamping", "Prochiz\nGold Slices")[k], font=M(24, False), fill=INK + (255,))
        put(L, c, 410, y, rot=(1.5, -1.5, 1.5)[k])
    dotp(L, 150, 1130, 26)

def m13(L):   # two giant words + the logo as the signature
    big(L, [[("STRATEGI", INK)]], SL, 340, 150); ln(L, (SL, 520), (SR, 520), INK, 6)
    big(L, [[("GERILYA", RED)]], SL, 560, 150)
    logo(L, 235, 930, 310, rot=-4)
    paste(L, SPG3_L, 620, 1540 - SPG3_L.height / 2 + 6)

def m15(L):   # closing: SPG + proposal card topped by the logo
    big(L, [[("MEMPERLUAS", INK)], [("PENETRASI", BLUE)], [("PASAR.", INK)]], SL, 338, 112)
    sp = fade_bottom(X("spg3", "SPG-3 setengah badan.png", 690, True), 100)
    paste(L, sp, 100 + sp.width / 2, 1540 - sp.height / 2 + 4)
    c = card(380, 520, None); c.alpha_composite(wfit(LOGO_P, 250), (65, 24)); d = ImageDraw.Draw(c)
    d.text((22, 200), "PENETRASI PASAR", font=M(24), fill=INK + (255,)); d.rounded_rectangle((22, 240, 358, 316), 12, fill=(240, 236, 220, 255), outline=INK + (255,), width=4); d.rounded_rectangle((26, 244, 26 + int(328 * 0.82), 312), 9, fill=RED + (255,))
    d.text((22, 350), "tersebar di\nlebih banyak\nrak", font=M(24, False), fill=INK + (255,)); d.text((22, 458), "TERUS NAIK", font=M(32), fill=RED + (255,))
    put(L, c, 760, 1130, rot=2)

BRAND = [(2, m02), (3, m03), (7, m07), (10, m10), (12, m12), (13, m13), (15, m15)]
ALL = {1: B.b01, 2: m02, 3: m03, 4: B.b04, 5: B2.n05, 6: B.b06, 7: m07, 8: B.b08, 9: B.b09, 10: m10, 11: B2.n11, 12: m12, 13: m13, 14: B.b14, 15: m15}

if __name__ == "__main__":
    bad = 0
    for num, fn in ALL.items():
        base, L = frame_of(fn); base.save(R + f"prochiz_test/brand_{num:02d}.png")
        bb = L.getchannel("A").point(lambda v: 255 if v > 125 else 0).getbbox()
        if bb and (bb[0] < SL - 6 or bb[2] > SR + 6 or bb[1] < ST - 6 or bb[3] > SB + 6): bad += 1; print("OUT", num, bb)
    print("violations:", bad)
    ims = [Image.open(R + f"prochiz_test/brand_{n:02d}.png").resize((324, 576)) for n in ALL]
    sh = Image.new("RGB", (5 * 338 + 14, 3 * 590 + 14), (28, 28, 32))
    for i, im in enumerate(ims): sh.paste(im, (14 + (i % 5) * 338, 14 + (i // 5) * 590))
    sh.save(R + "prochiz_test/brand_sheet.png")
