// Measures foot skating: while the foot is planted its speed (in the body's frame) should equal the floor speed.
const { chromium } = require('playwright');
const FLOOR = Number(process.argv[2] || 1.62);
(async () => {
  const b = await chromium.launch({ args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
  const p = await b.newPage({ viewport: { width: 640, height: 360 } });
  await p.goto('http://localhost:8766/puppets.html?mode=walk&ss=1');
  await p.waitForFunction(() => window.__ready === true);
  const r = await p.evaluate((FLOOR) => {
    const it = window.__items[1].p;                  // soldier
    const L = it.parts.legs.L.ank, root = it.root, v = { x: 0, y: 0, z: 0 };
    const samples = [];
    const dt = 0.004;
    for (let t = 0; t < 4; t += dt) {
      it.pose(t, 'walk', 0); root.updateMatrixWorld(true);
      L.getWorldPosition(L.position.clone().set(0, 0, 0) && (window.__tmp = window.__tmp || L.position.clone()));
      const w = L.getWorldPosition(window.__tmp);
      samples.push([t, w.x - root.position.x, w.y]);
    }
    let n = 0, sum = 0, maxv = 0, stance = 0, tot = 0;
    for (let i = 1; i < samples.length; i++) {
      const vf = (samples[i][1] - samples[i - 1][1]) / dt, y = samples[i][2];
      tot++;
      if (y < 0.085) { stance++; const err = Math.abs(vf + FLOOR); sum += err; n++; maxv = Math.max(maxv, err); }
    }
    return { stanceShare: stance / tot, meanSlide: sum / n, maxSlide: maxv };
  }, FLOOR);
  console.log(JSON.stringify(r));
  await b.close();
})();
