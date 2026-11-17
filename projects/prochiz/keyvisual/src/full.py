"""Prochiz x editorial key-visual - FULL (VO 41.7 s). No bottom caption. All key content inside the safe zone."""
import math, sys, os, subprocess
import numpy as np
from PIL import Image, ImageDraw, ImageFont, ImageFilter
sys.path.insert(0, os.path.dirname(__file__))
import render as RD
from render import (R, A, FONT, W, H, FPS, INK, RED, BLUE, PAPER, IVORY, clamp, prog, e_out, e_in, e_io, e_back, BG, screen,
                    cut_halftone, duotone_card)

# ------------------------------------------------------------------ safe zone (1080x1920, Reels/TikTok/Shorts UI)
SL, SR, ST, SB = 72, 960, 270, 1540          # left, right (120 px for action buttons), top, bottom (380 px for UI)
SW = SR - SL
CX = (SL + SR) // 2
NAVY = (16, 22, 58); LIME = (178, 238, 70); GOLD = (236, 188, 74); CREAM = (247, 237, 213)

def F(name, size): return ImageFont.truetype(FONT + name, int(size))
def INTER(size, w="ExtraBold"): return ImageFont.truetype(f"/usr/share/fonts/opentype/inter/Inter-{w}.otf", int(size))

def ink(font, text):
    return font.getbbox(text, anchor="ls")     # l, t(neg), r, b relative to the baseline origin

def center_text(d, box_w, box_h, text, font, fill):
    l, t, r, b = ink(font, text)
    d.text((box_w / 2 - (l + r) / 2, box_h / 2 - (t + b) / 2), text, font=font, fill=fill, anchor="ls")

# ------------------------------------------------------------------ proportional boxes
def mk_chip(text, size=28, fg=(255, 255, 255), bg=INK):
    f = F("SpaceMono-Bold.ttf", size); l, t, r, b = ink(f, text)
    px, py = int(size * 0.78), int(size * 0.62)
    w, h = (r - l) + 2 * px, (b - t) + 2 * py
    im = Image.new("RGBA", (w, h), bg + (255,)); center_text(ImageDraw.Draw(im), w, h, text, f, fg)
    return im

