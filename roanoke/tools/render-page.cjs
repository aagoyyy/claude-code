// Generic deterministic clip export for any page exposing window.__setTime / __ready.
// usage: node render-page.cjs "<page.html?query>" <seconds> <fps> <out.mp4> [subframes=1] [shutter=0.5]
// subframes>1 adds motion blur: each output frame averages N sub-frames spread over `shutter` of the frame time (0.5 = 180 degree shutter)
const { chromium } = require('playwright');
const { spawnSync } = require('child_process');
const fs = require('fs'), path = require('path');
const PORT = process.env.PORT || 8766;
const [pg, secs, fps, out, subArg, shutArg] = process.argv.slice(2);
const N = Math.max(1, parseInt(subArg || '1', 10)), SHUT = parseFloat(shutArg || '0.5');
const dir = path.join(__dirname, '../out/frames-page'); fs.rmSync(dir, { recursive: true, force: true }); fs.mkdirSync(dir, { recursive: true });
(async () => {
  const b = await chromium.launch({ args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
  const p = await b.newPage({ viewport: { width: 1280, height: 720 } });
  p.on('pageerror', (e) => console.log('[pageerror]', e.message));
  await p.goto(`http://localhost:${PORT}/${pg}`);
  await p.waitForFunction(() => window.__ready === true, null, { timeout: 120000 });
  const n = Math.round(Number(secs) * Number(fps));
  for (let i = 0; i <= n; i++) {
    for (let k = 0; k < N; k++) {
      const t = i / Number(fps) + (N > 1 ? ((k + 0.5) / N - 0.5) * SHUT / Number(fps) : 0);
      await p.evaluate((t) => window.__setTime(Math.max(0, t)), t);
      await p.screenshot({ path: path.join(dir, `f${String(i * N + k).padStart(6, '0')}.jpg`), type: 'jpeg', quality: 95 });
    }
  }
  await b.close();
  const vf = N > 1 ? `tmix=frames=${N},select='eq(mod(n\\,${N})\\,${N - 1})',fps=${fps}` : `fps=${fps}`;
  const r = spawnSync('ffmpeg', ['-y', '-v', 'error', '-framerate', String(Number(fps) * N), '-i', path.join(dir, 'f%06d.jpg'), '-vf', vf, '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-crf', '17', '-movflags', '+faststart', path.resolve(out)], { stdio: 'inherit' });
  process.exit(r.status || 0);
})();
