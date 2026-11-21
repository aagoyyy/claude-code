"""Draft sound for the 10:55 film: ambience + music + battle SFX timed to the shot list, plus any narration clips that exist.
usage: python3 mix10.py out.wav   (reuses the synth helpers of mix2.py; needs numpy + ffmpeg)"""
import os, re, sys, subprocess
D = os.path.dirname(os.path.abspath(__file__))
src = open(os.path.join(D, 'mix2.py')).read()
head = src.split('# =========== TIMELINE')[0]
head = head.replace('TOT=2272', 'TOT=15720')           # 655 s at 24 fps
ns = {'__file__': os.path.join(D, 'mix2.py')}
exec(compile(head, 'mix2_head', 'exec'), ns)
globals().update(ns)

shots = re.findall(r"id: '([\d.]+)', dur: (\d+), ch: (\d+)", open(os.path.join(D, '..', 'video', 'src', 'stills', 'shots.ts')).read())
start = {}; acc = 0.0; chs = {}
for i, d, c in shots:
    start[i] = acc; chs.setdefault(int(c), [acc, 0]); acc += int(d); chs[int(c)][1] = acc
T0 = lambda sid: start[sid]
fr = lambda sec: sec * 24.0      # mix2 helpers take frames @24

# ---------------- ambience per chapter ----------------
amb = {0: 'rumble', 1: 'wind', 2: 'wind', 3: 'wind', 4: 'wind', 5: 'gust', 6: 'rumble', 7: 'rumble', 8: 'rumble', 9: 'gust', 10: 'sea', 11: 'gust'}
for c, (a, b) in chs.items():
    bed(a, min(b + 1.5, 654.0), amb[c], 0.5 if amb[c] != 'rumble' else 0.7, 2.5)
bed(T0('10.11'), T0('10.17'), 'cave', 0.6, 2.0)
bed(T0('10.17'), 654.0, 'night', 0.7, 2.0)
bed(T0('6.1'), T0('7.1'), 'sea', 0.0)  # (no-op placeholder)
# rain in the trench chapters
for a, b in [(T0('6.1'), T0('6.9')), (T0('6.13'), T0('7.1')), (T0('8.1'), T0('8.14'))]:
    bed(a, b, 'sea', 0.18, 1.5)

# ---------------- battle windows (shot ranges) ----------------
def battle(a_id, b_id, density=0.45, far=1, booms=()):
    a, b = T0(a_id), T0(b_id)
    f = fr(a)
    while f < fr(b):
        put(rifle(far, 0) * rng.uniform(0.6, 1.0), f / 24.0 + rng.random() * 0.1, 1, rng.uniform(-0.8, 0.8), 0.3)
        if rng.random() < 0.5: put(whiz() * 0.7, f / 24.0 + 0.2, 1, rng.uniform(-0.8, 0.8), 0.15)
        f += fr(density) * rng.uniform(0.7, 1.4)
    for sid in booms: explode(fr(T0(sid)), rng.uniform(-0.6, 0.6), 1.0, 3.0)
battle('2.7', '2.16', 0.4, 1, ['2.10'])
battle('4.8', '4.14', 0.4, 1, ['4.10'])
battle('6.4', '6.9', 0.5, 1, ['6.5', '6.6'])
battle('8.5', '8.14', 0.35, 1, ['8.9', '8.13'])
battle('9.10', '9.13', 0.7, 2, ['9.11'])
battle('10.17', '10.20', 0.6, 1, [])
battle('10.8', '10.10', 0.9, 1, [])
for sid in ('2.12', '4.11', '6.7'):                       # the three hits: loud shot, ring, heartbeat
    t = fr(T0(sid)) / 24.0
    put(rifle(0, 1) * 1.6, t, 1, 0.1, 0.6); put(boom(1.6, 0.45), t + 0.02, 1, 0, 0.4); heart(t + 2.0, 6, 66, 0.7); tinnitus(t + 2.0, 3.4, 0.12)
explode(fr(T0('10.4')), 0, 1.0, 3.2)                      # the crash
explode(fr(T0('10.3')) , 0.2, 0.5, 2.0)
# sea, strokes, digging
tt = T0('10.6')
while tt < T0('10.8'): put(lp(nz(0.55), 1300) * np.sin(np.linspace(0, np.pi, S(0.55))) ** 2 * 0.5, tt, 1, 0, 0.25); tt += 0.8
tt = T0('10.13')
while tt < T0('10.17'): put(lp(hp(nz(0.3), 300), 2200) * env(S(0.3), .004, .07) * .4, tt, 1, rng.uniform(-.3, .3), .15); tt += 0.5
# whooshes on the map shots
for sid in ('2.5', '4.1', '5.7', '5.8', '9.7'): whoosh(T0(sid) - 0.2, 1.2, 0.5, True)

