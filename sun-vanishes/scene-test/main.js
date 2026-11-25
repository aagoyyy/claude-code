import * as THREE from 'three';

/* ------------------------------------------------------------------
   "What if the Sun vanished?" — scene test
   Everything is a pure function of time t, so any frame can be rendered
   deterministically (window.__setTime(t)) for frame-by-frame export.

   Timeline (test seconds, not story seconds):
     0  -> T_VANISH : Earth orbits a normal Sun
     T_VANISH       : Sun disappears, a shell of "last light" starts to expand
     T_VANISH->T_HIT: Earth keeps orbiting (light AND gravity are still in transit)
     T_HIT          : shell reaches Earth -> sunlight stops, Earth leaves on a tangent
   Sizes and speeds are exaggerated for readability.
------------------------------------------------------------------- */

const W = 1280, H = 720;
const T_VANISH = 4, T_HIT = 12, T_END = 22;
const R = 40;            // orbit radius (scene units)
const OMEGA = 0.14;      // rad / test-second (exaggerated)
const THETA0 = 0.5;
const C_LIGHT = R / (T_HIT - T_VANISH);   // shell speed so it reaches Earth exactly at T_HIT

const SUN_R = 6, EARTH_R = 2.2, MOON_R = 0.6, MOON_ORBIT = 4.6;

const clamp = (x, a, b) => Math.min(b, Math.max(a, x));
const smooth = (x, a, b) => THREE.MathUtils.smoothstep(x, a, b);
const lerp = THREE.MathUtils.lerp;

/* ---------- renderer / scene / camera ---------- */
const renderer = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true });
renderer.setPixelRatio(1);
renderer.setSize(W, H);
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.0;
const stage = document.getElementById('stage');
stage.insertBefore(renderer.domElement, stage.firstChild);

function fit() {
  const s = Math.min(innerWidth / W, innerHeight / H);
  stage.style.transform = `scale(${s})`;
}
addEventListener('resize', fit); fit();

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x02030a);
const camera = new THREE.PerspectiveCamera(40, W / H, 0.1, 4000);

/* ---------- procedural noise (so no external texture files are needed) ---------- */
function hash3(x, y, z) {
  let h = Math.imul(x, 374761393) ^ Math.imul(y, 668265263) ^ Math.imul(z, 1274126177);
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  h ^= h >>> 16;
  return (h >>> 0) / 4294967295;
}
const sm = (t) => t * t * (3 - 2 * t);
const mix = (a, b, t) => a + (b - a) * t;
function vnoise(x, y, z) {
  const xi = Math.floor(x), yi = Math.floor(y), zi = Math.floor(z);
  const xf = sm(x - xi), yf = sm(y - yi), zf = sm(z - zi);
  const c = (dx, dy, dz) => hash3(xi + dx, yi + dy, zi + dz);
  return mix(
    mix(mix(c(0, 0, 0), c(1, 0, 0), xf), mix(c(0, 1, 0), c(1, 1, 0), xf), yf),
    mix(mix(c(0, 0, 1), c(1, 0, 1), xf), mix(c(0, 1, 1), c(1, 1, 1), xf), yf),
    zf);
}
function fbm(x, y, z, oct = 5) {
  let a = 0.5, s = 0, f = 1;
  for (let i = 0; i < oct; i++) { s += a * vnoise(x * f, y * f, z * f); f *= 2; a *= 0.5; }
  return s;
}

function sphereXYZ(u, v) {
  const phi = u * Math.PI * 2, theta = v * Math.PI;
  return [Math.sin(theta) * Math.cos(phi), Math.cos(theta), Math.sin(theta) * Math.sin(phi)];
}

