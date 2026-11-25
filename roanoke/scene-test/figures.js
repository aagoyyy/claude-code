import * as THREE from 'three';
import * as SkeletonUtils from 'three/addons/utils/SkeletonUtils.js';

/* ------------------------------------------------------------------
   Period figures built on the Cesium Man rig (CC BY 4.0, credit required).
   The mannequin skin is repainted per body region (doublet / hose / boots / skin) and the costume
   pieces (helmet, hat, ruff, cloak, breastplate, musket, sword, oar...) follow the skeleton every frame.
   Kinds: 'gentleman' (John White), 'soldier', 'sailor'.
------------------------------------------------------------------- */

const PAL = {
  gentleman: { body: 0x3a2f27, hose: 0x5b3025, boot: 0x1b1511, skin: 0xb08968 },
  soldier:   { body: 0x6b5b3b, hose: 0x4a4838, boot: 0x1b1511, skin: 0xb08968 },
  sailor:    { body: 0x8d856c, hose: 0x3b4955, boot: 0x2a211a, skin: 0xb08968 },
};
const std = (hex, rough = 1, metal = 0) => new THREE.MeshStandardMaterial({ color: hex, roughness: rough, metalness: metal, side: THREE.DoubleSide });

/* repaint the mannequin by region, using the rest-pose vertex positions */
function paint(mesh, pal) {
  mesh.geometry = mesh.geometry.clone();   // clones share geometry; give each figure its own so palettes do not overwrite each other
  const geo = mesh.geometry, pos = geo.attributes.position;
  geo.computeBoundingBox();
  const bb = geo.boundingBox, mn = [bb.min.x, bb.min.y, bb.min.z], mx = [bb.max.x, bb.max.y, bb.max.z];
  const ext = mn.map((v, i) => mx[i] - v);
  const up = ext.indexOf(Math.max(...ext));
  const others = [0, 1, 2].filter((i) => i !== up);
  const lat = ext[others[0]] >= ext[others[1]] ? others[0] : others[1];
  const mid = (mn[lat] + mx[lat]) / 2;
  const col = new Float32Array(pos.count * 3), c = new THREE.Color();
  const a = [0, 0, 0];
  for (let i = 0; i < pos.count; i++) {
    a[0] = pos.getX(i); a[1] = pos.getY(i); a[2] = pos.getZ(i);
    const f = (a[up] - mn[up]) / ext[up], l = Math.abs(a[lat] - mid) / (ext[lat] / 2);
    let hex = pal.body;
    if (f > 0.85 && l < 0.3) hex = pal.skin;                         // head
    else if (l > 0.78) hex = pal.skin;                                // hands (bind pose is a T-pose: arms run along the lateral axis)
    else if (f < 0.07) hex = pal.boot;                                // boots
    else if (f < 0.50) hex = pal.hose;                                // legs
    c.set(hex);
    col[i * 3] = c.r; col[i * 3 + 1] = c.g; col[i * 3 + 2] = c.b;
  }
  geo.setAttribute('color', new THREE.BufferAttribute(col, 3));
  mesh.material = new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 1 });
}

