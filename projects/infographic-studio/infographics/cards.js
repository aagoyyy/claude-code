// cards.js — infographic kit: title card, number card with arrow chart, source label, emphasis burst.
(function (G) {
  const R = G.RIG;
  const FONT = "Archivo Black, sans-serif";

  function titleCard(parent, o) {
    const g = R.el("g", {}, parent);
    const w = o.w || 820, h = o.h || 330;
    R.el("rect", { x: -w / 2 + 12, y: -h / 2 + 14, width: w, height: h, rx: 26, fill: "rgba(20,24,34,0.35)" }, g);   // flat drop shadow
    R.el("rect", { x: -w / 2, y: -h / 2, width: w, height: h, rx: 26, fill: o.bg || "#ffd23f" }, g);
    const big = R.el("text", { x: 0, y: -h / 2 + 200, "text-anchor": "middle", "font-family": FONT, "font-size": o.bigSize || 190, fill: o.ink || "#141821" }, g);
    big.textContent = o.big;
    const strip = R.el("g", {}, g);
    R.el("rect", { x: -w / 2 + 40, y: h / 2 - 100, width: w - 80, height: 70, rx: 12, fill: o.ink || "#141821" }, strip);
    const small = R.el("text", { x: 0, y: h / 2 - 52, "text-anchor": "middle", "font-family": FONT, "font-size": 40, fill: o.bg || "#ffd23f" }, strip);
    small.textContent = o.small;
    return g;
  }

  function sourceLabel(parent, text) {
    const g = R.el("g", {}, parent);
    const t = R.el("text", { x: 0, y: 0, "font-family": "DejaVu Sans, sans-serif", "font-size": 24, fill: "#ffffff" }, g);
    t.textContent = text;
    const bb = { w: text.length * 12.6 + 28 };
    const bgr = R.el("rect", { x: -14, y: -26, width: bb.w, height: 38, rx: 8, fill: "rgba(20,24,34,0.72)" }, g); g.insertBefore(bgr, t);
    return g;
  }

  function burst(parent, color) {
    const g = R.el("g", {}, parent);
    const ls = [[-60, 0], [-30, 10], [0, 16], [30, 10], [60, 0]].map(([a, d]) => R.el("path", { d: `M 0 -10 L 0 -60`, stroke: color || "#ffd23f", "stroke-width": 12, "stroke-linecap": "round", transform: `rotate(${a})` }, g));
    return { g, set(k) { ls.forEach(l => { l.setAttribute("d", `M 0 ${-30 - 20 * k} L 0 ${-30 - 70 * k}`); l.setAttribute("opacity", k > 0 ? 1 : 0); }); } };
  }

  G.INFO = { titleCard, sourceLabel, burst };
})(window);
