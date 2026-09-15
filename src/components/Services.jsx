import React, { useRef } from "react";
import { motion } from "framer-motion";
import {
  HardHat, Building2, Construction, Wrench, Waypoints, Paintbrush,
  ClipboardCheck, PenTool, Cpu, FlaskConical, ArrowUpRight,
} from "lucide-react";

const services = [
  { icon: HardHat, title: "General Contracting", desc: "End-to-end project delivery from procurement to handover." },
  { icon: Building2, title: "Civil Works", desc: "RCC structures, concrete, roads, and infrastructure." },
  { icon: Construction, title: "Structural Works", desc: "Foundations and structural frameworks built to last." },
  { icon: Wrench, title: "MEP Works", desc: "Integrated mechanical, electrical, and plumbing systems." },
  { icon: Waypoints, title: "Infrastructure", desc: "Transport, utilities, and large-scale site development." },
  { icon: Paintbrush, title: "Fit-Out Works", desc: "Turnkey interior fit-outs for retail and hospitality." },
  { icon: ClipboardCheck, title: "Project Management", desc: "Planning, scheduling, and quality assurance end-to-end." },
  { icon: PenTool, title: "Design Coordination", desc: "Multi-discipline coordination across all trades." },
  { icon: Cpu, title: "BIM & Digital Construction", desc: "Building information modeling and digital delivery." },
  { icon: FlaskConical, title: "Testing & Commissioning", desc: "Commissioning, testing, and performance validation." },
];

function ServiceTile({ s, i }) {
  const ref = useRef(null);
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, delay: (i % 5) * 0.07 }}
      whileHover={{ y: -6 }}
      data-hover
      className="group relative glass rounded-2xl p-8 hover:border-accent/40 transition-colors overflow-hidden"
    >
      <div className="absolute -top-10 -right-10 w-32 h-32 bg-accent/10 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <div className="relative">
        <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center mb-5 group-hover:bg-accent transition-colors duration-300">
          <s.icon size={22} className="text-accent group-hover:text-accent-foreground transition-colors" />
        </div>
        <h3 className="font-heading font-bold tracking-tighter text-xl mb-2">{s.title}</h3>
        <p className="text-sm text-muted-foreground mb-5">{s.desc}</p>
        <span className="font-mono text-[10px] uppercase tracking-widest text-accent flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          View Details <ArrowUpRight size={12} />
        </span>
      </div>
      <div className="absolute bottom-0 left-0 h-0.5 bg-accent w-0 group-hover:w-full transition-all duration-500" />
    </motion.div>
  );
}

export default function Services() {
  return (
    <section id="services" className="relative bg-background py-32 overflow-hidden">
      <div className="absolute inset-0 blueprint-grid opacity-25" />
      <div className="mx-auto max-w-[1600px] px-6 lg:px-10 relative">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-16">
          <div className="md:col-span-7">
            <div className="font-mono text-[10px] uppercase tracking-widest text-accent mb-3">03 / What We Do</div>
            <h2 className="font-heading font-bold tracking-tighter text-5xl md:text-7xl">
              Comprehensive<br /><span className="text-accent">construction solutions.</span>
            </h2>
          </div>
          <div className="md:col-span-4 md:col-start-9 self-end">
            <p className="text-muted-foreground">
              From concept to completion — every discipline of construction and engineering under one roof.
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
          {services.map((s, i) => (
            <ServiceTile key={s.title} s={s} i={i} />
          ))}
        </div>
      </div>
    </section>
  );
}