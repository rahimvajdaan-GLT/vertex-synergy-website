import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// Smooth inertial scrolling via Lenis, synced to the GSAP ticker so
// ScrollTrigger stays perfectly in phase. Falls back to native scroll if
// Lenis is unavailable or the user prefers reduced motion.
export function useSmoothScroll(enabled = true) {
  const lenisRef = useRef(null);

  useEffect(() => {
    if (!enabled) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let lenis;
    let rafFn;
    let destroyed = false;

    import("lenis")
      .then(({ default: Lenis }) => {
        if (destroyed) return;
        lenis = new Lenis({
          duration: 1.1,
          lerp: 0.1,
          smoothWheel: true,
          wheelMultiplier: 1,
          touchMultiplier: 1.4,
        });
        lenisRef.current = lenis;
        window.lenis = lenis;
        lenis.on("scroll", ScrollTrigger.update);
        rafFn = (time) => lenis.raf(time * 1000);
        gsap.ticker.add(rafFn);
        gsap.ticker.lagSmoothing(0);
        ScrollTrigger.refresh();
      })
      .catch(() => {
        // Lenis unavailable — native scroll with scrubbed GSAP motion is used.
      });

    return () => {
      destroyed = true;
      if (rafFn) gsap.ticker.remove(rafFn);
      if (lenis) lenis.destroy();
      lenisRef.current = null;
      if (window.lenis === lenis) window.lenis = null;
    };
  }, [enabled]);

  return lenisRef;
}