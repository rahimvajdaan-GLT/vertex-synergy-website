import React from "react";
import { motion } from "framer-motion";
import Counter from "@/components/Counter";
import { ShieldCheck, BadgeCheck, Leaf, AlertOctagon } from "lucide-react";

const stats = [
  { to: 1.2, suffix: "M", label: "Safety Hours" },
  { to: 0, suffix: "", label: "Lost-Time Incidents" },
  { to: 100, suffix: "%", label: "Inspection Compliance" },
  { to: 48, suffix: "+", label: "Certifications" },
];

const badges = ["ISO 9001 Quality", "ISO 45001 Safety", "ISO 14001 Environment", "Aramco Approved", "Saudi Building Code", "Zero-Harm Certified"];

function ProgressRing({ value }) {
  const R = 52;
  const C = 2 * Math.PI * R;
  return (
    <svg viewBox="0 0 120 120" className="w-32 h-32">
      <circle cx="60" cy="60" r={R} fill="none" stroke="#262A33" strokeWidth="6" />
      <motion.circle
        cx="60" cy="60" r={R} fill="none" stroke="#FF6A1A" strokeWidth="6" strokeLinecap="round"
        strokeDasharray={C}
        initial={{ strokeDashoffset: C }}
        whileInView={{ strokeDashoffset: C - (C * value) / 100 }}
        viewport={{ once: true }}
        transition={{ duration: 1.4, ease: "easeOut" }}
        transform="rotate(-90 60 60)"
      />
      <text x="60" y="66" textAnchor="middle" className="fill-foreground font-bold" style={{ fontSize: 22 }}>{value}%</text>
    </svg>
  );
}

export default function Safety() {
  return (
    <section id="safety" className="relative bg-card py-32 overflow-hidden">
      <div className="absolute inset-0 blueprint-grid-fine opacity-20" />
      <div className="mx-auto max-w-[1600px] px-6 lg:px-10 relative">
        <div className="font-mono text-[10px] uppercase tracking-widest text-accent mb-3">06 / Safety & Quality</div>
        <h2 className="font-heading font-bold tracking-tighter text-5xl md:text-7xl mb-16">
          Zero harm.<br /><span className="text-accent">Absolute quality.</span>
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center mb-16">
          <div className="lg:col-span-5 grid grid-cols-2 gap-px bg-border">
            {stats.map((s) => (
              <div key={s.label} className="bg-card p-6">
                <div className="font-heading font-bold tracking-tighter text-4xl text-foreground">
                  <Counter to={s.to} suffix={s.suffix} />
                </div>
                <div className="font-mono text-[9px] uppercase tracking-widest text-muted-foreground mt-2">{s.label}</div>
              </div>
            ))}
          </div>

          <div className="lg:col-span-7 flex flex-wrap items-center justify-center gap-10">
            <div className="flex flex-col items-center">
              <ProgressRing value={99} />
              <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground mt-3">Safety Compliance</span>
            </div>
            <div className="flex flex-col items-center">
              <ProgressRing value={100} />
              <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground mt-3">Quality Pass Rate</span>
            </div>
            <div className="flex flex-col items-center">
              <ProgressRing value={95} />
              <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground mt-3">On-Time Delivery</span>
            </div>
          </div>
        </div>

        {/* Certifications */}
        <div className="flex flex-wrap gap-3">
          {badges.map((b) => (
            <motion.span
              key={b}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="glass rounded-full px-4 py-2 font-mono text-[10px] uppercase tracking-widest text-foreground/80 flex items-center gap-2"
            >
              <BadgeCheck size={13} className="text-accent" /> {b}
            </motion.span>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-12">
          {[
            { icon: ShieldCheck, t: "Quality Assurance", d: "Continuous inspection and testing at every stage of delivery." },
            { icon: Leaf, t: "Environmental Commitment", d: "Sustainable practices minimizing environmental impact." },
            { icon: AlertOctagon, t: "Zero-Harm Objective", d: "Relentless focus on a zero-incident workplace." },
          ].map((x) => (
            <div key={x.t} className="glass rounded-2xl p-6">
              <x.icon size={24} className="text-accent mb-4" />
              <h3 className="font-heading font-bold tracking-tighter text-lg mb-2">{x.t}</h3>
              <p className="text-sm text-muted-foreground">{x.d}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}