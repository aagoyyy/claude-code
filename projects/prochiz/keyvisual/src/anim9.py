"""v8 animation: every element of the board6 layouts is captured separately, then entered softly (fade + rise + settle tilt, no bounce/shake),
timed to the VO word positions (syllable-proportional inside each scene), with slow constant motion so nothing is ever dead still."""
import sys, os, math, re, subprocess
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import numpy as np
from PIL import Image, ImageDraw, ImageFilter
import board6 as B6
import board7 as B7        # v9 layouts (patches B6.an / B6.SW_ for Archivo Black titles)
import board as B
from board6 import bg, W, H, SL, SR, ST, SB, CX, A, R
import proto_ref_vibe as PV

FPS = 30; TOTAL = 41.72
_T = [(0.00, 1.96), (1.96, 4.24), (4.24, 7.15), (7.15, 9.50), (9.50, 12.30), (12.30, 15.10), (15.10, 17.40), (17.40, 20.10),
      (20.10, 23.18), (23.18, 26.80), (26.80, 31.78), (31.78, 35.72), (35.72, 38.33), (38.33, 39.95), (39.95, 41.72)]
VO = [v for _, v, _ in B.SCN]

# ------------------------------------------------------------------ element recorder
REC = {"prev": None, "els": [], "on": False}
def _begin(): REC.update(prev=np.zeros((H, W, 4), np.uint8), els=[], on=True)
def _mark(L, kind):
    if not REC["on"]: return
    arr = np.asarray(L); d = (arr != REC["prev"]).any(-1)
    if not d.any(): return
    ys, xs = np.where(d.any(1))[0], np.where(d.any(0))[0]
    y0, y1, x0, x1 = ys.min(), ys.max() + 1, xs.min(), xs.max() + 1
    crop = arr[y0:y1, x0:x1].copy(); crop[~d[y0:y1, x0:x1]] = 0
    REC["els"].append(dict(img=Image.fromarray(crop, "RGBA"), x=int(x0), y=int(y0), kind=kind)); REC["prev"] = arr.copy()

def _wrap(fn, kind):
    def g(L, *a, **k):
        r = fn(L, *a, **k); _mark(L, kind); return r
    return g
def _ac(L, im, pos):
    L.alpha_composite(im, (int(pos[0]), int(pos[1])))
    kind = getattr(im, "kind", None) or ("fig" if im.height > 520 else ("micro" if im.height < 70 else "card")); _mark(L, kind)
def _ttl(L, lines, y, size=124, x=90, lead=0.92):
    while max(sum(B6.an(size).getlength(w + " ") for w, _ in ln) for ln in lines) > B6.SW_ - 10 and size > 60: size -= 2
    f = B6.an(size); cy = y; d = ImageDraw.Draw(L)
    for ln in lines:
        cx = x
        for w_, c in ln:
            d.text((cx, cy), w_, font=f, fill=c + (255,)); cx += f.getlength(w_ + " "); _mark(L, "title")
        cy += size * lead
    return cy
B6.ttl = _ttl; B6.ac = _ac
B6.place = _wrap(B6.place, "card"); B6.micro = _wrap(B6.micro, "micro"); B6.hang = _wrap(B6.hang, "card"); B6.name_label = _wrap(B6.name_label, "micro")
B6.plumb = _wrap(PV.plumb, "line"); B6.rule = _wrap(B6.rule, "line"); B6.dotnode = _wrap(B6.dotnode, "dot")

# ------------------------------------------------------------------ word timing (syllable-proportional between the scene's VO pauses)
def syl(w):
    w = re.sub(r"[^a-z]", "", w.lower()).replace("ai", "a").replace("au", "a").replace("oi", "o").replace("ng", "n"); return max(1, len(re.findall(r"[aiueo]+", w)))
def word_times(text, dur):
    ws = text.replace("...", " ").split(); sy = [syl(w) for w in ws]; tot = sum(sy); out = []; c = 0
    for s in sy: out.append((0.10 + (c / tot) * (dur - 0.45))); c += s
    return ws, out

