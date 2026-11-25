# Pine Script: Intraday Desk A/B/C

`intraday_desk.pine` adalah versi TradingView dari `crypto-backtest/backtest.py`.
Belum dikompilasi di TradingView (tidak ada akses dari lingkungan pembuatnya), jadi kalau ada error, kirim pesan errornya.

## Pasang
1. Buka chart BTCUSDT (Binance atau Bybit), timeframe 15m.
2. Pine Editor, tempel isi `intraday_desk.pine`, klik Add to chart.
3. Strategy Tester menampilkan hasil. Properties: commission 0.05%, slippage sekitar 20 tick.

## Beda dengan backtest.py
- SL dan TP dihitung dari harga close candle sinyal, bukan open candle berikutnya, jadi R tiap trade bisa sedikit melenceng.
- Hanya memuat data yang tersedia di plan TradingView lu. Plan gratis membatasi jumlah bar historis.
- Hasil kedua alat tidak akan identik. Pakai untuk membandingkan arah, bukan angka persis.

## Alert ke luar
Strategy ini mengirim JSON lewat `alert_message`. Buat alert: Condition = strategy ini, Message = `{{strategy.order.alert_message}}`,
Webhook URL = alamat penerima lu. Webhook butuh plan berbayar. Jangan sambungkan ke akun exchange dengan dana asli sebelum
lolos paper trading, dan pakai API key tanpa izin withdraw.
