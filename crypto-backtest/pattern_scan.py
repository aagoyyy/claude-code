#!/usr/bin/env python3
"""Pemindaian pola luas (BTC, ETH, PAXG=emas) pada candle 1H, ~4 tahun.
Semua hipotesis dibuat di muka (tidak ada yang ditambah setelah melihat hasil). Entry di open candle berikutnya.
Split urut waktu: train 50% / val 25% / test 25%. Biaya: BTC & ETH 0.07% per sisi, PAXG 0.02% per sisi.
Lolos = rata-rata bersih > 0 di ketiga split dan t-stat train >= 2.0.
Perkiraan lolos karena kebetulan = N_uji x P(t>=2) x 0.5 x 0.5."""
import numpy as np
import pandas as pd
import backtest as b

COST = {"BTCUSDT": 0.0007, "ETHUSDT": 0.0007, "PAXGUSDT": 0.0002}
NAMES = list(COST)


def load(sym):
    df = b.fetch_binance_public(sym, "1h", 1500)
    d = df.set_index("ts")
    return d


def rsi(c, n=14):
    dlt = c.diff(); up = dlt.clip(lower=0).ewm(alpha=1 / n, adjust=False).mean(); dn = (-dlt.clip(upper=0)).ewm(alpha=1 / n, adjust=False).mean()
    return 100 - 100 / (1 + up / dn)


def hypotheses(d):
    c, h, l, o = d["close"], d["high"], d["low"], d["open"]
    hr = d.index.hour.to_numpy(); dow = d.index.dayofweek.to_numpy(); n = len(d)
    ret = c.pct_change()
    z = (ret / ret.rolling(100).std()).to_numpy()
    out = []
    idx = np.arange(n)
    # A. jam-hari (tahan 1 jam)
    for a in range(24):
        sig = idx[hr == (a - 1) % 24]
        for s in (1, -1):
            out.append((f"jam {a:02d} UTC {'long' if s>0 else 'short'} 1j", sig, s, 1))
    # B. blok sesi harian: masuk jam a, tahan L jam
    for a in range(24):
        sig = idx[hr == (a - 1) % 24]
        for L in (4, 8):
            for s in (1, -1):
                out.append((f"masuk {a:02d} UTC tahan {L}j {'long' if s>0 else 'short'}", sig, s, L))
    # C. hari dalam seminggu, tahan 24 jam dari 00:00 UTC
    for dw in range(7):
        sig = idx[(hr == 23) & (((dow + 1) % 7) == dw)]
        for s in (1, -1):
            out.append((f"hari {['Sen','Sel','Rab','Kam','Jum','Sab','Min'][dw]} 24j {'long' if s>0 else 'short'}", sig, s, 24))
    # D. candle besar (z-score return): momentum / pembalikan
    for k in (1.5, 2.0, 3.0):
        for dirn, mask in (("naik", z > k), ("turun", z < -k)):
            sig = idx[np.nan_to_num(mask, nan=False)]
            for mode, s in (("lanjut", 1 if dirn == "naik" else -1), ("balik", -1 if dirn == "naik" else 1)):
                for H in (1, 4, 24):
                    out.append((f"candle {dirn} z>{k} {mode} {H}j", sig, s, H))
    # E. breakout N jam
    for N in (24, 72, 168):
        hh = h.rolling(N).max().shift(1).to_numpy(); ll = l.rolling(N).min().shift(1).to_numpy(); cc = c.to_numpy()
        for dirn, mask in (("atas", cc > hh), ("bawah", cc < ll)):
            sig = idx[np.nan_to_num(mask, nan=False).astype(bool)]
            for mode, s in (("lanjut", 1 if dirn == "atas" else -1), ("balik", -1 if dirn == "atas" else 1)):
                for H in (4, 24):
                    out.append((f"breakout {N}j {dirn} {mode} {H}j", sig, s, H))
    # F. RSI ekstrem
    r = rsi(c).to_numpy()
    for thr in (20, 25, 30):
        for dirn, mask in (("oversold", r < thr), ("overbought", r > 100 - thr)):
            sig = idx[np.nan_to_num(mask, nan=False).astype(bool)]
            for mode, s in (("lanjut", -1 if dirn == "oversold" else 1), ("balik", 1 if dirn == "oversold" else -1)):
                for H in (4, 24):
                    out.append((f"RSI {thr}/{100-thr} {dirn} {mode} {H}j", sig, s, H))
    # G. posisi terhadap EMA
    for N in (24, 72, 200):
        e = c.ewm(span=N, adjust=False).mean().to_numpy(); cc = c.to_numpy()
        for dirn, mask in (("di atas", cc > e), ("di bawah", cc < e)):
            sig = idx[mask]
            for mode, s in (("lanjut", 1 if dirn == "di atas" else -1), ("balik", -1 if dirn == "di atas" else 1)):
                for H in (1, 4):
                    out.append((f"EMA{N} {dirn} {mode} {H}j", sig, s, H))
    # H. N candle searah berturut-turut
    up = (c > o).to_numpy(); dn = (c < o).to_numpy()
    for N in (3, 4, 5):
        su = np.ones(n, bool); sd = np.ones(n, bool)
        for k in range(N):
            su &= np.roll(up, k); sd &= np.roll(dn, k)
        su[:N] = sd[:N] = False
        for dirn, mask in (("naik", su), ("turun", sd)):
            sig = idx[mask]
            for mode, s in (("lanjut", 1 if dirn == "naik" else -1), ("balik", -1 if dirn == "naik" else 1)):
                for H in (1, 4):
                    out.append((f"{N} candle {dirn} {mode} {H}j", sig, s, H))
    return out


