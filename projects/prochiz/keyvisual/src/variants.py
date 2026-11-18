"""Scene 2 / 3 alternatives + frame renderer (background B, scene-specific backgrounds)."""
import sys, os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import numpy as np
from PIL import Image, ImageDraw, ImageFilter
import board6 as B6
from board6 import *
import bgopts as BO

# ------------------------------------------------------------------ bread shelf wall (mirror of the competitor cheese wall)
def loaf_img(h):
    im = P_ROTI.copy(); im = im.crop(im.getchannel("A").getbbox()); return im.resize((int(im.width * h / im.height), h), Image.LANCZOS)

def bread_shelf(w, h, rows=3, cols=5, prochiz=(1, 2)):
    """Shelf unit full of white-bread loaves; one slot holds the Prochiz Gold Slices pack (boxed in red)."""
    im = Image.new("RGBA", (w, h), (226, 228, 232, 255)); d = ImageDraw.Draw(im)
    rh = h // rows; lh = int(rh * 0.74); lf = loaf_img(lh); cw = w // cols
    for r in range(rows):
        base = r * rh + rh - 16
        d.rectangle((0, base, w, base + 16), fill=(150, 154, 160, 255)); d.rectangle((0, base + 16, w, base + 20), fill=(110, 114, 120, 255))      # shelf board
        for c in range(cols):
            cx = c * cw + cw // 2
            if (r, c) == prochiz:
                pk = GOLD_P.copy(); pk = pk.resize((int(cw * 0.86), int(cw * 0.86 * pk.height / pk.width)), Image.LANCZOS)
                im.alpha_composite(pk, (cx - pk.width // 2, base - pk.height)); d.rectangle((cx - cw // 2 + 6, base - pk.height - 12, cx + cw // 2 - 6, base + 4), outline=RED + (255,), width=6)
            else:
                im.alpha_composite(lf, (cx - lf.width // 2, base - lf.height + 6))
    return im

# ------------------------------------------------------------------ scene 2 alternatives
def s02a(L):
    """A: shelf wall card (mirrors scene 1) + Agustina big at the right edge."""
    ttl(L, [[("PROCHIZ", RED)], [("MENYERANG DARI", INKK)], [("RAK ROTI TAWAR!", INKK)]], 290, 124)
    place(L, pcard(bread_shelf(620, 580)), 410, 1110, rot=-2)
    sp = agus(1, 1000, 0.72); ac(L, sp, (SR - sp.width - 6, 1480 - sp.height)); dot_only(L, SR - sp.width // 2 - 6, 1480 - sp.height - 6, 9)
    name_label(L, SR - 262, 1420)

def s02b(L):
    """B: wide shelf strip across the screen, Agustina standing in front of it (centre)."""
    ttl(L, [[("PROCHIZ", RED)], [("MENYERANG DARI", INKK)], [("RAK ROTI TAWAR!", INKK)]], 290, 124)
    place(L, pcard(bread_shelf(870, 520, rows=2, cols=6, prochiz=(1, 0))), CX - 6, 980, rot=0)
    sp = agus(1, 1000, 0.72); ac(L, sp, (int(CX - sp.width / 2) + 40, 1480 - sp.height)); dot_only(L, CX + 62, 1480 - sp.height - 6, 9)
    name_label(L, CX + 40, 1420)

# ------------------------------------------------------------------ scene 3 alternatives
def door_card(w=860, h=720):
    im = Image.new("RGBA", (w, h), (238, 235, 226, 255)); d = ImageDraw.Draw(im)
    d.rectangle((0, 0, w, 120), fill=INKK + (255,)); d.text((40, 62), "SUPERMARKET", font=an(86), fill=(255, 250, 231, 255), anchor="lm")
    gx0, gx1, gy0, gy1 = 90, w - 90, 160, h - 120; mid = w // 2
    for x0, x1 in ((gx0, mid - 6), (mid + 6, gx1)):
        d.rectangle((x0, gy0, x1, gy1), fill=(205, 222, 232, 255), outline=(60, 60, 60, 255), width=8)
        d.line((x0 + 20, gy0 + 20, x0 + 150, gy0 + 150), fill=(255, 255, 255, 190), width=10); d.line((x0 + 60, gy0 + 20, x0 + 190, gy0 + 150), fill=(255, 255, 255, 120), width=6)
    d.rectangle((mid - 22, gy0 + 250, mid - 10, gy0 + 380), fill=(60, 60, 60, 255)); d.rectangle((mid + 10, gy0 + 250, mid + 22, gy0 + 380), fill=(60, 60, 60, 255))
    d.rectangle((gx0 - 20, gy1, gx1 + 20, h), fill=(90, 90, 94, 255)); d.polygon([(mid - 60, h - 30), (mid + 60, h - 30), (mid, h - 100)], fill=RED + (255,))
    d.text((mid, h - 62), "MASUK", font=an(44), fill=(255, 255, 255, 255), anchor="mm")
    return im

def s03a(L):
    """A: supermarket entrance (sign, glass doors, MASUK mat) with Agustina stepping in front."""
    ttl(L, [[("WAKTU MASUK KE", INKK)], [("SUPERMARKET", RED)]], 290, 124)
    place(L, door_card(), 505, 1020, rot=-1)
    sp = agus(2, 1100, 0.78); ac(L, sp, (SR - sp.width - 6, 1480 - sp.height))

def s03b(L):
    """B: one-point-perspective aisle photo (walking in) with Agustina large on the right."""
    ttl(L, [[("WAKTU MASUK KE", INKK)], [("SUPERMARKET", RED)]], 290, 124)
    place(L, mono_card(Image.open(A + "aisle/aisle_keju.png").convert("RGB"), 780, crop=(200, 0, 1472, 941)), 490, 1000, rot=-2)
    sp = agus(2, 1100, 0.78); ac(L, sp, (SR - sp.width - 6, 1480 - sp.height))

# ------------------------------------------------------------------ renderer
def bgfor(num, bgB, bgR): return bgR if B6.SCENE_BG.get(num) == "red" else bgB
def render_fn(fn, num, bgB, bgR):
    L = Image.new("RGBA", (W, H), (0, 0, 0, 0)); fn(L); im = bgfor(num, bgB, bgR).copy(); im.alpha_composite(L); return im.convert("RGB"), L

if __name__ == "__main__":
    bgB, bgR = BO.plus_sparse(), BO.red_sparse(); out = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "frames", "v8c"); os.makedirs(out, exist_ok=True); bad = 0
    jobs = [(n, f"scene_{n:02d}", fn) for n, fn in B6.SC] + [(2, "scene_02_alt_A_rak_roti_card", s02a), (2, "scene_02_alt_B_rak_roti_lebar", s02b), (3, "scene_03_alt_A_pintu_masuk", s03a), (3, "scene_03_alt_B_lorong_foto", s03b)]
    for num, name, fn in jobs:
        im, L = render_fn(fn, num, bgB, bgR); im.save(os.path.join(out, name + ".png"))
        bb = L.getchannel("A").point(lambda v: 255 if v > 125 else 0).filter(ImageFilter.MinFilter(9)).getbbox()
        if bb and (bb[0] < SL - 6 or bb[2] > SR + 6 or bb[1] < ST - 6 or bb[3] > SB + 6): bad += 1; print("OUT", name, bb)
    print("violations:", bad, "->", out)
