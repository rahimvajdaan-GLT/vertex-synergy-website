import React, { useEffect, useRef, useState } from "react";
import { STAGES } from "./stagesMeta";
import ImmersiveCanvas from "./ImmersiveCanvas";
import SceneOverlay from "./SceneOverlay";

export default function ImmersiveExperience() {
  const containerRef = useRef(null);
  const progressRef = useRef(0);
  const [stageIndex, setStageIndex] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let raf;
    let lastIdx = -1;
    let lastP = -1;
    const update = () => {
      const el = containerRef.current;
      if (el) {
        const rect = el.getBoundingClientRect();
        const total = Math.max(1, el.offsetHeight - window.innerHeight);
        const p = Math.min(1, Math.max(0, -rect.top / total));
        progressRef.current = p;
        const N = STAGES.length;
        const idx = Math.min(N - 1, Math.max(0, Math.floor(p * N)));
        if (idx !== lastIdx) {
          lastIdx = idx;
          setStageIndex(idx);
        }
        if (Math.abs(p - lastP) > 0.002) {
          lastP = p;
          setProgress(p);
        }
      }
      raf = requestAnimationFrame(update);
    };
    update();
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <section ref={containerRef} className="relative" style={{ height: `${STAGES.length * 120}vh` }}>
      <div className="sticky top-0 h-screen w-full overflow-hidden bg-[#f6f7f9]">
        <ImmersiveCanvas progressRef={progressRef} />
        <SceneOverlay stageIndex={stageIndex} progress={progress} />
      </div>
    </section>
  );
}