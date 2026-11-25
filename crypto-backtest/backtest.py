#!/usr/bin/env python3
"""Backtester setup intraday A/B/C (lihat Intraday Crypto Desk).

A = Pullback ke EMA searah tren 1H
B = Sweep & reclaim di tepi range
C = Break & retest level Donchian

Aturan yang dipakai sama dengan plan: 1 posisi sekaligus, maks N trade/hari,
berhenti kalau rugi harian mencapai -3R. Hasil dalam R (1R = jarak entry ke SL).

Anti-lookahead:
 - Sinyal dihitung dari candle yang sudah close, entry di OPEN candle berikutnya.
 - Indikator 1H di-shift 1 candle 1H sebelum dipakai di 15m.
 - Kalau SL dan TP kena di candle yang sama, dianggap SL duluan (konservatif).

Contoh:
  python backtest.py --symbol BTC/USDT --days 365            # tarik data Binance
  python backtest.py --csv data.csv                          # pakai CSV sendiri
  python backtest.py --synthetic                             # tes pipeline tanpa internet
"""
import argparse
import sys
import numpy as np
import pandas as pd

WIB = "Asia/Jakarta"


# ---------------------------------------------------------------- data
def fetch_ccxt(exchange, symbol, tf, days):
    import ccxt
    ex = getattr(ccxt, exchange)({"enableRateLimit": True})
    ms = ex.parse_timeframe(tf) * 1000
    since = ex.milliseconds() - days * 86_400_000
    rows = []
    while True:
        batch = ex.fetch_ohlcv(symbol, tf, since=since, limit=1000)
        if not batch:
            break
        rows += batch
        nxt = batch[-1][0] + ms
        if nxt <= since or len(batch) < 2:
            break
        since = nxt
        if nxt >= ex.milliseconds():
            break
    df = pd.DataFrame(rows, columns=["ts", "open", "high", "low", "close", "volume"])
    return clean(df)


def fetch_binance_public(symbol, tf, days):
    """Candle Binance dari mirror data publik (tanpa API key, tanpa ccxt). symbol: BTCUSDT atau BTC/USDT."""
    import json
    import time
    import urllib.request
    sym = symbol.replace("/", "").upper()
    step = {"1m": 60, "5m": 300, "15m": 900, "1h": 3600}[tf] * 1000
    start = int(time.time() * 1000) - days * 86_400_000
    rows = []
    while True:
        url = (f"https://data-api.binance.vision/api/v3/klines?symbol={sym}&interval={tf}"
               f"&startTime={start}&limit=1000")
        with urllib.request.urlopen(url, timeout=30) as r:
            batch = json.load(r)
        if not batch:
            break
        rows += [[k[0], float(k[1]), float(k[2]), float(k[3]), float(k[4]), float(k[5])] for k in batch]
        start = batch[-1][0] + step
        if len(batch) < 1000:
            break
    df = pd.DataFrame(rows, columns=["ts", "open", "high", "low", "close", "volume"])
    # buang candle terakhir kalau belum close
    return clean(df.iloc[:-1])


def load_csv(path):
    df = pd.read_csv(path)
    df.columns = [c.lower() for c in df.columns]
    tcol = next(c for c in ("ts", "timestamp", "time", "date", "datetime") if c in df.columns)
    if np.issubdtype(df[tcol].dtype, np.number):
        unit = "ms" if df[tcol].iloc[0] > 1e11 else "s"
        df["ts"] = pd.to_datetime(df[tcol], unit=unit, utc=True)
    else:
        df["ts"] = pd.to_datetime(df[tcol], utc=True)
    return clean(df[["ts", "open", "high", "low", "close", "volume"]])


