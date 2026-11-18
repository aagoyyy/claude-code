"""v9 layouts: the user's reference frame as the quality bar (bold wide titles, red brush underline, burst marks,
taped polaroid photos, glowing product highlight, big subject overlapping the photo, two-tone name tag, logo),
applied with a DIFFERENT composition per scene. All drawing goes through board6 helpers (B6.*) so anim8 can record it."""
import sys, os, math
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import numpy as np
from PIL import Image, ImageDraw, ImageFont, ImageFilter
import board6 as B6
from board6 import (W, H, SL, SR, ST, SB, CX, A, R, FONT, RED, INKK, WALL, POV, GOLDC, AISLE, LOGO_P, GOLD_P, CUST2_X, CUST3_X, CUST4_X, CROWD2,
                    wfit, cover, label, hairline_card, receipt, stamp, spg, agus, bar_card, P_ROTI)

AF = FONT + "ArchivoBlack.ttf"
def af(sz): return ImageFont.truetype(AF, int(sz))
B6.an = af                                   # titles in board6.ttl (and anim8's recorder) now use Archivo Black
B6.SW_ = 880
WHITE = (255, 255, 255); TAPE = (246, 206, 72); CRM = (255, 250, 231); BRED = (166, 47, 47)

def T(L, lines, y, size, x=90, lead=1.0): return B6.ttl(L, lines, y, size, x=x, lead=lead)
def P(L, im, cx, cy, rot=0.0, shadow=True): B6.place(L, im, cx, cy, rot=rot, shadow=shadow)
def AC(L, im, pos): B6.ac(L, im, pos)
def title_w(text, size):
    s = size
    while af(s).getlength(text) > B6.SW_ - 10 and s > 50: s -= 2
    return af(s).getlength(text), s

# ------------------------------------------------------------------ decorations
def brush(w, h=26, col=RED, seed=1):
    rng = np.random.RandomState(seed); im = Image.new("RGBA", (w + 20, h + 20), (0, 0, 0, 0)); d = ImageDraw.Draw(im)
    n = 70
    for i in range(n):
        t = i / (n - 1); x = 10 + t * w; y = 10 + h / 2 + math.sin(t * 3.2) * h * 0.18 - t * h * 0.15
        r = h * 0.5 * (0.35 + 0.65 * math.sin(math.pi * min(1, t * 1.15)) ** 0.6) * (0.9 + 0.2 * rng.rand())
        d.ellipse((x - r * 1.6, y - r, x + r * 1.6, y + r), fill=col + (255,))
    return im

def burst(size=90, col=RED, angles=(-70, -35, 0), width=12):
    im = Image.new("RGBA", (size * 2, size * 2), (0, 0, 0, 0)); d = ImageDraw.Draw(im); c = size
    for a in angles:
        r = math.radians(a); x0, y0 = c + math.cos(r) * size * 0.35, c + math.sin(r) * size * 0.35; x1, y1 = c + math.cos(r) * size * 0.95, c + math.sin(r) * size * 0.95
        d.line((x0, y0, x1, y1), fill=col + (255,), width=width); d.ellipse((x1 - width / 2, y1 - width / 2, x1 + width / 2, y1 + width / 2), fill=col + (255,))
    return im.crop(im.getchannel("A").getbbox())

def tape(w=130, h=44, ang=35):
    im = Image.new("RGBA", (w, h), (0, 0, 0, 0)); d = ImageDraw.Draw(im)
    pts = [(0, 4), (8, 0), (w - 8, 3), (w, 0), (w - 4, h / 2), (w, h), (w - 9, h - 3), (6, h), (0, h - 4), (5, h / 2)]
    d.polygon(pts, fill=TAPE + (215,)); return im.rotate(ang, resample=Image.BICUBIC, expand=True)

def photo(img, w, crop=None, deco=None, border=16, tapes=("tl", "br")):
    im = img.crop(crop) if crop else img; im = im.convert("RGBA").resize((w, int(im.height * w / im.width)), Image.LANCZOS)
    if deco: deco(im)
    m = 34; c = Image.new("RGBA", (im.width + 2 * border + 2 * m, im.height + 2 * border + 2 * m), (0, 0, 0, 0))
    ImageDraw.Draw(c).rectangle((m, m, m + im.width + 2 * border - 1, m + im.height + 2 * border - 1), fill=WHITE + (255,)); c.alpha_composite(im, (m + border, m + border))
    for k in tapes:
        t = tape(ang=(35 if k in ("tl", "br") else -35)); x = 0 if k[1] == "l" else c.width - t.width; y = 0 if k[0] == "t" else c.height - t.height
        c.alpha_composite(t, (x + (8 if k[1] == "l" else -8), y + (8 if k[0] == "t" else -8)))
    return c

