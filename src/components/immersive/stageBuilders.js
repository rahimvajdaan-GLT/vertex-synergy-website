import * as THREE from "three";
import { STAGES } from "./stagesMeta";

// ---- math helpers -------------------------------------------------
const clamp01 = (x) => Math.max(0, Math.min(1, x));
const easeOut = (x) => 1 - Math.pow(1 - x, 3);
const lerp = (a, b, t) => a + (b - a) * t;
const sm = (a, b, x) => {
  const t = clamp01((x - a) / (b - a));
  return t * t * (3 - 2 * t);
};
function fadeScale(t) {
  if (t < 0.12) return sm(0, 0.12, t);
  if (t > 0.9) return 1 - sm(0.9, 1, t);
  return 1;
}
const asm = (t) => easeOut(clamp01((t - 0.12) / 0.76));

// ---- palette + materials -----------------------------------------
const C = {
  white: 0xf2f3f5,
  concrete: 0xd9d4cc,
  steel: 0xc2c7cc,
  steelDark: 0x8b929b,
  glass: 0xbfe3ff,
  orange: 0xff7a18,
  pale: 0xd4e6ff,
  dark: 0x2b2f36,
  copper: 0xc98a5b,
  alum: 0xd8dde2,
  stone: 0xe7e2d8,
  timber: 0xb98a55,
  green: 0x8fae6b,
};
function mat(color, o = {}) {
  const m = new THREE.MeshPhysicalMaterial({
    color,
    metalness: o.m ?? 0.1,
    roughness: o.r ?? 0.6,
    transparent: (o.op ?? 1) < 1,
    opacity: o.op ?? 1,
    clearcoat: o.cc ?? 0.12,
    clearcoatRoughness: 0.5,
  });
  if (o.em) {
    m.emissive = new THREE.Color(o.em);
    m.emissiveIntensity = o.ei ?? 0.5;
  }
  return m;
}
function glassMat(color = C.glass, o = {}) {
  return new THREE.MeshPhysicalMaterial({
    color,
    metalness: 0,
    roughness: o.r ?? 0.06,
    transmission: 1,
    ior: 1.45,
    thickness: 0.6,
    transparent: true,
    opacity: 1,
    envMapIntensity: 1.3,
    clearcoat: 1,
    clearcoatRoughness: 0.1,
  });
}
const box = (w, h, d, m) => new THREE.Mesh(new THREE.BoxGeometry(w, h, d), m);
const cyl = (r, h, m) => new THREE.Mesh(new THREE.CylinderGeometry(r, r, h, 24), m);

// ---- stage builders ----------------------------------------------
function openingNode() {
  const g = new THREE.Group();
  const parts = [];
  const node = box(0.7, 0.7, 0.7, mat(C.steelDark, { m: 0.9, r: 0.3 }));
  node.castShadow = true;
  g.add(node);
  const mk = (geo, to, material) => {
    const mesh = new THREE.Mesh(geo, material);
    mesh.castShadow = true;
    g.add(mesh);
    parts.push({ m: mesh, from: new THREE.Vector3(0, 0, 0), to });
    return mesh;
  };
  const plateMat = mat(C.steel, { m: 0.85, r: 0.35 });
  const px = mk(new THREE.BoxGeometry(0.06, 0.5, 0.5), new THREE.Vector3(1.1, 0, 0), plateMat);
  const nx = mk(new THREE.BoxGeometry(0.06, 0.5, 0.5), new THREE.Vector3(-1.1, 0, 0), plateMat);
  const pz = mk(new THREE.BoxGeometry(0.5, 0.5, 0.06), new THREE.Vector3(0, 0, 1.1), plateMat);
  const nz = mk(new THREE.BoxGeometry(0.5, 0.5, 0.06), new THREE.Vector3(0, 0, -1.1), plateMat);
  const boltMat = mat(C.steelDark, { m: 0.9, r: 0.3 });
  [
    [px, 1],
    [nx, -1],
  ].forEach(([p, dir]) => {
    for (let i = 0; i < 2; i++) {
      const b = cyl(0.05, 0.12, boltMat);
      b.rotation.z = Math.PI / 2;
      b.position.set(dir * 0.04, -0.12 + i * 0.24, 0);
      p.add(b);
    }
  });
  [
    [pz, 1],
    [nz, -1],
  ].forEach(([p, dir]) => {
    for (let i = 0; i < 2; i++) {
      const b = cyl(0.05, 0.12, boltMat);
      b.rotation.x = Math.PI / 2;
      b.position.set(-0.12 + i * 0.24, -0.12 + i * 0.24, dir * 0.04);
      p.add(b);
    }
  });
  const beamMat = mat(C.steel, { m: 0.85, r: 0.35 });
  const beamX = box(4, 0.18, 0.18, beamMat);
  beamX.castShadow = true;
  g.add(beamX);
  parts.push({ m: beamX, from: new THREE.Vector3(0, 0, 0), to: new THREE.Vector3(2.8, 0, 0) });
  const beamZ = box(0.18, 0.18, 4, beamMat);
  beamZ.castShadow = true;
  g.add(beamZ);
  parts.push({ m: beamZ, from: new THREE.Vector3(0, 0, 0), to: new THREE.Vector3(0, 0, 2.8) });
  const acc = box(0.14, 0.14, 0.14, mat(C.orange, { m: 0.3, r: 0.4, em: C.orange, ei: 0.3 }));
  g.add(acc);

  const update = (_g, t) => {
    _g.scale.setScalar(fadeScale(t));
    _g.rotation.y = t * 0.55 * Math.PI;
    const a = asm(t);
    parts.forEach((p) => p.m.position.lerpVectors(p.from, p.to, a));
    _g.visible = t > -0.02 && t < 1.02;
  };
  return { group: g, update };
}

