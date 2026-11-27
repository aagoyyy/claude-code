import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';

/* ------------------------------------------------------------------
   Procedural peg-doll puppets, v2 (smoother).
   Shape: capsule limbs whose end-caps sit exactly on the joints (so bending never opens a gap), ball joints,
          high-resolution round head, smooth shading, rounded torso, soft cloth folds on the cloak.
   Motion: foot stays flat on the ground (ankle counter-rotation + heel/toe roll), pelvis bob/sway/twist,
          head stabilised against the torso, elbows bend more when the arm swings forward, cloak and carried
          props lag behind the body (secondary motion), idle uses layered slow sines + blinking.
   Faces +z at yaw 0. Feet on y=0. Height ~1.72.
------------------------------------------------------------------- */

const PAL = {
  gentleman: { top: 0x2b2622, legs: 0x6a3b32, shoes: 0x1c1815, skin: 0xc89a73, hair: 0x2a1f18 },
  soldier:   { top: 0x7a6a45, legs: 0x58563f, shoes: 0x2a211a, skin: 0xc19067, hair: 0x2f2419 },
  sailor:    { top: 0xb7ae94, legs: 0x45525e, shoes: 0x2a211a, skin: 0xb98560, hair: 0x3a2a1c },
};
const mat = (hex, rough = 0.82, metal = 0) => new THREE.MeshStandardMaterial({ color: hex, roughness: rough, metalness: metal });
const at = (mesh, x, y, z) => { mesh.position.set(x, y, z); return mesh; };
const ball = (r, m, ws = 28, hs = 20) => new THREE.Mesh(new THREE.SphereGeometry(r, ws, hs), m);
const cyl = (rt, rb, h, m, seg = 32) => new THREE.Mesh(new THREE.CylinderGeometry(rt, rb, h, seg), m);
const rbox = (w, h, d, r, m) => new THREE.Mesh(new RoundedBoxGeometry(w, h, d, 8, r), m);
// capsule whose two end-cap CENTRES are `D` apart; hangs down from y=0 (the upper joint) to y=-D (the lower joint)
const limb = (r, D, m) => { const c = new THREE.Mesh(new THREE.CapsuleGeometry(r, D, 10, 24), m); c.position.y = -D / 2; return c; };
const sstep = (a, b, x) => THREE.MathUtils.smoothstep(x, a, b);

