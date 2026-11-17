"""Prochiz x editorial key-visual: 5 s test (scene 1 hook + start of scene 2). No bottom caption."""
import math, sys, os, random, subprocess
import numpy as np
from PIL import Image, ImageDraw, ImageFont, ImageFilter, ImageChops

R = "/tmp/claude-0/-home-user/e0579038-0d3b-5b6d-a6ef-1c4c728d1b68/scratchpad/"
A = "/home/user/aagoyyy/claude-code/projects/prochiz/assets/"
FONT = R + "fonts/"
W, H, FPS = 1080, 1920, 30
IVORY = (230, 225, 210); INK = (37, 38, 39); RED = (166, 47, 47); BLUE = (58, 76, 240); PAPER = (255, 250, 231)   # brand: red #A62F2F, cream #FFFAE7, charcoal #252627

def F(name, size): return ImageFont.truetype(FONT + name, size)
def clamp(x, a=0.0, b=1.0): return max(a, min(b, x))
def prog(t, a, b): return clamp((t - a) / (b - a))
def e_out(x): return 1 - (1 - x) ** 3
def e_in(x): return x ** 3
def e_io(x): return 3 * x * x - 2 * x ** 3
def e_back(x, s=1.9):
    x = clamp(x) - 1
    return 1 + (s + 1) * x ** 3 + s * x ** 2

