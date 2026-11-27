import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';

/* ------------------------------------------------------------------
   Procedural peg-doll puppets, v3: proportions copied from the reference style (measured on the video):
     head ~20% of height (5 heads tall), long jacket/torso ~47%, legs below the hem ~32%,
     torso block ~1.2 head-widths wide, arms hang to the hem, plain mitten hands.
   Faces +z at yaw 0. Feet on y=0. Total height ~1.72 m.
------------------------------------------------------------------- */

const D = {                       // key heights (m)
  hipY: 0.70, thigh: 0.30, shin: 0.34, ankle: 0.06,
  hemY: 0.55, neckY: 1.36,        // jacket spans hemY..neckY
  headH: 0.32, headW: 0.27, torsoW: 0.33, torsoD: 0.22,
  shoulderY: 1.30, upperArm: 0.36, foreArm: 0.32,
};
const PAL = {
  gentleman: { top: 0x2b2622, legs: 0x6a3b32, shoes: 0x1c1815, skin: 0xc89a73, hair: 0x2a1f18 },
  soldier:   { top: 0x7a6a45, legs: 0x58563f, shoes: 0x2a211a, skin: 0xc19067, hair: 0x2f2419 },
  sailor:    { top: 0xb7ae94, legs: 0x45525e, shoes: 0x2a211a, skin: 0xb98560, hair: 0x3a2a1c },
};
const mat = (hex, rough = 0.82, metal = 0) => new THREE.MeshStandardMaterial({ color: hex, roughness: rough, metalness: metal });
const at = (mesh, x, y, z) => { mesh.position.set(x, y, z); return mesh; };
const ball = (r, m, ws = 32, hs = 22) => new THREE.Mesh(new THREE.SphereGeometry(r, ws, hs), m);
const cyl = (rt, rb, h, m, seg = 40) => new THREE.Mesh(new THREE.CylinderGeometry(rt, rb, h, seg), m);
const rbox = (w, h, d, r, m) => new THREE.Mesh(new RoundedBoxGeometry(w, h, d, 8, r), m);
// capsule whose two end-cap CENTRES are `len` apart; hangs from y=0 (upper joint) to y=-len (lower joint)
const limb = (r, len, m) => { const c = new THREE.Mesh(new THREE.CapsuleGeometry(r, len, 12, 28), m); c.position.y = -len / 2; return c; };
const sstep = (a, b, x) => THREE.MathUtils.smoothstep(x, a, b);