export function makePuppet(kind, scale = 1.07) {
  const P = PAL[kind];
  const mTop = mat(P.top), mLegs = mat(P.legs), mShoes = mat(P.shoes, 0.7), mSkin = mat(P.skin, 0.65), mHair = mat(P.hair, 0.9), mWhite = mat(0xdcd6c6), dark = mat(0x161412);
  const steel = mat(0x70757c, 0.4, 0.6), wood = mat(0x4a3524);

  const root = new THREE.Group();
  const body = new THREE.Group(); body.scale.setScalar(scale); root.add(body);
  const hips = new THREE.Group(); hips.position.y = 0.85; body.add(hips);

  // torso: smoothly rounded block that reaches the top of the thighs
  const torso = new THREE.Group(); hips.add(torso);
  torso.add(at(rbox(0.35, 0.6, 0.23, 0.095, mTop), 0, 0.2, 0));
  torso.add(at(limb(0.04, 0.05, mSkin), 0, 0.57, 0));                            // neck

  // head: round, dot eyes, hair cap
  const head = new THREE.Group(); head.position.y = 0.55; torso.add(head);
  const skull = ball(0.108, mSkin, 40, 28); skull.scale.set(0.96, 1.1, 0.98); skull.position.y = 0.11; head.add(skull);
  const eyes = [];
  for (const s of [-1, 1]) {
    const eye = ball(0.0125, dark, 12, 10); eye.position.set(s * 0.037, 0.125, 0.099); head.add(eye); eyes.push(eye);
    const brow = rbox(0.032, 0.007, 0.012, 0.003, mHair); brow.position.set(s * 0.037, 0.152, 0.1); head.add(brow);
  }
  const hair = new THREE.Mesh(new THREE.SphereGeometry(0.115, 32, 18, 0, Math.PI * 2, 0, Math.PI * 0.56), mHair);
  hair.position.y = 0.115; hair.rotation.x = -0.28; head.add(hair);

  // arms: ball shoulder -> capsule -> ball elbow -> capsule -> cuff -> rounded hand
  const arms = {};
  for (const [name, s] of [['L', 1], ['R', -1]]) {
    const sh = new THREE.Group(); sh.position.set(s * 0.215, 0.44, 0); torso.add(sh);
    sh.add(ball(0.038, mTop));
    sh.add(limb(0.038, 0.27, mTop));
    const el = new THREE.Group(); el.position.y = -0.27; sh.add(el);
    el.add(limb(0.036, 0.23, mTop));
    el.add(at(cyl(0.039, 0.039, 0.03, mWhite), 0, -0.225, 0));
    const hand = ball(0.042, mSkin); hand.scale.set(0.9, 1.15, 0.7); hand.position.y = -0.275; el.add(hand);
    arms[name] = { sh, el };
  }
  // legs: ball hip -> capsule thigh -> ball knee -> capsule shin -> ankle -> rounded shoe
  const legs = {};
  for (const [name, s] of [['L', 1], ['R', -1]]) {
    const hp = new THREE.Group(); hp.position.set(s * 0.088, 0, 0); hips.add(hp);
    hp.add(limb(0.056, 0.4, mLegs));
    const kn = new THREE.Group(); kn.position.y = -0.4; hp.add(kn);
    kn.add(limb(0.052, 0.38, mLegs));
    const ank = new THREE.Group(); ank.position.y = -0.38; kn.add(ank);
    const shoe = new THREE.Mesh(new THREE.CapsuleGeometry(0.046, 0.1, 8, 20), mShoes);
    shoe.rotation.x = Math.PI / 2; shoe.scale.set(1, 1, 0.78); shoe.position.set(0, -0.025, 0.05); ank.add(shoe);
    legs[name] = { hp, kn, ank };
  }

  // ---- period costume (same blocky-round language) ----
  const cloakPivot = new THREE.Group(); cloakPivot.position.set(0, 0.5, -0.11); torso.add(cloakPivot);
  const sway = [];            // carried props that lag behind the body
  if (kind === 'gentleman') {
    head.add(at(cyl(0.088, 0.114, 0.2, dark, 40), 0, 0.275, 0));
    head.add(at(cyl(0.19, 0.19, 0.014, dark, 48), 0, 0.18, 0));
    head.add(at(cyl(0.117, 0.117, 0.03, mat(0x6b5a3a), 40), 0, 0.205, 0));
    const ruff = new THREE.Mesh(new THREE.TorusGeometry(0.098, 0.032, 14, 48), mWhite); ruff.rotation.x = Math.PI / 2; ruff.position.y = 0.56; torso.add(ruff);
    for (const s of [-1, 1]) { const puff = ball(0.108, mLegs, 28, 20); puff.scale.set(1, 0.85, 1.05); puff.position.set(s * 0.088, -0.1, 0); hips.add(puff); }
    // cloak with soft folds
    const cg = new THREE.CylinderGeometry(0.17, 0.33, 1.02, 72, 10, true, Math.PI * 0.18, Math.PI * 1.64);
    const cp = cg.attributes.position;
    for (let i = 0; i < cp.count; i++) {
      const x = cp.getX(i), z = cp.getZ(i), y = cp.getY(i), a = Math.atan2(z, x), k = 1 + 0.06 * Math.sin(a * 7) * (0.35 + (0.5 - y / 1.02) * 0.9);
      cp.setX(i, x * k); cp.setZ(i, z * k);
    }
    cg.computeVertexNormals();
    const cloak = new THREE.Mesh(cg, new THREE.MeshStandardMaterial({ color: 0x211d1a, roughness: 0.95, side: THREE.DoubleSide }));
    cloak.position.set(0, -0.5, 0.1); cloakPivot.add(cloak);
    const sword = cyl(0.01, 0.01, 0.9, steel, 10); sword.position.set(0.2, -0.05, -0.1); sword.rotation.set(0.15, 0, 0.5); torso.add(sword);
  } else if (kind === 'soldier') {
    head.add(at(new THREE.Mesh(new THREE.SphereGeometry(0.127, 32, 18, 0, Math.PI * 2, 0, Math.PI / 2), steel), 0, 0.135, 0));
    head.add(at(cyl(0.2, 0.2, 0.013, steel, 48), 0, 0.135, 0));
    head.add(at(rbox(0.02, 0.1, 0.24, 0.008, steel), 0, 0.255, 0));
    torso.add(at(cyl(0.17, 0.19, 0.3, steel, 40), 0, 0.31, 0));
    for (const s of [-1, 1]) { const puff = ball(0.102, mLegs, 28, 20); puff.scale.set(1, 0.85, 1); puff.position.set(s * 0.088, -0.1, 0); hips.add(puff); }
    const gun = new THREE.Group(); gun.position.set(-0.225, 0.4, 0); gun.rotation.set(-0.55, 0, -0.1); torso.add(gun);
    gun.add(at(cyl(0.014, 0.014, 1.25, wood, 12), 0, 0.45, 0)); gun.add(at(rbox(0.05, 0.28, 0.07, 0.02, wood), 0, -0.12, 0));
    sway.push({ g: gun, ax: -0.55 });
  } else {
    const cap = new THREE.Mesh(new THREE.SphereGeometry(0.124, 32, 18, 0, Math.PI * 2, 0, Math.PI * 0.62), mat(0x7a3430)); cap.position.y = 0.127; head.add(cap);
    torso.add(at(rbox(0.22, 0.26, 0.11, 0.05, mat(0x7a6b50)), 0, 0.17, -0.17));
    const oar = new THREE.Group(); oar.position.set(0.225, 0.42, 0); oar.rotation.set(-0.5, 0, 0.12); torso.add(oar);
    oar.add(at(cyl(0.014, 0.014, 1.75, wood, 12), 0, 0.5, 0)); oar.add(at(rbox(0.11, 0.4, 0.02, 0.008, wood), 0, 1.28, 0));
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
      // legs: hip swing + knee flexion in the swing phase; ankle keeps the foot flat, with heel strike and toe push-off
      const side = (sg, cs) => {           // sg = +1 for the left leg, -1 for the right leg
        const hpx = -0.52 * s * sg - 0.04 * Math.sin(2 * ph + 0.6 * sg);
        const swing = Math.pow(Math.max(0, cs * sg), 1.5);
        const knx = 0.07 + 0.92 * swing + 0.1 * Math.max(0, -s * sg);
        const L = legs[sg > 0 ? 'L' : 'R'];
        L.hp.rotation.x = hpx; L.kn.rotation.x = knx;
        L.ank.rotation.x = -(hpx + knx) + 0.28 * Math.max(0, -hpx / 0.52) - 0.55 * Math.max(0, hpx / 0.52 - 0.35);
        L.hp.rotation.z = 0.0;
      };
      side(1, c); side(-1, c);
      hips.position.y = 0.85 + 0.022 * Math.cos(2 * ph) - 0.012;
      hips.position.x = 0.02 * s; hips.rotation.y = 0.10 * s; hips.rotation.z = 0.035 * s;
      torso.rotation.y = -0.17 * s; torso.rotation.x = 0.05 + 0.01 * Math.cos(2 * ph); torso.rotation.z = -0.03 * s;
      head.rotation.y = 0.07 * s; head.rotation.x = -0.03 + 0.012 * Math.cos(2 * ph);       // head counter-rotates: gaze stays forward
      arms.L.sh.rotation.x = 0.48 * s + 0.08 * Math.sin(2 * ph); arms.R.sh.rotation.x = -0.48 * s + 0.08 * Math.sin(2 * ph);
      arms.L.sh.rotation.z = 0.05; arms.R.sh.rotation.z = -0.05;
      arms.L.el.rotation.x = -0.22 - 0.42 * sstep(0, 1, Math.max(0, -s)); arms.R.el.rotation.x = -0.22 - 0.42 * sstep(0, 1, Math.max(0, s));
      cloakPivot.rotation.x = 0.13 + 0.1 * Math.sin(ph - 1.0) + 0.035 * Math.sin(2 * ph - 0.5);
      for (const p of sway) p.g.rotation.x = p.ax + 0.035 * Math.sin(2 * ph - 0.8);
    } else {
      const b = Math.sin(t * 2.0), w = Math.sin(t * 0.55 + phase);
      hips.position.y = 0.85 + 0.003 * b; hips.position.x = 0.018 * w; hips.rotation.z = 0.03 * w; hips.rotation.y = 0.03 * Math.sin(t * 0.43 + phase);
      torso.scale.set(1 + 0.006 * b, 1 + 0.012 * b, 1 + 0.01 * b); torso.rotation.y = 0.04 * Math.sin(t * 0.43 + phase + 1); torso.rotation.z = -0.025 * w; torso.rotation.x = 0.0;
      for (const sd of ['L', 'R']) { legs[sd].hp.rotation.x = 0; legs[sd].kn.rotation.x = 0.0; legs[sd].ank.rotation.x = 0; }
      legs.L.hp.rotation.z = -0.03 * Math.max(0, w) ; legs.R.hp.rotation.z = 0.03 * Math.max(0, -w);
      const yaw = 0.34 * Math.sin(t * 0.37 + phase) + 0.14 * Math.sin(t * 0.91 + 1 + phase);
      head.rotation.y = yaw; head.rotation.x = 0.04 * Math.sin(t * 0.7 + phase) - 0.02;
      for (const sd of ['L', 'R']) { const sg = sd === 'L' ? 1 : -1; arms[sd].sh.rotation.x = 0.035 * Math.sin(t * 0.9 + phase + sg); arms[sd].sh.rotation.z = sg * 0.04; arms[sd].sh.position.y = 0.44 + 0.004 * b; arms[sd].el.rotation.x = -0.14 - 0.02 * Math.sin(t * 0.8 + sg); }
      cloakPivot.rotation.x = 0.05 + 0.03 * Math.sin(t * 1.1 - 0.6 + phase);
      for (const p of sway) p.g.rotation.x = p.ax + 0.015 * Math.sin(t * 0.9 + phase);
    }
  }
  return { root, pose, parts };
}
