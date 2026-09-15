import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// Decorative blueprint linework that draws itself (stroke-dash) on scroll-in.
export default function BlueprintLayer({
  className = "",
  color = "#38bdf8",
  opacity = 0.22,
  start = "top 75%",
}) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ctx = gsap.context(() => {
      const lines = el.querySelectorAll(".bp-l");
      gsap.set(lines, {
        strokeDasharray: (i, l) => l.getTotalLength(),
        strokeDashoffset: (i, l) => l.getTotalLength(),
      });
      gsap.to(lines, {
        strokeDashoffset: 0,
        duration: 1.4,
        ease: "none",
        stagger: 0.06,
        scrollTrigger: { trigger: el, start },
      });
    }, el);
    return () => ctx.revert();
  }, [start]);

  return (
    <svg
      ref={ref}
      className={`pointer-events-none ${className}`}
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      fill="none"
    >
      <g stroke={color} strokeWidth="0.15" opacity={opacity}>
        {[
          "M0 20 H100",
          "M0 50 H100",
          "M0 80 H100",
          "M20 0 V100",
          "M50 0 V100",
          "M80 0 V100",
          "M0 0 L100 100",
          "M100 0 L0 100",
        ].map((d, i) => (
          <path key={i} className="bp-l" d={d} />
        ))}
      </g>
    </svg>
  );
}