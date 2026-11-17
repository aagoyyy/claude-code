"""Prototype: scenes 1-2 re-built in the reference's visual language (one beige world, mono subjects + one red accent, crafted props, micro labels, plumb line)."""
import sys, os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import numpy as np
from PIL import Image, ImageDraw, ImageFont, ImageFilter
import board5 as b5
from board5 import *
from render import screen
import cv2

BEIGE = (229, 224, 209); RED = (214, 52, 38)          # reference-like beige + one punchy red
INKK = (22, 22, 22)

def bg():
    im = Image.new("RGBA", (W, H), BEIGE + (255,)); d = ImageDraw.Draw(im)
    for x in range(0, W, 36): d.line((x, 0, x, H), fill=(120, 112, 90, 11), width=1)         # fine graph grid
    for y in range(0, H, 36): d.line((0, y, W, y), fill=(120, 112, 90, 11), width=1)
    for gx in range(54, W, 108):                                                              # plus marks
        for gy in range(54, H, 108):
            d.line((gx - 8, gy, gx + 8, gy), fill=(90, 84, 66, 95), width=2); d.line((gx, gy - 8, gx, gy + 8), fill=(90, 84, 66, 95), width=2)
    return im

def an(size): return ImageFont.truetype(FONT + "Anton.ttf", size)

def label(text, size=24, fg=(255, 255, 255), bg_=INKK, track=2.0, pad=(14, 8)):
    f = an(size); w = int(sum(f.getlength(c) + track for c in text) + 2 * pad[0]); h = size + 2 * pad[1]
    im = Image.new("RGBA", (w, h), bg_ + (255,)); d = ImageDraw.Draw(im); x = pad[0]
    for c in text: d.text((x, pad[1] - 3), c, font=f, fill=fg + (255,)); x += f.getlength(c) + track
    return im

def hairline_card(w, h, border=RED, double=False, fill=(250, 247, 240)):
    im = Image.new("RGBA", (w, h), fill + (255,)); d = ImageDraw.Draw(im); d.rectangle((0, 0, w - 1, h - 1), outline=border + (255,), width=3)
    if double: d.rectangle((9, 9, w - 10, h - 10), outline=border + (255,), width=1)
    return im

def soft_shadow(im, blur=10, dy=8, alpha=70, pad=28):
    out = Image.new("RGBA", (im.width + 2 * pad, im.height + 2 * pad), (0, 0, 0, 0))
    m = Image.new("L", out.size, 0); m.paste(im.getchannel("A").point(lambda v: int(v * alpha / 255)), (pad, pad + dy))
    out.putalpha(m.filter(ImageFilter.GaussianBlur(blur))); out.alpha_composite(im, (pad, pad)); return out

def mono_halftone(img, cell=5, mix=0.4, contrast=1.25):
    g = np.asarray(img.convert("L")).astype(np.float32) / 255; g = np.clip((g - 0.5) * contrast + 0.5, 0, 1)
    sc = screen(g.shape[1], g.shape[0], cell); dots = (g > (1 - sc) * 0.95).astype(np.float32)
    o = (g * (1 - mix) + dots * mix) * 235 + 12
    return Image.fromarray(np.dstack([o, o, o]).astype(np.uint8)).convert("RGBA")

def selective_red(im, cell=4):
    """Mono halftone everywhere, only the red clothing keeps colour (one accent, like the reference)."""
    a = np.asarray(im).astype(np.float32); rgb = a[..., :3]; al = a[..., 3:4]
    ratio = np.minimum(rgb[..., 1], rgb[..., 2]) / np.maximum(rgb[..., 0], 1); m = np.clip((0.42 - ratio) / 0.10, 0, 1)[..., None] * (rgb[..., 0:1] > 60)
    g = rgb @ np.array([0.299, 0.587, 0.114], np.float32); g = np.clip((g / 255 - 0.5) * 1.22 + 0.5, 0, 1)
    sc = screen(g.shape[1], g.shape[0], cell); dots = (g > (1 - sc) * 0.95).astype(np.float32); mono = (g * 0.62 + dots * 0.38) * 232 + 14
    mono = np.dstack([mono, mono, mono]); out = mono * (1 - m) + (rgb * 1.02) * m
    return Image.fromarray(np.dstack([np.clip(out, 0, 255), al[..., 0]]).astype(np.uint8), "RGBA")

def title(L, lines, x, y, size, lead=0.94):
    f = an(size); cy = y
    for ln_ in lines:
        cx = x
        for w_, c in ln_:
            L_ = ImageDraw.Draw(L); L_.text((cx, cy), w_, font=f, fill=c + (255,)); cx += f.getlength(w_ + " ")
        cy += size * lead
    return cy

