import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { Image } from "@/components/ui/image";
import { ArrowUpRight } from "lucide-react";

const categories = ["All", "Commercial", "Residential", "Hospitality", "Infrastructure", "Industrial", "Healthcare", "Government", "Ongoing", "Completed"];

export default function ProjectsScene() {
  const [projects, setProjects] = useState([]);
  const [filter, setFilter] = useState("All");

  useEffect(() => {
    base44.entities.Project.list("-featured", 30).then(setProjects).catch(() => {});
  }, []);

  const shown = projects.filter((p) =>
    filter === "All" ? true : filter === "Ongoing" ? p.status === "Ongoing" : filter === "Completed" ? p.status === "Completed" : p.category === filter
  );

  return (
    <section id="projects" className="relative z-10 overflow-hidden bg-white py-24">
      <div className="blueprint-grid pointer-events-none absolute inset-0 opacity-[0.07]" />
      <div className="pointer-events-none absolute -right-40 top-10 h-96 w-96 rounded-full bg-orange-200/40 blur-[120px]" />
      <div className="relative mx-auto max-w-6xl px-6">
        <div className="flex flex-col items-center text-center">
          <div className="flex items-center gap-3">
            <span className="h-px w-10 bg-gradient-to-r from-transparent to-orange-400/70" />
            <p className="font-mono text-[10px] uppercase tracking-[0.4em] text-orange-500">Projects</p>
            <span className="h-px w-10 bg-gradient-to-l from-transparent to-orange-400/70" />
          </div>
          <h2 className="mt-4 font-display text-5xl font-bold uppercase leading-[0.9] tracking-tighter text-slate-900 md:text-7xl">
            Selected<br />
            <span className="gradient-text">Work</span>
          </h2>
        </div>
        <div className="mt-8 flex items-center justify-center gap-2 overflow-x-auto no-scrollbar">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setFilter(c)}
              className={`whitespace-nowrap rounded-full border px-3.5 py-1 font-mono text-[9px] uppercase tracking-[0.2em] transition-all ${
                filter === c
                  ? "border-orange-400 bg-orange-50 text-orange-600 shadow-[0_0_14px_-4px_rgba(255,159,28,0.5)]"
                  : "border-slate-200 text-slate-500 hover:border-slate-300 hover:text-slate-800"
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        <div className="mt-12 grid grid-cols-2 gap-4 lg:grid-cols-4 lg:gap-5">
          {shown.map((p, i) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ delay: (i % 4) * 0.07, duration: 0.45 }}
              className="group relative flex flex-col overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-orange-300 hover:shadow-xl hover:shadow-orange-100"
            >
              <Link to={`/project/${p.id}`} className="block">
                <div className="relative aspect-square overflow-hidden bg-slate-100">
                  {p.main_image && <Image src={p.main_image} alt={p.title} fittingType="fill" className="h-full w-full transition-transform duration-700 group-hover:scale-110" />}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                  <span className={`absolute left-3 top-3 flex items-center gap-1.5 rounded-full border bg-white/85 px-2 py-1 backdrop-blur-sm ${p.status === "Ongoing" ? "border-emerald-300" : "border-orange-300"}`}>
                    <span className={`h-1.5 w-1.5 rounded-full ${p.status === "Ongoing" ? "bg-emerald-500" : "bg-orange-500"}`} />
                    <span className={`font-mono text-[8px] uppercase tracking-[0.25em] ${p.status === "Ongoing" ? "text-emerald-600" : "text-orange-600"}`}>{p.status}</span>
                  </span>
                  <span className="absolute right-3 top-3 font-mono text-[10px] font-semibold text-white drop-shadow">{String(i + 1).padStart(2, "0")}</span>
                  <span className="absolute right-3 bottom-3 flex h-8 w-8 items-center justify-center rounded-full border border-white/40 bg-white/80 text-orange-500 opacity-0 backdrop-blur-sm transition-all duration-300 group-hover:opacity-100">
                    <ArrowUpRight size={14} />
                  </span>
                </div>
                <div className="border-t border-slate-100 px-4 py-3.5">
                  <h3 className="font-heading text-sm font-bold leading-tight tracking-tight text-slate-900 transition-colors group-hover:text-orange-600">{p.title}</h3>
                  <p className="mt-1 font-mono text-[8px] uppercase tracking-[0.2em] text-slate-500">{p.location || "—"}</p>
                </div>
              </Link>
              <span className="absolute bottom-0 left-0 h-px w-0 bg-gradient-to-r from-orange-500 to-sky-400 transition-all duration-500 group-hover:w-full" />
            </motion.div>
          ))}
        </div>

        {shown.length === 0 && (
          <div className="mt-16 rounded-lg border border-dashed border-slate-200 py-20 text-center font-mono text-xs uppercase tracking-widest text-slate-400">
            No projects in this category
          </div>
        )}
      </div>
    </section>
  );
}