def glow_at(im, cx, cy, r, rays=True):
    g = Image.new("RGBA", im.size, (0, 0, 0, 0)); m = Image.new("L", im.size, 0); ImageDraw.Draw(m).ellipse((cx - r, cy - r * 0.8, cx + r, cy + r * 0.8), fill=210)
    m = m.filter(ImageFilter.GaussianBlur(r * 0.35)); g.paste((255, 236, 150, 255), (0, 0), m); out = Image.alpha_composite(im, g); im.paste(out)
    if rays:
        b = burst(int(r * 0.55), col=WHITE, angles=(-125, -90, -55), width=7); im.alpha_composite(b, (int(cx - b.width / 2), int(cy - r * 0.95 - b.height * 0.6)))

def two_tone(name="AGUSTINA", role="CO-FOUNDER PROCHIZ"):
    f1, f2 = af(54), af(30)
    w1 = int(f1.getlength(name)) + 50; w2 = int(f2.getlength(role)) + 46
    a = Image.new("RGBA", (w1, 86), WHITE + (255,)); ImageDraw.Draw(a).text((25, 8), name, font=f1, fill=INKK + (255,))
    b = Image.new("RGBA", (w2, 58), RED + (255,)); ImageDraw.Draw(b).text((23, 6), role, font=f2, fill=WHITE + (255,))
    a = a.rotate(2.5, resample=Image.BICUBIC, expand=True); b = b.rotate(1.5, resample=Image.BICUBIC, expand=True)
    c = Image.new("RGBA", (max(a.width, b.width + 40), a.height + b.height - 10), (0, 0, 0, 0)); c.alpha_composite(a, (0, 0)); c.alpha_composite(b, (40, a.height - 12))
    return c

def tag(text, size=34, fg=WHITE, bg=INKK, rot=-3):
    f = af(size); im = Image.new("RGBA", (int(f.getlength(text)) + 40, size + 30), bg + (255,)); ImageDraw.Draw(im).text((20, 8), text, font=f, fill=fg + (255,))
    return im.rotate(rot, resample=Image.BICUBIC, expand=True)

def bubble(text, size=36, w=None):
    f = af(size); tw = int(f.getlength(text)); w = w or tw + 60; h = size + 50
    im = Image.new("RGBA", (w + 10, h + 40), (0, 0, 0, 0)); d = ImageDraw.Draw(im)
    d.rounded_rectangle((4, 4, w + 4, h + 4), 24, fill=WHITE + (255,), outline=INKK + (255,), width=5); d.polygon([(60, h + 2), (110, h + 2), (56, h + 36)], fill=WHITE + (255,), outline=INKK + (255,))
    d.line((62, h + 1, 108, h + 1), fill=WHITE + (255,), width=7); d.text((4 + w / 2, 4 + h / 2), text, font=f, fill=INKK + (255,), anchor="mm"); return im

def logo_top(L, w=250, x=SL + 10, y=ST + 4):
    AC(L, wfit(LOGO_P, w), (x, y))

def under(L, x, y, w, seed=1): AC(L, brush(int(w), seed=seed), (x - 10, y))

def ring_on(im, cx, cy, rx, ry, col=RED, w=9):
    d = ImageDraw.Draw(im)
    for k in range(2): d.ellipse((cx - rx - k * 6, cy - ry - k * 3, cx + rx + k * 4, cy + ry + k * 5), outline=col + (255,), width=w - k * 3)

# ------------------------------------------------------------------ scenes
def t01(L):          # photo-led: huge taped cheese wall, empty slot circled, stamp
    y = T(L, [[("KOMPETITOR", INKK)], [("MENGUASAI", INKK)], [("RAK", INKK), ("KEJU.", RED)]], 300, 108)
    w, s = title_w("RAK KEJU.", 108); under(L, 90, int(y) - 6, w, 2)
    def d(im):
        sx, sy = int(536 * 800 / 1072), int(400 * 800 / 1072); ring_on(im, sx, sy, 104, 84)
        ImageDraw.Draw(im).text((sx, sy), "?", font=af(90), fill=RED + (255,), anchor="mm")
    P(L, photo(WALL, 800, crop=(294, 112, 1366, 912), deco=d), CX, 1110, rot=-2.5)
    AC(L, stamp("DIKUASAI KOMPETITOR", 52, -7), (CX - 320, 1330))

