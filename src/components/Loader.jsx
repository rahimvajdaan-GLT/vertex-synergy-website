import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Loader() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const t = setInterval(() => {
      setProgress((p) => (p >= 100 ? 100 : p + Math.random() * 14));
    }, 90);
    return () => clearInterval(t);
  }, []);

  return (
    <motion.div
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6 }}
      className="fixed inset-0 z-[9999] bg-background flex flex-col items-center justify-center"
    >
      {/* Animated building/crane SVG */}
      <div className="relative w-48 h-48 mb-10">
        <svg viewBox="0 0 200 200" className="w-full h-full">
          {/* Ground line */}
          <motion.line x1="20" y1="170" x2="180" y2="170" stroke="#FF6A1A" strokeWidth="2"
            initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1 }} />
          {/* Crane mast */}
          <line x1="60" y1="40" x2="60" y2="170" stroke="#4B7BFF" strokeWidth="3" />
          {/* Crane jib rotating */}
          <motion.g style={{ transformOrigin: "60px 45px" }} animate={{ rotate: [-18, 18, -18] }} transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}>
            <line x1="60" y1="45" x2="150" y2="45" stroke="#FF6A1A" strokeWidth="3" />
            <line x1="150" y1="45" x2="150" y2="70" stroke="#FF6A1A" strokeWidth="2" strokeDasharray="3 3" />
          </motion.g>
          {/* Stacking blocks (building) */}
          {[0, 1, 2, 3, 4].map((i) => (
            <motion.rect key={i} x="100" y={150 - i * 18} width="40" height="16" stroke="#E8B04B" strokeWidth="2" fill="rgba(232,176,75,0.06)"
              initial={{ scaleY: 0 }} animate={{ scaleY: 1 }} transition={{ delay: 0.3 + i * 0.18, duration: 0.3 }}
              style={{ transformOrigin: `100px ${158 - i * 18}px` }} />
          ))}
        </svg>
      </div>

      <div className="font-heading font-bold tracking-tighter text-2xl text-foreground">
        VERTEX <span className="text-accent">SYNERGY</span>
      </div>
      <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground mt-2 mb-6">
        Engineering Tomorrow's Landmarks
      </div>

      {/* Progress bar */}
      <div className="w-56 h-px bg-border relative overflow-hidden">
        <motion.div className="absolute left-0 top-0 h-full bg-accent" animate={{ width: `${Math.min(progress, 100)}%` }} />
      </div>
      <div className="font-mono text-[10px] text-muted-foreground mt-3">{Math.min(Math.round(progress), 100)}%</div>
    </motion.div>
  );
}