def schedule(i, els, dur):
    """entrance start time for each element. titles stagger fast; everything else follows the spoken words."""
    ws, wt = word_times(VO[i], dur); titles = [e for e in els if e["kind"] == "title"]; rest = [e for e in els if e["kind"] != "title"]
    t_title = -0.55 if i == 0 else -0.24          # titles pre-roll so they are already arriving during the push transition
    for k, e in enumerate(titles): e["t"] = t_title + k * 0.085
    last_title = t_title + len(titles) * 0.085
    m = len(rest)
    for j, e in enumerate(rest):
        wi = min(len(ws) - 1, int((j + 0.5) * len(ws) / max(m, 1))); e["t"] = max(wt[wi], last_title + 0.15 + 0.07 * j * 0)
    # keep at least 0.13 s between consecutive non-title entrances, and finish >=0.45 s before the scene ends
    prev = last_title
    for e in rest:
        e["t"] = max(e["t"], prev + 0.13); prev = e["t"]
    over = prev - (dur - 0.5)
    if over > 0 and m:
        for j, e in enumerate(rest): e["t"] = max(0.2 + last_title * 0.5, e["t"] - over * (j + 1) / m)
    return els

def build():
    scenes = []
    for i, (n, fn) in enumerate(B7.SC):
        _begin(); L = Image.new("RGBA", (W, H), (0, 0, 0, 0)); fn(L); REC["on"] = False
        els = schedule(i, REC["els"], _T[i][1] - _T[i][0]); scenes.append(els)
    return scenes

ELS = build()
import bgopts as _BO
BG = _BO.plus_sparse()      # option B: flat beige + sparse plus marks
BG_RED = _BO.red_sparse()   # scene 5

# ------------------------------------------------------------------ animation
def ease(x): x = min(max(x, 0.0), 1.0); return 1 - (1 - x) ** 3
def fade(im, p):
    if p >= 0.999: return im
    r = im.copy(); a = r.getchannel("A").point([int(i * p) for i in range(256)]); r.putalpha(a); return r

def draw_el(cv, e, tl, dur, idx):
    t = tl - e["t"]
    if t < 0: return
    kind = e["kind"]; im = e["img"]; x, y = e["x"], e["y"]
    p = ease(t / {"title": 0.38, "micro": 0.30, "card": 0.50, "fig": 0.60, "line": 0.55, "dot": 0.25, "stamp": 0.24}.get(kind, 0.4))
    ex = 0.0
    if tl > dur - 0.16: ex = ((tl - (dur - 0.16)) / 0.16) ** 2          # soft clear before the next scene (only if not the last scene)
    if kind == "title": dy = (1 - p) * 38
    elif kind == "micro": dy = 0; x = x - (1 - p) * 18
    elif kind == "fig": dy = (1 - p) * 120
    elif kind == "card": dy = (1 - p) * 26
    else: dy = 0
    alpha = p * (1 - ex)
    if kind == "line":                                        # draw the line progressively (top->bottom / left->right)
        if im.height >= im.width: im = im.crop((0, 0, im.width, max(1, int(im.height * p))))
        else: im = im.crop((0, 0, max(1, int(im.width * p)), im.height))
        alpha = 1 - ex
    elif kind == "stamp":
        s = 1.16 - 0.16 * p; im = im.resize((max(2, int(im.width * s)), max(2, int(im.height * s))), Image.BILINEAR); x -= (im.width - e["img"].width) / 2; y -= (im.height - e["img"].height) / 2
    elif kind == "card" and p < 1:
        ang = (1 - p) * (2.6 if idx % 2 else -2.6); w0, h0 = im.size; im = im.rotate(ang, resample=Image.BILINEAR, expand=True); x -= (im.width - w0) / 2; y -= (im.height - h0) / 2
    if kind in ("card", "fig") and p >= 1: y += 2.2 * math.sin((tl + idx) * 2 * math.pi / 3.4)      # slow float so nothing is dead still
    y -= ex * 16
    if alpha <= 0.01: return
    cv.alpha_composite(fade(im, alpha), (int(x), int(y)))

def _cam(img, z0, z1, u, dx=0.0):
    z = z0 + (z1 - z0) * u; c = 1.0 / z; ox = W / 2 - c * (W / 2) + dx * u; oy = H / 2 - c * (H / 2)
    return img.transform(img.size, Image.AFFINE, (c, 0, ox, 0, c, oy), Image.BICUBIC)

