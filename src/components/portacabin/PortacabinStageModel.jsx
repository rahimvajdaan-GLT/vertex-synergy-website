import { useEffect, useMemo } from "react";
import * as THREE from "three";
import { useFrame, useThree } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";

// Loads a Portacabin GLB, clones it (with cloned materials so opacity can be
// driven per-model), normalises it to a 1-unit max dimension centred on x/z
// with its base on y=0, and mounts it imperatively via a pivot Object3D.
export default function PortacabinStageModel({
  url,
  state,
  groundY = -1.5,
  float = 0,
  scaleMultiplier = 1,
  positionOffset = [0, 0, 0],
  rotationOffset = [0, 0, 0],
}) {
  const { scene: gltfScene } = useGLTF(url);
  const { scene: r3fScene } = useThree();

  const { pivot, materials } = useMemo(() => {
    const clone = gltfScene.clone(true);
    const mats = [];
    clone.traverse((o) => {
      if (!o.isMesh) return;
      o.castShadow = true;
      o.receiveShadow = true;
      if (Array.isArray(o.material)) {
        o.material = o.material.map((m) => {
          const c = m.clone();
          mats.push(c);
          return c;
        });
      } else if (o.material) {
        const c = o.material.clone();
        mats.push(c);
        o.material = c;
      }
    });

    const b0 = new THREE.Box3().setFromObject(clone);
    const s0 = b0.getSize(new THREE.Vector3());
    const maxDim = Math.max(s0.x, s0.y, s0.z) || 1;
    clone.scale.multiplyScalar((1 / maxDim) * scaleMultiplier);

    const b = new THREE.Box3().setFromObject(clone);
    const center = b.getCenter(new THREE.Vector3());
    clone.position.x -= center.x;
    clone.position.z -= center.z;
    clone.position.y -= b.min.y;

    const pivot = new THREE.Object3D();
    pivot.add(clone);
    return { pivot, materials: mats };
  }, [gltfScene, scaleMultiplier]);

  useEffect(() => {
    r3fScene.add(pivot);
    return () => {
      r3fScene.remove(pivot);
    };
  }, [r3fScene, pivot]);

  useFrame(() => {
    const t = performance.now() * 0.0003;
    pivot.position.set(
      (state.x ?? 0) + positionOffset[0],
      (state.y ?? groundY) + positionOffset[1],
      0 + positionOffset[2]
    );
    pivot.rotation.y = (state.rotY ?? 0) + rotationOffset[1] + Math.sin(t) * float;
    pivot.rotation.x = rotationOffset[0];
    pivot.rotation.z = rotationOffset[2];
    pivot.scale.setScalar(state.scale ?? 1);
    const op = state.opacity;
    pivot.visible = op > 0.001;
    if (pivot.visible) {
      for (let i = 0; i < materials.length; i++) {
        const m = materials[i];
        m.transparent = op < 0.999;
        m.opacity = op;
        m.depthWrite = op > 0.7;
        m.needsUpdate = true;
      }
    }
  });

  return null;
}