/* ---------- textures ---------- */
function makeEarthTextures() {
  const w = 1024, h = 512;
  const cA = document.createElement('canvas'); cA.width = w; cA.height = h;
  const cL = document.createElement('canvas'); cL.width = w; cL.height = h;
  const gA = cA.getContext('2d'), gL = cL.getContext('2d');
  const imA = gA.createImageData(w, h), imL = gL.createImageData(w, h);
  const A = imA.data, L = imL.data;
  for (let py = 0; py < h; py++) {
    for (let px = 0; px < w; px++) {
      const [x, y, z] = sphereXYZ(px / w, py / h);
      const n = fbm(x * 2.1 + 11, y * 2.1 + 3, z * 2.1 + 7, 6);
      const i = (py * w + px) * 4;
      let r, g, b;
      const ice = Math.abs(y) > 0.88 + (fbm(x * 6, y * 6, z * 6, 3) - 0.5) * 0.12;
      if (n > 0.52) {
        const e = clamp((n - 0.52) / 0.22, 0, 1);
        const dry = fbm(x * 3 + 40, y * 3, z * 3, 3);
        // green lowlands -> tan/brown highlands
        r = mix(40, 150, e) + dry * 40; g = mix(105, 120, e) + dry * 10; b = mix(48, 80, e);
        if (ice) { r = 235; g = 240; b = 245; }
      } else {
        const d = clamp((0.52 - n) / 0.25, 0, 1);
        r = mix(30, 6, d); g = mix(92, 28, d); b = mix(150, 78, d);
        if (ice) { r = 220; g = 232; b = 240; }
      }
      A[i] = r; A[i + 1] = g; A[i + 2] = b; A[i + 3] = 255;

      // city lights: only on land, not near the poles, clustered by a second noise
      if (n > 0.535 && Math.abs(y) < 0.8) {
        const cluster = fbm(x * 16 + 90, y * 16, z * 16, 3);
        if (cluster > 0.56 && hash3(px, py, 5) > 0.62) {
          const k = clamp((cluster - 0.54) * 7, 0.25, 1);
          L[i] = 255 * k; L[i + 1] = 205 * k; L[i + 2] = 120 * k; L[i + 3] = 255;
        }
      }
    }
  }
  gA.putImageData(imA, 0, 0); gL.putImageData(imL, 0, 0);
  const tA = new THREE.CanvasTexture(cA); tA.colorSpace = THREE.SRGBColorSpace; tA.anisotropy = 4;
  const tL = new THREE.CanvasTexture(cL); tL.colorSpace = THREE.SRGBColorSpace;
  return { map: tA, lights: tL };
}

function makeCloudTexture() {
  const w = 512, h = 256;
  const c = document.createElement('canvas'); c.width = w; c.height = h;
  const g = c.getContext('2d'); const im = g.createImageData(w, h); const D = im.data;
  for (let py = 0; py < h; py++) for (let px = 0; px < w; px++) {
    const [x, y, z] = sphereXYZ(px / w, py / h);
    const n = fbm(x * 3.2 + 70, y * 4.5 + 20, z * 3.2 + 5, 5);
    const a = clamp((n - 0.5) * 3.2, 0, 1);
    const i = (py * w + px) * 4;
    D[i] = D[i + 1] = D[i + 2] = 255; D[i + 3] = a * 235;
  }
  g.putImageData(im, 0, 0);
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t;
}

function makeMoonTexture() {
  const w = 256, h = 128;
  const c = document.createElement('canvas'); c.width = w; c.height = h;
  const g = c.getContext('2d'); const im = g.createImageData(w, h); const D = im.data;
  for (let py = 0; py < h; py++) for (let px = 0; px < w; px++) {
    const [x, y, z] = sphereXYZ(px / w, py / h);
    const v = 110 + fbm(x * 5, y * 5, z * 5, 5) * 120 - (fbm(x * 14, y * 14, z * 14, 2) > 0.6 ? 30 : 0);
    const i = (py * w + px) * 4; D[i] = D[i + 1] = D[i + 2] = v; D[i + 3] = 255;
  }
  g.putImageData(im, 0, 0);
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t;
}

function glowTexture(inner, outer) {
  const c = document.createElement('canvas'); c.width = c.height = 256;
  const g = c.getContext('2d');
  const gr = g.createRadialGradient(128, 128, 0, 128, 128, 128);
  gr.addColorStop(0, 'rgba(255,255,255,1)');
  gr.addColorStop(0.14, inner);
  gr.addColorStop(0.5, outer);
  gr.addColorStop(1, 'rgba(0,0,0,0)');
  g.fillStyle = gr; g.fillRect(0, 0, 256, 256);
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t;
}