function typoFragment() {
  const g = new THREE.Group();
  const shard = new THREE.Mesh(new THREE.IcosahedronGeometry(0.7, 0), mat(C.steel, { m: 0.9, r: 0.3 }));
  shard.castShadow = true;
  g.add(shard);
  const plate = box(1.3, 0.06, 0.95, mat(C.concrete, { r: 0.85 }));
  plate.position.y = -0.85;
  plate.receiveShadow = true;
  g.add(plate);
  const update = (_g, t) => {
    _g.scale.setScalar(fadeScale(t));
    _g.visible = t > -0.02 && t < 1.02;
    shard.rotation.x = t * Math.PI;
    shard.rotation.y = t * Math.PI * 0.7;
    _g.position.y = Math.sin(t * Math.PI) * 0.15;
  };
  return { group: g, update };
}

function conceptMassing() {
  const g = new THREE.Group();
  const slabs = [];
  for (let i = 0; i < 5; i++) {
    const w = 5 - (i >= 3 ? 1.2 : 0);
    const d = 4 - (i >= 4 ? 1 : 0);
    const slab = box(w, 0.22, d, mat(i % 2 ? C.concrete : C.white, { r: 0.85, m: 0.05 }));
    slab.castShadow = true;
    slab.receiveShadow = true;
    g.add(slab);
    slabs.push({ m: slab, fy: 0.2 + i * 1.05 });
  }
  const terrace = box(2.5, 1.0, 2, mat(C.white, { r: 0.8 }));
  terrace.castShadow = true;
  terrace.position.set(1.4, 3.9, -1);
  g.add(terrace);
  slabs.push({ m: terrace, fy: 3.9 });
  const canopy = box(3, 0.08, 1.6, mat(C.steel, { m: 0.6, r: 0.4 }));
  canopy.castShadow = true;
  g.add(canopy);
  const colMat = mat(C.steelDark, { m: 0.8, r: 0.3 });
  const col1 = box(0.1, 1, 0.1, colMat);
  col1.position.set(-1.2, -0.5, 2);
  col1.castShadow = true;
  g.add(col1);
  const col2 = col1.clone();
  col2.position.x = 1.2;
  g.add(col2);

  const update = (_g, t) => {
    _g.scale.setScalar(fadeScale(t));
    _g.rotation.y = 0.15 + t * 0.2;
    _g.visible = t > -0.02 && t < 1.02;
    slabs.forEach((s, i) => {
      const ti = clamp01((t - i * 0.05) / 0.5);
      s.m.position.y = lerp(-7, s.fy, easeOut(ti));
    });
    const tc = clamp01((t - 0.62) / 0.35);
    canopy.position.y = lerp(-7, 0.1, easeOut(tc));
    canopy.position.z = lerp(2, 1.2, easeOut(tc));
    col1.position.y = lerp(-7, -0.5, easeOut(tc));
    col2.position.y = col1.position.y;
  };
  return { group: g, update };
}