def t02(L):          # the user's reference: logo, title, burst, underline, taped photo w/ glowing pack, big co-founder, two-tone tag
    logo_top(L, 230)
    y = T(L, [[("PROCHIZ", RED)], [("MENYERANG", INKK)], [("DARI RAK", INKK)], [("ROTI TAWAR!", INKK)]], 400, 92)
    wp, _ = title_w("PROCHIZ", 92); AC(L, burst(62), (int(90 + wp + 14), 372)); w, s = title_w("ROTI TAWAR!", 92); under(L, 90, int(y) - 2, w, 3)
    def d(im):
        pk = GOLD_P.copy(); pk = pk.resize((230, int(230 * pk.height / pk.width)), Image.LANCZOS)
        cx, cy = 836 - 380, 640 - 0                    # slot in crop coords (crop starts at x=380, y=0)
        glow_at(im, int(cx * im.width / 600 * 600 / 600), cy, 150)
    bw = Image.open(A + "new/bread_wall.png").convert("RGBA")
    pk = GOLD_P.copy(); pk = pk.resize((230, int(230 * pk.height / pk.width)), Image.LANCZOS)
    glow_at(bw, 836, 640, 170); bw.alpha_composite(pk, (836 - 115, 712 - pk.height))
    P(L, photo(bw, 440, crop=(456, 140, 1216, 941)), 318, 1170, rot=-3)
    sp = agus(3, 640); AC(L, sp, (SR - sp.width - 4, 1480 - sp.height))
    tt = two_tone(); AC(L, tt, (SR - tt.width, 1330))

def t03(L):          # entrance: tall taped photo left, SPG walking out of it on the right, brush arrow "MASUK"
    y = T(L, [[("WAKTU MASUK KE", INKK)], [("SUPERMARKET", RED)]], 300, 100)
    w, s = title_w("SUPERMARKET", 100); under(L, 90, int(y) - 4, w, 4)
    P(L, photo(Image.open(A + "new/entrance.png").convert("RGB"), 560, tapes=("tr", "bl")), 398, 1060, rot=-2)
    sp = spg("walk", 860); AC(L, sp, (SR - sp.width - 6, 1480 - sp.height))
    AC(L, tag("MASUK", 40, WHITE, RED, -4), (150, 1390))

def t04(L):          # one tall wall, Prochiz logo glowing in the slot, ribbon tag
    T(L, [[("TIDAK BISA SEKADAR", INKK)], [("MENGANDALKAN", INKK)], [("RAK", INKK), ("KEJU", RED)]], 300, 92)
    def d(im):
        sx, sy = int(470 * 820 / 941), int(512 * 820 / 941); glow_at(im, sx, sy, 150, rays=True)
        lg = wfit(LOGO_P, 190); box = Image.new("RGBA", (220, 150), CRM + (255,)); box.alpha_composite(lg, (15, 18)); im.alpha_composite(box, (sx - 110, sy - 75))
        ImageDraw.Draw(im).rectangle((sx - 114, sy - 79, sx + 114, sy + 79), outline=RED + (255,), width=7)
    P(L, photo(WALL, 760, crop=(360, 0, 1301, 941), deco=d, tapes=("tl", "tr")), CX, 1060, rot=1.5)
    AC(L, tag("SATU DI ANTARA BANYAK", 34, WHITE, RED, 3), (SL + 20, 1400))

def t05(L):          # red background, big centred statement
    lines = ["BRAND LAWAN", "JAUH LEBIH", "DULU", "DIKENAL"]; size = 150
    while max(af(size).getlength(t) for t in lines) > 860 and size > 70: size -= 2
    f = af(size); top, bot = f.getbbox("BRAND")[1], f.getbbox("BRAND")[3]; gh = bot - top; step = gh * 1.75; total = step * 3 + gh; y0 = 905 - total / 2
    for i, t in enumerate(lines):
        w_ = f.getlength(t); x = (W - w_) / 2; ycap = y0 + i * step
        if i == 3:
            box = Image.new("RGBA", (int(w_) + 68, int(gh) + 44), CRM + (255,)); ImageDraw.Draw(box).text((34, 22 - top), t, font=f, fill=BRED + (255,)); AC(L, box, (int(x - 34), int(ycap - 22)))
        else: T(L, [[(t, CRM)]], ycap - top, size, x=int(x))

