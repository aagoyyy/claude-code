"""Prochiz v4: animate the storyboard layouts (board.py). Every drawing call becomes a staggered entrance."""
import sys, os, math, subprocess, functools
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import numpy as np
from PIL import Image, ImageDraw
import board as B
import full as FU
import full2 as F2
from full import W, H, FPS, SL, SR, ST, SB, CX, BG, INK, RED, BLUE, PAPER, clamp, prog, e_out, e_in, e_io, e_back, A, R, STAMP_A, STAMP_B, STAMP_C

DUR = 0.36
STAMPS = (STAMP_A, STAMP_B, STAMP_C)
S = dict(now=0.0, idx=0, stag=0.2, mode="draw", n=0, stamps=[], base0=0.05)

def nxt():
    i = S["idx"]; S["idx"] += 1; S["n"] += 1
    return S["base0"] + i * S["stag"], i

# ---------------------------------------------------------------- animated replacements of the board's drawing helpers
def a_paste(L, im, cx, cy, scale=1.0, rot=0.0, alpha=1.0):
    s, i = nxt()
    if S["mode"] == "count":
        if any(im is x for x in STAMPS): S["stamps"].append(i)
        return
    t = S["now"]
    if any(im is x for x in STAMPS):                                    # stamp slams in
        p = prog(t, s, s + 0.17)
        if p <= 0: return
        FU.paste(L, im, cx, cy, scale=scale * (2.5 - 1.5 * e_out(p)), rot=rot, alpha=clamp(p * 3) * alpha); return
    p = prog(t, s, s + DUR)
    if p <= 0: return
    h = im.height * scale
    if im.height > 300 and cy + h / 2 >= 1480:                          # figures rise from the bottom edge
        FU.paste(L, im, cx, cy + (1 - e_out(p)) * min(520, h * 0.55), scale=scale, rot=rot, alpha=clamp(p * 2.2) * alpha); return
    bob = 4.0 * math.sin((t - s) * 2 * math.pi / 2.6 + i) if p >= 1 else 0.0           # cards drift gently once landed
    k = 0.62 + 0.38 * e_back(p, 1.7)
    r = rot + (1 - e_out(p)) * (-6 if rot >= 0 else 6)
    FU.paste(L, im, cx, cy + bob, scale=scale * k, rot=r, alpha=clamp(p * 2.4) * alpha)

def a_big(L, lines, x, y, size, **kw):
    s, i = nxt()
    if S["mode"] == "count": return y
    return FU.title(L, lines, S["now"], t0=s, x=x, y=y, size=size, **kw)

def a_head(L, text, t, bg=INK, t0=0.0):
    s, i = nxt()
    if S["mode"] == "count": return
    FU.head_chip(L, text, S["now"], bg=bg, t0=s)

def a_txt(L, text, x, y, size=30, fill=INK, anchor="la", bold=True):
    s, i = nxt()
    if S["mode"] == "count": return
    p = e_out(prog(S["now"], s, s + 0.3))
    if p <= 0.01: return
    tmp = Image.new("RGBA", L.size, (0, 0, 0, 0)); ImageDraw.Draw(tmp).text((x, y + (1 - p) * 30), text, font=B.M(size, bold), fill=fill + (int(255 * p),), anchor=anchor)
    L.alpha_composite(tmp)

def a_dot(L, x, y, r=22, col=RED):
    s, i = nxt()
    if S["mode"] == "count": return
    FU.dot(L, x, y, S["now"], s, r=r, col=col)

def a_arrow(L, p0, p1, *a, **k):
    s, i = nxt()
    if S["mode"] == "count": return
    FU.arrow(L, p0, p1, S["now"], s, 0.35, col=k.get("col", RED), w=k.get("w", 14), head=k.get("head", 34))

def a_ln(L, p0, p1, col=INK, w=6):
    s, i = nxt()
    if S["mode"] == "count": return
    p = e_out(prog(S["now"], s, s + 0.32))
    if p <= 0.01: return
    ImageDraw.Draw(L).line((p0[0], p0[1], p0[0] + (p1[0] - p0[0]) * p, p0[1] + (p1[1] - p0[1]) * p), fill=col + (255,), width=w)

def a_node(L, x, y, col):
    s, i = nxt()
    if S["mode"] == "count": return
    p = e_back(prog(S["now"], s, s + 0.26), 2.0)
    if p <= 0.02: return
    r = int(26 * clamp(p, 0, 1.2)); ImageDraw.Draw(L).ellipse((x - r, y - r, x + r, y + r), fill=col + (255,), outline=PAPER + (255,), width=6)

@functools.lru_cache(maxsize=None)
def _duo(*a): return FU.duotone_card(*a)
_small_cache = {}
def a_small(im, h):
    k = (id(im), h)
    if k not in _small_cache: _small_cache[k] = Image.fromarray(np.asarray(im)).resize((int(im.width * h / im.height), h), Image.LANCZOS)
    return _small_cache[k]

B.paste, B.big, B.head_chip, B.txt, B.dotp, B.arrow, B.ln, B.node = a_paste, a_big, a_head, a_txt, a_dot, a_arrow, a_ln, a_node
B.duotone_card, B.small_cut = _duo, a_small

