import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';

/* ------------------------------------------------------------------
   Procedural "peg-doll" puppets: rounded block torso, round head with dot eyes, thin limbs, straight legs.
   No model files, no licences: everything is code, so costume + motion are fully ours.
   Faces +z at yaw 0. Feet on y=0. Height ~1.72 after the root scale.
------------------------------------------------------------------- */

const PAL = {
  gentleman: { top: 0x2b2622, legs: 0x6a3b32, shoes: 0x1c1815, skin: 0xc89a73, hair: 0x2a1f18 },
  soldier:   { top: 0x7a6a45, legs: 0x58563f, shoes: 0x2a211a, skin: 0xc19067, hair: 0x2f2419 },
  sailor:    { top: 0xb7ae94, legs: 0x45525e, shoes: 0x2a211a, skin: 0xb98560, hair: 0x3a2a1c },
};
const mat = (hex, rough = 0.85, metal = 0) => new THREE.MeshStandardMaterial({ color: hex, roughness: rough, metalness: metal });
const rbox = (w, h, d, r, m) => new THREE.Mesh(new RoundedBoxGeometry(w, h, d, 3, r), m);
const cyl = (rt, rb, h, m, seg = 10) => new THREE.Mesh(new THREE.CylinderGeometry(rt, rb, h, seg), m);
const at = (mesh, x, y, z) => { mesh.position.set(x, y, z); return mesh; };
const ball = (r, m) => new THREE.Mesh(new THREE.SphereGeometry(r, 14, 10), m);

