import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { makeFigure } from './figures.js';

// Preview of the period figures. ?view=front|back|side
const W = 1280, H = 720;
const params = new URLSearchParams(location.search);
const view = params.get('view') || 'front';

const renderer = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true });
renderer.setSize(W, H); renderer.setPixelRatio(1);
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.shadowMap.enabled = true;
document.getElementById('stage').prepend(renderer.domElement);

const scene = new THREE.Scene();
scene.background = new THREE.Color('#9aa0a2');
scene.fog = new THREE.FogExp2('#9aa0a2', 0.012);
const camera = new THREE.PerspectiveCamera(28, W / H, 0.1, 100);
camera.position.set(0, 1.25, 9.5); camera.lookAt(0, 0.9, 0);

scene.add(new THREE.HemisphereLight(0xaab8cc, 0x4a4234, 0.9));
const sun = new THREE.DirectionalLight(0xffc98a, 2.4); sun.position.set(-3, 5, 7); sun.castShadow = true;
sun.shadow.camera.left = -6; sun.shadow.camera.right = 6; sun.shadow.camera.top = 4; sun.shadow.camera.bottom = -2; sun.shadow.mapSize.set(2048, 2048);
scene.add(sun);
const floor = new THREE.Mesh(new THREE.PlaneGeometry(40, 20), new THREE.MeshStandardMaterial({ color: 0x9c8a6a, roughness: 1 }));
floor.rotation.x = -Math.PI / 2; floor.receiveShadow = true; scene.add(floor);

const gltf = await new Promise((res, rej) => new GLTFLoader().load('./assets/CesiumMan.glb', res, undefined, rej));
const yaw = { front: 0, back: Math.PI, side: Math.PI / 2 }[view];
const figs = ['gentleman', 'soldier', 'sailor'].map((k, i) => {
  const f = makeFigure(gltf, k);
  f.group.position.x = (i - 1) * 1.7; f.group.rotation.y = yaw;
  scene.add(f.group); return f;
});
function update(t) { figs.forEach((f) => f.update(t)); renderer.render(scene, camera); }
window.__setTime = (t) => { update(t); return t; };
window.__figs = figs;
window.__ready = true;
update(parseFloat(params.get('t') || '0.3'));
