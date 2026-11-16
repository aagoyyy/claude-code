"""SVG illustration kit: colour science, organic geometry, light-aware ink, document/defs registry."""
import math, random, colorsys

# ------------------------------------------------------------------ colour (one palette logic for every object)
def h2r(h):
    h = h.lstrip('#'); return [int(h[i:i + 2], 16) for i in (0, 2, 4)]
def r2h(r): return '#%02X%02X%02X' % tuple(max(0, min(255, int(round(v)))) for v in r)
def mix(a, b, t):
    A, B = h2r(a), h2r(b); return r2h([A[i] + (B[i] - A[i]) * t for i in range(3)])
def hsl(c):
    r, g, b = [v / 255 for v in h2r(c)]; h, l, s = colorsys.rgb_to_hls(r, g, b); return h, s, l
def from_hsl(h, s, l):
    r, g, b = colorsys.hls_to_rgb(h % 1, max(0, min(1, l)), max(0, min(1, s))); return r2h([r * 255, g * 255, b * 255])
def desat(c, k): h, s, l = hsl(c); return from_hsl(h, s * k, l)

HAZE, KEY, SHADOW, BOUNCE = '#EADCC3', '#FFEBC6', '#4A2B3A', '#F0A868'
def atm(c, d):
    """atmospheric perspective: far objects drift to haze, lose saturation and contrast (same hues, same language)."""
    return c if d <= 0 else mix(desat(c, 1 - .5 * d), HAZE, .42 * d)
def tones(c, d=0):
    """five-value posterised ramp used by every material: highlights go warm-cream, shadows go violet-brown."""
    return dict(spec=atm(mix(c, '#FFFFFF', .85), d), light=atm(mix(c, KEY, .42), d), mid=atm(c, d),
                shade=atm(mix(c, SHADOW, .30), d), core=atm(mix(c, SHADOW, .55), d), bounce=atm(mix(c, BOUNCE, .38), d))

TIER = {
    'fg':  dict(w=6.4, c='#2A1B15', d=0.0, det=3.2, hair=1.7),
    'mid': dict(w=4.4, c='#3C2A23', d=.35, det=2.4, hair=1.4),
    'bg':  dict(w=2.8, c='#6F5E50', d=.80, det=1.8, hair=1.1),
}
LD = (-.55, -.835)           # unit vector pointing TOWARDS the key light (window, upper-left)
CAST = (.62, .78)            # direction shadows fall

# ------------------------------------------------------------------ geometry
def ell(cx, cy, rx, ry, n=160, rot=0, a0=-math.pi / 2):
    out = []
    for i in range(n):
        a = a0 + 2 * math.pi * i / n; x, y = rx * math.cos(a), ry * math.sin(a)
        if rot: x, y = x * math.cos(rot) - y * math.sin(rot), x * math.sin(rot) + y * math.cos(rot)
        out.append((cx + x, cy + y))
    return out
def bez(p0, c1, c2, p3, n=36):
    out = []
    for i in range(n + 1):
        t = i / n; u = 1 - t
        out.append((u**3 * p0[0] + 3 * u * u * t * c1[0] + 3 * u * t * t * c2[0] + t**3 * p3[0],
                    u**3 * p0[1] + 3 * u * u * t * c1[1] + 3 * u * t * t * c2[1] + t**3 * p3[1]))
    return out
def seglen(p): return [math.hypot(p[i + 1][0] - p[i][0], p[i + 1][1] - p[i][1]) for i in range(len(p) - 1)]
def resample(pts, n, closed=True):
    p = list(pts) + ([pts[0]] if closed else [])
    L = seglen(p); tot = sum(L) or 1; out = []; j = 0; acc = 0
    for k in range(n):
        d = (k / (n if closed else n - 1)) * tot
        while j < len(L) - 1 and acc + L[j] < d: acc += L[j]; j += 1
        u = (d - acc) / (L[j] or 1)
        out.append((p[j][0] + (p[j + 1][0] - p[j][0]) * u, p[j][1] + (p[j + 1][1] - p[j][1]) * u))
    return out