def synthetic(days, seed=7):
    """Random walk dengan rezim tren/range berganti. Hanya untuk tes kode, bukan hasil nyata."""
    rng = np.random.default_rng(seed)
    n = days * 96
    drift = np.zeros(n)
    i = 0
    while i < n:
        L = int(rng.integers(150, 900))
        drift[i:i + L] = rng.choice([-1, 0, 0, 1]) * 0.00004
        i += L
    ret = drift + rng.normal(0, 0.0017, n)
    close = 60000 * np.exp(np.cumsum(ret))
    open_ = np.r_[close[0], close[:-1]]
    spread = np.abs(rng.normal(0, 0.0011, n)) * close
    high = np.maximum(open_, close) + spread
    low = np.minimum(open_, close) - spread
    ts = pd.date_range("2025-01-01", periods=n, freq="15min", tz="UTC")
    return pd.DataFrame({"ts": ts, "open": open_, "high": high, "low": low,
                         "close": close, "volume": rng.uniform(50, 500, n)})


def clean(df):
    df = df.drop_duplicates("ts").sort_values("ts").reset_index(drop=True)
    if not np.issubdtype(df["ts"].dtype, np.datetime64):
        df["ts"] = pd.to_datetime(df["ts"], unit="ms", utc=True)
    return df


# ---------------------------------------------------------- indicators
def ema(s, n):
    return s.ewm(span=n, adjust=False).mean()


def atr(df, n=14):
    pc = df["close"].shift(1)
    tr = pd.concat([df["high"] - df["low"], (df["high"] - pc).abs(), (df["low"] - pc).abs()], axis=1).max(axis=1)
    return tr.ewm(alpha=1 / n, adjust=False).mean()


def prepare(df):
    d = df.copy()
    d["ema20"] = ema(d["close"], 20)
    d["ema50"] = ema(d["close"], 50)
    d["atr"] = atr(d)
    # tren 1H, hanya memakai candle 1H yang SUDAH close (shift 1)
    h = d.set_index("ts")["close"].resample("1h").last().dropna().to_frame("c")
    h["e20"] = ema(h["c"], 20)
    h["e50"] = ema(h["c"], 50)
    h["e20_up"] = h["e20"] > h["e20"].shift(3)
    h["e20_dn"] = h["e20"] < h["e20"].shift(3)
    h["trend"] = np.where((h["c"] > h["e50"]) & h["e20_up"], 1,
                          np.where((h["c"] < h["e50"]) & h["e20_dn"], -1, 0))
    h["gap"] = (h["e20"] - h["e50"]).abs() / h["c"]
    h = h[["trend", "gap"]].shift(1)
    # label 1H = awal jam, jadi setelah shift(1) nilainya baru terpakai saat jam berikutnya mulai
    return d.set_index("ts").join(h.reindex(d["ts"]).ffill()).reset_index()


# ------------------------------------------------------------- setups
def signals(d, setup, p):
    """Return list of (signal_bar_index, side, sl_price, level_tag). Entry di open bar index+1."""
    o, h, l, c = (d[k].to_numpy() for k in ("open", "high", "low", "close"))
    e20, e50, a = d["ema20"].to_numpy(), d["ema50"].to_numpy(), d["atr"].to_numpy()
    tr, gap = d["trend"].to_numpy(), d["gap"].to_numpy()
    n = len(d)
    out = []
    buf = p["sl_buffer_atr"]
    warm = 120

    if setup == "A":
        sw = p["swing_bars"]
        for i in range(warm, n - 1):
            if np.isnan(tr[i]) or np.isnan(a[i]):
                continue
            if tr[i] == 1 and l[i - 1] <= e20[i - 1] and c[i] > o[i] and c[i] > e20[i] and c[i] > e50[i]:
                sl = l[i - sw:i + 1].min() - buf * a[i]
                out.append((i, 1, sl))
            elif tr[i] == -1 and h[i - 1] >= e20[i - 1] and c[i] < o[i] and c[i] < e20[i] and c[i] < e50[i]:
                sl = h[i - sw:i + 1].max() + buf * a[i]
                out.append((i, -1, sl))

    elif setup == "B":
        N = p["range_bars"]
        hi = pd.Series(h).rolling(N).max().shift(1).to_numpy()
        lo = pd.Series(l).rolling(N).min().shift(1).to_numpy()
        for i in range(warm, n - 1):
            if np.isnan(tr[i]) or np.isnan(hi[i]) or np.isnan(gap[i]):
                continue
            if tr[i] != 0 or gap[i] > p["max_gap"]:      # hanya saat tidak ada tren 1H jelas
                continue
            if l[i] < lo[i] and c[i] > lo[i] and c[i] > o[i]:
                out.append((i, 1, l[i] - buf * a[i]))
            elif h[i] > hi[i] and c[i] < hi[i] and c[i] < o[i]:
                out.append((i, -1, h[i] + buf * a[i]))

    elif setup == "C":
        N, W, tol = p["range_bars"], p["retest_window"], p["retest_tol"]
        hi = pd.Series(h).rolling(N).max().shift(1).to_numpy()
        lo = pd.Series(l).rolling(N).min().shift(1).to_numpy()
        pend = None  # (side, level, expire_idx)
        for i in range(warm, n - 1):
            if np.isnan(hi[i]) or np.isnan(a[i]):
                continue
            if pend is None:
                if c[i] > hi[i]:
                    pend = (1, hi[i], i + W)
                elif c[i] < lo[i]:
                    pend = (-1, lo[i], i + W)
                continue
            side, lvl, exp = pend
            if i > exp or (side == 1 and c[i] < lvl - a[i]) or (side == -1 and c[i] > lvl + a[i]):
                pend = None
                continue
            if side == 1 and l[i] <= lvl + tol * a[i] and c[i] > lvl and c[i] > o[i]:
                out.append((i, 1, min(l[i], lvl) - buf * a[i]))
                pend = None
            elif side == -1 and h[i] >= lvl - tol * a[i] and c[i] < lvl and c[i] < o[i]:
                out.append((i, -1, max(h[i], lvl) + buf * a[i]))
                pend = None
    return out


