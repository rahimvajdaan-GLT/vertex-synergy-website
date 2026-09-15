import React, { Suspense } from "react";
import * as THREE from "three";
import { Canvas } from "@react-three/fiber";
import HeroModel from "./HeroModel";
import CanvasErrorBoundary from "@/components/three/CanvasErrorBoundary";

// Hero keeps its own Canvas (R3F owns the renderer — no manual
// WebGLRenderer). It unmounts via inView once the user scrolls into the
// manufacturing section, so only one WebGL canvas is live at a time.
export default function HeroCanvas({ url, isMobile, onError }) {
  return (
    <CanvasErrorBoundary>
      <Canvas
        shadows={!isMobile}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true, powerPreference: "default", failIfMajorPerformanceCaveat: false }}
        camera={{ position: [0, 1.2, 6], fov: 34, near: 0.1, far: 500 }}
        onCreated={({ gl }) => {
          gl.outputColorSpace = THREE.SRGBColorSpace;
          gl.toneMapping = THREE.ACESFilmicToneMapping;
          gl.toneMappingExposure = 1.4;
        }}
      >
        <Suspense fallback={null}>
          <HeroModel url={url} isMobile={isMobile} onError={onError} />
        </Suspense>
      </Canvas>
    </CanvasErrorBoundary>
  );
}