const { chromium } = require('playwright');
const FLOOR = Number(process.argv[2] || 0.8065);
(async () => {
  const b = await chromium.launch({ args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
  const p = await b.newPage({ viewport: { width: 640, height: 360 } });
  await p.goto('http://localhost:8766/puppets.html?mode=walk&ss=1');
  await p.waitForFunction(() => window.__ready === true);
  const r = await p.evaluate((FLOOR) => {
    const it = window.__items[1].p, L = it.parts.legs.L.ank, root = it.root, tmp = L.position.clone();
    const dt = 0.002, bins = Array.from({ length: 10 }, () => ({ n: 0, e: 0, y: 0 }));
    let prev = null;
    for (let t = 0; t < 3; t += dt) {
      it.pose(t, 'walk', 0); root.updateMatrixWorld(true);
      const w = L.getWorldPosition(tmp), x = w.x - root.position.x, y = w.y;
      if (prev !== null) { const vf = (x - prev) / dt, u = (t * 1.0) % 1, k = Math.floor(u * 10); bins[k].n++; bins[k].e += Math.abs(vf + FLOOR); bins[k].y += y; }
      prev = x;
    }
    return bins.map((b, i) => ({ u: (i / 10).toFixed(1), ankleY: +(b.y / b.n).toFixed(3), slide: +(b.e / b.n).toFixed(2) }));
  }, FLOOR);
  console.log(r.map((x) => `u=${x.u} y=${x.ankleY} slide=${x.slide}`).join('\n'));
  await b.close();
})();
