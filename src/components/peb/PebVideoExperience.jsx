import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { cn } from "@/lib/utils";

gsap.registerPlugin(ScrollTrigger);

// The actual uploaded PEB transformation video ("generated_video").
const pebVideoUrl =
  "https://media.base44.com/videos/public/6a62011d4b7a1c7d8b3b0f95/3613a507c_generated_video.mp4";

const STAGES = [
  {
    no: "01",
    title: "RAW MATERIALS",
    short: "MATERIALS",
    desc: "Structural steel members, roof panels, wall panels, purlins and connection components prepared for fabrication.",
    callouts: ["Primary Steel", "Purlins", "Roof Panels", "Wall Panels", "Connection Components"],
  },
  {
    no: "02",
    title: "FABRICATION AND ASSEMBLY",
    short: "ASSEMBLY",
    desc: "Columns, rafters, bracing and secondary steel are assembled into the complete structural frame.",
    callouts: ["Structural Columns", "Rafters", "Bracing", "Secondary Steel", "Frame Connections"],
  },
  {
    no: "03",
    title: "COMPLETED PEB BUILDING",
    short: "COMPLETE",
    desc: "A complete, durable and efficient pre-engineered building ready for operational use.",
    callouts: ["Complete Structure", "Roofing System", "Wall Cladding", "Doors and Windows", "Finished Envelope"],
    cta: "Explore PEB Solutions",
  },
];

