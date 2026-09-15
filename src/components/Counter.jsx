import React, { useEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";

export default function Counter({ to = 0, suffix = "", duration = 2 }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });
  const [val, setVal] = useState(0);

  useEffect(() => {
    if (!inView) return;
    let raf;
    const start = performance.now();
    const tick = (now) => {
      const p = Math.min((now - start) / (duration * 1000), 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setVal(to * eased);
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, to, duration]);

  const display = to % 1 !== 0 ? val.toFixed(1) : Math.round(val).toString();

  return (
    <span ref={ref}>
      {display}
      {suffix}
    </span>
  );
}