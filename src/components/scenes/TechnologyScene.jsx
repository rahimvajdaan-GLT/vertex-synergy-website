import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

const layers = ["Architecture", "Structure", "Mechanical", "Electrical", "Plumbing", "Fire Protection", "Interior"];
const techs = ["BIM Coordination", "Digital Twins", "AI-Powered Planning", "Drone Monitoring", "Smart Construction", "Real-Time Tracking", "3D Coordination", "Clash Detection", "Digital QC", "Sustainable Construction"];

function Layer({ name, i, progress, count }) {
  const y = useTransform(progress, [0, 1], [i * 18 - count * 9, -(i * 18 - count * 9)]);
  const op = useTransform(progress, [0.1, 0.4, 0.8, 1], [0.2, 1, 1, 0.4], { clamp: true });
  return (
    <motion.div style={{ y, opacity: op }} className="group relative overflow-hidden border-x border-secondary/25 bg-gradient-to-r from-slate-950/90 via-slate-900/80 to-slate-950/90 px-4 py-2 text-left backdrop-blur-md">
      <span className="absolute left-0 top-0 h-full w-1 bg-gradient-to-b from-accent to-secondary opacity-70 transition-all duration-300 group-hover:opacity-100" />
      <span className="absolute right-3 top-1/2 h-2 w-2 -translate-y-1/2 rounded-full bg-accent shadow-[0_0_8px_2px_rgba(255,159,28,0.6)]" />
      <span className="absolute right-7 top-1/2 h-3 w-3 -translate-y-1/2 rounded-full border border-accent/50" />
      <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-foreground transition-colors group-hover:text-accent">{name}</span>
    </motion.div>
  );
}

export default function TechnologyScene() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  return (
    <section id="technology" ref={ref} className="relative z-10 h-[300vh]">
      <div className="sticky top-0 h-screen overflow-hidden">
        <div className="mx-auto flex h-full max-w-6xl flex-col justify-center px-6">
          <p className="font-mono text-[10px] uppercase tracking-[0.4em] text-secondary">// 05 · Technology</p>
          <h2 className="mt-3 font-display text-4xl font-bold tracking-tighter md:text-6xl">The digital <span className="gradient-text">twin</span></h2>
          <p className="mt-3 max-w-xl text-muted-foreground">Buildings become transparent — every system visible, coordinated, and predictive.</p>
          <div className="mt-10 grid grid-cols-1 gap-8 md:grid-cols-2">
            <div className="space-y-2">
              {layers.map((l, i) => <Layer key={l} name={l} i={i} progress={scrollYProgress} count={layers.length} />)}
            </div>
            <div className="grid grid-cols-2 gap-3 self-center">
              {techs.map((t, i) => (
                <motion.div key={t} initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }} className="border border-secondary/25 bg-slate-950/70 p-3 backdrop-blur-md">
                  <div className="font-mono text-[8px] uppercase tracking-widest text-accent">SYS {String(i + 1).padStart(2, "0")}</div>
                  <div className="mt-1 text-xs font-semibold text-foreground">{t}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}