function structural() {
  const g = new THREE.Group();
  const parts = [];
  const xs = [-2, 0, 2];
  const zs = [-2, 0, 2];
  xs.forEach((x) =>
    zs.forEach((z) => {
      const c = box(0.22, 3, 0.22, mat(C.concrete, { r: 0.9, m: 0.05 }));
      c.position.set(x, -3, z);
      c.castShadow = true;
      g.add(c);
      parts.push({ m: c, from: new THREE.Vector3(x, -3, z), to: new THREE.Vector3(x, 1.5, z), delay: (Math.abs(x) + Math.abs(z)) * 0.04 });
    })
  );
  const beamMat = mat(C.steel, { m: 0.85, r: 0.35 });
  zs.forEach((z) => {
    const b = box(4.2, 0.2, 0.2, beamMat);
    b.position.set(-5, 3, z);
    b.castShadow = true;
    g.add(b);
    parts.push({ m: b, from: new THREE.Vector3(-5, 3, z), to: new THREE.Vector3(0, 3, z), delay: 0.3 });
  });
  xs.forEach((x) => {
    const b = box(0.2, 0.2, 4.2, beamMat);
    b.position.set(x, 3, -5);
    b.castShadow = true;
    g.add(b);
    parts.push({ m: b, from: new THREE.Vector3(x, 3, -5), to: new THREE.Vector3(x, 3, 0), delay: 0.32 });
  });
  const slab = box(4.4, 0.12, 4.4, mat(C.white, { r: 0.8 }));
  slab.position.set(0, 6, 0);
  slab.castShadow = true;
  slab.receiveShadow = true;
  g.add(slab);
  parts.push({ m: slab, from: new THREE.Vector3(0, 6, 0), to: new THREE.Vector3(0, 3.15, 0), delay: 0.4 });
  const conn = box(0.3, 0.3, 0.3, mat(C.orange, { m: 0.3, r: 0.4, em: C.orange, ei: 0.4 }));
  conn.position.set(2, 3, 0);
  g.add(conn);

  const update = (_g, t) => {
    _g.scale.setScalar(fadeScale(t));
    _g.visible = t > -0.02 && t < 1.02;
    parts.forEach((p) => {
      const ti = clamp01((t - p.delay) / 0.5);
      p.m.position.lerpVectors(p.from, p.to, easeOut(ti));
    });
    conn.scale.setScalar(1 + 0.15 * Math.sin(t * Math.PI * 4));
  };
  return { group: g, update };
}

function services() {
  const g = new THREE.Group();
  const mainDuct = box(0.6, 0.6, 5, mat(C.steel, { m: 0.7, r: 0.45 }));
  mainDuct.position.set(0, 1.7, 0);
  mainDuct.castShadow = true;
  g.add(mainDuct);
  const branch1 = box(0.35, 0.35, 1.6, mat(C.steel, { m: 0.7, r: 0.45 }));
  branch1.position.set(0.55, 1.7, -1.5);
  branch1.rotation.y = Math.PI / 4;
  g.add(branch1);
  const branch2 = box(0.35, 0.35, 1.4, mat(C.steel, { m: 0.7, r: 0.45 }));
  branch2.position.set(-0.55, 1.7, 1.4);
  g.add(branch2);
  const pipe = cyl(0.12, 4.4, mat(C.copper, { m: 0.9, r: 0.3 }));
  pipe.rotation.z = Math.PI / 2;
  pipe.position.set(0, 1.05, 0);
  pipe.castShadow = true;
  g.add(pipe);
  const valve = new THREE.Mesh(new THREE.TorusGeometry(0.16, 0.05, 16, 32), mat(C.steelDark, { m: 0.9, r: 0.3 }));
  valve.rotation.y = Math.PI / 2;
  valve.position.set(2.3, 1.05, 0);
  g.add(valve);
  const tray = box(0.5, 0.1, 4.4, mat(C.dark, { m: 0.5, r: 0.6 }));
  tray.position.set(0, 0.65, 0);
  g.add(tray);
  const ahu = box(1.3, 1, 0.9, mat(C.alum, { m: 0.6, r: 0.4 }));
  ahu.position.set(-2.4, 1.0, 0);
  ahu.castShadow = true;
  g.add(ahu);

  const update = (_g, t) => {
    _g.scale.setScalar(fadeScale(t));
    _g.visible = t > -0.02 && t < 1.02;
    _g.rotation.y = 0.2 + t * 0.5;
    const a = asm(t);
    mainDuct.scale.z = 0.001 + a;
    branch1.scale.z = 0.001 + clamp01((a - 0.2) / 0.6);
    branch2.scale.z = 0.001 + clamp01((a - 0.3) / 0.6);
    pipe.scale.x = 0.001 + a;
    tray.scale.z = 0.001 + clamp01((a - 0.1) / 0.7);
    valve.scale.setScalar(0.001 + clamp01((a - 0.5) / 0.4));
    ahu.scale.setScalar(0.001 + clamp01((a - 0.4) / 0.5));
  };
  return { group: g, update };
}

