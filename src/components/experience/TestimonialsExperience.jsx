import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Quote } from "lucide-react";
import { TESTIMONIALS } from "@/lib/content";
import Reveal from "@/components/shared/Reveal";

gsap.registerPlugin(ScrollTrigger);

export default function TestimonialsExperience() {
  const sectionRef = useRef(null);
  const trackRef = useRef(null);
  const [active, setActive] = useState(0);

  // Entrance reveal + per-card stagger.
  useEffect(() => {
    const sec = sectionRef.current;
    if (!sec) return;
    const ctx = gsap.context(() => {
      gsap.from(".tm-eyebrow", {
        y: 24, opacity: 0, duration: 0.7, ease: "power3.out",
        scrollTrigger: { trigger: sec, start: "top 78%" },
      });
      gsap.from(".tm-heading .tm-word", {
        yPercent: 110, opacity: 0, duration: 0.8, stagger: 0.08, ease: "power3.out",
        scrollTrigger: { trigger: sec, start: "top 78%" },
      });
      gsap.from(".tm-desc", {
        y: 20, opacity: 0, duration: 0.6, ease: "power3.out", delay: 0.15,
        scrollTrigger: { trigger: sec, start: "top 78%" },
      });
      gsap.from(".tm-card", {
        y: 50, opacity: 0, duration: 0.7, stagger: 0.12, ease: "power3.out",
        scrollTrigger: { trigger: ".tm-grid", start: "top 82%" },
      });
    }, sec);
    return () => ctx.revert();
  }, []);

  const goTo = (i) => {
    const track = trackRef.current;
    if (!track) return;
    const cards = track.querySelectorAll(".tm-card");
    const target = cards[i];
    if (!target) return;
    setActive(i);
    target.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
  };

  return (
    <section
      ref={sectionRef}
      data-bg="#000000"
      id="testimonials"
      className="relative w-full overflow-hidden bg-[#000000] px-6 py-24 md:py-32"
    >
      <div className="eng-grid pointer-events-none absolute inset-0 z-0 opacity-[0.1]" />
      <div className="radial-fade pointer-events-none absolute inset-0 z-0" />

      <Reveal className="relative z-10 mx-auto max-w-6xl">
        <div className="tm-eyebrow flex items-center gap-3">
          <span className="font-mono text-[11px] uppercase tracking-[0.4em] text-amber-400">Client Testimonials</span>
          <span className="h-px w-12 bg-amber-500/60" />
        </div>
        <h2 className="tm-heading mt-5 overflow-hidden font-heading text-4xl font-bold leading-[1.05] tracking-tight md:text-6xl">
          <span className="tm-word inline-block overflow-hidden align-bottom">
            <span className="inline-block text-white">Trusted by</span>
          </span>{" "}
          <span className="tm-word inline-block overflow-hidden align-bottom">
            <span className="inline-block gradient-text">partners</span>
          </span>{" "}
          <span className="tm-word inline-block overflow-hidden align-bottom">
            <span className="inline-block text-white">across the Kingdom</span>
          </span>
        </h2>
        <p className="tm-desc mt-6 max-w-2xl text-base leading-relaxed text-slate-300 md:text-lg">
          From industrial camps and retail fit-outs to airports and luxury hospitality — what our clients say about working with Vertex Synergy.
        </p>

        {/* Horizontal scroll track of testimonial cards */}
        <div
          ref={trackRef}
          onScroll={(e) => {
            const cards = e.currentTarget.querySelectorAll(".tm-card");
            const center = e.currentTarget.scrollLeft + e.currentTarget.clientWidth / 2;
            let nearest = 0;
            let dist = Infinity;
            cards.forEach((c, i) => {
              const mid = c.offsetLeft + c.offsetWidth / 2;
              const d = Math.abs(mid - center);
              if (d < dist) { dist = d; nearest = i; }
            });
            setActive(nearest);
          }}
          className="no-scrollbar mt-12 flex snap-x snap-mandatory gap-5 overflow-x-auto pb-4"
        >
          {TESTIMONIALS.map((t, i) => (
            <article
              key={i}
              className="tm-card glass clip-angular relative w-[88vw] shrink-0 snap-center rounded-md p-7 md:w-[30rem]"
            >
              <Quote className="absolute right-5 top-5 h-10 w-10 text-amber-500/20" />
              <p className="relative z-10 text-base leading-relaxed text-slate-100 md:text-lg">
                &ldquo;{t.quote}&rdquo;
              </p>
              <div className="mt-7 flex items-center gap-4 border-t border-slate-700/40 pt-5">
                <div className="flex h-11 w-11 items-center justify-center rounded-full border border-amber-500/40 bg-amber-500/10 font-heading text-sm font-bold text-amber-300">
                  {t.name.split(" ").map((w) => w[0]).join("").slice(0, 2)}
                </div>
                <div>
                  <div className="font-heading text-sm font-semibold text-white">{t.name}</div>
                  <div className="font-mono text-[10px] uppercase tracking-wider text-slate-400">{t.role}</div>
                </div>
                <div className="ml-auto text-right">
                  <div className="font-mono text-[9px] uppercase tracking-wider text-amber-400/80">Project</div>
                  <div className="max-w-[8rem] text-[11px] leading-tight text-slate-300">{t.project}</div>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Dot navigation */}
        <div className="mt-8 flex items-center justify-center gap-2">
          {TESTIMONIALS.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              aria-label={`View testimonial ${i + 1}`}
              className={
                "h-2 rounded-full transition-all duration-500 " +
                (active === i ? "w-8 bg-amber-500" : "w-2 bg-slate-600 hover:bg-amber-400/60")
              }
            />
          ))}
        </div>
      </Reveal>
    </section>
  );
}