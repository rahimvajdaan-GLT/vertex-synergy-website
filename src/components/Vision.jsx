import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Reveal from "@/components/Reveal";
import EqualizerBars from "@/components/EqualizerBars";

const stats = [
  { v: "99.99", s: "%", l: "Grid Uptime" },
  { v: "8", s: "ms", l: "Median Latency" },
  { v: "256", s: "-bit", l: "Encryption" },
  { v: "∞", s: "", l: "Horizontal Scale" },
];

export default function Vision() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y1 = useTransform(scrollYProgress, [0, 1], ["-12%", "12%"]);
  const y2 = useTransform(scrollYProgress, [0, 1], ["18%", "-18%"]);
  const rot = useTransform(scrollYProgress, [0, 1], [-8, 8]);

  return (
    <section id="vision" ref={ref} className="relative scroll-mt-24 overflow-hidden py-32">
      <motion.div
        style={{ y: y1, rotate: rot }}
        className="pointer-events-none absolute -left-40 top-0 h-[40rem] w-[40rem] rounded-full bg-accent/10 blur-[120px]"
      />
      <motion.div
        style={{ y: y2 }}
        className="pointer-events-none absolute -right-40 bottom-0 h-[36rem] w-[36rem] rounded-full bg-destructive/10 blur-[120px]"
      />
      <div className="relative mx-auto max-w-5xl px-6 text-center">
        <Reveal>
          <p className="font-mono text-[10px] uppercase tracking-[0.4em] text-secondary">// Vision</p>
        </Reveal>
        <Reveal delay={0.1}>
          <h2 className="mt-6 font-display text-4xl font-bold tracking-tight md:text-7xl">
            <span className="gradient-text">Built for the next decade</span>
            <br />
            of human-machine interaction.
          </h2>
        </Reveal>
        <Reveal delay={0.15}>
          <div className="mx-auto mt-10 h-16 w-56 opacity-60">
            <EqualizerBars count={32} />
          </div>
        </Reveal>
        <div className="mt-16 grid grid-cols-2 gap-8 md:grid-cols-4">
          {stats.map((s, i) => (
            <Reveal key={s.l} delay={i * 0.1}>
              <div className="font-display text-4xl font-bold gradient-text md:text-5xl">
                {s.v}
                <span className="text-xl">{s.s}</span>
              </div>
              <div className="mt-2 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                {s.l}
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}