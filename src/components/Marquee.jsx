import React from "react";
import { motion } from "framer-motion";

const items = [
  "General Contracting",
  "Civil & Structural Works",
  "MEP Solutions",
  "BIM & Digital Construction",
  "27 Airports for SANS",
  "Makkah Train Station",
  "Aramco Approved",
  "150+ Projects Delivered",
];

export default function Marquee() {
  return (
    <div className="relative bg-card text-foreground border-y border-border py-5 overflow-hidden">
      <motion.div
        className="flex gap-12 whitespace-nowrap will-change-transform"
        animate={{ x: ["0%", "-50%"] }}
        transition={{ repeat: Infinity, duration: 28, ease: "linear" }}
      >
        {[...items, ...items].map((it, i) => (
          <span key={i} className="font-heading font-bold tracking-tighter text-2xl md:text-4xl flex items-center gap-12 shrink-0">
            <span className="text-foreground/80">{it}</span>
            <span className="text-accent">◆</span>
          </span>
        ))}
      </motion.div>
    </div>
  );
}