CAMS = [(1.0, 1.03, 0), (1.03, 1.0, 0), (1.0, 1.025, -6), (1.025, 1.0, 0), (1.0, 1.03, 6), (1.03, 1.0, 0), (1.0, 1.03, 0), (1.03, 1.0, 0),
        (1.0, 1.03, 0), (1.03, 1.0, 0), (1.0, 1.025, 0), (1.03, 1.0, 0), (1.0, 1.03, 0), (1.03, 1.0, 0), (1.0, 1.02, 0)]

# transition of each cut (into scene j+2): (type, arg)
TR = [("iris", (540, 1110)), ("push", "left"), ("zoom", (400, 1020)), ("iris", (540, 1060)), ("push", "down"), ("shrink", None), ("push", "left"),
      ("zoom", (480, 900)), ("bar", None), ("push", "up"), ("iris", (540, 1055)), ("bar", None), ("push", "left"), ("shrink", None)]
HW = 0.26                                        # half-width of the seamless push window around each cut (s)
def scene_frame(k, tl):
    t0, t1 = _T[k]; dur = t1 - t0
    cv = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    for idx, e in enumerate(ELS[k]): draw_el(cv, e, tl, 99, idx)          # no fade-out: the push carries the scene off-screen
    z0, z1, dx = CAMS[k]; cv = _cam(cv, z0, z1, min(max(tl / dur, 0), 1), dx)
    out = (BG_RED if B7.SCENE_BG.get(k + 1) == "red" else BG).copy(); out.alpha_composite(cv); return out

def _scale_about(img, s, cx, cy, rot=0.0):
    c = math.cos(math.radians(rot)) / s; sn = math.sin(math.radians(rot)) / s
    return img.transform(img.size, Image.AFFINE, (c, -sn, cx - c * cx + sn * cy, sn, c, cy - sn * cx - c * cy), Image.BICUBIC, fillcolor=(0, 0, 0, 0))

def transition(kind, arg, A_, B_, p):
    out = Image.new("RGBA", (W, H))
    if kind == "push":
        if arg == "left":    o = int(round(p * W)); out.paste(A_, (-o, 0)); out.paste(B_, (W - o, 0))
        elif arg == "right": o = int(round(p * W)); out.paste(A_, (o, 0)); out.paste(B_, (o - W, 0))
        elif arg == "up":    o = int(round(p * H)); out.paste(A_, (0, -o)); out.paste(B_, (0, H - o))
        else:                o = int(round(p * H)); out.paste(A_, (0, o)); out.paste(B_, (0, o - H))
    elif kind == "iris":                     # circle opens from a point, thin red ring on its edge
        cx, cy = arg; rmax = math.hypot(max(cx, W - cx), max(cy, H - cy)) + 20; r = rmax * p
        out.paste(A_, (0, 0)); m = Image.new("L", (W, H), 0); ImageDraw.Draw(m).ellipse((cx - r, cy - r, cx + r, cy + r), fill=255)
        out.paste(B_, (0, 0), m)
        if 0.02 < p < 0.98: ImageDraw.Draw(out).ellipse((cx - r, cy - r, cx + r, cy + r), outline=(214, 52, 38, 255), width=10)
    elif kind == "zoom":                     # camera pushes through A at a point, B settles in from slightly smaller
        cx, cy = arg; e = p ** 1.6
        b_ = _scale_about(B_, 0.88 + 0.12 * p, cx, cy); a_ = _scale_about(A_, 1 + 2.4 * e, cx, cy)
        out = Image.new("RGBA", (W, H), (229, 224, 209, 255)); out.alpha_composite(b_)
        k_ = 1 - ease_io((p - 0.5) / 0.32); a_.putalpha(a_.getchannel("A").point(lambda v: int(v * k_))); out.alpha_composite(a_)
    elif kind == "bar":                      # a brand-red band sweeps across like a curtain: covers A, then uncovers B
        out.paste(A_ if p < 0.5 else B_, (0, 0)); d = ImageDraw.Draw(out); sl = 260
        if p < 0.5: x = (p / 0.5) * (W + sl); d.polygon([(-sl, 0), (x, 0), (x - sl, H), (-sl, H)], fill=(166, 47, 47, 255))
        else: x = ((p - 0.5) / 0.5) * (W + sl); d.polygon([(x, 0), (W + sl, 0), (W + sl, H), (x - sl, H)], fill=(166, 47, 47, 255))
    else:                                    # shrink: A becomes a tilted card that drops away, B underneath
        out = B_.copy(); s_ = 1 - 0.62 * p; rot = -9 * p
        a_ = _scale_about(A_, s_, W / 2, H / 2, rot); a_ = a_.transform(a_.size, Image.AFFINE, (1, 0, 0, 0, 1, -int(p * p * 900)), Image.BICUBIC, fillcolor=(0, 0, 0, 0))
        sh = Image.new("RGBA", (W, H), (0, 0, 0, 0)); sh.putalpha(a_.getchannel("A").point(lambda v: int(v * 0.35)).filter(ImageFilter.GaussianBlur(18)))
        out.alpha_composite(sh, (0, 14)); fr = Image.new("RGBA", (W, H), (0, 0, 0, 0))
        if p > 0.03:                         # white card border around the shrinking frame
            box = a_.getchannel("A").point(lambda v: 255 if v > 10 else 0).filter(ImageFilter.MaxFilter(17)); fr.paste((255, 255, 255, 255), (0, 0), box); out.alpha_composite(fr)
        out.alpha_composite(a_)
    return out

