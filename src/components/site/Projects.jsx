import React, { useState } from "react";
import { motion } from "framer-motion";
import { PROJECTS } from "@/lib/content";

const FILTERS = ["All", "Infrastructure", "Hospitality", "Retail", "Temporary Facility", "Commercial", "Residential"];

export default function Projects() {
  const [filter, setFilter] = useState("All");
  const list = filter === "All" ? PROJECTS : PROJECTS.filter((p) => p.sector === filter);

  return (
    <section id="projects" className="relative px-6 py-28 md:px-16">
      <div className="relative mx-auto max-w-6xl">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div className="max-w-2xl">
            <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-amber-400">Our Projects</span>
            <h2 className="mt-4 font-heading text-4xl font-bold tracking-tight text-white md:text-5xl">Featured Projects</h2>
            <p className="mt-4 text-slate-400">Showcasing our expertise across infrastructure, hospitality, retail, and industrial sectors in Saudi Arabia.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {FILTERS.map((f) => (
              <button key={f} onClick={() => setFilter(f)}
                className={`rounded-full px-3 py-1.5 font-mono text-[10px] uppercase tracking-widest transition-colors ${
                  filter === f ? "bg-amber-500 text-slate-950" : "border border-slate-700/50 text-slate-400 hover:text-amber-300"
                }`}>{f}</button>
            ))}
          </div>
        </div>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((p, i) => (
            <motion.article key={p.title}
              initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-60px" }} transition={{ delay: (i % 3) * 0.08 }}
              className="group relative overflow-hidden rounded-2xl border border-slate-700/40 bg-[#0b0f1a]/80">
              <div className="relative h-52 overflow-hidden">
                <div className="eng-grid pointer-events-none absolute inset-0 z-10 opacity-30" />
                <img src={p.image} alt={p.title} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0b0f1a] via-transparent to-transparent" />
                <div className="absolute left-3 top-3 z-20 flex items-center gap-2">
                  <span className={`rounded-full px-2.5 py-1 font-mono text-[9px] uppercase tracking-widest ${p.status === "Ongoing" ? "bg-amber-500/90 text-slate-950" : "bg-slate-900/80 text-amber-300"}`}>{p.status}</span>
                  <span className="rounded-full bg-slate-900/70 px-2.5 py-1 font-mono text-[9px] uppercase tracking-widest text-slate-300">{p.sector}</span>
                </div>
              </div>
              <div className="p-5">
                <div className="font-mono text-[9px] uppercase tracking-[0.2em] text-slate-500">{p.location}</div>
                <h3 className="mt-1 font-heading text-lg font-bold text-white">{p.title}</h3>
                <div className="mt-3 h-px w-0 bg-gradient-to-r from-amber-500 to-transparent transition-all duration-500 group-hover:w-16" />
                <p className="mt-3 text-sm text-slate-400">{p.scope}</p>
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {p.tags.map((t) => (
                    <span key={t} className="rounded-md border border-slate-700/50 bg-slate-800/40 px-2 py-0.5 font-mono text-[9px] uppercase tracking-wider text-slate-400">{t}</span>
                  ))}
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}