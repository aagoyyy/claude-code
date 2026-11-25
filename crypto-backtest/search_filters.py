#!/usr/bin/env python3
"""Tes filter regime (ADX 1H) dan sesi (WIB) untuk setup A dan C di BTC, ETH, SOL (15m, 2 tahun).
Satu filter per langkah, hasil digabung 3 aset, dipisah train 60% / val 20% / test 20%.
Percobaan: 2 setup x 2 buffer x 6 varian filter x 3 aset = 72."""
import pandas as pd
import numpy as np
import backtest as b

COST = 0.07
VARIANTS = {"dasar": (0, False), "ADX>=20": (20, False), "ADX>=25": (25, False),
            "sesi": (0, True), "ADX>=20+sesi": (20, True), "ADX>=25+sesi": (25, True)}


def apply_filter(d, sigs, adx_min, session):
    adx = d["adx"].to_numpy()
    wib = d["ts"].dt.tz_convert(b.WIB)
    hm = (wib.dt.hour * 60 + wib.dt.minute).to_numpy()
    out = []
    for i, side, sl in sigs:
        if adx_min and not (adx[i] >= adx_min):
            continue
        if session and not (14 * 60 <= hm[i] < 23 * 60 + 30):
            continue
        out.append((i, side, sl))
    return out


def main():
    res = {}
    for sym in ("BTCUSDT", "ETHUSDT", "SOLUSDT"):
        df = b.fetch_binance_public(sym, "15m", 730)
        d = b.prepare(df)
        n = len(d)
        cuts = {"train": (d.ts.iloc[0], d.ts.iloc[int(n * .6)]),
                "val": (d.ts.iloc[int(n * .6)], d.ts.iloc[int(n * .8)]),
                "test": (d.ts.iloc[int(n * .8)], d.ts.iloc[-1] + pd.Timedelta("1min"))}
        for setup in "AC":
            for buf in (0.5, 1.0):
                p = dict(sl_buffer_atr=buf, swing_bars=5, range_bars=48, max_gap=0.004, retest_window=12, retest_tol=0.3)
                base = b.signals(d, setup, p)
                for name, (am, ses) in VARIANTS.items():
                    t = b.simulate(d, apply_filter(d, base, am, ses), 2.0, COST, 4, 3.0, 96, 0.15)
                    for part, (lo, hi) in cuts.items():
                        x = t[(t.entry_ts >= lo) & (t.entry_ts < hi)] if len(t) else t
                        res.setdefault((setup, buf, name, part), []).append(x)
        print(sym, "selesai", flush=True)
    rows = []
    for (setup, buf, name, part), lst in res.items():
        x = pd.concat([l for l in lst if len(l)]) if any(len(l) for l in lst) else pd.DataFrame(columns=["R", "reason"])
        n = len(x)
        rows.append(dict(setup=setup, buf=buf, filt=name, part=part, n=n,
                         wr=100 * (x.reason == "TP").mean() if n else np.nan, exp=x.R.mean() if n else np.nan))
    r = pd.DataFrame(rows)
    w = r.pivot_table(index=["setup", "buf", "filt"], columns="part", values=["n", "wr", "exp"], sort=False)
    out = pd.DataFrame({
        "n_tr": w[("n", "train")], "wr_tr": w[("wr", "train")], "exp_tr": w[("exp", "train")],
        "n_va": w[("n", "val")], "wr_va": w[("wr", "val")], "exp_va": w[("exp", "val")],
        "n_te": w[("n", "test")], "wr_te": w[("wr", "test")], "exp_te": w[("exp", "test")]})
    pd.set_option("display.width", 200)
    print("\nGabungan BTC+ETH+SOL, R:R 1:2 (wr = % kena TP, exp = R per trade setelah biaya)")
    print(out.round(2).to_string())
    print(f"\nTotal percobaan: 72 (6 varian filter x 2 setup x 2 buffer x 3 aset)")


if __name__ == "__main__":
    main()