# ---------------- music: slow minor pads per chapter, cello lines, timpani on key beats ----------------
pads = {0: [110, 164.8, 261.6], 1: [130.8, 196, 329.6], 2: [110, 164.8, 220], 3: [174.6, 261.6, 349.2], 4: [98, 146.8, 233.1], 5: [110, 164.8, 220], 6: [87.3, 130.8, 207.7], 7: [82.4, 123.5, 196], 8: [98, 146.8, 233.1], 9: [110, 164.8, 261.6], 10: [87.3, 130.8, 220], 11: [130.8, 196, 329.6, 523.2]}
for c, (a, b) in chs.items(): pad(pads[c], a, min(b + 2, 654.5), 0.55)
for c, (a, b) in chs.items():
    t = a + 1.0
    while t < b - 3:
        cello(pads[c][0] * 2 * rng.choice([1, 1.125, 1.2, 1.334]), t, rng.uniform(2.5, 4.5), 1.0); t += rng.uniform(5, 9)
for sid in ('2.12', '4.11', '6.7', '8.10', '10.4', '10.17', '10.21', '1.12', '8.13'): timp(T0(sid) - 0.02, 1.2)
for c, (a, b) in chs.items(): timp(a, 0.8); riser(a - 1.6, 1.6, 0.5)
for t in np.arange(T0('10.17'), 654.0, 0.32): timp(t, 0.18)
pulse(T0('10.17'), 654.0, 110, 3.2, 0.12)
MUS *= np.minimum(1, np.minimum(T / 2.5, (655 - T) / 5)).clip(0, 1)

# ---------------- narration clips that exist ----------------
vo = np.zeros(N)
for ch, off in ((0, 1.0), (1, 1.0), (5, 1.0)):
    f = os.path.join(D, 'vo10', f'ch{ch}.mp3')
    if os.path.exists(f) and ch in chs:
        subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-i', f, '-ar', str(SR), '-ac', '1', '-f', 'f32le', '/tmp/_v.raw'], check=True)
        x = np.fromfile('/tmp/_v.raw', '<f4').astype(np.float64); i = S(chs[ch][0] + off); n = min(len(x), N - i); vo[i:i + n] += x[:n]

# ---------------- mix ----------------
irn = S(2.4); t_ = np.arange(irn) / SR
irL = lp(rng.standard_normal(irn) * np.exp(-t_ / 0.55), 3500); irR = lp(rng.standard_normal(irn) * np.exp(-t_ / 0.55), 3500)
irL /= np.abs(irL).sum() / 6; irR /= np.abs(irR).sum() / 6
def conv(x, ir):
    n = 1 << int(np.ceil(np.log2(len(x) + len(ir)))); return np.fft.irfft(np.fft.rfft(x, n) * np.fft.rfft(ir, n), n)[:len(x)]
rl = conv(WET[0], irL); rr = conv(WET[1], irR)
dv = np.convolve(np.abs(vo), np.ones(S(.12)) / S(.12), 'same'); duck = 1 - 0.78 * np.clip(dv / 0.04, 0, 1); duck = np.convolve(duck, np.ones(S(.25)) / S(.25), 'same')
outL = vo * 1.5 + (L + rl) * 0.40 * (0.35 + 0.65 * duck) + (MUS * .7 + AMB * .5) * duck
outR = vo * 1.5 + (R + rr) * 0.40 * (0.35 + 0.65 * duck) + (MUS * .7 + AMB * .5) * duck
def comp(x): y = x.copy(); m = np.abs(y) > .35; y[m] = np.sign(y[m]) * (.35 + (np.abs(y[m]) - .35) * .4); return y
outL = np.tanh(comp(outL) * 1.1); outR = np.tanh(comp(outR) * 1.1)
pk = max(np.abs(outL).max(), np.abs(outR).max()); outL *= .92 / pk; outR *= .92 / pk
import wave
pcm = (np.stack([outL, outR], 1) * 32767).astype('<i2')
with wave.open(sys.argv[1], 'wb') as w: w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes(pcm.tobytes())
print('ok', N / SR)
