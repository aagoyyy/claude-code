import * as THREE from 'three';
import { makePuppet } from './puppets.js';

// ?mode=idle (front, breathing + glancing)  |  walk (profile, 3 characters)  |  strip (one soldier, 8 phases of the walk cycle)
const params = new URLSearchParams(location.search);
const mode = params.get('mode') || 'idle';
const W = 1280, H = 720;

const renderer = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true });
const SS = parseFloat(params.get('ss') || '2');
renderer.setPixelRatio(SS); renderer.setSize(W, H);
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.shadowMap.enabled = true; renderer.shadowMap.type = THREE.PCFSoftShadowMap;
document.getElementById('stage').prepend(renderer.domElement);

const scene = new THREE.Scene();
scene.background = new THREE.Color('#dfe2e4');
scene.fog = new THREE.Fog('#dfe2e4', 12, 30);
const camera = new THREE.PerspectiveCamera(20, W / H, 0.1, 100);
camera.position.set(0, 1.0, mode === 'strip' ? 13 : 9.5); camera.lookAt(0, 0.88, 0);

scene.add(new THREE.HemisphereLight(0xe8ecf2, 0x8a8f96, 1.15));
const sun = new THREE.DirectionalLight(0xffffff, 1.9); sun.position.set(-3, 6, 5); sun.castShadow = true;
Object.assign(sun.shadow.camera, { left: -8, right: 8, top: 5, bottom: -3 }); sun.shadow.mapSize.set(2048, 2048); sun.shadow.bias = -0.0008;
scene.add(sun);
const floor = new THREE.Mesh(new THREE.PlaneGeometry(60, 30), new THREE.MeshStandardMaterial({ color: 0xcfd3d6, roughness: 0.9 }));
floor.rotation.x = -Math.PI / 2; floor.receiveShadow = true; scene.add(floor);

// ground ticks that scroll under the walkers (a treadmill), so the stride is judged against the floor
const ticks = new THREE.Group(); scene.add(ticks);
if (mode !== 'idle') {
  const g = new THREE.BoxGeometry(0.5, 0.004, 0.06), m = new THREE.MeshStandardMaterial({ color: 0xaab0b5, roughness: 1 });
  for (let i = -20; i < 20; i++) for (const z of [-0.8, 0.8]) { const t = new THREE.Mesh(g, m); t.position.set(i * 1.0, 0.003, z); t.receiveShadow = true; ticks.add(t); }
}
const labels = document.getElementById('labels');
const label = (x, a, b) => { const d = document.createElement('div'); d.className = 'lbl'; d.style.left = x + '%'; d.innerHTML = `${a}<small>${b}</small>`; labels.appendChild(d); };

const items = [];
const add = (kind, x, yaw, phase = 0) => { const p = makePuppet(kind); p.root.position.x = x; p.root.rotation.y = yaw; scene.add(p.root); items.push({ p, phase }); return p; };

if (mode === 'strip') {
  for (let i = 0; i < 8; i++) add('soldier', (i - 3.5) * 1.5, Math.PI / 2, (i / 8) * Math.PI * 2);
  label(50, 'Walk cycle, 8 phases (profile)', 'pure sine functions: hip swing, knee bend, opposite arm swing, body bob, torso twist');
} else if (mode === 'walk') {
  add('gentleman', -2.2, Math.PI / 2, 0); add('soldier', 0, Math.PI / 2, 1.2); add('sailor', 2.2, Math.PI / 2, 2.4);
  label(24, 'Gentleman', 'hat, ruff, cloak, rapier'); label(50, 'Soldier', 'morion, breastplate, musket'); label(76, 'Sailor', 'cap, bag, oar');
} else {
  add('gentleman', -2.0, 0.25); add('soldier', 0, 0); add('sailor', 2.0, -0.25);
  label(24, 'Gentleman (John White)', 'idle: breathing, weight shift, glancing'); label(50, 'Soldier', ''); label(76, 'Sailor', '');
}
const SPEED = 1.62;   // m/s: matches the stride of the walk cycle
function update(t) { if (mode !== 'idle') ticks.position.x = -((t * SPEED) % 1.0); items.forEach(({ p, phase }) => p.pose(t, mode === 'idle' ? 'idle' : 'walk', phase)); renderer.render(scene, camera); }
window.__setTime = (t) => { update(t); return t; };
window.__ready = true;
update(parseFloat(params.get('t') || '0.4'));