export function makePuppet(kind, scale = 1.0) {
  const P = PAL[kind];
  const mTop = mat(P.top), mLegs = mat(P.legs), mShoes = mat(P.shoes, 0.7), mSkin = mat(P.skin, 0.62), mHair = mat(P.hair, 0.9), mWhite = mat(0xdcd6c6), dark = mat(0x161412);
  const steel = mat(0x70757c, 0.4, 0.6), wood = mat(0x4a3524);

  const root = new THREE.Group();
  const body = new THREE.Group(); body.scale.setScalar(scale); root.add(body);
  const hips = new THREE.Group(); hips.position.y = D.hipY; body.add(hips);

  // ---- torso: one long rounded block (the jacket), slightly narrower at the hem ----
  const torso = new THREE.Group(); hips.add(torso);
  const jh = D.neckY - D.hemY, jc = (D.neckY + D.hemY) / 2 - D.hipY;
  const jg = new RoundedBoxGeometry(D.torsoW, jh + 0.12, D.torsoD, 10, 0.095);
  { const p = jg.attributes.position;
    for (let i = 0; i < p.count; i++) {
      let y = p.getY(i) - 0.06;                                   // shift so the rounded BOTTOM sits below the hem
      y = Math.max(y, -jh / 2);                                    // ...and flatten it: straight hem like the reference
      const f = (y + jh / 2) / jh, k = 0.93 + 0.07 * f;
      p.setY(i, y); p.setX(i, p.getX(i) * k); p.setZ(i, p.getZ(i) * (0.95 + 0.05 * f));
    }
    jg.computeVertexNormals(); }
  const jacket = new THREE.Mesh(jg, mTop); jacket.position.y = jc; torso.add(jacket);
  const neckRel = D.neckY - D.hipY;
  torso.add(at(limb(0.05, 0.03, mSkin), 0, neckRel + 0.02, 0));

  // ---- head: big, round, dot eyes, brows, ears, tiny nose, hair cap ----
  const head = new THREE.Group(); head.position.y = neckRel + 0.035; torso.add(head);
  const hc = D.headH / 2 - 0.01;                                   // skull centre above the neck
  const skull = ball(1, mSkin, 48, 32); skull.scale.set(D.headW / 2, D.headH / 2, D.headW / 2 * 1.02); skull.position.y = hc; head.add(skull);
  const eyes = [];
  for (const s of [-1, 1]) {
    const eye = ball(0.023, dark, 16, 14); eye.position.set(s * 0.05, hc - 0.005, D.headW / 2 * 1.02 - 0.004); head.add(eye); eyes.push(eye);
    const brow = rbox(0.05, 0.013, 0.016, 0.005, mHair); brow.position.set(s * 0.05, hc + 0.042, D.headW / 2 * 1.02 - 0.003); brow.rotation.z = -s * 0.12; head.add(brow);
    const ear = ball(0.03, mSkin, 14, 10); ear.scale.set(0.55, 1, 0.8); ear.position.set(s * (D.headW / 2 - 0.002), hc - 0.01, 0); head.add(ear);
  }
  const nose = ball(0.02, mSkin, 12, 10); nose.position.set(0, hc - 0.03, D.headW / 2 * 1.02 + 0.002); head.add(nose);
  const hair = new THREE.Mesh(new THREE.SphereGeometry(1, 40, 22, 0, Math.PI * 2, 0, Math.PI * 0.55), mHair);
  hair.scale.set(D.headW / 2 + 0.006, D.headH / 2 + 0.006, D.headW / 2 * 1.02 + 0.006); hair.position.y = hc; hair.rotation.x = -0.3; head.add(hair);

  // ---- arms: shoulder -> elbow -> wrist, mitten hands, white cuffs ----
  const arms = {};
  const shRel = D.shoulderY - D.hipY;
  for (const [name, s] of [['L', 1], ['R', -1]]) {
    const sh = new THREE.Group(); sh.position.set(s * (D.torsoW / 2 + 0.018), shRel, 0); torso.add(sh);
    sh.add(ball(0.047, mTop));
    sh.add(limb(0.047, D.upperArm, mTop));
    const el = new THREE.Group(); el.position.y = -D.upperArm; sh.add(el);
    el.add(limb(0.042, D.foreArm, mTop));
    el.add(at(cyl(0.047, 0.047, 0.035, mWhite), 0, -D.foreArm + 0.01, 0));
    const hand = ball(0.056, mSkin, 24, 18); hand.scale.set(0.85, 1.2, 0.72); hand.position.y = -D.foreArm - 0.045; el.add(hand);
    arms[name] = { sh, el };
  }
  // ---- legs: short and sturdy, plain rounded shoes ----
  const legs = {}, lr = kind === 'sailor' ? 0.062 : 0.05;
  for (const [name, s] of [['L', 1], ['R', -1]]) {
    const hp = new THREE.Group(); hp.position.set(s * 0.1, 0, 0); hips.add(hp);
    hp.add(limb(lr, D.thigh, mLegs));
    const kn = new THREE.Group(); kn.position.y = -D.thigh; hp.add(kn);
    kn.add(limb(lr - 0.004, D.shin, mLegs));
    const ank = new THREE.Group(); ank.position.y = -D.shin; kn.add(ank);
    const shoe = new THREE.Mesh(new THREE.CapsuleGeometry(0.05, 0.1, 10, 24), mShoes);
    shoe.rotation.x = Math.PI / 2; shoe.scale.set(1, 1, 0.66); shoe.position.set(0, -0.016, 0.04); ank.add(shoe);
    legs[name] = { hp, kn, ank };
  }

  // ---- period costume, in the same blocky-round language ----
  const cloakPivot = new THREE.Group(); cloakPivot.position.set(0, neckRel - 0.02, -0.12); torso.add(cloakPivot);
  const sway = [];
  const hemRel = D.hemY - D.hipY;
  const puffs = (r) => { for (const s of [-1, 1]) { const p = ball(r, mLegs, 28, 20); p.scale.set(1, 0.9, 1.05); p.position.set(s * 0.1, hemRel - 0.02, 0); hips.add(p); } };
  if (kind === 'gentleman') {
    // doublet peplum (flared skirt), trunk hose, big ruff, capotain hat, shoulder cape, rapier
    const peplum = cyl(0.2, 0.255, 0.13, mTop, 48); peplum.scale.z = 0.72; peplum.position.set(0, hemRel + 0.025, 0); torso.add(peplum);
    puffs(0.125);
    const ruff = new THREE.Mesh(new THREE.TorusGeometry(0.15, 0.045, 16, 56), mWhite); ruff.rotation.x = Math.PI / 2; ruff.scale.set(1, 1, 0.8); ruff.position.y = neckRel + 0.0; torso.add(ruff);
    head.add(at(cyl(0.105, 0.135, 0.25, dark, 48), 0, hc + 0.17, 0));
    head.add(at(cyl(0.215, 0.215, 0.016, dark, 56), 0, hc + 0.045, 0));
    head.add(at(cyl(0.137, 0.137, 0.035, mat(0x6b5a3a), 48), 0, hc + 0.095, 0));
    const cg = new THREE.CylinderGeometry(0.19, 0.27, 0.6, 80, 12, true, Math.PI * 0.2, Math.PI * 1.6);
    const cp = cg.attributes.position;
    for (let i = 0; i < cp.count; i++) { const x = cp.getX(i), z = cp.getZ(i), y = cp.getY(i), a = Math.atan2(z, x), k = 1 + 0.07 * Math.sin(a * 7) * (0.3 + (0.5 - y / 0.6) * 0.9); cp.setX(i, x * k); cp.setZ(i, z * k * 0.8); }
    cg.computeVertexNormals();
    const cloak = new THREE.Mesh(cg, new THREE.MeshStandardMaterial({ color: 0x211d1a, roughness: 0.95, side: THREE.DoubleSide }));
    cloak.position.set(0, -0.3, 0.1); cloakPivot.add(cloak);
    const sword = cyl(0.011, 0.011, 0.95, steel, 12); sword.position.set(0.21, hemRel - 0.1, -0.12); sword.rotation.set(0.15, 0, 0.5); torso.add(sword);
  } else if (kind === 'soldier') {
    puffs(0.115);
    head.add(at(new THREE.Mesh(new THREE.SphereGeometry(0.152, 40, 20, 0, Math.PI * 2, 0, Math.PI / 2), steel), 0, hc + 0.045, 0));
    head.add(at(cyl(0.245, 0.245, 0.014, steel, 56), 0, hc + 0.045, 0));
    head.add(at(rbox(0.024, 0.12, 0.3, 0.01, steel), 0, hc + 0.2, 0));
    // breastplate: a shallow dished shell hugging the chest (flat on the body, slight centre ridge), not a ball
    const plate = ball(1, steel, 48, 32); plate.scale.set(0.185, 0.235, 0.05); plate.position.set(0, (D.shoulderY - 0.25) - D.hipY, D.torsoD / 2 - 0.006); torso.add(plate);
    const ridge = rbox(0.022, 0.4, 0.03, 0.01, steel); ridge.position.set(0, (D.shoulderY - 0.25) - D.hipY, D.torsoD / 2 + 0.03); torso.add(ridge);
    const gun = new THREE.Group(); gun.position.set(-(D.torsoW / 2 + 0.03), shRel + 0.1, 0); gun.rotation.set(-0.55, 0, -0.1); torso.add(gun);
    gun.add(at(cyl(0.015, 0.015, 1.3, wood, 14), 0, 0.5, 0)); gun.add(at(rbox(0.055, 0.3, 0.08, 0.022, wood), 0, -0.12, 0));
    sway.push({ g: gun, ax: -0.55 });
  } else {
    const cap = new THREE.Mesh(new THREE.SphereGeometry(1, 40, 22, 0, Math.PI * 2, 0, Math.PI * 0.62), mat(0x7a3430));
    cap.scale.set(D.headW / 2 + 0.012, D.headH / 2 + 0.018, D.headW / 2 * 1.02 + 0.012); cap.position.y = hc; cap.rotation.x = -0.15; head.add(cap);
    const tail = ball(0.04, mat(0x7a3430)); tail.position.set(0, hc + 0.0, -D.headW / 2 - 0.05); head.add(tail);
    const scarf = new THREE.Mesh(new THREE.TorusGeometry(0.1, 0.03, 12, 36), mat(0x8a2f2a)); scarf.rotation.x = Math.PI / 2; scarf.position.y = neckRel - 0.005; torso.add(scarf);
    torso.add(at(rbox(0.24, 0.28, 0.12, 0.05, mat(0x7a6b50)), 0, hemRel + 0.35, -0.18));
    const oar = new THREE.Group(); oar.position.set(D.torsoW / 2 + 0.03, shRel + 0.08, 0); oar.rotation.set(-0.5, 0, 0.12); torso.add(oar);
    oar.add(at(cyl(0.015, 0.015, 1.8, wood, 14), 0, 0.5, 0)); oar.add(at(rbox(0.12, 0.42, 0.022, 0.009, wood), 0, 1.3, 0));
    sway.push({ g: oar, ax: -0.5 });
  }
  root.traverse((o) => { if (o.isMesh) { o.castShadow = true; o.receiveShadow = true; } });

  /* ---- motion: pure functions of time ---- */
  const parts = { hips, torso, head, arms, legs, cloakPivot, body, eyes };
  function blink(t, seed) { const p = (t + seed) % 3.7; return p < 0.15 ? Math.sin((p / 0.15) * Math.PI) : 0; }

  function pose(t, mode = 'idle', phase = 0) {
    const bl = blink(t, phase * 0.37);
    for (const e of eyes) e.scale.y = 1 - 0.92 * bl;

    if (mode === 'walk') {
      const ph = t * Math.PI * 2 * 0.95 + phase, s = Math.sin(ph), c = Math.cos(ph);
      const side = (sg, cs) => {
        const hpx = -0.5 * s * sg - 0.04 * Math.sin(2 * ph + 0.6 * sg);
        const swing = Math.pow(Math.max(0, cs * sg), 1.5);
        const knx = 0.07 + 0.9 * swing + 0.1 * Math.max(0, -s * sg);
        const L = legs[sg > 0 ? 'L' : 'R'];
        L.hp.rotation.x = hpx; L.kn.rotation.x = knx;
        L.ank.rotation.x = -(hpx + knx) + 0.28 * Math.max(0, -hpx / 0.5) - 0.55 * Math.max(0, hpx / 0.5 - 0.35);
        L.hp.rotation.z = 0.0;
      };
      side(1, c); side(-1, c);
      hips.position.y = D.hipY + 0.02 * Math.cos(2 * ph) - 0.011;
      hips.position.x = 0.018 * s; hips.rotation.y = 0.09 * s; hips.rotation.z = 0.03 * s;
      torso.rotation.y = -0.15 * s; torso.rotation.x = 0.04 + 0.01 * Math.cos(2 * ph); torso.rotation.z = -0.025 * s;
      head.rotation.y = 0.06 * s; head.rotation.x = -0.03 + 0.012 * Math.cos(2 * ph);
      arms.L.sh.rotation.x = 0.46 * s + 0.07 * Math.sin(2 * ph); arms.R.sh.rotation.x = -0.46 * s + 0.07 * Math.sin(2 * ph);
      arms.L.sh.rotation.z = 0.02; arms.R.sh.rotation.z = -0.02;
      arms.L.el.rotation.x = -0.2 - 0.4 * sstep(0, 1, Math.max(0, -s)); arms.R.el.rotation.x = -0.2 - 0.4 * sstep(0, 1, Math.max(0, s));
      cloakPivot.rotation.x = 0.12 + 0.09 * Math.sin(ph - 1.0) + 0.03 * Math.sin(2 * ph - 0.5);
      for (const p of sway) p.g.rotation.x = p.ax + 0.035 * Math.sin(2 * ph - 0.8);
    } else {
      const b = Math.sin(t * 2.0), w = Math.sin(t * 0.55 + phase);
      hips.position.y = D.hipY + 0.003 * b; hips.position.x = 0.016 * w; hips.rotation.z = 0.028 * w; hips.rotation.y = 0.03 * Math.sin(t * 0.43 + phase);
      torso.scale.set(1 + 0.006 * b, 1 + 0.01 * b, 1 + 0.01 * b); torso.rotation.y = 0.04 * Math.sin(t * 0.43 + phase + 1); torso.rotation.z = -0.022 * w; torso.rotation.x = 0.0;
      for (const sd of ['L', 'R']) { legs[sd].hp.rotation.x = 0; legs[sd].kn.rotation.x = 0; legs[sd].ank.rotation.x = 0; }
      legs.L.hp.rotation.z = -0.03 * Math.max(0, w); legs.R.hp.rotation.z = 0.03 * Math.max(0, -w);
      const yaw = 0.34 * Math.sin(t * 0.37 + phase) + 0.14 * Math.sin(t * 0.91 + 1 + phase);
      head.rotation.y = yaw; head.rotation.x = 0.04 * Math.sin(t * 0.7 + phase) - 0.02;
      for (const sd of ['L', 'R']) { const sg = sd === 'L' ? 1 : -1; arms[sd].sh.rotation.x = 0.03 * Math.sin(t * 0.9 + phase + sg); arms[sd].sh.rotation.z = sg * 0.015; arms[sd].sh.position.y = shRel + 0.004 * b; arms[sd].el.rotation.x = -0.26 - 0.02 * Math.sin(t * 0.8 + sg); }
      cloakPivot.rotation.x = 0.05 + 0.03 * Math.sin(t * 1.1 - 0.6 + phase);
      for (const p of sway) p.g.rotation.x = p.ax + 0.015 * Math.sin(t * 0.9 + phase);
    }
  }
  return { root, pose, parts };
}
