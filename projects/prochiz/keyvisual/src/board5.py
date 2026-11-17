"""v7 storyboard: colour script (dark pressure -> cream solution -> red result), open-question devices, new photo assets."""
import sys, os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import numpy as np
from PIL import Image, ImageDraw, ImageFilter, ImageFont
import board as B
import board2 as B2
import board3 as B3
import board4 as B4
from board import *
from board3 import SPG1_L, SPG3_L, wfit, logo, LOGO_P, GOLD_P, shape_shadow
from board2 import SPG2_X, CUST1_X, CUST2_X, CUST3_X, X
from full2 import CROWD2, cross_bg
from board4 import name_tag

DARK = (37, 38, 39); CREAM = (255, 250, 231); REDB = (166, 47, 47)
LRED = (226, 84, 70); LBLU = (130, 148, 255)
NEW = A + "new/"
WALL = Image.open(NEW + "dinding_keju.png").convert("RGB")
POV = Image.open(NEW + "pov_roti.png").convert("RGB")
GOLDC = Image.open(NEW + "pov_gold_cheddar.png").convert("RGB")
AISLE = Image.open(A + "aisle/aisle_roti.png").convert("RGB")
CUST4_X = X("cust4", "CUST-4 kagettertarik.png", 780)
BGC = BG; BGR = cross_bg(REDB, (255, 255, 255, 40)); BGD = BGR   # only two backgrounds: brand red + cream

def cover(img, w, h, cx=0.5, cy=0.5):
    s = max(w / img.width, h / img.height); im = img.resize((int(img.width * s) + 1, int(img.height * s) + 1), Image.LANCZOS)
    x0 = int(min(max(cx * im.width - w / 2, 0), im.width - w)); y0 = int(min(max(cy * im.height - h / 2, 0), im.height - h))
    return im.crop((x0, y0, x0 + w, y0 + h))

def tint(im, mul=1.0, gray=0.0):
    a = np.asarray(im).astype(np.float32)
    if gray: a = a * (1 - gray) + a.mean(2, keepdims=True) * gray
    return Image.fromarray(np.clip(a * mul, 0, 255).astype(np.uint8))

def fullbleed(img, cx=0.5, cy=0.5, mul=1.0, gray=0.0, top=0.0, bot=0.0):
    im = tint(cover(img, W, H, cx, cy), mul, gray)
    if top or bot:
        a = np.asarray(im).astype(np.float32); y = np.linspace(0, 1, H)[:, None, None]
        k = 1 - top * np.clip(1 - y / 0.45, 0, 1) - bot * np.clip((y - 0.62) / 0.38, 0, 1); a *= np.clip(k, 0, 1); im = Image.fromarray(a.astype(np.uint8))
    return im.convert("RGBA")

def photo_card(img, w, border=14, rot_shadow=True):
    im = img.resize((w, int(img.height * w / img.width)), Image.LANCZOS).convert("RGBA")
    c = Image.new("RGBA", (im.width + 2 * border, im.height + 2 * border), PAPER + (255,)); c.alpha_composite(im, (border, border)); return c

def ring(im, cx, cy, r, col=LRED, w=8):
    ImageDraw.Draw(im).ellipse((cx - r, cy - r, cx + r, cy + r), outline=col + (255,), width=w)

def redwash(img, cx=0.5, cy=0.5):
    im = cover(img, W, H, cx, cy); g = np.asarray(im.convert("L")).astype(np.float32) / 255
    col = np.array(REDB, np.float32) * 0.55 + (np.array((255, 235, 215), np.float32) - np.array(REDB, np.float32) * 0.55) * (g[..., None] ** 1.3) * 0.55
    return Image.fromarray(np.clip(col, 0, 255).astype(np.uint8)).convert("RGBA")

def sticker(text, size, fg=INK, bg=PAPER, pad=(0.5, 0.28)):
    return mk_label(text, size, fg, bg, pad=pad, radius=0.12)

def circle(L, cx, cy, r, col): ImageDraw.Draw(L).ellipse((cx - r, cy - r, cx + r, cy + r), fill=col + (255,))

