import React from "react";
import { motion } from "framer-motion";
import { Search, PencilRuler, Layers, Hammer, Gauge, LifeBuoy } from "lucide-react";
import { PROCESS } from "@/lib/content";

const ICONS = { Search, PencilRuler, Layers, Hammer, Gauge, LifeBuoy };

export default function Process() {
  return (
    <section className="relative px-6 py-28 md:px-16">
      <div className="relative mx-auto max-w-6xl">
        <div className="max-w-2xl">
          <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-amber-400">Engineering Process</span>
          <h2 className="mt-4 font-heading text-4xl font-bold tracking-tight text-white md:text-5xl">How We Deliver</h2>
          <p className="mt-4 text-slate-400">A controlled, coordinated path from understanding the brief through to lifecycle support.</p>
        </div>

        <div className="relative mt-14">
          <div className="absolute left-0 top-0 hidden h-px w-full bg-gradient-to-r from-transparent via-slate-700/50 to-transparent lg:block" />
          <div className="grid gap-6 md:grid-cols-3 lg:grid-cols-6">
            {PROCESS.map((step, i) => {
              const Icon = ICONS[step.icon];
              return (
                <motion.div key={step.n} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}
                  className="relative">
                  <div className="flex items-center gap-3 lg:flex-col lg:items-start">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-amber-500/30 bg-amber-500/10 text-amber-400">
                      {Icon ? <Icon size={20} /> : null}
                    </div>
                    <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-slate-500">{step.n}</span>
                  </div>
                  <h3 className="mt-4 font-heading text-base font-bold text-white">{step.title}</h3>
                  <p className="mt-2 text-sm text-slate-400">{step.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}