export function makeFigure(gltf, kind, height = 1.72) {
  const model = SkeletonUtils.clone(gltf.scene);
  const group = new THREE.Group(); group.add(model);
  model.updateMatrixWorld(true);
  let box = new THREE.Box3().setFromObject(model);
  model.scale.setScalar(height / (box.max.y - box.min.y)); model.updateMatrixWorld(true);
  box = new THREE.Box3().setFromObject(model); model.position.y -= box.min.y;
  let skinned = null;
  model.traverse((o) => { o.frustumCulled = false; if (o.isSkinnedMesh) skinned = o; });
  paint(skinned, PAL[kind]);
  skinned.castShadow = true;

  const bone = (n) => model.getObjectByName(n);
  const B = { head: bone('Skeleton_neck_joint_2'), neck: bone('Skeleton_neck_joint_1'), chest: bone('Skeleton_torso_joint_2'),
              pelvis: bone('Skeleton_torso_joint_1'), legR: bone('leg_joint_R_1'), legL: bone('leg_joint_L_1'),
              shR: bone('Skeleton_arm_joint_R'), shL: bone('Skeleton_arm_joint_L__4_') };

  const follow = [];    // { mesh, bone, off(Vector3 in figure space) }
  const add = (mesh, b, x = 0, y = 0, z = 0, rx = 0, ry = 0, rz = 0) => {
    mesh.rotation.set(rx, ry, rz); mesh.castShadow = true; group.add(mesh);
    follow.push({ mesh, bone: B[b], off: new THREE.Vector3(x, y, z) });
  };
  const m = (geo, mat) => new THREE.Mesh(geo, mat);
  const steel = std(0x5d6066, 0.45, 0.6), wood = std(0x4a3524), dark = std(0x1d1814), cloth = std(0x2b2520);

  // ---- hose puffs (trunk hose) on every kind except sailors ----
  if (kind !== 'sailor') {
    const hose = std(PAL[kind].hose);
    for (const s of ['legR', 'legL']) add(m(new THREE.SphereGeometry(0.115, 10, 8), hose), s, 0, -0.02, 0);
    for (const s of ['legR', 'legL']) { const p = follow[follow.length - 1]; p.mesh.scale.set(1, 0.85, 1.05); }
  }

  // a stick-like prop: pole along local +y with an optional extra mesh, carried tilted back over the shoulder
  const prop = (parts) => { const g = new THREE.Group(); parts.forEach((p) => g.add(p)); return g; };
  const at = (mesh, y) => { mesh.position.y = y; return mesh; };

  if (kind === 'gentleman') {
    // capotain hat: tall tapered crown + narrow brim; ruff; cloak; rapier
    add(m(new THREE.CylinderGeometry(0.085, 0.118, 0.21, 12), dark), 'head', 0, 0.16, 0);
    add(m(new THREE.CylinderGeometry(0.18, 0.18, 0.012, 20), dark), 'head', 0, 0.06, 0);
    add(m(new THREE.TorusGeometry(0.095, 0.03, 8, 18), std(0xcfc7b4)), 'neck', 0, 0.035, 0, Math.PI / 2, 0, 0);
    add(m(new THREE.CylinderGeometry(0.17, 0.30, 0.95, 16, 1, true, Math.PI * 0.35, Math.PI * 1.3), cloth), 'chest', 0, -0.42, 0.075);
    add(m(new THREE.CylinderGeometry(0.012, 0.012, 0.95, 5), steel), 'pelvis', 0.2, -0.28, 0.12, 0, 0, 0.35);
  } else if (kind === 'soldier') {
    // morion helmet, steel breastplate, matchlock arquebus carried on the shoulder
    add(m(new THREE.SphereGeometry(0.128, 12, 8, 0, Math.PI * 2, 0, Math.PI / 2), steel), 'head', 0, 0.075, 0);
    add(m(new THREE.CylinderGeometry(0.21, 0.21, 0.012, 20), steel), 'head', 0, 0.07, 0);
    add(m(new THREE.BoxGeometry(0.018, 0.1, 0.24), steel), 'head', 0, 0.2, 0);
    add(m(new THREE.CylinderGeometry(0.15, 0.185, 0.3, 14), steel), 'chest', 0, 0.1, 0);
    add(prop([at(m(new THREE.CylinderGeometry(0.014, 0.014, 1.25, 6), wood), 0.45), at(m(new THREE.BoxGeometry(0.05, 0.28, 0.07), wood), -0.12)]), 'shR', 0.1, 0.1, 0, -0.55, 0, -0.12);
  } else {
    // sailor: knit cap, canvas bag, oar carried over the shoulder
    add(m(new THREE.SphereGeometry(0.118, 10, 8, 0, Math.PI * 2, 0, Math.PI * 0.62), std(0x6b2f2a)), 'head', 0, 0.075, 0);
    add(prop([at(m(new THREE.CylinderGeometry(0.014, 0.014, 1.75, 5), wood), 0.5), at(m(new THREE.BoxGeometry(0.11, 0.4, 0.02), wood), 1.28)]), 'shL', -0.1, 0.05, 0, -0.5, 0, 0.12);
    add(m(new THREE.BoxGeometry(0.22, 0.26, 0.12), std(0x6f6048)), 'chest', 0, -0.12, 0.17);
  }

  const mixer = new THREE.AnimationMixer(model);
  mixer.clipAction(gltf.animations[0]).play();
  const _v = new THREE.Vector3();
  function update(animTime) {
    mixer.setTime(animTime);
    B.head.scale.setScalar(0.55);                       // the mannequin's head is a big ball; shrink it
    model.updateMatrixWorld(true); group.updateMatrixWorld(true);
    for (const f of follow) {
      f.bone.getWorldPosition(_v); group.worldToLocal(_v);
      f.mesh.position.copy(_v).add(f.off);
    }
  }
  return { group, update, kind };
}
