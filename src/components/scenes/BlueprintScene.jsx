import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Counter from "@/components/Counter";

const stats = [
{ v: 150, s: "+", l: "Projects Completed" },
{ v: 27, s: "", l: "Airports (SANS)" },
{ v: 300, s: "+", l: "Portacabins" },
{ v: 15, s: "+", l: "Years Experience" },
{ v: 80, s: "+", l: "Expert Team" },
{ v: 40, s: "+", l: "Happy Clients" }];


export default function BlueprintScene() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const titleY = useTransform(scrollYProgress, [0, 0.5], ["20%", "0%"]);
  const draw = useTransform(scrollYProgress, [0.15, 0.6], [0, 1]);

  return (
    <section id="about" ref={ref} className="relative z-10 h-[260vh]">
      <div className="sticky top-0 flex h-screen items-center overflow-hidden blueprint-grid">
        <div className="mx-auto w-full max-w-6xl px-6">
          <motion.div style={{ y: titleY }} className="text-center">
            <p className="font-mono text-xs uppercase tracking-[0.4em] text-accent drop-shadow-[0_2px_6px_rgba(255,159,28,0.4)]">About</p>
            <h2 className="mt-4 font-display text-5xl font-bold uppercase tracking-tighter gradient-text md:text-8xl">VERTEX SYNERGY</h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg font-medium leading-relaxed text-foreground/95 drop-shadow-[0_2px_8px_rgba(15,23,42,0.65)]">Vertex Synergy Co. stands at the forefront of Saudi Arabia&rsquo;s construction industry, delivering excellence across civil engineering, MEP services, and specialized temporary facility solutions — from the iconic Makkah Train Station to Riyadh Airport.</p>
          </motion.div>
          <div className="relative mt-16 grid grid-cols-2 gap-3 md:grid-cols-6 md:gap-4">
            {stats.map((st, i) =>
            <motion.div key={st.l} initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }} className="group relative overflow-hidden border border-secondary/25 bg-slate-900/55 p-5 backdrop-blur-md transition-all duration-300 hover:border-accent/60 hover:bg-slate-900/75 hover:shadow-[0_0_26px_-8px_rgba(255,159,28,0.5)]">
                <span className="absolute left-2 top-2 font-mono text-[8px] text-secondary/70">P{i + 1}</span>
                <div className="font-display text-3xl font-bold gradient-text md:text-4xl"><Counter to={st.v} suffix={st.s} /></div>
                <div className="mt-1 font-mono text-[9px] uppercase tracking-widest text-foreground/75">{st.l}</div>
                <span className="absolute right-0 top-0 h-3 w-px bg-accent/60" />
                <span className="absolute right-0 top-0 h-px w-3 bg-accent/60" />
                <span className="absolute bottom-0 left-0 h-3 w-px bg-secondary/60" />
                <span className="absolute bottom-0 left-0 h-px w-3 bg-secondary/60" />
              </motion.div>
            )}
          </div>
          <motion.svg style={{ opacity: draw }} viewBox="0 0 1200 40" className="mx-auto mt-10 h-10 w-full max-w-5xl" preserveAspectRatio="none">
            <motion.line x1="0" y1="20" x2="1200" y2="20" stroke="#4b9fd8" strokeWidth="1" strokeDasharray="6 6" />
          </motion.svg>
        </div>
      </div>
    </section>);

}