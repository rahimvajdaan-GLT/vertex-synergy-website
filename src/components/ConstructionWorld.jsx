import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { useScrollProgress } from "@/lib/ScrollContext";

export default function ConstructionWorld() {
  const progress = useScrollProgress();
  const mountRef = useRef(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const mobile = window.innerWidth < 768;
    if (reduce) return;

    const mount = mountRef.current;
    const scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0x000000, 110, 320);
    const camera = new THREE.PerspectiveCamera(40, mount.clientWidth / mount.clientHeight, 0.1, 600);
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: !mobile, powerPreference: "high-performance", logarithmicDepthBuffer: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, mobile ? 1 : 1.6));
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    renderer.setClearColor(0x000000, 0);
    mount.appendChild(renderer.domElement);

    // Palette
    const INK = 0x2f74b8, BLUE = 0x6aa8e6, SKY = 0xbcd8f2, STEEL = 0x6f8aa8, AMBER = 0xe8a44a, GLASS = 0xd6e6fb, SAGE = 0x8fb8a8;

    const tracked = [];
    const t = (m) => { tracked.push(m); return m; };
    const mat = (c, op = 1, dashed = false) =>
      dashed ? new THREE.LineDashedMaterial({ color: c, transparent: true, opacity: op, dashSize: 0.5, gapSize: 0.34, fog: true })
             : new THREE.LineBasicMaterial({ color: c, transparent: true, opacity: op, fog: true });
    const glassMat = (op) => t(new THREE.MeshBasicMaterial({ color: GLASS, transparent: true, opacity: op, fog: true, side: THREE.DoubleSide, depthWrite: false }));
    const edge = (g, m) => { const e = new THREE.LineSegments(new THREE.EdgesGeometry(g, 1), m); if (m.isLineDashedMaterial) e.computeLineDistances(); return e; };
    const fade = (p, s, e) => Math.max(0, Math.min(1, (p - s) / (e - s)));
    const bump = (p, c, h = 0.045) => fade(p, c - h, c) * (1 - fade(p, c, c + h));
    const V = (x, y, z) => new THREE.Vector3(x, y, z);
    const seg = (a, b, m) => { const l = new THREE.Line(new THREE.BufferGeometry().setFromPoints([a, b]), m); if (m.isLineDashedMaterial) l.computeLineDistances(); return l; };
    const tube = (a, b, r, m) => { const dir = new THREE.Vector3().subVectors(b, a); const len = dir.length(); const geo = new THREE.CylinderGeometry(r, r, len, 8, 1, true); const mesh = new THREE.Mesh(geo, m); mesh.position.copy(a).addScaledVector(dir, 0.5); mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.clone().normalize()); return mesh; };
    const batch = (pts, m) => new THREE.LineSegments(new THREE.BufferGeometry().setFromPoints(pts), m);
    const loop = (pts, m) => new THREE.LineLoop(new THREE.BufferGeometry().setFromPoints(pts), m);
    const circle = (cx, cz, r, y, m) => { const pts = []; for (let i = 0; i <= 28; i++) { const a = (i / 28) * Math.PI * 2; pts.push(V(cx + Math.cos(a) * r, y, cz + Math.sin(a) * r)); } return loop(pts, m); };
    // box edges pushed into a points array (for batching)
    const boxPts = (pts, w, d, h, cx, cy, cz) => {
      const x = w / 2, z = d / 2; const a = [[-x,-z],[x,-z],[x,z],[-x,z],[-x,-z]];
      for (let i = 0; i < 4; i++) { pts.push(V(cx + a[i][0], cy, cz + a[i][1]), V(cx + a[i + 1][0], cy, cz + a[i + 1][1])); }
      for (let i = 0; i < 4; i++) { pts.push(V(cx + a[i][0], cy + h, cz + a[i][1]), V(cx + a[i + 1][0], cy + h, cz + a[i + 1][1])); }
      for (let i = 0; i < 4; i++) { pts.push(V(cx + a[i][0], cy, cz + a[i][1]), V(cx + a[i][0], cy + h, cz + a[i][1])); }
    };

    // ---------- BUILDING DATA: multi-volume 5-floor engineering center ----------
    const FH = 3.6;
    const ROOF_H = 5 * FH; // 18
    const GX = [-26, -18, -10, -2, 6, 14, 22];
    const GZ = [-14, -7, 0, 7, 14];
    // massing volumes: [w, d, y0, y1, cx, cz, zone]
    const mass = [
      [52, 28, 0, 7.2, 0, 0, "podium"],
      [16, 22, 7.2, 18, -18, -2, "west"],
      [16, 22, 7.2, 14.4, 18, -2, "east"],
      [14, 10, 14.4, 18, 0, -12, "pavilion"],
      [14, 6, 0, 7.2, 0, 11, "lobby"],
      [8, 6, 10.8, 14.4, -8, 2, "cantilever"],
      [12, 16, 0, 7.2, -30, 0, "annex"],      // low west annex (2 floors)
      [16, 6, 7.2, 10.8, 12, 8, "terrace"],   // south terrace pavilion on podium roof
      [10, 4, 14.4, 18, 0, -2, "link"],       // upper sky-link between wings
    ];
    const cores = [{ cx: -22, cz: 12 }, { cx: 22, cz: -12 }];

    // Materials / line hierarchy
    const mStruct = t(mat(INK, 0.75));      // primary structure
    const mArch = t(mat(INK, 0.4));         // secondary architecture / panels
    const mFins = t(mat(SKY, 0.3));         // façade fins / mullions
    const mScreen = t(mat(BLUE, 0.3));      // mashrabiya / screens
    const mHidden = t(mat(INK, 0.3, true)); // hidden lines
    const mDiag = t(mat(INK, 0.3));         // signature diagonal frame (visual thread)
    const mGlass = glassMat(0.1);
    const mBlueprint = t(mat(BLUE, 0.1, true));
    const mFound = t(mat(INK, 0));          // foundations
    const mFoundSec = t(mat(STEEL, 0));     // underground utilities
    const mMech = t(mat(0x7fb0e8, 0));   // mechanical — pale blue
    const mElec = t(mat(0xe8c873, 0));    // electrical — soft gold
    const mPlumb = t(mat(0x3fbfbf, 0));   // plumbing — cyan
    const mFire = t(mat(0xd07070, 0));    // fire protection — soft red
    const mMechM = t(new THREE.MeshBasicMaterial({ color: 0x7fb0e8, transparent: true, opacity: 0, fog: true, depthWrite: false }));
    const mElecM = t(new THREE.MeshBasicMaterial({ color: 0xe8c873, transparent: true, opacity: 0, fog: true, depthWrite: false }));
    const mPlumbM = t(new THREE.MeshBasicMaterial({ color: 0x3fbfbf, transparent: true, opacity: 0, fog: true, depthWrite: false }));
    const mFireM = t(new THREE.MeshBasicMaterial({ color: 0xd07070, transparent: true, opacity: 0, fog: true, depthWrite: false }));
    const mInterior = t(mat(INK, 0));
    const mCrown = t(mat(INK, 0.5));
    const mGlow = t(mat(AMBER, 0));
    const mSite = t(mat(SKY, 0.1));
    const mDraft = t(mat(SKY, 0.16));
    const mLand = t(mat(SKY, 0.25));
    const mWater = t(mat(BLUE, 0.3));
    const mGreen = t(mat(SAGE, 0.4));
    const mExplode = t(mat(INK, 0));

    // ---------- LANDSCAPE / EXTERNAL WORKS ----------
    const land = new THREE.Group();
    // plaza paving (front, z 14..22) grid + diagonals
    for (let x = -26; x <= 26; x += 4) land.add(seg(V(x, 0.04, 14), V(x, 0.04, 22), mLand));
    for (let z = 14; z <= 22; z += 4) land.add(seg(V(-26, 0.04, z), V(26, 0.04, z), mLand));
    land.add(seg(V(-26, 0.05, 14), V(26, 0.05, 22), mLand));
    land.add(seg(V(26, 0.05, 14), V(-26, 0.05, 22), mLand));
    // reflecting pool
    const poolPts = []; boxPts(poolPts, 16, 6, 0.15, 0, 0.06, 18); land.add(batch(poolPts, mWater));
    for (let i = -7; i <= 7; i += 3) land.add(seg(V(i, 0.07, 15.2), V(i, 0.07, 20.8), mWater));
    // drop-off lane + service road
    land.add(seg(V(-30, 0.05, 24), V(30, 0.05, 24), mLand));
    land.add(seg(V(-30, 0.05, -20), V(30, 0.05, -20), mLand));
    // bollards (dots)
    for (let x = -24; x <= 24; x += 6) land.add(seg(V(x, 0.05, 23), V(x, 0.4, 23), mLand));
    // lighting poles
    [-24, -12, 0, 12, 24].forEach((x) => { land.add(seg(V(x, 0, 25), V(x, 3.5, 25), mLand)); const c = circle(x, 25, 0.8, 3.5, mLand); land.add(c); });
    // trees
    [[-30, 8], [30, 8], [-30, -6], [30, -6], [-14, 20], [14, 20]].forEach(([x, z]) => {
      land.add(seg(V(x, 0, z), V(x, 2.4, z), mGreen)); const c = circle(x, z, 1.6, 3, mGreen); land.add(c);
    });
    // retaining walls + site boundary
    land.add(seg(V(-34, 0.05, -22), V(34, 0.05, -22), mLand));
    land.add(seg(V(-34, 0.05, -22), V(-34, 0.05, 26), mLand));
    land.add(seg(V(34, 0.05, -22), V(34, 0.05, 26), mLand));
    // concentric plaza pattern at entrance
    [4, 8, 12].forEach((r) => land.add(circle(0, 22, r, 0.04, mLand)));
    // seating benches
    [-10, 10].forEach((x) => { const bp = []; boxPts(bp, 3, 0.6, 0.5, x, 0.05, 21); land.add(batch(bp, mLand)); });
    // drainage channels (dashed)
    for (let z = 15; z <= 21; z += 3) land.add(seg(V(-26, 0.06, z), V(26, 0.06, z), mHidden));
    // underground-service indicator
    land.add(seg(V(-20, 0.05, -18), V(20, 0.05, -18), mHidden));
    // covered walkway pergola along south drop-off
    for (let x = -24; x <= 24; x += 4) land.add(seg(V(x, 3, 25), V(x, 3.4, 25), mLand));
    for (let z = 24; z <= 26; z += 2) land.add(seg(V(-24, 3.2, z), V(24, 3.2, z), mLand));
    scene.add(land);

    // ---------- PERSISTENT DRAFTING GRID ----------
    const draft = new THREE.Group();
    GX.forEach((x) => draft.add(seg(V(x, 0.05, -18), V(x, 0.05, 16), mDraft)));
    GZ.forEach((z) => draft.add(seg(V(-30, 0.05, z), V(30, 0.05, z), mDraft)));
    GX.forEach((x) => { const c1 = circle(x, -19, 1.1, 0.05, mDraft); draft.add(c1); const c2 = circle(x, 17, 1.1, 0.05, mDraft); draft.add(c2); });
    GZ.forEach((z) => { const c1 = circle(-31, z, 1.1, 0.05, mDraft); draft.add(c1); const c2 = circle(31, z, 1.1, 0.05, mDraft); draft.add(c2); });
    // level ruler west
    draft.add(seg(V(-29, 0.05, -14), V(-29, ROOF_H, -14), mDraft));
    for (let f = 1; f <= 5; f++) { draft.add(seg(V(-29, f * FH, -14), V(-27, f * FH, -14), mDraft)); draft.add(circle(-29, -14, 0.9, f * FH, mDraft)); }
    // dimension line front
    draft.add(seg(V(-26, 0.12, -16), V(22, 0.12, -16), mDraft));
    GX.forEach((x) => draft.add(seg(V(x, 0.12, -16), V(x, 0.12, -17), mDraft)));
    scene.add(draft);

    // ---------- DRAWING CALLOUTS / TAGS ----------
    const mCall = t(mat(BLUE, 0.25));
    const callouts = new THREE.Group();
    // elevation tags on wing faces
    [[-18, 10, 9], [18, 10, -13], [0, 10, -17]].forEach(([x, y, z]) => { callouts.add(circle(x, z, 1, y, mCall)); callouts.add(seg(V(x, y, z), V(x, y - 2, z), mCall)); });
    // detail callout bubbles pointing to joints
    [[-24, 7.2, 14], [24, 10.8, -14], [0, 18, -6]].forEach(([x, y, z]) => { callouts.add(circle(x, z, 1.2, y, mCall)); callouts.add(seg(V(x, y, z), V(x + 2, y + 2, z), mCall)); });
    // section triangles on ground
    [[-10, -18], [10, -18]].forEach(([x, z]) => { callouts.add(seg(V(x, 0.06, z), V(x - 1, 0.06, z + 1.5), mCall)); callouts.add(seg(V(x, 0.06, z), V(x + 1, 0.06, z + 1.5), mCall)); callouts.add(seg(V(x - 1, 0.06, z + 1.5), V(x + 1, 0.06, z + 1.5), mCall)); });
    scene.add(callouts);

    // ---------- BIM COORDINATION CLASH MARKERS ----------
    const mCoord = t(mat(AMBER, 0));
    const coord = new THREE.Group();
    [[-4, 8, 0], [4, 8, 0], [0, 12, 0], [-6, 9, 3], [6, 9, -3], [0, 14.4, 0], [-3, 10, -2], [3, 10, 2]].forEach(([x, y, z]) => {
      coord.add(seg(V(x - 0.6, y, z), V(x + 0.6, y, z), mCoord));
      coord.add(seg(V(x, y, z - 0.6), V(x, y, z + 0.6), mCoord));
      coord.add(circle(x, z, 0.8, y, mCoord));
    });
    scene.add(coord);

    // ---------- BLUEPRINT / CONCEPT ----------
    const blueprint = new THREE.Group();
    mass.forEach(([w, d, y0, y1, cx, cz]) => { const g = edge(new THREE.BoxGeometry(w, y1 - y0, d), mBlueprint); g.position.set(cx, (y0 + y1) / 2, cz); blueprint.add(g); });
    cores.forEach(({ cx, cz }) => { const g = edge(new THREE.BoxGeometry(4, ROOF_H, 4), mBlueprint); g.position.set(cx, ROOF_H / 2, cz); blueprint.add(g); });
    const secLine = seg(V(0, 0.06, -18), V(0, 0.06, 16), mBlueprint); blueprint.add(secLine);
    scene.add(blueprint);

    // ---------- FOUNDATIONS / CIVIL (below ground) ----------
    const found = new THREE.Group();
    // raft grid
    const raftPts = []; boxPts(raftPts, 52, 28, 0.4, 0, -0.5, 0); found.add(batch(raftPts, mFound));
    for (let x = -24; x <= 24; x += 8) found.add(seg(V(x, -0.5, -13), V(x, -0.5, 13), mFound));
    for (let z = -12; z <= 12; z += 8) found.add(seg(V(-25, -0.5, z), V(25, -0.5, z), mFound));
    // piles + pile caps at grid intersections
    GX.forEach((x) => GZ.forEach((z) => {
      found.add(seg(V(x, -7, z), V(x, -0.5, z), mFound));
      const cp = []; boxPts(cp, 2.4, 2.4, 0.4, x, -0.7, z); found.add(batch(cp, mFound));
    }));
    // retaining walls
    [[-27, -14], [27, -14]].forEach(([x, z]) => found.add(seg(V(x, -6, z), V(x, 0, z), mFound)));
    found.add(seg(V(-27, -6, -14), V(27, -6, -14), mFound));
    // underground utilities
    found.add(seg(V(-26, -1.5, -10), V(26, -1.5, 10), mFoundSec));
    found.add(seg(V(-26, -1.5, 10), V(26, -1.5, -10), mFoundSec));
    scene.add(found);

    // ---------- STRUCTURE ----------
    const structure = new THREE.Group();
    // columns at grid (full height where wings exist)
    const colPts = [];
    GX.forEach((x) => GZ.forEach((z) => { if (Math.abs(x) <= 26) colPts.push(V(x, 0, z), V(x, ROOF_H, z)); }));
    structure.add(batch(colPts, mStruct));
    // beams per floor
    const beamPts = [];
    for (let f = 1; f <= 5; f++) { const y = f * FH; GX.forEach((x) => beamPts.push(V(x, y, -14), V(x, y, 14))); GZ.forEach((z) => beamPts.push(V(-26, y, z), V(26, y, z))); }
    structure.add(batch(beamPts, mStruct));
    // transfer beams (heavier, long-span under upper wings)
    [-18, 18].forEach((cx) => { for (let z = -10; z <= 6; z += 8) structure.add(seg(V(cx - 7, 7.2, z), V(cx + 7, 7.2, z), mStruct)); });
    // slabs + volume outlines per mass
    mass.forEach(([w, d, y0, y1, cx, cz]) => {
      for (let y = Math.ceil(y0 / FH) * FH; y <= y1 + 0.01; y += FH) { const s = edge(new THREE.BoxGeometry(w, 0.18, d), mStruct); s.position.set(cx, y, cz); structure.add(s); }
      const v = edge(new THREE.BoxGeometry(w, y1 - y0, d), mStruct); v.position.set(cx, (y0 + y1) / 2, cz); structure.add(v);
    });
    // cores (concrete) with stair zigzag
    cores.forEach(({ cx, cz }) => {
      const c = edge(new THREE.BoxGeometry(4, ROOF_H, 4), mStruct); c.position.set(cx, ROOF_H / 2, cz); structure.add(c);
      let zp = cz - 1.5; for (let y = 0; y < ROOF_H - 0.5; y += 1.2) { structure.add(seg(V(cx - 1.5, y, zp), V(cx + 1.5, y + 1.2, zp), mStruct)); }
    });
    // cantilever struts under cantilever box
    [-10, -6].forEach((x) => structure.add(seg(V(x, 7.2, 5), V(x, 10.8, 2), mStruct)));
    // X bracing in east wing bays
    [[22, 14], [22, -14]].forEach(([x, z]) => structure.add(batch([V(x, 7.2, z), V(x, 14.4, z - 8), V(x, 7.2, z - 8), V(x, 14.4, z)], mStruct)));
    // atrium roof trusses (triangular)
    for (let x = -8; x <= 8; x += 4) {
      structure.add(seg(V(x, 18, -6), V(x, 19.4, 0), mStruct));
      structure.add(seg(V(x, 18, 6), V(x, 19.4, 0), mStruct));
      structure.add(seg(V(x, 18, -6), V(x, 18, 6), mStruct));
    }
    structure.add(seg(V(-8, 19.4, 0), V(8, 19.4, 0), mStruct));
    // secondary steel framing in atrium
    for (let z = -4; z <= 4; z += 2) { structure.add(seg(V(-6, 12, z), V(6, 12, z), mArch)); structure.add(seg(V(-6, 14.4, z), V(6, 14.4, z), mArch)); }
    // connection nodes at column-beam joints
    const nodePts = [];
    for (let f = 1; f <= 5; f++) { const y = f * FH; GX.forEach((x) => GZ.forEach((z) => { if (Math.abs(x) <= 22) { nodePts.push(V(x - 0.4, y, z), V(x + 0.4, y, z), V(x, y, z - 0.4), V(x, y, z + 0.4)); } })); }
    structure.add(batch(nodePts, mArch));
    // façade support brackets along podium edges
    const brkPts = []; for (let x = -24; x <= 24; x += 4) { brkPts.push(V(x, 7.2, 14), V(x, 7.4, 14.6), V(x, 7.2, -14), V(x, 7.4, -14.6)); }
    structure.add(batch(brkPts, mArch));
    // expansion joint (dashed)
    structure.add(seg(V(0, 3.7, -14), V(0, 3.7, 14), mHidden));
    scene.add(structure);

    // ---------- SIGNATURE DIAGONAL FRAME (visual thread) ----------
    const diag = new THREE.Group();
    const dChord = (x) => [V(x, 2, 10), V(x, 18, -6)];
    [-6, 6].forEach((x) => { const [a, b] = dChord(x); diag.add(seg(a, b, mDiag)); });
    // web members (horizontals + crosses)
    [0.2, 0.4, 0.6, 0.8].forEach((u) => {
      const y = 2 + 16 * u, z = 10 - 16 * u;
      diag.add(seg(V(-6, y, z), V(6, y, z), mDiag));
    });
    [0.1, 0.3, 0.5, 0.7, 0.9].forEach((u) => {
      const y1 = 2 + 16 * u, z1 = 10 - 16 * u; const y2 = 2 + 16 * (u + 0.2), z2 = 10 - 16 * (u + 0.2);
      diag.add(seg(V(-6, y1, z1), V(6, y2, z2), mDiag));
      diag.add(seg(V(6, y1, z1), V(-6, y2, z2), mDiag));
    });
    // base columns at entrance + top tie to roof
    [-6, 6].forEach((x) => { diag.add(seg(V(x, 0, 10), V(x, 2, 10), mDiag)); diag.add(seg(V(x, 18, -6), V(x, 18, 6), mDiag)); });
    diag.add(seg(V(-6, 2, 10), V(6, 2, 10), mDiag));
    scene.add(diag);

    // ---------- FAÇADE (varied per zone) ----------
    const facade = new THREE.Group();
    const finPts = [], archPts = [], scrPts = [];
    mass.forEach(([w, d, y0, y1, cx, cz, zone]) => {
      const h = y1 - y0; const cy = (y0 + y1) / 2;
      const gm = new THREE.Mesh(new THREE.BoxGeometry(w - 0.3, h - 0.3, d - 0.3), mGlass); gm.position.set(cx, cy, cz); facade.add(gm);
      const mx = cx - w / 2, Mx = cx + w / 2, mz = cz - d / 2, Mz = cz + d / 2;
      if (zone === "podium") {
        // precast concrete panels: coarse rectangular grid on long faces
        for (let x = mx; x <= Mx; x += 8) { finPts.push(V(x, y0, Mz), V(x, y1, Mz), V(x, y0, mz), V(x, y1, mz)); }
        for (let yy = y0; yy <= y1; yy += 3.6) { finPts.push(V(mx, yy, Mz), V(Mx, yy, Mz), V(mx, yy, mz), V(Mx, yy, mz)); }
      } else if (zone === "west") {
        // vertical aluminum fins (dense) on long faces
        for (let x = mx; x <= Mx; x += 1.5) { finPts.push(V(x, y0, Mz), V(x, y1, Mz), V(x, y0, mz), V(x, y1, mz)); }
      } else if (zone === "east") {
        // horizontal shading blades on long faces
        for (let yy = y0; yy <= y1; yy += 1.2) { finPts.push(V(mx, yy, Mz), V(Mx, yy, Mz), V(mx, yy, mz), V(Mx, yy, mz)); }
      } else if (zone === "pavilion") {
        // mashrabiya diagonal screen on faces
        for (let x = mx; x <= Mx; x += 2) for (let yy = y0; yy <= y1; yy += 2) { scrPts.push(V(x, yy, Mz), V(x + 2, yy + 2, Mz), V(x, yy + 2, Mz), V(x + 2, yy, Mz)); }
      } else if (zone === "annex") {
        for (let x = mx; x <= Mx; x += 6) { finPts.push(V(x, y0, Mz), V(x, y1, Mz), V(x, y0, mz), V(x, y1, mz)); }
        for (let yy = y0; yy <= y1; yy += 1.8) { finPts.push(V(mx, yy, Mz), V(Mx, yy, Mz), V(mx, yy, mz), V(Mx, yy, mz)); }
      } else if (zone === "terrace") {
        for (let yy = y0; yy <= y1; yy += 1.2) { finPts.push(V(mx, yy, Mz), V(Mx, yy, Mz), V(mx, yy, mz), V(Mx, yy, mz)); }
        for (let x = mx; x <= Mx; x += 4) { archPts.push(V(x, y1, Mz + 0.4), V(x, y1 + 0.6, Mz + 0.4)); }
      } else {
        // curtain-wall mullion grid (lobby, cantilever)
        for (let x = mx; x <= Mx; x += 3) { finPts.push(V(x, y0, Mz), V(x, y1, Mz), V(x, y0, mz), V(x, y1, mz)); }
        for (let yy = y0; yy <= y1; yy += FH / 2) { finPts.push(V(mx, yy, Mz), V(Mx, yy, Mz), V(mx, yy, mz), V(Mx, yy, mz)); }
      }
    });
    // atrium curtain wall enclosure
    const aw = 12, ad = 10, ax = 0, az = 0;
    const agm = new THREE.Mesh(new THREE.BoxGeometry(aw, ROOF_H, ad), mGlass); agm.position.set(ax, ROOF_H / 2, az); facade.add(agm);
    for (let x = -6; x <= 6; x += 3) { finPts.push(V(x, 0, 5), V(x, ROOF_H, 5), V(x, 0, -5), V(x, ROOF_H, -5)); }
    for (let yy = 0; yy <= ROOF_H; yy += FH / 2) { finPts.push(V(-6, yy, 5), V(6, yy, 5), V(-6, yy, -5), V(6, yy, -5), V(5, yy, -5), V(5, yy, 5), V(-5, yy, -5), V(-5, yy, 5)); }
    facade.add(batch(finPts, mFins));
    facade.add(batch(archPts, mArch));
    facade.add(batch(scrPts, mScreen));
    scene.add(facade);

    // ---------- MEP / BIM (color-coded systems) ----------
    const mep = new THREE.Group();
    // mechanical ducts (rings + horizontal runs) — steel
    [4, 8, 12].forEach((y) => { const pts = []; for (let i = 0; i <= 32; i++) { const a = (i / 32) * Math.PI * 2; pts.push(V(Math.cos(a) * 5, y, Math.sin(a) * 4)); } mep.add(loop(pts, mMech)); });
    for (let i = 0; i < 4; i++) mep.add(seg(V(-6, 9 + i * 0.5, -2), V(6, 9 + i * 0.5, 2), mMech));
    // electrical cable trays + busway — blue
    for (let y = 5; y <= 15; y += 5) mep.add(seg(V(-10, y, 0), V(10, y, 0), mElec));
    mep.add(seg(V(-10, 0, 0), V(-10, ROOF_H, 0), mElec));
    // plumbing risers + domestic — sky
    [[-4, -4], [4, 4]].forEach(([x, z]) => mep.add(seg(V(x, 0, z), V(x, ROOF_H, z), mPlumb)));
    // firefighting pipes — amber
    [[-8, 8], [8, -8]].forEach(([x, z]) => mep.add(seg(V(x, 0, z), V(x, ROOF_H, z), mFire)));
    for (let y = 3; y <= 15; y += 4) mep.add(seg(V(-8, y, 8), V(8, y, -8), mFire));
    // plant room outline (roof)
    const prPts = []; boxPts(prPts, 6, 4, 1.2, 14, ROOF_H + 0.5, -12); mep.add(batch(prPts, mMech));
    // branch ductwork
    for (let i = 0; i < 6; i++) mep.add(seg(V(-6, 8 + i * 0.3, -2), V(-6, 8 + i * 0.3, 4), mMech));
    // ceiling coordination grid
    for (let x = -6; x <= 6; x += 2) mep.add(seg(V(x, 7, -6), V(x, 7, 6), mElec));
    for (let z = -6; z <= 6; z += 2) mep.add(seg(V(-6, 7, z), V(6, 7, z), mElec));
    // drainage stacks
    [[-10, -10], [10, 10]].forEach(([x, z]) => mep.add(seg(V(x, 0, z), V(x, ROOF_H, z), mPlumb)));
    // rooftop AHU + cable tray ladder
    const ahuPts = []; boxPts(ahuPts, 4, 3, 1.5, -20, ROOF_H + 0.6, 8); mep.add(batch(ahuPts, mMech));
    for (let z = -6; z <= 6; z += 1) mep.add(seg(V(-12, 10, z), V(12, 10, z), mElec));
    // FCU units under ceilings
    [[-4, 7.2, 4], [4, 7.2, -4], [-4, 7.2, -4]].forEach(([x, y, z]) => { const fp = []; boxPts(fp, 1.5, 0.6, 1, x, y - 0.8, z); mep.add(batch(fp, mMech)); });
    // electrical room + pump room outlines
    const erPts = []; boxPts(erPts, 5, 4, 2.4, 20, 1.2, -12); mep.add(batch(erPts, mElec));
    const pmPts = []; boxPts(pmPts, 4, 3, 2.4, -22, 1.2, 10); mep.add(batch(pmPts, mPlumb));

    // ---------- DETAILED INSTALLED ITEMS (BIM population) ----------
    const dense = !mobile;
    const mechBranch = [], elecRung = [], fireHead = [], plumbBranch = [];
    for (let f = 0; f < 5; f++) {
      const cy = f * FH + 3.2, fy = f * FH + 1.0;
      // MECHANICAL — trunk ducts, branches, diffusers, FCUs, chilled water
      [-4, 4].forEach((z) => {
        mep.add(seg(V(-20, cy, z), V(20, cy, z), mMech));
        if (dense) for (let x = -18; x <= 18; x += 4) mechBranch.push(V(x, cy, z), V(x, cy - 0.4, z));
      });
      if (dense) for (let x = -16; x <= 16; x += 4) [-4, 4].forEach((z) => { const dp = []; boxPts(dp, 0.7, 0.7, 0.08, x, cy + 0.1, z); mep.add(batch(dp, mMech)); });
      mep.add(seg(V(-18, cy - 0.2, 0), V(18, cy - 0.2, 0), mMech));
      mep.add(seg(V(-18, cy - 0.3, 0.3), V(18, cy - 0.3, 0.3), mMech));
      [-10, 10].forEach((x) => { const fp = []; boxPts(fp, 1.4, 0.6, 0.8, x, cy - 0.5, 0); mep.add(batch(fp, mMech)); });
      // ELECTRICAL — cable tray ladders, lighting, panels
      [-8, 8].forEach((z) => {
        mep.add(seg(V(-18, cy + 0.1, z - 0.2), V(18, cy + 0.1, z - 0.2), mElec));
        mep.add(seg(V(-18, cy + 0.1, z + 0.2), V(18, cy + 0.1, z + 0.2), mElec));
        if (dense) for (let x = -18; x <= 18; x += 2) elecRung.push(V(x, cy + 0.1, z - 0.2), V(x, cy + 0.1, z + 0.2));
      });
      if (dense) for (let x = -16; x <= 16; x += 6) [-4, 4].forEach((z) => { const lp = []; boxPts(lp, 1.5, 0.08, 0.5, x, cy + 0.18, z); mep.add(batch(lp, mElec)); });
      [-22, 22].forEach((x) => { const pp = []; boxPts(pp, 1, 0.5, 1.6, x, fy + 0.8, x < 0 ? 12 : -12); mep.add(batch(pp, mElec)); });
      // FIRE — sprinkler branch lines + heads
      for (let z = -8; z <= 8; z += 4) mep.add(seg(V(-22, cy + 0.2, z), V(22, cy + 0.2, z), mFire));
      if (dense) for (let z = -8; z <= 8; z += 4) for (let x = -18; x <= 18; x += 4) fireHead.push(V(x, cy + 0.2, z), V(x, cy - 0.25, z));
      // PLUMBING — water distribution + sanitary branches
      mep.add(seg(V(-22, cy - 0.15, 12), V(22, cy - 0.15, 12), mPlumb));
      mep.add(seg(V(-22, cy - 0.15, -12), V(22, cy - 0.15, -12), mPlumb));
      if (dense) for (let x = -20; x <= 20; x += 6) plumbBranch.push(V(x, cy - 0.15, 12), V(x, cy - 0.15, 8), V(x, cy - 0.15, -12), V(x, cy - 0.15, -8));
    }
    if (mechBranch.length) mep.add(batch(mechBranch, mMech));
    if (elecRung.length) mep.add(batch(elecRung, mElec));
    if (fireHead.length) mep.add(batch(fireHead, mFire));
    if (plumbBranch.length) mep.add(batch(plumbBranch, mPlumb));
    // vertical risers — mech shaft, elect busway, plumbing stacks, fire main
    mep.add(seg(V(-20, 0, -10), V(-20, ROOF_H, -10), mMech));
    mep.add(seg(V(20, 0, 0), V(20, ROOF_H, 0), mElec));
    [[-22, 12], [22, -12]].forEach(([x, z]) => mep.add(seg(V(x, 0, z), V(x, ROOF_H, z), mPlumb)));
    [[-24, 10], [24, -10]].forEach(([x, z]) => mep.add(seg(V(x, 0, z), V(x, ROOF_H, z), mPlumb)));
    mep.add(seg(V(0, 0, -12), V(0, ROOF_H, -12), mFire));
    // valves on fire main + fire pump room + tank
    for (let f = 1; f <= 4; f++) { const y = f * FH; mep.add(seg(V(-0.5, y, -12), V(0.5, y, -12), mFire)); mep.add(seg(V(0, y, -12.5), V(0, y, -11.5), mFire)); }
    const fprPts = []; boxPts(fprPts, 4, 3, 2.4, 14, 1.2, -12); mep.add(batch(fprPts, mFire));
    const tankPts = []; boxPts(tankPts, 3, 2, 1.8, 10, 0.9, -12); mep.add(batch(tankPts, mFire));

    // ---------- SOLID COLOR-CODED MEP RUNS (ducts / pipes / conduits) ----------
    const mepSolid = new THREE.Group();
    for (let f = 0; f < 5; f++) {
      const cy = f * FH + 3.2;
      // mechanical — main supply/return ducts (large) + chilled-water pipes
      [-4, 4].forEach((z) => mepSolid.add(tube(V(-20, cy, z), V(20, cy, z), 0.32, mMechM)));
      mepSolid.add(tube(V(-18, cy - 0.2, 0), V(18, cy - 0.2, 0), 0.12, mMechM));
      mepSolid.add(tube(V(-18, cy - 0.3, 0.3), V(18, cy - 0.3, 0.3), 0.12, mMechM));
      // electrical — conduit runs
      mepSolid.add(tube(V(-18, cy + 0.05, 8), V(18, cy + 0.05, 8), 0.1, mElecM));
      mepSolid.add(tube(V(-18, cy + 0.05, -8), V(18, cy + 0.05, -8), 0.1, mElecM));
      // plumbing — domestic water distribution
      mepSolid.add(tube(V(-22, cy - 0.15, 12), V(22, cy - 0.15, 12), 0.13, mPlumbM));
      mepSolid.add(tube(V(-22, cy - 0.15, -12), V(22, cy - 0.15, -12), 0.13, mPlumbM));
      // fire — sprinkler branch lines
      for (let z = -8; z <= 8; z += 4) mepSolid.add(tube(V(-22, cy + 0.2, z), V(22, cy + 0.2, z), 0.06, mFireM));
    }
    // vertical risers
    mepSolid.add(tube(V(-20, 0, -10), V(-20, ROOF_H, -10), 0.3, mMechM));   // mechanical shaft
    mepSolid.add(tube(V(20, 0, 0), V(20, ROOF_H, 0), 0.12, mElecM));         // electrical busway
    [[-22, 12], [22, -12], [-24, 10], [24, -10]].forEach(([x, z]) => mepSolid.add(tube(V(x, 0, z), V(x, ROOF_H, z), 0.14, mPlumbM))); // plumbing risers
    mepSolid.add(tube(V(0, 0, -12), V(0, ROOF_H, -12), 0.14, mFireM));       // fire main
    scene.add(mepSolid);
    scene.add(mep);

    // ---------- EXPLODED FLOOR PLATES (MEP) ----------
    const exploded = new THREE.Group(); const explSlabs = [];
    mass.forEach(([w, d, y0, y1, cx, cz], idx) => {
      for (let y = Math.ceil(y0 / FH) * FH; y <= y1 + 0.01; y += FH) { const s = edge(new THREE.BoxGeometry(w, 0.18, d), mExplode); s.position.set(cx, y, cz); exploded.add(s); explSlabs.push({ mesh: s, baseY: y, idx: idx + 1 }); }
    });
    scene.add(exploded);

    // ---------- INTERIOR / FIT-OUT ----------
    const interior = new THREE.Group();
    // atrium void edges + feature staircase (zigzag)
    const atr = edge(new THREE.BoxGeometry(aw, ROOF_H, ad), mInterior); atr.position.set(0, ROOF_H / 2, 0); interior.add(atr);
    // feature staircase zigzag
    let sx = -5, sy = 0; for (let i = 0; i < 12; i++) { interior.add(seg(V(sx, sy, 0), V(sx + 0.8, sy + 1.5, 0), mInterior)); sx += 0.8; sy += 1.5; if (sx > 5) { sx = -5; } }
    // bridges across atrium
    [10.8, 14.4].forEach((y) => { const b = edge(new THREE.BoxGeometry(20, 0.3, 3), mInterior); b.position.set(0, y, 0); interior.add(b); });
    // lobby ceiling grid + reception
    for (let x = -6; x <= 6; x += 2) interior.add(seg(V(x, 6.8, 8), V(x, 6.8, 14), mInterior));
    for (let z = 8; z <= 14; z += 2) interior.add(seg(V(-6, 6.8, z), V(6, 6.8, z), mInterior));
    const rec = edge(new THREE.BoxGeometry(6, 1.2, 1.2), mInterior); rec.position.set(0, 1.2, 9); interior.add(rec);
    // suspended lighting rings
    [9, 13].forEach((y) => { const c = circle(0, 0, 3, y, mInterior); interior.add(c); });
    // meeting room boxes (visible through atrium)
    [[-4, 11], [4, 11], [-4, 13.5]].forEach(([x, y]) => { const m = edge(new THREE.BoxGeometry(3, 2.4, 3), mInterior); m.position.set(x, y, 3); interior.add(m); });
    scene.add(interior);

    // ---------- ROOF / CROWN ----------
    const crown = new THREE.Group();
    // angled canopy over pavilion (tilted grid)
    const canopyPts = [];
    for (let i = 0; i < 6; i++) canopyPts.push(V(-8 + i * 3, ROOF_H + 2 + i * 0.4, -12), V(-8 + i * 3, ROOF_H + 2 + i * 0.4, -4));
    for (let i = 0; i < 4; i++) canopyPts.push(V(-8, ROOF_H + 2 + i * 0.4, -12 + i * 2.7), V(7, ROOF_H + 2 + i * 0.4, -12 + i * 2.7));
    crown.add(batch(canopyPts, mCrown));
    // skylight grid over atrium
    for (let x = -6; x <= 6; x += 3) crown.add(seg(V(x, ROOF_H + 0.6, -5), V(x, ROOF_H + 0.6, 5), mCrown));
    for (let z = -5; z <= 5; z += 3) crown.add(seg(V(-6, ROOF_H + 0.6, z), V(6, ROOF_H + 0.6, z), mCrown));
    // solar panels (tilted strips on east wing roof)
    for (let x = 12; x <= 24; x += 3) crown.add(seg(V(x, 14.6, -10), V(x, 15.4, -2), mCrown));
    // rooftop garden planters + pergola
    for (let x = -16; x <= -8; x += 4) { const c = circle(x, -6, 1.4, ROOF_H + 0.3, mGreen); crown.add(c); }
    for (let x = -20; x <= -10; x += 3) crown.add(seg(V(x, ROOF_H + 0.4, -12), V(x, ROOF_H + 1.4, -12), mCrown));
    crown.add(seg(V(-20, ROOF_H + 1.4, -12), V(-10, ROOF_H + 1.4, -12), mCrown));
    // mechanical screen louvers
    for (let z = -11; z <= -5; z += 1.5) crown.add(seg(V(12, ROOF_H + 0.3, z), V(16, ROOF_H + 0.3, z), mCrown));
    // roof edge band
    const rbPts = []; boxPts(rbPts, 52, 28, 0.25, 0, ROOF_H + 0.15, 0); crown.add(batch(rbPts, mCrown));
    scene.add(crown);

    // ---------- COMPLETION GLOW ----------
    const glow = new THREE.Group();
    [-6, 6].forEach((x) => { glow.add(seg(V(x, 0, 10), V(x, 2, 10), mGlow)); glow.add(seg(V(x, 2, 10), V(x, 18, -6), mGlow)); });
    glow.add(seg(V(-6, 18, -6), V(6, 18, -6), mGlow));
    scene.add(glow);

    // ---------- PARTICLES ----------
    const N = mobile ? 80 : 160;
    const partGeo = new THREE.BufferGeometry();
    const partPos = new Float32Array(N * 3);
    for (let i = 0; i < N; i++) { partPos[i * 3] = (Math.random() - 0.5) * 110; partPos[i * 3 + 1] = Math.random() * ROOF_H * 1.7; partPos[i * 3 + 2] = (Math.random() - 0.5) * 110; }
    partGeo.setAttribute("position", new THREE.BufferAttribute(partPos, 3));
    const partMat = t(new THREE.PointsMaterial({ color: 0x8fb8dc, size: 0.22, transparent: true, opacity: 0.4, fog: true, sizeAttenuation: true }));
    scene.add(new THREE.Points(partGeo, partMat));

    // ---------- CAMERA: 10 BIM stages ----------
    const kf = [
      { p: V(30, 16, 60), l: V(0, 8, 0) },    // S1 integrated BIM model
      { p: V(6, 14, 40), l: V(0, 8, 0) },     // S2 architecture
      { p: V(44, 7, 22), l: V(0, 9, 0) },     // S3 structure
      { p: V(10, 14, 30), l: V(0, 9, 0) },    // S4 mechanical
      { p: V(-12, 14, 30), l: V(0, 9, 0) },   // S5 electrical
      { p: V(6, 10, 36), l: V(0, 9, 0) },     // S6 plumbing / fire
      { p: V(24, 18, 40), l: V(0, 9, 0) },    // S7 coordinated MEP
      { p: V(0, 4, 8), l: V(0, 9, -6) },      // S8 interior / fit-out
      { p: V(18, 28, 22), l: V(0, 16, -6) },  // S9 roof / plant
      { p: V(0, 16, 72), l: V(0, 8, 0) },     // S10 completed twin
    ];
    const ST = 1 / 10;
    const smooth = (x) => x * x * (3 - 2 * x);

    let p = 0; let t0 = performance.now();
    const update = () => {
      const tt = (performance.now() - t0) / 1000;
      const bIntro = 1 - fade(p, 0, ST);
      const bArch = bump(p, 1.5 * ST, 0.05), bStruct = bump(p, 2.5 * ST, 0.05), bMech = bump(p, 3.5 * ST, 0.05),
        bElec = bump(p, 4.5 * ST, 0.05), bPlumb = bump(p, 5.5 * ST, 0.05), bCoord = bump(p, 6.5 * ST, 0.05),
        bInterior = bump(p, 7.5 * ST, 0.05), bRoof = bump(p, 8.5 * ST, 0.05), bComplete = bump(p, 1 - 0.01, 0.05);

      mBlueprint.opacity = 0.1 + 0.8 * bArch + 0.15 * bIntro;
      mFound.opacity = 0.4 * bIntro + 0.75 * bStruct; mFoundSec.opacity = 0.3 * bIntro + 0.5 * bStruct;
      mStruct.opacity = (0.4 * bIntro + 0.95 * bStruct + 0.5 * bCoord + 0.25 * bComplete) * (1 - 0.4 * bArch) * (1 - 0.5 * bMech) * (1 - 0.5 * bElec) * (1 - 0.5 * bPlumb) * (1 - 0.3 * bInterior);
      mDiag.opacity = 0.25 + 0.45 * bStruct + 0.3 * bRoof + 0.25 * bComplete + 0.2 * bIntro + 0.2 * bCoord;
      mFins.opacity = (0.3 * bIntro + 0.85 * bArch + 0.35 * bCoord + 0.15 * bComplete) * (1 - 0.5 * bStruct) * (1 - 0.5 * bMech) * (1 - 0.5 * bElec) * (1 - 0.5 * bPlumb);
      mArch.opacity = (0.3 * bIntro + 0.85 * bArch + 0.35 * bCoord + 0.15 * bComplete) * (1 - 0.4 * bStruct) * (1 - 0.5 * bMech) * (1 - 0.5 * bElec) * (1 - 0.5 * bPlumb);
      mScreen.opacity = (0.25 * bIntro + 0.8 * bArch + 0.3 * bCoord + 0.12 * bComplete) * (1 - 0.4 * bStruct) * (1 - 0.5 * bMech) * (1 - 0.5 * bElec) * (1 - 0.5 * bPlumb);
      mGlass.opacity = (0.18 * bIntro + 0.5 * bArch + 0.2 * bCoord + 0.18 * bComplete) * (1 - 0.55 * bStruct) * (1 - 0.6 * bMech) * (1 - 0.6 * bElec) * (1 - 0.6 * bPlumb) * (1 - 0.4 * bInterior);
      mMech.opacity = Math.min(1, 0.2 * bIntro + 0.95 * bMech + 0.55 * bCoord + 0.25 * bComplete) * (1 - 0.8 * bElec) * (1 - 0.8 * bPlumb);
      mElec.opacity = Math.min(1, 0.18 * bIntro + 0.95 * bElec + 0.5 * bCoord + 0.22 * bComplete) * (1 - 0.8 * bMech) * (1 - 0.8 * bPlumb);
      mPlumb.opacity = Math.min(1, 0.18 * bIntro + 0.92 * bPlumb + 0.5 * bCoord + 0.22 * bComplete) * (1 - 0.8 * bMech) * (1 - 0.8 * bElec);
      mFire.opacity = Math.min(1, 0.18 * bIntro + 0.92 * bPlumb + 0.5 * bCoord + 0.22 * bComplete) * (1 - 0.8 * bMech) * (1 - 0.8 * bElec);
      mMechM.opacity = mMech.opacity; mElecM.opacity = mElec.opacity; mPlumbM.opacity = mPlumb.opacity; mFireM.opacity = mFire.opacity;
      mInterior.opacity = 0.25 * bIntro + 0.9 * bInterior + 0.35 * bCoord + 0.15 * bComplete;
      mCrown.opacity = 0.35 * bIntro + 0.9 * bRoof + 0.35 * bCoord + 0.3 * bComplete;
      mGlow.opacity = 0.85 * bComplete * (0.7 + 0.3 * Math.sin(tt * 2.2));
      partMat.opacity = 0.3 + 0.2 * bIntro + 0.15 * bCoord;
      mDraft.opacity = 0.12 + 0.25 * bArch + 0.25 * bStruct + 0.2 * bCoord + 0.1 * bIntro;
      mCall.opacity = Math.min(1, 0.3 * bArch + 0.3 * bStruct + 0.35 * bMech + 0.35 * bElec + 0.35 * bPlumb + 0.7 * bCoord + 0.2 * bInterior);
      mCoord.opacity = 0.9 * bCoord;
      mLand.opacity = 0.2 * bIntro + 0.3 * bArch + 0.15 * bComplete;
      mWater.opacity = 0.3 * bIntro + 0.3 * bArch; mGreen.opacity = 0.3 * bIntro + 0.3 * bArch + 0.2 * bRoof + 0.15 * bComplete;

      const ex = Math.min(1, Math.max(bMech, bElec, bPlumb) + 0.4 * bCoord); explSlabs.forEach((e) => { e.mesh.position.y = e.baseY + e.idx * 3.4 * ex; });
      mExplode.opacity = 0.9 * ex; exploded.visible = ex > 0.01;

      const pa = partGeo.attributes.position;
      for (let i = 0; i < N; i++) { pa.array[i * 3 + 1] += 0.012; if (pa.array[i * 3 + 1] > ROOF_H * 1.7) pa.array[i * 3 + 1] = 0; }
      pa.needsUpdate = true;

      const idx = Math.min(Math.floor(p / ST), 9);
      const localT = smooth(Math.max(0, Math.min(1, (p - idx * ST) / ST)));
      const j = Math.min(idx + 1, 9);
      const pos = new THREE.Vector3().lerpVectors(kf[idx].p, kf[j].p, idx === 9 ? 0 : localT);
      const look = new THREE.Vector3().lerpVectors(kf[idx].l, kf[j].l, idx === 9 ? 0 : localT);
      pos.x += Math.sin(tt * 0.3) * 1.2; pos.z += Math.cos(tt * 0.3) * 1.2;
      camera.position.copy(pos); camera.lookAt(look);
    };
    update();

    const unsub = progress ? progress.on("change", (v) => { p = v; }) : null;
    let raf;
    const tick = () => { update(); renderer.render(scene, camera); raf = requestAnimationFrame(tick); };
    tick();

    const onResize = () => { camera.aspect = mount.clientWidth / mount.clientHeight; camera.updateProjectionMatrix(); renderer.setSize(mount.clientWidth, mount.clientHeight); };
    window.addEventListener("resize", onResize);
    return () => {
      cancelAnimationFrame(raf); window.removeEventListener("resize", onResize); if (unsub) unsub();
      renderer.dispose(); if (renderer.domElement.parentNode === mount) mount.removeChild(renderer.domElement);
      scene.traverse((o) => { if (o.geometry) o.geometry.dispose(); }); tracked.forEach((m) => m.dispose());
    };
  }, [progress]);

  return (
    <div className="pointer-events-none fixed inset-0 z-[1]" aria-hidden>
      <div ref={mountRef} className="absolute inset-0" />
    </div>
  );
}