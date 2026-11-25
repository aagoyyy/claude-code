#!/usr/bin/env python3
"""Emas (proxy PAXGUSDT 15m) Senin-Jumat, entry hanya di jendela 19:00-23:00 WIB (12:00-16:00 UTC).
Satu trade per hari. Percobaan ditetapkan di muka: A (pullback EMA) x2 buffer x2 RR, C (break&retest) x2 x2,
F (entry paksa tiap hari searah tren 1H) x2 ATR x2 RR = 24 percobaan. Biaya 0.01% per sisi (spread+slippage CFD ~ USD 0.35)."""
import numpy as np
import pandas as pd
import backtest as b

COST = 0.01
H0, H1 = 12, 16           # jam UTC jendela
HOLD = 16                 # maks 16 candle 15m (4 jam) sejak entry


def in_window(d):
    ts = d["ts"].dt
    return ((ts.hour >= H0) & (ts.hour < H1) & (ts.dayofweek < 5)).to_numpy()


def forced(d, k):
    c, a = d["close"].to_numpy(), d["atr"].to_numpy()
    e50, tr = d["ema50"].to_numpy(), d["trend"].to_numpy()
    ts = d["ts"].dt
    first = ((ts.hour == H0) & (ts.minute == 0) & (ts.dayofweek < 5)).to_numpy()
    out = []
    for i in np.where(first)[0]:
        if i < 130 or i + 1 >= len(d) or np.isnan(a[i]):
            continue
        side = int(tr[i]) if tr[i] in (1, -1) else (1 if c[i] > e50[i] else -1)
        out.append((i, side, c[i] - side * k * a[i]))
    return out


def main():
    df = b.fetch_binance_public("PAXGUSDT", "15m", 1500)
    d = b.prepare(df, "1h")
    n = len(d)
    win = in_window(d)
    cuts = {"train": (d.ts.iloc[0], d.ts.iloc[int(n * .6)]), "val": (d.ts.iloc[int(n * .6)], d.ts.iloc[int(n * .8)]),
            "test": (d.ts.iloc[int(n * .8)], d.ts.iloc[-1] + pd.Timedelta("1min"))}
    days = {k: len(pd.bdate_range(lo, hi - pd.Timedelta("1d"))) for k, (lo, hi) in cuts.items()}
    print(f"PAXGUSDT 15m: {n} candle {df.ts.iloc[0]:%Y-%m-%d}..{df.ts.iloc[-1]:%Y-%m-%d}; hari kerja per split: {days}")
    rows = []
    cfgs = []
    for s in "AC":
        for buf in (0.5, 1.0):
            p = dict(sl_buffer_atr=buf, swing_bars=5, range_bars=48, max_gap=0.004, retest_window=12, retest_tol=0.3)
            sg = [x for x in b.signals(d, s, p) if win[x[0]]]
            for rr in (1.5, 2.0):
                cfgs.append((f"{s} buf{buf} RR{rr:g}", sg, rr))
    for k in (1.0, 1.5):
        sg = forced(d, k)
        for rr in (1.5, 2.0):
            cfgs.append((f"F atr{k:g} RR{rr:g}", sg, rr))
    print(f"{'config':<18}" + "".join(f"| {p:<34}" for p in cuts))
    for name, sg, rr in cfgs:
        t = b.simulate(d, sg, rr, COST, 1, 3.0, HOLD, None)
        cells = []
        for part, (lo, hi) in cuts.items():
            x = t[(t.entry_ts >= lo) & (t.entry_ts < hi)] if len(t) else t
            if not len(x):
                cells.append("n=0"); continue
            vc = x.reason.value_counts()
            cov = x.entry_ts.dt.date.nunique() / days[part] * 100
            cells.append(f"n={len(x)} W{vc.get('TP',0)}/L{vc.get('SL',0)}/T{vc.get('TIME',0)} {100*vc.get('TP',0)/len(x):.0f}% {x.R.mean():+.2f}R hari{cov:.0f}%")
        print(f"{name:<18}" + "".join(f"| {c:<34}" for c in cells))
    print("\nhari% = persentase hari kerja yang punya minimal 1 entry. Total percobaan: 24")


if __name__ == "__main__":
    main()
