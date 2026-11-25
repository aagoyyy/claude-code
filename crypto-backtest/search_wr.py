#!/usr/bin/env python3
"""Pencarian terbatas: adakah konfigurasi A/B/C (BTCUSDT, 5m/15m, RR>=2) dengan winrate > 70%?

Aturan main supaya tidak menipu diri sendiri:
 - Grid ditetapkan di sini sebelum melihat hasil; jumlah percobaan dilaporkan.
 - Data dibagi 60% train / 20% validasi / 20% test (urut waktu).
 - Konfigurasi dipilih dari TRAIN saja. Validasi dan test hanya dilihat setelahnya.
 - Lolos jika winrate > 70% dan expectancy > 0 di ketiga bagian, dengan n >= 30 per bagian
   (validasi/test diizinkan n >= 15 karena datanya lebih pendek, ditandai).
"""
import itertools
import sys
import numpy as np
import pandas as pd
import backtest as b

DAYS = {"15m": 730, "5m": 365}
FEE, SLIP = 0.05, 0.02
cost = FEE + SLIP


def split_stats(t, cuts):
    out = []
    for lo, hi in cuts:
        x = t[(t["entry_ts"] >= lo) & (t["entry_ts"] < hi)] if len(t) else t
        out.append(b.stats(x))
    return out


def main():
    rows = []
    trials = 0
    for tf, days in DAYS.items():
        df = b.fetch_binance_public("BTCUSDT", tf, days)
        d = b.prepare(df)
        n = len(d)
        cuts = [(d["ts"].iloc[0], d["ts"].iloc[int(n * .6)]),
                (d["ts"].iloc[int(n * .6)], d["ts"].iloc[int(n * .8)]),
                (d["ts"].iloc[int(n * .8)], d["ts"].iloc[-1] + pd.Timedelta("1min"))]
        scale = 15 / int(tf[:-1])
        print(f"{tf}: {n} candle, train/val/test per {[str(c[0].date()) for c in cuts]}", flush=True)
        for setup, k1, buf in itertools.product("ABC", (0, 1), (0.1, 0.5, 1.0)):
            p = dict(sl_buffer_atr=buf, swing_bars=(5, 12)[k1], range_bars=(48, 96)[k1],
                     max_gap=0.004, retest_window=12, retest_tol=0.3)
            sg = b.signals(d, setup, p)
            for rr, mc in itertools.product((2.0, 3.0), (None, 0.15)):
                trials += 1
                t = b.simulate(d, sg, rr, cost, 4, 3.0, int(96 * scale), mc)
                s_tr, s_va, s_te = split_stats(t, cuts)
                rows.append(dict(tf=tf, setup=setup, swing_or_range=(5, 12)[k1] if setup == "A" else (48, 96)[k1],
                                 buf=buf, rr=rr, costfilter=mc is not None,
                                 tr_n=s_tr.get("trades", 0), tr_wr=s_tr.get("win", np.nan), tr_exp=s_tr.get("exp", np.nan),
                                 va_n=s_va.get("trades", 0), va_wr=s_va.get("win", np.nan), va_exp=s_va.get("exp", np.nan),
                                 te_n=s_te.get("trades", 0), te_wr=s_te.get("win", np.nan), te_exp=s_te.get("exp", np.nan)))
        print(f"  {tf} selesai, total percobaan sejauh ini: {trials}", flush=True)
    r = pd.DataFrame(rows)
    r.to_csv("search_results.csv", index=False)
    print(f"\nTotal percobaan: {trials}")

    print("\nWinrate tertinggi di TRAIN (n>=30):")
    top = r[r.tr_n >= 30].sort_values("tr_wr", ascending=False).head(8)
    print(top.round(2).to_string(index=False))

    ok = r[(r.tr_n >= 30) & (r.tr_wr > 70) & (r.tr_exp > 0)]
    print(f"\nKonfigurasi dengan winrate > 70% di train: {len(ok)}")
    if len(ok):
        print(ok.round(2).to_string(index=False))

    full = r[(r.tr_n >= 30) & (r.va_n >= 15) & (r.te_n >= 15) &
             (r.tr_wr > 70) & (r.va_wr > 70) & (r.te_wr > 70) & (r.tr_exp > 0) & (r.va_exp > 0) & (r.te_exp > 0)]
    print(f"Lolos semua kriteria (>70% WR dan expectancy>0 di train, val, test): {len(full)}")
    print("\nTerbaik berdasar expectancy rata-rata val+test (n val,test >= 15):")
    c = r[(r.va_n >= 15) & (r.te_n >= 15) & (r.tr_n >= 30)].copy()
    c["vt_exp"] = (c.va_exp + c.te_exp) / 2
    print(c.sort_values("vt_exp", ascending=False).head(6).round(2).to_string(index=False))


if __name__ == "__main__":
    main()
