import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { Maximize2, RotateCw, Crosshair, Eye, EyeOff } from "lucide-react";
import { MODEL_FILES } from "@/lib/modelAssets";

const SYSTEMS = [
  { id: "completed", label: "Complete" },
  { id: "main", label: "Architecture" },
  { id: "facade", label: "Façade" },
  { id: "structure", label: "Structure" },
  { id: "mep", label: "MEP" },
  { id: "interior", label: "Interior" },
  { id: "crane", label: "Construction" },
];

export default function ModelExplorer({ sources }) {
  const mountRef = useRef(null);
  const wrapRef = useRef(null);
  const controlsRef = useRef(null);
  const [active, setActive] = useState("completed");
  const [auto, setAuto] = useState(true);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { threshold: 0.25 });
    if (wrapRef.current) obs.observe(wrapRef.current);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    if (!visible) return;
    const mount = mountRef.current;
    if (!mount) return;
    const W = mount.clientWidth;
    const H = mount.clientHeight;
    const isMobile = window.matchMedia("(max-width: 768px)").matches;

    const renderer = new THREE.WebGLRenderer({ antialias: !isMobile, alpha: true, powerPreference: "high-performance" });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 1.5 : 2));
    renderer.setSize(W, H);
    renderer.shadowMap.enabled = !isMobile;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.08;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    mount.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const pmrem = new THREE.PMREMGenerator(renderer);
    scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;

    const camera = new THREE.PerspectiveCamera(35, W / H, 0.1, 1000);
    camera.position.set(8, 6, 10);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.08;
    controls.minDistance = 4;
    controls.maxDistance = 22;
    controls.maxPolarAngle = Math.PI * 0.52;
    controls.autoRotate = autoRef.current;
    controls.autoRotateSpeed = 0.7;
    controls.target.set(0, 1.3, 0);
    controlsRef.current = controls;

    scene.add(new THREE.AmbientLight(0xffffff, 0.4));
    scene.add(new THREE.HemisphereLight(0x9fb4d9, 0x0a0e17, 0.5));
    const key = new THREE.DirectionalLight(0xffffff, 2.2);
    key.position.set(6, 10, 7);
    if (!isMobile) { key.castShadow = true; key.shadow.mapSize.set(2048, 2048); key.shadow.bias = -0.0002; }
    scene.add(key);
    const fill = new THREE.DirectionalLight(0xbfd8ff, 0.5); fill.position.set(-6, 5, -5); scene.add(fill);
    const rim = new THREE.DirectionalLight(0xff9a3c, 0.4); rim.position.set(-4, 6, 8); scene.add(rim);

    const ground = new THREE.Mesh(new THREE.CircleGeometry(9, 64), new THREE.MeshStandardMaterial({ color: 0x0a0e17, roughness: 0.85, metalness: 0.15 }));
    ground.rotation.x = -Math.PI / 2; ground.position.y = -0.02; ground.receiveShadow = true;
    scene.add(ground);

    const draco = new DRACOLoader(); draco.setDecoderPath("https://www.gstatic.com/draco/v1/decoders/");
    const loader = new GLTFLoader(); loader.setDRACOLoader(draco);
    const models = {};
    MODEL_FILES.forEach((f) => {
      const url = sources && sources[f.id];
      models[f.id] = { group: null, t: 0 };
      if (!url) return;
      loader.load(url, (gltf) => {
        const obj = gltf.scene;
        const box = new THREE.Box3().setFromObject(obj);
        const size = box.getSize(new THREE.Vector3()); const center = box.getCenter(new THREE.Vector3());
        const maxDim = Math.max(size.x, size.y, size.z) || 1; const scale = 3 / maxDim;
        obj.scale.setScalar(scale); obj.position.sub(center.multiplyScalar(scale)); obj.position.y += (size.y * scale) / 2;
        obj.traverse((c) => { if (c.isMesh) { c.castShadow = true; c.receiveShadow = true; } });
        const parent = new THREE.Group(); parent.add(obj); parent.visible = false; scene.add(parent);
        models[f.id] = { group: parent, t: 0 };
      });
    });

    let raf;
    const animate = () => {
      raf = requestAnimationFrame(animate);
      if (document.hidden) return;
      controls.autoRotate = autoRef.current;
      controls.update();
      Object.keys(models).forEach((id) => {
        const m = models[id];
        if (!m.group) return;
        const target = (id === activeRef.current) ? 1 : 0;
        m.t += (target - m.t) * 0.08;
        m.group.visible = m.t > 0.01;
        m.group.traverse((c) => {
          if (!c.isMesh) return;
          const mats = Array.isArray(c.material) ? c.material : [c.material];
          mats.forEach((mm) => { mm.transparent = m.t < 0.999; mm.opacity = m.t; });
        });
      });
      renderer.render(scene, camera);
    };
    animate();

    const onResize = () => {
      const w = mount.clientWidth, h = mount.clientHeight;
      renderer.setSize(w, h); camera.aspect = w / h; camera.updateProjectionMatrix();
    };
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
      controls.dispose(); draco.dispose(); pmrem.dispose(); renderer.dispose();
      if (renderer.domElement.parentNode) renderer.domElement.parentNode.removeChild(renderer.domElement);
    };
  }, [visible, sources]);

  const activeRef = useRef(active); activeRef.current = active;
  const autoRef = useRef(auto); autoRef.current = auto;

  const reset = () => {
    const c = controlsRef.current;
    if (!c) return;
    c.object.position.set(8, 6, 10);
    c.target.set(0, 1.3, 0);
    c.update();
  };

  const toggleFullscreen = () => {
    const el = wrapRef.current;
    if (!el) return;
    if (!document.fullscreenElement) el.requestFullscreen?.();
    else document.exitFullscreen?.();
  };

  return (
    <div ref={wrapRef} className="relative overflow-hidden rounded-2xl border border-slate-700/50 bg-[#0a0e17]">
      <div className="eng-grid pointer-events-none absolute inset-0 opacity-30" />
      <div ref={mountRef} className="relative h-[68vh] min-h-[420px] w-full md:h-[78vh]" />

      {/* System selector */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 p-4">
        <div className="pointer-events-auto mx-auto flex max-w-3xl flex-wrap items-center justify-center gap-2 rounded-xl glass-strong p-2">
          {SYSTEMS.map((s) => (
            <button
              key={s.id}
              onClick={() => setActive(s.id)}
              className={`rounded-lg px-3 py-1.5 font-mono text-[10px] uppercase tracking-widest transition-all ${
                active === s.id ? "bg-amber-500 text-slate-950" : "text-slate-300 hover:bg-slate-700/50"
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {/* Viewer controls */}
      <div className="pointer-events-none absolute right-3 top-3 flex flex-col gap-2">
        <button onClick={() => setAuto((v) => !v)} title="Auto Rotate" className={`pointer-events-auto rounded-lg p-2 glass-strong transition-colors ${auto ? "text-amber-400" : "text-slate-400"}`}><RotateCw size={16} /></button>
        <button onClick={reset} title="Reset View" className="pointer-events-auto rounded-lg p-2 glass-strong text-slate-300 hover:text-amber-400"><Crosshair size={16} /></button>
        <button onClick={toggleFullscreen} title="Fullscreen" className="pointer-events-auto rounded-lg p-2 glass-strong text-slate-300 hover:text-amber-400"><Maximize2 size={16} /></button>
      </div>

      <div className="pointer-events-none absolute left-3 top-3 font-mono text-[9px] uppercase tracking-[0.2em] text-slate-500">
        Drag to rotate · Scroll to zoom
      </div>
    </div>
  );
}