#!/usr/bin/env python3
"""Dua eksperimen, BTC+ETH+SOL, hasil digabung, dipisah train 60% / val 20% / test 20%.
 1) 15m (2 tahun) dengan TP di level struktur
 2) 1H dengan arah 4H (4 tahun), R:R tetap dan TP struktur
Aturan TP struktur: pilih level terdekat (swing high/low terkonfirmasi atau high/low hari sebelumnya, WIB)
yang jaraknya >= 2R dan <= 5R dari entry, dikurangi 0.1 ATR. Kalau tidak ada, trade dilewati.
Percobaan: eksperimen 1 = 12, eksperimen 2 = 48 (R:R tetap) + 12 (struktur) = 60."""
import numpy as np
import pandas as pd
import backtest as b

COST = 0.07
K = 5          # lebar pivot


def structure_tp(d, minr=2.0, maxr=5.0, look=300):
    h, l, a = d["high"].to_numpy(), d["low"].to_numpy(), d["atr"].to_numpy()
    n = len(d)
    ph, pl = [], []
    for j in range(K, n - K):
        if h[j] >= h[j - K:j + K + 1].max():
            ph.append((j + K, h[j]))          # (indeks konfirmasi, harga)
        if l[j] <= l[j - K:j + K + 1].min():
            pl.append((j + K, l[j]))
    phc = np.array([x[0] for x in ph]); php = np.array([x[1] for x in ph])
    plc = np.array([x[0] for x in pl]); plp = np.array([x[1] for x in pl])
    day = d["ts"].dt.tz_convert(b.WIB).dt.date
    dh = d.groupby(day)["high"].transform("max"); dl = d.groupby(day)["low"].transform("min")
    # high/low hari sebelumnya, tersedia sejak hari berikutnya mulai
    daily = pd.DataFrame({"day": day, "h": h, "l": l}).groupby("day").agg(h=("h", "max"), l=("l", "min"))
    prev = daily.shift(1)
    pdh = day.map(prev["h"]).to_numpy(); pdl = day.map(prev["l"]).to_numpy()

    def fn(e, side, entry, dist):
        i = e - 1
        if side == 1:
            lo_i, hi_i = np.searchsorted(phc, i - look), np.searchsorted(phc, i, side="right")
            lv = list(php[lo_i:hi_i]) + [pdh[i]]
            c = [x for x in lv if x == x and entry + minr * dist <= x <= entry + maxr * dist]
            return (min(c) - 0.1 * a[i]) if c else None
        lo_i, hi_i = np.searchsorted(plc, i - look), np.searchsorted(plc, i, side="right")
        lv = list(plp[lo_i:hi_i]) + [pdl[i]]
        c = [x for x in lv if x == x and entry - maxr * dist <= x <= entry - minr * dist]
        return (max(c) + 0.1 * a[i]) if c else None
    return fn


def pool(res):
    rows = {}
    for key, parts in res.items():
        rows[key] = {}
        for part, lst in parts.items():
            x = pd.concat([t for t in lst if len(t)]) if any(len(t) for t in lst) else pd.DataFrame(columns=["R", "reason"])
            n = len(x)
            vc = x.reason.value_counts() if n else {}
            rows[key][part] = (n, vc.get("TP", 0), vc.get("SL", 0), vc.get("TIME", 0),
                               100 * vc.get("TP", 0) / n if n else np.nan, x.R.mean() if n else np.nan)
    return rows


def show(title, rows):
    print(f"\n=== {title} ===")
    print(f"{'config':<36}" + "".join(f"| {p:<26}" for p in ("train", "val", "test")))
    for key, parts in rows.items():
        cells = []
        for p in ("train", "val", "test"):
            n, w, lo, t, wr, ex = parts[p]
            cells.append(f"n={n:<4}W{w}/L{lo}/T{t} {wr:3.0f}% {ex:+.2f}R" if n else "n=0")
        print(f"{key:<36}" + "".join(f"| {c:<26}" for c in cells))


def run(tf, days, htf, max_hold, configs, symbols=("BTCUSDT", "ETHUSDT", "SOLUSDT")):
    res = {}
    for sym in symbols:
        df = b.fetch_binance_public(sym, tf, days)
        d = b.prepare(df, htf)
        n = len(d)
        cuts = {"train": (d.ts.iloc[0], d.ts.iloc[int(n * .6)]),
                "val": (d.ts.iloc[int(n * .6)], d.ts.iloc[int(n * .8)]),
                "test": (d.ts.iloc[int(n * .8)], d.ts.iloc[-1] + pd.Timedelta("1min"))}
        sfn = structure_tp(d)
        print(f"{sym} {tf}: {n} candle {df.ts.iloc[0]:%Y-%m-%d}..{df.ts.iloc[-1]:%Y-%m-%d}", flush=True)
        for setup in "AC":
            for buf in (0.5, 1.0):
                p = dict(sl_buffer_atr=buf, swing_bars=5, range_bars=48, max_gap=0.004, retest_window=12, retest_tol=0.3)
                sg = b.signals(d, setup, p)
                for mode, rr, mc in configs:
                    t = b.simulate(d, sg, rr, COST, 4, 3.0, max_hold, mc, sfn if mode == "struktur" else None)
                    key = f"{setup} buf{buf} {mode}" + (f" RR{rr:g}" if mode == "tetap" else "") + (" cf" if mc else " nocf")
                    for part, (lo, hi) in cuts.items():
                        x = t[(t.entry_ts >= lo) & (t.entry_ts < hi)] if len(t) else t
                        res.setdefault(key, {}).setdefault(part, []).append(x)
    return pool(res)


def main():
    e1 = run("15m", 730, "1h", 96, [("struktur", 2.0, 0.15)])
    show("EKSPERIMEN 1: 15m, TP struktur, arah 1H (BTC+ETH+SOL, 2 tahun)", e1)
    cfg2 = [("tetap", 2.0, 0.15), ("tetap", 3.0, 0.15), ("tetap", 2.0, None), ("tetap", 3.0, None), ("struktur", 2.0, 0.15)]
    e2 = run("1h", 1460, "4h", 48, cfg2)
    show("EKSPERIMEN 2: 1H, arah 4H (BTC+ETH+SOL, 4 tahun)", e2)
    print("\nTotal percobaan: 12 + 60 = 72")


if __name__ == "__main__":
    main()
