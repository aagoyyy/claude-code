"""Subtle synthesized SFX timed to the v9 element entrances (taken from anim9's schedule). Writes assets/sfx_v8.wav (44.1 kHz stereo)."""
import sys, os, wave
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import numpy as np
import anim9 as AN

SR_ = 44100; TOTAL = AN.TOTAL; rng = np.random.RandomState(7)

def env_ad(n, a, d):                       # attack/decay envelope over n samples
    t = np.arange(n) / SR_; e = np.minimum(t / max(a, 1e-4), 1.0) * np.exp(-t / max(d, 1e-4)); return e
def bandnoise(n, lo, hi):
    x = rng.randn(n); X = np.fft.rfft(x); f = np.fft.rfftfreq(n, 1 / SR_); X[(f < lo) | (f > hi)] = 0; y = np.fft.irfft(X, n); return y / (np.abs(y).max() + 1e-9)

def tick(amp):                              # tiny dry click
    n = int(0.03 * SR_); return amp * bandnoise(n, 2500, 7000) * env_ad(n, 0.0008, 0.006)
def paper(amp):                             # soft paper/card slide
    n = int(0.20 * SR_); e = np.sin(np.linspace(0, np.pi, n)) ** 1.5; return amp * bandnoise(n, 900, 4200) * e
def whoosh(amp):                            # figure rising: low breathy sweep
    n = int(0.34 * SR_); e = np.sin(np.linspace(0, np.pi, n)) ** 2; y = bandnoise(n, 250, 1800)
    sweep = np.sin(2 * np.pi * np.cumsum(np.linspace(180, 420, n)) / SR_) * 0.25; return amp * (y * 0.8 + sweep) * e
def thud(amp):                              # soft stamp
    n = int(0.22 * SR_); t = np.arange(n) / SR_; body = np.sin(2 * np.pi * (70 - 25 * t / 0.22) * t) * np.exp(-t / 0.06)
    click = bandnoise(n, 1500, 6000) * env_ad(n, 0.0005, 0.012) * 0.5; return amp * (body + click)
def zip_(amp):                              # thin line being drawn
    n = int(0.36 * SR_); t = np.arange(n) / SR_; f = 900 + 1600 * (t / 0.36); e = np.sin(np.linspace(0, np.pi, n)) ** 2
    return amp * np.sin(2 * np.pi * np.cumsum(f) / SR_) * e
def ping(amp):                              # pin / dot
    n = int(0.22 * SR_); t = np.arange(n) / SR_; return amp * (np.sin(2 * np.pi * 1760 * t) * 0.7 + np.sin(2 * np.pi * 2637 * t) * 0.3) * env_ad(n, 0.002, 0.07)
def swish(amp):                             # scene clear
    n = int(0.20 * SR_); e = np.sin(np.linspace(0, np.pi, n)) ** 2; return amp * bandnoise(n, 1200, 6500) * e

GAIN = {"title": (tick, 0.050), "micro": (tick, 0.045), "card": (paper, 0.085), "fig": (whoosh, 0.10), "stamp": (thud, 0.17), "line": (zip_, 0.030), "dot": (ping, 0.045)}

def build():
    buf = np.zeros(int((TOTAL + 0.6) * SR_)); ev = []
    for k, (t0, t1) in enumerate(AN._T):
        els = AN.ELS[k]; seen_title = False
        for e in els:
            if e["t"] < -0.05 and e["kind"] != "title": continue
            if e["kind"] == "title":
                if seen_title: continue                       # one tick per title, not per word
                seen_title = True
            ev.append((t0 + max(e["t"], 0.0), e["kind"]))
        if k < len(AN._T) - 1: ev.append((t1 - 0.20, "swish"))
    last = {}
    for t, kind in sorted(ev):
        if kind == "swish": snd = swish(0.045)
        else:
            if t - last.get(kind, -9) < 0.09: continue         # never stack the same sound closer than 90 ms
            fn, amp = GAIN[kind]; snd = fn(amp); last[kind] = t
        i = int(t * SR_); j = min(len(buf), i + len(snd))
        if i < len(buf): buf[i:j] += snd[: j - i]
    buf = buf[: int(TOTAL * SR_)]
    return buf, len(ev)

if __name__ == "__main__":
    y, n = build(); pk = float(np.abs(y).max()); y = y / max(pk, 1e-9) * 0.30            # peak -10 dBFS here; mixed down below the voice later
    st = np.stack([y, np.roll(y, 12)], 1)                                                  # tiny stereo offset
    out = AN.A + "sfx_v9.wav"; pcm = (np.clip(st, -1, 1) * 32767).astype(np.int16)
    with wave.open(out, "wb") as w: w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR_); w.writeframes(pcm.tobytes())
    print("events", n, "peak before norm", round(pk, 3), "->", out)
