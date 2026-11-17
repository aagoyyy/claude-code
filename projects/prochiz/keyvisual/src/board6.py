"""v8 storyboard (option A): ONE beige graph-paper world, red as the single accent, mono subjects with red clothing,
props built like real artefacts (planogram, shelf tags, receipt), micro labels, plumb-line motif. Nothing below y=1480."""
import sys, os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import numpy as np
from PIL import Image, ImageDraw, ImageFont, ImageFilter
import proto_ref_vibe as P
from proto_ref_vibe import bg, an, label, hairline_card, soft_shadow, mono_halftone, selective_red, plumb, BEIGE, RED, INKK
import board5 as b5
from board5 import WALL, POV, GOLDC, AISLE, cover, wfit, LOGO_P, GOLD_P, CUST1_X, CUST2_X, CUST3_X, CUST4_X, CROWD2, SPG2_X, A, R, SRC, FONT, W, H, SL, SR, ST, SB, CX
from render import cut_halftone
import board as B
from board import P_ROTI

PAPER_ = (250, 247, 240)
def mono_font(sz, bold=True): return ImageFont.truetype(FONT + ("SpaceMono-Bold.ttf" if bold else "SpaceMono.ttf"), sz)

# ---------------------------------------------------------------- helpers
def ttl(L, lines, y, size=124, x=90, lead=0.92):
    while max(sum(an(size).getlength(w + " ") for w, _ in ln) for ln in lines) > SW_ - 10 and size > 60: size -= 2
    f = an(size); cy = y; d = ImageDraw.Draw(L)
    for ln in lines:
        cx = x
        for w_, c in ln: d.text((cx, cy), w_, font=f, fill=c + (255,)); cx += f.getlength(w_ + " ")
        cy += size * lead
    return cy
SW_ = 900

def place(L, im, cx, cy, rot=0.0, shadow=True):
    if rot: im = im.rotate(rot, resample=Image.BICUBIC, expand=True)
    if shadow: im = soft_shadow(im, 9, 7, 62, 26)
    L.alpha_composite(im, (int(cx - im.width / 2), int(cy - im.height / 2)))

def pcard(img, border=(40, 40, 40), pad=12):
    c = hairline_card(img.width + 2 * pad, img.height + 2 * pad, border=border); c.alpha_composite(img.convert("RGBA"), (pad, pad)); return c

def mono_card(img, w, cell=5, mix=0.24, crop=None):
    im = img.crop(crop) if crop else img; im = im.resize((w, int(im.height * w / im.width)), Image.LANCZOS)
    return pcard(mono_halftone(im, cell, mix, 1.1))

def stamp(text, size=54, rot=-7, alpha=0.8):
    st = label(text, size, fg=RED, bg_=PAPER_, track=3); n = Image.new("RGBA", (st.width + 24, st.height + 20), (0, 0, 0, 0))
    ImageDraw.Draw(n).rectangle((0, 0, n.width - 1, n.height - 1), outline=RED + (255,), width=5); n.alpha_composite(st, (12, 10))
    n = n.rotate(rot, resample=Image.BICUBIC, expand=True); n.putalpha(n.getchannel("A").point(lambda v: int(v * alpha))); n.kind = "stamp"; return n

def micro(L, text, x, y, **kw):
    im = label(text, kw.get("size", 24), kw.get("fg", (255, 255, 255)), kw.get("bg", INKK)); L.alpha_composite(im, (int(x), int(y))); return im

def hang(L, cx, y_pin, tag, rot=-3):
    d = ImageDraw.Draw(L); t = tag.rotate(rot, resample=Image.BICUBIC, expand=True); top = y_pin + 70
    d.line((cx, y_pin, cx, top + 14), fill=RED + (255,), width=4); d.ellipse((cx - 10, y_pin - 10, cx + 10, y_pin + 10), fill=RED + (255,), outline=(255, 255, 255, 255), width=3)
    L.alpha_composite(soft_shadow(t, 8, 6, 60, 22), (int(cx - t.width / 2) - 22, top - 22))