def t06(L):          # crowd is the hero; small taped wall photo pinned top-left
    T(L, [[("BEREBUT", INKK)], [("PERHATIAN DI", INKK)], [("RAK", INKK), ("KEJU", RED)]], 300, 104)
    P(L, photo(WALL, 380, crop=(294, 112, 1366, 912), tapes=("tr",)), 740, 760, rot=6)
    AC(L, CROWD2, (int(518 - CROWD2.width / 2), 1480 - CROWD2.height + 4))
    AC(L, stamp("REBUT PERHATIAN", 50, -7), (120, 1170))

def t07(L):          # giant word + burst, two taped cards with a brush arrow, SPG half-body
    AC(L, tag("PENDEKATAN", 34, WHITE, INKK, -3), (90, 300))
    T(L, [[("BEDA.", RED)]], 360, 260, lead=1.0); AC(L, burst(90), (720, 330))
    sp = spg("tray_half", 760, fade=110); AC(L, sp, (SR - sp.width + 10, 1480 - sp.height))
    a = hairline_card(360, 180, border=(40, 40, 40), fill=(238, 235, 226)); da = ImageDraw.Draw(a); da.text((22, 14), "RAK KEJU", font=af(34), fill=INKK + (255,))
    da.line((40, 80, 320, 160), fill=RED + (255,), width=9); da.line((40, 160, 320, 80), fill=RED + (255,), width=9)
    P(L, photo(a, 360, border=0, tapes=("br",)), 270, 960, rot=-4)
    b = hairline_card(380, 220, border=RED); db = ImageDraw.Draw(b); db.text((22, 14), "LORONG ROTI", font=af(34), fill=RED + (255,)); pk = wfit(GOLD_P, 200); glow_at(b, 270, 140, 90, rays=False); b.alpha_composite(pk, (170, 74)); db.text((22, 90), "ada\nProchiz", font=af(32), fill=INKK + (255,))
    P(L, photo(b, 380, border=0, tapes=("tr",)), 290, 1250, rot=3)
    AC(L, brush(110, 20, seed=5).rotate(-70, expand=True), (230, 1050))

def t08(L):          # wide taped aisle photo across the top half, SPG waving in front, red pin
    T(L, [[("SPG DI LORONG", INKK)], [("ROTI", INKK), ("TAWAR", RED)]], 300, 100)
    P(L, photo(AISLE, 820, crop=(200, 0, 1472, 941), tapes=("tl", "tr")), CX - 10, 900, rot=-1.5)
    sp = spg("wave", 900, 0.80); AC(L, sp, (SR - sp.width - 10, 1480 - sp.height))
    B6.dot_only(L, 300, 900, 13)

def t09(L):          # POV: photo fills the middle, question bubble, POV tag
    AC(L, tag("POV", 46, WHITE, RED, -4), (90, 290))
    T(L, [[("KAMU LAGI", INKK)], [("CARI", INKK), ("ROTI", RED)]], 380, 112)
    P(L, photo(POV, 720, crop=(380, 0, 1300, 941)), CX - 20, 1110, rot=2)
    AC(L, bubble("TERUS ENAKNYA DIAPAIN?", 34), (300, 1300))

def t10(L):          # answer: big product photo taped, receipt, stamp
    AC(L, tag("JAWABANNYA:", 34, WHITE, INKK, -3), (90, 300))
    y = T(L, [[("KEJU", RED)], [("PENDAMPING ROTI", INKK)]], 370, 104)
    P(L, photo(GOLDC, 640, crop=(80, 120, 1456, 1000)), 420, 930, rot=-2.5)
    P(L, receipt(), 772, 1210, rot=5)
    AC(L, stamp("COCOK DIPASANGKAN", 46, -6), (100, 1270))

