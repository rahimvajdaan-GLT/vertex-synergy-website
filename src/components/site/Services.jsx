import React from "react";
import { motion } from "framer-motion";
import {
  Building2, Zap, Droplets, Fan, Trees, ClipboardList, Container, ShieldCheck,
} from "lucide-react";
import { SERVICES } from "@/lib/content";

const ICONS = { Building2, Zap, Droplets, Fan, Trees, ClipboardList, Container, ShieldCheck };

export default function Services() {
  return (
    <section id="services" className="relative px-6 py-28 md:px-16">
      <div className="eng-grid pointer-events-none absolute inset-0 opacity-20" />
      <div className="relative mx-auto max-w-6xl">
        <div className="max-w-2xl">
          <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-amber-400">Our Services</span>
          <h2 className="mt-4 font-heading text-4xl font-bold tracking-tight text-white md:text-5xl">Comprehensive Construction Solutions</h2>
          <p className="mt-4 text-slate-400">From concept to completion, we deliver excellence across every discipline of construction and engineering.</p>
        </div>

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {SERVICES.map((s, i) => {
            const Icon = ICONS[s.icon];
            return (
              <motion.div
                key={s.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ delay: (i % 4) * 0.08 }}
                className="group relative overflow-hidden rounded-2xl border border-slate-700/40 bg-[#0b0f1a]/80 p-6 transition-all duration-500 hover:border-amber-500/40 hover:shadow-[0_0_30px_-8px_rgba(249,115,22,0.35)]"
              >
                <div className="eng-grid-fine pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                <div className="relative">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-amber-500/30 bg-amber-500/10 text-amber-400 transition-transform duration-500 group-hover:scale-110">
                    {Icon ? <Icon size={20} /> : null}
                  </div>
                  <h3 className="mt-5 font-heading text-lg font-bold text-white">{s.title}</h3>
                  <p className="mt-1 font-mono text-[9px] uppercase tracking-[0.2em] text-slate-500">{s.sub}</p>
                  <p className="mt-3 text-sm leading-relaxed text-slate-400">{s.desc}</p>
                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {s.tags.map((t) => (
                      <span key={t} className="rounded-md border border-slate-700/50 bg-slate-800/40 px-2 py-0.5 font-mono text-[9px] uppercase tracking-wider text-slate-400">{t}</span>
                    ))}
                  </div>
                  <div className="mt-5 flex items-center justify-between border-t border-slate-700/40 pt-4">
                    <span className="font-mono text-[10px] uppercase tracking-widest text-amber-400">{s.stat}</span>
                    <span className="font-mono text-[10px] uppercase tracking-widest text-slate-500 transition-colors group-hover:text-amber-400">Explore →</span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 rounded-2xl border border-slate-700/40 bg-[#0b0f1a]/80 p-6 sm:flex-row">
          <p className="text-slate-300">Need a customized solution for your project?</p>
          <a href="#contact" className="rounded-full bg-amber-500 px-6 py-2.5 font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-950 transition-all hover:bg-amber-400">Discuss Your Project</a>
        </div>
      </div>
    </section>
  );
}