export function makePuppet(kind, scale = 1.12) {
  const P = PAL[kind];
  const mTop = mat(P.top), mLegs = mat(P.legs), mShoes = mat(P.shoes), mSkin = mat(P.skin, 0.7), mHair = mat(P.hair), mWhite = mat(0xdcd6c6), dark = mat(0x161412);
  const steel = mat(0x70757c, 0.45, 0.6), wood = mat(0x4a3524);

  const root = new THREE.Group();
  const body = new THREE.Group(); root.add(body); body.scale.setScalar(scale);
  const hips = new THREE.Group(); hips.position.y = 0.8; body.add(hips);

  // torso (jacket block that reaches the top of the thighs, like the reference)
  const torso = new THREE.Group(); hips.add(torso);
  const jacket = rbox(0.34, 0.58, 0.2, 0.035, mTop); jacket.position.y = 0.19; torso.add(jacket);
  const neck = cyl(0.04, 0.045, 0.06, mSkin); neck.position.y = 0.5; torso.add(neck);

  // head: round, dot eyes, simple hair cap
  const head = new THREE.Group(); head.position.y = 0.52; torso.add(head);
  const skull = ball(0.108, mSkin); skull.scale.set(0.95, 1.08, 0.97); skull.position.y = 0.11; head.add(skull);
  for (const s of [-1, 1]) {
    const eye = ball(0.012, dark); eye.position.set(s * 0.036, 0.125, 0.098); head.add(eye);
    const brow = rbox(0.03, 0.006, 0.01, 0.002, mHair); brow.position.set(s * 0.036, 0.15, 0.1); head.add(brow);
  }
  const hair = new THREE.Mesh(new THREE.SphereGeometry(0.114, 16, 10, 0, Math.PI * 2, 0, Math.PI * 0.56), mHair);
  hair.position.y = 0.115; hair.rotation.x = -0.28; head.add(hair);

  // arms: shoulder -> elbow -> hand, white cuffs
  const arms = {};
  for (const [name, s] of [['L', 1], ['R', -1]]) {
    const sh = new THREE.Group(); sh.position.set(s * 0.215, 0.43, 0); torso.add(sh);
    const up = cyl(0.038, 0.034, 0.3, mTop); up.position.y = -0.15; sh.add(up);
    const el = new THREE.Group(); el.position.y = -0.3; sh.add(el);
    const fo = cyl(0.034, 0.03, 0.26, mTop); fo.position.y = -0.13; el.add(fo);
    const cuff = cyl(0.036, 0.036, 0.03, mWhite); cuff.position.y = -0.255; el.add(cuff);
    const hand = rbox(0.06, 0.07, 0.04, 0.015, mSkin); hand.position.y = -0.3; el.add(hand);
    arms[name] = { sh, el };
  }
  // legs: hip -> knee, straight block legs
  const legs = {};
  for (const [name, s] of [['L', 1], ['R', -1]]) {
    const hp = new THREE.Group(); hp.position.set(s * 0.085, 0, 0); hips.add(hp);
    const th = rbox(0.105, 0.4, 0.115, 0.03, mLegs); th.position.y = -0.2; hp.add(th);
    const kn = new THREE.Group(); kn.position.y = -0.4; hp.add(kn);
    const sn = rbox(0.092, 0.38, 0.1, 0.028, mLegs); sn.position.y = -0.19; kn.add(sn);
    const ft = rbox(0.1, 0.06, 0.19, 0.025, mShoes); ft.position.set(0, -0.395, 0.04); kn.add(ft);
    legs[name] = { hp, kn };
  }

  // ---- period costume, kept in the same blocky language ----
  const cloakPivot = new THREE.Group(); cloakPivot.position.set(0, 0.45, -0.1); torso.add(cloakPivot);
  if (kind === 'gentleman') {
    const hatCrown = cyl(0.085, 0.112, 0.2, dark, 14); hatCrown.position.y = 0.27; head.add(hatCrown);
    const brim = cyl(0.19, 0.19, 0.015, dark, 20); brim.position.y = 0.175; head.add(brim);
    const band = cyl(0.115, 0.115, 0.03, mat(0x6b5a3a), 14); band.position.y = 0.2; head.add(band);
    const ruff = new THREE.Mesh(new THREE.TorusGeometry(0.095, 0.03, 8, 20), mWhite); ruff.rotation.x = Math.PI / 2; ruff.position.y = 0.5; torso.add(ruff);
    for (const s of [-1, 1]) { const puff = ball(0.105, mLegs); puff.scale.set(1, 0.85, 1.05); puff.position.set(s * 0.085, -0.1, 0); hips.add(puff); }
    const cloak = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.34, 1.0, 18, 1, true, Math.PI * 0.2, Math.PI * 1.6), mat(0x211d1a));
    cloak.material.side = THREE.DoubleSide; cloak.position.set(0, -0.5, 0.08); cloakPivot.add(cloak);
    const sword = cyl(0.01, 0.01, 0.9, steel, 6); sword.position.set(0.19, -0.05, -0.1); sword.rotation.set(0.15, 0, 0.5); torso.add(sword);
  } else if (kind === 'soldier') {
    const dome = new THREE.Mesh(new THREE.SphereGeometry(0.125, 14, 10, 0, Math.PI * 2, 0, Math.PI / 2), steel); dome.position.y = 0.13; head.add(dome);
    const rim = cyl(0.2, 0.2, 0.012, steel, 20); rim.position.y = 0.13; head.add(rim);
    const comb = rbox(0.018, 0.1, 0.24, 0.006, steel); comb.position.y = 0.25; head.add(comb);
    const plate = cyl(0.165, 0.185, 0.3, steel, 14); plate.position.y = 0.3; torso.add(plate);
    for (const s of [-1, 1]) { const puff = ball(0.1, mLegs); puff.scale.set(1, 0.85, 1); puff.position.set(s * 0.085, -0.1, 0); hips.add(puff); }
    const gun = new THREE.Group(); gun.position.set(-0.22, 0.38, 0); gun.rotation.set(-0.55, 0, -0.1); torso.add(gun);
    gun.add(at(cyl(0.014, 0.014, 1.25, wood, 6), 0, 0.45, 0));
    gun.add(at(rbox(0.05, 0.28, 0.07, 0.01, wood), 0, -0.12, 0));
  } else {
    const cap = new THREE.Mesh(new THREE.SphereGeometry(0.122, 14, 10, 0, Math.PI * 2, 0, Math.PI * 0.62), mat(0x7a3430)); cap.position.y = 0.125; head.add(cap);
    const bag = rbox(0.22, 0.26, 0.11, 0.02, mat(0x7a6b50)); bag.position.set(0, 0.15, -0.16); torso.add(bag);
    const oar = new THREE.Group(); oar.position.set(0.22, 0.4, 0); oar.rotation.set(-0.5, 0, 0.12); torso.add(oar);
    oar.add(at(cyl(0.014, 0.014, 1.75, wood, 6), 0, 0.5, 0));
    oar.add(at(rbox(0.11, 0.4, 0.02, 0.005, wood), 0, 1.28, 0));
  }
  root.traverse((o) => { if (o.isMesh) { o.castShadow = true; o.receiveShadow = true; } });

  /* ---- motion: pure functions of time ---- */
  const parts = { hips, torso, head, arms, legs, cloakPivot, body };
  function pose(t, mode = 'idle', phase = 0) {
    const { hips, torso, head, arms, legs, cloakPivot } = parts;
    if (mode === 'walk') {
      const ph = t * Math.PI * 2 * 0.95 + phase, s = Math.sin(ph), c = Math.cos(ph);
      legs.L.hp.rotation.x = -0.55 * s; legs.R.hp.rotation.x = 0.55 * s;
      legs.L.kn.rotation.x = 0.1 + 0.75 * Math.max(0, c); legs.R.kn.rotation.x = 0.1 + 0.75 * Math.max(0, -c);
      arms.L.sh.rotation.x = 0.5 * s; arms.R.sh.rotation.x = -0.5 * s;
      arms.L.el.rotation.x = -0.3 - 0.2 * Math.max(0, -s); arms.R.el.rotation.x = -0.3 - 0.2 * Math.max(0, s);
      hips.position.y = 0.8 + 0.028 * Math.abs(c) - 0.01; hips.rotation.y = 0.12 * s; torso.rotation.y = -0.18 * s; torso.rotation.x = 0.05;
      head.rotation.y = 0.1 * s; head.rotation.x = 0.0;
      cloakPivot.rotation.x = 0.12 + 0.06 * Math.abs(s);
    } else {                                              // idle: breathing, weight shift, glancing around
      const b = Math.sin(t * 2.1);
      hips.position.y = 0.8 + 0.004 * b; hips.rotation.y = 0.03 * Math.sin(t * 0.6); hips.position.x = 0.012 * Math.sin(t * 0.6);
      torso.scale.y = 1 + 0.012 * b; torso.rotation.y = 0.03 * Math.sin(t * 0.6 + 1);
      for (const s of ['L', 'R']) { legs[s].hp.rotation.x = 0; legs[s].kn.rotation.x = 0; }
      legs.L.hp.rotation.z = 0.02 * Math.sin(t * 0.6); legs.R.hp.rotation.z = -0.02 * Math.sin(t * 0.6);
      arms.L.sh.rotation.x = 0.05 * Math.sin(t * 0.9); arms.R.sh.rotation.x = -0.05 * Math.sin(t * 0.9);
      arms.L.el.rotation.x = -0.12; arms.R.el.rotation.x = -0.12;
      const look = Math.sin(t * 0.7) * 0.45 * (Math.sin(t * 0.23) > -0.2 ? 1 : 0.3);
      head.rotation.y = look; head.rotation.x = 0.04 * Math.sin(t * 0.9);
      cloakPivot.rotation.x = 0.04 * b;
    }
  }
  return { root, pose, parts };
}