export default function PebVideoExperience() {
  const sectionRef = useRef(null);
  const videoRef = useRef(null);
  const lineRef = useRef(null);
  const [ready, setReady] = useState(false);
  const [loadPct, setLoadPct] = useState(0);
  const [activeStage, setActiveStage] = useState(0);
  const [error, setError] = useState(null);
  const [reducedMotion, setReducedMotion] = useState(false);

  // Respect prefers-reduced-motion.
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const fn = () => setReducedMotion(mq.matches);
    mq.addEventListener?.("change", fn);
    return () => mq.removeEventListener?.("change", fn);
  }, []);

  // If metadata is already available when we mount, mark ready.
  useEffect(() => {
    const v = videoRef.current;
    if (v && v.readyState >= 1) setReady(true);
  }, [reducedMotion]);

  // Scroll-controlled video + progress (disabled for reduced motion).
  useEffect(() => {
    if (reducedMotion || !ready) return;
    const section = sectionRef.current;
    const video = videoRef.current;
    if (!section || !video) return;

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: section,
        start: "top top",
        end: "bottom bottom",
        scrub: 1,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          const p = self.progress;
          const dur = video.duration || 0;
          const target = p * dur;
          // Update currentTime only when meaningfully different.
          if (dur && Math.abs(video.currentTime - target) > 0.04) {
            try {
              video.currentTime = target;
            } catch {
              /* seeking not yet allowed */
            }
          }
          if (lineRef.current) lineRef.current.style.transform = `scaleX(${p})`;
          const stage = p < 0.3 ? 0 : p < 0.7 ? 1 : 2;
          setActiveStage((prev) => (prev === stage ? prev : stage));
        },
      });
    }, section);
    return () => ctx.revert();
  }, [ready, reducedMotion]);

  const handleMetadata = () => {
    setReady(true);
    requestAnimationFrame(() => ScrollTrigger.refresh());
  };

  if (!pebVideoUrl) {
    return (
      <section className="relative flex min-h-[60vh] items-center justify-center bg-[#070a12] px-6 text-center">
        <div className="font-mono text-sm text-red-400">PEB video URL is missing.</div>
      </section>
    );
  }

  // Reduced-motion: show video normally (controls disabled) + static stages, no pin.
  if (reducedMotion) {
    return (
      <section className="relative bg-[#070a12] py-20">
        <div className="eng-grid pointer-events-none absolute inset-0 opacity-[0.05]" />
        <div className="relative mx-auto max-w-6xl px-6">
          <div className="font-mono text-[11px] uppercase tracking-[0.4em] text-amber-400">
            01 / PRE-ENGINEERED BUILDINGS
          </div>
          <h2 className="mt-3 font-heading text-3xl font-bold tracking-tight text-white md:text-4xl">
            FROM RAW STEEL TO <span className="gradient-text">COMPLETE PEB</span>
          </h2>
          <p className="mt-3 max-w-xl text-sm text-slate-400">
            Follow the transformation of prepared structural components into a complete pre-engineered building.
          </p>
          <video
            src={pebVideoUrl}
            muted
            playsInline
            autoPlay
            loop
            preload="auto"
            className="mt-8 aspect-video w-full rounded-md border border-slate-800 bg-black object-contain"
          />
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {STAGES.map((s) => (
              <div key={s.no} className="rounded-md border border-slate-800 bg-slate-900/40 p-5">
                <div className="font-mono text-[11px] tracking-[0.3em] text-amber-400">{s.no}</div>
                <h3 className="mt-2 font-heading text-lg font-bold text-white">{s.title}</h3>
                <p className="mt-2 text-sm text-slate-400">{s.desc}</p>
                <ul className="mt-3 flex flex-wrap gap-2">
                  {s.callouts.map((c) => (
                    <li
                      key={c}
                      className="rounded-sm border border-slate-700/60 bg-slate-900/40 px-2 py-1 font-mono text-[10px] uppercase tracking-wider text-slate-300"
                    >
                      {c}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  const stage = STAGES[activeStage];

  return (
    <section
      ref={sectionRef}
      data-bg="#070a12"
      className="relative h-[220vh] bg-[#070a12] md:h-[300vh]"
    >
      <div className="eng-grid pointer-events-none absolute inset-0 opacity-[0.06]" />

      <div className="sticky top-0 h-screen w-full overflow-hidden">
        <div className="mx-auto flex h-full w-full max-w-7xl flex-col px-6 md:flex-row md:items-center md:gap-10 md:px-10">
          {/* LEFT — text */}
          <div className="flex shrink-0 flex-col justify-center py-5 md:w-[36%] md:py-0">
            <div className="font-mono text-[10px] uppercase tracking-[0.4em] text-amber-400 md:text-[11px]">
              01 / PRE-ENGINEERED BUILDINGS
            </div>
            <h2 className="mt-3 font-heading text-2xl font-bold leading-[1.05] tracking-tight text-white md:text-4xl">
              FROM RAW STEEL TO <span className="gradient-text">COMPLETE PEB</span>
            </h2>
            <p className="mt-2 max-w-md text-xs text-slate-400 md:mt-3 md:text-[15px]">
              Follow the transformation of prepared structural components into a complete pre-engineered building.
            </p>

            {/* Stage text — crossfades on stage change */}
            <div className="relative mt-4 min-h-[200px] md:mt-6 md:min-h-[260px]">
              <AnimatePresence initial={false}>
                <motion.div
                  key={activeStage}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -30 }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                  className="absolute inset-0"
                >
                  <div className="font-mono text-[11px] tracking-[0.3em] text-amber-400">{stage.no}</div>
                  <h3 className="mt-2 font-heading text-lg font-bold text-white md:text-2xl">{stage.title}</h3>
                  <p className="mt-2 max-w-md text-xs text-slate-400 md:text-sm">{stage.desc}</p>
                  <ul className="mt-3 flex flex-wrap gap-2">
                    {stage.callouts.map((c, i) => (
                      <motion.li
                        key={c}
                        initial={{ opacity: 0, y: 18 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.12 + i * 0.05, duration: 0.35, ease: "easeOut" }}
                        className="rounded-sm border border-slate-700/60 bg-slate-900/40 px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider text-slate-300"
                      >
                        {c}
                      </motion.li>
                    ))}
                  </ul>
                  {stage.cta && (
                    <button className="mt-4 inline-flex items-center gap-2 rounded-sm border border-amber-500/60 px-4 py-2 font-mono text-[10px] uppercase tracking-[0.2em] text-amber-400 transition hover:bg-amber-500/10 md:mt-5 md:text-[11px]">
                      {stage.cta}
                    </button>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Progress indicator */}
            <div className="mt-4 md:mt-6">
              <div className="relative h-px w-full bg-slate-700/50">
                <div
                  ref={lineRef}
                  className="absolute left-0 top-0 h-px w-full origin-left bg-amber-500"
                  style={{ transform: "scaleX(0)" }}
                />
              </div>
              <div className="mt-3 flex justify-between">
                {STAGES.map((s, i) => {
                  const active = activeStage === i;
                  return (
                    <div key={s.no} className="flex flex-col items-center gap-1.5">
                      <span
                        className={cn(
                          "flex h-6 w-6 items-center justify-center rounded-full border font-mono text-[9px] transition-all duration-300 md:h-7 md:w-7 md:text-[10px]",
                          active
                            ? "scale-110 border-amber-500 bg-amber-500 text-black"
                            : "border-slate-600 text-slate-500"
                        )}
                      >
                        {s.no}
                      </span>
                      <span
                        className={cn(
                          "font-mono text-[9px] uppercase tracking-[0.15em] transition-colors duration-300 md:text-[10px]",
                          active ? "text-amber-400" : "text-slate-500"
                        )}
                      >
                        {s.short}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* RIGHT — video */}
          <div className="relative flex min-h-0 flex-1 items-center justify-center md:w-[64%]">
            <div className="relative h-[50vh] w-full md:h-[82vh]">
              <video
                ref={videoRef}
                src={pebVideoUrl}
                muted
                playsInline
                preload="auto"
                onLoadedMetadata={handleMetadata}
                onProgress={(e) => {
                  const v = e.currentTarget;
                  if (v.buffered.length && v.duration) {
                    const end = v.buffered.end(v.buffered.length - 1);
                    setLoadPct(Math.min(100, Math.round((end / v.duration) * 100)));
                  }
                }}
                onError={() => setError("PEB video failed to load.")}
                className="h-full w-full rounded-md border border-slate-800/60 bg-black object-contain"
              />

              {/* Loading overlay */}
              {!ready && (
                <div className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-3 rounded-md bg-[#070a12]">
                  <div className="font-mono text-[11px] uppercase tracking-[0.4em] text-amber-400">
                    Loading PEB Experience
                  </div>
                  <div className="h-1 w-40 overflow-hidden rounded-full bg-slate-800">
                    <div
                      className="h-full bg-amber-500 transition-all duration-300"
                      style={{ width: `${loadPct}%` }}
                    />
                  </div>
                  <div className="font-mono text-[10px] text-slate-500">{loadPct}%</div>
                </div>
              )}

              {error && ready && (
                <div className="absolute bottom-3 left-1/2 z-30 -translate-x-1/2 rounded border border-red-500/40 bg-black/70 px-3 py-1.5 font-mono text-[10px] text-red-300">
                  {error}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}