# ------------------------------------------------------------------ ACT 1: pressure (dark)
def s01(base, L):
    head_chip(L, "STRATEGI GERILYA  /  PROCHIZ", T, bg=DARK)
    big(L, [[("KOMPETITOR", PAPER)], [("MENGUASAI", PAPER)], [("RAK", PAPER), ("KEJU.", GOLD)]], SL, 338, 126)
    crop = WALL.crop((294, 112, 1366, 912)); sc = 800 / 1072
    card_im = crop.resize((800, int(800 * sc)), Image.LANCZOS).convert("RGBA")
    ring(card_im, int(536 * sc), int(400 * sc), 62, GOLD, 8)
    d = ImageDraw.Draw(card_im); d.text((int(536 * sc), int(400 * sc)), "?", font=F("Anton.ttf", 76), fill=GOLD + (255,), anchor="mm")
    c = Image.new("RGBA", (card_im.width + 28, card_im.height + 28), PAPER + (255,)); c.alpha_composite(card_im, (14, 14))
    put(L, c, CX, 1090, rot=-2)
    put(L, mk_stamp("DIKUASAI KOMPETITOR", DARK, 68), CX, 1330, rot=-7, shadow=False)

def s02(base, L):
    head_chip(L, "SERANGAN BALIK", T, bg=DARK)
    big(L, [[("PROCHIZ", GOLD)], [("MENYERANG", PAPER), ("DARI", PAPER)], [("RAK", PAPER), ("ROTI", PAPER), ("TAWAR!", PAPER)]], SL, 338, 120)
    top = 1540 - SPG1_L.height
    paste(L, SPG1_L, 640, 1540 - SPG1_L.height / 2)
    ln(L, (640, 735), (640, top + 4), GOLD, 5); dotp(L, 640, top + 4, 14, GOLD)
    put(L, name_tag(262), 822, 1000, rot=-3)
    put(L, sticker("KENAPA RAK ROTI?", 54, INK, PAPER), 335, 1130, rot=-4)
    put(L, CARD_ROTI, 330, 1390, scale=0.55, rot=3)

def s03(base, L):
    big(L, [[("WAKTU", PAPER), ("MASUK", PAPER), ("KE", PAPER)], [("SUPERMARKET", GOLD)]], SL, 330, 124)
    put(L, sticker("PROCHIZ BERDIRI DI MANA?", 40, INK, PAPER), CX, 700, rot=-1.5)
    d = ImageDraw.Draw(L); x0, y0, x1, y1 = 110, 820, 950, 1430
    d.rectangle((x0, y0, x1, y1), outline=PAPER + (255,), width=6)
    for i in range(5): d.rectangle((x0 + 70 + i * 150, y0 + 60, x0 + 130 + i * 150, y0 + 400), outline=PAPER + (170,), width=4)
    pts = (("A", "RAK KEJU", x0 + 70 + 150 * 1 + 30, y0 + 30, GOLD), ("B", "RAK ROTI", x0 + 70 + 150 * 3 + 30, y0 + 30, GOLD), ("C", "KASIR", x1 - 150, y1 - 80, (200, 196, 180)))
    for k, nm, px, py, col in pts:
        d.ellipse((px - 30, py - 30, px + 30, py + 30), fill=col + (255,)); d.text((px, py + 2), k, font=F("Anton.ttf", 36), fill=DARK + (255,), anchor="mm")
        c = mk_chip(nm, 28, bg=DARK); paste(L, c, px, py + 78)
    dotp(L, x0 + 70 + 150 * 3 + 30, y0 + 200, 26, GOLD)
    d.line((CX, y1 + 60, x0 + 70 + 150 * 3 + 30, y0 + 250), fill=GOLD + (255,), width=6)
    c = mk_chip("PINTU MASUK", 28, bg=DARK); paste(L, c, CX, y1 + 60)

