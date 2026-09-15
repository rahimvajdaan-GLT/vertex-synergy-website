import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Lightbulb, ClipboardList, PenTool, Package, HardHat, ShieldCheck, Gauge, KeyRound } from "lucide-react";

const steps = [
  { num: "01", icon: Lightbulb, title: "Concept", desc: "Feasibility, scope definition, and vision alignment." },
  { num: "02", icon: ClipboardList, title: "Planning", desc: "Scheduling, budgeting, and resource strategy." },
  { num: "03", icon: PenTool, title: "Design Coordination", desc: "Multi-discipline drawings and clash detection." },
  { num: "04", icon: Package, title: "Procurement", desc: "Sourcing, vendor management, and logistics." },
  { num: "05", icon: HardHat, title: "Construction", desc: "Execution on site with precision and safety." },
  { num: "06", icon: ShieldCheck, title: "Quality Control", desc: "Inspection, testing, and continuous monitoring." },
  { num: "07", icon: Gauge, title: "Testing & Commissioning", desc: "Performance validation and systems commissioning." },
  { num: "08", icon: KeyRound, title: "Handover", desc: "Final delivery, documentation, and handover." },
];

export default function Process() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const x = useTransform(scrollYProgress, [0, 1], ["0%", "-78%"]);
  const lineWidth = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <section ref={ref} className="relative h-[300vh] bg-card overflow-hidden">
      <div className="absolute inset-0 blueprint-grid-fine opacity-20" />
      <div className="sticky top-0 h-screen flex flex-col">
        <div className="pt-28 px-6 lg:px-10 max-w-[1600px] mx-auto w-full">
          <div className="font-mono text-[10px] uppercase tracking-widest text-accent mb-3">04 / Our Process</div>
          <h2 className="font-heading font-bold tracking-tighter text-5xl md:text-7xl">From blueprint to handover.</h2>
        </div>

        <motion.div style={{ x }} className="flex items-center gap-8 pl-[6vw] mt-16">
          {steps.map((s, i) => (
            <motion.div
              key={s.num}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="shrink-0 w-[70vw] md:w-[34vw] glass rounded-2xl p-8 relative"
            >
              <div className="flex items-center justify-between mb-6">
                <span className="font-mono text-[10px] uppercase tracking-widest text-accent">{s.num}</span>
                <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center">
                  <s.icon size={22} className="text-accent" />
                </div>
              </div>
              <h3 className="font-heading font-bold tracking-tighter text-3xl mb-2">{s.title}</h3>
              <p className="text-muted-foreground">{s.desc}</p>
              <div className="mt-6 h-px bg-border relative">
                <motion.div className="absolute left-0 top-0 h-full bg-accent" initial={{ width: 0 }} whileInView={{ width: "100%" }} viewport={{ once: true }} transition={{ duration: 0.8, delay: 0.2 }} />
              </div>
            </motion.div>
          ))}
        </motion.div>

        <div className="mt-auto mb-10 px-6 lg:px-10 max-w-[1600px] mx-auto w-full">
          <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-widest text-muted-foreground mb-2">
            <span>Construction Sequence</span>
            <span>8 Stages</span>
          </div>
          <div className="h-px bg-border relative">
            <motion.div className="absolute left-0 top-0 h-full bg-accent" style={{ width: lineWidth }} />
          </div>
        </div>
      </div>
    </section>
  );
}