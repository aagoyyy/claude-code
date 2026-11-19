// rig.js — skeleton (FK), easing, pose library interpolation, face (eyes/lids/brows), parametric mouth visemes.
// Classic script (works from file://). Everything is deterministic: render(t) only reads t.
(function (G) {
  const NS = "http://www.w3.org/2000/svg";
  const R = {};

  // ---------- easing ----------
  R.clamp = (x, a = 0, b = 1) => Math.max(a, Math.min(b, x));
  R.lerp = (a, b, k) => a + (b - a) * k;
  R.ease = {
    linear: x => x,
    inOut: x => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2),
    out: x => 1 - Math.pow(1 - x, 3),
    in: x => x * x * x,
    outBack: (x, s = 1.9) => { x -= 1; return 1 + (s + 1) * x * x * x + s * x * x; },          // overshoot
    outElastic: x => (x <= 0 ? 0 : x >= 1 ? 1 : Math.pow(2, -9 * x) * Math.sin((x * 10 - 0.75) * (2 * Math.PI) / 3) + 1),
  };

  // ---------- keyframe tracks ----------
  // keys: [{t, v:{...numbers}, e:'inOut'}]; v objects may be partial; missing values carry forward.
  R.track = function (keys) {
    const ks = keys.slice().sort((a, b) => a.t - b.t);
    let acc = {};
    for (const k of ks) { acc = Object.assign({}, acc, k.v); k.full = acc; }
    return function (t) {
      if (t <= ks[0].t) return Object.assign({}, ks[0].full);
      for (let i = 0; i < ks.length - 1; i++) {
        const a = ks[i], b = ks[i + 1];
        if (t < b.t) {
          const e = R.ease[b.e || "inOut"]; const k = e(R.clamp((t - a.t) / (b.t - a.t)));
          const o = {};
          for (const n in b.full) o[n] = R.lerp(a.full[n] ?? b.full[n], b.full[n], k);
          return o;
        }
      }
      return Object.assign({}, ks[ks.length - 1].full);
    };
  };

  // damped spring "kick" for follow-through / secondary motion: amplitude A at time t0
  R.kick = (t, t0, A, freq = 2.2, damp = 5) => (t < t0 ? 0 : A * Math.exp(-(t - t0) * damp) * Math.sin((t - t0) * freq * 2 * Math.PI));

  // deterministic blink: list of blink start times -> lid closure 0..1
  R.blink = function (t, times, dur = 0.16) {
    for (const b of times) { const u = (t - b) / dur; if (u >= 0 && u <= 1) return Math.sin(u * Math.PI); }
    return 0;
  };

  // ---------- svg helpers ----------
  R.el = function (tag, attrs, parent) {
    const e = document.createElementNS(NS, tag);
    for (const k in attrs || {}) e.setAttribute(k, attrs[k]);
    if (parent) parent.appendChild(e);
    return e;
  };
  // joint: a <g> that rotates around pivot (px,py) given in PARENT coordinates. Children are drawn in parent coords.
  R.joint = function (parent, px, py, id) {
    const g = R.el("g", id ? { id } : {}, parent); g._px = px; g._py = py; return g;
  };
  R.setJoint = function (g, deg, dx = 0, dy = 0, sx = 1, sy = 1) {
    g.setAttribute("transform", `translate(${g._px + dx} ${g._py + dy}) rotate(${deg}) scale(${sx} ${sy}) translate(${-g._px} ${-g._py})`);
  };

  // ---------- parametric mouth (visemes) ----------
  // w: width, h: opening, lift: corner lift (+ smile), teeth: 0..1 visible upper teeth, lower: lower teeth/lip-bite
  R.VISEMES = {
    rest:     { w: 34, h: 0,  lift: 1,  teeth: 0,   tongue: 0 },
    smile:    { w: 50, h: 9,  lift: 9,  teeth: 1,   tongue: 0 },
    A:        { w: 40, h: 30, lift: 0,  teeth: 0.6, tongue: 1 },
    E:        { w: 48, h: 17, lift: 3,  teeth: 1,   tongue: 0.4 },
    I:        { w: 50, h: 9,  lift: 4,  teeth: 1,   tongue: 0 },
    O:        { w: 26, h: 28, lift: -2, teeth: 0.2, tongue: 0.6 },
    U:        { w: 18, h: 14, lift: -2, teeth: 0,   tongue: 0.3 },
    MBP:      { w: 32, h: 0,  lift: 0,  teeth: 0,   tongue: 0, press: 1 },
    FV:       { w: 36, h: 7,  lift: 1,  teeth: 1,   tongue: 0, bite: 1 },
    surprise: { w: 34, h: 44, lift: -3, teeth: 0.3, tongue: 0.7 },
  };
  R.mixViseme = function (a, b, k) {
    const A = R.VISEMES[a] || a, B = R.VISEMES[b] || b, o = {};
    for (const n of ["w", "h", "lift", "teeth", "tongue", "press", "bite"]) o[n] = R.lerp(A[n] || 0, B[n] || 0, k);
    return o;
  };

  // ---------- face controller ----------
  // builds eyes (white, iris, pupil, highlight, upper+lower lid), brows, nose, mouth inside `parent` (head coords)
  R.buildFace = function (parent, P) {
    const F = { P };
    const defs = R.el("defs", {}, parent);
    F.feat = R.el("g", {}, parent);                       // features group (pitch/yaw shift)
    F.eyes = [];
    for (const side of [-1, 1]) {
      const cx = side * P.eyeDX, cy = P.eyeY, cid = `eyeclip_${P.id}_${side < 0 ? "l" : "r"}`;
      const cp = R.el("clipPath", { id: cid }, defs); const cpE = R.el("ellipse", { cx, cy, rx: P.eyeRX, ry: P.eyeRY }, cp);
      const g = R.el("g", {}, F.feat);
      const white = R.el("ellipse", { cx, cy, rx: P.eyeRX, ry: P.eyeRY, fill: "#ffffff" }, g);
      const inner = R.el("g", { "clip-path": `url(#${cid})` }, g);
      const iris = R.el("circle", { cx, cy, r: P.irisR, fill: P.iris }, inner);
      const pupil = R.el("circle", { cx, cy, r: P.irisR * 0.55, fill: "#141418" }, inner);
      const hi = R.el("circle", { cx: cx + 3, cy: cy - 3, r: 2.6, fill: "#ffffff" }, inner);
      const lid = R.el("path", { fill: P.skin }, inner);              // upper lid (skin) — closes downward
      const lidLine = R.el("path", { fill: "none", stroke: P.line, "stroke-width": 3.2, "stroke-linecap": "round" }, g);
      const lowLid = R.el("path", { fill: P.skin }, inner);           // lower lid (squint)
      F.eyes.push({ side, cx, cy, cpE, white, iris, pupil, hi, lid, lidLine, lowLid });
    }
    F.brows = [-1, 1].map(side => R.el("path", { fill: P.hair }, F.feat));
    F.nose = R.el("path", { fill: P.skinShade }, F.feat);
    F.noseLine = R.el("path", { fill: "none", stroke: P.skinLine, "stroke-width": 2.4, "stroke-linecap": "round" }, F.feat);
    // mouth
    const mid = `mouthclip_${P.id}`; const mcp = R.el("clipPath", { id: mid }, defs); F.mClip = R.el("path", {}, mcp);
    F.mouthG = R.el("g", {}, F.feat);
    F.mFill = R.el("path", { fill: "#6b1f24" }, F.mouthG);
    const mIn = R.el("g", { "clip-path": `url(#${mid})` }, F.mouthG);
    F.tongue = R.el("ellipse", { fill: "#d9606a" }, mIn);
    F.teeth = R.el("rect", { fill: "#ffffff" }, mIn);
    F.lowTeeth = R.el("rect", { fill: "#ffffff" }, mIn);
    F.mLine = R.el("path", { fill: "none", stroke: P.lip, "stroke-width": 3.4, "stroke-linecap": "round", "stroke-linejoin": "round" }, F.mouthG);
    F.lowerLip = R.el("path", { fill: "none", stroke: P.skinShade, "stroke-width": 3, "stroke-linecap": "round" }, F.mouthG);
    return F;
  };

  // state: {open:0..1.4, lidL, lidR (extra close), squint, lookX, lookY, brow:{y, inner, outer, arch}, mouth:{...viseme}, pitch, yaw}
  R.setFace = function (F, S) {
    const P = F.P;
    F.feat.setAttribute("transform", `translate(${(S.yaw || 0) * 10} ${(S.pitch || 0) * 9})`);
    for (const E of F.eyes) {
      const ry = P.eyeRY * (S.open ?? 1), rx = P.eyeRX * (1 + 0.12 * Math.max(0, (S.open ?? 1) - 1));
      for (const e of [E.white, E.cpE]) { e.setAttribute("ry", ry); e.setAttribute("rx", rx); }
      const lx = (S.lookX || 0) * P.eyeRX * 0.45, ly = (S.lookY || 0) * ry * 0.4;
      const ix = E.cx + lx, iy = E.cy + ly;
      E.iris.setAttribute("cx", ix); E.iris.setAttribute("cy", iy); E.pupil.setAttribute("cx", ix); E.pupil.setAttribute("cy", iy);
      E.hi.setAttribute("cx", ix + 3); E.hi.setAttribute("cy", iy - 3.5);
      const close = R.clamp((S.close || 0) + (E.side < 0 ? S.lidL || 0 : S.lidR || 0));      // 0 open, 1 shut
      const top = E.cy - ry - 2, ly2 = E.cy - ry + 2 * ry * close;                          // lid edge y
      const sag = ry * 0.35 * (1 - close);
      E.lid.setAttribute("d", `M ${E.cx - rx - 4} ${top - 20} L ${E.cx + rx + 4} ${top - 20} L ${E.cx + rx + 4} ${ly2} Q ${E.cx} ${ly2 - sag} ${E.cx - rx - 4} ${ly2} Z`);
      const lidEdge = close > 0.97 ? `M ${E.cx - rx} ${E.cy + 1} Q ${E.cx} ${E.cy + ry * 0.45} ${E.cx + rx} ${E.cy + 1}`
                                   : `M ${E.cx - rx - 2} ${ly2 + 1} Q ${E.cx} ${ly2 - sag - 1} ${E.cx + rx + 2} ${ly2 + 1}`;
      E.lidLine.setAttribute("d", lidEdge);
      const sq = R.clamp(S.squint || 0), lowY = E.cy + ry - 2 * ry * sq * 0.45;
      E.lowLid.setAttribute("d", `M ${E.cx - rx - 4} ${E.cy + ry + 20} L ${E.cx + rx + 4} ${E.cy + ry + 20} L ${E.cx + rx + 4} ${lowY} Q ${E.cx} ${lowY + ry * 0.3 * sq} ${E.cx - rx - 4} ${lowY} Z`);
    }
    // brows: each brow is a tapered quad whose inner/outer ends move independently
    const B = S.brow || {};
    F.brows.forEach((p, i) => {
      const s = i === 0 ? -1 : 1, inX = s * (P.eyeDX - P.browW * 0.5), outX = s * (P.eyeDX + P.browW * 0.5);
      const by = P.browY - (B.y || 0) * 1;
      const inY = by - (B.inner || 0), outY = by - (B.outer || 0), midY = (inY + outY) / 2 - (B.arch || 0) - 3, th = P.browT;
      p.setAttribute("d", `M ${inX} ${inY} Q ${(inX + outX) / 2} ${midY - th * 0.4} ${outX} ${outY - 1} L ${outX - s * 2} ${outY + th * 0.55} Q ${(inX + outX) / 2} ${midY + th * 0.9} ${inX} ${inY + th} Z`);
    });
    F.nose.setAttribute("d", `M ${-P.noseW} ${P.noseY} Q 0 ${P.noseY + 9} ${P.noseW} ${P.noseY} Q ${P.noseW * 0.6} ${P.noseY + 2} 0 ${P.noseY + 3} Q ${-P.noseW * 0.6} ${P.noseY + 2} ${-P.noseW} ${P.noseY} Z`);
    F.noseLine.setAttribute("d", `M -2 ${P.noseY - 32} Q -9 ${P.noseY - 10} ${-P.noseW + 1} ${P.noseY - 2} M ${-P.noseW + 3} ${P.noseY + 1} q 4 3 7 1 M ${P.noseW - 10} ${P.noseY + 2} q 4 1 7 -2`);
    // mouth
    const M = S.mouth || R.VISEMES.rest, my = P.mouthY, w = M.w, h = M.h, cy = my - M.lift;
    const top = my - h * 0.32 - (M.lift > 0 ? M.lift * 0.2 : 0), bot = my + h * 0.68;
    if (h < 1.5) {
      const p = M.press ? 1.2 : 0;
      F.mLine.setAttribute("d", `M ${-w / 2} ${cy} Q 0 ${my + 4 + M.lift * 0.6 - p} ${w / 2} ${cy}`);
      F.mLine.setAttribute("stroke-width", 3.4 + (M.press || 0) * 1.6);
      for (const e of [F.mFill, F.mClip]) e.setAttribute("d", "M0 0");
      F.teeth.setAttribute("height", 0); F.lowTeeth.setAttribute("height", 0); F.tongue.setAttribute("rx", 0);
    } else {
      const d = `M ${-w / 2} ${cy} C ${-w / 4} ${top} ${w / 4} ${top} ${w / 2} ${cy} C ${w * 0.32} ${bot} ${-w * 0.32} ${bot} ${-w / 2} ${cy} Z`;
      F.mFill.setAttribute("d", d); F.mClip.setAttribute("d", d); F.mLine.setAttribute("d", d); F.mLine.setAttribute("stroke-width", 3);
      F.teeth.setAttribute("x", -w / 2); F.teeth.setAttribute("width", w); F.teeth.setAttribute("y", top - 4); F.teeth.setAttribute("height", 4 + Math.min(10, h * 0.32) * (M.teeth || 0));
      F.lowTeeth.setAttribute("x", -w / 2); F.lowTeeth.setAttribute("width", w); F.lowTeeth.setAttribute("y", bot - 5 * (M.bite || 0) - 1); F.lowTeeth.setAttribute("height", 8 * (M.bite || 0));
      F.tongue.setAttribute("cx", 0); F.tongue.setAttribute("cy", bot - 2); F.tongue.setAttribute("rx", w * 0.32 * (M.tongue || 0)); F.tongue.setAttribute("ry", h * 0.3 * (M.tongue || 0));
    }
    F.lowerLip.setAttribute("d", `M ${-w * 0.22} ${bot + 7} Q 0 ${bot + 10} ${w * 0.22} ${bot + 7}`);
    F.lowerLip.setAttribute("opacity", h < 1.5 ? 0.0 : 0.55);
  };

  // ---------- hand with finger rig ----------
  // builds a hand at the wrist (0,0) pointing down +y. Returns controller with set({curl:[i,m,r,p], thumb, spread}).
  R.buildHand = function (parent, P, mirror) {
    const H = { g: R.el("g", { transform: mirror ? "scale(-1 1)" : "" }, parent) };
    const skin = P.skin, sh = P.skinShade, line = P.skinLine;
    H.fingers = [];
    const bases = [[-17, 46], [-6, 50], [5, 50], [16, 46]], lens = [36, 40, 38, 31];
    // fingers drawn behind palm edge, two segments each
    for (let i = 0; i < 4; i++) {
      const j1 = R.joint(H.g, bases[i][0], bases[i][1]);
      const L1 = lens[i] * 0.55, L2 = lens[i] * 0.5;
      R.el("rect", { x: bases[i][0] - 5.2, y: bases[i][1] - 4, width: 10.4, height: L1 + 6, rx: 5.2, fill: skin }, j1);
      const j2 = R.joint(j1, bases[i][0], bases[i][1] + L1);
      R.el("rect", { x: bases[i][0] - 4.9, y: bases[i][1] + L1 - 4, width: 9.8, height: L2 + 4, rx: 4.9, fill: skin }, j2);
      R.el("path", { d: `M ${bases[i][0] - 3} ${bases[i][1] + L1 + L2 - 3} q 3 3 6 0`, stroke: sh, "stroke-width": 2, fill: "none" }, j2);
      H.fingers.push([j1, j2]);
    }
    // palm
    R.el("path", { d: "M -22 2 C -25 18 -25 38 -20 50 C -10 57 10 57 20 50 C 25 38 24 18 21 2 Z", fill: skin }, H.g);
    R.el("path", { d: "M 22 2 C 25 18 26 40 22 52 L 14 52 C 18 36 18 18 15 2 Z", fill: sh }, H.g);           // flat shade on the outer edge
    R.el("path", { d: "M -10 22 q 8 6 18 2", stroke: line, "stroke-width": 1.8, fill: "none", opacity: 0.6 }, H.g);
    // thumb
    H.thumb = R.joint(H.g, -20, 18);
    R.el("rect", { x: -38, y: 14, width: 13, height: 32, rx: 6.5, fill: skin, transform: "rotate(28 -20 18)" }, H.thumb);
    R.el("path", { d: "M -36 40 q 3 4 8 2", stroke: sh, "stroke-width": 2, fill: "none", transform: "rotate(28 -20 18)" }, H.thumb);
    H.set = function (S) {
      const c = S.curl || [0, 0, 0, 0];
      H.fingers.forEach((f, i) => { const a = c[i] * 0.6, b = c[i] * 0.9; R.setJoint(f[0], (i - 1.5) * (S.spread || 0) - a * 0.12, 0, -c[i] * 0.06, 1, 1 - Math.min(0.42, c[i] / 200)); R.setJoint(f[1], 0, 0, 0, 1, 1 - Math.min(0.55, c[i] / 160)); });
      R.setJoint(H.thumb, S.thumb || 0);
    };
    return H;
  };
  R.HANDPOSE = {
    open:  { curl: [5, 0, 5, 10], thumb: 0, spread: 6 },
    relax: { curl: [25, 30, 35, 40], thumb: -8, spread: 2 },
    point: { curl: [0, 120, 120, 120], thumb: -30, spread: 0 },
    grip:  { curl: [115, 120, 120, 115], thumb: -40, spread: 0 },
  };
  R.mixHand = function (a, b, k) {
    const A = R.HANDPOSE[a] || a, B = R.HANDPOSE[b] || b;
    return { curl: A.curl.map((v, i) => R.lerp(v, B.curl[i], k)), thumb: R.lerp(A.thumb, B.thumb, k), spread: R.lerp(A.spread, B.spread, k) };
  };

  G.RIG = R;
})(window);
