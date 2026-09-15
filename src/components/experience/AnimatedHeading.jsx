import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// Masked heading reveal: each line sits inside an overflow-hidden mask and
// rises from yPercent 110 → 0 with a power3.out ease, staggered line by line.
export default function AnimatedHeading({
  lines,
  as: Tag = "h2",
  className = "",
  lineClass = "",
  stagger = 0.1,
  start = "top 82%",
  id,
}) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ctx = gsap.context(() => {
      const lineEls = el.querySelectorAll(".ah-line");
      gsap.set(lineEls, { yPercent: 110 });
      gsap.to(lineEls, {
        yPercent: 0,
        ease: "power3.out",
        duration: 0.9,
        stagger,
        scrollTrigger: { trigger: el, start },
      });
    }, el);
    return () => ctx.revert();
  }, [stagger, start]);

  return (
    <Tag ref={ref} id={id} className={className}>
      {lines.map((l, i) => (
        <span key={i} className="block overflow-hidden">
          <span className={`ah-line block ${lineClass}`}>{l}</span>
        </span>
      ))}
    </Tag>
  );
}