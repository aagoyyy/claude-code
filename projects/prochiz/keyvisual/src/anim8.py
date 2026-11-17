"""v8 animation: every element of the board6 layouts is captured separately, then entered softly (fade + rise + settle tilt, no bounce/shake),
timed to the VO word positions (syllable-proportional inside each scene), with slow constant motion so nothing is ever dead still."""
import sys, os, math, re, subprocess
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import numpy as np
from PIL import Image, ImageDraw, ImageFilter
import board6 as B6
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
    t_title = -0.55 if i == 0 else 0.04
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
    for i, (n, fn) in enumerate(B6.SC):
        _begin(); L = Image.new("RGBA", (W, H), (0, 0, 0, 0)); fn(L); REC["on"] = False
        els = schedule(i, REC["els"], _T[i][1] - _T[i][0]); scenes.append(els)
    return scenes

ELS = build()
BG = bg()

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

def frame8(i):
    t = i / FPS; k = next((q for q, s in enumerate(_T) if s[0] <= t < s[1]), len(_T) - 1); t0, t1 = _T[k]; tl = t - t0; dur = t1 - t0
    cv = Image.new("RGBA", (W, H), (0, 0, 0, 0))                  # elements only: the graph-paper background stays static and crisp (zooming it causes moire)
    for idx, e in enumerate(ELS[k]): draw_el(cv, e, tl if k < len(_T) - 1 else min(tl, dur - 0.17), dur if k < len(_T) - 1 else 99, idx)
    z0, z1, dx = CAMS[k]; cv = _cam(cv, z0, z1, min(max(tl / dur, 0), 1), dx)
    out = BG.copy(); out.alpha_composite(cv); return out.convert("RGB")

def _work(i): return i, frame8(i).tobytes()

if __name__ == "__main__":
    mode = sys.argv[1]
    if mode == "preview":
        ts = [float(x) for x in sys.argv[2:]]; tiles = []
        for t in ts:
            im = frame8(int(t * FPS)).resize((300, 533)); ImageDraw.Draw(im).text((6, 4), f"{t:.2f}", fill=(255, 0, 0)); tiles.append(im)
        cols = min(len(tiles), 8); rows = (len(tiles) + cols - 1) // cols
        sh = Image.new("RGB", (300 * cols, 533 * rows)); [sh.paste(im, ((q % cols) * 300, (q // cols) * 533)) for q, im in enumerate(tiles)]
        os.makedirs(R + "prochiz_test", exist_ok=True); sh.save(R + "prochiz_test/anim8_preview.png")
    else:
        import multiprocessing as mp
        out = sys.argv[2]; n = int(TOTAL * FPS)
        enc = subprocess.Popen(["ffmpeg", "-v", "error", "-y", "-f", "rawvideo", "-pix_fmt", "rgb24", "-s", f"{W}x{H}", "-r", str(FPS), "-i", "-", "-i", A + "vo.mp3",
                                "-t", f"{TOTAL:.2f}", "-map", "0:v", "-map", "1:a", "-c:v", "libx264", "-crf", "16", "-preset", "medium", "-pix_fmt", "yuv420p", "-c:a", "aac", "-b:a", "192k", out], stdin=subprocess.PIPE)
        with mp.get_context("fork").Pool(os.cpu_count()) as pool:
            for i, b in pool.imap(_work, range(n), chunksize=3): enc.stdin.write(b)
        enc.stdin.close(); enc.wait(); print("done", n)
