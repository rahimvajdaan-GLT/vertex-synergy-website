import React, { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export default function CustomCursor() {
  const [hovering, setHovering] = useState(false);
  const [big, setBig] = useState(false);
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const ringX = useSpring(x, { stiffness: 250, damping: 28, mass: 0.4 });
  const ringY = useSpring(y, { stiffness: 250, damping: 28, mass: 0.4 });

  useEffect(() => {
    const move = (e) => { x.set(e.clientX); y.set(e.clientY); };
    const over = (e) => {
      const t = e.target.closest("a, button, [role='button'], [data-hover]");
      setHovering(!!t);
      setBig(!!(t && t.dataset.cursor === "project"));
    };
    const out = (e) => {
      if (e.target.closest("a, button, [role='button'], [data-hover]")) { setHovering(false); setBig(false); }
    };
    window.addEventListener("mousemove", move);
    window.addEventListener("mouseover", over);
    window.addEventListener("mouseout", out);
    return () => { window.removeEventListener("mousemove", move); window.removeEventListener("mouseover", over); window.removeEventListener("mouseout", out); };
  }, [x, y]);

  return (
    <div className="pointer-events-none fixed inset-0 z-[9999] hidden md:block">
      <motion.div className="absolute rounded-full" style={{ left: x, top: y, x: "-50%", y: "-50%", width: 7, height: 7, backgroundColor: "#F59E0B", boxShadow: "0 0 12px 4px rgba(245,158,11,0.6)" }} />
      <motion.div
        className="absolute rounded-full border"
        style={{ left: ringX, top: ringY, x: "-50%", y: "-50%", borderColor: hovering ? "#4b9fd8" : "rgba(245,158,11,0.6)", boxShadow: hovering ? "0 0 22px rgba(75,159,216,0.4)" : "0 0 14px rgba(245,158,11,0.3)" }}
        animate={{ width: big ? 80 : hovering ? 40 : 26, height: big ? 80 : hovering ? 40 : 26 }}
        transition={{ type: "spring", stiffness: 200, damping: 22 }}
      />
    </div>
  );
}