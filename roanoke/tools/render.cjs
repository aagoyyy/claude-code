// Deterministic frame-by-frame export: steps the scene clock, screenshots each frame, encodes with ffmpeg.
// usage: node render.cjs [fps=24] [outfile]      (scene must be served at http://localhost:$PORT, default 8766)
const { chromium } = require('playwright');
const { spawnSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 8766;
const fps = Number(process.argv[2] || 24);
const outFile = path.resolve(process.argv[3] || path.join(__dirname, '../out/roanoke-scene-test.mp4'));
const framesDir = path.join(__dirname, '../out/frames');
fs.rmSync(framesDir, { recursive: true, force: true });
fs.mkdirSync(framesDir, { recursive: true });

(async () => {
  const browser = await chromium.launch({ args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
  const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });
  page.on('pageerror', (e) => console.log('[pageerror]', e.message));
  await page.goto(`http://localhost:${PORT}/index.html?t=0`);
  await page.waitForFunction(() => window.__ready === true, null, { timeout: 180000 });
  const tEnd = await page.evaluate(() => window.__T_END);
  const n = Math.round(tEnd * fps);
  const t0 = Date.now();
  for (let i = 0; i <= n; i++) {
    await page.evaluate((t) => window.__setTime(t), i / fps);
    await page.screenshot({ path: path.join(framesDir, `f${String(i).padStart(5, '0')}.jpg`), type: 'jpeg', quality: 94 });
    if (i % 48 === 0) console.log(`frame ${i}/${n}  (${((Date.now() - t0) / 1000).toFixed(0)}s)`);
  }
  await browser.close();

  const r = spawnSync('ffmpeg', ['-y', '-framerate', String(fps), '-i', path.join(framesDir, 'f%05d.jpg'),
    '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-crf', '17', '-preset', 'medium', '-movflags', '+faststart', outFile], { stdio: 'inherit' });
  if (r.status !== 0) process.exit(r.status);
  console.log('wrote', outFile);
})();