_H = {}
def hero(key, src_name, h, frac=1.0, cell=4):
    k = (key, h, frac)
    if k not in _H:
        im = cut_halftone(A + f"cutouts/{key}.png", h, cell=cell, mix=0.10, color=True, fill_holes=True, src=SRC + src_name)
        if frac < 1: im = im.crop((0, 0, im.width, int(im.height * frac)))
        im = selective_red(im)
        if frac < 1:
            a = np.asarray(im).copy(); hh = a.shape[0]; ramp = np.clip((hh - np.arange(hh)) / 60, 0, 1)[:, None]; a[..., 3] = (a[..., 3] * ramp).astype(np.uint8); im = Image.fromarray(a, "RGBA")
        _H[k] = im
    return _H[k]
def agus(n, h, frac=1.0):
    names = {1: "SPG-1 menyapa.png", 2: "SPG-2 menawarkan sampel.png", 3: "SPG-3 setengah badan.png"}
    return hero(f"spg{n}", names[n], h, frac)

def name_label(L, cx, y):
    im = label("AGUSTINA  /  CO-FOUNDER PROCHIZ", 24); L.alpha_composite(im, (int(cx - im.width / 2), int(y)))

def bar_card(w, rows, head=None, note=None):
    top = 84 if head else 26; h = top + 118 * len(rows) + 10; c = hairline_card(w, h, border=(40, 40, 40)); d = ImageDraw.Draw(c)
    if head: c.alpha_composite(label(head, 22), (22, 20))
    y = top
    for nm, fr, col in rows:
        d.text((24, y), nm, font=an(26), fill=INKK + (255,)); d.rectangle((24, y + 40, w - 24, y + 84), outline=(40, 40, 40, 255), width=3, fill=(240, 236, 226, 255))
        d.rectangle((27, y + 43, 27 + int((w - 54) * fr), y + 81), fill=col + (255,)); y += 118
    if note: d.text((w - 24, h - 14), note, font=mono_font(16, False), fill=(110, 104, 90, 255), anchor="rb")
    return c

def dot_only(L, x, y, r=10):
    d = ImageDraw.Draw(L); d.ellipse((x - r - 11, y - r - 11, x + r + 11, y + r + 11), outline=RED + (255,), width=3); d.ellipse((x - r, y - r, x + r, y + r), fill=RED + (255,), outline=(255, 255, 255, 255), width=3)

def tag_blank():
    im = hairline_card(96, 128, border=(40, 40, 40)); ImageDraw.Draw(im).rectangle((30, 36, 66, 72), fill=RED + (255,)); return im

def ac(L, im, pos): L.alpha_composite(im, (int(pos[0]), int(pos[1])))
def rule(L, p0, p1, col=INKK, w=6): ImageDraw.Draw(L).line((p0[0], p0[1], p1[0], p1[1]), fill=col + (255,), width=w)
def dotnode(L, x, y, col): ImageDraw.Draw(L).ellipse((x - 18, y - 18, x + 18, y + 18), fill=col + (255,), outline=(255, 255, 255, 255), width=4)

# ---------------------------------------------------------------- 15 scenes
def s01(L):
    ttl(L, [[("KOMPETITOR", INKK)], [("MENGUASAI", INKK)], [("RAK", INKK), ("KEJU.", RED)]], 290, 124)
    mh = mono_halftone(WALL.crop((294, 112, 1366, 912)).resize((860, 641), Image.LANCZOS), 5, 0.22, 1.08)
    d = ImageDraw.Draw(mh); sx, sy = int(536 * 860 / 1072), int(400 * 860 / 1072); d.rectangle((sx - 78, sy - 62, sx + 78, sy + 62), outline=RED + (255,), width=6)
    place(L, pcard(mh.resize((820, 611), Image.LANCZOS)), CX - 8, 1130, rot=-2)
    ac(L, stamp("DIKUASAI KOMPETITOR"), (int(CX - 330), 1290))

