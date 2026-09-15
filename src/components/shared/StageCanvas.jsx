import React, { Suspense, useEffect } from "react";
import * as THREE from "three";
import { Canvas, useThree } from "@react-three/fiber";
import { OrbitControls as ThreeOrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import StageModel from "@/components/portacabin/PortacabinStageModel";
import CanvasErrorBoundary from "@/components/three/CanvasErrorBoundary";

function Models({ slots, urls, state }) {
  return (
    <>
      {slots.map((slot) =>
        urls[slot] ? (
          <CanvasErrorBoundary key={slot}>
            <StageModel url={urls[slot]} state={state[slot]} />
          </CanvasErrorBoundary>
        ) : null
      )}
    </>
  );
}

function Scene({ isMobile }) {
  const { scene, camera, gl } = useThree();

  useEffect(() => {
    const ambient = new THREE.AmbientLight(0xc7d6ee, 1.1);
    const key = new THREE.DirectionalLight(0xfff0d6, 2.5);
    key.position.set(8, 12, 10);
    key.castShadow = true;
    key.shadow.mapSize.set(2048, 2048);
    key.shadow.camera.left = -15;
    key.shadow.camera.right = 15;
    key.shadow.camera.top = 15;
    key.shadow.camera.bottom = -15;
    key.shadow.camera.near = 0.5;
    key.shadow.camera.far = 40;
    const fill = new THREE.DirectionalLight(0xbfe6ff, 0.8);
    fill.position.set(-6, 5, -7);
    const rim = new THREE.DirectionalLight(0xffffff, 1.0);
    rim.position.set(0, 4, 12);
    const lights = [ambient, key, fill, rim];
    lights.forEach((l) => scene.add(l));
    return () => {
      lights.forEach((l) => {
        scene.remove(l);
        if (l.shadow && l.shadow.dispose) l.shadow.dispose();
      });
    };
  }, [scene]);

  useEffect(() => {
    if (isMobile) return;
    const controls = new ThreeOrbitControls(camera, gl.domElement);
    controls.enablePan = false;
    controls.enableZoom = true;
    controls.enableRotate = true;
    controls.enableDamping = true;
    controls.dampingFactor = 0.08;
    controls.minDistance = 6;
    controls.maxDistance = 16;
    controls.minPolarAngle = Math.PI * 0.22;
    controls.maxPolarAngle = Math.PI * 0.58;
    controls.target.set(0, 1.7, 0);
    controls.update();
    return () => controls.dispose();
  }, [camera, gl, isMobile]);

  return null;
}

export default function StageCanvas({ slots, urls, state, isMobile }) {
  return (
    <CanvasErrorBoundary>
      <Canvas
        shadows={!isMobile}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true, powerPreference: "default", failIfMajorPerformanceCaveat: false }}
        camera={{ position: [7.5, 5.5, 9], fov: 34, near: 0.1, far: 500 }}
        onCreated={({ gl }) => {
          gl.outputColorSpace = THREE.SRGBColorSpace;
          gl.toneMapping = THREE.ACESFilmicToneMapping;
          gl.toneMappingExposure = 1.1;
        }}
      >
        <Scene isMobile={isMobile} />
        <Suspense fallback={null}>
          <Models slots={slots} urls={urls} state={state} />
        </Suspense>
      </Canvas>
    </CanvasErrorBoundary>
  );
}