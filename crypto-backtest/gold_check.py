#!/usr/bin/env python3
"""Cek lanjutan setup A emas di jendela 19:00-23:00 WIB.
 (1) Pecah per tahun dan per hari (PAXGUSDT 15m): apakah hanya jalan di satu rezim?
 (2) Filter Jumat pertama tiap bulan (hari NFP, aproksimasi).
 (3) Cross-check independen: futures emas COMEX (GC=F) 1H dari Yahoo, setup A versi 1H arah 4H.
Percobaan tambahan: filter NFP 4 + GC=F 4 = 8 (total keseluruhan studi emas 32)."""
import json
import urllib.request
import numpy as np
import pandas as pd
import backtest as b
import gold_intraday as g

COST = 0.01
P = dict(sl_buffer_atr=0.5, swing_bars=5, range_bars=48, max_gap=0.004, retest_window=12, retest_tol=0.3)


def line(name, t):
    if not len(t):
        return f"{name:<22} n=0"
    vc = t.reason.value_counts()
    return f"{name:<22} n={len(t):<4} W{vc.get('TP',0)}/L{vc.get('SL',0)}/T{vc.get('TIME',0)} {100*vc.get('TP',0)/len(t):3.0f}%  exp {t.R.mean():+.2f}R  total {t.R.sum():+6.1f}R"


def fetch_gcf():
    u = "https://query1.finance.yahoo.com/v8/finance/chart/GC=F?interval=1h&range=2y"
    r = urllib.request.Request(u, headers={"User-Agent": "Mozilla/5.0"})
    j = json.load(urllib.request.urlopen(r, timeout=40))["chart"]["result"][0]
    q = j["indicators"]["quote"][0]
    df = pd.DataFrame({"ts": pd.to_datetime(j["timestamp"], unit="s", utc=True), "open": q["open"], "high": q["high"],
                       "low": q["low"], "close": q["close"], "volume": q["volume"]}).dropna(subset=["open", "high", "low", "close"])
    df["ts"] = df["ts"].astype("datetime64[ns, UTC]")
    return df.drop_duplicates("ts").sort_values("ts").reset_index(drop=True)


def main(only3=False):
    if only3:
        part3(); return
    df = b.fetch_binance_public("PAXGUSDT", "15m", 1500)
    d = b.prepare(df, "1h")
    win = g.in_window(d)
    nfp = ((d.ts.dt.dayofweek == 4) & (d.ts.dt.day <= 7)).to_numpy()
    print("=== (1)+(2) PAXGUSDT 15m, setup A, buffer 0.5 ATR")
    for rr in (1.5, 2.0):
        sg = [x for x in b.signals(d, "A", P) if win[x[0]]]
        for label, f in (("semua hari", None), ("tanpa Jumat pertama", nfp)):
            s2 = sg if f is None else [x for x in sg if not f[x[0]]]
            t = b.simulate(d, s2, rr, COST, 1, 3.0, g.HOLD, None)
            print(f"\n-- RR 1:{rr:g}, {label}: " + line("SEMUA", t).strip())
            if f is None:
                print("   per tahun:")
                for y, x in t.groupby(t.entry_ts.dt.year):
                    print("   " + line(str(y), x))
                print("   per hari (eksploratif):")
                for dw, x in t.groupby(t.entry_ts.dt.dayofweek):
                    print("   " + line(["Sen", "Sel", "Rab", "Kam", "Jum"][dw], x))
    part3()


def part3():
    print("\n=== (3) GC=F 1H (COMEX), setup A arah 4H, jendela 12-16 UTC, maks hold 4 bar")
    try:
        gf = fetch_gcf()
    except Exception as e:
        print("Gagal ambil GC=F:", e); return
    h = b.prepare(gf, "4h")
    ts = h["ts"].dt
    w = ((ts.hour >= 12) & (ts.hour < 16) & (ts.dayofweek < 5)).to_numpy()
    half = len(h) // 2
    print(f"{len(h)} candle 1H, {gf.ts.iloc[0]:%Y-%m-%d}..{gf.ts.iloc[-1]:%Y-%m-%d}")
    for buf in (0.5, 1.0):
        p = dict(P, sl_buffer_atr=buf)
        sg = [x for x in b.signals(h, "A", p) if w[x[0]]]
        for rr in (1.5, 2.0):
            t = b.simulate(h, sg, rr, COST, 1, 3.0, 4, None)
            mid = h.ts.iloc[half]
            print(line(f"buf{buf} RR{rr:g} semua", t))
            print(line("   paruh 1", t[t.entry_ts < mid]))
            print(line("   paruh 2", t[t.entry_ts >= mid]))


if __name__ == "__main__":
    import sys
    main("--only3" in sys.argv)
