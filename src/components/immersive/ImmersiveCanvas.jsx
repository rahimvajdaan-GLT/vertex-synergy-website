import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { createStages } from "./stageBuilders";

export default function ImmersiveCanvas({ progressRef }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.12;
    renderer.outputColorSpace = THREE.SRGBColorSpace;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf6f7f9);
    scene.fog = new THREE.Fog(0xf6f7f9, 20, 45);

    const pmrem = new THREE.PMREMGenerator(renderer);
    scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;

    const hemi = new THREE.HemisphereLight(0xffffff, 0xe6eaef, 0.5);
    scene.add(hemi);
    const key = new THREE.DirectionalLight(0xffffff, 2.1);
    key.position.set(5, 9, 6);
    key.castShadow = true;
    key.shadow.mapSize.set(2048, 2048);
    key.shadow.camera.near = 1;
    key.shadow.camera.far = 42;
    key.shadow.camera.left = -12;
    key.shadow.camera.right = 12;
    key.shadow.camera.top = 12;
    key.shadow.camera.bottom = -12;
    key.shadow.bias = -0.0002;
    key.shadow.radius = 5;
    scene.add(key);
    const rim = new THREE.DirectionalLight(0xdcecff, 0.8);
    rim.position.set(-5, 6, -5);
    scene.add(rim);
    const fill = new THREE.DirectionalLight(0xfff2e6, 0.35);
    fill.position.set(-3, 3, 6);
    scene.add(fill);

    const ground = new THREE.Mesh(
      new THREE.PlaneGeometry(100, 100),
      new THREE.MeshStandardMaterial({ color: 0xeceef1, roughness: 0.5, metalness: 0.18 })
    );
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -0.02;
    ground.receiveShadow = true;
    scene.add(ground);

    const camera = new THREE.PerspectiveCamera(42, window.innerWidth / window.innerHeight, 0.1, 100);

    const stages = createStages();
    stages.forEach((s) => scene.add(s.group));
    const cams = stages.map((s) => ({
      pos: new THREE.Vector3(...s.meta.camera.pos),
      target: new THREE.Vector3(...s.meta.camera.target),
    }));
    const N = stages.length;
    const tmpPos = new THREE.Vector3();
    const tmpTarget = new THREE.Vector3();

    let raf;
    const render = () => {
      const p = progressRef.current || 0;
      const fi = Math.min(N - 1, Math.max(0, Math.floor(p * N)));
      const local = THREE.MathUtils.clamp(p * N - fi, 0, 1);
      const e = local * local * (3 - 2 * local);
      const next = Math.min(N - 1, fi + 1);
      tmpPos.lerpVectors(cams[fi].pos, cams[next].pos, e);
      tmpTarget.lerpVectors(cams[fi].target, cams[next].target, e);
      const now = performance.now() * 0.001;
      camera.position.copy(tmpPos);
      camera.position.x += Math.sin(now * 0.25) * 0.09;
      camera.position.y += Math.cos(now * 0.2) * 0.06;
      camera.lookAt(tmpTarget);
      for (let i = 0; i < N; i++) {
        stages[i].update(stages[i].group, p * N - i);
      }
      renderer.render(scene, camera);
      raf = requestAnimationFrame(render);
    };
    render();

    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
      stages.forEach((s) =>
        s.group.traverse((o) => {
          o.geometry?.dispose?.();
          if (o.material) {
            if (Array.isArray(o.material)) o.material.forEach((m) => m.dispose());
            else o.material.dispose();
          }
        })
      );
      pmrem.dispose();
      renderer.dispose();
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />;
}