def area(p): return sum(p[i][0] * p[(i + 1) % len(p)][1] - p[(i + 1) % len(p)][0] * p[i][1] for i in range(len(p))) / 2
def normals(p, closed=True):
    n = len(p); sgn = 1 if (not closed or area(p) > 0) else -1; out = []
    for i in range(n):
        a = p[(i - 1) % n] if (closed or i > 0) else p[i]
        b = p[(i + 1) % n] if (closed or i < n - 1) else p[i]
        dx, dy = b[0] - a[0], b[1] - a[1]; L = math.hypot(dx, dy) or 1
        out.append((sgn * dy / L, -sgn * dx / L))
    return out
def wob(pts, amp, seed, closed=True, freqs=(2, 3, 5, 8)):
    """controlled irregularity: periodic low-frequency noise pushed along the normal (never perfect geometry)."""
    r = random.Random(seed); n = len(pts); nm = normals(pts, closed)
    ph = [r.uniform(0, 6.283) for _ in freqs]; wt = [r.uniform(.5, 1) / (1 + i * .6) for i in range(len(freqs))]
    out = []
    for i, (x, y) in enumerate(pts):
        t = i / n; d = sum(w * math.sin(6.283 * f * t + p) for f, w, p in zip(freqs, wt, ph)) * amp / 1.6
        out.append((x + nm[i][0] * d, y + nm[i][1] * d))
    return out
def rrect(x0, y0, x1, y1, rtl=0, rtr=0, rbr=0, rbl=0, n=10):
    pts = []
    def arc(cx, cy, r, a0):
        if r <= 0: pts.append((cx, cy)); return
        for i in range(n + 1):
            a = a0 + (i / n) * math.pi / 2; pts.append((cx + r * math.cos(a), cy + r * math.sin(a)))
    pts.append(((x0 + x1) / 2, y0))
    arc(x1 - rtr, y0 + rtr, rtr, -math.pi / 2); arc(x1 - rbr, y1 - rbr, rbr, 0)
    arc(x0 + rbl, y1 - rbl, rbl, math.pi / 2); arc(x0 + rtl, y0 + rtl, rtl, math.pi)
    return pts
def d_smooth(p, closed=True):
    f = lambda v: f'{v:.1f}'
    mid = lambda a, b: f'{f((a[0] + b[0]) / 2)},{f((a[1] + b[1]) / 2)}'
    n = len(p)
    if closed:
        d = f'M{mid(p[-1], p[0])}'
        for i in range(n): d += f'Q{f(p[i][0])},{f(p[i][1])} {mid(p[i], p[(i + 1) % n])}'
        return d + 'Z'
    d = f'M{f(p[0][0])},{f(p[0][1])}'
    for i in range(1, n - 1): d += f'Q{f(p[i][0])},{f(p[i][1])} {mid(p[i], p[i + 1])}'
    return d + f'L{f(p[-1][0])},{f(p[-1][1])}'
def d_line(p): return 'M' + ' L'.join(f'{x:.1f},{y:.1f}' for x, y in p)
def smooth_w(ws, k=9):
    n = len(ws); h = k // 2
    return [sum(ws[(i + j) % n] for j in range(-h, h + 1)) / (2 * h + 1) for i in range(n)]

# ------------------------------------------------------------------ document / defs registry
class Doc:
    def __init__(self, seed=1):
        self.defs, self.k, self.rng = [], 0, random.Random(seed)
    def uid(self, p='u'): self.k += 1; return f'{p}{self.k}'
    def _stops(self, stops):
        s = ''
        for st in stops:
            o, c = st[0], st[1]; a = st[2] if len(st) > 2 else None
            s += f'<stop offset="{o}" stop-color="{c}"' + (f' stop-opacity="{a}"' if a is not None else '') + '/>'
        return s
    def lg(self, stops, x1=0, y1=0, x2=0, y2=1, user=False):
        i = self.uid('g'); u = ' gradientUnits="userSpaceOnUse"' if user else ''
        self.defs.append(f'<linearGradient id="{i}" x1="{x1}" y1="{y1}" x2="{x2}" y2="{y2}"{u}>{self._stops(stops)}</linearGradient>'); return i
    def rg(self, stops, cx=.5, cy=.5, r=.5, fx=None, fy=None, user=False):
        i = self.uid('r'); u = ' gradientUnits="userSpaceOnUse"' if user else ''
        f = f' fx="{fx}" fy="{fy}"' if fx is not None else ''
        self.defs.append(f'<radialGradient id="{i}" cx="{cx}" cy="{cy}" r="{r}"{f}{u}>{self._stops(stops)}</radialGradient>'); return i
    def clip(self, d):
        i = self.uid('c'); self.defs.append(f'<clipPath id="{i}"><path d="{d}"/></clipPath>'); return i
    def filt(self, inner, x='-20%', y='-20%', w='140%', h='140%'):
        i = self.uid('f'); self.defs.append(f'<filter id="{i}" x="{x}" y="{y}" width="{w}" height="{h}" color-interpolation-filters="sRGB">{inner}</filter>'); return i
    def blur(self, sd): return self.filt(f'<feGaussianBlur stdDeviation="{sd}"/>', '-50%', '-50%', '200%', '200%')
    def mask(self, inner):
        i = self.uid('m'); self.defs.append(f'<mask id="{i}">{inner}</mask>'); return i

