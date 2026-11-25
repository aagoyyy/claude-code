const { chromium } = require('playwright');
const times = process.argv.slice(2).map(Number);
(async () => {
  const browser = await chromium.launch({ args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
  const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });
  page.on('console', m => { if (m.type() === 'error' || m.type() === 'warning') console.log('[browser]', m.text()); });
  page.on('pageerror', e => console.log('[pageerror]', e.message));
  await page.goto('http://localhost:8765/index.html?t=0');
  await page.waitForFunction(() => window.__ready === true, null, { timeout: 120000 });
  for (const t of times) {
    await page.evaluate((t) => window.__setTime(t), t);
    await page.screenshot({ path: `/home/user/claude-code/sun-vanishes/out/shots/t${String(t).replace('.', '_')}.png` });
    console.log('shot', t);
  }
  await browser.close();
})();
