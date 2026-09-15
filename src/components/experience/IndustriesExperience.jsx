import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Building2, Factory, BedDouble, Landmark, TrainTrack, Home, Container, HardHat, Hexagon } from "lucide-react";
import { INDUSTRIES } from "@/lib/content";
import AnimatedHeading from "./AnimatedHeading";
import Reveal from "@/components/shared/Reveal";

gsap.registerPlugin(ScrollTrigger);

const ICONS = { Building2, Factory, BedDouble, Landmark, TrainTrack, Home, Container, HardHat };

// Industries orbit a central engineering symbol. The whole ring rotates
// slowly with scroll while the icons counter-rotate to stay upright.
export default function IndustriesExperience() {
  const ref = useRef(null);
  const ringRef = useRef(null);
  const [active, setActive] = useState(0);
  const R = 42;

  useEffect(() => {
    const el = ref.current;
    const ring = ringRef.current;
    if (!el || !ring) return;
    const ctx = gsap.context(() => {
      const trig = { trigger: el, start: "top bottom", end: "bottom top", scrub: 1.2 };
      gsap.to(ring, { rotate: 120, ease: "none", transformOrigin: "50% 50%", scrollTrigger: trig });
      gsap.to(el.querySelectorAll(".orb-icon"), { rotate: -120, ease: "none", transformOrigin: "50% 50%", scrollTrigger: trig });
      gsap.fromTo(ring, { scale: 0.6, opacity: 0 }, {
        scale: 1, opacity: 1, duration: 1.1, ease: "expo.out",
        scrollTrigger: { trigger: el, start: "top 75%", toggleActions: "play none none reverse" },
      });
      gsap.fromTo(el.querySelectorAll(".orb-icon"), { opacity: 0 }, {
        opacity: 1, duration: 0.6, stagger: 0.06, ease: "power2.out",
        scrollTrigger: { trigger: el, start: "top 70%", toggleActions: "play none none reverse" },
      });
      ScrollTrigger.refresh();
    }, el);
    return () => ctx.revert();
  }, []);

  return (
    <section id="capabilities" ref={ref} data-bg="#000000" className="relative px-6 py-32 md:px-16">
      <Reveal className="relative mx-auto max-w-6xl">
        <div className="max-w-2xl">
          <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-amber-400">Industries We Serve</span>
          <AnimatedHeading
            lines={["Sectors We", "Build For"]}
            className="mt-4 font-heading text-4xl font-bold tracking-tight text-white md:text-6xl"
          />
          <p className="mt-5 text-slate-400">Cross-discipline delivery for commercial, industrial and municipal facilities across Saudi Arabia.</p>
        </div>

        <div className="relative mx-auto mt-16 aspect-square w-full max-w-xl">
          <div ref={ringRef} className="absolute inset-0">
            <div className="absolute inset-[8%] rounded-full border border-slate-700/30" />
            <div className="absolute inset-[20%] rounded-full border border-slate-700/20" />
            {INDUSTRIES.map((it, i) => {
              const Icon = ICONS[it.icon];
              const ang = (i / INDUSTRIES.length) * Math.PI * 2 - Math.PI / 2;
              const x = 50 + R * Math.cos(ang);
              const y = 50 + R * Math.sin(ang);
              return (
                <button
                  key={it.title}
                  data-cursor
                  onMouseEnter={() => setActive(i)}
                  onClick={() => setActive(i)}
                  className={`group absolute -translate-x-1/2 -translate-y-1/2 transition-transform duration-500 ${active === i ? "scale-125" : "scale-100 hover:scale-110"}`}
                  style={{ left: `${x}%`, top: `${y}%` }}
                >
                  <div className={`orb-icon flex h-16 w-16 items-center justify-center rounded-2xl border backdrop-blur-md transition-all ${active === i ? "border-amber-500/60 bg-amber-500/15 text-amber-300 shadow-[0_0_30px_-6px_rgba(249,115,22,0.5)]" : "border-slate-700/50 bg-[#0b0f1a]/70 text-slate-300"}`}>
                    {Icon ? <Icon size={22} /> : null}
                  </div>
                </button>
              );
            })}
          </div>

          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full border border-amber-500/40 bg-amber-500/10 text-amber-400 mx-auto">
              <Hexagon size={30} />
            </div>
            <div className="mt-4 font-heading text-lg font-bold text-white">{INDUSTRIES[active].title}</div>
            <p className="mt-1 mx-auto max-w-[14rem] text-xs text-slate-400">{INDUSTRIES[active].desc}</p>
          </div>
        </div>
      </Reveal>
    </section>
  );
}