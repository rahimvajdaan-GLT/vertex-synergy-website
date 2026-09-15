import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Image } from "@/components/ui/image";
import Counter from "@/components/Counter";

const ABOUT_IMG = "https://images.unsplash.com/photo-1587582423116-ec07293f0395?w=900&q=80";

const stats = [
  { to: 150, suffix: "+", label: "Projects" },
  { to: 15, suffix: "+", label: "Years" },
  { to: 300, suffix: "+", label: "Experts" },
  { to: 300, suffix: "+", label: "Cabins" },
];

const values = [
  { title: "Precision", desc: "Every detail matters in our execution" },
  { title: "Growth", desc: "Continuous improvement in all we do" },
  { title: "Excellence", desc: "Setting industry benchmarks" },
];

export default function About() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["-10%", "10%"]);

  return (
    <section id="about" ref={ref} className="relative bg-background overflow-hidden">
      <div className="mx-auto max-w-[1600px] px-6 lg:px-10 py-32">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Image with mask reveal */}
          <div className="lg:col-span-6 relative">
            <motion.div
              initial={{ clipPath: "inset(100% 0% 0% 0%)" }}
              whileInView={{ clipPath: "inset(0% 0% 0% 0%)" }}
              viewport={{ once: true }}
              transition={{ duration: 1.2, ease: [0.76, 0, 0.24, 1] }}
              className="relative aspect-[4/5] overflow-hidden"
            >
              <motion.div style={{ y }}>
                <Image src={ABOUT_IMG} alt="Vertex Synergy temporary facility" fittingType="fill" className="w-full h-full object-cover" />
              </motion.div>
              <div className="absolute inset-0 bg-gradient-to-t from-foreground/40 to-transparent" />
              <div className="absolute bottom-6 left-6 font-mono text-[10px] uppercase tracking-widest text-background/80">
                Aramco Approved Contractor
              </div>
            </motion.div>
            <motion.div
              initial={{ pathLength: 0 }}
              whileInView={{ pathLength: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.5 }}
              className="absolute -inset-4 border border-foreground/20 pointer-events-none"
            />
          </div>

          {/* Text */}
          <div className="lg:col-span-5 lg:col-start-8">
            <div className="font-mono text-[10px] uppercase tracking-widest text-amber mb-3">01 / About Vertex Synergy</div>
            <h2 className="font-heading font-bold tracking-tighter text-4xl md:text-6xl mb-6">
              Crafting Saudi Arabia's<br /><span className="text-accent">infrastructure future.</span>
            </h2>
            <p className="text-muted-foreground mb-4">
              Vertex Synergy Co. stands at the forefront of Saudi Arabia's construction industry, delivering excellence across civil engineering, MEP services, and specialized temporary facility solutions. From the iconic Makkah Train Station to Riyadh Airport, our portfolio reflects our commitment to nation-building.
            </p>
            <p className="text-muted-foreground mb-6">
              Our expertise spans turnkey retail fit-outs with 7 Virgin Megastore projects at Avenues Mall Jeddah, 300+ portacabins for Aramco and major industrial clients, and prestigious hospitality developments including Capella Hotel Diriyah.
            </p>

            {/* Accreditations */}
            <div className="flex flex-wrap gap-2 mb-10">
              {["Trusted Partner of Haithem Ahmed Abbas Al Usta", "Aramco Approved Contractor", "ISO Certified Quality Management", "7 Virgin Megastore Projects"].map((a) => (
                <span key={a} className="font-mono text-[9px] uppercase tracking-widest border border-border text-muted-foreground px-3 py-1.5">
                  {a}
                </span>
              ))}
            </div>

            {/* Values */}
            <div className="grid grid-cols-3 gap-4 mb-10">
              {values.map((v) => (
                <div key={v.title} className="border-t-2 border-amber pt-3">
                  <div className="font-heading font-bold tracking-tighter text-lg">{v.title}</div>
                  <div className="text-xs text-muted-foreground mt-1">{v.desc}</div>
                </div>
              ))}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {stats.map((s) => (
                <div key={s.label} className="border-t border-border pt-4">
                  <div className="font-heading font-bold tracking-tighter text-3xl md:text-4xl">
                    <Counter to={s.to} suffix={s.suffix} />
                  </div>
                  <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground mt-2">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}