def s04(base, L):
    big(L, [[("TIDAK", PAPER), ("BISA", PAPER), ("SEKADAR", PAPER)], [("MENGANDALKAN", PAPER), ("RAK", PAPER), ("KEJU", GOLD)]], SL, 330, 96)
    crop = WALL.crop((360, 0, 1301, 941)); sc = 800 / 941
    im = crop.resize((800, 800), Image.LANCZOS).convert("RGBA")
    sx, sy = int(470 * sc), int(512 * sc)
    lg = wfit(LOGO_P, 170); box = Image.new("RGBA", (200, 150), (255, 250, 231, 255)); box.alpha_composite(lg, (15, 14))
    im.alpha_composite(box, (sx - 100, sy - 75))
    c = Image.new("RGBA", (828, 828), PAPER + (255,)); c.alpha_composite(im, (14, 14))
    put(L, c, CX - 8, 1030, rot=1.5)
    put(L, mk_chip("SATU DI ANTARA BANYAK", 30, bg=DARK), CX, 1470, rot=0)
    put(L, mk_chip("ILUSTRASI", 24, fg=DARK, bg=(215, 210, 192)), SR - 90, 640)

def s05(base, L):
    base.alpha_composite(redwash(WALL))
    big(L, [[("LEBIH", PAPER), ("DULU", PAPER)], [("DIKENAL", GOLD)]], SL, 300, 150)
    paste(L, CUST1_X, 320, 1540 - CUST1_X.height / 2)
    q = card(420, 150, None, fill=(255, 255, 255)); ImageDraw.Draw(q).text((210, 75), "mana yang\nProchiz ya?", font=M(32), fill=INK + (255,), anchor="mm", align="center")
    put(L, q, 720, 760, rot=3)
    put(L, STAMP_C if False else mk_chip("BRAND LAWAN", 30, bg=DARK), 760, 1200)
    c = Image.new("RGBA", (240, 130), CREAM + (255,)); c.alpha_composite(wfit(LOGO_P, 130), (55, 10))
    put(L, c, 800, 1360, rot=3)

def s06(base, L):
    head_chip(L, "RAK KEJU", T, bg=DARK)
    big(L, [[("BEREBUT", PAPER), ("PERHATIAN", PAPER)], [("DI", PAPER), ("RAK", PAPER), ("KEJU", GOLD)]], SL, 338, 112)
    put(L, photo_card(WALL.crop((294, 112, 1366, 912)), 500), 365, 880, rot=-5)
    paste(L, CROWD2, 520, 1540 - CROWD2.height / 2 + 4)
    put(L, mk_stamp("REBUT PERHATIAN", DARK, 66), 330, 1250, rot=-7, shadow=False)

# ------------------------------------------------------------------ ACT 2: solution (cream / photo)
def s07(base, L): B3.m07(L)

def s08(base, L):
    base.alpha_composite(fullbleed(AISLE, 0.45, 0.5, 0.78, 0.0, 0.62, 0.45))
    head_chip(L, "LORONG ROTI TAWAR", T, bg=REDB)
    big(L, [[("SPG", LRED), ("DI", PAPER), ("LORONG", PAPER)], [("ROTI", PAPER), ("TAWAR", PAPER)]], SL, 338, 128)
    paste(L, SPG1_L, 700, 1540 - SPG1_L.height / 2)
    dotp(L, 300, 1180, 28, LRED)
    put(L, mk_chip("TEMPAT CUSTOMER CARI ROTI", 28, bg=REDB), 400, 1480)

def s09(base, L):
    base.alpha_composite(fullbleed(POV, 0.47, 0.5, 0.92, 0.0, 0.55, 0.55))
    put(L, sticker("POV", 74, PAPER, REDB), SL + 100, ST + 70, rot=-3)
    big(L, [[("KAMU", PAPER), ("LAGI", PAPER)], [("CARI", PAPER), ("ROTI", PAPER)]], SL, 420, 132)
    put(L, sticker("TERUS ENAKNYA DIAPAIN?", 54, INK, PAPER), CX, 1330, rot=-2)

def s10(base, L):
    head_chip(L, "JAWABANNYA", T, bg=REDB)
    big(L, [[("KEJU", REDB)], [("PENDAMPING", INK), ("ROTI", INK)]], SL, 338, 118)
    put(L, photo_card(GOLDC, 830), CX, 960, rot=-1.5)
    put(L, mk_stamp("JAWABANNYA", REDB, 76), 350, 700, rot=-8, shadow=False)
    put(L, mk_chip("PROCHIZ GOLD CHEDDAR", 30, bg=REDB), CX, 1310)
    big(L, [[("ROTI", INK), ("+", REDB), ("KEJU", INK), ("=", INK), ("COCOK", REDB)]], SL, 1380, 100)

