import React from "react";
import { motion } from "framer-motion";
import { Layers, Workflow, Gauge, LifeBuoy, HardHat, Users, BadgeCheck } from "lucide-react";
import { ABOUT } from "@/lib/content";

const ICONS = { Layers, Workflow, Gauge, LifeBuoy, HardHat, Users };

export default function About() {
  return (
    <section id="about" className="relative px-6 py-28 md:px-16">
      <div className="relative mx-auto max-w-6xl">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-6">
            <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-amber-400">{ABOUT.kicker}</span>
            <h2 className="mt-4 font-heading text-4xl font-bold tracking-tight text-white md:text-5xl">{ABOUT.title}</h2>
            <div className="mt-6 space-y-4">
              {ABOUT.body.map((p, i) => (
                <motion.p key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                  className="text-slate-300 leading-relaxed">{p}</motion.p>
              ))}
            </div>
            <div className="mt-8 flex flex-wrap gap-2">
              {ABOUT.badges.map((b) => (
                <span key={b} className="inline-flex items-center gap-1.5 rounded-full border border-slate-700/50 bg-slate-800/30 px-3 py-1.5 text-xs text-slate-300">
                  <BadgeCheck size={13} className="text-amber-400" /> {b}
                </span>
              ))}
            </div>
          </div>

          <div className="lg:col-span-6">
            <div className="grid gap-4 sm:grid-cols-2">
              {ABOUT.principles.map((pr, i) => {
                const Icon = ICONS[pr.icon];
                return (
                  <motion.div key={pr.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}
                    className="group rounded-2xl border border-slate-700/40 bg-[#0b0f1a]/80 p-5 transition-colors hover:border-amber-500/30">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-amber-500/30 bg-amber-500/10 text-amber-400">{Icon ? <Icon size={18} /> : null}</div>
                    <h3 className="mt-4 font-heading text-base font-bold text-white">{pr.title}</h3>
                    <p className="mt-2 text-sm text-slate-400">{pr.desc}</p>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}