# ---------------------------------------------------------------- timeline
SCENES = [
    (0.00, 1.96, B.b01), (1.96, 4.24, B.b02), (4.24, 7.15, B.b03), (7.15, 9.50, B.b04), (9.50, 12.30, B.b05),
    (12.30, 15.10, B.b06), (15.10, 17.40, B.b07), (17.40, 20.10, B.b08), (20.10, 23.18, B.b09), (23.18, 26.80, B.b10),
    (26.80, 31.78, B.b11), (31.78, 35.72, B.b12), (35.72, 38.33, B.b13), (38.33, 39.95, B.b14), (39.95, 41.72, B.b15),
]
TOTAL = 41.72; EXITT = 0.14
CAMS = [(1.0, 1.03, 0, 0), (1.03, 1.0, 0, 0), (1.0, 1.025, -8, 0), (1.025, 1.0, 0, 0), (1.0, 1.03, 8, 0), (1.03, 1.0, 0, 0), (1.0, 1.03, 0, 0), (1.03, 1.0, 0, 0),
        (1.0, 1.03, 0, 0), (1.03, 1.0, 0, 0), (1.0, 1.025, 0, 0), (1.03, 1.0, 0, 0), (1.0, 1.03, 0, 0), (1.03, 1.0, 0, 0), (1.0, 1.02, 0, 0)]

def _prep():
    meta = []
    for (t0, t1, fn) in SCENES:
        S.update(idx=0, n=0, stamps=[], mode="count", now=0.0, stag=0.2)
        L = Image.new("RGBA", (W, H), (0, 0, 0, 0)); fn(L)
        n = S["n"]; stag = clamp((t1 - t0 - 0.95) / max(n, 1), 0.10, 0.34)
        meta.append((stag, list(S["stamps"])))
    S["mode"] = "draw"; return meta
META = _prep()

def frame4(i):
    t = i / FPS
    k = next((q for q, s in enumerate(SCENES) if s[0] <= t < s[1]), len(SCENES) - 1)
    t0, t1, fn = SCENES[k]; tl = t - t0; dur = t1 - t0
    stag, stamps = META[k]
    S.update(idx=0, n=0, now=tl, stag=stag, mode="draw")
    L = Image.new("RGBA", (W, H), (0, 0, 0, 0)); fn(L)
    if tl > dur - EXITT and k < len(SCENES) - 1:                                   # quick slide-out before the cut
        p = e_in(clamp((tl - (dur - EXITT)) / EXITT))
        a = L.getchannel("A").point(lambda v: int(v * (1 - p))); L.putalpha(a)
        L = L.transform(L.size, Image.AFFINE, (1, 0, 110 * p, 0, 1, 0))
    base = BG.copy(); base.alpha_composite(L)
    z0, z1, dx, dy = CAMS[k]
    base = F2._cam(base, (z0, z1, dx, dy, 0, 0), clamp(tl / dur))
    sx = sy = 0
    for q in stamps:                                                                # camera shake when a stamp lands
        a_, b_ = FU.shake(tl, S["base0"] + q * stag + 0.17, 12)
        sx += a_; sy += b_
    if sx or sy: base = base.transform(base.size, Image.AFFINE, (1, 0, -sx, 0, 1, -sy))
    return base.convert("RGB"), L

def _work(i): return i, frame4(i)[0].tobytes()

if __name__ == "__main__":
    mode = sys.argv[1]
    if mode == "preview":
        ts = [float(x) for x in sys.argv[2:]]; tiles = []
        for t in ts:
            im = frame4(int(t * FPS))[0].resize((300, 533)); ImageDraw.Draw(im).text((6, 4), f"{t:.2f}", fill=(255, 0, 0)); tiles.append(im)
        cols = min(len(tiles), 8); rows = (len(tiles) + cols - 1) // cols
        sheet = Image.new("RGB", (300 * cols, 533 * rows)); [sheet.paste(im, ((q % cols) * 300, (q // cols) * 533)) for q, im in enumerate(tiles)]
        sheet.save(R + "prochiz_test/anim_preview.png")
    else:
        import multiprocessing as mp
        out = sys.argv[2]; n = int(TOTAL * FPS)
        enc = subprocess.Popen(["ffmpeg", "-v", "error", "-y", "-f", "rawvideo", "-pix_fmt", "rgb24", "-s", f"{W}x{H}", "-r", str(FPS), "-i", "-",
                                "-i", A + "vo.mp3", "-t", f"{TOTAL:.2f}", "-map", "0:v", "-map", "1:a", "-c:v", "libx264", "-crf", "16", "-preset", "medium",
                                "-pix_fmt", "yuv420p", "-c:a", "aac", "-b:a", "192k", out], stdin=subprocess.PIPE)
        with mp.get_context("fork").Pool(os.cpu_count()) as pool:
            for i, b in pool.imap(_work, range(n), chunksize=3): enc.stdin.write(b)
        enc.stdin.close(); enc.wait(); print("done", n)
