import React, { Component, Suspense, useEffect, useRef } from "react";
import { useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";

// Per-model GLB loader. Loads one real GLB URL from ModelAsset via useGLTF
// (Draco-enabled), reports load status to the parent, keeps materials opaque,
// and applies a crossfade opacity driven by scroll progress.

class ModelErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }
  static getDerivedStateFromError(e) {
    return { error: e };
  }
  componentDidCatch(e) {
    console.error("Failed GLB URL:", this.props.url, e);
    this.props.onError?.(e?.message || String(e));
  }
  render() {
    if (this.state.error) return null;
    return this.props.children;
  }
}

function Model({ url, opacity, onStatus }) {
  const { scene } = useGLTF(url, true); // true => Draco via gstatic decoders
  const objRef = useRef(null);
  const opRef = useRef(opacity);
  opRef.current = opacity;
  const onStatusRef = useRef(onStatus);
  onStatusRef.current = onStatus;

  useEffect(() => {
    onStatusRef.current?.({ state: "ok", url });
    const isMobile =
      typeof window !== "undefined" && window.matchMedia("(max-width: 768px)").matches;
    // Place + scale the building so it occupies ~45% of the viewport on the right.
    scene.position.set(isMobile ? 0 : 2.8, isMobile ? -2.2 : -2.5, 0);
    scene.rotation.set(0, -0.6, 0);
    scene.scale.setScalar(isMobile ? 0.24 : 0.35);
    scene.traverse((o) => {
      if (!o.isMesh) return;
      o.visible = true;
      o.castShadow = true;
      o.receiveShadow = true;
      const mats = Array.isArray(o.material) ? o.material : [o.material];
      mats.forEach((m) => {
        if (!m) return;
        m.transparent = false;
        m.opacity = 1;
        m.depthWrite = true;
        m.visible = true;
        m.needsUpdate = true;
      });
    });
  }, [scene, url]);

  useFrame(() => {
    const o = objRef.current;
    if (!o) return;
    const op = opRef.current;
    o.visible = op > 0.01;
    o.traverse((c) => {
      if (!c.isMesh) return;
      const mats = Array.isArray(c.material) ? c.material : [c.material];
      mats.forEach((m) => {
        if (!m) return;
        m.opacity = op;
        m.transparent = op < 0.999;
        m.depthWrite = op > 0.5;
      });
    });
  });

  return <primitive object={scene} ref={objRef} />;
}

export default function ModelLoader({ url, opacity = 1, visible = true, onStatus }) {
  if (!url) return null;
  return (
    <ModelErrorBoundary
      url={url}
      onError={(msg) => onStatus?.({ state: "error", url, error: msg })}
    >
      <Suspense fallback={null}>
        <Model url={url} opacity={visible ? opacity : 0} onStatus={onStatus} />
      </Suspense>
    </ModelErrorBoundary>
  );
}