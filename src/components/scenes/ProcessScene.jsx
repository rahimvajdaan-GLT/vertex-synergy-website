import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

const stages = ["Vision", "Planning", "Design", "BIM Coordination", "Procurement", "Construction", "Quality Control", "Testing & Commissioning", "Handover"];

const meta = [
{ tag: "Discovery", desc: "Feasibility, stakeholder alignment, site survey" },
{ tag: "Strategy", desc: "Schedule, budget, risk & procurement plan" },
{ tag: "Architecture", desc: "Concept through detailed design packages" },
{ tag: "Coordination", desc: "Clash detection across MEP & structure" },
{ tag: "Sourcing", desc: "Vendor selection, logistics, material release" },
{ tag: "Execution", desc: "Civil, structural & MEP works on site" },
{ tag: "Assurance", desc: "Inspection, NDT, ITP-driven sign-offs" },
{ tag: "Commissioning", desc: "Integrated testing & performance validation" },
{ tag: "Delivery", desc: "As-builts, O&M manuals, client handover" }];


function Stage({ i, progress, count }) {
  const t = i / (count - 1);
  const lo = Math.max(0.001, t - 0.08);
  const op = useTransform(progress, [lo, Math.max(lo + 0.001, t)], [0.3, 1], { clamp: true });
  const scale = useTransform(progress, [lo, Math.max(lo + 0.001, t)], [0.8, 1], { clamp: true });
  const x = useTransform(progress, [Math.max(0.001, t - 0.1), Math.max(0.002, t)], [14, 0], { clamp: true });
  return (
    <motion.div style={{ opacity: op, x }} className="group relative pl-12">
      <motion.span
        style={{ scale }}
        className="absolute left-0 top-2 z-10 flex h-5 w-5 items-center justify-center rounded-full border border-accent/60 bg-slate-950/50 shadow-[0_0_16px_-2px_rgba(255,159,28,0.8)]">
        <span className="h-1.5 w-1.5 rounded-full bg-accent shadow-[0_0_8px_2px_rgba(255,159,28,0.8)]" />
      </motion.span>
      <div className="relative px-1 py-0.5 transition-colors duration-300 group-hover:bg-slate-950/20">
        <div className="flex items-baseline gap-3">
          <span className="font-mono text-[9px] tracking-[0.25em] text-secondary/85">STAGE {String(i + 1).padStart(2, "0")}</span>
          <span className="h-px flex-1 bg-gradient-to-r from-secondary/25 to-transparent" />
        </div>
        <div className="mt-0.5 font-heading text-lg font-bold tracking-tight text-foreground drop-shadow-[0_2px_8px_rgba(15,23,42,0.6)]">{stages[i]}</div>
        <div className="mt-1 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.15em] text-foreground/45">
          <span className="text-accent/85">{meta[i].tag}</span>
          <span className="h-1 w-1 rounded-full bg-foreground/30" />
          <span className="hidden normal-case tracking-normal text-foreground/60 sm:inline">{meta[i].desc}</span>
        </div>
      </div>
    </motion.div>);
}

export default function ProcessScene() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const draw = useTransform(scrollYProgress, [0.05, 0.95], [0, 1]);
  return (
    <section id="process" ref={ref} className="relative z-10 h-[320vh]">
      <div className="sticky top-0 h-screen overflow-hidden">
        <div className="mx-auto flex h-full max-w-4xl flex-col justify-center px-6 py-10">
          <div className="relative border border-secondary/15 bg-slate-950/25 px-5 py-5 backdrop-blur-md sm:px-7">
            <span className="absolute -left-px -top-px h-5 w-5 border-l border-t border-accent/70" />
            <span className="absolute -right-px -top-px h-5 w-5 border-r border-t border-accent/70" />
            <span className="absolute -bottom-px -left-px h-5 w-5 border-b border-l border-secondary/70" />
            <span className="absolute -bottom-px -right-px h-5 w-5 border-b border-r border-secondary/70" />
            <div className="flex items-end justify-between">
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.4em] text-accent">// 07 · Process</p>
                <h2 className="mt-3 font-display text-3xl font-bold uppercase leading-[0.9] tracking-tighter md:text-4xl">
                  <span className="text-foreground">ONE CONTINUOUS</span><br /><span className="gradient-text">PATH</span>
                </h2>
              </div>
              <div className="hidden text-right sm:block">
                <div className="font-mono text-[9px] uppercase tracking-[0.25em] text-foreground/45">End-to-end delivery</div>
                <div className="mt-1 font-display text-3xl font-bold text-foreground/90">{stages.length}<span className="ml-1 text-sm font-normal text-foreground/45">stages</span></div>
              </div>
            </div>

            <div className="relative mt-7">
              <div className="absolute -left-px top-0 h-full w-px bg-foreground/10" />
              <motion.div style={{ scaleY: draw }} className="absolute -left-px top-0 h-full w-px origin-top bg-gradient-to-b from-accent via-accent to-secondary" />
              <div className="space-y-2.5">
                {stages.map((s, i) => <Stage key={s} i={i} progress={scrollYProgress} count={stages.length} />)}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>);

}