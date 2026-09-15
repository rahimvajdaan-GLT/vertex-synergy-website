import React from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

export default function CTABanner() {
  return (
    <section className="relative z-10 overflow-hidden bg-black/40 py-24 backdrop-blur-md">
      <div className="absolute inset-0 blueprint-grid opacity-40" />
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-secondary/5 to-transparent" />
      <div className="relative mx-auto max-w-5xl px-6 text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
          <p className="font-mono text-[10px] uppercase tracking-[0.4em] text-secondary">// Let&rsquo;s build</p>
          <h2 className="mt-4 font-display text-4xl font-bold uppercase tracking-tight md:text-6xl">Ready to build <span className="gradient-text">what comes next?</span></h2>
          <p className="mx-auto mt-5 max-w-xl text-muted-foreground">Partner with Vertex Synergy Co. from blueprint to handover. Tell us about your project and we&rsquo;ll deliver a plan.</p>
          <a href="#contact" className="mt-9 inline-flex items-center gap-2 rounded-full bg-accent px-8 py-4 font-mono text-[11px] uppercase tracking-[0.25em] text-background transition-transform duration-300 hover:scale-105 glow-amber">Start Your Project <ArrowRight size={14} /></a>
        </motion.div>
      </div>
    </section>
  );
}