"""Cut a subject off a plain studio backdrop (GrabCut seeded from a smooth backdrop model)."""
import sys, cv2, numpy as np
def cut(src, out, nobottom=False):
    im = cv2.imread(src); h, w = im.shape[:2]; lab = cv2.cvtColor(im, cv2.COLOR_BGR2LAB).astype(np.float32)
    yy, xx = np.mgrid[0:h, 0:w].astype(np.float32); X = np.stack([np.ones_like(xx), xx / w, yy / h, (xx / w) ** 2, (yy / h) ** 2, (xx / w) * (yy / h)], -1)
    seed = np.zeros((h, w), bool); seed[:, :60] = True; seed[:, -60:] = True; seed[:30, :] = True; seed[-20:, :] = not nobottom
    if nobottom: seed[int(h * 0.55):, :] = False
    model = np.zeros_like(lab)
    for c in range(3): coef = np.linalg.lstsq(X[seed], lab[..., c][seed], rcond=None)[0]; model[..., c] = X @ coef
    d = np.linalg.norm(lab - model, axis=2)
    m = np.full((h, w), cv2.GC_PR_BGD, np.uint8); m[d > 9] = cv2.GC_PR_FGD; m[d < 4] = cv2.GC_BGD
    sure = cv2.erode((d > 30).astype(np.uint8), np.ones((7, 7), np.uint8)); m[sure > 0] = cv2.GC_FGD
    bg = np.zeros((1, 65)); fg = np.zeros((1, 65)); cv2.grabCut(im, m, None, bg, fg, 5, cv2.GC_INIT_WITH_MASK)
    if nobottom: m[-6:, :][d[-6:, :] > 9] = cv2.GC_FGD
    k = ((m == cv2.GC_FGD) | (m == cv2.GC_PR_FGD)).astype(np.uint8)
    n, lbl, st, _ = cv2.connectedComponentsWithStats(k); keep = (lbl == 1 + np.argmax(st[1:, cv2.CC_STAT_AREA])).astype(np.uint8)
    keep = cv2.morphologyEx(keep, cv2.MORPH_CLOSE, np.ones((5, 5), np.uint8))
    # enclosed holes: fill only if they are NOT backdrop-coloured (keeps the gaps between arm and body transparent)
    pad = cv2.copyMakeBorder(keep, 1, 1, 1, 1, cv2.BORDER_CONSTANT, value=0); inv = (1 - pad).astype(np.uint8); fm = np.zeros((pad.shape[0] + 2, pad.shape[1] + 2), np.uint8)
    cv2.floodFill(inv, fm, (0, 0), 2); holes = (inv[1:-1, 1:-1] == 1); keep[holes & (d > 12)] = 1
    nh, lh, sh_, _ = cv2.connectedComponentsWithStats(holes.astype(np.uint8))
    for i in range(1, nh):
        if sh_[i, cv2.CC_STAT_AREA] < 2500: keep[lh == i] = 1          # small enclosed holes (eye whites, highlights) are always subject
    if not nobottom:   # remove grey floor shadow near the feet, then re-close small holes (shoe highlights)
        L = cv2.cvtColor(im, cv2.COLOR_BGR2LAB).astype(np.float32); ch = np.hypot(L[..., 1] - 128, L[..., 2] - 128)
        zone = np.zeros((h, w), bool); zone[int(h * 0.82):] = True; sh = zone & (L[..., 0] > 95) & (ch < 10) & (d < 40)
        keep[sh] = 0; n2, l2, s2, _ = cv2.connectedComponentsWithStats(keep); keep = (l2 == 1 + np.argmax(s2[1:, cv2.CC_STAT_AREA])).astype(np.uint8)
        keep = cv2.morphologyEx(keep, cv2.MORPH_CLOSE, cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (11, 11)))
    a = cv2.GaussianBlur(keep.astype(np.float32), (0, 0), 1.0); a = np.clip((a - 0.2) / 0.6, 0, 1)
    cv2.imwrite(out, np.dstack([im, (a * 255).astype(np.uint8)]))
if __name__ == "__main__": cut(sys.argv[1], sys.argv[2], len(sys.argv) > 3 and sys.argv[3] == "nobottom")