/* ---------- stars ---------- */
{
  const N = 6000;
  const pos = new Float32Array(N * 3), col = new Float32Array(N * 3);
  const c = new THREE.Color();
  let seed = 1337;
  const rnd = () => { seed = (seed * 1664525 + 1013904223) >>> 0; return seed / 4294967296; };
  for (let i = 0; i < N; i++) {
    let x, y, z;
    do { x = rnd() * 2 - 1; y = rnd() * 2 - 1; z = rnd() * 2 - 1; } while (x * x + y * y + z * z > 1 || x * x + y * y + z * z < 0.01);
    const l = Math.hypot(x, y, z); x /= l; y /= l; z /= l;
    if (i % 10 < 3) { y *= 0.14; const l2 = Math.hypot(x, y, z); x /= l2; y /= l2; z /= l2; } // faint milky-way band
    // tilt the band
    const ty = y * 0.9 + z * 0.43, tz = -y * 0.43 + z * 0.9; y = ty; z = tz;
    pos.set([x * 2200, y * 2200, z * 2200], i * 3);
    c.setHSL(rnd() < 0.5 ? 0.6 : 0.09, 0.35 * rnd(), 0.55 + 0.45 * rnd() * rnd());
    col.set([c.r, c.g, c.b], i * 3);
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  g.setAttribute('color', new THREE.BufferAttribute(col, 3));
  const m = new THREE.PointsMaterial({ size: 1.8, sizeAttenuation: false, vertexColors: true, transparent: true, opacity: 0.95, depthWrite: false });
  scene.add(new THREE.Points(g, m));
}

/* ---------- lights ---------- */
const sunLight = new THREE.PointLight(0xfff0d8, 3.4, 0, 0);   // decay 0 => constant brightness across the orbit
scene.add(sunLight);
const ambient = new THREE.AmbientLight(0x1b2a55, 0.32);       // faint starlight
scene.add(ambient);

/* ---------- Sun ---------- */
const sunGroup = new THREE.Group();
const sunMesh = new THREE.Mesh(
  new THREE.SphereGeometry(SUN_R, 64, 48),
  new THREE.MeshBasicMaterial({ color: 0xfff1c9, toneMapped: false }));
sunGroup.add(sunMesh);
const glowA = new THREE.Sprite(new THREE.SpriteMaterial({
  map: glowTexture('rgba(255,225,150,0.9)', 'rgba(255,150,40,0.28)'),
  blending: THREE.AdditiveBlending, depthWrite: false, transparent: true }));
const glowB = new THREE.Sprite(new THREE.SpriteMaterial({
  map: glowTexture('rgba(255,170,70,0.38)', 'rgba(255,100,20,0.08)'),
  blending: THREE.AdditiveBlending, depthWrite: false, transparent: true }));
sunGroup.add(glowA, glowB);
scene.add(sunGroup);

/* ---------- Earth + atmosphere + clouds + Moon ---------- */
const shared = { sunDir: { value: new THREE.Vector3(1, 0, 0) }, lit: { value: 1 } };
const earthTex = makeEarthTextures();

const earthMat = new THREE.MeshStandardMaterial({
  map: earthTex.map, roughness: 0.85, metalness: 0,
  emissive: new THREE.Color(0xffd9a0), emissiveMap: earthTex.lights, emissiveIntensity: 1.7 });
earthMat.onBeforeCompile = (sh) => {
  sh.uniforms.uSunDir = shared.sunDir;
  sh.uniforms.uLit = shared.lit;
  sh.vertexShader = sh.vertexShader
    .replace('#include <common>', '#include <common>\nvarying vec3 vWN;')
    .replace('#include <begin_vertex>', '#include <begin_vertex>\nvWN = normalize(mat3(modelMatrix) * normal);');
  sh.fragmentShader = sh.fragmentShader
    .replace('#include <common>', '#include <common>\nvarying vec3 vWN; uniform vec3 uSunDir; uniform float uLit;')
    .replace('#include <emissivemap_fragment>',
      '#include <emissivemap_fragment>\n' +
      'float nlE = dot(normalize(vWN), uSunDir) * uLit;\n' +
      'totalEmissiveRadiance *= 1.0 - smoothstep(0.0, 0.18, nlE);');   // city lights only show on the night side
};

const earthGroup = new THREE.Group();
const tilt = new THREE.Group(); tilt.rotation.z = 0.41;
earthGroup.add(tilt);
const earthMesh = new THREE.Mesh(new THREE.SphereGeometry(EARTH_R, 96, 64), earthMat);
tilt.add(earthMesh);
const cloudMesh = new THREE.Mesh(
  new THREE.SphereGeometry(EARTH_R * 1.012, 96, 64),
  new THREE.MeshStandardMaterial({ map: makeCloudTexture(), transparent: true, depthWrite: false, roughness: 1 }));
tilt.add(cloudMesh);

const atmoMat = new THREE.ShaderMaterial({
  uniforms: { uSunDir: shared.sunDir, uLit: shared.lit },
  vertexShader: `
    varying vec3 vN; varying vec3 vV;
    void main() {
      vec4 wp = modelMatrix * vec4(position, 1.0);
      vN = normalize(mat3(modelMatrix) * normal);
      vV = normalize(cameraPosition - wp.xyz);
      gl_Position = projectionMatrix * viewMatrix * wp;
    }`,
  fragmentShader: `
    uniform vec3 uSunDir; uniform float uLit; varying vec3 vN; varying vec3 vV;
    void main() {
      float rim = pow(clamp(1.0 + dot(vN, vV), 0.0, 1.0), 3.2);
      float sun = clamp(dot(vN, uSunDir) + 0.35, 0.0, 1.0) * uLit;
      vec3 col = mix(vec3(0.10, 0.17, 0.40), vec3(0.34, 0.62, 1.0), sun);
      float a = rim * (0.28 + 0.72 * sun);
      gl_FragColor = vec4(col * a * 1.7, a);
      #include <tonemapping_fragment>
      #include <colorspace_fragment>
    }`,
  side: THREE.BackSide, blending: THREE.AdditiveBlending, transparent: true, depthWrite: false });
earthGroup.add(new THREE.Mesh(new THREE.SphereGeometry(EARTH_R * 1.09, 64, 48), atmoMat));
scene.add(earthGroup);

const moon = new THREE.Mesh(
  new THREE.SphereGeometry(MOON_R, 48, 32),
  new THREE.MeshStandardMaterial({ map: makeMoonTexture(), roughness: 1, metalness: 0 }));
scene.add(moon);

/* ---------- orbit guide, trail, light shell ---------- */
const orbitPts = [];
for (let i = 0; i <= 256; i++) { const a = i / 256 * Math.PI * 2; orbitPts.push(new THREE.Vector3(Math.cos(a) * R, 0, Math.sin(a) * R)); }
const orbitLine = new THREE.Line(
  new THREE.BufferGeometry().setFromPoints(orbitPts),
  new THREE.LineDashedMaterial({ color: 0x6d8fd6, dashSize: 1.1, gapSize: 1.1, transparent: true, opacity: 0.45 }));
orbitLine.computeLineDistances();
scene.add(orbitLine);

const TRAIL_N = 400;
const trailGeo = new THREE.BufferGeometry();
trailGeo.setAttribute('position', new THREE.BufferAttribute(new Float32Array((TRAIL_N + 1) * 3), 3));
const trail = new THREE.Line(trailGeo, new THREE.LineBasicMaterial({ color: 0x9cc4ff, transparent: true, opacity: 0.85 }));
trail.frustumCulled = false;
scene.add(trail);

const shellMats = [
  new THREE.MeshBasicMaterial({ color: 0xffd27a, transparent: true, opacity: 0.95, blending: THREE.AdditiveBlending, side: THREE.DoubleSide, depthWrite: false }),
  new THREE.MeshBasicMaterial({ color: 0xffa83a, transparent: true, opacity: 0.09, blending: THREE.AdditiveBlending, side: THREE.DoubleSide, depthWrite: false }),
  new THREE.MeshBasicMaterial({ color: 0xffb860, transparent: true, opacity: 0.018, blending: THREE.AdditiveBlending, side: THREE.DoubleSide, depthWrite: false }),
];

// dashed outline marking the empty spot where the Sun used to be (always faces the camera)
const ghostPts = [];
for (let i = 0; i <= 96; i++) { const a = i / 96 * Math.PI * 2; ghostPts.push(new THREE.Vector3(Math.cos(a) * SUN_R, Math.sin(a) * SUN_R, 0)); }
const ghost = new THREE.Line(
  new THREE.BufferGeometry().setFromPoints(ghostPts),
  new THREE.LineDashedMaterial({ color: 0xffffff, dashSize: 0.7, gapSize: 0.7, transparent: true, opacity: 0.5 }));
ghost.computeLineDistances();
ghost.visible = false;
scene.add(ghost);
const ringHard = new THREE.Mesh(new THREE.RingGeometry(0.988, 1, 192), shellMats[0]);
const ringSoft = new THREE.Mesh(new THREE.RingGeometry(0.955, 1, 192), shellMats[1]);
ringHard.rotation.x = ringSoft.rotation.x = -Math.PI / 2;
const shellSphere = new THREE.Mesh(new THREE.SphereGeometry(1, 64, 40), shellMats[2]);
shellSphere.visible = false;   // the faint dome read as an artifact; the ring alone is cleaner
const shell = new THREE.Group(); shell.add(ringHard, ringSoft, shellSphere);
scene.add(shell);

/* ---------- motion as pure functions of t ---------- */
function earthPos(t, out = new THREE.Vector3()) {
  if (t <= T_HIT) {
    const th = THETA0 + OMEGA * t;
    return out.set(Math.cos(th) * R, 0, Math.sin(th) * R);
  }
  const th = THETA0 + OMEGA * T_HIT;
  const v = OMEGA * R * (t - T_HIT);
  return out.set(Math.cos(th) * R - Math.sin(th) * v, 0, Math.sin(th) * R + Math.cos(th) * v);
}

const E12 = earthPos(T_HIT);
const th12 = THETA0 + OMEGA * T_HIT;
const sunDir12 = E12.clone().negate().normalize();
const tan12 = new THREE.Vector3(-Math.sin(th12), 0, Math.cos(th12));
// camera sits behind Earth along its orbit, a bit toward the Sun side and above the orbital plane
const C12 = E12.clone().addScaledVector(sunDir12, 6).addScaledVector(tan12, -22).add(new THREE.Vector3(0, 9, 0));
const CAM0 = new THREE.Vector3(-18, 30, 74);   // on the Sun side of Earth, so the lit hemisphere faces us
const CAM1 = new THREE.Vector3(-14, 24, 66);

const tmpE = new THREE.Vector3(), tmpLook = new THREE.Vector3(), tmpCam = new THREE.Vector3();

function setCamera(t) {
  earthPos(t, tmpE);
  const half = earthPos(Math.min(t, T_HIT), new THREE.Vector3()).multiplyScalar(0.5);
  if (t < T_VANISH) {
    tmpCam.lerpVectors(CAM0, CAM1, smooth(t, 0, T_VANISH));
    tmpLook.copy(half);
  } else if (t < T_HIT) {
    const k = smooth(t, T_VANISH, T_HIT);
    tmpCam.lerpVectors(CAM1, C12, k);
    tmpLook.lerpVectors(half, tmpE, smooth(t, T_VANISH, T_HIT - 3));   // lock onto Earth a little earlier than the dolly ends
  } else {
    tmpCam.copy(C12).addScaledVector(tmpE.clone().sub(E12), 0.6);
    tmpLook.copy(tmpE);
  }
  camera.position.copy(tmpCam);
  camera.lookAt(tmpLook);
  camera.updateMatrixWorld(true);   // label projection below needs this frame's matrices, not last frame's
}

/* ---------- HUD ---------- */
const elTimer = document.getElementById('timer');
const elStatus = document.querySelector('#status span');
const elDot = document.querySelector('#status i');
const elCaption = document.getElementById('caption');
const tagEarth = document.getElementById('tag-earth');
const tagSun = document.getElementById('tag-sun');
const fmt = (s) => {
  s = Math.floor(s);
  return String(Math.floor(s / 60)).padStart(2, '0') + ':' + String(s % 60).padStart(2, '0');
};
function storyTime(t) {
  if (t < T_VANISH) return 0;
  if (t < T_HIT) return (t - T_VANISH) / (T_HIT - T_VANISH) * 500;   // 8:20 = 500 s
  return 500 + (t - T_HIT) * 60;
}
function hud(t) {
  elTimer.textContent = 'T+ ' + fmt(storyTime(t));
  let status, dot, cap;
  if (t < T_VANISH) {
    status = 'SUN: PRESENT'; dot = '#ffcc55';
    cap = 'Earth, orbiting the Sun. Everything is normal.';
  } else if (t < T_HIT) {
    status = "SUN: GONE  ·  EARTH DOESN'T KNOW YET"; dot = '#ff6a4d';
    cap = 'The Sun is gone. But its last light and its gravity are still on the way.';
  } else if (t < T_HIT + 1.6) {
    status = 'LAST LIGHT ARRIVES'; dot = '#ffffff';
    cap = '8 minutes, 20 seconds. The switch flips.';
  } else {
    status = 'EARTH: ROGUE PLANET'; dot = '#6aa8ff';
    cap = 'No pull, no light. Earth flies off in a straight line at about 30 km/s.';
  }
  elStatus.textContent = status; elDot.style.background = dot; elCaption.textContent = cap;
}

const projV = new THREE.Vector3();
function placeTag(el, world, dy) {
  projV.copy(world).project(camera);
  const on = projV.z < 1 && Math.abs(projV.x) < 1.05 && Math.abs(projV.y) < 1.05;
  el.style.display = on ? 'block' : 'none';
  el.style.left = ((projV.x * 0.5 + 0.5) * W) + 'px';
  el.style.top = ((-projV.y * 0.5 + 0.5) * H - dy) + 'px';
}

/* ---------- frame update ---------- */
const trailPos = trailGeo.attributes.position;
const sunVec = new THREE.Vector3(0, 0, 0);
const tmpV = new THREE.Vector3();

function update(t) {
  t = clamp(t, 0, T_END);
  const E = earthPos(t, new THREE.Vector3());

  // Sun: flash + vanish
  const kv = clamp((t - T_VANISH) / 0.18, 0, 1);
  sunGroup.visible = kv < 1;
  sunMesh.scale.setScalar(Math.max(0.0001, 1 - kv));
  glowA.material.opacity = 1 - kv; glowB.material.opacity = 1 - kv;
  const pulse = 1 + 0.015 * Math.sin(t * 3.1);
  glowA.scale.setScalar(34 * pulse * (1 + 0.9 * kv));
  glowB.scale.setScalar(110 * pulse * (1 + 0.5 * kv));

  // Earth lighting: sunlight keeps arriving until the light shell reaches Earth
  const lightLevel = 1 - smooth(t, T_HIT - 0.05, T_HIT + 0.35);
  const flash = Math.exp(-Math.pow((t - (T_HIT - 0.1)) / 0.25, 2));     // last-light flare
  sunLight.intensity = 3.4 * lightLevel * (1 + 0.7 * flash);
  ambient.intensity = lerp(0.32, 0.7, 1 - lightLevel);                  // artistic starlight so the dark globe still reads
  shared.lit.value = lightLevel;
  shared.sunDir.value.copy(sunVec).sub(E).normalize();

  earthGroup.position.copy(E);
  earthMesh.rotation.y = 1.0 + t * 0.55;
  cloudMesh.rotation.y = 1.0 + t * 0.62;

  const mp = t * 1.15;
  moon.position.set(E.x + Math.cos(mp) * MOON_ORBIT, Math.sin(mp) * MOON_ORBIT * 0.14, E.z + Math.sin(mp) * MOON_ORBIT);
  moon.rotation.y = mp;

  // Trail behind Earth
  for (let i = 0; i <= TRAIL_N; i++) {
    earthPos(t * i / TRAIL_N, tmpV);
    trailPos.setXYZ(i, tmpV.x, tmpV.y, tmpV.z);
  }
  trailPos.needsUpdate = true;

  // Light shell
  const r = Math.max(0.001, C_LIGHT * (t - T_VANISH));
  const show = t > T_VANISH + 0.05;
  shell.visible = show;
  shell.scale.setScalar(r);
  const fadeOut = 1 - smooth(r, 55, 110);
  shellMats[0].opacity = 0.95 * fadeOut; shellMats[1].opacity = 0.09 * fadeOut; shellMats[2].opacity = 0.018 * fadeOut;

  ghost.visible = t > T_VANISH + 0.15;

  setCamera(t);
  ghost.quaternion.copy(camera.quaternion);
  hud(t);
  placeTag(tagEarth, tmpV.copy(E).add(new THREE.Vector3(0, EARTH_R * 1.9, 0)), 4);
  tagSun.textContent = t < T_VANISH + 0.15 ? 'SUN' : 'WHERE THE SUN WAS';
  placeTag(tagSun, tmpV.set(0, t < T_VANISH + 0.15 ? SUN_R * 1.4 : 2.5, 0), 4);

  renderer.render(scene, camera);
}

/* ---------- API for deterministic export + autoplay for preview ---------- */
window.__T_END = T_END;
window.__setTime = (t) => { update(t); return t; };
window.__ready = true;

const params = new URLSearchParams(location.search);
if (params.has('t')) {
  update(parseFloat(params.get('t')));
} else {
  let t0 = performance.now(), paused = false, tOff = 0;
  addEventListener('keydown', (e) => {
    if (e.code === 'Space') paused = !paused;
    if (e.code === 'ArrowRight') tOff += 1;
    if (e.code === 'ArrowLeft') tOff -= 1;
  });
  addEventListener('pointerdown', () => { paused = !paused; });
  let tPause = 0;
  const loop = (now) => {
    if (!paused) tPause = ((now - t0) / 1000 + tOff) % (T_END + 1.5);
    else t0 = now - (tPause - tOff) * 1000;
    update(tPause);
    requestAnimationFrame(loop);
  };
  requestAnimationFrame(loop);
}
