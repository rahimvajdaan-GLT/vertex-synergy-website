import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Search, PencilRuler, Layers, Hammer, Gauge, LifeBuoy } from "lucide-react";
import { PROCESS } from "@/lib/content";
import AnimatedHeading from "./AnimatedHeading";
import Reveal from "@/components/shared/Reveal";

gsap.registerPlugin(ScrollTrigger);

const ICONS = { Search, PencilRuler, Layers, Hammer, Gauge, LifeBuoy };

// A single animated line travels left→right through six nodes; each node
// lights up and its card rises as the line reaches it.
export default function ProcessExperience() {
  const ref = useRef(null);
  const lineRef = useRef(null);

  useEffect(() => {
    const el = ref.current;
    const line = lineRef.current;
    if (!el || !line) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(line, { scaleX: 0 }, {
        scaleX: 1, ease: "none",
        scrollTrigger: { trigger: el, start: "top 70%", end: "bottom 60%", scrub: 1.2 },
      });
      el.querySelectorAll(".proc-node").forEach((n, i) => {
        gsap.fromTo(n, { opacity: 0.25, scale: 0.85 }, {
          opacity: 1, scale: 1, ease: "power2.out",
          scrollTrigger: { trigger: el, start: `top ${70 - i * 8}%`, end: `top ${60 - i * 8}%`, scrub: 1.2 },
        });
        gsap.fromTo(n.querySelector(".proc-card"), { y: 60, opacity: 0, rotateX: 14 }, {
          y: 0, opacity: 1, rotateX: 0, duration: 0.8, ease: "expo.out",
          scrollTrigger: { trigger: n, start: "top 88%", toggleActions: "play none none reverse" },
        });
      });
      ScrollTrigger.refresh();
    }, el);
    return () => ctx.revert();
  }, []);

  return (
    <section id="process" ref={ref} data-bg="#000000" className="relative px-6 py-32 md:px-16">
      <Reveal className="relative mx-auto max-w-6xl">
        <div className="max-w-2xl">
          <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-amber-400">Engineering Process</span>
          <AnimatedHeading
            lines={["How We", "Deliver"]}
            className="mt-4 font-heading text-4xl font-bold tracking-tight text-white md:text-6xl"
          />
          <p className="mt-5 text-slate-400">A controlled, coordinated path from understanding the brief through to lifecycle support.</p>
        </div>

        <div className="relative mt-16" style={{ perspective: "900px" }}>
          <div className="absolute left-0 right-0 top-6 h-px w-full bg-slate-700/40" />
          <div ref={lineRef} className="absolute left-0 top-6 h-px w-full origin-left bg-gradient-to-r from-amber-500 via-amber-400 to-cyan-400" />
          <div className="grid gap-6 md:grid-cols-3 lg:grid-cols-6">
            {PROCESS.map((step) => {
              const Icon = ICONS[step.icon];
              return (
                <div key={step.n} className="relative">
                  <div className="proc-node absolute left-0 top-0 flex h-12 w-12 -translate-y-3 items-center justify-center rounded-full border border-amber-500/40 bg-[#0b0f1a] text-amber-400">
                    {Icon ? <Icon size={18} /> : null}
                  </div>
                  <div className="proc-card pt-16">
                    <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-slate-500">{step.n}</span>
                    <h3 className="mt-2 font-heading text-base font-bold text-white">{step.title}</h3>
                    <p className="mt-2 text-sm text-slate-400">{step.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </Reveal>
    </section>
  );
}