def s02(L):
    ttl(L, [[("PROCHIZ", RED)], [("MENYERANG DARI", INKK)], [("RAK ROTI TAWAR!", INKK)]], 290, 124)
    micro(L, "KENAPA RAK ROTI?", 90, 700, size=28)
    sp = agus(1, 1150, 0.72); ac(L, sp, (int(CX - sp.width / 2) + 20, 1480 - sp.height)); top = 1480 - sp.height
    dot_only(L, CX + 42, top - 6, 9)
    for x, y, r in ((120, 880, -5), (116, 1020, 4), (128, 1160, -3), (900, 840, 4), (904, 990, -4), (896, 1140, 3)): place(L, tag_blank(), x, y, rot=r)
    name_label(L, CX + 20, 1420)

def s03(L):
    ttl(L, [[("WAKTU MASUK KE", INKK)], [("SUPERMARKET", RED)]], 290, 124)
    micro(L, "PROCHIZ BERDIRI DI MANA?", SL + 20, 690, size=28)
    pw, ph = 860, 640; c = hairline_card(pw, ph, border=(40, 40, 40)); d = ImageDraw.Draw(c)
    xs = [100, 270, 440, 610, 760]
    for i, x in enumerate(xs): d.rectangle((x, 130, x + 56, 470), outline=(40, 40, 40, 255), width=3, fill=((255, 220, 214, 255) if i == 3 else (236, 232, 222, 255)))
    c.alpha_composite(label("LORONG ROTI", 24, bg_=RED), (xs[3] + 28 - 70, 70))
    cx3 = xs[3] + 28; d.line((cx3, ph - 30, cx3, 500), fill=RED + (255,), width=6)
    d.ellipse((cx3 - 14, 486 - 14, cx3 + 14, 486 + 14), fill=RED + (255,), outline=(255, 255, 255, 255), width=3)
    place(L, c, CX, 1130, rot=-1)

def s04(L):
    ttl(L, [[("TIDAK BISA SEKADAR", INKK)], [("MENGANDALKAN", INKK), ("RAK KEJU", RED)]], 290, 100)
    crop = WALL.crop((360, 0, 1301, 941)).resize((800, 800), Image.LANCZOS); mh = mono_halftone(crop, 5, 0.22, 1.08).convert("RGBA")
    sx, sy = int(470 * 800 / 941), int(512 * 800 / 941); lg = wfit(LOGO_P, 170); box = Image.new("RGBA", (200, 150), PAPER_ + (255,)); box.alpha_composite(lg, (15, 14)); mh.alpha_composite(box, (sx - 100, sy - 75))
    ImageDraw.Draw(mh).rectangle((sx - 104, sy - 79, sx + 104, sy + 79), outline=RED + (255,), width=6)
    place(L, pcard(mh), CX, 1000, rot=1.2)
    micro(L, "SATU DI ANTARA BANYAK", SL + 10, 1450)

def s05(L):
    ttl(L, [[("BRAND LAWAN JAUH", INKK)], [("LEBIH DULU", INKK), ("DIKENAL", RED)]], 290, 108)
    place(L, bar_card(760, (("BRAND LAWAN", 0.92, INKK), ("PROCHIZ", 0.26, RED)), "ILUSTRASI  ·  TINGKAT DIKENAL"), 490, 700, rot=1.5)
    f = CUST1_X.resize((int(CUST1_X.width * 590 / CUST1_X.height), 590), Image.LANCZOS); ac(L, f, (SR - f.width - 40, 1480 - 590))
    q = label("mana yang Prochiz ya?", 30, fg=INKK, bg_=PAPER_); qq = Image.new("RGBA", (q.width + 8, q.height + 8), (40, 40, 40, 255)); qq.alpha_composite(q, (4, 4)); place(L, qq, 330, 1250, rot=3)