def t11(L):          # two taped panels, two-tone tags above, VS badge
    T(L, [[("KALAU KAMU OWNER:", INKK)], [("TUNGGU ATAU", INKK), ("PINDAH?", RED)]], 300, 84)
    pw, ph = 400, 720
    def panel(img, fig, fh, cross=False):
        base = cover(img, pw, ph, 0.5, 0.5).convert("RGBA"); f2 = fig.resize((int(fig.width * fh / fig.height), fh), Image.LANCZOS); base.alpha_composite(f2, ((pw - f2.width) // 2, ph - fh))
        if cross: d = ImageDraw.Draw(base); d.line((80, 150, 320, 380), fill=RED + (255,), width=12); d.line((320, 150, 80, 380), fill=RED + (255,), width=12)
        return base
    P(L, photo(panel(WALL, CUST3_X, 600, True), pw, tapes=("tl",)), SL + 20 + pw / 2, 1050, rot=-2)
    P(L, photo(panel(AISLE, spg("offer", 700), 640), pw, tapes=("tr",)), SR - 20 - pw / 2, 1050, rot=2)
    AC(L, tag("MENUNGGU", 30, WHITE, INKK, -3), (SL + 30, 600)); t = tag("MENDATANGI", 30, WHITE, RED, 3); AC(L, t, (SR - 30 - t.width, 600))
    v = Image.new("RGBA", (110, 110), (0, 0, 0, 0)); ImageDraw.Draw(v).ellipse((0, 0, 109, 109), fill=INKK + (255,)); ImageDraw.Draw(v).text((55, 55), "VS", font=af(40), fill=WHITE + (255,), anchor="mm"); AC(L, v, (CX - 55, 1000))

def t12(L):          # vertical timeline of taped cards, customer on the right
    T(L, [[("TEPAT SAAT", INKK)], [("KEBUTUHAN", RED)], [("MUNCUL.", INKK)]], 300, 100)
    B6.rule(L, (150, 760), (150, 1400), (40, 40, 40), 5)
    f = CUST2_X; AC(L, f.resize((int(f.width * 640 / f.height), 640), Image.LANCZOS), (SR - 320, 1480 - 640))
    items = ((820, "AMBIL ROTI", "roti", INKK), (1100, "BUTUH PENDAMPING", "ping", RED), (1380, "TAWARKAN KEJU", "pack", INKK))
    for k, (y, tx, ic, col) in enumerate(items):
        B6.dotnode(L, 150, y, col)
        c = Image.new("RGBA", (440, 170), WHITE + (255,)); d = ImageDraw.Draw(c); d.text((20, 18), tx, font=af(30), fill=col + (255,))
        if ic == "roti": c.alpha_composite(wfit(Image.fromarray(np.asarray(P_ROTI)), 120), (300, 50))
        elif ic == "pack": c.alpha_composite(wfit(GOLD_P, 180), (240, 62))
        else: d.ellipse((330, 66, 410, 146), fill=RED + (255,))
        P(L, photo(c, 440, border=0, tapes=(("tr",), ("br",), ("tr",))[k]), 420, y, rot=(1.5, -1.5, 1.5)[k])

def t13(L):          # summary: logo, big two-line title with underline + burst, co-founder big, two-tone tag
    logo_top(L, 220)
    y = T(L, [[("STRATEGI", INKK)], [("GERILYA", RED)]], 440, 150)
    w, s = title_w("GERILYA", 150); under(L, 90, int(y) - 4, w, 6); ws, _ = title_w("STRATEGI", 150); AC(L, burst(70), (int(90 + min(ws, 700) + 12), 400)) if ws < 760 else None
    sp = agus(3, 700); AC(L, sp, (SR - sp.width - 4, 1480 - sp.height))
    AC(L, two_tone(), (SL + 10, 1250))

def t14(L):          # scenes 14 + 15 merged: the guerrilla move in one picture (SPG intercepts a bread shopper with a cheese sample)
    T(L, [[("MEREBUT", INKK), ("PERHATIAN,", INKK)], [("MEMPERLUAS", INKK)], [("PENETRASI", RED), ("PASAR.", RED)]], 300, 92)
    pw, ph = 820, 660
    base = cover(AISLE, pw, ph, 0.45, 0.5).convert("RGBA")
    cu = CUST2_X.resize((int(CUST2_X.width * 560 / CUST2_X.height), 560), Image.LANCZOS); base.alpha_composite(cu, (40, ph - 560))
    so = spg("offer", 600); base.alpha_composite(so, (pw - so.width - 30, ph - 600))
    b = burst(46, col=WHITE, angles=(-150, -110, -70), width=7); base.alpha_composite(b, (pw - so.width - 30 + int(so.width * 0.06), ph - 600 + 10))
    P(L, photo(base, pw, tapes=("tl", "br")), CX, 1010, rot=-1.5)
    AC(L, tag("STRATEGI GERILYA PROCHIZ", 30, WHITE, RED, -3), (SL + 10, 650))
    c = Image.new("RGBA", (330, 150), WHITE + (255,)); d = ImageDraw.Draw(c); d.text((18, 14), "PENETRASI PASAR", font=af(22), fill=INKK + (255,))
    d.rectangle((18, 56, 312, 96), outline=INKK + (255,), width=3, fill=(240, 236, 226, 255)); d.rectangle((21, 59, 21 + int(288 * 0.82), 93), fill=RED + (255,))
    d.polygon([(286, 110), (306, 140), (266, 140)], fill=RED + (255,)); d.text((18, 112), "ILUSTRASI", font=af(14), fill=(120, 116, 104, 255))
    P(L, photo(c, 330, border=0, tapes=("bl",)), 768, 1400, rot=3)

SC = [(1, t01), (2, t02), (3, t03), (4, t04), (5, t05), (6, t06), (7, t07), (8, t08), (9, t09), (10, t10), (11, t11), (12, t12), (13, t13), (14, t14)]
SCENE_BG = {5: "red"}

if __name__ == "__main__":
    import bgopts as BO
    bgB, bgR = BO.flat(BO.BEIGE), BO.flat((166, 47, 47)); out = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "frames", "v9"); os.makedirs(out, exist_ok=True); bad = 0
    import board as BB
    for n, fn in SC:
        L = Image.new("RGBA", (W, H), (0, 0, 0, 0)); fn(L); im = (bgR if SCENE_BG.get(n) == "red" else bgB).copy(); im.alpha_composite(L); im.convert("RGB").save(os.path.join(out, f"scene_{n:02d}.png"))
        bb = L.getchannel("A").point(lambda v: 255 if v > 125 else 0).filter(ImageFilter.MinFilter(9)).getbbox()
        if bb and (bb[0] < SL - 6 or bb[2] > SR + 6 or bb[1] < ST - 6 or bb[3] > SB + 6): bad += 1; print("OUT", n, bb)
    print("violations:", bad)
    PW, PH = 432, 768; gap = 20; cols = 5
    sheet = Image.new("RGB", (cols * (PW + gap) + gap, 3 * (PH + 96) + gap), (28, 28, 32)); d = ImageDraw.Draw(sheet)
    hf = ImageFont.truetype("/usr/share/fonts/opentype/inter/Inter-Bold.otf", 22); nf = ImageFont.truetype("/usr/share/fonts/opentype/inter/Inter-Medium.otf", 17)
    SCN_ = list(BB.SCN[:13]) + [(BB.SCN[13][0], BB.SCN[13][1] + " " + BB.SCN[14][1], None)]
    for i, (tm, vo, _) in enumerate(SCN_):
        n = i + 1; im = Image.open(os.path.join(out, f"scene_{n:02d}.png")).resize((PW, PH), Image.LANCZOS)
        x = gap + (i % cols) * (PW + gap); y = gap + (i // cols) * (PH + 96)
        d.text((x, y + 2), f"{n:02d}", font=hf, fill=(255, 210, 90)); d.text((x + 46, y + 2), f"{tm.replace(':', '.')}s", font=hf, fill=(200, 200, 200)); sheet.paste(im, (x, y + 34))
        d.rectangle((x + int(SL * PW / W), y + 34 + int(ST * PH / H), x + int(SR * PW / W), y + 34 + int(SB * PH / H)), outline=(0, 150, 255), width=1)
        line = ""; ly = y + 34 + PH + 6
        for w_ in vo.split():
            if nf.getlength(line + " " + w_) > PW: d.text((x, ly), line, font=nf, fill=(235, 235, 235)); ly += 22; line = w_
            else: line = (line + " " + w_).strip()
        d.text((x, ly), line, font=nf, fill=(235, 235, 235))
    sheet.save(os.path.join(out, "storyboard_v9.png")); print(sheet.size)
