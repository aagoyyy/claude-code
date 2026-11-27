// Generic deterministic clip export for any page exposing window.__setTime / __ready.
// usage: node render-page.cjs "<page.html?query>" <seconds> <fps> <out.mp4>
const { chromium } = require('playwright');
const { spawnSync } = require('child_process');
const fs = require('fs'), path = require('path');
const PORT = process.env.PORT || 8766;
const [pg, secs, fps, out] = process.argv.slice(2);
const dir = path.join(__dirname, '../out/frames-page'); fs.rmSync(dir, { recursive: true, force: true }); fs.mkdirSync(dir, { recursive: true });
(async () => {
  const b = await chromium.launch({ args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
  const p = await b.newPage({ viewport: { width: 1280, height: 720 } });
  p.on('pageerror', (e) => console.log('[pageerror]', e.message));
  await p.goto(`http://localhost:${PORT}/${pg}`);
  await p.waitForFunction(() => window.__ready === true, null, { timeout: 120000 });
  const n = Math.round(Number(secs) * Number(fps));
  for (let i = 0; i <= n; i++) {
    await p.evaluate((t) => window.__setTime(t), i / Number(fps));
    await p.screenshot({ path: path.join(dir, `f${String(i).padStart(5, '0')}.jpg`), type: 'jpeg', quality: 95 });
  }
  await b.close();
  const r = spawnSync('ffmpeg', ['-y', '-v', 'error', '-framerate', fps, '-i', path.join(dir, 'f%05d.jpg'), '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-crf', '17', '-movflags', '+faststart', path.resolve(out)], { stdio: 'inherit' });
  process.exit(r.status || 0);
})();
