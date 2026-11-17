"""Prochiz key-visual v3: varied backgrounds, camera moves, wipe transitions. Reuses scenes/assets from full.py."""
import sys, os, math, subprocess
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import numpy as np
from PIL import Image, ImageDraw, ImageFont, ImageFilter
import full as FU
from full import *          # W,H,FPS,SL,SR,ST,SB,CX, helpers, assets
from render import cut_halftone as _cut

DKINK = (244, 240, 228)        # "ink" used for text/outlines on dark backgrounds
LBLUE = (118, 138, 255)
REDBG = (208, 44, 34); BLUEBG = (46, 64, 232); INKBG = (20, 20, 28)

# ------------------------------------------------------------------ extra assets
CROWD2 = _cut(A + "cutouts/crowd.png", 880, cell=5)
CROWD2 = fade_bottom(CROWD2.crop((0, 0, CROWD2.width, int(CROWD2.height * 0.70))), 140)
SPG1_L = _cut(A + "cutouts/spg1.png", 900, cell=4, mix=0.10, color=True, fill_holes=True, src=SRC + "SPG-1 menyapa.png")
SPG1_L = fade_bottom(SPG1_L.crop((0, 0, SPG1_L.width, int(SPG1_L.height * 0.80))), 120)
SPG3_L = fade_bottom(_cut(A + "cutouts/spg3.png", 900, cell=4, mix=0.10, color=True, fill_holes=True, src=SRC + "SPG-3 setengah badan.png"), 110)
CUST2_L = _cut(A + "cutouts/cust2.png", 900, cell=5, fill_holes=True, src=SRC + "CUST-2 pegang roti.png")