function facade() {
  const g = new THREE.Group();
  const layers = [
    { w: 4.2, h: 3, d: 0.08, c: C.steel, m: { m: 0.85, r: 0.35 } },
    { w: 4.0, h: 2.9, d: 0.06, c: C.pale, m: { r: 0.9 } },
    { w: 4.1, h: 2.95, d: 0.04, c: C.concrete, m: { r: 0.85 } },
    { w: 4.0, h: 3.0, d: 0.1, c: C.concrete, m: { r: 0.85 } },
    { w: 3.9, h: 2.9, d: 0.05, c: C.glass, glass: true },
  ];
  const meshes = [];
  layers.forEach((l) => {
    const m = l.glass ? box(l.w, l.h, l.d, glassMat(l.c, { r: 0.05 })) : box(l.w, l.h, l.d, mat(l.c, l.m));
    m.castShadow = !l.glass;
    m.receiveShadow = true;
    g.add(m);
    meshes.push(m);
  });
  const fins = [];
  for (let i = 0; i < 5; i++) {
    const f = box(0.08, 3, 0.3, mat(C.orange, { m: 0.4, r: 0.4 }));
    f.position.set(-1.6 + i * 0.8, 0, 0.2);
    f.castShadow = true;
    g.add(f);
    fins.push(f);
  }
  const baseZ = -1.0;
  const update = (_g, t) => {
    _g.scale.setScalar(fadeScale(t));
    _g.visible = t > -0.02 && t < 1.02;
    _g.rotation.y = 0.1 + t * 0.3;
    const a = Math.sin(t * Math.PI);
    meshes.forEach((m, i) => {
      m.position.z = baseZ + (i - 2) * a * 1.3;
    });
    fins.forEach((f, i) => {
      f.position.z = 0.2 + a * 2.6;
      f.position.y = Math.sin(t * Math.PI * 2 + i) * 0.05;
    });
  };
  return { group: g, update };
}