# ---------------------------------------------------------------- background
def make_bg():
    ys = np.linspace(0, 1, H)[:, None, None]
    top = np.array((233, 228, 213), np.float32); bot = np.array((214, 209, 192), np.float32)
    img = (top * (1 - ys) + bot * ys) * np.ones((1, W, 1), np.float32)
    im = Image.fromarray(img.astype(np.uint8)).convert("RGBA")
    d = ImageDraw.Draw(im)
    step = 108
    for gx in range(step // 2, W, step):
        for gy in range(step // 2, H, step):
            c = (110, 104, 88, 120)
            d.line((gx - 9, gy, gx + 9, gy), fill=c, width=2); d.line((gx, gy - 9, gx, gy + 9), fill=c, width=2)
    return im

# ---------------------------------------------------------------- halftone / duotone
def screen(w, h, cell, ang=45):
    yy, xx = np.mgrid[0:h, 0:w].astype(np.float32)
    a = math.radians(ang)
    u = (xx * math.cos(a) + yy * math.sin(a)) / cell
    v = (-xx * math.sin(a) + yy * math.cos(a)) / cell
    return (np.cos(2 * math.pi * u) + np.cos(2 * math.pi * v)) / 4 + 0.5  # 0..1

def cut_halftone(path, height, keep_red=True, cell=6, mix=0.30, protect_text=False, color=False, fill_holes=False, src=None, polys=None, whitekey=False):
    im = Image.open(path).convert("RGBA")
    if src:   # real RGB from the original photo (cutout colours are lost where alpha was 0)
        rgbim = Image.open(src).convert("RGB"); assert rgbim.size == im.size
        im = Image.merge("RGBA", (*rgbim.split(), im.getchannel("A")))
    if whitekey and src:   # product shots on pure white: key the white out, close and fill so nothing is see-through
        import cv2
        _rgb = np.asarray(Image.open(src).convert("RGB")).astype(np.int16)
        _m = (_rgb.min(axis=2) < 238).astype(np.uint8)
        _m = cv2.morphologyEx(_m, cv2.MORPH_CLOSE, cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (17, 17)))
        _m = cv2.morphologyEx(_m, cv2.MORPH_OPEN, np.ones((5, 5), np.uint8))
        _pad = cv2.copyMakeBorder(_m, 1, 1, 1, 1, cv2.BORDER_CONSTANT, value=0); _ff = (1 - _pad).copy(); _fm = np.zeros((_ff.shape[0] + 2, _ff.shape[1] + 2), np.uint8)
        cv2.floodFill(_ff, _fm, (0, 0), 2); _m = np.where(_ff[1:-1, 1:-1] == 1, 1, _m).astype(np.uint8)
        _n, _l, _st, _ = cv2.connectedComponentsWithStats(_m)
        _keep = np.zeros_like(_m)
        for _k in range(1, _n):
            if _st[_k, cv2.CC_STAT_AREA] > 0.02 * _m.size: _keep[_l == _k] = 1
        _a = cv2.GaussianBlur(_keep.astype(np.float32), (0, 0), 1.3)
        im = Image.merge("RGBA", (*Image.open(src).convert("RGB").split(), Image.fromarray((np.clip((_a - 0.2) / 0.6, 0, 1) * 255).astype(np.uint8))))
    if polys:   # manual silhouette repairs (source-photo coordinates) where subject colour == backdrop colour (white shirts)
        _al = im.getchannel("A"); _d = ImageDraw.Draw(_al)
        for poly in polys: _d.polygon(poly, fill=255)
        im.putalpha(_al)
    im = im.crop(im.getchannel("A").getbbox())
    w = int(im.width * height / im.height)
    # resize colour and alpha separately (RGBA resize premultiplies and zeroes the colour where alpha = 0)
    _rgb = Image.merge("RGB", im.split()[:3]).resize((w, height), Image.LANCZOS)
    _a = im.getchannel("A").resize((w, height), Image.LANCZOS)
    im = Image.merge("RGBA", (*_rgb.split(), _a))
    a = np.asarray(im).astype(np.float32)
    if fill_holes:   # the auto-cutout punched holes / bites where the subject resembled the photo background: restore them from the real photo colours
        import cv2
        al0 = a[..., 3]
        m = (al0 > 40).astype(np.uint8)
        # background colour of the studio backdrop = median of pixels the cutout removed completely
        bgpix = a[..., :3][al0 < 5]
        bgc = np.median(bgpix, axis=0) if len(bgpix) > 500 else np.array([215, 215, 220], np.float32)
        far = (np.abs(a[..., :3] - bgc).max(axis=2) > 15)                  # pixel colour clearly differs from the backdrop
        closed = cv2.morphologyEx(m, cv2.MORPH_CLOSE, cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (41, 41))) > 0
        restore = closed & (m == 0) & far                                   # bites/holes inside the silhouette that are NOT backdrop
        # enclosed holes of any colour, if small (lettering), also restored
        pad = cv2.copyMakeBorder(m, 1, 1, 1, 1, cv2.BORDER_CONSTANT, value=0)
        ff = (1 - pad).copy(); fm = np.zeros((ff.shape[0] + 2, ff.shape[1] + 2), np.uint8)
        cv2.floodFill(ff, fm, (0, 0), 2)
        holes = (ff[1:-1, 1:-1] == 1).astype(np.uint8)
        nh, lh, sth, _ = cv2.connectedComponentsWithStats(holes, connectivity=8)
        for k in range(1, nh):
            if sth[k, cv2.CC_STAT_AREA] < 9000 and sth[k, cv2.CC_STAT_HEIGHT] < 130: restore |= (lh == k)
        a[..., 3] = np.where(restore, 255, a[..., 3])
        m2 = (a[..., 3] > 40).astype(np.uint8)
        inner = cv2.erode(m2, np.ones((9, 9), np.uint8)) > 0                # solidify semi-transparent interior
        a[..., 3] = np.where(inner, 255, a[..., 3])
    rgb, al = a[..., :3], a[..., 3] / 255
    lum = (rgb @ np.array([0.299, 0.587, 0.114], np.float32)) / 255
    lum = np.clip((lum - 0.08) / 0.85, 0, 1) ** 1.05
    tone = INK[0] + (240 - INK[0]) * lum
    out = np.dstack([tone, tone, tone])
    if keep_red:
        ratio = np.minimum(rgb[..., 1], rgb[..., 2]) / np.maximum(rgb[..., 0], 1)   # skin ~0.6-0.8, red cloth <0.4
        redness = np.clip((0.36 - ratio) / 0.10, 0, 1) * (rgb[..., 0] > 60)
        shade = 0.55 + 0.6 * lum
        redc = np.dstack([RED[0] * shade, RED[1] * shade, RED[2] * shade])
        out = out * (1 - redness[..., None]) + np.clip(redc, 0, 255) * redness[..., None]
    sc = screen(w, height, cell)
    if color:
        orig = np.clip((rgb - 128) * 1.05 + 128, 0, 255)
        dots_c = (lum > (1 - sc) * 0.9).astype(np.float32)
        gray_c = np.where(dots_c[..., None] > 0, 246, 20)
        kk = (mix * np.clip((0.70 - lum) / 0.55, 0, 1))[..., None]      # only a hint of print texture, in the shadows
        res = np.dstack([np.clip(orig * (1 - kk) + gray_c * kk, 0, 255), al * 255]).astype(np.uint8)
        return Image.fromarray(res, "RGBA")
    dots = (lum > (1 - sc) * 0.9).astype(np.float32)  # halftone threshold
    gray_ht = np.where(dots[..., None] > 0, 245, 22)
    protect = np.zeros((height, w), np.float32)
    if keep_red:
        protect = (redness > 0.5).astype(np.float32)          # solid red areas: no dots
    if protect_text:
        # clothing (closure of the red areas incl. the white sash lettering) keeps its original, crisp photo colours
        cloth = (ratio < 0.2) & (rgb[..., 0] > 60)
        rm = Image.fromarray((cloth * 255).astype(np.uint8))
        filled = np.asarray(rm.filter(ImageFilter.MaxFilter(61)).filter(ImageFilter.MinFilter(61))) > 127
        keep = np.asarray(Image.fromarray((filled * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(1.0))).astype(np.float32) / 255
        orig = np.clip((rgb - 128) * 1.06 + 128, 0, 255)
        out = out * (1 - keep[..., None]) + orig * keep[..., None]
        protect = np.maximum(protect, keep)
    # soften dots on skin/highlights so faces stay clean: dots only really bite in the shadows
    shadow_w = np.clip((0.75 - lum) / 0.55, 0, 1)
    k = mix * shadow_w * (1 - protect)
    out = out * (1 - k[..., None]) + gray_ht * k[..., None]
    res = np.dstack([np.clip(out, 0, 255), al * 255]).astype(np.uint8)
    return Image.fromarray(res, "RGBA")

def duotone_card(path, width, dark, light, border=16, shadow=True):
    im = Image.open(path).convert("RGB")
    h = int(im.height * width / im.width)
    im = im.resize((width, h), Image.LANCZOS)
    lum = np.asarray(im.convert("L")).astype(np.float32) / 255
    lum = np.clip((lum - 0.05) / 0.9, 0, 1)
    sc = screen(width, h, 5)
    lum = lum * 0.8 + 0.2 * (lum > (1 - sc) * 0.95)
    d = np.array(dark, np.float32); l = np.array(light, np.float32)
    col = d + (l - d) * lum[..., None]
    ph = Image.fromarray(col.astype(np.uint8)).convert("RGBA")
    card = Image.new("RGBA", (width + 2 * border, h + 2 * border + 6), PAPER + (255,))
    card.alpha_composite(ph, (border, border))
    if shadow:
        pad = 50
        sh = Image.new("RGBA", (card.width + 2 * pad, card.height + 2 * pad), (0, 0, 0, 0))
        m = Image.new("L", sh.size, 0); ImageDraw.Draw(m).rectangle((pad, pad + 14, pad + card.width, pad + card.height + 14), fill=110)
        m = m.filter(ImageFilter.GaussianBlur(18))
        sh.putalpha(m); sh.alpha_composite(card, (pad, pad)); sh.info['sh'] = 1
        return sh
    return card

def chip(text, font, fg=(255, 255, 255), bg=INK, padx=18, pady=10):
    w = int(font.getlength(text)) + 2 * padx; h = font.size + 2 * pady
    im = Image.new("RGBA", (w, h), bg + (255,))
    ImageDraw.Draw(im).text((padx, pady - 2), text, font=font, fill=fg)
    return im

def text_img(text, font, fill, stroke=0):
    l, t, r, b = font.getbbox(text)
    im = Image.new("RGBA", (int(r - l) + 8, int(b - t) + 8), (0, 0, 0, 0))
    ImageDraw.Draw(im).text((4 - l, 4 - t), text, font=font, fill=fill)
    return im

def stamp(text, color, font, pad=26, bw=9, rough=True, seed=3):
    tw = int(font.getlength(text)); th = font.size
    w, h = tw + 2 * pad + 20, th + 2 * pad
    im = Image.new("RGBA", (w, h), (0, 0, 0, 0)); d = ImageDraw.Draw(im)
    d.rounded_rectangle((4, 4, w - 5, h - 5), radius=14, fill=PAPER + (245,), outline=color + (255,), width=bw)
    d.text((w // 2, h // 2 + 3), text, font=font, fill=color + (255,), anchor="mm")
    if rough:
        rnd = np.random.RandomState(seed)
        a = np.asarray(im).copy(); n = rnd.rand(h, w)
        noise = Image.fromarray((n * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(1.1))
        n2 = np.asarray(noise).astype(np.float32) / 255
        a[..., 3] = (a[..., 3] * (n2 > 0.17)).astype(np.uint8)
        im = Image.fromarray(a, "RGBA")
    return im

# ---------------------------------------------------------------- assets (built once, inherited by workers)
BG = make_bg()
F_H = F("Anton.ttf", 150); F_H3 = F("Anton.ttf", 136); F_H2 = F("Anton.ttf", 132); F_M = F("SpaceMono-Bold.ttf", 28); F_ST = F("Anton.ttf", 76)
CARD_KEJU = duotone_card(A + "aisle/aisle_keju.png", 900, (14, 22, 96), (226, 232, 255))
CARD_ROTI = duotone_card(A + "aisle/aisle_roti.png", 820, (60, 12, 8), (252, 228, 214))
SPG = cut_halftone(A + "cutouts/spg1.png", 1040, cell=4, mix=0.10, color=True, fill_holes=True, src=R + "assets_zip/prochiz/SPG-1 menyapa.png")
CUST = [cut_halftone(A + "cutouts/cust2.png", 640, keep_red=True, cell=5)]
CHIP_KEJU = chip("RAK KEJU  ·  SUPERMARKET", F_M)
CHIP_ROTI = chip("RAK ROTI TAWAR  ·  SUPERMARKET", F_M, bg=RED)
CHIP_TOP = chip("STRATEGI GERILYA  /  PROCHIZ", F_M, bg=INK)
STAMP_KOMP = stamp("DIKUASAI KOMPETITOR", BLUE, F_ST)
CHIP_SPG = chip("+ SPG PROCHIZ", F_M, bg=RED)

def words_img(words_colors, font, line_h):
    imgs = [(text_img(w, font, c), c) for w, c in words_colors]
    return imgs

def paste(canvas, im, cx, cy, scale=1.0, rot=0.0, alpha=1.0):
    if alpha <= 0.003 or scale <= 0.003: return
    if scale != 1.0:
        im = im.resize((max(2, int(im.width * scale)), max(2, int(im.height * scale))), Image.BICUBIC)
    if rot:
        im = im.rotate(rot, resample=Image.BICUBIC, expand=True)
    if alpha < 1.0:
        a = im.getchannel("A").point(lambda v: int(v * alpha)); im = im.copy(); im.putalpha(a)
    canvas.alpha_composite(im, (int(cx - im.width / 2), int(cy - im.height / 2))) if (cx - im.width / 2 >= 0 and cy - im.height / 2 >= 0) else \
        canvas.paste(im, (int(cx - im.width / 2), int(cy - im.height / 2)), im)

def headline(canvas, lines, t0, x, y, font, step=0.09, dur=0.35, lh=150, t=0, out=None):
    """lines: list of [ (word,color), ... ]; reveal word-by-word (slide up + fade)."""
    i = 0
    for li, line in enumerate(lines):
        cx = x
        for w, c in line:
            im = text_img(w, font, c)
            p = e_out(prog(t, t0 + i * step, t0 + i * step + dur))
            if out is not None: p *= 1 - e_in(prog(t, out + i * 0.025, out + i * 0.025 + 0.2))
            if p > 0.01:
                im2 = im.copy(); a = im2.getchannel("A").point(lambda v: int(v * clamp(p * 1.4))); im2.putalpha(a)
                canvas.alpha_composite(im2, (int(cx), int(y + li * lh + (1 - p) * 70)))
            cx += im.width + 22 - 8
            i += 1

# ---------------------------------------------------------------- scene timeline
T_B = 1.95   # hook part 2 (Prochiz menyerang)
T_C = 3.90   # scene 2

def shake(t, t0, amp=9, dur=0.35):
    p = prog(t, t0, t0 + dur)
    if p <= 0 or p >= 1: return 0, 0
    d = (1 - p) ** 2 * amp
    return int(math.sin(p * 48) * d), int(math.cos(p * 41) * d * 0.7)

def draw_scene2(canvas, t):
    tt = t - T_C
    if tt < 0: return
    # headline
    headline(canvas, [[("WAKTU", INK), ("MASUK", INK), ("KE", INK)], [("SUPERMARKET...", RED)]], T_C + 0.0, 70, 250, F_H3, step=0.08, dur=0.3, lh=150, t=t)
    # store plan, drawn progressively
    ox, oy, pw, ph = 130, 740, 820, 800
    d = ImageDraw.Draw(canvas)
    p = e_io(prog(t, T_C + 0.15, T_C + 0.85))
    pts = [(ox, oy + ph), (ox, oy), (ox + pw, oy), (ox + pw, oy + ph)]
    perim = [(pts[i], pts[i + 1]) for i in range(3)]
    total = sum(math.dist(a, b) for a, b in perim); run = p * total
    for a, b in perim:
        L = math.dist(a, b)
        if run <= 0: break
        f = min(1, run / L)
        d.line((a[0], a[1], a[0] + (b[0] - a[0]) * f, a[1] + (b[1] - a[1]) * f), fill=INK, width=10, joint="curve")
        run -= L
    # aisles (shelves)
    for i in range(5):
        s = e_back(prog(t, T_C + 0.55 + i * 0.07, T_C + 0.85 + i * 0.07))
        if s <= 0.01: continue
        sx = ox + 90 + i * 150
        h0 = int((ph - 330) * clamp(s, 0, 1.08))
        col = BLUE if i == 1 else (RED if i == 3 else (205, 199, 182))
        d.rounded_rectangle((sx, oy + 70, sx + 78, oy + 70 + h0), radius=8, fill=col + (255,), outline=INK + (255,), width=5)
    # labels
    if t > T_C + 0.85:
        a = prog(t, T_C + 0.85, T_C + 1.05)
        c1 = chip("KEJU", F_M, bg=BLUE); c2 = chip("ROTI TAWAR", F_M, bg=RED)
        paste(canvas, c1, ox + 90 + 150 + 39, oy + 40, alpha=a); paste(canvas, c2, ox + 90 + 450 + 39, oy + 40, alpha=a)
    # entrance arrow (red) from the bottom
    pa = e_out(prog(t, T_C + 0.9, T_C + 1.2))
    if pa > 0:
        ax = ox + pw // 2; ay1 = oy + ph + 130; ay0 = ay1 - 170 * pa
        d.line((ax, ay1, ax, ay0), fill=RED + (255,), width=14)
        d.polygon([(ax - 30, ay0 + 8), (ax + 30, ay0 + 8), (ax, ay0 - 40)], fill=RED + (255,))
        paste(canvas, chip("PROCHIZ MASUK", F_M, bg=RED), ax, ay1 + 50, alpha=pa)

def frame(i):
    t = i / FPS
    cv = BG.copy()
    sx, sy = shake(t, 1.04, 11)
    sx2, sy2 = shake(t, T_B + 0.55, 7)
    sx += sx2; sy += sy2
    # ---------------- Phase A : kompetitor menguasai rak keju (0 -> T_B)
    exitA = e_in(prog(t, T_B - 0.12, T_B + 0.18))
    if t < T_B + 0.2:
        ox = -1300 * exitA
        # top chip
        paste(cv, CHIP_TOP, 70 + CHIP_TOP.width / 2 + ox, 190, alpha=e_out(prog(t, 0.0, 0.25)))
        headline(cv, [[("KOMPETITOR", INK)], [("MENGUASAI", INK)], [("RAK", INK), ("KEJU.", BLUE)]], 0.08, 70 + ox, 250, F_H, step=0.1, dur=0.32, lh=150, t=t)
        # card
        ps = e_back(prog(t, 0.35, 0.8), 1.4)
        paste(cv, CARD_KEJU, 560 + ox + sx, 1250 + sy, scale=ps, rot=-3.2, alpha=e_out(prog(t, 0.35, 0.6)))
        paste(cv, CHIP_KEJU, 150 + CHIP_KEJU.width / 2 + ox + sx, 960 + sy, alpha=e_out(prog(t, 0.7, 0.9)))
        # stamp slam
        sp = prog(t, 0.95, 1.12)
        if sp > 0:
            sc = 2.6 - 1.6 * e_out(sp)
            paste(cv, STAMP_KOMP, 560 + ox + sx, 1320 + sy, scale=sc, rot=-9, alpha=clamp(sp * 3))
    # ---------------- Phase B : prochiz menyerang dari rak roti tawar (T_B -> T_C)
    if T_B - 0.05 <= t < T_C + 0.25:
        inB = prog(t, T_B + 0.02, T_B + 0.32)
        outB = e_in(prog(t, T_C - 0.18, T_C + 0.12))
        ox = 1300 * (1 - e_out(inB)) - 1300 * outB
        paste(cv, chip("PROCHIZ  ·  SERANGAN BALIK", F_M, bg=RED), 70 + 170 + 170 + ox - 0, 190, alpha=e_out(prog(t, T_B + 0.1, T_B + 0.3)))
        headline(cv, [[("PROCHIZ", RED)], [("MENYERANG", INK), ("DARI", INK)], [("RAK ROTI", INK)], [("TAWAR!", INK)]], T_B + 0.1, 70 + ox * 0, 235, F_H2, step=0.09, dur=0.3, lh=128, t=t, out=T_C - 0.22)
        # roti card
        pc = e_back(prog(t, T_B + 0.25, T_B + 0.7), 1.3)
        paste(cv, CARD_ROTI, 430 + ox + sx, 1200 + sy, scale=pc * 0.92, rot=2.6, alpha=e_out(prog(t, T_B + 0.25, T_B + 0.5)))
        paste(cv, CHIP_ROTI, 70 + CHIP_ROTI.width / 2 + ox + sx, 975 + sy, alpha=e_out(prog(t, T_B + 0.55, T_B + 0.75)))
        # SPG rises from the bottom
        rs = e_out(prog(t, T_B + 0.45, T_B + 0.95))
        paste(cv, SPG, 790 + ox, 1990 - SPG.height / 2 * (0.2 + 0.8 * rs) - 80 * rs + (1 - rs) * 500, alpha=clamp(rs * 2))
        # target pin with pulse on the bread aisle (reference: red pin)
        lp = e_back(prog(t, T_B + 0.8, T_B + 1.05), 2.2)
        if lp > 0:
            tx, ty = 430 + int(ox), 1215
            d = ImageDraw.Draw(cv)
            r0 = int(26 * clamp(lp, 0, 1.2))
            if t > T_B + 1.05:
                pr = (t - (T_B + 1.05)) % 0.9 / 0.9
                rr = 26 + 80 * pr
                ring = Image.new("RGBA", cv.size, (0, 0, 0, 0)); ImageDraw.Draw(ring).ellipse((tx - rr, ty - rr, tx + rr, ty + rr), outline=RED + (int(220 * (1 - pr)),), width=6)
                cv.alpha_composite(ring)
            d.ellipse((tx - r0, ty - r0, tx + r0, ty + r0), fill=RED + (255,), outline=PAPER + (255,), width=6)
    # ---------------- Scene 2
    draw_scene2(cv, t)
    return cv.convert("RGB")

def _work(i):
    return i, frame(i).tobytes()

if __name__ == "__main__":
    mode = sys.argv[1]
    if mode == "preview":
        ts = [float(x) for x in sys.argv[2:]]
        tiles = [frame(int(t * FPS)).resize((360, 640)) for t in ts]
        cols = min(len(tiles), 6); rows = (len(tiles) + cols - 1) // cols
        sheet = Image.new("RGB", (360 * cols, 640 * rows), (0, 0, 0))
        for k, im in enumerate(tiles): sheet.paste(im, ((k % cols) * 360, (k // cols) * 640))
        sheet.save(R + "prochiz_test/preview.png")
    else:
        import multiprocessing as mp
        out = sys.argv[2]; n = int(float(sys.argv[3]) * FPS)
        enc = subprocess.Popen(["ffmpeg", "-v", "error", "-y", "-f", "rawvideo", "-pix_fmt", "rgb24", "-s", f"{W}x{H}", "-r", str(FPS), "-i", "-",
                                "-i", A + "vo.mp3", "-t", str(n / FPS), "-af", f"afade=t=out:st={n / FPS - 0.2}:d=0.2",
                                "-map", "0:v", "-map", "1:a", "-c:v", "libx264", "-crf", "16", "-preset", "medium", "-pix_fmt", "yuv420p",
                                "-c:a", "aac", "-b:a", "192k", out], stdin=subprocess.PIPE)
        with mp.get_context("fork").Pool(max(1, os.cpu_count() - 0)) as pool:
            for i, b in pool.imap(_work, range(n), chunksize=2):
                enc.stdin.write(b)
        enc.stdin.close(); enc.wait(); print("done", n)
