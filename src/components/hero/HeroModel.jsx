import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { useFrame, useThree } from "@react-three/fiber";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

// Fully imperative hero scene: lights AND the GLB model are added directly to
// the THREE.Scene via useThree, and the transform is driven in useFrame. R3F
// only owns the <Canvas> — it never creates light or model instances, so
// applyProps (and its "reading 'source'" crash) never runs on them. Mirrors
// the proven-safe pattern in ModelCanvas.
export default function HeroModel({ url, scale = 3.4, groundY = -1.5, spin = 0.12, onError }) {
  const { scene } = useThree();
  const [gltfScene, setGltfScene] = useState(null);

  // Imperative lights — added once, removed on unmount.
  useEffect(() => {
    const ambient = new THREE.AmbientLight(0x9fb4d9, 1.3);
    const hemi = new THREE.HemisphereLight(0x9fd8ff, 0x161b29, 0.7);
    const key = new THREE.DirectionalLight(0xffe6c2, 2.6);
    key.position.set(8, 12, 10);
    key.castShadow = true;
    key.shadow.mapSize.set(2048, 2048);
    key.shadow.camera.left = -15;
    key.shadow.camera.right = 15;
    key.shadow.camera.top = 15;
    key.shadow.camera.bottom = -15;
    key.shadow.camera.near = 0.5;
    key.shadow.camera.far = 40;
    const rim = new THREE.DirectionalLight(0x9fd8ff, 0.9);
    rim.position.set(-6, 5, -6);
    const lights = [ambient, hemi, key, rim];
    lights.forEach((l) => scene.add(l));
    return () => {
      lights.forEach((l) => {
        scene.remove(l);
        l.shadow && l.shadow.dispose && l.shadow.dispose();
      });
    };
  }, [scene]);

  // Raw GLTFLoader — completely outside R3F's loader/suspense.
  useEffect(() => {
    let alive = true;
    const loader = new GLTFLoader();
    loader.load(
      url,
      (gltf) => {
        if (alive) setGltfScene(gltf.scene);
      },
      undefined,
      (e) => {
        if (!alive) return;
        console.error("Hero GLB load failed:", e);
        onError?.(e);
      }
    );
    return () => {
      alive = false;
    };
  }, [url, onError]);

  const { pivot, materials } = useMemo(() => {
    if (!gltfScene) return {};
    const clone = gltfScene.clone(true);
    clone.traverse((o) => {
      if (!o.isMesh) return;
      o.castShadow = true;
      o.receiveShadow = true;
      o.material = Array.isArray(o.material)
        ? o.material.map((m) => (m ? m.clone() : m))
        : o.material
        ? o.material.clone()
        : o.material;
    });

    const b0 = new THREE.Box3().setFromObject(clone);
    const s0 = b0.getSize(new THREE.Vector3());
    const maxDim = Math.max(s0.x, s0.y, s0.z) || 1;
    clone.scale.multiplyScalar(1 / maxDim);

    const b = new THREE.Box3().setFromObject(clone);
    const center = b.getCenter(new THREE.Vector3());
    clone.position.x -= center.x;
    clone.position.z -= center.z;
    clone.position.y -= b.min.y;

    const materials = [];
    clone.traverse((o) => {
      if (!o.isMesh) return;
      const mats = Array.isArray(o.material) ? o.material : [o.material];
      mats.forEach((m) => m && materials.push(m));
    });

    const pivot = new THREE.Object3D();
    pivot.add(clone);
    return { pivot, materials };
  }, [gltfScene]);

  const introRef = useRef(0);
  useEffect(() => {
    introRef.current = 0;
  }, [pivot]);

  useEffect(() => {
    if (!pivot) return;
    scene.add(pivot);
    return () => {
      scene.remove(pivot);
      pivot.traverse((o) => {
        if (o.geometry) o.geometry.dispose && o.geometry.dispose();
        if (o.material) {
          const mats = Array.isArray(o.material) ? o.material : [o.material];
          mats.forEach((m) => m && m.dispose && m.dispose());
        }
      });
    };
  }, [scene, pivot]);

  useFrame((_, delta) => {
    if (!pivot) return;
    if (introRef.current < 1) introRef.current = Math.min(1, introRef.current + delta / 1.6);
    const eased = 1 - Math.pow(1 - introRef.current, 3);
    pivot.position.set(0, groundY, 0);
    pivot.rotation.y += delta * spin;
    pivot.scale.setScalar(0.15 + (scale - 0.15) * eased);
    if (materials) {
      const op = eased;
      for (let i = 0; i < materials.length; i++) {
        const m = materials[i];
        m.transparent = op < 0.999;
        m.opacity = op;
        m.needsUpdate = true;
      }
    }
  });

  return null;
}