def ease_io(x): x = min(max(x, 0.0), 1.0); return x * x * (3 - 2 * x)

def frame8(i):
    t = i / FPS; k = next((q for q, s in enumerate(_T) if s[0] <= t < s[1]), len(_T) - 1)
    for j in range(len(_T) - 1):                                          # inside a push window between scene j and j+1?
        b = _T[j][1]
        if b - HW <= t < b + HW:
            p = ease_io((t - (b - HW)) / (2 * HW)); kind, arg = TR[j]
            A_ = scene_frame(j, t - _T[j][0]); B_ = scene_frame(j + 1, t - _T[j + 1][0])
            out = transition(kind, arg, A_, B_, p)
            if 0.05 < p < 0.95:                                           # light directional blur at speed
                out = out.filter(ImageFilter.BoxBlur(0)) if False else out
            return out.convert("RGB")
    return scene_frame(k, t - _T[k][0]).convert("RGB")

def _work(i): return i, frame8(i).tobytes()

if __name__ == "__main__":
    mode = sys.argv[1]
    if mode == "preview":
        ts = [float(x) for x in sys.argv[2:]]; tiles = []
        for t in ts:
            im = frame8(int(t * FPS)).resize((300, 533)); ImageDraw.Draw(im).text((6, 4), f"{t:.2f}", fill=(255, 0, 0)); tiles.append(im)
        cols = min(len(tiles), 8); rows = (len(tiles) + cols - 1) // cols
        sh = Image.new("RGB", (300 * cols, 533 * rows)); [sh.paste(im, ((q % cols) * 300, (q // cols) * 533)) for q, im in enumerate(tiles)]
        os.makedirs(R + "prochiz_test", exist_ok=True); sh.save(R + "prochiz_test/anim9_preview.png")
    else:
        import multiprocessing as mp
        out = sys.argv[2]; n = int(TOTAL * FPS)
        enc = subprocess.Popen(["ffmpeg", "-v", "error", "-y", "-f", "rawvideo", "-pix_fmt", "rgb24", "-s", f"{W}x{H}", "-r", str(FPS), "-i", "-", "-i", A + "vo.mp3",
                                "-t", f"{TOTAL:.2f}", "-map", "0:v", "-map", "1:a", "-c:v", "libx264", "-crf", "16", "-preset", "medium", "-pix_fmt", "yuv420p", "-c:a", "aac", "-b:a", "192k", out], stdin=subprocess.PIPE)
        with mp.get_context("fork").Pool(os.cpu_count()) as pool:
            for i, b in pool.imap(_work, range(n), chunksize=3): enc.stdin.write(b)
        enc.stdin.close(); enc.wait(); print("done", n)
