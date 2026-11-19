// human2.js — "infographic channel" look: dark outlines, 2–3 tone shading with soft edges, rim light, 3/4 head,
// big expressive eyes, chunky hair locks, wrinkles, sweat drops. Same controller API as human.js (C.set(state)).
// Local coords: pelvis (0,0), y down. Head turned toward screen-left (near side = screen-right).
(function (G) {
  const R = G.RIG;

  function buildHuman2(parent, D) {
    const c = D.colors, OUT = c.outline, C = { D };
    const defs = R.el("defs", {}, parent);
    const blur = R.el("filter", { id: `soft_${D.id}`, x: "-20%", y: "-20%", width: "140%", height: "140%" }, defs); R.el("feGaussianBlur", { stdDeviation: 3.2 }, blur);
    const blurS = R.el("filter", { id: `softS_${D.id}`, x: "-20%", y: "-20%", width: "140%", height: "140%" }, defs); R.el("feGaussianBlur", { stdDeviation: 1.6 }, blurS);
    let clipN = 0;
    const clipOf = (d) => { const id = `cl_${D.id}_${clipN++}`; R.el("path", { d }, R.el("clipPath", { id }, defs)); return `url(#${id})`; };
    const grad = (id, stops, x1 = 0, y1 = 0, x2 = 1, y2 = 0) => { const g = R.el("linearGradient", { id: `${id}_${D.id}`, x1, y1, x2, y2 }, defs); stops.forEach(([o, col]) => R.el("stop", { offset: o, "stop-color": col }, g)); return `url(#${id}_${D.id})`; };
    // shape helpers: lined = with outline; shade = soft, clipped, no outline
    const S = (p, d, fill, w = 4.5, extra = {}) => R.el("path", Object.assign({ d, fill, stroke: OUT, "stroke-width": w, "stroke-linejoin": "round", "stroke-linecap": "round" }, extra), p);
    const L = (p, d, w = 2.6, col = OUT, extra = {}) => R.el("path", Object.assign({ d, fill: "none", stroke: col, "stroke-width": w, "stroke-linecap": "round", "stroke-linejoin": "round" }, extra), p);
    const shade = (p, clip, d, fill, soft = true, op = 1) => { const g = R.el("g", { "clip-path": clip }, p); R.el("path", { d, fill, opacity: op, filter: soft ? `url(#soft_${D.id})` : "" }, g); return g; };

    C.root = R.el("g", {}, parent);
    const skinG = grad("skin", [[0, c.skinLight], [0.45, c.skin], [1, c.skin]]);
    const shirtG = grad("shirt", [[0, c.shirtLight], [0.5, c.shirt], [1, c.shirtShade]]);

    // ---------------- legs ----------------
    C.legs = [];
    for (const s of [-1, 1]) {
      const hip = R.joint(C.root, s * 52, 6);
      const th = `M ${s * 52 - 40} -10 L ${s * 52 + 40} -10 L ${s * 52 + 36} 212 L ${s * 52 - 36} 212 Z`;
      S(hip, th, c.pants); shade(hip, clipOf(th), `M ${s * 52 + (s < 0 ? -40 : 14)} -10 h 30 v 230 h -30 Z`, c.pantsShade, true);
      const knee = R.joint(hip, s * 52, 205);
      const sh = `M ${s * 52 - 35} 196 L ${s * 52 + 35} 196 L ${s * 52 + 30} 392 L ${s * 52 - 30} 392 Z`;
      S(knee, sh, c.pants); shade(knee, clipOf(sh), `M ${s * 52 + (s < 0 ? -36 : 12)} 196 h 26 v 200 h -26 Z`, c.pantsShade, true);
      S(knee, `M ${s * 52 - 34} 386 Q ${s * 52 - 40} 412 ${s * 52 + s * 30} 416 L ${s * 52 + s * 66} 416 Q ${s * 52 + s * 72} 398 ${s * 52 + 30 * s} 384 Z`, c.shoes);
      C.legs.push({ hip, knee });
    }

    // ---------------- torso ----------------
    C.torso = R.joint(C.root, 0, 0);
    C.breath = R.joint(C.torso, 0, 0);
    const T = C.breath;
    S(T, "M -130 -14 L 130 -14 L 134 30 L -134 30 Z", c.pants);
    S(T, "M -132 -24 L 132 -24 L 132 -6 L -132 -6 Z", c.belt, 3.5);
    S(T, "M -26 -26 h 26 v 22 h -26 Z", c.buckle, 3);
    const body = "M -30 -326 C -70 -320 -112 -314 -132 -300 C -152 -286 -158 -262 -154 -228 C -150 -170 -142 -90 -136 -18 L 136 -18 C 142 -90 150 -170 154 -228 C 158 -262 152 -286 132 -300 C 112 -314 70 -320 30 -326 Z";
    S(T, body, shirtG, 5);
    const bodyClip = clipOf(body);
    shade(T, bodyClip, "M 60 -330 C 120 -300 150 -240 150 -140 L 150 0 L 70 0 C 92 -90 96 -200 60 -330 Z", c.shirtShade, true);
    shade(T, bodyClip, "M 104 -300 C 140 -260 150 -200 150 -120 L 150 0 L 112 0 C 124 -100 126 -220 104 -300 Z", c.shirtDeep, true);
    shade(T, bodyClip, "M -150 -270 C -158 -200 -150 -100 -140 -20 L -128 -20 C -136 -100 -142 -200 -136 -270 Z", c.rim, true, 0.85);     // rim light (window side)
    // placket shifted toward screen-left = body turned slightly
    L(T, "M -14 -290 L -16 -20", 3, c.shirtDeep);
    for (const y of [-240, -180, -120, -60]) R.el("circle", { cx: -24, cy: y, r: 3.6, fill: c.shirtDeep }, T);
    // folds
    L(T, "M -112 -130 q 26 22 58 10", 3, OUT, { opacity: 0.55 });
    L(T, "M -120 -60 q 30 16 60 6", 3, OUT, { opacity: 0.5 });
    L(T, "M 70 -150 q 26 14 48 -4", 3, OUT, { opacity: 0.5 });
    L(T, "M 40 -70 q 30 10 56 -8", 3, OUT, { opacity: 0.45 });
    // pocket + pen (near side)
    S(T, "M 62 -238 L 112 -238 L 112 -194 Q 87 -186 62 -194 Z", "none", 3);
    S(T, "M 70 -252 h 7 v 24 h -7 Z", c.pen, 2.5);

    // neck
    C.neck = R.joint(T, 0, -318);
    const nk = "M -28 -372 L 26 -372 L 30 -306 L -30 -306 Z";
    S(C.neck, nk, c.skin, 4.5); shade(C.neck, clipOf(nk), "M -40 -380 Q 0 -330 50 -380 L 50 -340 Q 0 -300 -40 -340 Z", c.skinShade, true);

    // collar (3/4: near flap bigger)
    S(T, "M -32 -332 L -10 -292 L -20 -280 L -52 -306 Z", c.shirt, 4);
    S(T, "M 30 -332 L 0 -290 L 14 -276 L 60 -304 Z", c.shirt, 4);
    // tie
    C.tie = R.joint(T, -8, -300);
    if (D.tie) {
      const tieD = "M -17 -292 L 1 -292 L 10 -110 L -8 -84 L -26 -110 Z";
      S(C.tie, tieD, c.tie, 4.5);
      shade(C.tie, clipOf(tieD), "M -8 -300 L 4 -300 L 14 -100 L -8 -80 Z", c.tieShade, false);
      for (const y of [-250, -200, -150]) R.el("path", { d: `M -22 ${y} L 6 ${y - 16}`, stroke: c.tieStripe, "stroke-width": 5, "clip-path": clipOf(tieD) }, C.tie);
      S(T, "M -21 -314 L 5 -314 L 1 -290 L -17 -290 Z", c.tieShade, 4);
    }

    // ---------------- head (3/4, facing screen-left) ----------------
    C.head = R.joint(C.neck, 0, -352);
    const H = C.head;
    const HAIR_BACK = "M -70 -460 C -84 -530 -62 -598 0 -610 C 60 -620 104 -580 100 -508 C 98 -480 92 -458 84 -444 L 60 -444 L -50 -444 Z";
    S(H, HAIR_BACK, c.hair, 5);
    // near ear
    S(H, "M 74 -486 C 96 -498 104 -470 98 -452 C 94 -436 84 -430 74 -436 Z", c.skin, 4.5);
    L(H, "M 84 -476 C 94 -470 92 -452 82 -448", 2.6);
    const FACE = "M -60 -520 C -68 -490 -70 -462 -68 -446 C -66 -428 -60 -414 -52 -404 C -40 -386 -24 -372 -6 -368 C 12 -366 30 -372 44 -386 C 62 -404 74 -428 78 -456 C 82 -488 78 -528 60 -552 C 40 -576 -10 -582 -40 -566 C -54 -556 -60 -540 -60 -520 Z";
    S(H, FACE, skinG, 5);
    const faceClip = clipOf(FACE);
    shade(H, faceClip, "M 40 -560 C 76 -530 86 -470 76 -430 C 66 -398 46 -376 20 -366 L 90 -366 L 90 -560 Z", c.skinShade, true);                 // near-side form shadow
    shade(H, faceClip, "M -70 -540 C -78 -480 -74 -430 -54 -400 L -60 -400 C -84 -440 -86 -500 -76 -540 Z", c.rim, true, 0.9);                 // rim light
    shade(H, faceClip, "M -30 -372 C 0 -362 30 -372 50 -392 L 50 -360 L -30 -360 Z", c.skinShade, true);                                    // under-chin
    if (D.stubble) shade(H, faceClip, "M -58 -420 C -46 -380 -20 -362 0 -362 C 26 -364 52 -380 70 -420 C 54 -400 30 -388 0 -388 C -26 -388 -46 -400 -58 -420 Z", c.stubble, true, 0.35);

    // ---- face features ----
    const F = { feat: R.el("g", {}, H) };
    C.face = F;
    const EYES = [{ cx: -34, cy: -466, rx: 15, ry: 14.5, side: -1 }, { cx: 28, cy: -466, rx: 20, ry: 15.5, side: 1 }];
    F.eyes = EYES.map((E, i) => {
      const cid = `eye_${D.id}_${i}`; const cp = R.el("clipPath", { id: cid }, defs); const cpE = R.el("ellipse", { cx: E.cx, cy: E.cy, rx: E.rx, ry: E.ry }, cp);
      const g = R.el("g", {}, F.feat);
      const white = R.el("ellipse", { cx: E.cx, cy: E.cy, rx: E.rx, ry: E.ry, fill: "#ffffff", stroke: OUT, "stroke-width": 2.6 }, g);
      const inner = R.el("g", { "clip-path": `url(#${cid})` }, g);
      const iris = R.el("circle", { r: E.rx * 0.56, fill: c.iris, stroke: OUT, "stroke-width": 1.6 }, inner);
      const pupil = R.el("circle", { r: E.rx * 0.28, fill: "#120c0b" }, inner);
      const hi = R.el("circle", { r: E.rx * 0.16, fill: "#ffffff" }, inner);
      const hi2 = R.el("circle", { r: E.rx * 0.08, fill: "#ffffff", opacity: 0.8 }, inner);
      const lid = R.el("path", { fill: c.skin }, inner);
      const lidLine = R.el("path", { fill: "none", stroke: OUT, "stroke-width": 5, "stroke-linecap": "round" }, g);
      const lowLid = R.el("path", { fill: c.skin }, inner);
      const lowLine = R.el("path", { fill: "none", stroke: OUT, "stroke-width": 2, "stroke-linecap": "round", opacity: 0.7 }, g);
      const bag = L(g, `M ${E.cx - E.rx * 0.7} ${E.cy + E.ry + 7} q ${E.rx * 0.7} 7 ${E.rx * 1.4} 0`, 2, c.skinLine, { opacity: 0.55 });
      return Object.assign({}, E, { cpE, white, iris, pupil, hi, hi2, lid, lidLine, lowLid, lowLine });
    });
    F.brows = EYES.map(E => R.el("path", { fill: c.hair, stroke: OUT, "stroke-width": 2.5, "stroke-linejoin": "round" }, F.feat));
    F.forehead = [0, 1, 2].map(i => L(F.feat, "", 2.4, c.skinLine));
    // nose (3/4, pointing screen-left)
    R.el("path", { d: "M -22 -432 C -14 -426 -2 -424 6 -430 L 6 -420 C -6 -414 -18 -416 -24 -422 Z", fill: c.skinShade, filter: `url(#softS_${D.id})` }, F.feat);
    L(F.feat, "M -2 -478 C -8 -458 -22 -444 -28 -434 C -32 -426 -26 -420 -18 -422", 3.2);
    L(F.feat, "M -10 -424 C -6 -420 0 -420 4 -426", 2.6);
    F.naso = [L(F.feat, "M 14 -428 C 24 -418 28 -404 26 -392", 2.4, c.skinLine, { opacity: 0.55 }), L(F.feat, "M -36 -424 C -42 -414 -44 -404 -42 -396", 2.2, c.skinLine, { opacity: 0.45 })];
    // mouth
    const mid = `mouth_${D.id}`; const mcp = R.el("clipPath", { id: mid }, defs); F.mClip = R.el("path", {}, mcp);
    F.mouthG = R.el("g", {}, F.feat);
    F.mFill = R.el("path", { fill: "#5e1a1f" }, F.mouthG);
    const mIn = R.el("g", { "clip-path": `url(#${mid})` }, F.mouthG);
    F.tongue = R.el("ellipse", { fill: "#d7616b" }, mIn);
    F.teeth = R.el("rect", { fill: "#fbfbf7" }, mIn);
    F.lowTeeth = R.el("rect", { fill: "#fbfbf7" }, mIn);
    F.mLine = R.el("path", { fill: "none", stroke: OUT, "stroke-width": 4, "stroke-linecap": "round", "stroke-linejoin": "round" }, F.mouthG);
    F.lowerLip = R.el("path", { fill: "none", stroke: c.lip, "stroke-width": 4, "stroke-linecap": "round", opacity: 0.7 }, F.mouthG);
    // glasses (3/4: far lens narrower)
    if (D.glasses) {
      const gl = R.el("g", {}, F.feat);
      R.el("rect", { x: -64, y: -488, width: 56, height: 44, rx: 12, fill: "rgba(200,225,255,0.10)", stroke: c.glasses, "stroke-width": 5 }, gl);
      R.el("rect", { x: -4, y: -490, width: 66, height: 46, rx: 13, fill: "rgba(200,225,255,0.10)", stroke: c.glasses, "stroke-width": 5 }, gl);
      L(gl, "M -8 -472 Q -6 -478 -4 -472", 5, c.glasses);
      L(gl, "M 62 -476 L 82 -470", 5, c.glasses);
      L(gl, "M 6 -482 l 16 -3", 3.5, "rgba(255,255,255,0.7)"); L(gl, "M -54 -480 l 12 -2", 3.5, "rgba(255,255,255,0.6)");
    }
    // hair front (locks over forehead, part on the near side) + lock lines + highlights
    const HAIR_FRONT = "M -66 -470 C -78 -528 -60 -592 -4 -604 C 54 -616 100 -578 96 -510 C 94 -486 88 -468 80 -456 L 74 -462 C 76 -494 72 -520 60 -536 C 46 -548 30 -552 14 -552 C 0 -540 -20 -528 -40 -522 C -50 -510 -56 -492 -60 -470 Z";
    S(H, HAIR_FRONT, c.hair, 5);
    const hairClip = clipOf(HAIR_FRONT);
    shade(H, hairClip, "M -60 -580 C -20 -606 40 -608 80 -580 C 40 -592 -10 -592 -52 -570 Z", c.hairShine, false);
    shade(H, hairClip, "M 30 -600 C 60 -594 84 -572 90 -540 C 80 -560 60 -580 30 -588 Z", c.hairShine, false, 0.8);
    for (const d of ["M -10 -600 C -26 -578 -42 -556 -56 -514", "M 22 -606 C 10 -586 -8 -566 -34 -548", "M 56 -596 C 50 -576 38 -560 16 -552", "M 84 -560 C 84 -530 80 -500 78 -474"]) L(H, d, 2.6, OUT, { opacity: 0.75 });

    // sweat drops
    F.sweat = [[-72, -478, 1.15], [90, -494, 0.95], [-56, -436, 0.8]].map(([x, y, s]) => { const g = R.el("g", { transform: `translate(${x} ${y}) scale(${s})` }, H); R.el("path", { d: "M 0 -16 C 8 -4 12 4 12 10 C 12 18 6 22 0 22 C -6 22 -12 18 -12 10 C -12 4 -8 -4 0 -16 Z", fill: "#bfe6ff", stroke: OUT, "stroke-width": 2.5 }, g); R.el("ellipse", { cx: -4, cy: 10, rx: 3, ry: 5, fill: "#ffffff" }, g); return g; });
    // ---------------- arms (outlined, folds, cuffs, bigger hands) ----------------
    C.arms = [];
    for (const s of [-1, 1]) {
      const sx = s * 132, sy = -292;
      const ua = R.joint(T, sx, sy);
      const uaD = `M ${sx - 34} ${sy - 10} C ${sx - 36} ${sy - 30} ${sx + 36} ${sy - 30} ${sx + 34} ${sy - 10} L ${sx + 30} ${sy + 152} L ${sx - 30} ${sy + 152} Z`;
      S(ua, uaD, c.shirt, 5); shade(ua, clipOf(uaD), `M ${sx + (s < 0 ? -40 : 6)} ${sy - 30} h 34 v 200 h -34 Z`, c.shirtShade, true);
      if (s < 0) shade(ua, clipOf(uaD), `M ${sx - 40} ${sy - 30} h 12 v 200 h -12 Z`, c.rim, true, 0.8);
      L(ua, `M ${sx - 20} ${sy + 110} q 18 8 36 -2`, 2.6, OUT, { opacity: 0.5 });
      const fa = R.joint(ua, sx, sy + 150);
      const faD = `M ${sx - 30} ${sy + 136} L ${sx + 30} ${sy + 136} L ${sx + 27} ${sy + 262} L ${sx - 27} ${sy + 262} Z`;
      S(fa, faD, c.shirt, 5); shade(fa, clipOf(faD), `M ${sx + (s < 0 ? -34 : 4)} ${sy + 130} h 30 v 140 h -30 Z`, c.shirtShade, true);
      L(fa, `M ${sx - 24} ${sy + 150} q 24 12 48 0`, 3, OUT, { opacity: 0.6 });
      S(fa, `M ${sx - 30} ${sy + 248} h 60 v 30 h -60 Z`, c.shirt, 4);
      R.el("circle", { cx: sx + s * 16, cy: sy + 263, r: 3.4, fill: c.shirtDeep }, fa);
      const wrist = R.joint(fa, sx, sy + 276);
      const hg = R.el("g", { transform: `translate(${sx} ${sy + 272}) scale(1.22)` }, wrist);
      const hand = R.buildHand(hg, c, s > 0);
      // outline the hand: every skin-filled rect/path gets the outline stroke; shade pieces stay soft
      hand.g.querySelectorAll("rect, path").forEach(e => { const f = e.getAttribute("fill"); if (f === c.skin) { e.setAttribute("stroke", OUT); e.setAttribute("stroke-width", 3.4); e.setAttribute("stroke-linejoin", "round"); } });
      C.arms.push({ ua, fa, wrist, hand, holder: hg });
    }

    // ---------------- face controller ----------------
    function setFace(S) {
      F.feat.setAttribute("transform", `translate(${(S.yaw || 0) * 10} ${(S.pitch || 0) * 9})`);
      const open = S.open ?? 1;
      for (const E of F.eyes) {
        const ry = E.ry * open, rx = E.rx * (1 + 0.1 * Math.max(0, open - 1));
        for (const e of [E.white, E.cpE]) { e.setAttribute("rx", rx); e.setAttribute("ry", ry); }
        const ix = E.cx + (S.lookX || 0) * rx * 0.42, iy = E.cy + (S.lookY || 0) * ry * 0.38;
        for (const e of [E.iris, E.pupil]) { e.setAttribute("cx", ix); e.setAttribute("cy", iy); }
        E.hi.setAttribute("cx", ix + rx * 0.2); E.hi.setAttribute("cy", iy - ry * 0.28); E.hi2.setAttribute("cx", ix - rx * 0.2); E.hi2.setAttribute("cy", iy + ry * 0.2);
        const close = R.clamp((S.close || 0) + (E.side < 0 ? S.lidL || 0 : S.lidR || 0));
        const top = E.cy - ry - 2, ly2 = E.cy - ry + 2 * ry * close, sag = ry * 0.4 * (1 - close);
        E.lid.setAttribute("d", `M ${E.cx - rx - 6} ${top - 24} L ${E.cx + rx + 6} ${top - 24} L ${E.cx + rx + 6} ${ly2} Q ${E.cx} ${ly2 - sag} ${E.cx - rx - 6} ${ly2} Z`);
        E.lidLine.setAttribute("d", close > 0.97 ? `M ${E.cx - rx - 2} ${E.cy + 1} Q ${E.cx} ${E.cy + ry * 0.5} ${E.cx + rx + 2} ${E.cy + 1}`
          : `M ${E.cx - rx - 3} ${ly2 + 2} Q ${E.cx} ${ly2 - sag - 2} ${E.cx + rx + 4} ${ly2 - 1}`);
        const sq = R.clamp(S.squint || 0), lowY = E.cy + ry - 2 * ry * sq * 0.45;
        E.lowLid.setAttribute("d", `M ${E.cx - rx - 6} ${E.cy + ry + 24} L ${E.cx + rx + 6} ${E.cy + ry + 24} L ${E.cx + rx + 6} ${lowY} Q ${E.cx} ${lowY + ry * 0.3 * sq} ${E.cx - rx - 6} ${lowY} Z`);
        E.lowLine.setAttribute("d", `M ${E.cx - rx * 0.8} ${lowY + 1} Q ${E.cx} ${lowY + 4} ${E.cx + rx * 0.8} ${lowY + 1}`);
      }
      const B = S.brow || {};
      F.brows.forEach((p, i) => {
        const E = F.eyes[i], s = E.side, w = E.rx * 2.4, by = E.cy - E.ry - 18 - (B.y || 0);
        const inX = E.cx - s * w * 0.48 + (s < 0 ? 4 : -4), outX = E.cx + s * w * 0.52;
        const inY = by - (B.inner || 0), outY = by - (B.outer || 0), midY = (inY + outY) / 2 - (B.arch || 0) - 4, th = 10;
        p.setAttribute("d", `M ${inX} ${inY + th * 0.2} Q ${(inX + outX) / 2} ${midY - th * 0.5} ${outX} ${outY} L ${outX - s * 3} ${outY + th * 0.5} Q ${(inX + outX) / 2} ${midY + th * 0.8} ${inX} ${inY + th} Z`);
      });
      const fw = R.clamp(((B.y || 0) - 4) / 10);                 // forehead lines appear when brows go up
      F.forehead.forEach((p, i) => { const y = -528 - i * 9; p.setAttribute("d", `M ${-32 + i * 4} ${y} Q 4 ${y - 6} ${38 - i * 4} ${y}`); p.setAttribute("opacity", fw * (0.75 - i * 0.18)); });
      F.sweat.forEach((g, i) => g.setAttribute("opacity", R.clamp((S.sweat || 0) * 1.4 - i * 0.25)));
      // mouth (centre shifted toward the far side for 3/4)
      const M = S.mouth || R.VISEMES.rest, mx = -6, my = -400, w = M.w * 1.3, h = M.h * 1.4, cy = my - M.lift;
      const top = my - h * 0.32 - (M.lift > 0 ? M.lift * 0.2 : 0), bot = my + h * 0.68, lx = mx - w * 0.44, rx2 = mx + w * 0.56;
      if (h < 1.5) {
        F.mLine.setAttribute("d", `M ${lx} ${cy} Q ${mx} ${my + 4 + M.lift * 0.6 - (M.press ? 1.2 : 0)} ${rx2} ${cy}`);
        F.mLine.setAttribute("stroke-width", 4 + (M.press || 0) * 1.6);
        for (const e of [F.mFill, F.mClip]) e.setAttribute("d", "M0 0");
        F.teeth.setAttribute("height", 0); F.lowTeeth.setAttribute("height", 0); F.tongue.setAttribute("rx", 0); F.lowerLip.setAttribute("opacity", 0);
      } else {
        const d = `M ${lx} ${cy} C ${lx + w * 0.22} ${top} ${rx2 - w * 0.25} ${top} ${rx2} ${cy} C ${rx2 - w * 0.2} ${bot} ${lx + w * 0.16} ${bot} ${lx} ${cy} Z`;
        F.mFill.setAttribute("d", d); F.mClip.setAttribute("d", d); F.mLine.setAttribute("d", d); F.mLine.setAttribute("stroke-width", 4);
        F.teeth.setAttribute("x", lx); F.teeth.setAttribute("width", w); F.teeth.setAttribute("y", top - 4); F.teeth.setAttribute("height", 4 + Math.min(12, h * 0.3) * (M.teeth || 0));
        F.lowTeeth.setAttribute("x", lx); F.lowTeeth.setAttribute("width", w); F.lowTeeth.setAttribute("y", bot - 6 * (M.bite || 0) - 1); F.lowTeeth.setAttribute("height", 9 * (M.bite || 0));
        F.tongue.setAttribute("cx", mx + w * 0.04); F.tongue.setAttribute("cy", bot - 2); F.tongue.setAttribute("rx", w * 0.34 * (M.tongue || 0)); F.tongue.setAttribute("ry", h * 0.32 * (M.tongue || 0));
        F.lowerLip.setAttribute("d", `M ${mx - w * 0.22} ${bot + 8} Q ${mx} ${bot + 12} ${mx + w * 0.26} ${bot + 8}`); F.lowerLip.setAttribute("opacity", 0.7);
      }
    }

    C.set = function (St) {
      const b = 1 + (St.breath || 0);
      R.setJoint(C.torso, St.torso || 0, St.tx || 0, St.ty || 0);
      R.setJoint(C.breath, 0, 0, 0, 1 + (b - 1) * 0.35, b);
      R.setJoint(C.neck, St.neck || 0);
      R.setJoint(C.head, St.head || 0, 0, St.headDY || 0, 1.13, 1.13);
      R.setJoint(C.tie, St.tie || 0);
      const A = [[St.uaL, St.faL, St.waL, St.handL], [St.uaR, St.faR, St.waR, St.handR]];
      C.arms.forEach((a, i) => { R.setJoint(a.ua, A[i][0] || 0); R.setJoint(a.fa, A[i][1] || 0); R.setJoint(a.wrist, A[i][2] || 0); if (A[i][3]) a.hand.set(A[i][3]); });
      C.legs.forEach((l, i) => { R.setJoint(l.hip, (i ? St.hipR : St.hipL) || 0); R.setJoint(l.knee, (i ? St.kneeR : St.kneeL) || 0); });
      if (St.face) setFace(St.face);
    };
    return C;
  }

  const BOSS2 = {
    id: "boss2", age: 45, tie: true, glasses: true, stubble: true,
    colors: {
      outline: "#2a1714",
      skin: "#e2a473", skinLight: "#f0bd8c", skinShade: "#c07c52", skinLine: "#8f5235", rim: "#ffd08a", stubble: "#5a6b7c",
      lip: "#a0503e", iris: "#5a3420",
      hair: "#1d1a22", hairShine: "#4a4658",
      shirt: "#f3f5fa", shirtLight: "#ffffff", shirtShade: "#c3cbdb", shirtDeep: "#9ea8bd", pen: "#2f62c8",
      tie: "#2f62c8", tieShade: "#1f4596", tieStripe: "#6f97e6",
      pants: "#28304a", pantsShade: "#1c2236", belt: "#3a2a22", buckle: "#d9b04e", shoes: "#1e1a19", glasses: "#1e1a1f",
      skinShadeHand: "#c07c52",
    },
  };
  // hand builder reads skin/skinShade/skinLine from colors
  G.HUMAN2 = { buildHuman2, BOSS2 };
})(window);