# ------------------------------------------------------------------ light-aware ink
def ink(pts, tier, closed=True, k=1.0, seed=0, color=None):
    """calligraphic outline: thin where the key light hits, heavy in shadow, slight hand noise."""
    t = TIER[tier]; base = t['w'] * k; col = color or t['c']
    nm = normals(pts, closed); r = random.Random(seed); n = len(pts)
    ws = [base * (1 - .52 * (nx * LD[0] + ny * LD[1])) for nx, ny in nm]
    ws = smooth_w(ws, 11) if closed else ws
    ws = [w * (1 + .07 * math.sin(i * .21 + seed) + r.uniform(-.04, .04)) for i, w in enumerate(ws)]
    L = [(x + nm[i][0] * ws[i] / 2, y + nm[i][1] * ws[i] / 2) for i, (x, y) in enumerate(pts)]
    R = [(x - nm[i][0] * ws[i] / 2, y - nm[i][1] * ws[i] / 2) for i, (x, y) in enumerate(pts)]
    if closed:
        return f'<path d="{d_smooth(L)}{d_smooth(R)}" fill="{col}" fill-rule="evenodd"/>'
    taper = [min(1, i / 6, (n - 1 - i) / 6) for i in range(n)]
    L = [(x + nm[i][0] * ws[i] * taper[i] / 2, y + nm[i][1] * ws[i] * taper[i] / 2) for i, (x, y) in enumerate(pts)]
    R = [(x - nm[i][0] * ws[i] * taper[i] / 2, y - nm[i][1] * ws[i] * taper[i] / 2) for i, (x, y) in enumerate(pts)]
    poly = L + R[::-1]
    return f'<path d="{d_line(poly)}Z" fill="{col}"/>'

def solid(doc, pts, fill, tier, inner='', seed=0, k=1.0, ink_on=True, extra_clip=None):
    """fill + material layers clipped to the silhouette + ink."""
    d = d_smooth(pts); cid = doc.clip(d)
    s = f'<path d="{d}" fill="{fill}"/>'
    if inner: s += f'<g clip-path="url(#{cid})">{inner}</g>'
    if ink_on: s += ink(pts, tier, True, k, seed)
    return s, cid

def hair(pts, tier, closed=False, w=None, col=None, op=1.0):
    t = TIER[tier]; w = w or t['hair']
    return f'<path d="{d_smooth(pts, closed)}" fill="none" stroke="{col or t["c"]}" stroke-width="{w}" stroke-linecap="round" stroke-linejoin="round" opacity="{op}"/>'

# ------------------------------------------------------------------ lighting helpers
def contact(doc, cx, cy, rx, ry, op=.55, sd=4):
    return f'<ellipse cx="{cx}" cy="{cy}" rx="{rx}" ry="{ry}" fill="#1B0C0A" opacity="{op}" filter="url(#{doc.blur(sd)})"/>'
def cast(doc, pts, length, op=.3, sd=10, col='#3A1C26'):
    """cast shadow: the silhouette sheared away from the light and softened."""
    dx, dy = CAST[0] * length, CAST[1] * length * .55
    return f'<path d="{d_smooth(pts)}" fill="{col}" opacity="{op}" transform="translate({dx:.0f},{dy:.0f})" filter="url(#{doc.blur(sd)})"/>'
