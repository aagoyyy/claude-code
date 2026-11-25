// usage: node page-shots.cjs <page.html> <outPrefix> t1 t2 ...   (scene served at http://localhost:$PORT, default 8766)
const { chromium } = require('playwright');
const path = require('path');
const PORT = process.env.PORT || 8766;
const [page_, prefix, ...ts] = process.argv.slice(2);
(async () => {
  const browser = await chromium.launch({ args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
  const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });
  page.on('console', (m) => console.log('[browser]', m.text()));
  page.on('pageerror', (e) => console.log('[pageerror]', e.message));
  await page.goto(`http://localhost:${PORT}/${page_}`);
  await page.waitForFunction(() => window.__ready === true, null, { timeout: 180000 });
  for (const t of ts) {
    await page.evaluate((t) => window.__setTime(Number(t)), t);
    await page.screenshot({ path: path.join(__dirname, '../out/shots', `${prefix}_${String(t).replace('.', '_')}.png`) });
    console.log('shot', t);
  }
  await browser.close();
})();