# ------------------------------------------------------------- engine
def simulate(d, sigs, rr, cost_pct, max_per_day, daily_stop_r, max_hold, max_cost_r=None):
    o, h, l = (d[k].to_numpy() for k in ("open", "high", "low"))
    ts = d["ts"]
    day = ts.dt.tz_convert(WIB).dt.date.to_numpy()
    n = len(d)
    trades = []
    free_at = 0
    day_trades, day_r, cur_day = 0, 0.0, None
    for i, side, sl in sigs:
        e = i + 1
        if e >= n or e < free_at:
            continue
        if day[e] != cur_day:
            cur_day, day_trades, day_r = day[e], 0, 0.0
        if day_trades >= max_per_day or day_r <= -daily_stop_r:
            continue
        entry = o[e]
        dist = (entry - sl) * side
        if dist <= 0 or dist / entry < 0.0005:   # stop terbalik atau terlalu rapat (<0.05%)
            continue
        if max_cost_r is not None and 2 * cost_pct / 100 * entry / dist > max_cost_r:
            continue                         # stop terlalu rapat: biaya memakan terlalu banyak R
        tp = entry + side * rr * dist
        exit_i, exit_px, reason = None, None, None
        for j in range(e, min(n, e + max_hold)):
            hit_sl = (l[j] <= sl) if side == 1 else (h[j] >= sl)
            hit_tp = (h[j] >= tp) if side == 1 else (l[j] <= tp)
            if hit_sl:                       # SL diprioritaskan bila satu candle kena keduanya
                exit_i, exit_px, reason = j, sl, "SL"; break
            if hit_tp:
                exit_i, exit_px, reason = j, tp, "TP"; break
        if exit_i is None:
            exit_i = min(n, e + max_hold) - 1
            exit_px, reason = d["close"].iloc[exit_i], "TIME"
        gross = (exit_px - entry) * side / dist
        cost = 2 * cost_pct / 100 * entry / dist     # fee + slippage pergi-pulang, dalam R
        r = gross - cost
        trades.append({"entry_ts": ts.iloc[e], "exit_ts": ts.iloc[exit_i], "side": "L" if side == 1 else "S",
                       "entry": entry, "sl": sl, "tp": tp, "reason": reason,
                       "risk_pct": dist / entry * 100, "R": r})
        free_at = exit_i + 1
        day_trades += 1
        day_r += r
    return pd.DataFrame(trades)


