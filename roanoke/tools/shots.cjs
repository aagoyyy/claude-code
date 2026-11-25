// usage: node shots.cjs 2 8 12.3   (needs the scene served at http://localhost:$PORT, default 8766)
const { chromium } = require('playwright');
const path = require('path');
const PORT = process.env.PORT || 8766;
const times = process.argv.slice(2).map(Number);
(async () => {
  const browser = await chromium.launch({ args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
  const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });
  page.on('console', (m) => { if (m.type() === 'error') console.log('[browser]', m.text()); });
  page.on('pageerror', (e) => console.log('[pageerror]', e.message));
  await page.goto(`http://localhost:${PORT}/index.html?t=0`);
  await page.waitForFunction(() => window.__ready === true, null, { timeout: 180000 });
  for (const t of times) {
    await page.evaluate((t) => window.__setTime(t), t);
    await page.screenshot({ path: path.join(__dirname, '../out/shots', `t${String(t).replace('.', '_')}.png`) });
    console.log('shot', t);
  }
  await browser.close();
})();