def plumb(L, x, y0, y1, dot=True, r=11):
    d = ImageDraw.Draw(L); d.line((x, y0, x, y1), fill=RED + (255,), width=4)
    if dot:
        d.ellipse((x - r - 12, y1 - r - 12, x + r + 12, y1 + r + 12), outline=RED + (255,), width=3); d.ellipse((x - r, y1 - r, x + r, y1 + r), fill=RED + (255,), outline=(255, 255, 255, 255), width=3)

def tag_card(text):
    im = hairline_card(96, 128, border=(40, 40, 40)); d = ImageDraw.Draw(im); d.rectangle((30, 20, 66, 56), fill=RED + (255,)); d.text((48, 98), text, font=an(18), fill=INKK + (255,), anchor="mm")
    return im

def frame1():
    base = bg(); L = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    title(L, [[("KOMPETITOR", INKK)], [("MENGUASAI", INKK)], [("RAK", INKK), ("KEJU.", RED)]], 90, 290, 124, 0.9)
    plumb(L, 230, 250, 1010, True)
    crop = WALL.crop((294, 112, 1366, 912)); mh = mono_halftone(crop.resize((860, 641), Image.LANCZOS), 5, 0.22, 1.08)
    d = ImageDraw.Draw(mh); sx, sy = int(536 * 860 / 1072), int(400 * 860 / 1072)
    d.rectangle((sx - 78, sy - 62, sx + 78, sy + 62), outline=RED + (255,), width=6)
    card = hairline_card(mh.width + 24, mh.height + 24, border=(40, 40, 40), fill=(250, 247, 240)); card.alpha_composite(mh, (12, 12))
    cp = soft_shadow(card.rotate(-2, resample=Image.BICUBIC, expand=True)); L.alpha_composite(cp, (int(CX - cp.width / 2) + 10, 800))
    L.alpha_composite(label("SLOT KOSONG DI RAK KOMPETITOR", 26, bg_=INKK), (SL + 30, 745))
    for i, (t, y) in enumerate((("BRAND A", 420), ("BRAND B", 560), ("BRAND C", 700))):
        pass
    st = label("DIKUASAI KOMPETITOR", 56, fg=RED, bg_=(250, 247, 240), track=3); stn = Image.new("RGBA", (st.width + 24, st.height + 20), (0, 0, 0, 0)); ImageDraw.Draw(stn).rectangle((0, 0, stn.width - 1, stn.height - 1), outline=RED + (255,), width=5); stn.alpha_composite(st, (12, 10))
    stn = stn.rotate(-7, resample=Image.BICUBIC, expand=True); a = stn.getchannel("A").point(lambda v: int(v * 0.82)); stn.putalpha(a); L.alpha_composite(stn, (int(CX - stn.width / 2), 1300))
    base.alpha_composite(L); return base.convert("RGB")

def frame2():
    base = bg(); L = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    title(L, [[("PROCHIZ", RED)], [("MENYERANG DARI", INKK)], [("RAK ROTI TAWAR!", INKK)]], 90, 300, 124, 0.9)
    L.alpha_composite(label("KENAPA RAK ROTI?", 28), (90, 700))
    spg = _hero()
    L.alpha_composite(spg, (int(CX - spg.width / 2) + 20, 1480 - spg.height))
    top = 1480 - spg.height; plumb(L, CX + 20 + 22, 260, top + 58, True, 9)
    for i, (x, y, r_) in enumerate(((120, 880, -5), (116, 1020, 4), (128, 1160, -3), (900, 840, 4), (904, 990, -4), (896, 1140, 3))):
        t = soft_shadow(tag_card("ROTI").rotate(r_, resample=Image.BICUBIC, expand=True), 6, 5, 60, 20); L.alpha_composite(t, (x - t.width // 2, y - t.height // 2))
    nm = label("AGUSTINA  /  CO-FOUNDER PROCHIZ", 26); L.alpha_composite(nm, (int(CX - nm.width / 2) + 20, 1420))
    base.alpha_composite(L); return base.convert("RGB")

_HERO = None
def _hero():
    global _HERO
    if _HERO is None:
        im = b5.cut_halftone(A + "cutouts/spg1.png", 1150, cell=4, mix=0.10, color=True, fill_holes=True, src=SRC + "SPG-1 menyapa.png") if hasattr(b5, "cut_halftone") else None
        im = im.crop((0, 0, im.width, int(im.height * 0.72))); im = selective_red(im)
        a = np.asarray(im).copy(); h = a.shape[0]; ramp = np.clip((h - np.arange(h)) / 60, 0, 1)[:, None]; a[..., 3] = (a[..., 3] * ramp).astype(np.uint8)
        _HERO = Image.fromarray(a, "RGBA")
    return _HERO

if __name__ == "__main__":
    o = R + "prochiz_test/"; os.makedirs(o, exist_ok=True)
    frame1().save(o + "proto_01.png"); frame2().save(o + "proto_02.png"); print("ok")
