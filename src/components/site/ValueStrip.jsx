import React from "react";
import { motion } from "framer-motion";
import { Cpu, Users, Leaf, Gauge, LifeBuoy } from "lucide-react";

const VALUES = [
  { Icon: Cpu, label: "BIM Driven Accuracy" },
  { Icon: Users, label: "Collaborative Workflows" },
  { Icon: Leaf, label: "Sustainable Solutions" },
  { Icon: Gauge, label: "Cost & Time Efficiency" },
  { Icon: LifeBuoy, label: "Life-Cycle Support" },
];

// Premium engineering capability summary strip that closes the stage story.
export default function ValueStrip() {
  return (
    <section className="relative z-10 border-y border-slate-700/30 bg-[#070a12]/85 px-6 py-10 backdrop-blur-xl md:px-16">
      <div className="eng-grid pointer-events-none absolute inset-0 opacity-[0.05]" />
      <div className="relative mx-auto grid max-w-6xl grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-5">
        {VALUES.map((v, i) => (
          <motion.div
            key={v.label}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08 }}
            className="group flex items-center gap-3"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-lg border border-amber-500/30 bg-amber-500/10 text-amber-400 transition-transform duration-300 group-hover:scale-110">
              <v.Icon size={18} />
            </span>
            <span className="font-mono text-[11px] uppercase tracking-[0.15em] text-slate-300">
              {v.label}
            </span>
          </motion.div>
        ))}
      </div>
    </section>
  );
}