function equipment() {
  const g = new THREE.Group();
  const parts = [];
  const steel = mat(C.steel, { m: 0.85, r: 0.35 });
  const steelDark = mat(C.steelDark, { m: 0.8, r: 0.4 });
  const base = box(2, 0.3, 1.4, mat(C.concrete, { r: 0.9 }));
  base.castShadow = true;
  base.receiveShadow = true;
  g.add(base);
  parts.push({ m: base, from: new THREE.Vector3(0, -3, 0), to: new THREE.Vector3(0, 0.15, 0), d: 0 });
  const mast = box(0.3, 6, 0.3, steel);
  mast.castShadow = true;
  g.add(mast);
  parts.push({ m: mast, from: new THREE.Vector3(0, -6, 0), to: new THREE.Vector3(0, 3.3, 0), d: 0.1 });
  const head = new THREE.Group();
  head.position.y = -2;
  const jib = box(4.5, 0.18, 0.18, steel);
  jib.position.set(1.4, 0, 0);
  jib.castShadow = true;
  head.add(jib);
  const cjib = box(1.6, 0.18, 0.18, steel);
  cjib.position.set(-1.0, 0, 0);
  head.add(cjib);
  const cw = box(0.5, 0.5, 0.5, steelDark);
  cw.position.set(-1.7, -0.2, 0);
  cw.castShadow = true;
  head.add(cw);
  const cab = box(0.4, 0.4, 0.4, mat(C.orange, { m: 0.3, r: 0.4 }));
  cab.position.set(0.2, -0.1, 0);
  head.add(cab);
  const hookGroup = new THREE.Group();
  const cable = cyl(0.02, 2, steelDark);
  cable.position.y = -1;
  hookGroup.add(cable);
  const hook = box(0.12, 0.18, 0.12, steelDark);
  hook.position.y = -2;
  hookGroup.add(hook);
  hookGroup.position.set(2.8, 0, 0);
  head.add(hookGroup);
  g.add(head);
  parts.push({ m: head, from: new THREE.Vector3(0, -2, 0), to: new THREE.Vector3(0, 6.3, 0), d: 0.3, isHead: true });
  const b1 = box(1.4, 2.4, 1.4, mat(C.white, { r: 0.8 }));
  b1.position.set(-3, -5, -1.5);
  b1.castShadow = true;
  g.add(b1);
  parts.push({ m: b1, from: new THREE.Vector3(-3, -5, -1.5), to: new THREE.Vector3(-3, 1.2, -1.5), d: 0.2 });

  const update = (_g, t) => {
    _g.scale.setScalar(fadeScale(t));
    _g.visible = t > -0.02 && t < 1.02;
    const a = asm(t);
    parts.forEach((p) => {
      const ti = clamp01((t - p.d) / 0.4);
      if (p.isHead) {
        p.m.position.y = lerp(p.from.y, p.to.y, easeOut(ti));
      } else {
        p.m.position.lerpVectors(p.from, p.to, easeOut(ti));
      }
    });
    head.rotation.y = clamp01((a - 0.6) / 0.4) * Math.PI * 1.2;
    hookGroup.position.y = -clamp01((a - 0.7) / 0.3) * 1.2;
  };
  return { group: g, update };
}

function interior() {
  const g = new THREE.Group();
  const floor = box(4, 0.1, 4, mat(C.white, { r: 0.6, m: 0.05 }));
  floor.receiveShadow = true;
  g.add(floor);
  const wall = box(4, 2.6, 0.1, mat(C.white, { r: 0.8 }));
  wall.position.set(0, 1.3, -2);
  wall.castShadow = true;
  g.add(wall);
  const side = box(0.1, 2.6, 4, mat(C.pale, { r: 0.8 }));
  side.position.set(-2, 1.3, 0);
  g.add(side);
  const ceil = box(4, 0.1, 4, mat(C.white, { r: 0.7 }));
  ceil.position.set(0, 2.6, 0);
  g.add(ceil);
  const steps = [];
  for (let i = 0; i < 6; i++) {
    const s = box(0.7, 0.1, 0.3, mat(C.concrete, { r: 0.85 }));
    s.position.set(-1.2, 0.05 + i * 0.25, 1.2 - i * 0.35);
    s.castShadow = true;
    g.add(s);
    steps.push({ m: s, y: 0.05 + i * 0.25 });
  }
  const joinery = box(1, 1.2, 0.6, mat(C.steel, { m: 0.6, r: 0.4 }));
  joinery.position.set(1.3, -4, -1.2);
  joinery.castShadow = true;
  g.add(joinery);
  const lights = [];
  for (let i = 0; i < 3; i++) {
    const l = box(0.6, 0.04, 0.2, mat(C.white, { em: 0xfff2e0, ei: 0 }));
    l.position.set(-1.2 + i * 1.2, 2.55, 0);
    g.add(l);
    lights.push(l);
  }
  const parts = [
    { m: floor, from: -4, to: 0, d: 0 },
    { m: wall, from: -4, to: 1.3, d: 0.05 },
    { m: side, from: -4, to: 1.3, d: 0.1 },
    { m: ceil, from: -4, to: 2.6, d: 0.35 },
    { m: joinery, from: -4, to: 0.6, d: 0.5 },
  ];
  const update = (_g, t) => {
    _g.scale.setScalar(fadeScale(t));
    _g.visible = t > -0.02 && t < 1.02;
    _g.rotation.y = 0.3 + t * 0.3;
    parts.forEach((p) => {
      const ti = clamp01((t - p.d) / 0.4);
      p.m.position.y = lerp(p.from, p.to, easeOut(ti));
    });
    steps.forEach((s, i) => {
      const ti = clamp01((t - 0.2 - i * 0.04) / 0.4);
      s.m.position.y = lerp(-4, s.y, easeOut(ti));
    });
    lights.forEach((l, i) => {
      const ti = clamp01((t - 0.6 - i * 0.05) / 0.3);
      l.material.emissiveIntensity = ti * 1.2;
      l.visible = ti > 0;
    });
  };
  return { group: g, update };
}

