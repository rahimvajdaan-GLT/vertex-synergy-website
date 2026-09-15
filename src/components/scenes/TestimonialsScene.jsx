import React from "react";
import { motion } from "framer-motion";
import { Quote } from "lucide-react";

const items = [
  { quote: "Vertex Synergy delivered our flagship tower ahead of schedule and under budget. Their BIM coordination eliminated every clash before it reached the site.", name: "Khalid Al-Rashid", role: "Director, Meridian Holdings" },
  { quote: "The most disciplined construction partner we've worked with. Safety record, transparency, and quality were all exceptional across a two-year program.", name: "Sarah Lindqvist", role: "Head of Assets, Nordhavn Group" },
  { quote: "From feasibility to handover they treated our project as their own. The digital-twin reporting gave our board confidence the whole way through.", name: "Yusuf Okafor", role: "COO, Atlas Infrastructure" },
];

export default function TestimonialsScene() {
  return (
    <section id="testimonials" className="relative z-10 overflow-hidden py-28">
      <div className="blueprint-grid pointer-events-none absolute inset-0 opacity-20" />
      <div className="pointer-events-none absolute -left-32 top-1/3 h-80 w-80 rounded-full bg-secondary/15 blur-[130px]" />
      <div className="pointer-events-none absolute -right-32 bottom-1/4 h-80 w-80 rounded-full bg-accent/12 blur-[130px]" />

      <div className="relative mx-auto max-w-6xl px-6">
        <div className="flex items-center gap-3">
          <span className="h-px w-10 bg-gradient-to-r from-transparent to-accent/60" />
          <p className="font-mono text-[10px] uppercase tracking-[0.4em] text-accent">// 05 · Testimonials</p>
        </div>
        <h2 className="mt-4 font-display text-4xl font-bold uppercase leading-[0.9] tracking-tighter md:text-6xl">
          Trusted by<br /><span className="gradient-text">builders</span>
        </h2>

        <div className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-3">
          {items.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ delay: i * 0.12, duration: 0.55, ease: "easeOut" }}
              className="group relative flex flex-col border border-secondary/15 bg-slate-950/40 p-7 backdrop-blur-xl transition-all duration-500 hover:-translate-y-2 hover:border-accent/50 hover:shadow-[0_0_40px_-12px_rgba(255,159,28,0.45)]"
            >
              <span className="absolute -left-px -top-px h-5 w-5 border-l border-t border-accent/70" />
              <span className="absolute -right-px -top-px h-5 w-5 border-r border-t border-secondary/70" />
              <span className="absolute -bottom-px -left-px h-5 w-5 border-b border-l border-secondary/70" />
              <span className="absolute -bottom-px -right-px h-5 w-5 border-b border-r border-accent/70" />

              <span className="pointer-events-none absolute right-4 top-2 font-display text-7xl font-bold leading-none text-foreground/[0.04] transition-colors duration-500 group-hover:text-foreground/[0.07]">
                {String(i + 1).padStart(2, "0")}
              </span>

              <div className="relative flex items-center justify-between">
                <div className="flex h-11 w-11 items-center justify-center border border-accent/40 bg-accent/10 text-accent shadow-[0_0_18px_-4px_rgba(255,159,28,0.7)]">
                  <Quote size={18} />
                </div>
                <span className="font-mono text-[9px] uppercase tracking-[0.3em] text-secondary/60">{t.role.split(",").pop().trim()}</span>
              </div>

              <p className="relative mt-6 flex-1 text-sm leading-relaxed text-foreground/85">"{t.quote}"</p>

              <div className="mt-6 flex items-center gap-3 border-t border-secondary/15 pt-5">
                <div className="flex h-10 w-10 items-center justify-center rounded-full border border-secondary/40 bg-gradient-to-br from-secondary/20 to-accent/20 font-heading text-sm font-bold text-foreground">
                  {t.name.split(" ").map((w) => w[0]).slice(0, 2).join("")}
                </div>
                <div>
                  <div className="font-heading text-sm font-bold uppercase tracking-wide text-foreground">{t.name}</div>
                  <div className="font-mono text-[10px] uppercase tracking-widest text-secondary/70">{t.role}</div>
                </div>
              </div>

              <span className="absolute bottom-0 left-0 h-px w-0 bg-gradient-to-r from-accent to-secondary transition-all duration-500 group-hover:w-full" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}