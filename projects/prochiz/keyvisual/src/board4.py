"""v6: 'Agustina / Co-Founder Prochiz' name tag (scenes 2, 13, 15)."""
import sys, os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import numpy as np
from PIL import Image, ImageDraw
import board as B
import board2 as B2
import board3 as B3
from board import *
from board3 import ALL as ALL3, SPG1_L, SPG3_L, wfit, logo, LOGO_P
from board2 import X

NAME, ROLE = "Agustina", "CO-FOUNDER PROCHIZ"

def name_tag(w=300):
    """Paper tag with a brand-red edge: big name, role underneath."""
    h = 112
    im = Image.new("RGBA", (w, h), PAPER + (255,)); d = ImageDraw.Draw(im)
    d.rectangle((0, 0, w - 1, h - 1), outline=INK + (255,), width=4); d.rectangle((0, 0, 14, h), fill=RED + (255,))
    d.text((34, 16), NAME, font=F("Anton.ttf", 52), fill=INK + (255,))
    d.text((34, 76), ROLE, font=M(18), fill=RED + (255,))
    return im

def m02(L):   # same layout as before + name tag on her first appearance
    head_chip(L, "SERANGAN BALIK", T, bg=RED)
    big(L, [[("PROCHIZ", RED)], [("MENYERANG", INK), ("DARI", INK)], [("RAK", INK), ("ROTI", INK), ("TAWAR!", INK)]], SL, 338, 120)
    top = 1540 - SPG1_L.height
    paste(L, SPG1_L, 600, 1540 - SPG1_L.height / 2)
    ln(L, (600, 735), (600, top + 4), RED, 5); dotp(L, 600, top + 4, 14)
    put(L, CARD_ROTI, 330, 1250, scale=0.8, rot=3)
    put(L, name_tag(262), 822, 1000, rot=-3)

def m13(L):
    big(L, [[("STRATEGI", INK)]], SL, 340, 150); ln(L, (SL, 520), (SR, 520), INK, 6)
    big(L, [[("GERILYA", RED)]], SL, 560, 150)
    logo(L, 235, 930, 310, rot=-4)
    paste(L, SPG3_L, 620, 1540 - SPG3_L.height / 2 + 6)
    put(L, name_tag(280), 240, 1150, rot=-2)

def m15(L):
    big(L, [[("MEMPERLUAS", INK)], [("PENETRASI", BLUE)], [("PASAR.", INK)]], SL, 338, 112)
    sp = fade_bottom(X("spg3", "SPG-3 setengah badan.png", 690, True), 100)
    paste(L, sp, 100 + sp.width / 2, 1540 - sp.height / 2 + 4)
    c = card(380, 520, None); c.alpha_composite(wfit(LOGO_P, 250), (65, 24)); d = ImageDraw.Draw(c)
    d.text((22, 200), "PENETRASI PASAR", font=M(24), fill=INK + (255,)); d.rounded_rectangle((22, 240, 358, 316), 12, fill=(240, 236, 220, 255), outline=INK + (255,), width=4); d.rounded_rectangle((26, 244, 26 + int(328 * 0.82), 312), 9, fill=RED + (255,))
    d.text((22, 350), "tersebar di\nlebih banyak\nrak", font=M(24, False), fill=INK + (255,)); d.text((22, 458), "TERUS NAIK", font=M(32), fill=RED + (255,))
    put(L, c, 760, 1130, rot=2)
    put(L, name_tag(290), 262, 1470, rot=-2)

ALL = dict(ALL3); ALL.update({2: m02, 13: m13, 15: m15})   # scene 1 stays the original layout (no audience call-out text)
CHANGED = (2, 13, 15)

if __name__ == "__main__":
    bad = 0
    for num, fn in ALL.items():
        base, L = frame_of(fn); base.save(R + f"prochiz_test/v6_{num:02d}.png")
        bb = L.getchannel("A").point(lambda v: 255 if v > 125 else 0).getbbox()
        if bb and (bb[0] < SL - 6 or bb[2] > SR + 6 or bb[1] < ST - 6 or bb[3] > SB + 6): bad += 1; print("OUT", num, bb)
    print("violations:", bad)
