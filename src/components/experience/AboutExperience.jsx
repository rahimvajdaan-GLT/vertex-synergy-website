import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Layers, Workflow, Gauge, LifeBuoy, HardHat, Users, BadgeCheck } from "lucide-react";
import { ABOUT } from "@/lib/content";
import AnimatedHeading from "./AnimatedHeading";
import BlueprintLayer from "./BlueprintLayer";
import Reveal from "@/components/shared/Reveal";

gsap.registerPlugin(ScrollTrigger);

const ICONS = { Layers, Workflow, Gauge, LifeBuoy, HardHat, Users };

export default function AboutExperience() {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ctx = gsap.context(() => {
      const TA = "play none none reverse";
      const line = el.querySelector(".about-line");
      if (line) {
        gsap.fromTo(line, { scaleX: 0 }, {
          scaleX: 1, duration: 1.4, ease: "power2.inOut",
          scrollTrigger: { trigger: el, start: "top 70%", toggleActions: TA },
        });
      }
      gsap.fromTo(el.querySelectorAll(".about-p"), { x: -50, y: 20, opacity: 0 }, {
        x: 0, y: 0, opacity: 1, duration: 0.8, stagger: 0.15, ease: "power3.out",
        scrollTrigger: { trigger: el, start: "top 68%", toggleActions: TA },
      });
      gsap.fromTo(el.querySelectorAll(".principle"), { y: 80, opacity: 0, scale: 0.9, rotateX: 16 }, {
        y: 0, opacity: 1, scale: 1, rotateX: 0, duration: 0.9, stagger: 0.1, ease: "expo.out",
        scrollTrigger: { trigger: el.querySelector(".principles"), start: "top 82%", toggleActions: TA },
      });
      ScrollTrigger.refresh();
    }, el);
    return () => ctx.revert();
  }, []);

  return (
    <section id="about" ref={ref} data-bg="#000000" className="relative px-6 py-32 md:px-16">
      <BlueprintLayer className="absolute inset-0 h-full w-full" color="#f59e0b" opacity={0.07} />
      <Reveal className="relative mx-auto max-w-6xl">
        <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-amber-400">{ABOUT.kicker}</span>
        <AnimatedHeading
          lines={["Crafting Saudi Arabia's", "Infrastructure Future"]}
          className="mt-4 font-heading text-4xl font-bold tracking-tight text-white md:text-6xl"
        />
        <div className="about-line mt-8 h-px w-full origin-left bg-gradient-to-r from-amber-500 via-amber-500/40 to-transparent" />
        <div className="mt-10 grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-6">
            <div className="space-y-4">
              {ABOUT.body.map((p, i) => (
                <p key={i} className="about-p text-slate-300 leading-relaxed">{p}</p>
              ))}
            </div>
            <div className="mt-8 flex flex-wrap gap-2">
              {ABOUT.badges.map((b) => (
                <span key={b} className="inline-flex items-center gap-1.5 rounded-full border border-slate-700/50 bg-slate-800/30 px-3 py-1.5 text-xs text-slate-300">
                  <BadgeCheck size={13} className="text-amber-400" /> {b}
                </span>
              ))}
            </div>
          </div>
          <div className="principles lg:col-span-6" style={{ perspective: "1000px" }}>
            <div className="grid gap-4 sm:grid-cols-2">
              {ABOUT.principles.map((pr) => {
                const Icon = ICONS[pr.icon];
                return (
                  <div key={pr.title} data-cursor className="principle group rounded-2xl border border-slate-700/40 bg-[#0b0f1a]/80 p-5 transition-all hover:-translate-y-1 hover:border-amber-500/30">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-amber-500/30 bg-amber-500/10 text-amber-400">{Icon ? <Icon size={18} /> : null}</div>
                    <h3 className="mt-4 font-heading text-base font-bold text-white">{pr.title}</h3>
                    <p className="mt-2 text-sm text-slate-400">{pr.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}