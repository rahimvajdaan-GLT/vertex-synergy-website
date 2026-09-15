import { useEffect, useRef } from "react";

// Desktop-only soft cursor follower: a small dot plus a larger ring that
// enlarges over interactive elements. No effect on touch / reduced-motion.
export default function CustomCursor() {
  const dotRef = useRef(null);
  const ringRef = useRef(null);

  useEffect(() => {
    if (window.matchMedia("(max-width: 1024px)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    let mx = window.innerWidth / 2;
    let my = window.innerHeight / 2;
    let rx = mx;
    let ry = my;
    let scale = 1;
    let targetScale = 1;
    let raf;

    const interactive = (el) =>
      el && el.closest
        ? el.closest("a,button,input,textarea,select,[data-cursor],.svc-module,.project-panel,.exp-nav")
        : null;

    const onMove = (e) => {
      mx = e.clientX;
      my = e.clientY;
      dot.style.transform = `translate(${mx}px, ${my}px)`;
    };
    const onOver = (e) => {
      if (interactive(e.target)) targetScale = 2.4;
    };
    const onOut = (e) => {
      if (interactive(e.target)) targetScale = 1;
    };

    const loop = () => {
      rx += (mx - rx) * 0.18;
      ry += (my - ry) * 0.18;
      scale += (targetScale - scale) * 0.18;
      ring.style.transform = `translate(${rx}px, ${ry}px) scale(${scale})`;
      raf = requestAnimationFrame(loop);
    };

    window.addEventListener("mousemove", onMove);
    document.addEventListener("mouseover", onOver);
    document.addEventListener("mouseout", onOut);
    loop();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseover", onOver);
      document.removeEventListener("mouseout", onOut);
    };
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 z-[9999] hidden lg:block" aria-hidden>
      <div
        ref={dotRef}
        className="absolute -ml-[3px] -mt-[3px] h-1.5 w-1.5 rounded-full bg-amber-400"
        style={{ willChange: "transform" }}
      />
      <div
        ref={ringRef}
        className="absolute -ml-5 -mt-5 h-10 w-10 rounded-full border border-amber-400/50"
        style={{ willChange: "transform" }}
      />
    </div>
  );
}