# ------------------------------------------------------------------ backgrounds (full bleed, static; camera animates them)
def cross_bg(col, dot, step=108):
    im = Image.new("RGBA", (W, H), col + (255,)); d = ImageDraw.Draw(im)
    for gx in range(step // 2, W, step):
        for gy in range(step // 2, H, step):
            d.line((gx - 9, gy, gx + 9, gy), fill=dot, width=2); d.line((gx, gy - 9, gx, gy + 9), fill=dot, width=2)
    return im

def photo_bg(path, dark, light):
    im = Image.open(path).convert("RGB"); s = H / im.height
    im = im.resize((int(im.width * s), H), Image.LANCZOS); x0 = (im.width - W) // 2; im = im.crop((x0, 0, x0 + W, H))
    lum = np.asarray(im.convert("L")).astype(np.float32) / 255
    col = np.array(dark, np.float32) + (np.array(light, np.float32) - np.array(dark, np.float32)) * lum[..., None]
    g = np.linspace(0, 1, H)[:, None]; shade = np.clip(0.35 + 0.55 * np.abs(g - 0.5) * 2, 0, 0.85)    # darker at top and bottom so text is legible
    col = col * (1 - shade[..., None] * 0.8)
    return Image.fromarray(np.clip(col, 0, 255).astype(np.uint8)).convert("RGBA")

def split_bg():
    im = Image.new("RGBA", (W, H), CREAM + (255,)); d = ImageDraw.Draw(im)
    d.polygon([(560, 0), (W, 0), (W, H), (500, H)], fill=GOLD + (255,)); d.line((560, 0, 500, H), fill=INK + (255,), width=8)
    for gx in range(54, W, 108):
        for gy in range(54, H, 108):
            d.line((gx - 8, gy, gx + 8, gy), fill=(110, 104, 88, 70), width=2); d.line((gx, gy - 8, gx, gy + 8), fill=(110, 104, 88, 70), width=2)
    return im

BGS = {"ivory": BG, "red": cross_bg(REDBG, (255, 255, 255, 38)), "blue": cross_bg(BLUEBG, (255, 255, 255, 40)), "ink": cross_bg(INKBG, (255, 255, 255, 30)),
       "navy": END_BG, "roti": photo_bg(A + "aisle/aisle_roti.png", (30, 8, 6), (255, 214, 190)), "split": split_bg()}

# ------------------------------------------------------------------ dark palette wrapper (re-uses the original scene code)
_orig = {"head_chip": FU.head_chip, "mk_chip": FU.mk_chip}
def _dk_head(layer, text, t, bg=None, t0=0.0):
    c = FU.mk_chip(text, 30, fg=INK if bg is None else (255, 255, 255), bg=(255, 255, 255) if bg is None else bg)
    p = e_out(prog(t, t0, t0 + 0.25)); paste(layer, c, SL + c.width / 2 - (1 - p) * 40, ST + c.height / 2, alpha=p)
def _dk_chip(text, size=28, fg=(255, 255, 255), bg=INK):
    if bg == DKINK: return _orig["mk_chip"](text, size, fg=(18, 18, 18), bg=bg)
    return _orig["mk_chip"](text, size, fg=fg, bg=bg)

def dark(fn):
    def f(L, t, dur):
        old = (FU.INK, FU.BLUE, FU.head_chip, FU.mk_chip)
        FU.INK, FU.BLUE, FU.head_chip, FU.mk_chip = DKINK, LBLUE, _dk_head, _dk_chip
        try: fn(L, t, dur)
        finally: FU.INK, FU.BLUE, FU.head_chip, FU.mk_chip = old
    return f

# ------------------------------------------------------------------ redesigned scenes
def circle(L, cx, cy, r, col, t, t0, dur=0.35):
    p = e_out(prog(t, t0, t0 + dur)); rr = int(r * p)
    if rr > 2: ImageDraw.Draw(L).ellipse((cx - rr, cy - rr, cx + rr, cy + rr), fill=col + (255,))

def n_1b(L, t, dur):                         # red background, big paper disc behind Prochiz SPG
    FU.head_chip(L, "SERANGAN BALIK", t, bg=INK)
    title(L, [[("PROCHIZ", PAPER)], [("MENYERANG", INK), ("DARI", INK)], [("RAK", INK), ("ROTI", INK), ("TAWAR!", INK)]], t, size=122, t0=0.05)
    circle(L, 620, 1130, 316, PAPER, t, 0.25)
    sx, sy = shake(t, 0.6, 7)
    rs = e_out(prog(t, 0.4, 0.95))
    paste(L, SPG1_L, 640, 1540 - SPG1_L.height / 2 + (1 - rs) * 500, alpha=clamp(rs * 2))
    pc = e_back(prog(t, 0.25, 0.7), 1.3)
    paste(L, CARD_ROTI, 335 + sx, 1330 + sy, scale=pc * 0.78, rot=-5, alpha=e_out(prog(t, 0.25, 0.5)))
    dot(L, 335, 1330, t, 0.9, col=RED)

def n_3a(L, t, dur):                         # dark; the red PROCHIZ box slots in last
    dark(s_3a)(L, t, dur)

def n_4(L, t, dur):                          # blue background, huge crowd
    FU.head_chip(L, "RAK KEJU", t, bg=INK)
    title(L, [[("BEREBUT", PAPER), ("PERHATIAN", PAPER)], [("DI", PAPER), ("RAK", PAPER), ("KEJU", GOLD)]], t, size=128)
    sx, sy = shake(t, 0.95, 9)
    rs = e_out(prog(t, 0.2, 0.8))
    paste(L, CROWD2, 516 + (1 - rs) * 520, 1540 - CROWD2.height / 2 + 4, alpha=clamp(rs * 2))
    sp = prog(t, 0.9, 1.05)
    if sp > 0: paste(L, STAMP_B, 480 + sx, 1190 + sy, scale=2.4 - 1.4 * e_out(sp), rot=-7, alpha=clamp(sp * 3))

def n_5(L, t, dur):                          # dark, big type, route labels
    dark(s_5)(L, t, dur)

def n_6(L, t, dur):                          # full-bleed bread aisle photo, big SPG
    FU.head_chip(L, "LORONG ROTI TAWAR", t, bg=RED)
    title(L, [[("SPG", RED), ("DI", PAPER), ("LORONG", PAPER)], [("ROTI", PAPER), ("TAWAR", PAPER)]], t, size=128)
    rs = e_out(prog(t, 0.2, 0.8))
    paste(L, SPG1_L, 560 + (1 - rs) * 420, 1540 - SPG1_L.height / 2 + 4, alpha=clamp(rs * 2))
    dot(L, 250, 1200, t, 0.8, r=30)
    c = _orig["mk_chip"]("TEMPAT CUSTOMER CARI ROTI", 28, bg=RED)
    paste(L, c, SL + c.width / 2, 1470, alpha=prog(t, 1.1, 1.3))

def n_7(L, t, dur):
    circle(L, 640, 1140, 312, GOLD, t, 0.1, 0.4)
    FU.s_7(L, t, dur)

def n_8(L, t, dur): FU.s_8(L, t, dur)

def n_10(L, t, dur): dark(s_10)(L, t, dur)

def n_11a(L, t, dur):                        # red, huge SPG
    FU.head_chip(L, "STRATEGI GERILYA", t, bg=INK)
    title(L, [[("INILAH", PAPER)], [("STRATEGI", INK)], [("GERILYA", PAPER)]], t, size=130)
    circle(L, 610, 1150, 330, PAPER, t, 0.2)
    rs = e_out(prog(t, 0.25, 0.85)); paste(L, SPG3_L, 640, 1540 - SPG3_L.height / 2 + (1 - rs) * 360, alpha=clamp(rs * 2))
    sp = prog(t, 0.95, 1.1)
    if sp > 0:
        sx, sy = shake(t, 0.95, 9); paste(L, STAMP_C, 400 + sx, 1250 + sy, scale=2.4 - 1.4 * e_out(sp), rot=-7, alpha=clamp(sp * 3))

def n_11b(L, t, dur):
    circle(L, 620, 1150, 320, RED, t, 0.1, 0.4)
    FU.s_11b(L, t, dur)

def n_11c(L, t, dur): dark(s_11c)(L, t, dur)

# ------------------------------------------------------------------ timeline: (t0, t1, draw, bg, camera, transition-out)
# camera = (zoom0, zoom1, drift_x px, drift_y px, rot0 deg, rot1 deg); transition = (kind, arg)
SC = [
    (0.00,  1.96, FU.s_1a, "ivory", (1.00, 1.035, 0, 0, 0, 0),       ("wipe", "lr")),
    (1.96,  4.24, n_1b,    "red",   (1.04, 1.00, 0, 0, 0, 0),        ("wipe", "tb")),
    (4.24,  7.15, FU.s_2,  "ivory", (1.00, 1.03, -10, 0, 0, 0),      ("wipe", "circle")),
    (7.15,  9.50, n_3a,    "ink",   (1.035, 1.00, 0, 0, 0, 0),       ("wipe", "bt")),
    (9.50, 12.30, FU.s_3b, "ivory", (1.00, 1.03, 12, 0, 0, 0),       ("flash", None)),
    (12.30, 15.10, n_4,    "blue",  (1.00, 1.04, 0, 0, -0.5, 0.4),   ("wipe", "diag")),
    (15.10, 17.40, n_5,    "ink",   (1.03, 1.00, 0, -10, 0, 0),      ("wipe", "lr")),
    (17.40, 20.10, n_6,    "roti",  (1.00, 1.04, 0, 0, 0, 0),        ("wipe", "circle")),
    (20.10, 23.18, n_7,    "ivory", (1.04, 1.00, 0, 0, 0.5, 0),      ("wipe", "tb")),
    (23.18, 26.80, n_8,    "split", (1.00, 1.03, 0, 0, 0, 0),        ("wipe", "rl")),
    (26.80, 31.78, FU.s_9, "ivory", (1.00, 1.035, 0, 0, 0, 0),       ("flash", None)),
    (31.78, 35.72, n_10,   "navy",  (1.035, 1.00, 0, 0, 0, 0),       ("wipe", "diag")),
    (35.72, 38.33, n_11a,  "red",   (1.00, 1.04, 0, 0, 0.4, -0.3),   ("wipe", "lr")),
    (38.33, 39.95, n_11b,  "ivory", (1.03, 1.00, 0, 0, 0, 0),        ("wipe", "circle")),
    (39.95, 41.72, n_11c,  "ink",   (1.00, 1.03, 0, 0, 0, 0),        None),
]
TOTAL = 41.72; WIPE = 0.24

def _mask(kind, p):
    """0..1 float mask: region already showing the NEXT scene's background."""
    yy, xx = np.mgrid[0:H, 0:W].astype(np.float32)
    e = e_io(p)
    if kind == "lr": f = xx / W; edge = e * 1.12 - 0.06
    elif kind == "rl": f = 1 - xx / W; edge = e * 1.12 - 0.06
    elif kind == "tb": f = yy / H; edge = e * 1.08 - 0.04
    elif kind == "bt": f = 1 - yy / H; edge = e * 1.08 - 0.04
    elif kind == "diag": f = (xx / W + yy / H) / 2; edge = e * 1.1 - 0.05
    else: f = np.hypot(xx - W * 0.5, yy - H * 0.52) / np.hypot(W * 0.5, H * 0.52); edge = e * 1.05 - 0.02
    return np.clip((edge - f) / 0.04, 0, 1)

def _cam(img, cam, u):
    z0, z1, dx, dy, r0, r1 = cam
    z = z0 + (z1 - z0) * u; ang = math.radians(r0 + (r1 - r0) * u)
    if z == 1.0 and not ang and not dx and not dy: return img
    cx, cy = W / 2 + dx * u, H / 2 + dy * u
    c, s = math.cos(ang) / z, math.sin(ang) / z
    return img.transform(img.size, Image.AFFINE, (c, -s, W / 2 - c * cx + s * cy + (cx - W / 2), s, c, H / 2 - s * cx - c * cy + (cy - H / 2)), Image.BICUBIC)

def frame2(i):
    t = i / FPS
    k = next((q for q, s in enumerate(SC) if s[0] <= t < s[1]), len(SC) - 1)
    t0, t1, fn, bgk, cam, trans = SC[k]; tl = t - t0; dur = t1 - t0
    L = Image.new("RGBA", (W, H), (0, 0, 0, 0)); fn(L, tl, dur)
    base = BGS[bgk].copy()
    inwin = trans is not None and t >= t1 - WIPE
    if inwin:
        p = clamp((t - (t1 - WIPE)) / WIPE)
        kind, arg = trans
        if kind == "wipe":
            nbg = BGS[SC[k + 1][3]]
            m = _mask(arg, p)
            # current scene's content fades while the next background sweeps over it
            a = L.getchannel("A").point(lambda v: int(v * (1 - e_in(p)))); L.putalpha(a)
            base.alpha_composite(L); L = None
            nb = np.asarray(nbg).astype(np.float32); cb = np.asarray(base).astype(np.float32)
            base = Image.fromarray((cb * (1 - m[..., None]) + nb * m[..., None]).astype(np.uint8), "RGBA")
        elif kind == "flash":
            a = L.getchannel("A").point(lambda v: int(v * (1 - e_in(p)))); L.putalpha(a)
            base.alpha_composite(L); L = None
            fl = Image.new("RGBA", (W, H), (255, 255, 255, int(255 * clamp((p - 0.55) / 0.45) ** 2)))
            base.alpha_composite(fl)
    if L is not None: base.alpha_composite(L)
    # first frames after a flash: quick white decay
    if k > 0 and SC[k - 1][5] and SC[k - 1][5][0] == "flash" and tl < 0.14:
        base.alpha_composite(Image.new("RGBA", (W, H), (255, 255, 255, int(255 * (1 - tl / 0.14)))))
    u = clamp(tl / dur)
    base = _cam(base, cam, u)
    if t > TOTAL - 0.25: pass
    return base.convert("RGB"), (L if L is not None else Image.new("RGBA", (W, H), (0, 0, 0, 0)))

def _work2(i): return i, frame2(i)[0].tobytes()

if __name__ == "__main__":
    mode = sys.argv[1]
    if mode == "preview":
        ts = [float(x) for x in sys.argv[2:]]; tiles = []
        for t in ts:
            im = frame2(int(t * FPS))[0].resize((360, 640)); d = ImageDraw.Draw(im)
            d.rectangle((SL / 3, ST / 3, SR / 3, SB / 3), outline=(0, 160, 255), width=1); tiles.append(im)
        cols = min(len(tiles), 6); rows = (len(tiles) + cols - 1) // cols
        sheet = Image.new("RGB", (360 * cols, 640 * rows), (0, 0, 0))
        for q, im in enumerate(tiles): sheet.paste(im, ((q % cols) * 360, (q // cols) * 640))
        sheet.save(R + "prochiz_test/full2_preview.png")
    elif mode == "safe":
        bad = 0
        for s in SC:
            t0, t1 = s[0], s[1]
            for tt in np.linspace(min(t0 + 1.6, t1 - 0.5), t1 - 0.3, 4):
                k = next(q for q, x in enumerate(SC) if x[0] <= tt < x[1]); t_, _, fn, *_ = SC[k]
                L = Image.new("RGBA", (W, H), (0, 0, 0, 0)); fn(L, tt - t_, SC[k][1] - t_)
                bb = L.getchannel("A").point(lambda v: 255 if v > 125 else 0).getbbox()
                if bb and (bb[0] < SL - 6 or bb[2] > SR + 6 or bb[1] < ST - 6 or bb[3] > SB + 6):
                    bad += 1; print(f"t={tt:5.2f} {fn.__name__}: bbox={bb}")
        print("violations:", bad)
    else:
        import multiprocessing as mp
        out = sys.argv[2]; n = int(TOTAL * FPS)
        enc = subprocess.Popen(["ffmpeg", "-v", "error", "-y", "-f", "rawvideo", "-pix_fmt", "rgb24", "-s", f"{W}x{H}", "-r", str(FPS), "-i", "-",
                                "-i", A + "vo.mp3", "-t", f"{TOTAL:.2f}", "-map", "0:v", "-map", "1:a", "-c:v", "libx264", "-crf", "16", "-preset", "medium",
                                "-pix_fmt", "yuv420p", "-c:a", "aac", "-b:a", "192k", out], stdin=subprocess.PIPE)
        with mp.get_context("fork").Pool(os.cpu_count()) as pool:
            for i, b in pool.imap(_work2, range(n), chunksize=3): enc.stdin.write(b)
        enc.stdin.close(); enc.wait(); print("done", n)
