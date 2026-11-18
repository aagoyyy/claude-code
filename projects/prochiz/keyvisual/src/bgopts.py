"""Background options for v8: same two scenes (2 and 10) composited over six calmer backgrounds."""
import sys, os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import numpy as np
from PIL import Image, ImageDraw, ImageFont, ImageFilter
import board6 as B6
from board6 import W, H, R

BEIGE = (229, 224, 209); CREAM = (255, 250, 231)
def flat(c): return Image.new("RGBA", (W, H), c + (255,))

def plus_sparse():
    im = flat(BEIGE); d = ImageDraw.Draw(im)
    for gx in range(108, W, 216):
        for gy in range(108, H, 216): d.line((gx - 8, gy, gx + 8, gy), fill=(90, 84, 66, 70), width=2); d.line((gx, gy - 8, gx, gy + 8), fill=(90, 84, 66, 70), width=2)
    return im

def grid_faint():
    im = flat(BEIGE); d = ImageDraw.Draw(im)
    for x in range(0, W, 72): d.line((x, 0, x, H), fill=(120, 112, 90, 14), width=1)
    for y in range(0, H, 72): d.line((0, y, W, y), fill=(120, 112, 90, 14), width=1)
    return im

def dots():
    im = flat(BEIGE); d = ImageDraw.Draw(im)
    for gx in range(54, W, 54):
        for gy in range(54, H, 54): d.ellipse((gx - 2, gy - 2, gx + 2, gy + 2), fill=(100, 94, 76, 60))
    return im

def paper():
    rng = np.random.RandomState(3); n = rng.randn(H, W).astype(np.float32); n = np.asarray(Image.fromarray(((n - n.min()) / (n.max() - n.min()) * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(0.8))).astype(np.float32) / 255 - 0.5
    yy, xx = np.mgrid[0:H, 0:W].astype(np.float32); v = ((xx - W / 2) / (W / 1.2)) ** 2 + ((yy - H / 2) / (H / 1.2)) ** 2
    base = np.array(BEIGE, np.float32)[None, None, :] * (1 - 0.06 * v[..., None]) + n[..., None] * 14
    return Image.fromarray(np.clip(base, 0, 255).astype(np.uint8)).convert("RGBA")

OPTS = [("A  Polos beige", flat(BEIGE)), ("B  Beige + plus jarang", plus_sparse()), ("C  Grid sangat samar", grid_faint()),
        ("D  Krem brand polos", flat(CREAM)), ("E  Kertas halus", paper()), ("F  Titik-titik samar", dots())]

def layer(fn):
    L = Image.new("RGBA", (W, H), (0, 0, 0, 0)); fn(L); return L

if __name__ == "__main__":
    scenes = [dict(B6.SC)[2], dict(B6.SC)[10]]; Ls = [layer(f) for f in scenes]
    PW, PH = 360, 640; gap = 14; head = 44
    sheet = Image.new("RGB", (6 * (PW + gap) + gap, 2 * (PH + gap) + gap + head), (28, 28, 32)); d = ImageDraw.Draw(sheet)
    hf = ImageFont.truetype("/usr/share/fonts/opentype/inter/Inter-Bold.otf", 22)
    os.makedirs(R + "prochiz_test", exist_ok=True)
    for c, (name, bgi) in enumerate(OPTS):
        x = gap + c * (PW + gap); d.text((x, 10), name, font=hf, fill=(255, 210, 90))
        for r, L in enumerate(Ls):
            im = bgi.copy(); im.alpha_composite(L); full = im.convert("RGB")
            if r == 0: full.save(R + f"prochiz_test/bg_{name[0]}_s02.png")
            sheet.paste(full.resize((PW, PH), Image.LANCZOS), (x, head + gap + r * (PH + gap)))
    sheet.save(R + "prochiz_test/bg_options.png"); print(sheet.size)
