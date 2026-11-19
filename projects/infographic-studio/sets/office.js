// office.js — layered office set for parallax: bg (wall + city window), mid (shelf, plant, wall chart), fg (desk + desk props).
(function (G) {
  const R = G.RIG;
  function buildOffice(layers, theme) {
    const DUSK = theme === "dusk";
    const P = (day, dusk) => (DUSK ? dusk : day);
    const { bg, mid, fg } = layers;
    // ---------- bg: wall + window with city ----------
    R.el("rect", { x: -900, y: -900, width: 2900, height: 3800, fill: P("#d3dde8", "#2d3f6e") }, bg);
    R.el("rect", { x: -900, y: 1340, width: 2900, height: 1500, fill: P("#c4d0dd", "#253561") }, bg);              // lower wall
    R.el("rect", { x: -900, y: 1330, width: 2900, height: 16, fill: P("#e8eef4", "#3d5590") }, bg);                // chair rail
    // window
    const wx = 70, wy = 330, ww = 720, wh = 860;
    R.el("rect", { x: wx - 22, y: wy - 22, width: ww + 44, height: wh + 44, rx: 6, fill: P("#eef2f6", "#3d5590") }, bg);
    R.el("rect", { x: wx, y: wy, width: ww, height: wh, fill: P("#9fd0f0", "#ff8a5c") }, bg);
    R.el("rect", { x: wx, y: wy + wh * 0.55, width: ww, height: wh * 0.45, fill: P("#b8def5", "#ffc078") }, bg);    // horizon haze band
    if (DUSK) { const sg = R.el("radialGradient", { id: "sunglow" }, R.el("defs", {}, bg)); R.el("stop", { offset: 0, "stop-color": "#fff3c2" }, sg); R.el("stop", { offset: 0.35, "stop-color": "#ffd27a", "stop-opacity": 0.9 }, sg); R.el("stop", { offset: 1, "stop-color": "#ff8a5c", "stop-opacity": 0 }, sg); R.el("circle", { cx: 330, cy: 860, r: 340, fill: "url(#sunglow)" }, bg); }
    // clouds
    for (const [cx, cy, s] of [[230, 430, 1], [560, 520, 0.8], [690, 400, 0.6]]) {
      const g = R.el("g", { transform: `translate(${cx} ${cy}) scale(${s})` }, bg);
      const cf = P("#ffffff", "#ffd2b0"); R.el("ellipse", { cx: 0, cy: 0, rx: 70, ry: 26, fill: cf }, g); R.el("ellipse", { cx: -30, cy: -18, rx: 34, ry: 26, fill: cf }, g); R.el("ellipse", { cx: 22, cy: -24, rx: 40, ry: 32, fill: cf }, g);
    }
    // skyline (three depth rows)
    const rows = [
      { y: 760, col: P("#a8c7e2", "#8b6aa8"), win: P("#c3daee", "#ffd56b"), hs: [220, 300, 180, 340, 260, 200, 320, 240], w: 96 },
      { y: 860, col: P("#7fa6c9", "#5c4a8f"), win: P("#a9c8e3", "#ffcb5a"), hs: [260, 180, 360, 220, 300, 160, 280], w: 108 },
      { y: 960, col: P("#5d84ab", "#3a3270"), win: P("#86a9cb", "#ffbe4a"), hs: [200, 300, 160, 260, 220, 320], w: 126 },
    ];
    const cityClip = R.el("clipPath", { id: "cityclip" }, R.el("defs", {}, bg)); R.el("rect", { x: wx, y: wy, width: ww, height: wh }, cityClip);
    const city = R.el("g", { "clip-path": "url(#cityclip)" }, bg);
    rows.forEach((r, ri) => {
      let x = wx - 30 + ri * 20;
      r.hs.forEach((h, i) => {
        const w = r.w - (i % 3) * 14; const top = wy + wh - (wy + wh - r.y) - h + 300;
        R.el("rect", { x, y: top, width: w, height: wy + wh - top, fill: r.col }, city);
        R.el("rect", { x: x + w - 16, y: top, width: 16, height: wy + wh - top, fill: r.win, opacity: 0.35 }, city);
        for (let yy = top + 22; yy < wy + wh - 20; yy += 34) for (let xx = x + 14; xx < x + w - 24; xx += 24) R.el("rect", { x: xx, y: yy, width: 10, height: 16, rx: 2, fill: r.win }, city);
        x += w + 10;
      });
    });
    // mullions + sill
    R.el("rect", { x: wx + ww / 2 - 8, y: wy, width: 16, height: wh, fill: P("#eef2f6", "#3d5590") }, bg);
    R.el("rect", { x: wx, y: wy + wh * 0.42, width: ww, height: 14, fill: P("#eef2f6", "#3d5590") }, bg);
    R.el("rect", { x: wx - 40, y: wy + wh + 14, width: ww + 80, height: 26, rx: 4, fill: P("#e2e8ef", "#3d5590") }, bg);
    R.el("rect", { x: wx - 40, y: wy + wh + 34, width: ww + 80, height: 8, fill: P("#b9c5d3", "#23325a") }, bg);
    // wall clock
    const ck = R.el("g", { transform: "translate(930 420)" }, bg);
    R.el("circle", { r: 62, fill: P("#2f3a4a", "#1b2238") }, ck); R.el("circle", { r: 52, fill: "#ffffff" }, ck);
    for (let i = 0; i < 12; i++) { const a = i * Math.PI / 6; R.el("line", { x1: Math.sin(a) * 42, y1: -Math.cos(a) * 42, x2: Math.sin(a) * 48, y2: -Math.cos(a) * 48, stroke: P("#2f3a4a", "#1b2238"), "stroke-width": i % 3 ? 2 : 4 }, ck); }
    const hands = R.el("g", {}, ck); R.el("line", { x1: 0, y1: 0, x2: 0, y2: -30, stroke: P("#2f3a4a", "#1b2238"), "stroke-width": 5, "stroke-linecap": "round" }, hands);
    const minute = R.el("line", { x1: 0, y1: 0, x2: 0, y2: -40, stroke: "#e2533c", "stroke-width": 3, "stroke-linecap": "round" }, ck);
    R.el("circle", { r: 5, fill: P("#2f3a4a", "#1b2238") }, ck);

    // ---------- mid: shelf + plant + framed chart ----------
    const sh = R.el("g", { transform: "translate(860 700)" }, mid);
    R.el("rect", { x: 0, y: 0, width: 330, height: 820, rx: 8, fill: P("#8a5a3c", "#6e4430") }, sh);
    R.el("rect", { x: 0, y: 0, width: 26, height: 820, fill: P("#744a31", "#5a3626") }, sh);
    const bookCols = ["#e2533c", "#2f5fb3", "#f2b53c", "#3f9b6a", "#7a5cc4", "#e8e2d4", "#2a3b52", "#d97a3a"];
    for (let r = 0; r < 4; r++) {
      const y0 = 30 + r * 196; R.el("rect", { x: 22, y: y0 + 168, width: 300, height: 18, fill: P("#6c4430", "#4e2e20") }, sh);
      let x = 40, k = r * 3;
      while (x < 300) { const w = 22 + ((k * 7) % 16), h = 110 + ((k * 13) % 50), col = bookCols[k % bookCols.length]; R.el("rect", { x, y: y0 + 168 - h, width: w, height: h, rx: 3, fill: col }, sh); R.el("rect", { x, y: y0 + 168 - h + 16, width: w, height: 6, fill: "rgba(0,0,0,0.15)" }, sh); x += w + 4; k++; if (r === 1 && x > 180) { R.el("rect", { x: x + 10, y: y0 + 120, width: 70, height: 48, rx: 6, fill: "#c9a24a" }, sh); break; } }
    }
    const pl = R.el("g", { transform: "translate(80 1180)" }, mid);
    for (const [a, l, col] of [[-50, 230, "#2f7d4b"], [-20, 280, "#3f9b5f"], [10, 300, "#2f7d4b"], [38, 250, "#4caf6e"], [-75, 180, "#3f9b5f"], [62, 200, "#2f7d4b"]]) {
      R.el("path", { d: `M 0 0 C ${-30} ${-l * 0.5} ${-10} ${-l} 0 ${-l} C 10 ${-l} 30 ${-l * 0.5} 0 0 Z`, fill: col, transform: `rotate(${a})` }, pl);
    }
    R.el("path", { d: "M -70 0 L 70 0 L 56 150 L -56 150 Z", fill: "#e8e2d4" }, pl); R.el("path", { d: "M 30 0 L 70 0 L 56 150 L 26 150 Z", fill: "#d4ccbb" }, pl);

    // ---------- fg: desk ----------
    R.el("rect", { x: -700, y: 1440, width: 2500, height: 60, fill: P("#b8794a", "#a35f36") }, fg);
    R.el("rect", { x: -700, y: 1430, width: 2500, height: 16, fill: P("#cf9160", "#c27a46") }, fg);
    R.el("rect", { x: -700, y: 1500, width: 2500, height: 1200, fill: P("#9a6440", "#7a4426") }, fg);
    R.el("rect", { x: -700, y: 1500, width: 2500, height: 22, fill: P("#7f5134", "#5e321c") }, fg);
    // desk props: papers, mug, pen cup
    const pp = R.el("g", { transform: "translate(150 1432)" }, fg);
    R.el("rect", { x: 0, y: -18, width: 210, height: 16, rx: 2, fill: "#ffffff", transform: "rotate(-2)" }, pp);
    R.el("rect", { x: 10, y: -30, width: 200, height: 14, rx: 2, fill: "#f2f4f7", transform: "rotate(1.5)" }, pp);
    R.el("rect", { x: 4, y: -40, width: 196, height: 12, rx: 2, fill: "#ffffff", transform: "rotate(-1)" }, pp);
    const mg = R.el("g", { transform: "translate(905 1432)" }, fg);
    R.el("path", { d: "M -42 -96 L 42 -96 L 36 0 L -36 0 Z", fill: "#e2533c" }, mg); R.el("path", { d: "M 14 -96 L 42 -96 L 36 0 L 12 0 Z", fill: "#c4412d" }, mg);
    R.el("path", { d: "M 40 -78 C 76 -78 76 -28 38 -28", fill: "none", stroke: "#e2533c", "stroke-width": 12 }, mg);
    R.el("ellipse", { cx: 0, cy: -96, rx: 42, ry: 9, fill: "#5a3524" }, mg);
    const steam = R.el("g", { opacity: 0.55 }, mg);
    const steamPaths = [0, 1, 2].map(i => R.el("path", { fill: "none", stroke: "#ffffff", "stroke-width": 6, "stroke-linecap": "round" }, steam));

    return {
      update(t) {
        hands.setAttribute("transform", `rotate(${300 + t * 0.5})`); minute.setAttribute("transform", `rotate(${t * 6})`);
        steamPaths.forEach((p, i) => { const ph = t * 1.4 + i * 0.33, x = (i - 1) * 18, y0 = -110, rise = (ph % 1) * 50; p.setAttribute("d", `M ${x} ${y0 - rise} q ${12 * Math.sin(ph * 6)} -20 0 -40 q ${-12 * Math.sin(ph * 6)} -20 0 -40`); p.setAttribute("opacity", 1 - (ph % 1)); });
      },
    };
  }
  G.SETS = Object.assign(G.SETS || {}, { buildOffice });
})(window);
