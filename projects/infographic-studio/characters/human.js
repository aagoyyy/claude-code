// human.js — generic rigged human (front view, flat vector, one-step-darker flat shading, no heavy outlines).
// Local coords: pelvis at (0,0), y down. ~5.8 heads tall. Build once, then set(state) every frame.
(function (G) {
  const R = G.RIG;

  function buildHuman(parent, D) {
    const C = { D };
    C.root = R.el("g", {}, parent);
    const c = D.colors;

    // ---------------- legs (behind torso) ----------------
    C.legs = [];
    for (const s of [-1, 1]) {
      const hip = R.joint(C.root, s * 52, 6);
      R.el("rect", { x: s * 52 - 40, y: -10, width: 80, height: 222, rx: 30, fill: c.pants }, hip);
      R.el("rect", { x: s * 52 + (s < 0 ? -40 : 18), y: -10, width: 22, height: 222, rx: 10, fill: c.pantsShade }, hip);
      const knee = R.joint(hip, s * 52, 205);
      R.el("rect", { x: s * 52 - 34, y: 190, width: 68, height: 200, rx: 26, fill: c.pants }, knee);
      R.el("rect", { x: s * 52 + (s < 0 ? -34 : 14), y: 190, width: 20, height: 200, rx: 10, fill: c.pantsShade }, knee);
      R.el("path", { d: `M ${s * 52 - 36} 384 Q ${s * 52 - 40} 410 ${s * 52 + s * 30} 414 L ${s * 52 + s * 62} 414 Q ${s * 52 + s * 70} 398 ${s * 52 + 30 * s} 382 Z`, fill: c.shoes }, knee);
      C.legs.push({ hip, knee });
    }

    // ---------------- torso ----------------
    C.torso = R.joint(C.root, 0, 0);
    C.breath = R.joint(C.torso, 0, 0);                 // breathing scale on its own joint
    const T = C.breath;
    R.el("path", { d: "M -128 -8 L 128 -8 L 132 30 L -132 30 Z", fill: c.pants }, T);                         // trouser top
    R.el("rect", { x: -130, y: -18, width: 260, height: 16, rx: 4, fill: c.belt }, T);
    R.el("rect", { x: -12, y: -20, width: 24, height: 20, rx: 3, fill: c.buckle }, T);
    const body = "M -30 -326 C -70 -320 -112 -314 -132 -300 C -152 -286 -156 -262 -152 -228 C -148 -170 -140 -90 -134 -12 L 134 -12 C 140 -90 148 -170 152 -228 C 156 -262 152 -286 132 -300 C 112 -314 70 -320 30 -326 Z";
    R.el("path", { d: body, fill: c.shirt }, T);
    R.el("path", { d: "M 152 -228 C 148 -170 140 -90 134 -12 L 96 -12 C 104 -90 112 -180 118 -250 C 124 -276 134 -290 132 -300 C 152 -286 156 -262 152 -228 Z", fill: c.shirtShade }, T);
    // shirt folds (simple, flat)
    R.el("path", { d: "M -96 -150 q 30 18 56 6", fill: "none", stroke: c.shirtShade, "stroke-width": 4, "stroke-linecap": "round" }, T);
    R.el("path", { d: "M -110 -70 q 28 14 54 4", fill: "none", stroke: c.shirtShade, "stroke-width": 4, "stroke-linecap": "round" }, T);
    R.el("path", { d: "M 60 -110 q 22 10 40 -2", fill: "none", stroke: c.shirtShade, "stroke-width": 4, "stroke-linecap": "round" }, T);
    // pocket
    R.el("path", { d: "M -104 -232 L -58 -232 L -58 -190 Q -81 -182 -104 -190 Z", fill: "none", stroke: c.shirtShade, "stroke-width": 3.5 }, T);
    R.el("rect", { x: -98, y: -244, width: 6, height: 20, rx: 3, fill: c.pen }, T);
    // buttons line (visible beside tie)
    for (const y of [-200, -140, -80]) R.el("circle", { cx: 22, cy: y, r: 3.4, fill: c.shirtShade }, T);

    // neck (behind collar)
    C.neck = R.joint(T, 0, -318);
    R.el("rect", { x: -26, y: -366, width: 52, height: 56, rx: 12, fill: c.skin }, C.neck);
    R.el("path", { d: "M -26 -360 Q 0 -340 26 -360 L 26 -346 Q 0 -324 -26 -346 Z", fill: c.skinShade }, C.neck);

    // collar
    R.el("path", { d: "M -30 -330 L -2 -294 L -12 -282 L -52 -304 Z", fill: c.shirt, stroke: c.shirtShade, "stroke-width": 3, "stroke-linejoin": "round" }, T);
    R.el("path", { d: "M 30 -330 L 2 -294 L 12 -282 L 52 -304 Z", fill: c.shirt, stroke: c.shirtShade, "stroke-width": 3, "stroke-linejoin": "round" }, T);

    // tie (own joint at knot for follow-through)
    C.tie = R.joint(T, 0, -300);
    if (D.tie) {
      R.el("path", { d: "M -9 -292 L 9 -292 L 18 -110 L 0 -86 L -18 -110 Z", fill: c.tie }, C.tie);
      R.el("path", { d: "M 0 -292 L 9 -292 L 18 -110 L 0 -86 Z", fill: c.tieShade }, C.tie);
      for (const y of [-250, -200, -150]) R.el("path", { d: `M -12 ${y} L 12 ${y - 14}`, stroke: c.tieStripe, "stroke-width": 4 }, C.tie);
      R.el("path", { d: "M -12 -312 L 12 -312 L 9 -290 L -9 -290 Z", fill: c.tieShade }, T);
    }

    // ---------------- head ----------------
    C.head = R.joint(C.neck, 0, -352);
    const H = C.head;
    R.el("path", { d: D.hairBack || "", fill: c.hair }, H);
    for (const s of [-1, 1]) {
      R.el("ellipse", { cx: s * 74, cy: -462, rx: 13, ry: 21, fill: c.skin }, H);
      R.el("path", { d: `M ${s * 72} -474 q ${s * 8} 8 ${s * 2} 22`, stroke: c.skinShade, "stroke-width": 3, fill: "none" }, H);
    }
    const face = "M -72 -500 C -74 -455 -70 -420 -55 -398 C -40 -378 -20 -366 0 -364 C 20 -366 40 -378 55 -398 C 70 -420 74 -455 72 -500 C 70 -540 40 -560 0 -560 C -40 -560 -70 -540 -72 -500 Z";
    R.el("path", { d: face, fill: c.skin }, H);
    R.el("path", { d: "M 72 -500 C 74 -455 70 -420 55 -398 C 40 -378 20 -366 0 -364 C 24 -376 44 -396 54 -428 C 62 -456 62 -482 58 -508 Z", fill: c.skinShade }, H);   // flat jaw shade
    // age lines
    if (D.age >= 40) for (const s of [-1, 1]) R.el("path", { d: `M ${s * 30} -428 q ${s * 8} 14 ${s * 4} 26`, stroke: c.skinLine, "stroke-width": 2.2, fill: "none", opacity: 0.45 }, H);

    C.face = R.buildFace(H, {
      id: D.id, eyeDX: 30, eyeY: -462, eyeRX: 15, eyeRY: 10.5, irisR: 7.6, iris: c.iris, skin: c.skin, skinShade: c.skinShade, skinLine: c.skinLine,
      line: c.lash, hair: c.hair, browY: -492, browW: 40, browT: 8, noseY: -430, noseW: 10, mouthY: -402, lip: c.lip,
    });
    if (D.glasses) {
      const gl = R.el("g", {}, C.face.feat);
      for (const s of [-1, 1]) {
        R.el("rect", { x: s * 30 - 28, y: -482, width: 56, height: 40, rx: 11, fill: "rgba(210,230,255,0.10)", stroke: c.glasses, "stroke-width": 4 }, gl);
        R.el("path", { d: `M ${s * 30 - 16} -476 l 14 -2`, stroke: "rgba(255,255,255,0.55)", "stroke-width": 3, "stroke-linecap": "round" }, gl);
        R.el("path", { d: `M ${s * 58} -472 L ${s * 74} -468`, stroke: c.glasses, "stroke-width": 4 }, gl);
      }
      R.el("path", { d: "M -2 -466 Q 0 -472 2 -466", stroke: c.glasses, "stroke-width": 4, fill: "none" }, gl);
    }
    R.el("path", { d: D.hairFront, fill: c.hair }, H);
    if (D.hairShine) R.el("path", { d: D.hairShine, fill: c.hairShine }, H);

    // ---------------- arms (in front) ----------------
    C.arms = [];
    for (const s of [-1, 1]) {
      const sx = s * 130, sy = -292;
      const ua = R.joint(T, sx, sy);
      R.el("rect", { x: sx - 33, y: sy - 18, width: 66, height: 172, rx: 31, fill: c.shirt }, ua);
      R.el("rect", { x: sx + (s < 0 ? -33 : 12), y: sy - 10, width: 21, height: 158, rx: 10, fill: c.shirtShade }, ua);
      const fa = R.joint(ua, sx, sy + 150);
      R.el("rect", { x: sx - 29, y: sy + 132, width: 58, height: 150, rx: 27, fill: c.shirt }, fa);
      R.el("rect", { x: sx + (s < 0 ? -29 : 10), y: sy + 140, width: 19, height: 136, rx: 9, fill: c.shirtShade }, fa);
      R.el("path", { d: `M ${sx - 22} ${sy + 150} q 22 10 44 0`, stroke: c.shirtShade, "stroke-width": 3.5, fill: "none" }, fa);      // elbow crease
      R.el("rect", { x: sx - 28, y: sy + 252, width: 56, height: 26, rx: 8, fill: c.shirt, stroke: c.shirtShade, "stroke-width": 3 }, fa);  // cuff
      const wrist = R.joint(fa, sx, sy + 276);
      const hg = R.el("g", { transform: `translate(${sx} ${sy + 274})` }, wrist);
      const hand = R.buildHand(hg, c, s > 0);
      C.arms.push({ ua, fa, wrist, hand, holder: hg });
    }

    // ---------------- controller ----------------
    C.set = function (S) {
      const b = 1 + (S.breath || 0);
      R.setJoint(C.torso, S.torso || 0, S.tx || 0, S.ty || 0);
      R.setJoint(C.breath, 0, 0, 0, 1 + (b - 1) * 0.35, b);
      R.setJoint(C.neck, S.neck || 0);
      R.setJoint(C.head, S.head || 0, 0, S.headDY || 0);
      R.setJoint(C.tie, S.tie || 0);
      const A = [[S.uaL, S.faL, S.waL, S.handL], [S.uaR, S.faR, S.waR, S.handR]];
      C.arms.forEach((a, i) => { R.setJoint(a.ua, A[i][0] || 0); R.setJoint(a.fa, A[i][1] || 0); R.setJoint(a.wrist, A[i][2] || 0); if (A[i][3]) a.hand.set(A[i][3]); });
      C.legs.forEach((l, i) => { R.setJoint(l.hip, (i ? S.hipR : S.hipL) || 0); R.setJoint(l.knee, (i ? S.kneeR : S.kneeL) || 0); });
      if (S.face) R.setFace(C.face, S.face);
    };
    return C;
  }

  // ---------------- character #1: Indonesian business owner, 40s ----------------
  const BOSS = {
    id: "boss", age: 45, tie: true, glasses: true,
    colors: {
      skin: "#d9a074", skinShade: "#c08560", skinLine: "#9c6446", lip: "#8a4a3c", iris: "#4a2e1f", lash: "#2a1a14",
      hair: "#1c1a1f", hairShine: "#34313a", shirt: "#f7f8fb", shirtShade: "#dde2ec", pen: "#2f5fb3",
      tie: "#2d5fb8", tieShade: "#24498f", tieStripe: "#5d86d4", pants: "#2b3445", pantsShade: "#222a38", belt: "#3a2a22", buckle: "#c9a24a",
      shoes: "#1e1a19", glasses: "#26232b",
    },
    hairFront: "M -82 -458 C -92 -520 -82 -580 -40 -600 C -10 -612 40 -610 66 -590 C 90 -572 96 -520 84 -458 L 76 -460 C 76 -494 72 -516 62 -528 C 40 -546 4 -546 -30 -536 C -18 -548 -4 -556 8 -560 C -20 -556 -46 -544 -62 -526 C -70 -514 -74 -494 -74 -460 Z",
    hairShine: "M -46 -584 C -14 -600 30 -598 58 -580 C 30 -588 -4 -588 -34 -574 Z",
    hairBack: "M -90 -446 C -100 -540 -64 -616 0 -616 C 64 -616 100 -540 90 -446 L 74 -446 L 74 -500 L -74 -500 L -74 -446 Z",
  };

  G.HUMAN = { buildHuman, BOSS };
})(window);
