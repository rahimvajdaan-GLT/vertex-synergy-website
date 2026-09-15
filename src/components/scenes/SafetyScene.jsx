import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Counter from "@/components/Counter";
import { ShieldCheck, BadgeCheck } from "lucide-react";

const stats = [
  { v: 99.8, l: "Inspection Pass Rate", suffix: "%", tone: "amber" },
  { v: 100, l: "Compliance Score", suffix: "%", tone: "cyan" },
  { v: 850, l: "Training Hours", suffix: "+", tone: "amber" },
  { v: 0, l: "Harm Incidents", suffix: "", tone: "green" },
];

const certs = ["ISO 9001", "ISO 14001", "ISO 45001", "LEED", "OSHAS", "Saudi Building Code"];

function Ring({ progress, value, label, suffix = "", tone }) {
  const dash = useTransform(progress, [0.2, 0.7], [251, 251 - (value / 100) * 251], { clamp: true });
  const color = tone === "cyan" ? "#278acc" : tone === "green" ? "#34d399" : "#ff9f1c";
  return (
    <div className="flex flex-col items-center">
      <div className="relative h-28 w-28">
        <svg viewBox="0 0 100 100" className="h-full w-full -rotate-90">
          <circle cx="50" cy="50" r="40" fill="none" stroke="rgba(56,150,210,0.15)" strokeWidth="3" />
          <motion.circle cx="50" cy="50" r="40" fill="none" stroke={color} strokeWidth="3" strokeLinecap="round" strokeDasharray="251" style={{ strokeDashoffset: dash }} />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center font-display text-3xl font-bold text-foreground"><Counter to={value} suffix={suffix} /></div>
        <span className="absolute inset-0 rounded-full" style={{ boxShadow: `0 0 22px -6px ${color}55` }} />
      </div>
      <div className="mt-3 font-mono text-[8px] uppercase tracking-[0.25em] text-foreground/75">{label}</div>
    </div>
  );
}

export default function SafetyScene() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  return (
    <section id="safety" ref={ref} className="relative z-10 h-[280vh]">
      <div className="sticky top-0 h-screen overflow-hidden">
        <div className="mx-auto flex h-full max-w-5xl items-center px-6">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative w-full border border-secondary/20 bg-slate-950/10 backdrop-blur-sm clip-angular"
          >
            <span className="absolute left-0 top-0 h-8 w-8 border-l-2 border-t-2 border-accent" />
            <span className="absolute right-0 top-0 h-8 w-8 border-r-2 border-t-2 border-secondary/60" />
            <span className="absolute bottom-0 left-0 h-8 w-8 border-b-2 border-l-2 border-secondary/60" />
            <span className="absolute bottom-0 right-0 h-8 w-8 border-b-2 border-r-2 border-accent" />

            <div className="border-b border-secondary/15 px-8 py-5 md:px-12">
              <div className="flex items-center justify-between">
                <p className="font-mono text-[10px] uppercase tracking-[0.4em] text-accent">// 06 · Safety &amp; Quality</p>
                <span className="flex items-center gap-2 font-mono text-[9px] uppercase tracking-[0.25em] text-foreground/60">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_2px_rgba(52,211,153,0.6)]" /> Live · HSE
                </span>
              </div>
              <div className="mt-3 flex items-end justify-between gap-4">
                <h2 className="font-display text-4xl font-bold uppercase leading-[0.9] tracking-tighter text-foreground md:text-6xl">
                  Zero harm,<br /><span className="gradient-text">total quality</span>
                </h2>
                <ShieldCheck size={40} className="hidden shrink-0 text-accent drop-shadow-[0_0_10px_rgba(255,159,28,0.4)] md:block" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-y-10 px-8 py-10 md:grid-cols-4 md:px-12">
              {stats.map((s) => <Ring key={s.l} progress={scrollYProgress} value={s.v} label={s.l} suffix={s.suffix} tone={s.tone} />)}
            </div>

            <div className="border-t border-secondary/15 px-8 py-6 md:px-12">
              <div className="flex items-center gap-2">
                <BadgeCheck size={12} className="text-secondary" />
                <span className="font-mono text-[8px] uppercase tracking-[0.3em] text-foreground/55">Certified · Accredited</span>
              </div>
              <div className="mt-4 flex flex-wrap gap-2.5">
                {certs.map((c) => (
                  <span key={c} className="group flex items-center gap-2 border border-secondary/20 bg-gradient-to-r from-slate-900/80 to-slate-950/80 px-3.5 py-2 transition-all duration-300 hover:border-accent/60 hover:shadow-[0_0_18px_-6px_rgba(255,159,28,0.5)]">
                    <span className="h-1.5 w-1.5 rounded-full bg-accent/70 transition-colors group-hover:bg-accent" />
                    <span className="font-mono text-[9px] uppercase tracking-[0.18em] text-foreground/85 transition-colors group-hover:text-accent">{c}</span>
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}