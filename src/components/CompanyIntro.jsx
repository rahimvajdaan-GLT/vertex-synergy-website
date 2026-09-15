import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Counter from "@/components/Counter";
import Building3D from "@/components/Building3D";

const stats = [
  { to: 15, suffix: "+", label: "Years of Experience" },
  { to: 150, suffix: "+", label: "Projects Completed" },
  { to: 8, suffix: "", label: "Under Construction" },
  { to: 2.4, suffix: "M m²", label: "Total Built-Up Area" },
  { to: 350, suffix: "+", label: "Skilled Professionals" },
  { to: 1.2, suffix: "M", label: "Safety Hours Achieved" },
];

export default function CompanyIntro() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const yText = useTransform(scrollYProgress, [0, 1], ["8%", "-8%"]);

  return (
    <section id="about" ref={ref} className="relative bg-background py-32 overflow-hidden">
      <div className="absolute inset-0 blueprint-grid opacity-30" />
      <div className="mx-auto max-w-[1600px] px-6 lg:px-10 relative">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* 3D building */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="lg:col-span-6 glass rounded-2xl p-6 relative"
          >
            <div className="absolute top-4 left-4 font-mono text-[9px] uppercase tracking-widest text-accent">Structural Model · Live</div>
            <div className="absolute top-4 right-4 font-mono text-[9px] uppercase tracking-widest text-muted-foreground">BIM Coordination</div>
            <Building3D />
          </motion.div>

          {/* Text + stats */}
          <motion.div style={{ y: yText }} className="lg:col-span-5 lg:col-start-8">
            <div className="font-mono text-[10px] uppercase tracking-widest text-accent mb-3">01 / Our Company</div>
            <h2 className="font-heading font-bold tracking-tighter text-4xl md:text-6xl mb-6">
              Engineering<br /><span className="text-accent">tomorrow's</span> landmarks.
            </h2>
            <p className="text-muted-foreground mb-10">
              Vertex Synergy Co. stands at the forefront of Saudi Arabia's construction industry — delivering civil engineering, MEP services, and turnkey solutions for the nation's most iconic projects, from the Makkah Train Station to 27 airports for SANS.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-px bg-border">
              {stats.map((s) => (
                <div key={s.label} className="bg-background p-5">
                  <div className="font-heading font-bold tracking-tighter text-3xl md:text-4xl text-foreground">
                    <Counter to={s.to} suffix={s.suffix} />
                  </div>
                  <div className="font-mono text-[9px] uppercase tracking-widest text-muted-foreground mt-2">{s.label}</div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}