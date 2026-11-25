import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import * as SkeletonUtils from 'three/addons/utils/SkeletonUtils.js';

const W = 1280, H = 720;
const renderer = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true });
renderer.setSize(W, H); renderer.setPixelRatio(1);
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
document.getElementById('stage').prepend(renderer.domElement);

const scene = new THREE.Scene();
scene.background = new THREE.Color('#8f979d');
scene.fog = new THREE.FogExp2('#8f979d', 0.02);
const camera = new THREE.PerspectiveCamera(32, W / H, 0.1, 100);
camera.position.set(0, 1.35, 10.5); camera.lookAt(0, 0.95, 0);

scene.add(new THREE.HemisphereLight(0xb8c4d4, 0x4a4234, 1.1));
const sun = new THREE.DirectionalLight(0xffd7a0, 2.2); sun.position.set(-4, 6, 8); scene.add(sun);
const floor = new THREE.Mesh(new THREE.PlaneGeometry(40, 20), new THREE.MeshStandardMaterial({ color: 0x8c7b62, roughness: 1 }));
floor.rotation.x = -Math.PI / 2; scene.add(floor);

const load = (url) => new Promise((res, rej) => new GLTFLoader().load(url, res, undefined, rej));
const [soldier, cesium] = await Promise.all([load('./assets/Soldier.glb'), load('./assets/CesiumMan.glb')]);

const mixers = [];
const hist = [];   // figures that get a period helmet + cloak on top of the skeleton
function addPeriodGear(g, model) {
  const dark = new THREE.MeshBasicMaterial({ color: 0x0d0d11, fog: true, side: THREE.DoubleSide });
  const helmet = new THREE.Group();
  const dome = new THREE.Mesh(new THREE.SphereGeometry(0.13, 12, 8, 0, Math.PI * 2, 0, Math.PI / 2), dark); helmet.add(dome);
  const brim = new THREE.Mesh(new THREE.CylinderGeometry(0.25, 0.25, 0.012, 20), dark); brim.position.y = 0.0; helmet.add(brim);
  const crest = new THREE.Mesh(new THREE.BoxGeometry(0.02, 0.11, 0.24), dark); crest.position.y = 0.13; helmet.add(crest);
  scene.add(helmet);
  const cloak = new THREE.Mesh(new THREE.CylinderGeometry(0.17, 0.34, 0.95, 14, 1, true, Math.PI * 0.35, Math.PI * 1.3), dark);
  scene.add(cloak);
  hist.push({ model, helmet, cloak, head: model.getObjectByName('Skeleton_neck_joint_2'), torso: model.getObjectByName('Skeleton_torso_joint_2') });
}
const _v = new THREE.Vector3(), _w = new THREE.Vector3();
function updateHist(t) {
  for (const h of hist) {
    h.head.scale.setScalar(0.5);
    h.model.updateMatrixWorld(true);
    h.head.getWorldPosition(_v); h.torso.getWorldPosition(_w);
    h.helmet.position.set(_v.x, _v.y + 0.07, _v.z);
    h.cloak.position.set(_v.x, _v.y - 0.5, _v.z - 0.07);
  }
}

function place(gltf, clipName, x, silhouette, targetH = 1.78, withGear = false) {
  const model = SkeletonUtils.clone(gltf.scene);
  const g = new THREE.Group(); g.add(model);
  model.updateMatrixWorld(true);
  const box = new THREE.Box3().setFromObject(model), h = box.max.y - box.min.y;
  model.scale.setScalar(targetH / h);
  model.updateMatrixWorld(true);
  const b2 = new THREE.Box3().setFromObject(model); model.position.y -= b2.min.y;
  g.position.x = x;
  model.traverse((o) => {
    if (!o.isMesh) return;
    o.frustumCulled = false;
    if (silhouette) o.material = new THREE.MeshBasicMaterial({ color: 0x0d0d11, fog: true });
  });
  scene.add(g);
  const mixer = new THREE.AnimationMixer(model);
  const clip = gltf.animations.find((c) => c.name === clipName) || gltf.animations[0];
  mixer.clipAction(clip).play();
  mixers.push(mixer);
  if (withGear) addPeriodGear(g, model);
  console.log('placed', clip.name, 'raw height', h.toFixed(2));
}
place(soldier, 'Walk', -4.2, false);
place(soldier, 'Walk', -1.4, true);
place(cesium, null, 1.4, true);
place(cesium, null, 4.2, true, 1.78, true);

function update(t) { mixers.forEach((m) => m.setTime(t)); updateHist(t); renderer.render(scene, camera); }
window.__setTime = (t) => { update(t); return t; };
window.__ready = true;
update(parseFloat(new URLSearchParams(location.search).get('t') || '0.3'));