function constructionSequence() {
  const g = new THREE.Group();
  const layers = [];
  const found = box(4, 0.3, 4, mat(C.concrete, { r: 0.9 }));
  found.position.y = 0.15;
  found.receiveShadow = true;
  found.castShadow = true;
  g.add(found);
  layers.push(found);
  const cols = new THREE.Group();
  [-1.5, 0, 1.5].forEach((x) =>
    [-1.5, 0, 1.5].forEach((z) => {
      const c = box(0.2, 3, 0.2, mat(C.concrete, { r: 0.9 }));
      c.position.set(x, 1.5, z);
      c.castShadow = true;
      cols.add(c);
    })
  );
  cols.scale.setScalar(0.001);
  g.add(cols);
  layers.push(cols);
  const slabs = new THREE.Group();
  [1, 2, 3].forEach((y) => {
    const s = box(4, 0.1, 4, mat(C.white, { r: 0.8 }));
    s.position.set(0, y, 0);
    s.receiveShadow = true;
    slabs.add(s);
  });
  slabs.scale.setScalar(0.001);
  g.add(slabs);
  layers.push(slabs);
  const beams = new THREE.Group();
  [1, 2, 3].forEach((y) => {
    const b = box(4, 0.12, 0.12, mat(C.steel, { m: 0.85, r: 0.35 }));
    b.position.set(0, y + 0.05, -1.5);
    beams.add(b);
    const b2 = b.clone();
    b2.position.z = 1.5;
    beams.add(b2);
  });
  beams.scale.setScalar(0.001);
  g.add(beams);
  layers.push(beams);
  const mep = new THREE.Group();
  const duct = box(0.3, 0.3, 3.6, mat(C.steel, { m: 0.7, r: 0.45 }));
  duct.position.set(0, 1.6, 0);
  mep.add(duct);
  const pipe = cyl(0.08, 3.6, mat(C.copper, { m: 0.9, r: 0.3 }));
  pipe.rotation.x = Math.PI / 2;
  pipe.position.set(0.6, 1.4, 0);
  mep.add(pipe);
  mep.scale.setScalar(0.001);
  g.add(mep);
  layers.push(mep);
  const facadeGrp = new THREE.Group();
  for (let i = 0; i < 4; i++) {
    const f = box(4, 1, 0.08, mat(C.white, { r: 0.7, m: 0.1, op: 0.8 }));
    f.position.set(0, 0.5 + i, 2);
    facadeGrp.add(f);
    const f2 = f.clone();
    f2.position.z = -2;
    facadeGrp.add(f2);
  }
  facadeGrp.scale.setScalar(0.001);
  g.add(facadeGrp);
  layers.push(facadeGrp);
  const interiorGrp = new THREE.Group();
  const part = box(0.08, 1, 2, mat(C.pale, { r: 0.8 }));
  part.position.set(0, 2.5, 0);
  interiorGrp.add(part);
  interiorGrp.scale.setScalar(0.001);
  g.add(interiorGrp);
  layers.push(interiorGrp);
  const land = new THREE.Group();
  for (let i = 0; i < 3; i++) {
    const t = box(0.4, 0.4, 0.4, mat(C.green, { r: 0.9 }));
    t.position.set(2.6, 0.2, -1 + i);
    t.castShadow = true;
    land.add(t);
  }
  land.scale.setScalar(0.001);
  g.add(land);
  layers.push(land);

  const Nl = layers.length;
  const update = (_g, t) => {
    _g.scale.setScalar(fadeScale(t));
    _g.visible = t > -0.02 && t < 1.02;
    _g.rotation.y = 0.5 + t * 0.6;
    const phase = t * Nl;
    layers.forEach((l, i) => {
      const r = clamp01(phase - i);
      l.scale.setScalar(0.001 + easeOut(r));
    });
  };
  return { group: g, update };
}