def mk_stamp(text, color, size=72, fill=True, seed=3):
    f = F("Anton.ttf", size); l, t, r, b = ink(f, text)
    px, py, bw = int(size * 0.42), int(size * 0.30), max(5, int(size * 0.11))
    w, h = (r - l) + 2 * px + 8, (b - t) + 2 * py + 8
    im = Image.new("RGBA", (w, h), (0, 0, 0, 0)); d = ImageDraw.Draw(im)
    d.rounded_rectangle((3, 3, w - 4, h - 4), radius=int(size * 0.2), fill=(PAPER + (245,)) if fill else None, outline=color + (255,), width=bw)
    center_text(d, w, h, text, f, color)
    n = np.asarray(Image.fromarray((np.random.RandomState(seed).rand(h, w) * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(1.0))).astype(np.float32) / 255
    a = np.asarray(im).copy(); a[..., 3] = (a[..., 3] * (n > 0.15)).astype(np.uint8)
    return Image.fromarray(a, "RGBA")

def mk_label(text, size, fg, bg, font="Anton.ttf", pad=(0.35, 0.22), radius=0.18):
    f = F(font, size); l, t, r, b = ink(f, text)
    px, py = int(size * pad[0]), int(size * pad[1])
    w, h = (r - l) + 2 * px, (b - t) + 2 * py
    im = Image.new("RGBA", (w, h), (0, 0, 0, 0)); d = ImageDraw.Draw(im)
    d.rounded_rectangle((0, 0, w - 1, h - 1), radius=int(size * radius), fill=bg + (255,)); center_text(d, w, h, text, f, fg)
    return im

def shadowed(card, pad=46, blur=16, dy=12, alpha=100):
    sh = Image.new("RGBA", (card.width + 2 * pad, card.height + 2 * pad), (0, 0, 0, 0))
    m = Image.new("L", sh.size, 0); ImageDraw.Draw(m).rectangle((pad, pad + dy, pad + card.width, pad + card.height + dy), fill=alpha)
    sh.putalpha(m.filter(ImageFilter.GaussianBlur(blur))); sh.alpha_composite(card, (pad, pad)); return sh

def paper_card(inner, border=14):
    c = Image.new("RGBA", (inner.width + 2 * border, inner.height + 2 * border), PAPER + (255,)); c.alpha_composite(inner, (border, border)); return shadowed(c)

# ------------------------------------------------------------------ drawing helpers
def paste(layer, im, cx, cy, scale=1.0, rot=0.0, alpha=1.0):
    if alpha <= 0.004 or scale <= 0.004: return
    if scale != 1.0: im = im.resize((max(2, int(im.width * scale)), max(2, int(im.height * scale))), Image.BICUBIC)
    if rot: im = im.rotate(rot, resample=Image.BICUBIC, expand=True)
    if alpha < 1.0:
        a = im.getchannel("A").point(lambda v: int(v * alpha)); im = im.copy(); im.putalpha(a)
    x, y = int(cx - im.width / 2), int(cy - im.height / 2)
    layer.alpha_composite(im, (max(0, x), max(0, y)), (max(0, -x), max(0, -y))) if (x < 0 or y < 0) else layer.alpha_composite(im, (x, y))

def shake(t, t0, amp=10, dur=0.35):
    p = prog(t, t0, t0 + dur)
    if p <= 0 or p >= 1: return 0, 0
    d = (1 - p) ** 2 * amp
    return int(math.sin(p * 48) * d), int(math.cos(p * 41) * d * 0.7)

def fit_size(lines, maxw=SW, top=132, bottom=70, gap=0.2):
    for s in range(top, bottom, -2):
        f = F("Anton.ttf", s)
        if all(sum(f.getlength(w) for w, _ in ln) + (len(ln) - 1) * s * gap <= maxw for ln in lines): return s
    return bottom

def title(layer, lines, t, t0=0.05, x=SL, y=338, size=None, step=0.085, dur=0.3, lh=0.97, gap=0.2):
    size = fit_size(lines, top=(size or 132), gap=gap); f = F("Anton.ttf", size); i = 0
    for li, ln in enumerate(lines):
        cx = x
        for w, c in ln:
            l, tt, r, b = ink(f, w)
            p = e_out(prog(t, t0 + i * step, t0 + i * step + dur))
            if p > 0.01:
                im = Image.new("RGBA", (int(r - l) + 8, int(b - tt) + 8), (0, 0, 0, 0))
                ImageDraw.Draw(im).text((4 - l, 4 - tt), w, font=f, fill=c, anchor="ls")
                a = im.getchannel("A").point(lambda v: int(v * clamp(p * 1.5))); im.putalpha(a)
                layer.alpha_composite(im, (int(cx + l - 4), int(y + li * size * lh + (1 - p) * 60 + tt + size * 0.86 - 4 + 4)))
            cx += (r - l) + size * gap; i += 1
    return y + len(lines) * size * lh

def head_chip(layer, text, t, bg=INK, t0=0.0):
    c = mk_chip(text, 30, bg=bg); p = e_out(prog(t, t0, t0 + 0.25))
    paste(layer, c, SL + c.width / 2 - (1 - p) * 40, ST + c.height / 2, alpha=p)

def dot(layer, x, y, t, t0, r=26, col=RED):
    p = e_back(prog(t, t0, t0 + 0.25), 2.2)
    if p <= 0: return
    d = ImageDraw.Draw(layer)
    if t > t0 + 0.25:
        pr = ((t - t0 - 0.25) % 0.9) / 0.9; rr = r + 78 * pr
        d.ellipse((x - rr, y - rr, x + rr, y + rr), outline=col + (int(220 * (1 - pr)),), width=6)
    rr = r * clamp(p, 0, 1.2); d.ellipse((x - rr, y - rr, x + rr, y + rr), fill=col + (255,), outline=PAPER + (255,), width=6)

def arrow(layer, p0, p1, t, t0, dur=0.3, col=RED, w=14, head=34):
    p = e_out(prog(t, t0, t0 + dur))
    if p <= 0: return
    x = p0[0] + (p1[0] - p0[0]) * p; y = p0[1] + (p1[1] - p0[1]) * p
    d = ImageDraw.Draw(layer); d.line((p0[0], p0[1], x, y), fill=col + (255,), width=w)
    ang = math.atan2(p1[1] - p0[1], p1[0] - p0[0])
    pts = [(x + math.cos(ang) * head, y + math.sin(ang) * head), (x + math.cos(ang + 2.5) * head, y + math.sin(ang + 2.5) * head), (x + math.cos(ang - 2.5) * head, y + math.sin(ang - 2.5) * head)]
    d.polygon(pts, fill=col + (255,))

# ------------------------------------------------------------------ assets
CARD_KEJU = duotone_card(A + "aisle/aisle_keju.png", 800, (14, 22, 96), (226, 232, 255))
CARD_ROTI = duotone_card(A + "aisle/aisle_roti.png", 560, (60, 12, 8), (252, 228, 214))
CARD_ROTI_L = duotone_card(A + "aisle/aisle_roti.png", 820, (60, 12, 8), (252, 228, 214))
SRC = R + "assets_zip/prochiz/"
SPG1 = cut_halftone(A + "cutouts/spg1.png", 800, cell=4, mix=0.10, color=True, fill_holes=True, src=SRC + "SPG-1 menyapa.png")
SPG2 = cut_halftone(A + "cutouts/spg2.png", 740, cell=4, mix=0.10, color=True, fill_holes=True, src=SRC + "SPG-2 menawarkan sampel.png")
SPG3 = cut_halftone(A + "cutouts/spg3.png", 640, cell=4, mix=0.10, color=True, fill_holes=True, src=SRC + "SPG-3 setengah badan.png")
C4POLY = [[(378, 290), (497, 262), (560, 340), (595, 400), (612, 700), (612, 752), (300, 752), (300, 700), (330, 600), (372, 520), (385, 440), (378, 330)]]
CROWDPOLY = [[(280, 598), (420, 610), (520, 620), (528, 684), (430, 682), (292, 672)]]
CUST1 = cut_halftone(A + "cutouts/cust1.png", 760, cell=5, mix=0.10, color=False, fill_holes=True, src=SRC + "CUST-1 bingung.png")
CUST2 = cut_halftone(A + "cutouts/cust2.png", 780, cell=5, fill_holes=True, src=SRC + "CUST-2 pegang roti.png")
CUST3 = cut_halftone(A + "cutouts/cust3.png", 700, cell=5, fill_holes=True, src=SRC + "CUST-3 menunggu.png")
CUST4 = cut_halftone(A + "cutouts/cust4.png", 780, cell=5, fill_holes=True, src=SRC + "CUST-4 kagettertarik.png", polys=C4POLY)
CROWD = cut_halftone(A + "cutouts/crowd.png", 720, cell=5, fill_holes=True, src=SRC + "C. Kerumunan (1 gambar, rasio 32).png", polys=CROWDPOLY)
P_ROTI = cut_halftone(A + "cutouts/prod_roti.png", 300, cell=4, mix=0.08, color=True, src=SRC + "PROD-ROTI.png", whitekey=True)
P_KEJU = cut_halftone(A + "cutouts/prod_keju_pack.png", 300, cell=4, mix=0.08, color=True, src=SRC + "PROD-KEJU-PACK.png", whitekey=True)
P_BLOK = cut_halftone(A + "cutouts/prod_keju_blok.png", 300, cell=4, mix=0.08, color=True, src=SRC + "PROD-KEJU-BLOK.png", whitekey=True)
LOGO = Image.open("/tmp/claude-0/-home-user/e0579038-0d3b-5b6d-a6ef-1c4c728d1b68/images/1.webp").convert("RGBA")
LOGO = LOGO.crop(LOGO.getchannel("A").getbbox())

def fade_bottom(im, px=90):
    a = np.asarray(im).copy(); h = a.shape[0]
    ramp = np.clip((h - np.arange(h)) / px, 0, 1)[:, None]; a[..., 3] = (a[..., 3] * ramp).astype(np.uint8)
    return Image.fromarray(a, "RGBA")
SPG3 = fade_bottom(SPG3)

# ------------------------------------------------------------------ scenes: draw(layer, t, dur)
def s_1a(L, t, dur):
    head_chip(L, "STRATEGI GERILYA  /  PROCHIZ", t)
    y = title(L, [[("KOMPETITOR", INK)], [("MENGUASAI", INK)], [("RAK", INK), ("KEJU.", BLUE)]], t, size=128)
    sx, sy = shake(t, 1.04, 11)
    ps = e_back(prog(t, 0.35, 0.8), 1.4)
    paste(L, CARD_KEJU, CX + sx, 1130 + sy, scale=ps, rot=-3, alpha=e_out(prog(t, 0.35, 0.6)))
    c = mk_chip("RAK KEJU  ·  SUPERMARKET", 30); paste(L, c, SL + 30 + c.width / 2 + sx, 740 + sy + 190 - 20 + 0, alpha=e_out(prog(t, 0.7, 0.9)))
    sp = prog(t, 0.95, 1.12)
    if sp > 0: paste(L, STAMP_A, CX + sx, 1180 + sy, scale=2.6 - 1.6 * e_out(sp), rot=-8, alpha=clamp(sp * 3))

def s_1b(L, t, dur):
    head_chip(L, "SERANGAN BALIK", t, bg=RED)
    title(L, [[("PROCHIZ", RED)], [("MENYERANG", INK), ("DARI", INK)], [("RAK", INK), ("ROTI", INK), ("TAWAR!", INK)]], t, size=120, t0=0.05)
    sx, sy = shake(t, 0.5, 7)
    pc = e_back(prog(t, 0.2, 0.65), 1.3)
    paste(L, CARD_ROTI, 392 + sx, 1190 + sy, scale=pc, rot=2.4, alpha=e_out(prog(t, 0.2, 0.45)))
    rs = e_out(prog(t, 0.4, 0.9))
    paste(L, SPG1, 740, 1500 - SPG1.height / 2 + (1 - rs) * 420, alpha=clamp(rs * 2))
    dot(L, 392, 1200, t, 0.8)

def s_2(L, t, dur):
    head_chip(L, "MASUK SUPERMARKET", t)
    title(L, [[("WAKTU", INK), ("MASUK", INK), ("KE", INK)], [("SUPERMARKET...", RED)]], t, size=126, t0=0.0)
    ox, oy, pw, ph = 112, 760, 808, 600
    d = ImageDraw.Draw(L)
    pr = e_io(prog(t, 0.15, 0.85)); pts = [(ox, oy + ph), (ox, oy), (ox + pw, oy), (ox + pw, oy + ph)]
    run = pr * sum(math.dist(pts[i], pts[i + 1]) for i in range(3))
    for i in range(3):
        a, b = pts[i], pts[i + 1]; Ls = math.dist(a, b)
        if run <= 0: break
        f = min(1, run / Ls); d.line((a[0], a[1], a[0] + (b[0] - a[0]) * f, a[1] + (b[1] - a[1]) * f), fill=INK, width=10, joint="curve"); run -= Ls
    for i in range(5):
        s = e_back(prog(t, 0.5 + i * 0.07, 0.8 + i * 0.07))
        if s <= 0.01: continue
        sx_ = ox + 76 + i * 148; h0 = int((ph - 170) * clamp(s, 0, 1.08))
        col = BLUE if i == 1 else (RED if i == 3 else (205, 199, 182))
        d.rounded_rectangle((sx_, oy + 56, sx_ + 80, oy + 56 + h0), radius=8, fill=col + (255,), outline=INK + (255,), width=5)
    if t > 0.85:
        a = prog(t, 0.85, 1.05)
        for txt, bg, i in (("KEJU", BLUE, 1), ("ROTI TAWAR", RED, 3)):
            c = mk_chip(txt, 28, bg=bg); paste(L, c, ox + 76 + i * 148 + 40, oy + 32, alpha=a)
    if t > 0.9:
        pa = e_out(prog(t, 0.9, 1.25)); ax = ox + pw // 2
        arrow(L, (ax, oy + ph + 90), (ax, oy + ph - 70), t, 0.9, 0.35)
        c = mk_chip("PROCHIZ MASUK", 30, bg=RED); paste(L, c, ax, oy + ph + 150, alpha=pa)

def s_3a(L, t, dur):
    head_chip(L, "RAK KEJU", t, bg=BLUE)
    title(L, [[("TIDAK", INK), ("BISA", INK), ("SEKADAR", INK)], [("MENGANDALKAN", INK)], [("RAK", INK), ("KEJU", BLUE)]], t, size=118)
    d = ImageDraw.Draw(L); x0, y0 = SL + 20, 880; cw, ch, gx, gy = 120, 104, 26, 34
    for r in range(4):
        for c in range(5):
            idx = r * 5 + c; p = e_back(prog(t, 0.25 + idx * 0.03, 0.5 + idx * 0.03), 1.6)
            if p <= 0.02: continue
            red = (r == 3 and c == 4)
            if red: continue
            x = x0 + c * (cw + gx); y = y0 + r * (ch + gy)
            s = clamp(p, 0, 1.05); w_, h_ = int(cw * s), int(ch * s)
            d.rounded_rectangle((x + (cw - w_) // 2, y + (ch - h_) // 2, x + (cw + w_) // 2, y + (ch + h_) // 2), radius=10, fill=BLUE + (255,), outline=INK + (255,), width=5)
    # the lonely red box in the last slot
    p = e_back(prog(t, 0.9, 1.15), 2.0); x = x0 + 4 * (cw + gx); y = y0 + 3 * (ch + gy)
    if p > 0.02:
        s = clamp(p, 0, 1.1); w_, h_ = int(cw * s), int(ch * s)
        d.rounded_rectangle((x + (cw - w_) // 2, y + (ch - h_) // 2, x + (cw + w_) // 2, y + (ch + h_) // 2), radius=10, fill=RED + (255,), outline=INK + (255,), width=5)
        c = mk_chip("PROCHIZ", 30, bg=RED); paste(L, c, x + cw / 2, y + ch + 52, alpha=prog(t, 1.1, 1.3))

def s_3b(L, t, dur):
    head_chip(L, "KOMPETITOR", t, bg=BLUE)
    title(L, [[("BRAND", INK), ("LAWAN", BLUE)], [("JAUH", INK), ("LEBIH", INK), ("DULU", INK)], [("DIKENAL.", INK)]], t, size=122)
    d = ImageDraw.Draw(L); x0, wmax = SL + 10, 760
    bars = (("BRAND LAWAN", BLUE, 0.92, 880), ("PROCHIZ", RED, 0.28, 1090))
    for name, col, frac, y in bars:
        p = e_out(prog(t, 0.35 if col == BLUE else 0.75, (0.35 if col == BLUE else 0.75) + 0.6))
        c = mk_chip(name, 30, bg=INK); paste(L, c, x0 + c.width / 2, y - 40, alpha=prog(t, 0.3 if col == BLUE else 0.7, 0.5 if col == BLUE else 0.9))
        d.rounded_rectangle((x0, y, x0 + wmax, y + 96), radius=14, fill=(255, 255, 255, 150), outline=INK + (255,), width=5)
        if p > 0: d.rounded_rectangle((x0 + 6, y + 6, x0 + 6 + int((wmax - 12) * frac * p), y + 90), radius=10, fill=col + (255,))
    c = mk_chip("ILUSTRASI  ·  TINGKAT DIKENAL", 28, fg=INK, bg=(215, 210, 192)); paste(L, c, x0 + c.width / 2, 1280, alpha=prog(t, 1.2, 1.4))

def s_4(L, t, dur):
    head_chip(L, "RAK KEJU", t, bg=BLUE)
    title(L, [[("BEREBUT", INK), ("PERHATIAN", INK)], [("DI", INK), ("RAK", INK), ("KEJU", BLUE)]], t, size=128)
    sx, sy = shake(t, 0.9, 9)
    ps = e_back(prog(t, 0.2, 0.6), 1.3)
    paste(L, CARD_KEJU, 470 + sx, 1090 + sy, scale=0.62 * ps, rot=-2, alpha=e_out(prog(t, 0.2, 0.45)))
    rs = e_out(prog(t, 0.35, 0.8))
    paste(L, CROWD, 560 + (1 - rs) * 420, 1440 - CROWD.height / 2, alpha=clamp(rs * 2))
    sp = prog(t, 0.85, 1.0)
    if sp > 0: paste(L, STAMP_B, 450 + sx, 1220 + sy, scale=2.4 - 1.4 * e_out(sp), rot=-7, alpha=clamp(sp * 3))

def s_5(L, t, dur):
    head_chip(L, "STRATEGI", t, bg=RED)
    title(L, [[("PENDEKATAN", INK)], [("BERBEDA.", RED)]], t, size=150, y=420, step=0.12, dur=0.35)
    # route: keju (blue) -> roti (red)
    y = 1000
    a = mk_label("RAK KEJU", 84, (255, 255, 255), BLUE); b = mk_label("RAK ROTI", 84, (255, 255, 255), RED)
    pa = e_back(prog(t, 0.35, 0.6)); pb = e_back(prog(t, 0.75, 1.0))
    paste(L, a, SL + a.width / 2 + 10, y, scale=pa, rot=-3, alpha=clamp(pa)); paste(L, b, SR - b.width / 2 - 10, y + 250, scale=pb, rot=3, alpha=clamp(pb))
    arrow(L, (SL + a.width * 0.55, y + 90), (SR - b.width * 0.45, y + 190), t, 0.55, 0.4, w=18, head=40)

def s_6(L, t, dur):
    head_chip(L, "LORONG ROTI TAWAR", t, bg=RED)
    title(L, [[("SPG", RED), ("DI", INK), ("LORONG", INK)], [("ROTI", INK), ("TAWAR", INK)]], t, size=128)
    sx, sy = shake(t, 0.65, 7)
    pc = e_back(prog(t, 0.2, 0.65), 1.3)
    paste(L, CARD_ROTI, 392 + sx, 1130 + sy, scale=pc, rot=2.4, alpha=e_out(prog(t, 0.2, 0.45)))
    rs = e_out(prog(t, 0.35, 0.85))
    paste(L, SPG1, 740, 1500 - SPG1.height / 2 + (1 - rs) * 420, alpha=clamp(rs * 2))
    dot(L, 392, 1140, t, 0.7)

def s_7(L, t, dur):
    head_chip(L, "CUSTOMER", t)
    title(L, [[("CUSTOMER", INK)], [("SEDANG", INK), ("CARI", INK), ("ROTI", RED)]], t, size=128)
    rs = e_out(prog(t, 0.2, 0.7))
    paste(L, CUST2, 740 + (1 - rs) * 300, 1500 - CUST2.height / 2, alpha=clamp(rs * 2))
    note = Image.new("RGBA", (420, 220), (255, 232, 120, 255)); nd = ImageDraw.Draw(note); center_text(nd, 420, 220, "roti apa ya?", F("SpaceMono-Bold.ttf", 52), INK)
    pn = e_back(prog(t, 0.55, 0.85), 1.7); paste(L, shadowed(note, 30, 10, 8, 90), 330, 1010, scale=pn, rot=-5, alpha=clamp(pn))
    pr = e_back(prog(t, 0.95, 1.25), 1.5); paste(L, P_ROTI, 300, 1310, scale=pr, rot=4, alpha=clamp(pr))

def s_8(L, t, dur):
    head_chip(L, "PENDAMPING ROTI", t, bg=RED)
    title(L, [[("KEJU", RED), ("SEBAGAI", INK)], [("PENDAMPING", INK), ("ROTI", INK)]], t, size=118)
    y = 1100
    def card(im, cx, rot, t0, tag, bg):
        p = e_back(prog(t, t0, t0 + 0.3), 1.6)
        base = Image.new("RGBA", (320, 320), PAPER + (255,)); base.alpha_composite(im.resize((int(im.width * 280 / max(im.size)), int(im.height * 280 / max(im.size))), Image.LANCZOS), ((320 - int(im.width * 280 / max(im.size))) // 2, (320 - int(im.height * 280 / max(im.size))) // 2))
        paste(L, shadowed(base, 36, 12, 10, 100), cx, y, scale=p, rot=rot, alpha=clamp(p))
        c = mk_chip(tag, 30, bg=bg); paste(L, c, cx, y + 190, alpha=prog(t, t0 + 0.2, t0 + 0.4))
    card(P_ROTI, 250, -4, 0.3, "ROTI", INK)
    pp = e_back(prog(t, 0.7, 0.95), 2); d = ImageDraw.Draw(L)
    if pp > 0:
        s = int(34 * clamp(pp, 0, 1.2)); d.rectangle((SL + 400 - s, y - 8, SL + 400 + s, y + 8), fill=RED + (255,)); d.rectangle((SL + 400 - 8, y - s, SL + 400 + 8, y + s), fill=RED + (255,))
    card(P_KEJU, 780, 4, 1.0, "KEJU", RED)
    st = mk_stamp("COCOK DIPASANGKAN", RED, 56); pst = prog(t, 1.9, 2.05)
    if pst > 0: paste(L, st, CX, 1400, scale=2.0 - 1.0 * e_out(pst), rot=-3, alpha=clamp(pst * 3))

def s_9(L, t, dur):
    head_chip(L, "BALIK ARAH", t, bg=RED)
    title(L, [[("MENUNGGU", (120, 116, 104)), ("vs", INK)], [("MENDATANGI", RED)]], t, size=122)
    top, bot = 790, 1500; wl = 410
    d = ImageDraw.Draw(L)
    pL = e_out(prog(t, 0.25, 0.55)); pR = e_out(prog(t, 0.9, 1.2))
    for (x0, p, bgc, tag, tagbg) in ((SL, pL, (220, 215, 198), "MENUNGGU", INK), (SR - wl, pR, (255, 255, 255), "MENDATANGI", RED)):
        if p <= 0: continue
        card = Image.new("RGBA", (wl, bot - top), bgc + (255,)); ImageDraw.Draw(card).rectangle((0, 0, wl - 1, bot - top - 1), outline=INK + (255,), width=5)
        paste(L, shadowed(card, 30, 10, 8, 80), x0 + wl / 2, (top + bot) / 2 + (1 - p) * 60, alpha=p)
        c = mk_chip(tag, 30, bg=tagbg); paste(L, c, x0 + wl / 2, top + 34 + (1 - p) * 60, alpha=p)
    pc = e_out(prog(t, 0.45, 0.8))
    cL = CUST3.copy()
    paste(L, cL.resize((int(cL.width * 0.80), int(cL.height * 0.80))), SL + wl / 2, bot - 16 - cL.height * 0.80 / 2, alpha=pc)
    c = mk_chip("TIDAK DATANG...", 28, fg=INK, bg=(255, 255, 255)); paste(L, c, SL + wl / 2, top + 110, alpha=prog(t, 1.4, 1.6))
    ps = e_out(prog(t, 1.05, 1.5))
    paste(L, SPG2.resize((int(SPG2.width * 0.80), int(SPG2.height * 0.80))), SR - wl / 2, bot - 16 - SPG2.height * 0.80 / 2 + (1 - ps) * 200, alpha=clamp(ps * 2))
    arrow(L, (SL + wl + 30, 1150), (SR - wl - 30, 1150), t, 1.6, 0.4, w=12, head=28)

def s_10(L, t, dur):
    head_chip(L, "TEPAT SASARAN", t, bg=RED)
    title(L, [[("TEPAT", INK), ("SAAT", INK)], [("KEBUTUHAN", RED)], [("MUNCUL.", INK)]], t, size=122)
    d = ImageDraw.Draw(L); y = 1230; x0, x1 = SL + 40, SR - 40
    pl = e_out(prog(t, 0.2, 0.8)); d.line((x0, y, x0 + (x1 - x0) * pl, y), fill=INK + (255,), width=12)
    steps = (("AMBIL ROTI", 0.0, 0.9, INK, P_ROTI), ("KEBUTUHAN", 0.5, 1.4, RED, None), ("TAWARKAN KEJU", 1.0, 2.1, BLUE, P_KEJU))
    for name, fx, t0, col, img in steps:
        x = int(x0 + (x1 - x0) * fx); p = e_back(prog(t, t0, t0 + 0.3), 1.8)
        if p <= 0.02: continue
        r = int(30 * clamp(p, 0, 1.2)); d.ellipse((x - r, y - r, x + r, y + r), fill=col + (255,), outline=PAPER + (255,), width=6)
        c = mk_chip(name, 30, bg=col); paste(L, c, min(max(x, SL + c.width / 2), SR - c.width / 2), y + 70, alpha=clamp(p))
        if img is not None:
            im2 = img.resize((int(img.width * 0.85), int(img.height * 0.85)))
            paste(L, im2, min(max(x, SL + im2.width / 2), SR - im2.width / 2), y - 190, alpha=clamp(p))
    if t > 1.4:
        pr = ((t - 1.4) % 1.0) / 1.0; x = int(x0 + (x1 - x0) * 0.5); rr = 30 + 100 * pr
        d.ellipse((x - rr, y - rr, x + rr, y + rr), outline=RED + (int(220 * (1 - pr)),), width=7)

def s_11a(L, t, dur):
    head_chip(L, "STRATEGI GERILYA", t, bg=RED)
    title(L, [[("INILAH", INK)], [("STRATEGI", INK)], [("GERILYA", RED)]], t, size=126)
    rs = e_out(prog(t, 0.25, 0.8)); paste(L, SPG3, 700, 1540 - SPG3.height / 2 + (1 - rs) * 300, alpha=clamp(rs * 2))
    sp = prog(t, 0.9, 1.05)
    if sp > 0:
        sx, sy = shake(t, 0.9, 9); paste(L, STAMP_C, 400 + sx, 1250 + sy, scale=2.4 - 1.4 * e_out(sp), rot=-7, alpha=clamp(sp * 3))

def s_11b(L, t, dur):
    head_chip(L, "REBUT PERHATIAN", t, bg=RED)
    title(L, [[("MEREBUT", INK)], [("PERHATIAN", RED)], [("CUSTOMER", INK)]], t, size=126, step=0.07)
    rs = e_out(prog(t, 0.2, 0.7)); paste(L, CUST4, 730 + (1 - rs) * 300, 1500 - CUST4.height / 2, alpha=clamp(rs * 2))
    dot(L, 330, 1200, t, 0.7, r=30)

def s_11c(L, t, dur):
    head_chip(L, "PENETRASI PASAR", t, bg=BLUE)
    title(L, [[("MEMPERLUAS", INK)], [("PENETRASI", BLUE)], [("PASAR.", INK)]], t, size=126, step=0.07)
    d = ImageDraw.Draw(L); x0, wmax, y = SL + 10, 800, 1120
    c = mk_chip("PENETRASI PASAR", 30, bg=INK); paste(L, c, x0 + c.width / 2, y - 48, alpha=prog(t, 0.2, 0.4))
    d.rounded_rectangle((x0, y, x0 + wmax, y + 110), radius=16, fill=(255, 255, 255, 170), outline=INK + (255,), width=6)
    p = e_out(prog(t, 0.35, 1.5))
    if p > 0: d.rounded_rectangle((x0 + 7, y + 7, x0 + 7 + int((wmax - 14) * 0.82 * p), y + 103), radius=11, fill=RED + (255,))
    arrow(L, (x0 + 120, y + 330), (x0 + 120, y + 190), t, 1.0, 0.35, w=14, head=32)
    c2 = mk_chip("TERUS NAIK", 30, bg=RED); paste(L, c2, x0 + 120 + c2.width / 2 + 36, y + 260, alpha=prog(t, 1.2, 1.4))

STAMP_A = mk_stamp("DIKUASAI KOMPETITOR", BLUE, 68)
STAMP_B = mk_stamp("REBUT PERHATIAN", BLUE, 66)
STAMP_C = mk_stamp("STRATEGI GERILYA", RED, 66)

# ------------------------------------------------------------------ end card (navy)
def end_bg():
    im = Image.new("RGBA", (W, H), NAVY + (255,)); d = ImageDraw.Draw(im)
    for x in range(0, W, 54): d.line((x, 0, x, H), fill=(255, 255, 255, 12), width=1)
    for y in range(0, H, 54): d.line((0, y, W, y), fill=(255, 255, 255, 12), width=1)
    return im
END_BG = end_bg()

def rr_box(w, h, fill, rot=0.0, outline=INK, ow=7, radius=22):
    im = Image.new("RGBA", (w + 24, h + 24), (0, 0, 0, 0)); d = ImageDraw.Draw(im)
    d.rounded_rectangle((12, 12, w + 11, h + 11), radius=radius, fill=fill + (255,), outline=outline + (255,), width=ow)
    return im

def fit_font(text, maxw, start, weight="ExtraBold"):
    for s in range(start, 20, -2):
        f = INTER(s, weight)
        if f.getlength(text) <= maxw: return f
    return INTER(20, weight)

def s_end(L, t, dur):
    # line 1
    f1 = INTER(56, "ExtraBold")
    lines = [[("Temukan", 0), ("strategi", 0), ("untuk", 0)], [("membawa", 0), ("bisnismu", 0)], [("selangkah", 1), ("lebih", 0), ("maju", 1), ("di", 0)]]
    y = 350; i = 0
    for ln in lines:
        tw = sum(f1.getlength(w) for w, _ in ln) + 16 * (len(ln) - 1); x = CX - tw / 2
        for w, hl in ln:
            p = e_out(prog(t, 0.05 + i * 0.07, 0.35 + i * 0.07)); i += 1
            col = LIME if hl else (255, 255, 255)
            im = Image.new("RGBA", (int(f1.getlength(w)) + 8, 90), (0, 0, 0, 0)); ImageDraw.Draw(im).text((4, 64), w, font=f1, fill=col, anchor="ls")
            a = im.getchannel("A").point(lambda v: int(v * p)); im.putalpha(a); L.alpha_composite(im, (int(x - 4), int(y - 64 + (1 - p) * 30)))
            x += f1.getlength(w) + 16
        y += 78
    # logo
    lp = e_back(prog(t, 0.55, 0.95), 1.5); lw = 520; lh = int(lw * LOGO.height / LOGO.width)
    paste(L, LOGO.resize((lw, lh), Image.LANCZOS), CX, 730, scale=lp, alpha=clamp(lp * 1.5))
    # yellow badge BUSINESS OWNER / MASTERCLASS
    bw_, bh_ = 820, 260; yb = e_back(prog(t, 1.0, 1.4), 1.5)
    badge = rr_box(bw_, bh_, GOLD, ow=8, radius=30); bd = ImageDraw.Draw(badge)
    f_a = fit_font("BUSINESS OWNER", bw_ - 120, 100, "Black"); f_b = fit_font("MASTERCLASS", bw_ - 120, 100, "Black")
    for txt, f, col, cy in (("BUSINESS OWNER", f_a, INK, 12 + bh_ * 0.34), ("MASTERCLASS", f_b, (212, 32, 40), 12 + bh_ * 0.70)):
        l, t_, r, b = ink(f, txt); bd.text(((bw_ + 24) / 2 - (l + r) / 2, cy - (t_ + b) / 2), txt, font=f, fill=col, anchor="ls")
    paste(L, shadowed(badge, 30, 10, 8, 120), CX, 1000, scale=yb, rot=-2, alpha=clamp(yb * 1.5))
    # date badge
    dw, dh = 780, 112; yd = e_back(prog(t, 1.5, 1.85), 1.6); date = rr_box(dw, dh, LIME, ow=6, radius=20); dd = ImageDraw.Draw(date)
    txt = "Kamis, 10 Desember 2026"; f = fit_font(txt, dw - 110, 56); l, t_, r, b = ink(f, txt)
    dd.text(((dw + 24) / 2 - (l + r) / 2, (dh + 24) / 2 - (t_ + b) / 2), txt, font=f, fill=INK, anchor="ls")
    paste(L, shadowed(date, 26, 8, 6, 110), CX, 1215, scale=yd, alpha=clamp(yd * 1.5))
    # cta
    cw_, ch_ = 860, 112; yc = e_back(prog(t, 2.0, 2.35), 1.6); cta = rr_box(cw_, ch_, CREAM, ow=6, radius=20); cd = ImageDraw.Draw(cta)
    txt = "Klik link nya sekarang juga!"; f = fit_font(txt, cw_ - 110, 56); l, t_, r, b = ink(f, txt)
    cd.text(((cw_ + 24) / 2 - (l + r) / 2, (ch_ + 24) / 2 - (t_ + b) / 2), txt, font=f, fill=INK, anchor="ls")
    paste(L, shadowed(cta, 26, 8, 6, 110), CX, 1385, scale=yc, alpha=clamp(yc * 1.5))

# ------------------------------------------------------------------ timeline (seconds), derived from VO energy anchors (pause 31.6-31.9 s, end 38.1 s)
SCENES = [
    (0.00, 1.96, s_1a), (1.96, 4.24, s_1b), (4.24, 7.15, s_2), (7.15, 9.50, s_3a), (9.50, 12.30, s_3b),
    (12.30, 15.10, s_4), (15.10, 17.40, s_5), (17.40, 20.10, s_6), (20.10, 23.18, s_7), (23.18, 26.80, s_8),
    (26.80, 31.78, s_9), (31.78, 35.72, s_10), (35.72, 38.33, s_11a), (38.33, 39.95, s_11b), (39.95, 41.72, s_11c),
]
TOTAL = 41.72
EXIT = 0.15

def frame(i):
    t = i / FPS
    sc = next((s for s in SCENES if s[0] <= t < s[1]), SCENES[-1])
    t0, t1, fn = sc
    tl = t - t0; dur = t1 - t0
    L = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    fn(L, tl, dur)
    ex = e_in(prog(tl, dur - EXIT, dur)) if (fn is not s_11c) else 0
    if ex > 0:
        a = L.getchannel("A").point(lambda v: int(v * (1 - ex))); L.putalpha(a)
        L = L.transform(L.size, Image.AFFINE, (1, 0, 70 * ex, 0, 1, 0))
    base = (END_BG if fn is s_end else BG).copy()
    base.alpha_composite(L)
    return base.convert("RGB"), L

def _work(i): return i, frame(i)[0].tobytes()

if __name__ == "__main__":
    mode = sys.argv[1]
    if mode == "preview":
        ts = [float(x) for x in sys.argv[2:]]; tiles = []
        for t in ts:
            im = frame(int(t * FPS))[0].resize((360, 640)); d = ImageDraw.Draw(im)
            d.rectangle((SL / 3, ST / 3, SR / 3, SB / 3), outline=(0, 160, 255), width=1)   # safe-zone guide
            tiles.append(im)
        cols = min(len(tiles), 6); rows = (len(tiles) + cols - 1) // cols
        sheet = Image.new("RGB", (360 * cols, 640 * rows), (0, 0, 0))
        for k, im in enumerate(tiles): sheet.paste(im, ((k % cols) * 360, (k // cols) * 640))
        sheet.save(R + "prochiz_test/full_preview.png")
    elif mode == "safe":      # report content that leaves the safe zone (alpha bbox of the scene layer)
        bad = 0
        for s in SCENES[:-1]:
            for tt in np.linspace(min(s[0] + 1.6, s[1] - 0.45), s[1] - 0.2, 4):
                L = frame(int(tt * FPS))[1]; bb = L.getchannel("A").point(lambda v: 255 if v > 125 else 0).getbbox()
                if bb and (bb[0] < SL - 6 or bb[2] > SR + 6 or bb[1] < ST - 6 or bb[3] > SB + 6):
                    bad += 1; print(f"t={tt:5.2f} scene {s[2].__name__}: bbox={bb}  (safe {SL},{ST},{SR},{SB})")
        print("violations:", bad)
    else:
        import multiprocessing as mp
        out = sys.argv[2]; n = int(TOTAL * FPS)
        enc = subprocess.Popen(["ffmpeg", "-v", "error", "-y", "-f", "rawvideo", "-pix_fmt", "rgb24", "-s", f"{W}x{H}", "-r", str(FPS), "-i", "-",
                                "-i", A + "vo.mp3", "-t", f"{TOTAL:.2f}", "-map", "0:v", "-map", "1:a", "-c:v", "libx264", "-crf", "16", "-preset", "medium",
                                "-pix_fmt", "yuv420p", "-c:a", "aac", "-b:a", "192k", out], stdin=subprocess.PIPE)
        with mp.get_context("fork").Pool(os.cpu_count()) as pool:
            for i, b in pool.imap(_work, range(n), chunksize=3): enc.stdin.write(b)
        enc.stdin.close(); enc.wait(); print("done", n)
