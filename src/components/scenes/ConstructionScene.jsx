import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { base44 } from "@/api/base44Client";
import { Construction, Wrench, Zap, Droplets, Trees, ClipboardList, Home, Shield, Layers } from "lucide-react";

const fallback = [
  { name: "Civil Engineering", description: "RCC structures, concrete construction, roads and infrastructure development for industrial and commercial projects.", layer: "50+ Projects" },
  { name: "Electrical Systems", description: "Substations, power distribution, lighting systems, and smart controls for all project types.", layer: "80+ Projects" },
  { name: "Plumbing & Drainage", description: "Water supply, drainage, sewage, fire fighting, and specialized installations for high-end projects.", layer: "60+ Projects" },
  { name: "MEP Services", description: "Integrated Mechanical, Electrical, and Plumbing services ensuring efficient execution and optimal building performance.", layer: "100+ Projects" },
  { name: "Landscape & Hardscape", description: "Master planning, irrigation, hardscape design, sports facilities, and sustainable drainage solutions.", layer: "25+ Projects" },
  { name: "Project Management", description: "End-to-end project management ensuring timely delivery, budget compliance, and quality assurance.", layer: "150+ Projects" },
  { name: "Temporary Facilities", description: "Portacabin installations for 300+ engineers, complete with MEP services and amenities.", layer: "300+ Cabins" },
  { name: "Security Systems", description: "CCTV, access control, perimeter detection, and integrated security systems for commercial and industrial facilities.", layer: "40+ Projects" },
];

const iconFor = (name) => {
  const n = (name || "").toLowerCase();
  if (n.includes("civil")) return Construction;
  if (n.includes("electr")) return Zap;
  if (n.includes("plumb") || n.includes("drain")) return Droplets;
  if (n.includes("mep")) return Wrench;
  if (n.includes("landscape") || n.includes("hardscape")) return Trees;
  if (n.includes("manage")) return ClipboardList;
  if (n.includes("temporary") || n.includes("portacabin")) return Home;
  if (n.includes("security")) return Shield;
  return Layers;
};

export default function ConstructionScene() {
  const [services, setServices] = useState(fallback);

  useEffect(() => {
    base44.entities.Service.list("order", 50).then((r) => { if (r && r.length) setServices(r); }).catch(() => {});
  }, []);

  return (
    <section id="services" className="relative z-10 overflow-hidden bg-slate-50 py-28">
      <div className="pointer-events-none absolute -left-40 top-20 h-96 w-96 rounded-full bg-orange-200/40 blur-[120px]" />
      <div className="pointer-events-none absolute -right-40 bottom-10 h-96 w-96 rounded-full bg-sky-200/40 blur-[120px]" />
      <div className="relative mx-auto max-w-6xl px-6">
        <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <div>
            <div className="flex items-center gap-3">
              <span className="h-px w-10 bg-gradient-to-r from-transparent to-orange-400/70" />
              <p className="font-mono text-[10px] uppercase tracking-[0.4em] text-orange-500">Services</p>
            </div>
            <h2 className="mt-4 font-display text-4xl font-bold uppercase tracking-tighter text-slate-900 md:text-6xl">
              Comprehensive <span className="gradient-text">Construction Solutions</span>
            </h2>
          </div>
          <p className="max-w-sm font-mono text-xs leading-relaxed text-slate-500 md:text-right">Full-spectrum delivery across every discipline — engineered to a single standard of excellence.</p>
        </div>
        <div className="mt-14 grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
          {services.map((s, i) => {
            const Icon = iconFor(s.name || s.layer || "");
            return (
              <motion.div
                key={s.name + i}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ delay: (i % 3) * 0.08, duration: 0.5 }}
                className="svc-card group relative overflow-hidden rounded-xl border border-slate-200 bg-white p-7 transition-all duration-300 hover:-translate-y-1 hover:border-orange-300 hover:shadow-xl hover:shadow-orange-100"
              >
                <span className="absolute right-4 top-4 font-mono text-[10px] font-semibold text-slate-300 transition-colors group-hover:text-orange-500">{String(i + 1).padStart(2, "0")}</span>
                <div className="relative flex h-14 w-14 items-center justify-center rounded-lg border border-orange-200 bg-orange-50 text-orange-500 transition-all duration-300 group-hover:border-orange-400 group-hover:bg-orange-100 group-hover:shadow-[0_0_22px_-4px_rgba(255,159,28,0.45)]">
                  <Icon size={24} strokeWidth={1.6} />
                </div>
                <h3 className="mt-6 font-heading text-base font-bold uppercase tracking-wide text-slate-900">{s.name}</h3>
                <p className="mt-3 text-sm leading-relaxed text-slate-600">{s.description}</p>
                <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-4">
                  <span className="font-mono text-[10px] uppercase tracking-widest text-orange-500">{s.layer || `SYS ${String(i + 1).padStart(2, "0")}`}</span>
                  <span className="h-1.5 w-1.5 rounded-full bg-sky-300 transition-all duration-300 group-hover:bg-orange-500 group-hover:shadow-[0_0_10px_2px_rgba(255,159,28,0.5)]" />
                </div>
                <span className="absolute bottom-0 left-0 h-px w-0 bg-gradient-to-r from-orange-500 to-sky-400 transition-all duration-500 group-hover:w-full" />
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}