function showcase() {
  const g = new THREE.Group();
  const blds = [];
  const defs = [
    { x: -2, z: 0, h: 2.4, w: 1.6, d: 1.4 },
    { x: 0.6, z: 0.6, h: 3.2, w: 1.4, d: 1.6 },
    { x: 3.2, z: -0.4, h: 1.8, w: 1.8, d: 1.2 },
  ];
  defs.forEach((d) => {
    const b = box(d.w, d.h, d.d, mat(C.white, { r: 0.8, m: 0.05 }));
    b.position.set(d.x, -5, d.z);
    b.castShadow = true;
    b.receiveShadow = true;
    g.add(b);
    blds.push({ m: b, fy: d.h / 2 });
    const floors = Math.round(d.h / 0.8);
    for (let i = 0; i < floors; i++) {
      const w = box(d.w * 0.9, 0.16, 0.02, glassMat(C.glass, { r: 0.08 }));
      w.position.set(d.x, -5, d.z + d.d / 2 + 0.02);
      g.add(w);
      blds.push({ m: w, fy: 0.4 + i * 0.8 });
    }
  });
  const update = (_g, t) => {
    _g.scale.setScalar(fadeScale(t));
    _g.visible = t > -0.02 && t < 1.02;
    _g.rotation.y = -0.4 + t * 1.1 * Math.PI * 0.5;
    const a = asm(t);
    blds.forEach((b, i) => {
      const ti = clamp01((a - i * 0.05) / 0.6);
      b.m.position.y = lerp(-5, b.fy, easeOut(ti));
    });
  };
  return { group: g, update };
}

function materials() {
  const g = new THREE.Group();
  const defs = [
    { c: C.concrete, m: { r: 0.9 }, s: 0.9 },
    { c: C.glass, glass: true, s: 0.7 },
    { c: C.steel, m: { m: 0.9, r: 0.3 }, s: 0.7 },
    { c: C.alum, m: { m: 0.7, r: 0.35 }, s: 0.7 },
    { c: C.stone, m: { r: 0.7 }, s: 0.9 },
    { c: C.timber, m: { r: 0.6 }, s: 0.8 },
    { c: C.pale, m: { r: 0.9 }, s: 0.7 },
  ];
  const samples = [];
  defs.forEach((d, i) => {
    const m = d.glass ? box(d.s, d.s * 1.2, d.s, glassMat(d.c, { r: 0.06 })) : box(d.s, d.s * 1.2, d.s, mat(d.c, d.m));
    const ang = (i / (defs.length - 1)) * Math.PI - Math.PI / 2;
    m.position.set(Math.cos(ang) * 2.6, -4, Math.sin(ang) * 2.6 * 0.4);
    m.castShadow = true;
    m.receiveShadow = true;
    g.add(m);
    samples.push({ m, fy: d.s * 0.6, i });
  });
  const update = (_g, t) => {
    _g.scale.setScalar(fadeScale(t));
    _g.visible = t > -0.02 && t < 1.02;
    _g.rotation.y = t * 0.5 * Math.PI;
    const a = asm(t);
    samples.forEach((s) => {
      const ti = clamp01((a - s.i * 0.05) / 0.6);
      s.m.position.y = lerp(-4, s.fy + Math.sin(t * Math.PI * 2 + s.i) * 0.05, easeOut(ti));
      s.m.rotation.y = t * Math.PI + s.i;
    });
  };
  return { group: g, update };
}