def stats(t):
    if t is None or len(t) == 0:
        return dict(trades=0)
    r = t["R"].to_numpy()
    eq = np.cumsum(r)
    dd = (np.maximum.accumulate(np.r_[0, eq])[1:] - eq).max()
    gw, gl = r[r > 0].sum(), -r[r < 0].sum()
    return dict(trades=len(r), win=100 * (r > 0).mean(), exp=r.mean(), total=r.sum(),
                pf=gw / gl if gl > 0 else float("inf"), maxdd=dd,
                avg_risk=t["risk_pct"].mean())


def fmt(name, s):
    if s["trades"] == 0:
        return f"{name:<18} tidak ada trade"
    return (f"{name:<18} n={s['trades']:<4} win={s['win']:5.1f}%  exp={s['exp']:+.3f}R  "
            f"total={s['total']:+7.1f}R  PF={s['pf']:.2f}  maxDD={s['maxdd']:.1f}R  stop~{s['avg_risk']:.2f}%")


# --------------------------------------------------------------- main
def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--exchange", default="binance-public", help="binance-public (tanpa key) atau nama exchange ccxt")
    ap.add_argument("--symbol", default="BTC/USDT")
    ap.add_argument("--tf", default="15m")
    ap.add_argument("--days", type=int, default=365)
    ap.add_argument("--csv")
    ap.add_argument("--synthetic", action="store_true")
    ap.add_argument("--rr", type=float, nargs="+", default=[1.5, 2.0])
    ap.add_argument("--fee", type=float, default=0.05, help="fee taker per sisi, %%")
    ap.add_argument("--slip", type=float, default=0.02, help="slippage per sisi, %%")
    ap.add_argument("--max-per-day", type=int, default=4)
    ap.add_argument("--daily-stop-r", type=float, default=3.0)
    ap.add_argument("--max-cost-r", type=float, default=0.15, help="lewati trade jika biaya > X R (0 = nonaktif)")
    ap.add_argument("--max-hold", type=int, default=96, help="bar maksimal per trade")
    ap.add_argument("--oos", type=float, default=0.3, help="porsi data terakhir untuk out-of-sample")
    ap.add_argument("--out", default="trades.csv")
    a = ap.parse_args()

    if a.synthetic:
        df = synthetic(a.days)
        print("!! DATA SINTETIS: hanya untuk tes kode, angkanya tidak bermakna.\n")
    elif a.csv:
        df = load_csv(a.csv)
    elif a.exchange == "binance-public":
        df = fetch_binance_public(a.symbol, a.tf, a.days)
    else:
        df = fetch_ccxt(a.exchange, a.symbol, a.tf, a.days)
    if len(df) < 500:
        sys.exit("Data terlalu sedikit.")
    print(f"Data: {len(df)} candle {df['ts'].iloc[0]:%Y-%m-%d} -> {df['ts'].iloc[-1]:%Y-%m-%d}")
    d = prepare(df)
    cost = a.fee + a.slip
    p = dict(sl_buffer_atr=0.1, swing_bars=5, range_bars=48, max_gap=0.004, retest_window=12, retest_tol=0.3)
    split = d["ts"].iloc[int(len(d) * (1 - a.oos))]
    all_trades = []
    for rr in a.rr:
        print(f"\n=== R:R target {rr} | biaya {cost:.3f}%/sisi | OOS mulai {split:%Y-%m-%d} ===")
        for s in "ABC":
            t = simulate(d, signals(d, s, p), rr, cost, a.max_per_day, a.daily_stop_r, a.max_hold, a.max_cost_r or None)
            if len(t):
                t["setup"], t["rr"] = s, rr
                all_trades.append(t)
            ins = t[t["entry_ts"] < split] if len(t) else t
            oos = t[t["entry_ts"] >= split] if len(t) else t
            print(fmt(f"{s} semua", stats(t)))
            print(fmt(f"{s}   in-sample", stats(ins)))
            print(fmt(f"{s}   out-of-sample", stats(oos)))
    if all_trades:
        pd.concat(all_trades).to_csv(a.out, index=False)
        print(f"\nDaftar trade disimpan di {a.out}")
    print("\nCara baca: yang penting expectancy out-of-sample tetap positif setelah biaya, "
          "dan n >= 30. Kalau cuma bagus di in-sample, itu overfit.")


if __name__ == "__main__":
    main()
