import React, { Suspense, useEffect, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { OrbitControls as ThreeOrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";
import { UNIQUE_SLOTS, STAGE_SLOTS, SLOTS } from "@/lib/modelAssets";

// Scroll-driven 3D engine.
// R3F owns only the Canvas + an imperative scene graph: lights, ground and
// every GLB model are added directly to the THREE.Scene via useThree, so R3F
// never runs applyProps on the loaded model's textures (the source of the
// "reading 'source'" crash). Models crossfade by scroll progress.

function slotOpacity(slot, p) {
  const idx = Math.max(0, Math.min(STAGE_SLOTS.length - 1, Math.floor(p)));
  const frac = Math.max(0, Math.min(1, p - idx));
  let op = 0;
  STAGE_SLOTS.forEach((s, i) => {
    if (s !== slot) return;
    const t = i === idx ? 1 - frac : i === idx + 1 ? frac : 0;
    if (t > op) op = t;
  });
  return op;
}

// Catmull-Rom spline sampling across the SLOTS camera/target arrays.
// Produces one continuous curved fly-through path (C1 continuity, no kinks
// at stage boundaries) instead of piecewise-linear segments.
function catmull(p0, p1, p2, p3, t) {
  const t2 = t * t, t3 = t2 * t;
  return 0.5 * (2 * p1 + (-p0 + p2) * t + (2 * p0 - 5 * p1 + 4 * p2 - p3) * t2 + (-p0 + 3 * p1 - 3 * p2 + p3) * t3);
}
function sampleField(field, idx, p) {
  const n = SLOTS.length;
  const i = Math.max(0, Math.min(n - 1, Math.floor(p)));
  const f = p - i;
  const at = (s) => SLOTS[Math.max(0, Math.min(n - 1, s))][field][idx];
  return catmull(at(i - 1), at(i), at(i + 1), at(i + 2), f);
}

function Controls({ progressRef }) {
  const { camera, gl } = useThree();
  const controlsRef = useRef(null);
  const interacting = useRef(false);
  const desiredPos = useRef(new THREE.Vector3(8, 6, 10));
  const desiredTarget = useRef(new THREE.Vector3(0, 1.3, 0));

  useEffect(() => {
    const controls = new ThreeOrbitControls(camera, gl.domElement);
    controls.enablePan = false;
    controls.enableDamping = true;
    controls.dampingFactor = 0.08;
    controls.minDistance = 4;
    controls.maxDistance = 26;
    controls.maxPolarAngle = Math.PI * 0.52;
    controls.target.set(0, 1.3, 0);
    const onStart = () => { interacting.current = true; };
    const onEnd = () => { interacting.current = false; };
    controls.addEventListener("start", onStart);
    controls.addEventListener("end", onEnd);
    controls.update();
    controlsRef.current = controls;
    return () => {
      controls.removeEventListener("start", onStart);
      controls.removeEventListener("end", onEnd);
      controls.dispose();
    };
  }, [camera, gl]);

  useFrame((state) => {
    const controls = controlsRef.current;
    if (!controls) return;
    if (!interacting.current) {
      const t = state.clock.elapsedTime;
      const p = Math.max(0, Math.min(SLOTS.length - 1, progressRef.current));
      // Spline path through every stage — smooth curve, no abrupt jumps.
      desiredPos.current.set(sampleField("camera", 0, p), sampleField("camera", 1, p), sampleField("camera", 2, p));
      desiredTarget.current.set(sampleField("target", 0, p), sampleField("target", 1, p), sampleField("target", 2, p));
      // subtle handheld drift for organic, cinematic motion
      desiredPos.current.x += Math.sin(t * 0.3 + 1.1) * 0.06;
      desiredPos.current.y += Math.sin(t * 0.42) * 0.05;
      desiredPos.current.z += Math.cos(t * 0.27 + 0.6) * 0.05;
      camera.position.lerp(desiredPos.current, 0.05);
      controls.target.lerp(desiredTarget.current, 0.05);
      // cinematic fov breathing
      const fov = 34 + Math.sin(p * 0.9) * 3;
      if (Math.abs(camera.fov - fov) > 0.05) {
        camera.fov += (fov - camera.fov) * 0.1;
        camera.updateProjectionMatrix();
      }
    }
    controls.update();
  });
  return null;
}

function Scene({ sources, progressRef, onStatus }) {
  const { scene } = useThree();
  const modelsRef = useRef({}); // slot -> { group, target, loaded }

  // Lights + ground (added once, imperatively — no R3F JSX light instances).
  useEffect(() => {
    scene.background = new THREE.Color(0x070a12);
    scene.fog = new THREE.Fog(0x070a12, 16, 42);

    const ambient = new THREE.AmbientLight(0x4a5a7a, 0.6);
    const key = new THREE.DirectionalLight(0xff9d52, 2.6);
    key.position.set(7, 11, 8);
    key.castShadow = true;
    key.shadow.mapSize.set(2048, 2048);
    key.shadow.bias = -0.0002;
    const rim = new THREE.DirectionalLight(0x38bdf8, 2.2);
    rim.position.set(-8, 6, -9);
    const fill = new THREE.DirectionalLight(0x9fb4d9, 0.7);
    fill.position.set(-4, 4, 6);
    const hemi = new THREE.HemisphereLight(0x223049, 0x05070c, 0.5);
    const lights = [ambient, key, rim, fill, hemi];
    lights.forEach((l) => scene.add(l));

    const ground = new THREE.Mesh(
      new THREE.CircleGeometry(14, 64),
      new THREE.MeshStandardMaterial({ color: 0x0a0e17, roughness: 0.9, metalness: 0.1 })
    );
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -0.02;
    ground.receiveShadow = true;
    scene.add(ground);

    return () => {
      lights.forEach((l) => scene.remove(l));
      scene.remove(ground);
      ground.geometry.dispose();
      ground.material.dispose();
      scene.fog = null;
      scene.background = null;
    };
  }, [scene]);

  // Load every GLB for which we have a URL, normalize + insert into the scene.
  useEffect(() => {
    const isMobile = window.matchMedia("(max-width: 768px)").matches;
    const draco = new DRACOLoader();
    draco.setDecoderPath("https://www.gstatic.com/draco/v1/decoders/");
    const loader = new GLTFLoader();
    loader.setDRACOLoader(draco);

    UNIQUE_SLOTS.forEach((slot) => {
      const url = sources?.[slot];
      modelsRef.current[slot] = { group: null, target: 0, loaded: false };
      if (!url) {
        onStatus(slot, { state: "missing" });
        return;
      }
      loader.load(
        url,
        (gltf) => {
          const obj = gltf.scene;
          const box = new THREE.Box3().setFromObject(obj);
          const size = box.getSize(new THREE.Vector3());
          const center = box.getCenter(new THREE.Vector3());
          const maxDim = Math.max(size.x, size.y, size.z) || 1;
          const scale = 3 / maxDim;
          obj.scale.setScalar(scale);
          obj.position.sub(center.multiplyScalar(scale));
          obj.position.y += (size.y * scale) / 2;
          obj.rotation.y = -0.6;
          obj.traverse((c) => {
            if (c.isMesh) {
              c.castShadow = true;
              c.receiveShadow = true;
              const mats = Array.isArray(c.material) ? c.material : [c.material];
              mats.forEach((m) => {
                if (!m) return;
                m.transparent = true;
                m.opacity = 0;
                m.depthWrite = false;
              });
            }
          });
          const wrapper = new THREE.Group();
          wrapper.add(obj);
          wrapper.position.x = isMobile ? 0 : 1.6;
          wrapper.visible = false;
          scene.add(wrapper);
          modelsRef.current[slot] = { group: wrapper, target: 0, loaded: true };
          onStatus(slot, { state: "ok" });
        },
        undefined,
        (err) => {
          console.error("GLB load failed:", slot, url, err);
          modelsRef.current[slot] = { group: null, target: 0, loaded: false };
          onStatus(slot, { state: "error", url, error: err?.message || String(err) });
        }
      );
    });

    return () => {
      Object.values(modelsRef.current).forEach((m) => {
        if (m.group) {
          scene.remove(m.group);
          m.group.traverse((c) => {
            if (c.geometry) c.geometry.dispose();
            if (c.material) {
              const mats = Array.isArray(c.material) ? c.material : [c.material];
              mats.forEach((mm) => mm && mm.dispose && mm.dispose());
            }
          });
        }
      });
      modelsRef.current = {};
      draco.dispose();
    };
  }, [sources, scene, onStatus]);

  // Crossfade model opacity by scroll progress.
  useFrame((state) => {
    const p = progressRef.current;
    const t = state.clock.elapsedTime;
    const frac = p - Math.floor(p);
    const trans = 1 - Math.abs(frac - 0.5) * 2; // 0 at stage rests, 1 at handoffs
    Object.entries(modelsRef.current).forEach(([slot, m]) => {
      if (!m.group) return;
      const target = slotOpacity(slot, p);
      m.target += (target - m.target) * 0.08;
      const op = m.target;
      if (op <= 0.01) { m.group.visible = false; return; }
      m.group.visible = true;
      // idle drift, rise-and-settle, transition punch at handoffs, subtle breathe
      m.group.rotation.y = Math.sin(t * 0.25) * 0.05;
      m.group.position.y = (1 - op) * 0.6 + Math.sin(t * 0.5) * 0.05 + trans * 0.12;
      m.group.scale.setScalar((1 + Math.sin(t * 0.6) * 0.012) * (1 + trans * 0.025));
      m.group.traverse((c) => {
        if (!c.isMesh) return;
        const mats = Array.isArray(c.material) ? c.material : [c.material];
        mats.forEach((mm) => {
          if (!mm) return;
          mm.opacity = op;
          mm.transparent = op < 0.999;
          mm.depthWrite = op > 0.5;
        });
      });
    });
  });

  return null;
}

export default function ModelCanvas({ sources, progress = 0, mouse, activeMepSystem, reducedMotion }) {
  const progressRef = useRef(progress);
  progressRef.current = progress;
  const [statuses, setStatuses] = useState({});

  const onStatus = React.useCallback(
    (slot, st) => setStatuses((prev) => ({ ...prev, [slot]: st })),
    []
  );

  const frac = progress - Math.floor(progress);
  const trans = 1 - Math.abs(frac - 0.5) * 2;

  const loaded = UNIQUE_SLOTS.filter((s) => statuses[s]?.state === "ok").length;
  const errored = UNIQUE_SLOTS.filter((s) => statuses[s]?.state === "error");
  const pct = Math.round((loaded / UNIQUE_SLOTS.length) * 100);
  const allLoaded = loaded === UNIQUE_SLOTS.length;
  const anyUrl = sources && Object.values(sources).some(Boolean);

  return (
    <div className="fixed inset-0 z-0" style={{ width: "100vw", height: "100vh" }}>
      {anyUrl ? (
        <Canvas
          shadows
          dpr={[1, 2]}
          camera={{ position: [8, 6, 10], fov: 35 }}
          style={{ width: "100%", height: "100%", display: "block" }}
        >
          <Suspense fallback={null}>
            <Scene sources={sources} progressRef={progressRef} onStatus={onStatus} />
            <Controls progressRef={progressRef} />
          </Suspense>
        </Canvas>
      ) : (
        <div className="flex h-full w-full items-center justify-center text-white/70">
          Loading 3D assets…
        </div>
      )}

      {/* Cinematic vignette + accent glow synced to stage handoffs */}
      <div className="pointer-events-none absolute inset-0 z-[5]" style={{ boxShadow: "inset 0 0 240px 80px rgba(0,0,0,0.82)" }} />
      <div className="pointer-events-none absolute inset-0 z-[5] transition-opacity duration-300" style={{ opacity: trans * 0.55, background: "radial-gradient(ellipse at 50% 45%, rgba(249,115,22,0.22), transparent 62%)" }} />
      <div className="pointer-events-none absolute inset-0 z-[5] transition-opacity duration-300" style={{ opacity: trans * 0.4, background: "radial-gradient(ellipse at 50% 58%, rgba(56,189,248,0.16), transparent 60%)" }} />

      {/* Loading overlay 0–100% */}
      {anyUrl && !allLoaded && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-[#070a12]/80 text-white">
          <div className="text-center">
            <div className="font-mono text-xs uppercase tracking-[0.3em] text-amber-400">
              Loading 3D model
            </div>
            <div className="mt-3 font-heading text-4xl">{pct}%</div>
            {errored.length > 0 && (
              <div className="mx-auto mt-4 max-w-md text-xs text-red-400">
                Failed GLB URL:
                <div className="mt-1 break-all">{errored.map((s) => statuses[s].url).join(", ")}</div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Debug panel */}
      <div className="fixed bottom-4 left-4 z-[100] max-w-xs bg-black/80 p-3 font-mono text-xs text-white">
        <div className="mb-1 text-amber-400">MODEL DEBUG</div>
        {UNIQUE_SLOTS.map((slot) => {
          const url = sources?.[slot];
          const st = statuses[slot];
          const mark = st?.state === "ok" ? "✓" : st?.state === "error" ? "✗" : st?.state === "missing" ? "—" : "…";
          const color = st?.state === "ok" ? "text-emerald-400" : st?.state === "error" ? "text-red-400" : "text-slate-400";
          return (
            <div key={slot} className="mb-1">
              <div className="flex items-center gap-2">
                <span className={color}>{mark}</span>
                <span className="text-slate-200">{slot}</span>
                <span className="text-slate-600">·</span>
                <span className={color}>{url ? "URL exists" : "missing"}</span>
              </div>
              <div className="truncate text-[10px] text-slate-500">{url || "missing"}</div>
              {st?.state === "error" && (
                <div className="text-[10px] text-red-400">{String(st.error || "load error").slice(0, 90)}</div>
              )}
            </div>
          );
        })}
        <div className="mt-2 text-slate-300">Scroll progress: {(progress || 0).toFixed(2)}</div>
      </div>
    </div>
  );
}