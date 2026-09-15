import React from "react";
import { motion } from "framer-motion";

const clients = ["SANS", "Saudi Aramco", "Capella", "Royal Commission", "Virgin Megastore", "Farsi Group", "Nawas International", "Ford", "Mitsubishi", "FISIA", "KAEC", "House of Saud"];

function Row({ direction = "left", speed = 38 }) {
  const doubled = [...clients, ...clients];
  return (
    <div className="relative flex overflow-hidden py-2">
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-background to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-background to-transparent" />
      <motion.div
        className="flex shrink-0 items-center gap-3"
        animate={{ x: direction === "left" ? ["0%", "-50%"] : ["-50%", "0%"] }}
        transition={{ duration: speed, repeat: Infinity, ease: "linear" }}
      >
        {doubled.map((c, i) => (
          <div key={i} className="group flex items-center gap-3 whitespace-nowrap px-6">
            <span className="flex h-9 w-9 items-center justify-center border border-secondary/25 bg-slate-950/40 font-mono text-[11px] font-bold text-accent/70 transition-all duration-300 group-hover:border-accent/60 group-hover:text-accent group-hover:shadow-[0_0_16px_-4px_rgba(255,159,28,0.7)]">
              {c.split(" ").map((w) => w[0]).slice(0, 2).join("")}
            </span>
            <span className="font-heading text-xl font-bold tracking-tight text-foreground/45 transition-colors duration-300 group-hover:text-foreground">{c}</span>
            <span className="ml-3 h-1 w-1 rounded-full bg-secondary/40" />
          </div>
        ))}
      </motion.div>
    </div>
  );
}

export default function ClientsScene() {
  return (
    <section id="clients" className="relative z-10 overflow-hidden py-24">
      <div className="blueprint-grid pointer-events-none absolute inset-0 opacity-20" />
      <div className="pointer-events-none absolute -left-32 top-0 h-72 w-72 rounded-full bg-secondary/15 blur-[120px]" />
      <div className="pointer-events-none absolute -right-32 bottom-0 h-72 w-72 rounded-full bg-accent/12 blur-[120px]" />

      <div className="relative mx-auto max-w-6xl px-6 text-center">
        <div className="flex items-center justify-center gap-3">
          <span className="h-px w-10 bg-gradient-to-r from-transparent to-accent/60" />
          <p className="font-mono text-[10px] uppercase tracking-[0.4em] text-accent">// 09 · Clients & Partners</p>
          <span className="h-px w-10 bg-gradient-to-l from-transparent to-accent/60" />
        </div>
        <h2 className="mt-4 font-display text-4xl font-bold uppercase leading-[0.9] tracking-tighter md:text-6xl">
          A connected<br /><span className="gradient-text">network</span>
        </h2>
        <p className="mx-auto mt-5 max-w-xl text-sm text-foreground/60">
          Trusted by government authorities, global brands, and regional developers to deliver landmark projects end-to-end.
        </p>
      </div>

      <div className="relative mt-14 space-y-1 border-y border-secondary/15 bg-slate-950/25 py-4 backdrop-blur-sm">
        <Row direction="left" speed={42} />
        <Row direction="right" speed={48} />
      </div>
    </section>
  );
}