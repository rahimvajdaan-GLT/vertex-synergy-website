import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Quote, ChevronLeft, ChevronRight } from "lucide-react";

const testimonials = [
  {
    name: "Eng. Khalid Al-Harbi",
    company: "Saudi Air Navigation Services",
    position: "Director of Infrastructure",
    project: "27 Airports Project",
    text: "Vertex Synergy delivered electrical and MEP works across 27 airports with remarkable precision and coordination. Their commitment to safety and schedule was exemplary.",
  },
  {
    name: "Sarah Mitchell",
    company: "Virgin Megastore",
    position: "Regional Facilities Lead",
    project: "7 Stores Turnkey Fit-Out",
    text: "The turnkey fit-out of seven Virgin Megastore locations was executed flawlessly — on time, on budget, and to the highest retail standards we've seen in the region.",
  },
  {
    name: "Mohammed Al-Otaibi",
    company: "Aramco PetroRabigh",
    position: "Project Manager",
    project: "Temporary Facility Camp",
    text: "From portacabin installation to full MEP, Vertex delivered a 300-engineer facility that exceeded expectations. A trusted partner for industrial accommodation.",
  },
  {
    name: "Lina Farah",
    company: "Capella Diriyah",
    position: "Design Coordinator",
    project: "Capella Hotel Diriyah",
    text: "Working on an ultra-luxury Najdi-architecture project demands exacting quality. Vertex's electrical and plumbing teams have been outstanding collaborators.",
  },
];

export default function Testimonials() {
  const [i, setI] = useState(0);
  const t = testimonials[i];
  const go = (d) => setI((p) => (p + d + testimonials.length) % testimonials.length);

  return (
    <section className="relative bg-card py-32 overflow-hidden">
      <div className="absolute top-1/3 left-1/4 w-[400px] h-[400px] bg-accent/10 rounded-full blur-[150px]" />
      <div className="mx-auto max-w-[1600px] px-6 lg:px-10 relative">
        <div className="font-mono text-[10px] uppercase tracking-widest text-accent mb-3">08 / Testimonials</div>
        <h2 className="font-heading font-bold tracking-tighter text-5xl md:text-7xl mb-12">What clients say.</h2>

        <div className="relative max-w-4xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={i}
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.4 }}
              className="glass rounded-2xl p-8 md:p-12 relative"
            >
              <Quote size={40} className="text-accent/30 mb-6" />
              <p className="text-xl md:text-2xl text-foreground/90 leading-relaxed mb-8">"{t.text}"</p>
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div>
                  <div className="font-heading font-bold tracking-tighter text-lg">{t.name}</div>
                  <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground mt-1">
                    {t.position} · {t.company}
                  </div>
                </div>
                <div className="glass-strong rounded-full px-4 py-2 font-mono text-[10px] uppercase tracking-widest text-accent">
                  {t.project}
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          <div className="flex items-center justify-between mt-8">
            <div className="flex gap-2">
              {testimonials.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setI(idx)}
                  className={`h-2 rounded-full transition-all ${idx === i ? "w-8 bg-accent" : "w-2 bg-border"}`}
                />
              ))}
            </div>
            <div className="flex gap-3">
              <button onClick={() => go(-1)} data-hover className="w-11 h-11 glass rounded-full flex items-center justify-center hover:border-accent transition-colors">
                <ChevronLeft size={18} />
              </button>
              <button onClick={() => go(1)} data-hover className="w-11 h-11 glass rounded-full flex items-center justify-center hover:border-accent transition-colors">
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}