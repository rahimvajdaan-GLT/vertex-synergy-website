import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

const milestones = [
  { year: "2001", title: "Foundation", text: "Vertex Synergy established in Riyadh." },
  { year: "2007", title: "First Mega-Project", text: "Delivered our first airport infrastructure." },
  { year: "2014", title: "Regional Expansion", text: "Operations across 5 regions of the Kingdom." },
  { year: "2019", title: "BIM Adoption", text: "Full digital-twin workflows company-wide." },
  { year: "2023", title: "Sustainability Pledge", text: "Net-zero roadmap for all new builds." },
  { year: "2026", title: "Future Vision", text: "AI-driven autonomous construction sites." },
];

function Item({ i, progress, count }) {
  const x = useTransform(progress, [i / count, (i + 1) / count], [-60, 0], { clamp: true });
  const op = useTransform(progress, [i / count, (i + 1) / count], [0, 1], { clamp: true });
  return (
    <motion.div style={{ x, opacity: op }} className="border-l-2 border-accent/40 pl-6">
      <div className="font-display text-3xl font-bold gradient-text">{milestones[i].year}</div>
      <div className="mt-1 font-heading text-lg font-bold">{milestones[i].title}</div>
      <p className="mt-1 text-sm text-muted-foreground">{milestones[i].text}</p>
    </motion.div>
  );
}

export default function AboutScene() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  return (
    <section id="heritage" ref={ref} className="relative z-10 h-[300vh]">
      <div className="sticky top-0 h-screen overflow-hidden">
        <div className="mx-auto flex h-full max-w-4xl flex-col justify-center px-6">
          <p className="font-mono text-[10px] uppercase tracking-[0.4em] text-secondary">// 08 · Heritage</p>
          <h2 className="mt-3 font-display text-4xl font-bold tracking-tighter md:text-6xl">A timeline in <span className="gradient-text">motion</span></h2>
          <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2">
            {milestones.map((m, i) => <Item key={m.year} i={i} progress={scrollYProgress} count={milestones.length} />)}
          </div>
        </div>
      </div>
    </section>
  );
}