import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { AnimatePresence, motion } from "framer-motion";
import { X, ArrowUpRight } from "lucide-react";
import { PROJECTS } from "@/lib/content";
import { Image } from "@/components/ui/image";
import AnimatedHeading from "./AnimatedHeading";
import Reveal from "@/components/shared/Reveal";

gsap.registerPlugin(ScrollTrigger);

// Project cards fly in from alternating sides and open into a detail modal
// on click — contained boxes rather than a full-bleed gallery.
export default function ProjectsExperience() {
  const ref = useRef(null);
  const [active, setActive] = useState(null);
  const project = active != null ? PROJECTS[active] : null;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ctx = gsap.context(() => {
      const cards = el.querySelectorAll(".proj-card");
      const grid = el.querySelector(".proj-grid");
      if (cards.length) {
        gsap.fromTo(
          cards,
          { y: 160, opacity: 0, scale: 0.86, rotateX: 22, transformOrigin: "center bottom" },
          {
            y: 0, opacity: 1, scale: 1, rotateX: 0,
            duration: 1.1, ease: "expo.out", stagger: 0.12,
            scrollTrigger: { trigger: grid, start: "top 82%", toggleActions: "play none none reverse" },
          }
        );
      }
      const imgWraps = el.querySelectorAll(".proj-card .proj-img");
      if (imgWraps.length) {
        gsap.fromTo(
          imgWraps,
          { clipPath: "inset(100% 0% 0% 0%)" },
          {
            clipPath: "inset(0% 0% 0% 0%)",
            duration: 1, ease: "power3.out", stagger: 0.1,
            scrollTrigger: { trigger: grid, start: "top 82%", toggleActions: "play none none reverse" },
          }
        );
      }
      ScrollTrigger.refresh();
    }, el);
    return () => ctx.revert();
  }, []);

  useEffect(() => {
    const lenis = window.lenis;
    if (active != null) {
      document.body.style.overflow = "hidden";
      lenis?.stop?.();
    } else {
      document.body.style.overflow = "";
      lenis?.start?.();
    }
    return () => {
      document.body.style.overflow = "";
      lenis?.start?.();
    };
  }, [active]);

  return (
    <section id="projects" ref={ref} data-bg="#000000" className="relative px-6 py-32 md:px-16">
      <Reveal className="relative mx-auto max-w-6xl">
        <div className="max-w-2xl">
          <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-amber-400">Our Projects</span>
          <AnimatedHeading lines={["Featured", "Projects"]} className="mt-4 font-heading text-4xl font-bold tracking-tight text-white md:text-6xl" />
          <p className="mt-5 text-slate-400">A selection of engineered, built and delivered projects across Saudi Arabia. Click any project to explore the details.</p>
        </div>

        <div className="proj-grid mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3" style={{ perspective: "1200px" }}>
          {PROJECTS.map((p, i) => (
            <button
              key={p.title}
              data-cursor
              onClick={() => setActive(i)}
              className="proj-card group relative block overflow-hidden rounded-2xl border border-slate-700/40 bg-[#0b0f1a]/70 text-left transition-colors duration-500 hover:border-amber-500/40 hover:shadow-[0_24px_60px_-20px_rgba(249,115,22,0.4)]"
              style={{ willChange: "transform, opacity" }}
            >
              <div className="proj-img relative aspect-[4/3] overflow-hidden">
                <Image src={p.image} alt={p.title} fittingType="fill" className="h-full w-full transition-transform duration-700 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0b0f1a] via-transparent to-transparent" />
                <div className="absolute left-3 top-3 rounded-md border border-slate-600/40 bg-black/50 px-2 py-0.5 font-mono text-[9px] uppercase tracking-wider text-slate-200 backdrop-blur-sm">{p.status}</div>
                <div className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full border border-amber-500/40 bg-black/40 text-amber-300 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  <ArrowUpRight size={14} />
                </div>
              </div>
              <div className="p-5">
                <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-slate-500">{p.sector} · {p.location}</div>
                <h3 className="mt-1 font-heading text-lg font-bold text-white">{p.title}</h3>
                <p className="mt-2 line-clamp-2 text-sm text-slate-400">{p.scope}</p>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {p.tags.slice(0, 3).map((t) => (
                    <span key={t} className="rounded border border-slate-700/50 bg-slate-800/40 px-2 py-0.5 font-mono text-[9px] uppercase tracking-wider text-slate-400">{t}</span>
                  ))}
                </div>
              </div>
            </button>
          ))}
        </div>
      </Reveal>

      <AnimatePresence>
        {project && (
          <motion.div
            className="fixed inset-0 z-[120] flex items-center justify-center p-4 md:p-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActive(null)}
          >
            <div className="absolute inset-0 bg-black/75 backdrop-blur-md" />
            <motion.div
              className="relative z-10 w-full max-w-4xl overflow-hidden rounded-2xl border border-slate-700/50 bg-[#0b0f1a]"
              initial={{ opacity: 0, scale: 0.92, y: 40 }}
              animate={{ opacity: 1, scale: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } }}
              exit={{ opacity: 0, scale: 0.96, y: 20, transition: { duration: 0.25 } }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setActive(null)}
                data-cursor
                className="absolute right-3 top-3 z-20 flex h-9 w-9 items-center justify-center rounded-full border border-slate-600/50 bg-black/50 text-slate-200 transition-colors hover:text-amber-300"
              >
                <X size={16} />
              </button>
              <div className="grid md:grid-cols-2">
                <motion.div
                  className="relative h-56 md:h-full"
                  initial={{ x: -60, opacity: 0 }}
                  animate={{ x: 0, opacity: 1, transition: { duration: 0.6, ease: "power3.out", delay: 0.1 } }}
                >
                  <Image src={project.image} alt={project.title} fittingType="fill" className="h-full w-full" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0b0f1a] via-transparent to-transparent md:bg-gradient-to-r" />
                </motion.div>
                <div className="p-6 md:p-8">
                  <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-amber-400">{project.sector} · {project.location} · {project.status}</div>
                  <h3 className="mt-2 font-heading text-3xl font-bold tracking-tight text-white">{project.title}</h3>
                  <p className="mt-4 text-slate-300">{project.scope}</p>
                  <div className="mt-5 flex flex-wrap gap-1.5">
                    {project.tags.map((t) => (
                      <span key={t} className="rounded border border-slate-700/50 bg-slate-800/40 px-2 py-1 font-mono text-[9px] uppercase tracking-wider text-slate-300">{t}</span>
                    ))}
                  </div>
                  <div className="mt-6 h-px w-full bg-gradient-to-r from-amber-500/60 to-transparent" />
                  <p className="mt-4 font-mono text-[10px] uppercase tracking-[0.2em] text-slate-500">Click outside or the × to close</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}