import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  Building2, Zap, Droplets, Fan, Trees, ClipboardList, Container, ShieldCheck,
} from "lucide-react";
import { SERVICES } from "@/lib/content";
import AnimatedHeading from "./AnimatedHeading";
import BlueprintLayer from "./BlueprintLayer";
import Reveal from "@/components/shared/Reveal";

gsap.registerPlugin(ScrollTrigger);

const ICONS = { Building2, Zap, Droplets, Fan, Trees, ClipboardList, Container, ShieldCheck };

export default function ServicesExperience() {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ctx = gsap.context(() => {
      const grid = el.querySelector(".svc-grid");
      const mods = el.querySelectorAll(".svc-module");
      if (!grid || !mods.length) return;
      gsap.fromTo(
        mods,
        { y: 120, opacity: 0, scale: 0.9 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.9,
          ease: "power3.out",
          stagger: 0.08,
          scrollTrigger: { trigger: grid, start: "top 85%", toggleActions: "play none none reverse" },
        }
      );
      ScrollTrigger.refresh();
    }, el);
    return () => ctx.revert();
  }, []);

  return (
    <section id="services" ref={ref} data-bg="#000000" className="relative px-6 py-32 md:px-16">
      <BlueprintLayer className="absolute inset-0 h-full w-full" color="#38bdf8" opacity={0.1} />
      <Reveal className="relative mx-auto max-w-6xl">
        <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-amber-400">Our Services</span>
        <AnimatedHeading
          lines={["Comprehensive", "Construction Solutions"]}
          className="mt-4 font-heading text-4xl font-bold tracking-tight text-white md:text-6xl"
        />
        <p className="mt-5 max-w-2xl text-slate-400">
          From concept to completion, we deliver excellence across every discipline of construction and engineering.
        </p>

        <div className="svc-grid mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {SERVICES.map((s) => {
            const Icon = ICONS[s.icon];
            return (
              <div
                key={s.title}
                data-cursor
                className="svc-module sheen group relative overflow-hidden rounded-2xl border border-slate-700/40 bg-[#0b0f1a]/70 p-6 backdrop-blur-sm transition-all duration-500 hover:-translate-y-1.5 hover:border-amber-500/40 hover:shadow-[0_20px_50px_-12px_rgba(249,115,22,0.35)]"
                style={{ willChange: "transform, opacity" }}
              >
                <div className="eng-grid-fine pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                <div className="relative z-10">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-amber-500/30 bg-amber-500/10 text-amber-400 transition-transform duration-500 group-hover:scale-110">
                    {Icon ? <Icon size={20} /> : null}
                  </div>
                  <h3 className="mt-5 font-heading text-lg font-bold text-white">{s.title}</h3>
                  <p className="mt-1 font-mono text-[9px] uppercase tracking-[0.2em] text-slate-500">{s.sub}</p>
                  <p className="mt-3 text-sm leading-relaxed text-slate-400">{s.desc}</p>
                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {s.tags.map((t) => (
                      <span key={t} className="rounded-md border border-slate-700/50 bg-slate-800/40 px-2 py-0.5 font-mono text-[9px] uppercase tracking-wider text-slate-400">{t}</span>
                    ))}
                  </div>
                  <div className="mt-5 flex items-center justify-between border-t border-slate-700/40 pt-4">
                    <span className="font-mono text-[10px] uppercase tracking-widest text-amber-400">{s.stat}</span>
                    <span className="font-mono text-[10px] uppercase tracking-widest text-slate-500 transition-colors group-hover:text-amber-400">Explore →</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 rounded-2xl border border-slate-700/40 bg-[#0b0f1a]/80 p-6 sm:flex-row">
          <p className="text-slate-300">Need a customized solution for your project?</p>
          <a href="#contact" data-cursor className="rounded-full bg-amber-500 px-6 py-2.5 font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-950 transition-all hover:bg-amber-400">Discuss Your Project</a>
        </div>
      </Reveal>
    </section>
  );
}