def run_trades(sig, s, H, o, c, ok, cost):
    n = len(o); res = []; nxt = 0
    for t in sig:
        if t < nxt or t + H >= n:
            continue
        if not (ok[t + 1] and ok[t + H]):
            continue
        res.append((t, s * (c[t + H] / o[t + 1] - 1) - 2 * cost))
        nxt = t + H
    return res


def tstat(x):
    x = np.asarray(x)
    return x.mean() / (x.std(ddof=1) / np.sqrt(len(x))) if len(x) > 3 and x.std() > 0 else 0.0


def main():
    allrows = []
    for sym in NAMES:
        d = load(sym)
        o, c = d["open"].to_numpy(), d["close"].to_numpy(); n = len(d)
        dow, hr = d.index.dayofweek.to_numpy(), d.index.hour.to_numpy()
        ok = np.ones(n, bool)
        if sym == "PAXGUSDT":
            ok = (dow < 5) & ~((dow == 4) & (hr >= 22))
        c1, c2 = int(n * .5), int(n * .75)
        hy = hypotheses(d)
        print(f"{sym}: {n} candle {d.index[0]:%Y-%m-%d}..{d.index[-1]:%Y-%m-%d}, {len(hy)} hipotesis", flush=True)
        for name, sig, s, H in hy:
            tr = run_trades(sig, s, H, o, c, ok, COST[sym])
            if len(tr) < 60:
                continue
            ti = np.array([x[0] for x in tr]); rr = np.array([x[1] for x in tr])
            parts = {"train": rr[ti < c1], "val": rr[(ti >= c1) & (ti < c2)], "test": rr[ti >= c2]}
            row = dict(asset=sym, name=name, n=len(rr), all_exp=rr.mean() * 100)
            for k, x in parts.items():
                row[f"n_{k}"] = len(x); row[f"e_{k}"] = x.mean() * 100 if len(x) else np.nan; row[f"t_{k}"] = tstat(x)
            row["years"] = {y: rr[pd.DatetimeIndex(d.index[ti]).year == y].mean() * 100 for y in sorted(set(pd.DatetimeIndex(d.index[ti]).year))}
            allrows.append(row)
    r = pd.DataFrame(allrows)
    N = len(r)
    p2 = 0.0228
    print(f"\nHipotesis teruji (n trade >= 60): {N}")
    ok_tr = (r.n_train >= 30) & (r.n_val >= 15) & (r.n_test >= 15)
    pos = (r.e_train > 0) & (r.e_val > 0) & (r.e_test > 0)
    surv = r[ok_tr & pos & (r.t_train >= 2.0)].copy()
    print(f"Untung (bersih) di train dengan t>=2: {int((ok_tr & (r.e_train > 0) & (r.t_train >= 2)).sum())}")
    print(f"Lolos semua (train t>=2, val>0, test>0): {len(surv)}  | perkiraan karena kebetulan saja: {N*p2*0.25:.1f}")
    strict = surv[(surv.t_val >= 1.0) & (surv.t_test >= 1.0)]
    print(f"Lolos ketat (t val dan test >= 1): {len(strict)}")
    pd.set_option("display.width", 220); pd.set_option("display.max_colwidth", 44)
    cols = ["asset", "name", "n", "e_train", "t_train", "e_val", "t_val", "e_test", "t_test"]
    if len(surv):
        surv["mint"] = surv[["t_train", "t_val", "t_test"]].min(axis=1)
        print("\nPenyintas (expectancy % per trade bersih):")
        print(surv.sort_values("mint", ascending=False)[cols].head(25).round(3).to_string(index=False))
        top = surv.sort_values("mint", ascending=False).head(6)
        print("\nPer tahun (expectancy %) untuk 6 teratas:")
        for _, x in top.iterrows():
            print(f"  {x['asset']} | {x['name']}: " + ", ".join(f"{y}:{v:+.2f}" for y, v in x["years"].items()))
    # distribusi semua hipotesis: berapa % positif di test
    print(f"\nSebagai pembanding: dari semua hipotesis, expectancy test positif pada {100*(r.e_test>0).mean():.0f}%; "
          f"dari yang train t>=2, positif di test pada {100*((r.e_test>0)[(r.t_train>=2)&(r.e_train>0)]).mean():.0f}%")
    r.drop(columns=["years"]).to_csv("pattern_scan_results.csv", index=False)


if __name__ == "__main__":
    main()
