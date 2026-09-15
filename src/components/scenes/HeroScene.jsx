import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
// LiquidButton retired for solid amber CTA

export default function HeroScene() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "-45%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.82]);

  return (
    <section id="home" ref={ref} className="relative z-10 h-[220vh]">
      <div className="sticky top-0 flex h-screen items-start justify-center overflow-hidden pt-24">
        <motion.div style={{ y, opacity, scale }} className="relative z-10 px-6 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="flex flex-col items-center gap-2.5">
            <h2 className="font-display text-4xl font-bold tracking-tight md:text-5xl"><span className="text-white">VERTEX </span><span className="bg-clip-text text-transparent" style={{ backgroundImage: "linear-gradient(90deg,#E0B18E,#C1A98E,#A9A696,#89A6A8)" }}>SYNERGY</span></h2>
            <div className="flex items-center gap-3">
              <span className="h-px w-10 bg-gradient-to-r from-transparent to-secondary/50" />
              <span className="font-mono text-[12px] font-semibold uppercase tracking-[0.4em] text-accent">BIM Digital Twin</span>
              <span className="h-px w-10 bg-gradient-to-l from-transparent to-secondary/50" />
            </div>
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.55, duration: 0.9 }} className="mx-auto mt-8 max-w-5xl font-display text-[7.5vw] font-bold leading-[0.95] tracking-tighter text-white md:text-[5vw]">
            Building Excellence<br /><span className="gradient-text">Together</span>
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }} className="mx-auto mt-6 max-w-2xl text-base text-white/70 md:text-lg">
            Premier construction company in Saudi Arabia, delivering world-class Civil Engineering, MEP Services, and Turnkey Solutions for iconic projects including 27 airports for SANS, Makkah Train Station, and REDAR systems.
          </motion.p>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1 }} className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <a href="#projects" className="inline-flex items-center gap-2 rounded-full border border-secondary/40 bg-secondary/5 px-8 py-4 font-mono text-[11px] uppercase tracking-[0.25em] text-secondary backdrop-blur-md transition-all duration-300 hover:bg-secondary/15 hover:glow-cyan">Explore Projects</a>
            <a href="#contact" className="inline-flex items-center gap-2 rounded-full bg-accent px-8 py-4 font-mono text-[11px] uppercase tracking-[0.25em] text-background transition-transform duration-300 hover:scale-105 glow-amber">Start a Project</a>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.3 }} className="mt-14 inline-flex flex-wrap items-center justify-center gap-x-8 gap-y-4 border border-secondary/20 bg-slate-900/55 px-7 py-3.5 font-mono text-xs uppercase tracking-widest text-foreground/90 backdrop-blur-xl clip-angular">
            <span><span className="text-accent font-bold">150+</span> Projects</span>
            <span className="h-4 w-px bg-secondary/40" />
            <span><span className="text-accent font-bold">27</span> Airports</span>
            <span className="h-4 w-px bg-secondary/40" />
            <span><span className="text-accent font-bold">300+</span> Portacabins</span>
            <span className="h-4 w-px bg-secondary/40" />
            <span><span className="text-accent font-bold">15+</span> Years</span>
          </motion.div>
        </motion.div>
        <motion.div style={{ opacity }} className="absolute bottom-10 left-1/2 z-20 flex -translate-x-1/2 flex-col items-center gap-2">
          <span className="font-mono text-[9px] uppercase tracking-[0.3em] text-secondary">Scroll to Explore the BIM Model</span>
          <div className="relative h-12 w-px overflow-hidden bg-foreground/15">
            <motion.div animate={{ y: [-48, 48] }} transition={{ repeat: Infinity, duration: 1.6, ease: "easeInOut" }} className="absolute h-6 w-px bg-accent" />
          </div>
        </motion.div>
      </div>
    </section>
  );
}