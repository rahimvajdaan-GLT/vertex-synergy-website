import React from "react";
import { motion } from "framer-motion";
import { Building2, Factory, BedDouble, Landmark, TrainTrack, Home, Container, HardHat } from "lucide-react";
import { INDUSTRIES } from "@/lib/content";

const ICONS = { Building2, Factory, BedDouble, Landmark, TrainTrack, Home, Container, HardHat };

export default function Industries() {
  return (
    <section id="capabilities" className="relative px-6 py-28 md:px-16">
      <div className="relative mx-auto max-w-6xl">
        <div className="max-w-2xl">
          <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-amber-400">Industries We Serve</span>
          <h2 className="mt-4 font-heading text-4xl font-bold tracking-tight text-white md:text-5xl">Sectors We Build For</h2>
          <p className="mt-4 text-slate-400">Cross-discipline delivery for commercial, industrial and municipal facilities across Saudi Arabia.</p>
        </div>
        <div className="mt-12 grid grid-cols-2 gap-4 md:grid-cols-4">
          {INDUSTRIES.map((it, i) => {
            const Icon = ICONS[it.icon];
            return (
              <motion.div key={it.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: (i % 4) * 0.06 }}
                className="group rounded-2xl border border-slate-700/40 bg-[#0b0f1a]/80 p-5 transition-all hover:border-amber-500/30 hover:bg-slate-800/30">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-700/50 bg-slate-800/50 text-amber-400 transition-transform group-hover:scale-110">
                  {Icon ? <Icon size={18} /> : null}
                </div>
                <h3 className="mt-4 font-heading text-sm font-bold text-white">{it.title}</h3>
                <p className="mt-1.5 text-xs text-slate-400">{it.desc}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}