def s11(base, L):
    big(L, [[("KALAU", INK), ("KAMU", INK), ("OWNER:", REDB)], [("TUNGGU", INK), ("ATAU", INK), ("PINDAH?", REDB)]], SL, 330, 110)
    pw, ph, y0 = 412, 770, 680
    panels = ((SL + 12, WALL, 0.5, 0.66, CUST3_X, "TUNGGU DI RAK KEJU", DARK, 640), (SR - pw - 12, AISLE, 0.45, 1.0, SPG2_X, "PINDAH KE LORONG ROTI", REDB, 700))
    for k, (x, img, mul, g, who, tag, tagcol, fh) in enumerate(panels):
        pimg = tint(cover(img, pw, ph, 0.5 if k else 0.55, 0.5), mul if k else 0.55, 0.65 if k == 0 else 0.0).convert("RGBA")
        fig = who.resize((int(who.width * fh / who.height), fh), Image.LANCZOS); pimg.alpha_composite(fig, ((pw - fig.width) // 2, ph - fh))
        d = ImageDraw.Draw(pimg); d.rectangle((0, 0, pw - 1, ph - 1), outline=(DARK if k == 0 else REDB) + (255,), width=8)
        if k == 0:
            d.line((90, 160, pw - 90, 420), fill=LRED + (255,), width=14); d.line((pw - 90, 160, 90, 420), fill=LRED + (255,), width=14)
        put(L, pimg, x + pw / 2, y0 + ph / 2, rot=(-1, 1)[k])
        c = mk_chip(tag, 26, bg=tagcol); paste(L, c, x + pw / 2, y0 + ph + 42)
    put(L, sticker("VS", 56, PAPER, DARK), CX, y0 + ph / 2, rot=0)

def s12(base, L): B3.m12(L)

# ------------------------------------------------------------------ ACT 3: result (red)
def s13(base, L):
    big(L, [[("STRATEGI", PAPER)]], SL, 340, 150); ln(L, (SL, 520), (SR, 520), PAPER, 6)
    big(L, [[("GERILYA", GOLD)]], SL, 560, 150)
    circle(L, 620, 1170, 330, CREAM)
    logo(L, 235, 960, 300, rot=-4)
    paste(L, SPG3_L, 620, 1540 - SPG3_L.height / 2 + 6)
    put(L, name_tag(280), 250, 1330, rot=-2)

def s14(base, L):
    big(L, [[("MEREBUT", PAPER)], [("PERHATIAN", GOLD)], [("CUSTOMER", PAPER)]], SL, 338, 120)
    c = card(520, 420, "MOMEN CUSTOMER"); d = ImageDraw.Draw(c)
    for i, (tx, col) in enumerate((("CARI ROTI", DARK), ("BUTUH PENDAMPING", (110, 106, 96)), ("TERTARIK KEJU", REDB))):
        d.rectangle((26, 90 + i * 100, 494, 160 + i * 100), fill=col + (255,)); d.text((260, 125 + i * 100), tx, font=M(26), fill=(255, 255, 255, 255), anchor="mm")
    put(L, c, 345, 1010, rot=-2)
    paste(L, small_cut(CUST4_X, 800), 740, 1540 - 400)

def s15(base, L):
    big(L, [[("MEMPERLUAS", PAPER)], [("PENETRASI", GOLD)], [("PASAR.", PAPER)]], SL, 338, 112)
    circle(L, 330, 1190, 250, CREAM)
    sp = fade_bottom(X("spg3", "SPG-3 setengah badan.png", 690, True), 100); paste(L, sp, 100 + sp.width / 2, 1540 - sp.height / 2 + 4)
    c = card(380, 520, None); c.alpha_composite(wfit(LOGO_P, 250), (65, 24)); d = ImageDraw.Draw(c)
    d.text((22, 200), "PENETRASI PASAR", font=M(24), fill=INK + (255,)); d.rounded_rectangle((22, 240, 358, 316), 12, fill=(240, 236, 220, 255), outline=INK + (255,), width=4); d.rounded_rectangle((26, 244, 26 + int(328 * 0.82), 312), 9, fill=REDB + (255,))
    d.text((22, 350), "tersebar di\nlebih banyak\nrak", font=M(24, False), fill=INK + (255,)); d.text((22, 458), "TERUS NAIK", font=M(32), fill=REDB + (255,))
    put(L, c, 760, 1130, rot=2); put(L, name_tag(290), 262, 1470, rot=-2)

SC = {1: (s01, "red"), 2: (s02, "red"), 3: (s03, "red"), 4: (s04, "red"), 5: (s05, "red"), 6: (s06, "red"), 7: (s07, "cream"), 8: (s08, "cream"),
      9: (s09, "cream"), 10: (s10, "cream"), 11: (s11, "cream"), 12: (s12, "cream"), 13: (s13, "red"), 14: (s14, "red"), 15: (s15, "red")}
BGMAP = {"red": BGD, "cream": BGC, "red": BGR}

def render(num):
    fn, bgk = SC[num]; base = BGMAP[bgk].copy(); L = Image.new("RGBA", (W, H), (0, 0, 0, 0)); fn(base, L)
    out = base.copy(); out.alpha_composite(L); return out.convert("RGB"), L

def pivot_mid():
    cream, _ = render(7); dark = BGD.convert("RGB").copy()
    m = Image.new("L", (W, H), 0); ImageDraw.Draw(m).ellipse((540 - 560, 1010 - 560, 540 + 560, 1010 + 560), fill=255); m = m.filter(ImageFilter.GaussianBlur(2))
    dark.paste(cream, (0, 0), m); d = ImageDraw.Draw(dark); d.ellipse((540 - 14, 1010 - 14, 540 + 14, 1010 + 14), fill=LRED); return dark

ACT = {1: "TEKANAN", 7: "PIVOT", 8: "PENDEKATAN", 13: "HASIL"}
if __name__ == "__main__":
    os.makedirs(R + "prochiz_test", exist_ok=True); bad = 0
    for n in SC:
        im, L = render(n); im.save(R + f"prochiz_test/s7_{n:02d}.png")
        bb = L.getchannel("A").point(lambda v: 255 if v > 125 else 0).getbbox()
        if bb and (bb[0] < SL - 6 or bb[2] > SR + 6 or bb[1] < ST - 6 or bb[3] > SB + 6): bad += 1; print("OUT", n, bb)
    pivot_mid().save(R + "prochiz_test/s7_07_pivot.png"); print("violations:", bad)
    PW, PH = 432, 768; gap = 20; cols = 5
    sheet = Image.new("RGB", (cols * (PW + gap) + gap, 3 * (PH + 96) + gap), (28, 28, 32)); d = ImageDraw.Draw(sheet)
    hf = ImageFont.truetype("/usr/share/fonts/opentype/inter/Inter-Bold.otf", 22); nf = ImageFont.truetype("/usr/share/fonts/opentype/inter/Inter-Medium.otf", 17)
    for i, (tm, vo, _) in enumerate(B.SCN):
        n = i + 1; im = Image.open(R + f"prochiz_test/s7_{n:02d}.png").resize((PW, PH), Image.LANCZOS)
        x = gap + (i % cols) * (PW + gap); y = gap + (i // cols) * (PH + 96)
        d.text((x, y + 2), f"{n:02d}", font=hf, fill=(255, 210, 90)); d.text((x + 46, y + 2), f"{tm.replace(':', '.')}s", font=hf, fill=(200, 200, 200)); sheet.paste(im, (x, y + 34))
        d.rectangle((x + int(SL * PW / W), y + 34 + int(ST * PH / H), x + int(SR * PW / W), y + 34 + int(SB * PH / H)), outline=(0, 150, 255), width=1)
        line = ""; ly = y + 34 + PH + 6
        for w_ in vo.split():
            if nf.getlength(line + " " + w_) > PW: d.text((x, ly), line, font=nf, fill=(235, 235, 235)); ly += 22; line = w_
            else: line = (line + " " + w_).strip()
        d.text((x, ly), line, font=nf, fill=(235, 235, 235))
    sheet.save(R + "prochiz_test/storyboard_v7.png"); print(sheet.size)
