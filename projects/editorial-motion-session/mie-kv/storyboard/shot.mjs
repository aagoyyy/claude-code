import { createRequire } from 'node:module'; import fs from 'node:fs'; import path from 'node:path';
let chromium; try { ({ chromium } = await import('playwright')); } catch { ({ chromium } = createRequire('/opt/npm-tools/node_modules/')('playwright')); }
const here = path.dirname(new URL(import.meta.url).pathname); fs.mkdirSync(path.join(here, 'png'), { recursive: true });
const want = process.argv.slice(2);
const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1080, height: 1920 } });
for (const f of fs.readdirSync(path.join(here, 'svg')).filter(f => f.endsWith('.svg'))) {
  const n = f.replace('.svg', ''); if (want.length && !want.includes(n.slice(1))) continue;
  await p.goto('file://' + path.join(here, 'svg', f)); await p.waitForTimeout(300);
  await p.screenshot({ path: path.join(here, 'png', n + '.png') }); console.log(n);
}
await b.close();