def s06(L):
    ttl(L, [[("BEREBUT PERHATIAN", INKK)], [("DI RAK", INKK), ("KEJU", RED)]], 290, 112)
    place(L, mono_card(WALL, 500, crop=(294, 112, 1366, 912)), 345, 880, rot=-5)
    ac(L, CROWD2, (int(470 - CROWD2.width / 2) + 40, 1480 - CROWD2.height + 4))
    ac(L, stamp("REBUT PERHATIAN", 50, -7), (130, 1180))

def s07(L):
    ttl(L, [[("BEDA.", RED)]], 340, 300, lead=1.0)
    sp = agus(2, 1100, 0.78); ac(L, sp, (SR - sp.width + 10, 1480 - sp.height))
    a = hairline_card(380, 190, border=(40, 40, 40), fill=(238, 235, 226)); d = ImageDraw.Draw(a); d.text((24, 12), "RAK KEJU", font=an(34), fill=INKK + (255,)); d.line((40, 70, 340, 170), fill=RED + (255,), width=8); d.line((40, 170, 340, 70), fill=RED + (255,), width=8)
    place(L, a, 280, 940, rot=-3)
    b = hairline_card(400, 220, border=RED); ImageDraw.Draw(b).text((24, 12), "LORONG ROTI", font=an(34), fill=RED + (255,)); b.alpha_composite(wfit(GOLD_P, 220), (150, 60)); ImageDraw.Draw(b).text((22, 100), "ada\nProchiz", font=an(34), fill=INKK + (255,))
    place(L, b, 300, 1220, rot=2); plumb(L, 280, 1030, 1110, False)

def s08(L):
    ttl(L, [[("SPG DI LORONG", INKK)], [("ROTI", INKK), ("TAWAR", RED)]], 290, 108)
    place(L, mono_card(AISLE, 790, crop=(236, 0, 1436, 941)), 490, 960, rot=-2)
    sp = agus(1, 1050, 0.72); ac(L, sp, (SR - sp.width + 0, 1480 - sp.height))
    dot_only(L, 300, 1010, 12)

def s09(L):
    micro(L, "POV", 90, 300, size=34, bg=RED)
    ttl(L, [[("CUSTOMER", INKK)], [("MENCARI", INKK), ("ROTI", RED)]], 360, 122)
    pov = mono_card(POV, 600, crop=(400, 60, 1100, 941)); place(L, pov, 400, 1090, rot=-2)
    q = label("TERUS ENAKNYA DIAPAIN?", 34, fg=INKK, bg_=PAPER_); qq = Image.new("RGBA", (q.width + 8, q.height + 8), (40, 40, 40, 255)); qq.alpha_composite(q, (4, 4)); place(L, qq, 700, 1380, rot=3)
    dot_only(L, 640, 1000, 12)

