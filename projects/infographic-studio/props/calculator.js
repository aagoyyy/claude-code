// calculator.js — handheld calculator prop with live display text. Origin at its center.
(function (G) {
  const R = G.RIG;
  function buildCalculator(parent) {
    const g = R.el("g", {}, parent);
    R.el("rect", { x: -64, y: -102, width: 128, height: 204, rx: 18, fill: "#2c3240" }, g);
    R.el("rect", { x: 34, y: -102, width: 30, height: 204, rx: 14, fill: "#232835" }, g);
    R.el("rect", { x: -50, y: -86, width: 100, height: 46, rx: 8, fill: "#1a1e27" }, g);
    const scr = R.el("rect", { x: -46, y: -82, width: 92, height: 38, rx: 6, fill: "#bfe0b2" }, g);
    R.el("rect", { x: 22, y: -82, width: 24, height: 38, rx: 6, fill: "#acd09f" }, g);
    const txt = R.el("text", { x: 40, y: -52, "text-anchor": "end", "font-family": "DejaVu Sans Mono, monospace", "font-weight": "700", "font-size": 30, fill: "#1f2b1c" }, g);
    const keys = [];
    for (let r = 0; r < 5; r++) for (let c = 0; c < 4; c++) {
      const op = c === 3, top = r === 0;
      const k = R.el("rect", { x: -50 + c * 26, y: -26 + r * 25, width: 21, height: 19, rx: 5, fill: op ? "#f0a24a" : top ? "#7d8696" : "#4b5363" }, g);
      keys.push(k);
    }
    return {
      g, txt, keys,
      set(text, pressed) { txt.textContent = text; keys.forEach((k, i) => k.setAttribute("transform", i === pressed ? "translate(0 2)" : "")); keys.forEach((k, i) => k.setAttribute("opacity", i === pressed ? 0.75 : 1)); },
    };
  }
  G.PROPS = Object.assign(G.PROPS || {}, { buildCalculator });
})(window);
