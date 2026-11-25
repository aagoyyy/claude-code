import * as THREE from 'three';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';

/* ------------------------------------------------------------------
   The Lost Colony of Roanoke — visual test (Aug 1590)
   Everything is a pure function of time t => deterministic frame export
   via window.__setTime(t).

   Beats (seconds):
     0  - 9   : John White's ship approaches the island through morning haze
     9  - 15  : low glide over the beach toward the empty settlement
     15 - 19  : camera settles in front of the gate post
     18 - 27  : CROATOAN lights up letter by letter, title card, fade out
------------------------------------------------------------------- */

const W = 1280, H = 720;
const T_END = 27;

const clamp = (x, a, b) => Math.min(b, Math.max(a, x));
const smooth = (x, a, b) => THREE.MathUtils.smoothstep(x, a, b);
const lerp = THREE.MathUtils.lerp;

function mulberry32(a) {
  return () => {
    a |= 0; a = (a + 0x6D2B79F5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/* ---------- noise ---------- */
function hash3(x, y, z) {
  let h = Math.imul(x, 374761393) ^ Math.imul(y, 668265263) ^ Math.imul(z, 1274126177);
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  h ^= h >>> 16;
  return (h >>> 0) / 4294967295;
}
const sm3 = (t) => t * t * (3 - 2 * t);
const mix = (a, b, t) => a + (b - a) * t;
function vnoise(x, y, z) {
  const xi = Math.floor(x), yi = Math.floor(y), zi = Math.floor(z);
  const xf = sm3(x - xi), yf = sm3(y - yi), zf = sm3(z - zi);
  const c = (dx, dy, dz) => hash3(xi + dx, yi + dy, zi + dz);
  return mix(
    mix(mix(c(0, 0, 0), c(1, 0, 0), xf), mix(c(0, 1, 0), c(1, 1, 0), xf), yf),
    mix(mix(c(0, 0, 1), c(1, 0, 1), xf), mix(c(0, 1, 1), c(1, 1, 1), xf), yf), zf);
}
function fbm(x, y, z, oct = 4) {
  let a = 0.5, s = 0, f = 1;
  for (let i = 0; i < oct; i++) { s += a * vnoise(x * f, y * f, z * f); f *= 2; a *= 0.5; }
  return s;
}

/* ---------- renderer / scene ---------- */
const renderer = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true });
renderer.setPixelRatio(1);
renderer.setSize(W, H);
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.05;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
const stage = document.getElementById('stage');
stage.insertBefore(renderer.domElement, stage.firstChild);
function fit() { stage.style.transform = `scale(${Math.min(innerWidth / W, innerHeight / H)})`; }
addEventListener('resize', fit); fit();

const scene = new THREE.Scene();
const HAZE = new THREE.Color('#9aa0a2');
scene.background = HAZE.clone();
scene.fog = new THREE.FogExp2(HAZE, 0.011);
const camera = new THREE.PerspectiveCamera(40, W / H, 0.1, 4000);

const SUN_DIR = new THREE.Vector3(0.1, 0.14, 1).normalize();   // sun sits low over the forest, behind the settlement

/* ---------- sky ---------- */
const skyMat = new THREE.ShaderMaterial({
  uniforms: { uSunDir: { value: SUN_DIR }, uTime: { value: 0 } },
  vertexShader: `
    varying vec3 vDir;
    void main() { vDir = normalize(position); gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,
  fragmentShader: `
    uniform vec3 uSunDir; uniform float uTime; varying vec3 vDir;
    float h(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
    float n(vec2 p) { vec2 i = floor(p), f = fract(p); f = f * f * (3.0 - 2.0 * f);
      return mix(mix(h(i), h(i + vec2(1, 0)), f.x), mix(h(i + vec2(0, 1)), h(i + vec2(1, 1)), f.x), f.y); }
    float fbm(vec2 p) { float a = 0.5, s = 0.0; for (int i = 0; i < 5; i++) { s += a * n(p); p *= 2.03; a *= 0.5; } return s; }
    void main() {
      vec3 d = normalize(vDir);
      float y = d.y;
      vec3 top = vec3(0.05, 0.08, 0.14), mid = vec3(0.20, 0.27, 0.36), hor = vec3(0.62, 0.50, 0.38);
      vec3 col = mix(hor, mid, smoothstep(0.0, 0.22, y));
      col = mix(col, top, smoothstep(0.18, 0.9, y));
      col = mix(col, vec3(0.20, 0.22, 0.24), 1.0 - smoothstep(-0.12, 0.0, y));
      vec2 cp = d.xz / (max(y, 0.0) + 0.3) * 1.5 + vec2(uTime * 0.012, 0.0);
      float c = smoothstep(0.42, 0.8, fbm(cp)) * smoothstep(0.0, 0.18, y);
      float s = max(dot(d, uSunDir), 0.0);
      vec3 cloud = mix(vec3(0.22, 0.25, 0.31), vec3(0.95, 0.60, 0.32), pow(s, 3.0));
      col = mix(col, cloud, c * 0.8);
      col += vec3(1.0, 0.62, 0.30) * pow(s, 22.0) * 0.8 + vec3(1.0, 0.85, 0.6) * pow(s, 500.0) * 3.0;
      gl_FragColor = vec4(col, 1.0);
      #include <tonemapping_fragment>
      #include <colorspace_fragment>
    }`,
  side: THREE.BackSide, depthWrite: false, depthTest: false, fog: false });
const sky = new THREE.Mesh(new THREE.SphereGeometry(1500, 32, 20), skyMat);
sky.renderOrder = -10; sky.frustumCulled = false;
scene.add(sky);

/* ---------- lights ---------- */
const sun = new THREE.DirectionalLight(0xffc98a, 2.4);
sun.position.copy(new THREE.Vector3(0, 1, 40)).addScaledVector(SUN_DIR, 300);
sun.target.position.set(0, 1, 40);
sun.castShadow = true;
sun.shadow.mapSize.set(4096, 4096);
Object.assign(sun.shadow.camera, { left: -55, right: 55, top: 55, bottom: -55, near: 1, far: 700 });
sun.shadow.bias = -0.0005; sun.shadow.normalBias = 0.06;
scene.add(sun, sun.target);
scene.add(new THREE.HemisphereLight(0x9fb0c8, 0x4a4234, 0.9));
const fill = new THREE.DirectionalLight(0x8fa5c4, 0.85);      // cool fill from the sea side
fill.position.set(0, 60, -200);
scene.add(fill);
const lantern = new THREE.PointLight(0xffb06a, 0, 18, 2);
scene.add(lantern);

/* ---------- terrain ---------- */
function clearingK(x, z) { return 1 - smooth(Math.hypot(x / 26, (z - 41) / 22), 0.85, 1.4); }
function terrainH(x, z) {
  const shore = 3.5 * Math.sin(x * 0.045) + 2 * Math.sin(x * 0.11 + 1.3);
  const d = z - shore;
  let h = d < 0 ? 0.25 + d * 0.10 : 0.25 + 0.85 * (1 - Math.exp(-d * 0.18));
  if (d > 0) h += (fbm(x * 0.03 + 9, 0, z * 0.03 + 2) - 0.5) * 1.8 * smooth(d, 8, 30);
  return lerp(h, 1.05, clearingK(x, z));
}
const GROUND = 1.05;   // height of the flat clearing

{
  const X0 = -220, X1 = 220, Z0 = -90, Z1 = 260, STEP = 2.5;
  const geo = new THREE.PlaneGeometry(X1 - X0, Z1 - Z0, Math.round((X1 - X0) / STEP), Math.round((Z1 - Z0) / STEP));
  geo.rotateX(-Math.PI / 2);
  geo.translate((X0 + X1) / 2, 0, (Z0 + Z1) / 2);
  const pos = geo.attributes.position;
  const col = new Float32Array(pos.count * 3);
  const c = new THREE.Color();
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i), z = pos.getZ(i);
    const h = terrainH(x, z); pos.setY(i, h);
    const n = fbm(x * 0.09 + 5, 0, z * 0.09);
    const cl = 1 - smooth(Math.hypot(x / 26, (z - 41) / 22), 0.6, 1.9) ;   // much softer than the height flatten, so no visible edge
    let r, g, b;
    if (h < 0.4) {                        // wet -> dry sand
      const k = smooth(h, 0.05, 0.4);
      r = mix(0.30, 0.62, k); g = mix(0.27, 0.55, k); b = mix(0.22, 0.42, k);
    } else if (h < 0.85) {                // sand -> grass
      const k = smooth(h, 0.55, 0.85);
      r = mix(0.62, 0.30, k) + n * 0.05; g = mix(0.55, 0.36, k) + n * 0.05; b = mix(0.42, 0.17, k);
    } else {                              // scrub grass
      r = 0.27 + n * 0.14; g = 0.33 + n * 0.12; b = 0.15 + n * 0.05;
    }
    r = mix(r, 0.46 * (0.85 + n * 0.3), cl * 0.8); g = mix(g, 0.38 * (0.85 + n * 0.3), cl * 0.8); b = mix(b, 0.27 * (0.85 + n * 0.3), cl * 0.8);
    c.setRGB(r, g, b, THREE.SRGBColorSpace);
    col[i * 3] = c.r; col[i * 3 + 1] = c.g; col[i * 3 + 2] = c.b;
  }
  geo.setAttribute('color', new THREE.BufferAttribute(col, 3));
  geo.computeVertexNormals();
  const terrain = new THREE.Mesh(geo, new THREE.MeshStandardMaterial({ vertexColors: true, flatShading: true, roughness: 1 }));
  terrain.receiveShadow = true;
  scene.add(terrain);
}

/* ---------- sea ---------- */
function waveH(x, z, t) {
  return 0.10 * Math.sin(x * 0.22 + t * 0.9) + 0.08 * Math.sin(z * 0.17 - t * 1.1 + 1.0) + 0.05 * Math.sin((x + z) * 0.4 + t * 1.7);
}
const waterGeo = new THREE.PlaneGeometry(900, 660, 150, 110);
waterGeo.rotateX(-Math.PI / 2);
waterGeo.translate(0, 0, -270);
const waterPos = waterGeo.attributes.position;
const waterBase = new Float32Array(waterPos.count * 2);
{
  const col = new Float32Array(waterPos.count * 3);
  const shallow = new THREE.Color().setRGB(0.44, 0.56, 0.54, THREE.SRGBColorSpace);
  const deep = new THREE.Color().setRGB(0.13, 0.21, 0.28, THREE.SRGBColorSpace);
  const c = new THREE.Color();
  for (let i = 0; i < waterPos.count; i++) {
    const x = waterPos.getX(i), z = waterPos.getZ(i);
    waterBase[i * 2] = x; waterBase[i * 2 + 1] = z;
    c.copy(shallow).lerp(deep, smooth(-terrainH(x, z), 0.3, 6));
    col[i * 3] = c.r; col[i * 3 + 1] = c.g; col[i * 3 + 2] = c.b;
  }
  waterGeo.setAttribute('color', new THREE.BufferAttribute(col, 3));
}
const water = new THREE.Mesh(waterGeo, new THREE.MeshStandardMaterial({
  vertexColors: true, flatShading: true, roughness: 0.28, metalness: 0.05,
  emissive: 0x1f3342, emissiveIntensity: 0.7 }));   // lifts the backlit sea out of pure black
water.receiveShadow = false;
scene.add(water);

/* ---------- trees & scrub (instanced) ---------- */
{
  const rnd = mulberry32(7);
  const trunkGeo = new THREE.CylinderGeometry(0.16, 0.3, 1, 6); trunkGeo.translate(0, 0.5, 0);
  const coneGeo = new THREE.ConeGeometry(1, 1, 7); coneGeo.translate(0, 0.5, 0);
  const N = 420;
  const trunks = new THREE.InstancedMesh(trunkGeo, new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 1, flatShading: true }), N);
  const can1 = new THREE.InstancedMesh(coneGeo, new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 1, flatShading: true }), N);
  const can2 = new THREE.InstancedMesh(coneGeo, new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 1, flatShading: true }), N);
  const d = new THREE.Object3D(), c = new THREE.Color();
  let k = 0, guard = 0;
  while (k < N && guard++ < 8000) {
    const x = (rnd() * 2 - 1) * 210, z = 6 + rnd() * 240;
    if (z < 70 && rnd() < 0.55) continue;                       // thinner near the coast
    const dz = z - (3.5 * Math.sin(x * 0.045) + 2 * Math.sin(x * 0.11 + 1.3));
    if (dz < 7) continue;
    if (Math.hypot(x / 29, (z - 41) / 25) < 1.0) continue;        // keep the clearing empty
    if (Math.abs(x) < 11 && z < 36) continue;                      // keep the beach lane open
    const y = terrainH(x, z);
    const th = 6 + rnd() * 5, cr = 1.5 + rnd() * 1.1, ch = 4.2 + rnd() * 2.2;
    d.rotation.set(0, rnd() * 6.28, 0);
    d.position.set(x, y, z); d.scale.set(1, th, 1); d.updateMatrix(); trunks.setMatrixAt(k, d.matrix);
    c.setRGB(0.22 + rnd() * 0.08, 0.15 + rnd() * 0.05, 0.10, THREE.SRGBColorSpace); trunks.setColorAt(k, c);
    d.position.set(x, y + th * 0.42, z); d.scale.set(cr, ch, cr); d.updateMatrix(); can1.setMatrixAt(k, d.matrix);
    d.position.set(x, y + th * 0.42 + ch * 0.55, z); d.scale.set(cr * 0.7, ch * 0.8, cr * 0.7); d.updateMatrix(); can2.setMatrixAt(k, d.matrix);
    const g = rnd();
    c.setRGB(0.08 + g * 0.07, 0.17 + g * 0.1, 0.09 + g * 0.04, THREE.SRGBColorSpace);
    can1.setColorAt(k, c); can2.setColorAt(k, c);
    k++;
  }
  for (const m of [trunks, can1, can2]) { m.count = k; m.castShadow = true; m.receiveShadow = true; m.frustumCulled = false; scene.add(m); }

  // beach scrub
  const bushGeo = new THREE.IcosahedronGeometry(1, 0);
  const M = 150;
  const bush = new THREE.InstancedMesh(bushGeo, new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 1, flatShading: true }), M);
  let b = 0; guard = 0;
  while (b < M && guard++ < 6000) {
    const x = (rnd() * 2 - 1) * 200, z = 4 + rnd() * 50;
    const shore = 3.5 * Math.sin(x * 0.045) + 2 * Math.sin(x * 0.11 + 1.3);
    if (z - shore < 3) continue;
    if (Math.abs(x) < 8 && z < 34) continue;
    if (Math.hypot(x / 27, (z - 41) / 23) < 1.0) continue;
    const s = 0.35 + rnd() * 0.6;
    d.rotation.set(rnd() * 3, rnd() * 3, 0);
    d.position.set(x, terrainH(x, z) + s * 0.3, z); d.scale.set(s * 1.5, s * 0.8, s * 1.5); d.updateMatrix(); bush.setMatrixAt(b, d.matrix);
    c.setRGB(0.24 + rnd() * 0.1, 0.36 + rnd() * 0.1, 0.14, THREE.SRGBColorSpace); bush.setColorAt(b, c);
    b++;
  }
  bush.count = b; bush.castShadow = true; bush.receiveShadow = true; bush.frustumCulled = false;
  scene.add(bush);
}

/* ---------- palisade (broken, partly dismantled) ---------- */
const GATE_X = 3.0;
const RECT = { x0: -15, x1: 15, z0: 28, z1: 54 };
{
  const rnd = mulberry32(21);
  const stakeGeo = new THREE.CylinderGeometry(0.09, 0.16, 1, 6); stakeGeo.translate(0, 0.5, 0);
  const list = [];
  const side = (xa, za, xb, zb, skip, isFront) => {
    const len = Math.hypot(xb - xa, zb - za), n = Math.floor(len / 0.42);
    for (let i = 0; i <= n; i++) {
      const t = i / n, x = lerp(xa, xb, t), z = lerp(za, zb, t);
      if (isFront && Math.abs(x) < GATE_X) continue;               // the gate gap
      if (rnd() < skip) continue;
      const broken = rnd() < 0.2;
      list.push({ x: x + (rnd() - 0.5) * 0.08, z: z + (rnd() - 0.5) * 0.08,
        h: broken ? 0.5 + rnd() * 1.2 : 2.7 + rnd() * 0.7, tx: (rnd() - 0.5) * 0.16, tz: (rnd() - 0.5) * 0.16 });
    }
  };
  side(RECT.x0, RECT.z0, RECT.x1, RECT.z0, 0.28, true);
  side(RECT.x0, RECT.z1, RECT.x1, RECT.z1, 0.42, false);
  side(RECT.x0, RECT.z0, RECT.x0, RECT.z1, 0.32, false);
  side(RECT.x1, RECT.z0, RECT.x1, RECT.z1, 0.32, false);
  const fallen = 34;
  const mesh = new THREE.InstancedMesh(stakeGeo, new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 1, flatShading: true }), list.length + fallen);
  const d = new THREE.Object3D(), c = new THREE.Color();
  list.forEach((s, i) => {
    d.rotation.set(s.tx, rnd() * 6, s.tz); d.position.set(s.x, terrainH(s.x, s.z) - 0.1, s.z); d.scale.set(1, s.h, 1);
    d.updateMatrix(); mesh.setMatrixAt(i, d.matrix);
    const v = rnd(); c.setRGB(0.30 + v * 0.1, 0.23 + v * 0.07, 0.16 + v * 0.05, THREE.SRGBColorSpace); mesh.setColorAt(i, c);
  });
  for (let j = 0; j < fallen; j++) {
    const i = list.length + j;
    const near = list[Math.floor(rnd() * list.length)];
    const x = near.x + (rnd() - 0.5) * 3, z = near.z + (rnd() - 0.5) * 3;
    d.rotation.set(0, rnd() * 3.14, Math.PI / 2, 'YXZ');
    d.position.set(x, terrainH(x, z) + 0.12, z); d.scale.set(1, 2.4 + rnd() * 1.2, 1);
    d.updateMatrix(); mesh.setMatrixAt(i, d.matrix);
    c.setRGB(0.27, 0.21, 0.15, THREE.SRGBColorSpace); mesh.setColorAt(i, c);
  }
  mesh.castShadow = true; mesh.receiveShadow = true; mesh.frustumCulled = false;
  scene.add(mesh);
}

/* ---------- dismantled houses, props (merged, vertex coloured) ---------- */
{
  const pieces = [];
  const _m = new THREE.Matrix4(), _q = new THREE.Quaternion(), _e = new THREE.Euler(), _p = new THREE.Vector3(), _s = new THREE.Vector3();
  const boxU = new THREE.BoxGeometry(1, 1, 1);
  const cylU = new THREE.CylinderGeometry(0.5, 0.5, 1, 10);
  const discU = new THREE.CircleGeometry(1, 14);
  const addPiece = (geo, x, y, z, rx, ry, rz, sx, sy, sz, color) => {
    _e.set(rx, ry, rz, 'YXZ'); _q.setFromEuler(_e); _p.set(x, y, z); _s.set(sx, sy, sz); _m.compose(_p, _q, _s);
    const g = geo.clone().applyMatrix4(_m);
    const cc = new THREE.Color(color), n = g.attributes.position.count, arr = new Float32Array(n * 3);
    for (let i = 0; i < n; i++) { arr[i * 3] = cc.r; arr[i * 3 + 1] = cc.g; arr[i * 3 + 2] = cc.b; }
    g.setAttribute('color', new THREE.BufferAttribute(arr, 3));
    pieces.push(g);
  };
  const wood = (r) => new THREE.Color().setRGB(0.26 + r * 0.1, 0.19 + r * 0.07, 0.13 + r * 0.05, THREE.SRGBColorSpace);
  const stone = (r) => new THREE.Color().setRGB(0.36 + r * 0.12, 0.34 + r * 0.1, 0.30 + r * 0.08, THREE.SRGBColorSpace);

  const house = (cx, cz, w, d, rot, seed) => {
    const r = mulberry32(seed), gy = terrainH(cx, cz), cs = Math.cos(rot), sn = Math.sin(rot);
    const L = (lx, lz) => [cx + lx * cs + lz * sn, cz - lx * sn + lz * cs];
    const tall = {};
    for (const [sx, sz] of [[-1, -1], [1, -1], [-1, 1], [1, 1]]) {
      const h = r() < 0.35 ? 0.8 + r() * 0.9 : 2.2 + r() * 0.9;
      tall[`${sx}${sz}`] = h;
      const [x, z] = L(sx * w / 2, sz * d / 2);
      addPiece(boxU, x, gy + h / 2, z, (r() - 0.5) * 0.06, rot, (r() - 0.5) * 0.06, 0.22, h, 0.22, wood(r()));
    }
    // ground sills (some gone)
    for (const sz of [-1, 1]) if (r() > 0.25) { const [x, z] = L(0, sz * d / 2); addPiece(boxU, x, gy + 0.1, z, 0, rot, 0, w, 0.16, 0.2, wood(r())); }
    for (const sx of [-1, 1]) if (r() > 0.25) { const [x, z] = L(sx * w / 2, 0); addPiece(boxU, x, gy + 0.1, z, 0, rot + Math.PI / 2, 0, d, 0.16, 0.2, wood(r())); }
    // a surviving cross-beam where both posts stayed tall
    for (const sz of [-1, 1]) if (tall[`-1${sz}`] > 2.2 && tall[`1${sz}`] > 2.2) {
      const [x, z] = L(0, sz * d / 2); addPiece(boxU, x, gy + 2.15, z, 0, rot, 0, w, 0.18, 0.2, wood(r()));
    }
    // foundation stones
    const per = 2 * (w + d), ns = Math.floor(per / 0.8);
    for (let i = 0; i < ns; i++) {
      if (r() < 0.3) continue;
      const u = (i / ns) * per; let lx, lz;
      if (u < w) { lx = -w / 2 + u; lz = -d / 2; } else if (u < w + d) { lx = w / 2; lz = -d / 2 + (u - w); }
      else if (u < 2 * w + d) { lx = w / 2 - (u - w - d); lz = d / 2; } else { lx = -w / 2; lz = d / 2 - (u - 2 * w - d); }
      const [x, z] = L(lx, lz);
      addPiece(boxU, x, gy + 0.1, z, r() * 0.3, r() * 3, r() * 0.3, 0.4 + r() * 0.15, 0.22, 0.36 + r() * 0.1, stone(r()));
    }
    // chimney stub: the one thing that is still standing
    const side = r() < 0.5 ? -1 : 1;
    const [chx, chz] = L(side * (w / 2 + 0.5), 0);
    addPiece(boxU, chx, gy + 1.3, chz, 0, rot, 0, 0.9, 2.6, 1.1, stone(0.4));
    addPiece(boxU, chx, gy + 2.75, chz, 0, rot, 0, 0.7, 0.3, 0.9, stone(0.6));
    // plank pile + cold hearth
    const [px, pz] = L((r() - 0.5) * w, (r() > 0.5 ? 1 : -1) * (d / 2 + 0.9));
    for (let i = 0; i < 6; i++) addPiece(boxU, px + (r() - 0.5) * 0.4, gy + 0.05 + i * 0.07, pz + (r() - 0.5) * 0.4, 0, r() * 0.5 + rot, 0, 1.8, 0.05, 0.22, wood(r()));
    const [hx, hz] = L(0, 0);
    addPiece(discU, hx, gy + 0.03, hz, -Math.PI / 2, 0, 0, 1.0, 1.0, 1.0, new THREE.Color().setRGB(0.08, 0.075, 0.07, THREE.SRGBColorSpace));
  };
  [[-10.5, 34, 6, 5, 0.08, 11], [-10.5, 45.5, 6.5, 5, -0.05, 12], [-4.5, 50.5, 5.5, 4.5, 0.02, 13],
   [6, 49.5, 5.5, 5, -0.1, 14], [10, 37, 6, 5.5, 0.06, 15], [11.5, 46, 5, 4.5, 0.12, 16]].forEach((a) => house(...a));

  // props: barrels, crates, a cold fire ring in the square
  const pr = mulberry32(99);
  for (const [x, z] of [[-5.2, 36.4], [-5.9, 37.6], [6.4, 41.4], [4.2, 32.6]]) {
    addPiece(cylU, x, GROUND + 0.42, z, 0, pr() * 3, pr() > 0.7 ? 1.4 : 0, 0.76, 0.85, 0.76, wood(pr()));
  }
  for (const [x, z] of [[-6.5, 41.5], [3.2, 36.2]]) addPiece(boxU, x, GROUND + 0.35, z, 0, pr() * 3, 0, 0.8, 0.7, 0.8, wood(pr()));
  addPiece(boxU, 0.6, GROUND + 0.18, 33.8, 0.15, 0.7, 0.4, 0.8, 0.7, 0.8, wood(0.5));   // toppled crate
  addPiece(discU, 0, GROUND + 0.03, 44, -Math.PI / 2, 0, 0, 1.3, 1.3, 1.3, new THREE.Color().setRGB(0.07, 0.065, 0.06, THREE.SRGBColorSpace));
  for (let i = 0; i < 9; i++) {
    const a = (i / 9) * Math.PI * 2;
    addPiece(boxU, Math.cos(a) * 1.4, GROUND + 0.14, 44 + Math.sin(a) * 1.4, 0, pr() * 3, 0, 0.4, 0.28, 0.34, stone(pr()));
  }

  const merged = mergeGeometries(pieces, false);
  const mesh = new THREE.Mesh(merged, new THREE.MeshStandardMaterial({ vertexColors: true, flatShading: true, roughness: 1 }));
  mesh.castShadow = true; mesh.receiveShadow = true;
  scene.add(mesh);
}

/* ---------- the post with CROATOAN ---------- */
const POST = { x: -3.6, z: 28.4 };
const letters = 'CROATOAN'.split('');
const glowMats = [];
{
  const woodCanvas = document.createElement('canvas'); woodCanvas.width = 128; woodCanvas.height = 512;
  const g = woodCanvas.getContext('2d');
  g.fillStyle = '#6a5640'; g.fillRect(0, 0, 128, 512);
  const rnd = mulberry32(5);
  for (let i = 0; i < 160; i++) {
    const x = rnd() * 128, w = 1 + rnd() * 3, a = 0.06 + rnd() * 0.16;
    g.fillStyle = rnd() > 0.5 ? `rgba(30,18,8,${a})` : `rgba(190,150,100,${a * 0.6})`;
    g.fillRect(x, 0, w, 512);
  }
  for (let i = 0; i < 40; i++) { g.fillStyle = `rgba(20,12,6,${0.08 + rnd() * 0.1})`; g.fillRect(rnd() * 128, rnd() * 512, 2 + rnd() * 10, 1 + rnd() * 2); }
  const woodTex = new THREE.CanvasTexture(woodCanvas); woodTex.colorSpace = THREE.SRGBColorSpace; woodTex.anisotropy = 4;
  const post = new THREE.Mesh(new THREE.BoxGeometry(0.85, 4.2, 0.55), new THREE.MeshStandardMaterial({ map: woodTex, roughness: 1 }));
  post.position.set(POST.x, GROUND + 2.1 - 0.1, POST.z); post.rotation.z = 0.015;
  post.castShadow = true; post.receiveShadow = true;
  scene.add(post);

  const mk = (draw) => {
    const c = document.createElement('canvas'); c.width = c.height = 128;
    const x = c.getContext('2d'); x.textAlign = 'center'; x.textBaseline = 'middle'; x.font = 'bold 104px Georgia, "Times New Roman", serif';
    draw(x);
    const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 4; return t;
  };
  const faceZ = POST.z - 0.275;
  const topY = GROUND + 3.55, step = 0.32;
  letters.forEach((ch, i) => {
    const y = topY - step * (i + 0.5);
    // carved (always there): dark cut + faint lit edge
    const carved = mk((x) => {
      x.fillStyle = 'rgba(235,205,160,0.35)'; x.fillText(ch, 66, 68);
      x.fillStyle = 'rgba(14,8,4,0.95)'; x.fillText(ch, 64, 66);
    });
    const cm = new THREE.Mesh(new THREE.PlaneGeometry(0.34, 0.34),
      new THREE.MeshStandardMaterial({ map: carved, transparent: true, roughness: 1, depthWrite: false, polygonOffset: true, polygonOffsetFactor: -2 }));
    cm.position.set(POST.x, y, faceZ - 0.004); cm.rotation.y = Math.PI;
    scene.add(cm);
    // glow reveal
    const glowTex = mk((x) => { x.shadowColor = '#ff8a1f'; x.shadowBlur = 16; x.fillStyle = '#ffb347'; x.fillText(ch, 64, 66); x.fillText(ch, 64, 66); });
    const gm = new THREE.MeshBasicMaterial({ map: glowTex, transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false, fog: false });
    const gmesh = new THREE.Mesh(new THREE.PlaneGeometry(0.46, 0.46), gm);
    gmesh.position.set(POST.x, y, faceZ - 0.008); gmesh.rotation.y = Math.PI;
    scene.add(gmesh); glowMats.push(gm);
  });
}

/* ---------- ground mist ---------- */
const mist = [];
{
  const c = document.createElement('canvas'); c.width = c.height = 128;
  const g = c.getContext('2d'); const gr = g.createRadialGradient(64, 64, 0, 64, 64, 64);
  gr.addColorStop(0, 'rgba(255,255,255,0.9)'); gr.addColorStop(1, 'rgba(255,255,255,0)');
  g.fillStyle = gr; g.fillRect(0, 0, 128, 128);
  const tex = new THREE.CanvasTexture(c);
  const rnd = mulberry32(3);
  for (let i = 0; i < 44; i++) {
    const m = new THREE.Sprite(new THREE.SpriteMaterial({ map: tex, color: 0xc9d3da, transparent: true, opacity: 0.16 + rnd() * 0.08, depthWrite: false }));
    const s = 16 + rnd() * 18, hh = s * 0.14;     // thin streaks that sit fully above the ground (no hard intersection line)
    const x = (rnd() * 2 - 1) * 45, z = -25 + rnd() * 95;
    m.scale.set(s, hh, 1);
    m.userData = { x, z, y: Math.max(terrainH(x, z), 0) + hh / 2 + 0.4 + rnd() * 1.2, ph: rnd() * 6.28, amp: 1 + rnd() * 3 };
    scene.add(m); mist.push(m);
  }
}

/* ---------- John White's ship ---------- */
const ship = new THREE.Group();
{
  const shape = new THREE.Shape();
  [[-4.6, 2.4], [-4.2, 0], [3.4, 0], [5.4, 1.5], [5.8, 2.0], [3, 1.6], [-2.6, 1.6], [-2.6, 2.4]].forEach(([x, y], i) => (i ? shape.lineTo(x, y) : shape.moveTo(x, y)));
  const hullGeo = new THREE.ExtrudeGeometry(shape, { depth: 2.6, bevelEnabled: false });
  hullGeo.translate(0, 0, -1.3); hullGeo.rotateY(-Math.PI / 2);        // bow toward +z
  const hullMat = new THREE.MeshStandardMaterial({ color: 0x5a3f28, roughness: 0.9, flatShading: true });
  ship.add(new THREE.Mesh(hullGeo, hullMat));
  const wood = new THREE.MeshStandardMaterial({ color: 0x4a3524, roughness: 1, flatShading: true });
  const sailMat = new THREE.MeshStandardMaterial({ color: 0xe3d8bc, roughness: 1, side: THREE.DoubleSide, flatShading: true });
  const mast = (z, h) => {
    const m = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.11, h, 6), wood); m.position.set(0, 1.6 + h / 2, z); ship.add(m);
  };
  const sail = (z, y0, w, h, belly) => {
    const geo = new THREE.PlaneGeometry(w, h, 8, 6);
    const p = geo.attributes.position;
    for (let i = 0; i < p.count; i++) {
      const u = p.getX(i) / w + 0.5, v = p.getY(i) / h + 0.5;
      p.setZ(i, belly * Math.sin(Math.PI * u) * Math.sin(Math.PI * Math.min(1, v * 1.05)));
    }
    geo.computeVertexNormals();
    const s = new THREE.Mesh(geo, sailMat); s.position.set(0, y0 + h / 2, z + 0.15); ship.add(s);
    const yard = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, w + 0.6, 5), wood);
    yard.rotation.z = Math.PI / 2; yard.position.set(0, y0 + h, z + 0.05); ship.add(yard);
  };
  mast(0.4, 9.5); mast(3.2, 7.5); mast(-2.8, 6);
  sail(0.4, 3.0, 4.2, 3.6, 0.55); sail(0.4, 6.9, 3.2, 2.5, 0.4);
  sail(3.2, 2.9, 3.2, 3.0, 0.45);
  const bow = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.07, 3.2, 5), wood);
  bow.rotation.x = Math.PI / 2 - 0.25; bow.position.set(0, 2.1, 6.9); ship.add(bow);
  // St George's cross
  const fc = document.createElement('canvas'); fc.width = 128; fc.height = 80;
  const fg = fc.getContext('2d'); fg.fillStyle = '#f2ede2'; fg.fillRect(0, 0, 128, 80);
  fg.fillStyle = '#c8102e'; fg.fillRect(54, 0, 20, 80); fg.fillRect(0, 30, 128, 20);
  const ft = new THREE.CanvasTexture(fc); ft.colorSpace = THREE.SRGBColorSpace;
  const flag = new THREE.Mesh(new THREE.PlaneGeometry(1.1, 0.7), new THREE.MeshBasicMaterial({ map: ft, side: THREE.DoubleSide }));
  flag.position.set(0.55, 11.4, 0.4); ship.userData.flag = flag; ship.add(flag);
  ship.scale.setScalar(1.15);
  scene.add(ship);
}
function shipPose(t) {
  const s = clamp(t / 9, 0, 1), e = 1 - Math.pow(1 - s, 2.2);
  return { x: -14 + 2 * e, z: -85 + 47 * e };
}

/* ---------- camera rig ---------- */
const KEYS = [   // t, cam xyz, look-at xyz
  [0,    3, 2.4, -120,   -6, 5, -70],
  [4,    2, 2.3,  -82,   -9, 5, -45],
  [8,  1.5, 2.1,  -42,   -3, 4,   8],
  [10.5, 0, 2.2,   -8,    0, 3,  30],
  [13,   0, 2.7,   12,   -3, 3,  32],
  [15.5, 0.2, 2.9, 18.5, -2.5, 3.3, POST.z],
  // final composition: the post sits on the right third, the title card goes on the left
  [19, -0.2, 3.0, 20.6,  -1.1, 3.35, POST.z],
  [22, -0.4, 3.05, 20.2, -1.2, 3.35, POST.z],
  [27, -0.4, 3.05, 21.0, -1.2, 3.35, POST.z],
];
const posCurve = new THREE.CatmullRomCurve3(KEYS.map((k) => new THREE.Vector3(k[1], k[2], k[3])), false, 'centripetal');
const lookCurve = new THREE.CatmullRomCurve3(KEYS.map((k) => new THREE.Vector3(k[4], k[5], k[6])), false, 'centripetal');
const camP = new THREE.Vector3(), camL = new THREE.Vector3();
function setCamera(t) {
  let i = 0;
  while (i < KEYS.length - 2 && t > KEYS[i + 1][0]) i++;
  const s = clamp((t - KEYS[i][0]) / (KEYS[i + 1][0] - KEYS[i][0]), 0, 1);
  const e = lerp(s, s * s * (3 - 2 * s), 0.6);
  const u = (i + e) / (KEYS.length - 1);
  posCurve.getPoint(u, camP); lookCurve.getPoint(u, camL);
  // gentle hand-held drift
  camP.x += 0.035 * Math.sin(t * 1.3) + 0.02 * Math.sin(t * 2.9);
  camP.y += 0.03 * Math.sin(t * 1.7 + 1) + 0.015 * Math.sin(t * 3.3);
  camera.position.copy(camP);
  camera.lookAt(camL);
  camera.updateMatrixWorld(true);
}

/* ---------- HUD ---------- */
const elCap = document.getElementById('caption');
const elTitle = document.getElementById('title');
const elFade = document.getElementById('fade');
const CAPS = [
  [0, 4.5, 'August 1590. John White finally returns to Roanoke.'],
  [4.5, 9, 'There is no sign of the settlement he remembered.'],
  [9, 13, 'No people waiting for him. No welcoming signals.'],
  [13, 15.5, 'The houses and fortifications had been dismantled.'],
  [15.5, 18, 'No bodies. No sign of a struggle.'],
  [18, 22, 'But then, White found something. A word carved into a wooden post:'],
  [22, 99, 'But there was no cross beside the word.'],
];
function hud(t) {
  const c = CAPS.find((a) => t >= a[0] && t < a[1]);
  elCap.textContent = c ? c[2] : '';
  elTitle.style.opacity = smooth(t, 21.4, 22.8);
  const fin = 1 - smooth(t, 0, 1.4), fout = smooth(t, T_END - 1.6, T_END);
  elFade.style.opacity = Math.max(fin, fout);
}

/* ---------- frame update ---------- */
function update(t) {
  t = clamp(t, 0, T_END);

  // sea
  const wp = waterPos;
  for (let i = 0; i < wp.count; i++) wp.setY(i, waveH(waterBase[i * 2], waterBase[i * 2 + 1], t));
  wp.needsUpdate = true;

  // ship rides the swell
  const sp = shipPose(t);
  ship.position.set(sp.x, waveH(sp.x, sp.z, t) * 0.8 + 0.1, sp.z);
  ship.rotation.set(0.025 * Math.sin(t * 0.9 + 1), 0.03 * Math.sin(t * 0.4), 0.045 * Math.sin(t * 1.1));
  ship.userData.flag.rotation.y = Math.sin(t * 4) * 0.35;

  // mist drifts
  for (const m of mist) {
    const u = m.userData;
    m.position.set(u.x + Math.sin(t * 0.12 + u.ph) * u.amp * 2, u.y + Math.sin(t * 0.2 + u.ph) * 0.2, u.z + Math.cos(t * 0.1 + u.ph) * u.amp);
  }

  // letters light up one by one
  glowMats.forEach((m, i) => {
    const s = clamp((t - (18.3 + 0.32 * i)) / 0.9, 0, 1);
    m.opacity = smooth(s, 0, 1) * (0.55 + 0.15 * Math.sin(t * 2.2 + i));
  });

  // haze thickens as we reach the settlement, then relaxes a touch
  scene.fog.density = lerp(0.0105, 0.017, smooth(t, 6, 13)) * lerp(1, 0.8, smooth(t, 17, 21));

  setCamera(t);
  sky.position.copy(camera.position);
  skyMat.uniforms.uTime.value = t;

  // the lantern held by the camera operator
  const flick = 1 + 0.06 * Math.sin(t * 13) + 0.04 * Math.sin(t * 23.7);
  lantern.intensity = 9 * smooth(t, 12, 16) * flick;
  lantern.position.copy(camera.position).add(new THREE.Vector3(0.4, -0.3, 0.6));

  hud(t);
  renderer.render(scene, camera);
}

window.__dbg = { scene, lantern, sun, mist, fill, renderer };   // handy for debugging from the console
window.__T_END = T_END;
window.__setTime = (t) => { update(t); return t; };
window.__ready = true;

const params = new URLSearchParams(location.search);
if (params.has('t')) {
  update(parseFloat(params.get('t')));
} else {
  let t0 = performance.now(), paused = false, tOff = 0, tNow = 0;
  addEventListener('keydown', (e) => {
    if (e.code === 'Space') paused = !paused;
    if (e.code === 'ArrowRight') tOff += 1;
    if (e.code === 'ArrowLeft') tOff -= 1;
  });
  addEventListener('pointerdown', () => { paused = !paused; });
  const loop = (now) => {
    if (!paused) tNow = ((now - t0) / 1000 + tOff) % (T_END + 1.5);
    else t0 = now - (tNow - tOff) * 1000;
    update(tNow);
    requestAnimationFrame(loop);
  };
  requestAnimationFrame(loop);
}
