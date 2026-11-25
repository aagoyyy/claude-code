#!/usr/bin/env python3
"""Trend following harian (long-only, spot, tanpa leverage) vs buy-and-hold di BTC, ETH, SOL.

Aturan:
 - Sinyal dihitung dari close hari t, posisi dipegang dari close t sampai close t+1 (tidak ada lookahead).
 - Biaya 0.10% fee + 0.05% slippage per perubahan posisi (0.15% per sisi).
 - Variasi ditetapkan sebelum melihat hasil: MA 50/100/200 dan Donchian 20/50/100 (keluar di low N/2 hari). Total 6 x 3 aset = 18 percobaan.
 - Data dibagi urut waktu 60% train / 20% validasi / 20% test per aset.
"""
import numpy as np
import pandas as pd
import backtest as b

COST = 0.0015
ASSETS = {"BTCUSDT": 3400, "ETHUSDT": 3400, "SOLUSDT": 3400}


def signals(df):
    c, h, l = df["close"], df["high"], df["low"]
    out = {}
    for n in (50, 100, 200):
        out[f"MA{n}"] = (c > c.rolling(n).mean()).astype(float).where(c.rolling(n).mean().notna(), 0.0)
    for n in (20, 50, 100):
        hh, ll = h.rolling(n).max().shift(1), l.rolling(n // 2).min().shift(1)
        pos, p = np.zeros(len(df)), 0.0
        for i in range(len(df)):
            if p == 0 and c.iloc[i] > hh.iloc[i]:
                p = 1.0
            elif p == 1 and c.iloc[i] < ll.iloc[i]:
                p = 0.0
            pos[i] = p
        out[f"Donch{n}"] = pd.Series(pos, index=df.index)
    return out


def stats(r):
    if len(r) < 30:
        return dict(ret=np.nan, cagr=np.nan, mdd=np.nan, sh=np.nan)
    eq = (1 + r).cumprod()
    yrs = len(r) / 365
    mdd = (eq / eq.cummax() - 1).min()
    return dict(ret=eq.iloc[-1] - 1, cagr=eq.iloc[-1] ** (1 / yrs) - 1, mdd=mdd,
                sh=r.mean() / r.std() * np.sqrt(365) if r.std() > 0 else np.nan)


def trades(close, pos, r):
    p = pos.shift(1).fillna(0.0)
    seg = (p != p.shift(1)).cumsum()
    res = []
    for _, g in r[p == 1].groupby(seg[p == 1]):
        res.append((1 + g).prod() - 1)
    return np.array(res)


def main():
    all_rows = []
    for sym, days in ASSETS.items():
        df = b.fetch_binance_public(sym, "1d", days).set_index("ts")
        close = df["close"]
        n = len(df)
        cuts = {"train": (0, int(n * .6)), "val": (int(n * .6), int(n * .8)), "test": (int(n * .8), n)}
        print(f"\n##### {sym}: {n} hari, {df.index[0]:%Y-%m-%d} .. {df.index[-1]:%Y-%m-%d}")
        print(f"splits: " + ", ".join(f"{k} {df.index[a]:%Y-%m}..{df.index[min(z,n)-1]:%Y-%m}" for k, (a, z) in cuts.items()))
        strategies = {"BuyHold": pd.Series(1.0, index=df.index)}
        strategies.update(signals(df))
        header = f"{'strategi':<9}" + "".join(f"| {k:<5} ret%   MDD%  Sharpe  trd " for k in cuts)
        print(header)
        for name, pos in strategies.items():
            r = close.pct_change().fillna(0.0) * pos.shift(1).fillna(0.0) - pos.diff().abs().fillna(pos.abs()) * COST
            line = f"{name:<9}"
            for k, (a, z) in cuts.items():
                st = stats(r.iloc[a:z])
                tr = trades(close.iloc[a:z], pos.iloc[a:z], r.iloc[a:z]) if name != "BuyHold" else np.array([])
                line += f"| {st['ret']*100:>9.0f} {st['mdd']*100:>6.0f} {st['sh']:>6.2f} {len(tr):>4} "
                all_rows.append(dict(sym=sym, strat=name, part=k, **st, trades=len(tr),
                                     winrate=(tr > 0).mean() if len(tr) else np.nan,
                                     exp=tr.mean() if len(tr) else np.nan))
            print(line)
    d = pd.DataFrame(all_rows)
    print("\n##### Ringkasan lintas aset (rata-rata Sharpe dan MDD per split)")
    g = d.groupby(["strat", "part"])[["sh", "mdd", "ret"]].mean().unstack("part")
    print((g["sh"]).round(2).to_string()); print("MDD rata-rata (%):"); print((g["mdd"] * 100).round(0).to_string())
    bh = d[d.strat == "BuyHold"].set_index(["sym", "part"])
    wins = 0
    print("\nStrategi yang mengalahkan Buy&Hold berdasarkan Sharpe di SEMUA split dan SEMUA aset:")
    for s in [x for x in d.strat.unique() if x != "BuyHold"]:
        ok = all(d[(d.strat == s) & (d.sym == a) & (d.part == p)].sh.iloc[0] > bh.loc[(a, p), "sh"] for a in ASSETS for p in cuts_names())
        print(f"  {s}: {'YA' if ok else 'tidak'}")
    d.to_csv("daily_results.csv", index=False)


def cuts_names():
    return ["train", "val", "test"]


if __name__ == "__main__":
    main()