def receipt():
    w, h = 330, 520; im = Image.new("RGBA", (w, h + 20), (0, 0, 0, 0)); d = ImageDraw.Draw(im)
    pts = [(0, 0), (w, 0)]; zz = 14
    pts += [(w - i * zz, h + (10 if i % 2 else 0)) for i in range(0, w // zz + 1)]; d.polygon(pts, fill=PAPER_ + (255,), outline=(40, 40, 40, 255))
    f = mono_font(20); fb = mono_font(26); d.text((w // 2, 44), "NOTA", font=fb, fill=INKK + (255,), anchor="mm"); d.line((20, 76, w - 20, 76), fill=(40, 40, 40, 255), width=2)
    for i, (n, hl) in enumerate((("ROTI TAWAR  x1", False), ("KEJU PROCHIZ  x1", True))):
        y = 140 + i * 72
        if hl: d.rectangle((14, y - 22, w - 14, y + 22), fill=RED + (255,))
        d.text((24, y), n, font=f, fill=((255, 255, 255) if hl else INKK) + (255,), anchor="lm")
    d.line((20, 300, w - 20, 300), fill=(40, 40, 40, 255), width=2); d.text((24, 340), "DIBELI BERSAMA", font=f, fill=INKK + (255,), anchor="lm"); pass
    return im

def s10(L):
    ttl(L, [[("KEJU", RED)], [("PENDAMPING ROTI", INKK)]], 350, 116)
    gc = pcard(GOLDC.resize((560, 373), Image.LANCZOS)); place(L, gc, 380, 900, rot=-2)
    ac(L, wfit(Image.fromarray(np.asarray(P_ROTI)), 230), (110, 1080)) if False else None
    place(L, receipt(), 765, 1130, rot=4)
    ac(L, stamp("COCOK DIPASANGKAN", 46, -6), (96, 1220))

def s11(L):
    ttl(L, [[("KALAU KAMU OWNER:", INKK)], [("TUNGGU", INKK), ("ATAU", INKK), ("PINDAH?", RED)]], 290, 112)
    pw, ph = 420, 780
    def panel(img, fig, fh, red):
        base = mono_halftone(cover(img, pw, ph, 0.5, 0.5), 5, 0.2, 1.05); ii = base.copy(); f2 = fig.resize((int(fig.width * fh / fig.height), fh), Image.LANCZOS); ii.alpha_composite(f2, ((pw - f2.width) // 2, ph - fh)); return pcard(ii, border=(RED if red else (40, 40, 40)))
    left = panel(WALL, CUST3_X, 640, False); d = ImageDraw.Draw(left); d.line((90, 170, 330, 400), fill=RED + (255,), width=10); d.line((330, 170, 90, 400), fill=RED + (255,), width=10)
    place(L, left, SL + 12 + (pw + 24) / 2, 1010, rot=-1)
    place(L, panel(AISLE, agus(2, 780, 1.0), 700, True), SR - 12 - (pw + 24) / 2, 1010, rot=1)
    micro(L, "MENUNGGU", SL + 12, 1450, size=28); micro(L, "MENDATANGI", SR - 12 - 190, 1450, size=28, bg=RED)

def s12(L):
    ttl(L, [[("TEPAT SAAT", INKK)], [("KEBUTUHAN", RED), ("MUNCUL.", INKK)]], 290, 112)
    rule(L, (150, 760), (150, 1400), (40, 40, 40), 4)
    f = CUST2_X; ac(L, f.resize((int(f.width * 640 / f.height), 640), Image.LANCZOS), (SR - 320, 1480 - 640))
    items = ((800, "AMBIL ROTI", "roti"), (1090, "KEBUTUHAN MUNCUL", "ping"), (1380, "TAWARKAN KEJU", "pack"))
    for y, tag, ic in items:
        dotnode(L, 150, y, (RED if ic == "ping" else INKK))
        c = hairline_card(440, 170, border=(40, 40, 40)); c.alpha_composite(label(tag, 24, bg_=(RED if ic == "ping" else INKK)), (18, 16))
        if ic == "roti": c.alpha_composite(wfit(Image.fromarray(np.asarray(P_ROTI)), 130), (290, 24))
        elif ic == "pack": c.alpha_composite(wfit(GOLD_P, 190), (220, 36))
        else: ImageDraw.Draw(c).ellipse((300, 40, 400, 140), fill=RED + (255,))
        place(L, c, 420, y, rot=(1, -1, 1)[items.index((y, tag, ic))])

def s13(L):
    ttl(L, [[("STRATEGI", INKK)]], 280, 140); rule(L, (90, 450), (90 + int(an(140).getlength("STRATEGI")), 450), INKK, 6); ttl(L, [[("GERILYA", RED)]], 460, 140)
    sp = agus(3, 800, 1.0); ac(L, sp, (int(CX - sp.width / 2) + 100, 1480 - sp.height + 10))
    ac(L, wfit(LOGO_P, 300), (90, 860))

def s14(L):
    ttl(L, [[("MEREBUT", INKK)], [("PERHATIAN", RED)], [("CUSTOMER", INKK)]], 290, 118)
    c = hairline_card(520, 370, border=(40, 40, 40)); d = ImageDraw.Draw(c)
    for i, (tx, col) in enumerate((("CARI ROTI", INKK), ("BUTUH PENDAMPING", (110, 106, 96)), ("TERTARIK KEJU", RED))):
        d.rectangle((26, 30 + i * 110, 494, 110 + i * 110), fill=col + (255,)); d.text((260, 70 + i * 110), tx, font=an(34), fill=(255, 255, 255, 255), anchor="mm")
    place(L, c, 330, 1050, rot=-2)
    f = CUST4_X; ac(L, f.resize((int(f.width * 800 / f.height), 800), Image.LANCZOS), (SR - 440, 1480 - 800))

def s15(L):
    ttl(L, [[("MEMPERLUAS", INKK)], [("PENETRASI", RED)], [("PASAR.", INKK)]], 290, 118)
    c = bar_card(480, (("PENETRASI PASAR", 0.82, RED),), None, "ILUSTRASI"); c.alpha_composite(wfit(LOGO_P, 200), (140, 16 + 0)) if False else None
    place(L, c, 700, 1020, rot=2); ac(L, wfit(LOGO_P, 190), (610, 800 - 20))
    sp = agus(1, 1050, 0.72); ac(L, sp, (60, 1480 - sp.height)); name_label(L, 290, 1440)

SC = [(1, s01), (2, s02), (3, s03), (4, s04), (5, s05), (6, s06), (7, s07), (8, s08), (9, s09), (10, s10), (11, s11), (12, s12), (13, s13), (14, s14), (15, s15)]
def render(fn):
    base = bg(); L = Image.new("RGBA", (W, H), (0, 0, 0, 0)); fn(L); out = base.copy(); out.alpha_composite(L); return out.convert("RGB"), L

if __name__ == "__main__":
    o = R + "prochiz_test/"; os.makedirs(o, exist_ok=True); bad = 0
    for n, fn in SC:
        im, L = render(fn); im.save(o + f"s8_{n:02d}.png")
        bb = L.getchannel("A").point(lambda v: 255 if v > 125 else 0).filter(ImageFilter.MinFilter(9)).getbbox()
        if bb and (bb[0] < SL - 6 or bb[2] > SR + 6 or bb[1] < ST - 6 or bb[3] > SB + 6): bad += 1; print("OUT", n, bb)
    print("violations:", bad)
    PW, PH = 432, 768; gap = 20; cols = 5
    sheet = Image.new("RGB", (cols * (PW + gap) + gap, 3 * (PH + 96) + gap), (28, 28, 32)); d = ImageDraw.Draw(sheet)
    hf = ImageFont.truetype("/usr/share/fonts/opentype/inter/Inter-Bold.otf", 22); nf = ImageFont.truetype("/usr/share/fonts/opentype/inter/Inter-Medium.otf", 17)
    for i, (tm, vo, _) in enumerate(B.SCN):
        n = i + 1; im = Image.open(o + f"s8_{n:02d}.png").resize((PW, PH), Image.LANCZOS)
        x = gap + (i % cols) * (PW + gap); y = gap + (i // cols) * (PH + 96)
        d.text((x, y + 2), f"{n:02d}", font=hf, fill=(255, 210, 90)); d.text((x + 46, y + 2), f"{tm.replace(':', '.')}s", font=hf, fill=(200, 200, 200)); sheet.paste(im, (x, y + 34))
        d.rectangle((x + int(SL * PW / W), y + 34 + int(ST * PH / H), x + int(SR * PW / W), y + 34 + int(SB * PH / H)), outline=(0, 150, 255), width=1)
        line = ""; ly = y + 34 + PH + 6
        for w_ in vo.split():
            if nf.getlength(line + " " + w_) > PW: d.text((x, ly), line, font=nf, fill=(235, 235, 235)); ly += 22; line = w_
            else: line = (line + " " + w_).strip()
        d.text((x, ly), line, font=nf, fill=(235, 235, 235))
    sheet.save(o + "storyboard_v8.png"); print(sheet.size)