function safety() {
  const g = new THREE.Group();
  const helmet = new THREE.Group();
  const dome = new THREE.Mesh(
    new THREE.SphereGeometry(0.45, 24, 16, 0, Math.PI * 2, 0, Math.PI / 2),
    mat(C.orange, { m: 0.3, r: 0.4 })
  );
  dome.castShadow = true;
  helmet.add(dome);
  const brim = cyl(0.55, 0.05, mat(C.orange, { m: 0.3, r: 0.4 }));
  helmet.add(brim);
  helmet.position.set(-1.4, 0.45, 0);
  g.add(helmet);
  const cone = new THREE.Mesh(new THREE.ConeGeometry(0.35, 0.7, 20), mat(C.orange, { m: 0.3, r: 0.4, em: C.orange, ei: 0.15 }));
  cone.position.set(0, 0.35, 0);
  cone.castShadow = true;
  g.add(cone);
  const coneBase = cyl(0.4, 0.04, mat(C.steelDark, { m: 0.6, r: 0.4 }));
  coneBase.position.set(0, 0.02, 0);
  g.add(coneBase);
  const barrier = new THREE.Group();
  const bMat = mat(C.steel, { m: 0.7, r: 0.4 });
  const post1 = cyl(0.04, 1.4, bMat);
  post1.position.set(-0.6, 0.7, 0);
  barrier.add(post1);
  const post2 = cyl(0.04, 1.4, bMat);
  post2.position.set(0.6, 0.7, 0);
  barrier.add(post2);
  const rail = box(1.3, 0.06, 0.06, bMat);
  rail.position.set(0, 1.2, 0);
  barrier.add(rail);
  const rail2 = box(1.3, 0.06, 0.06, bMat);
  rail2.position.set(0, 0.5, 0);
  barrier.add(rail2);
  barrier.position.set(1.6, 0, 0);
  g.add(barrier);
  const gauge = new THREE.Group();
  const gBody = cyl(0.4, 0.2, mat(C.steelDark, { m: 0.7, r: 0.4 }));
  gBody.rotation.x = Math.PI / 2;
  gauge.add(gBody);
  const screen = cyl(0.3, 0.02, mat(C.glass, { m: 0.1, r: 0.1, em: 0x4fd6ff, ei: 0.6 }));
  screen.rotation.x = Math.PI / 2;
  screen.position.z = 0.1;
  gauge.add(screen);
  gauge.position.set(-0.2, 0.4, 1.6);
  g.add(gauge);

  const items = [
    { o: helmet, y: 0.45 },
    { o: cone, y: 0.35 },
    { o: coneBase, y: 0.02 },
    { o: barrier, y: 0 },
    { o: gauge, y: 0.4 },
  ];
  const update = (_g, t) => {
    _g.scale.setScalar(fadeScale(t));
    _g.visible = t > -0.02 && t < 1.02;
    _g.rotation.y = t * 0.4 * Math.PI;
    const a = asm(t);
    items.forEach((it, i) => {
      const ti = clamp01((a - i * 0.08) / 0.5);
      it.o.position.y = lerp(-3, it.y, easeOut(ti));
    });
  };
  return { group: g, update };
}

function finalScene() {
  const g = new THREE.Group();
  const parts = [];
  const node = box(0.5, 0.5, 0.5, mat(C.steelDark, { m: 0.9, r: 0.3 }));
  const slab = box(1.6, 0.16, 1.2, mat(C.concrete, { r: 0.85 }));
  const pipe = cyl(0.12, 1.4, mat(C.copper, { m: 0.9, r: 0.3 }));
  pipe.rotation.z = Math.PI / 2;
  const glassP = box(1.2, 1.6, 0.06, glassMat(C.glass, { r: 0.05 }));
  const b = box(1.2, 1.8, 1, mat(C.white, { r: 0.8 }));
  const arr = [
    { m: node, from: [3, 2, 2], to: [0, 0.6, 0] },
    { m: slab, from: [-3, -1, 2], to: [0, 1.5, 0] },
    { m: pipe, from: [-3, 2, -2], to: [0, 1.1, 0.4] },
    { m: glassP, from: [3, -1, -2], to: [0, 1.1, -0.5] },
    { m: b, from: [0, -4, 3], to: [0, 0.2, 0] },
  ];
  arr.forEach((p) => {
    p.m.castShadow = true;
    p.m.position.set(p.from[0], p.from[1], p.from[2]);
    g.add(p.m);
    parts.push({ m: p.m, from: new THREE.Vector3(...p.from), to: new THREE.Vector3(...p.to) });
  });
  const update = (_g, t) => {
    _g.scale.setScalar(fadeScale(t));
    _g.visible = t > -0.02 && t < 1.02;
    _g.rotation.y = t * 0.6 * Math.PI;
    const a = asm(t);
    parts.forEach((p) => p.m.position.lerpVectors(p.from, p.to, easeOut(a)));
  };
  return { group: g, update };
}

const builders = [
  openingNode,
  typoFragment,
  conceptMassing,
  structural,
  services,
  facade,
  equipment,
  typoFragment,
  interior,
  constructionSequence,
  showcase,
  typoFragment,
  materials,
  safety,
  finalScene,
];

export function createStages() {
  return STAGES.map((meta, i) => {
    const b = builders[i]();
    return { meta, group: b.group, update: b.update };
  });
}