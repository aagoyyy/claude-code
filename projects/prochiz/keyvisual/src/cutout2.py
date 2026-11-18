"""Cutout for subjects on a neutral light-grey studio backdrop: colour/brightness seeds -> GrabCut -> cleanup."""
import sys, cv2, numpy as np
def cut(src, out, nobottom=False):
    im = cv2.imread(src); h, w = im.shape[:2]; lab = cv2.cvtColor(im, cv2.COLOR_BGR2LAB).astype(np.float32)
    L = lab[..., 0]; ch = np.hypot(lab[..., 1] - 128, lab[..., 2] - 128)
    bgL = np.median(L[:20, :]); bgc = np.median(ch[:20, :])
    fg_sure = (ch > bgc + 22) | (L < bgL - 95) | (L > bgL + 22)            # red/skin/yellow, black, bright white plate
    bg_like = (np.abs(L - bgL) < 12) & (ch < bgc + 7)
    m = np.full((h, w), cv2.GC_PR_BGD, np.uint8)
    m[(ch > bgc + 12) | (L < bgL - 60) | (L > bgL + 14)] = cv2.GC_PR_FGD
    far = cv2.dilate(fg_sure.astype(np.uint8), np.ones((31, 31), np.uint8)) == 0
    m[bg_like & far] = cv2.GC_BGD
    m[cv2.erode(fg_sure.astype(np.uint8), np.ones((5, 5), np.uint8)) > 0] = cv2.GC_FGD
    bg = np.zeros((1, 65)); fg = np.zeros((1, 65)); cv2.grabCut(im, m, None, bg, fg, 6, cv2.GC_INIT_WITH_MASK)
    k = ((m == cv2.GC_FGD) | (m == cv2.GC_PR_FGD)).astype(np.uint8)
    n, lbl, st, _ = cv2.connectedComponentsWithStats(k)
    keep = np.zeros_like(k)
    big = 1 + np.argmax(st[1:, cv2.CC_STAT_AREA]); keep[lbl == big] = 1
    for i in range(1, n):                                                   # keep small detached parts that are clearly subject (cheese sample on a toothpick)
        if i != big and st[i, cv2.CC_STAT_AREA] > 150 and (fg_sure & (lbl == i)).mean() > 0: keep[lbl == i] = 1 if (fg_sure[lbl == i].mean() > 0.4) else 0
    keep = cv2.morphologyEx(keep, cv2.MORPH_CLOSE, np.ones((5, 5), np.uint8))
    pad = cv2.copyMakeBorder(keep, 1, 1, 1, 1, cv2.BORDER_CONSTANT, value=0); inv = (1 - pad).astype(np.uint8); fm = np.zeros((pad.shape[0] + 2, pad.shape[1] + 2), np.uint8)
    cv2.floodFill(inv, fm, (0, 0), 2); holes = (inv[1:-1, 1:-1] == 1); nh, lh, sh, _ = cv2.connectedComponentsWithStats(holes.astype(np.uint8))
    for i in range(1, nh):
        if sh[i, cv2.CC_STAT_AREA] < 2500 or not bg_like[lh == i].mean() > 0.8: keep[lh == i] = 1
    if not nobottom:                                                        # floor shadow near the feet
        zone = np.zeros((h, w), bool); zone[int(h * 0.85):] = True; keep[zone & bg_like] = 0
        keep[zone & (np.abs(L - bgL) < 30) & (ch < bgc + 6) & (L > 90)] = 0
    a = cv2.GaussianBlur(keep.astype(np.float32), (0, 0), 0.9); a = np.clip((a - 0.2) / 0.6, 0, 1)
    cv2.imwrite(out, np.dstack([im, (a * 255).astype(np.uint8)]))
if __name__ == "__main__": cut(sys.argv[1], sys.argv[2], len(sys.argv) > 3 and sys.argv[3] == "nobottom")
