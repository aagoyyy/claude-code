# Crypto intraday backtester

Tes setup A (pullback EMA), B (sweep & reclaim), C (break & retest) dari Intraday Crypto Desk.

```bash
pip install -r requirements.txt
python backtest.py --symbol BTC/USDT --days 365          # data Binance via ccxt
python backtest.py --csv data.csv --rr 1.5 2 3           # CSV: ts/open/high/low/close/volume
python backtest.py --synthetic                           # tes kode saja
```

Catatan: sinyal dari candle close, entry di open berikutnya; SL menang jika SL dan TP kena di candle yang sama;
biaya = fee + slippage pergi-pulang; output in-sample vs out-of-sample (30% terakhir).
Hasil backtest bukan jaminan. Perlu n >= 30 trade out-of-sample dan expectancy > 0 setelah biaya.
