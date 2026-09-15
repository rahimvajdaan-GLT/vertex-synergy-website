import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useProgress, useGLTF } from "@react-three/drei";
import { base44 } from "@/api/base44Client";
import { cn } from "@/lib/utils";
import { COMPANY } from "@/lib/content";
import StageCanvas from "@/components/shared/StageCanvas";
import { useInView } from "@/hooks/useInView";

gsap.registerPlugin(ScrollTrigger);

const REST_Y = 0.6;
const OFF_Y = 5.5;
const IN_Y = -6.5;
const S = 5.8;

function StageText({ stage, last }) {
  return (
    <div className="se-stage-text absolute inset-0" data-stage={stage.no}>
      <div className="flex items-center gap-3">
        <span className="font-mono text-sm tracking-[0.4em] text-amber-400">{stage.no}</span>
        {stage.group && <span className="font-mono text-[10px] tracking-[0.3em] text-cyan-400">{stage.group}</span>}
        <span className="h-px w-12 bg-amber-500/60" />
      </div>
      <h3 className="se-title mt-4 font-heading text-4xl font-bold leading-[1] tracking-tight text-white text-glow md:text-6xl">
        {stage.title.split(" ").map((w, i) => (
          <span key={i} className="inline-block overflow-hidden align-bottom">
            <span className="se-title-inner inline-block">{w}&nbsp;</span>
          </span>
        ))}
      </h3>
      <p className="se-desc mt-6 max-w-xl border-l-2 border-amber-500/60 pl-5 text-base leading-relaxed text-slate-100 md:text-xl md:leading-relaxed">
        {stage.desc}
      </p>
      <ul className="se-callouts mt-6 flex flex-wrap gap-2 max-w-xl">
        {stage.callouts.map((c) => (
          <li
            key={c}
            className="se-callout inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/5 px-3 py-1.5 font-mono text-[10px] uppercase tracking-wider text-amber-200/90"
          >
            <span className="h-1 w-1 rounded-full bg-amber-500" />
            {c}
          </li>
        ))}
      </ul>
      {last && stage.cta && (
        <button
          onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })}
          className="se-cta mt-7 inline-flex items-center gap-2 rounded-md border border-amber-500/50 bg-amber-500/10 px-5 py-2.5 font-mono text-[11px] uppercase tracking-[0.2em] text-amber-300 transition-colors hover:bg-amber-500/20"
        >
          {stage.ctaLabel || "Explore"} <span className="text-amber-400">→</span>
        </button>
      )}
    </div>
  );
}

function Step({ idx, active, stage, stepLabel, onClick }) {
  return (
    <button onClick={onClick} aria-label={`Go to ${stage.title} stage`} className="group flex items-center gap-2.5 text-left transition-opacity hover:opacity-100">
      <div className={cn("relative h-2.5 w-2.5 rounded-full border transition-all duration-500", active ? "scale-150 border-amber-500 bg-amber-500" : "border-slate-600 bg-transparent group-hover:border-amber-400/70")}>
        {active && <span className="absolute inset-0 animate-ping rounded-full bg-amber-500 opacity-60" />}
      </div>
      <span className={cn("font-mono text-[10px] tracking-[0.2em] transition-colors duration-500", active ? "text-amber-400" : "text-slate-500 group-hover:text-slate-300")}>
        {String(idx + 1).padStart(2, "0")} {stage.group ? stage.group + " · " : ""}{stepLabel}
      </span>
      <span className={cn("h-px bg-slate-700 transition-all duration-500", active ? "w-10 bg-amber-500" : "w-4 group-hover:bg-slate-500")} />
    </button>
  );
}

// Generic pinned, scroll-driven 3D stage experience — the same pattern the
// portacabin section uses. Config drives the stages, GLB slots, intro copy
// and loading screen, so PEB, Tank and Portacabin each become a thin wrapper.
export default function StageExperience({ config }) {
  const { eyebrow, headingWords, introDesc, stages, slots, stepLabels, loadingTitle, loadingLabel } = config;
  const introRef = useRef(null);
  const sectionRef = useRef(null);
  const stRef = useRef(null);
  const lastStageRef = useRef(0);

  const stateRef = useRef(
    Object.fromEntries(
      slots.map((slot, i) => [
        slot,
        i === 0
          ? { opacity: 0, scale: 5.6, x: 2.7, y: REST_Y, rotY: -0.55 }
          : { opacity: 0, scale: 4.8, x: 2.7, y: IN_Y, rotY: -0.9 },
      ])
    )
  );

  const [urls, setUrls] = useState(null);
  const [urlsError, setUrlsError] = useState(null);
  const [loaded, setLoaded] = useState(false);
  const [activeStage, setActiveStage] = useState(0);
  const [isMobile, setIsMobile] = useState(
    typeof window !== "undefined" && window.matchMedia("(max-width: 768px)").matches
  );

  const { progress, active } = useProgress();
  const inView = useInView(sectionRef);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 768px)");
    const fn = () => setIsMobile(mq.matches);
    mq.addEventListener("change", fn);
    return () => mq.removeEventListener("change", fn);
  }, []);

  useEffect(() => {
    base44.entities.ModelAsset
      .list()
      .then((items) => {
        const m = {};
        items.forEach((i) => { m[i.slot] = i.file_url; });
        const missing = slots.find((s) => !m[s]);
        if (missing) setUrlsError("Missing ModelAsset slot: " + missing);
        setUrls(m);
      })
      .catch((e) => setUrlsError(String(e)));
  }, [slots]);

  useEffect(() => {
    if (!urls) return;
    slots.forEach((s) => { if (urls[s]) useGLTF.preload(urls[s]); });
  }, [urls, slots]);

  useEffect(() => {
    if (progress >= 100) setLoaded(true);
    else if (active) setLoaded(false);
  }, [active, progress]);

  const urlsReady = urls && !urlsError && slots.every((s) => urls[s]);

  // Intro reveal.
  useEffect(() => {
    const intro = introRef.current;
    if (!intro) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(".se-line", { scaleX: 0 }, {
        scaleX: 1, duration: 1.1, ease: "power2.inOut",
        scrollTrigger: { trigger: intro, start: "top 75%" },
      });
      gsap.fromTo(".se-intro-eyebrow", { y: 20, opacity: 0 }, {
        y: 0, opacity: 1, duration: 0.7, ease: "power3.out",
        scrollTrigger: { trigger: intro, start: "top 70%" },
      });
      gsap.fromTo(".se-intro-heading .se-word", { yPercent: 110, opacity: 0 }, {
        yPercent: 0, opacity: 1, duration: 0.7, stagger: 0.08, ease: "power3.out",
        scrollTrigger: { trigger: intro, start: "top 65%" },
      });
      gsap.fromTo(".se-intro-desc", { y: 20, opacity: 0 }, {
        y: 0, opacity: 1, duration: 0.7, ease: "power3.out",
        scrollTrigger: { trigger: intro, start: "top 60%" },
      });
    }, intro);
    return () => ctx.revert();
  }, []);

  // Build the master scroll timeline once models are loaded.
  useEffect(() => {
    if (!loaded || !urlsReady || !sectionRef.current) return;
    const state = stateRef.current;
    const N = stages.length;
    const MX = isMobile ? 0 : 2.7;
    const EXIT_X = isMobile ? 0 : -1.0;

    const ctx = gsap.context(() => {
      stages.forEach((s, i) => { if (i === 0) return; gsap.set(`.se-stage-text[data-stage='${s.no}']`, { opacity: 0 }); });
      gsap.set(".se-title-inner", { yPercent: 110 });
      gsap.set(".se-desc", { yPercent: 30, opacity: 0 });
      gsap.set(".se-callout", { yPercent: 40, opacity: 0 });
      gsap.set(".se-cta", { yPercent: 20, opacity: 0 });

      gsap.set(state[slots[0]], { opacity: 0, scale: 5.6, x: MX, y: REST_Y, rotY: -0.55 });
      for (let i = 1; i < N; i++) gsap.set(state[slots[i]], { opacity: 0, scale: 4.8, x: MX, y: IN_Y, rotY: -0.9 });

      const intro = gsap.timeline({ delay: 0.15 });
      intro.to(state[slots[0]], { opacity: 1, scale: S, duration: 0.8, ease: "power2.out" }, 0);
      intro.to(`.se-stage-text[data-stage='${stages[0].no}'] .se-title-inner`, { yPercent: 0, duration: 0.5, stagger: 0.08, ease: "power3.out" }, 0.4);
      intro.to(`.se-stage-text[data-stage='${stages[0].no}'] .se-desc`, { yPercent: 0, opacity: 1, duration: 0.4, ease: "power3.out" }, 0.7);
      intro.to(`.se-stage-text[data-stage='${stages[0].no}'] .se-callout`, { yPercent: 0, opacity: 1, duration: 0.35, stagger: 0.06, ease: "power2.out" }, 0.8);

      const sel = (no, c) => `.se-stage-text[data-stage='${no}'] ${c}`;
      const revealText = (idx, at) => {
        const no = stages[idx].no;
        tl.to(`.se-stage-text[data-stage='${no}']`, { opacity: 1, duration: 0.2 }, at);
        tl.to(sel(no, ".se-title-inner"), { yPercent: 0, duration: 0.35, stagger: 0.06, ease: "power3.out" }, at);
        tl.to(sel(no, ".se-desc"), { yPercent: 0, opacity: 1, duration: 0.3, ease: "power3.out" }, at + 0.08);
        tl.to(sel(no, ".se-callout"), { yPercent: 0, opacity: 1, duration: 0.25, stagger: 0.05, ease: "power2.out" }, at + 0.12);
        tl.to(sel(no, ".se-cta"), { yPercent: 0, opacity: 1, duration: 0.3, ease: "power3.out" }, at + 0.16);
      };
      const hideText = (idx, at) => {
        const no = stages[idx].no;
        tl.to(`.se-stage-text[data-stage='${no}']`, { opacity: 0, duration: 0.15, ease: "power2.in" }, at);
        tl.to(sel(no, ".se-title-inner"), { yPercent: -110, duration: 0.15, ease: "power2.in" }, at);
        tl.to(sel(no, ".se-desc"), { yPercent: -30, opacity: 0, duration: 0.15 }, at);
        tl.to(sel(no, ".se-callout"), { yPercent: -40, opacity: 0, duration: 0.15 }, at);
        tl.to(sel(no, ".se-cta"), { yPercent: -20, opacity: 0, duration: 0.15 }, at);
      };

      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: () => (isMobile ? `+=${N * 80}%` : `+=${N * 100}%`),
          pin: true,
          scrub: 1.2,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            const p = self.progress;
            const start = 0.14, endp = 0.86, step = (endp - start) / (N - 1);
            let idx = 0;
            for (let i = 0; i < N - 1; i++) {
              if (p >= start + i * step + step * 0.5) idx = i + 1;
            }
            if (p < start) idx = 0;
            if (p >= endp) idx = N - 1;
            if (idx !== lastStageRef.current) {
              lastStageRef.current = idx;
              setActiveStage(idx);
            }
          },
        },
      });

      const start = 0.14, endp = 0.86, step = (endp - start) / (N - 1);
      for (let i = 0; i < N - 1; i++) {
        const t = start + i * step;
        tl.to(state[slots[i]], { opacity: 0, scale: 8.5, x: EXIT_X, y: OFF_Y, rotY: 2.6, duration: 0.1, ease: "power2.in" }, t);
        tl.to(state[slots[i + 1]], { opacity: 1, scale: S, x: MX, y: REST_Y, rotY: -0.55, duration: 0.1, ease: "power3.out" }, t);
        hideText(i, t);
        revealText(i + 1, t + 0.05);
      }
      tl.to({}, { duration: 0.14 }, endp);

      stRef.current = tl.scrollTrigger;
      ScrollTrigger.refresh();
    }, sectionRef);
    return () => ctx.revert();
  }, [loaded, urlsReady, isMobile, stages, slots]);

  const scrollToStage = (idx) => {
    const st = stRef.current;
    if (!st) return;
    const N = stages.length;
    const start = 0.14, endp = 0.86, step = (endp - start) / (N - 1);
    const centers = [0.05];
    for (let i = 1; i < N; i++) centers.push(start + (i - 0.5) * step);
    centers[N - 1] = 0.95;
    const p = centers[idx] ?? 0;
    const y = st.start + p * (st.end - st.start);
    if (window.lenis && window.lenis.scrollTo) window.lenis.scrollTo(y);
    else window.scrollTo({ top: y, behavior: "smooth" });
  };

  const goNext = () => scrollToStage(Math.min(stages.length - 1, activeStage + 1));
  const goPrev = () => scrollToStage(Math.max(0, activeStage - 1));

  const errorUrl = urlsError || (urls && !slots.every((s) => urls[s]) ? "One or more GLB URLs are missing." : null);

  return (
    <>
      {/* Intro / transition */}
      <section ref={introRef} data-bg="#000000" className="relative flex min-h-[78vh] w-full flex-col items-center justify-center overflow-hidden bg-[#000000] px-6 py-20 text-center md:min-h-[80vh]">
        <div className="eng-grid pointer-events-none absolute inset-0 z-0 opacity-[0.12]" />
        <div className="radial-fade pointer-events-none absolute inset-0 z-0" />
        <div className="se-line absolute top-16 left-0 z-10 h-px w-full origin-left bg-gradient-to-r from-transparent via-amber-500 to-transparent" />
        <div className="se-intro-eyebrow relative z-10 font-mono text-[11px] uppercase tracking-[0.4em] text-amber-400">{eyebrow}</div>
        <h2 className="se-intro-heading relative z-10 mt-5 overflow-hidden font-heading text-5xl font-bold leading-[1] tracking-tight md:text-8xl">
          {headingWords.map((w, i) => (
            <React.Fragment key={i}>
              {i > 0 ? " " : null}
              <span className="se-word inline-block overflow-hidden align-bottom">
                <span className={cn("inline-block", w.accent ? "gradient-text" : "text-white")}>{w.text}</span>
              </span>
            </React.Fragment>
          ))}
        </h2>
        <p className="se-intro-desc relative z-10 mt-6 max-w-2xl text-base leading-relaxed text-slate-300 md:text-lg">{introDesc}</p>
        <div className="relative z-10 mt-10 flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.3em] text-slate-500">
          <span className="h-px w-8 bg-amber-500/60" />
          Scroll to explore the build
          <span className="h-px w-8 bg-amber-500/60" />
        </div>
      </section>

      {/* Pinned 3D experience */}
      <section ref={sectionRef} data-bg="#000000" className="relative flex w-full flex-col overflow-hidden bg-[#000000] md:block" style={{ height: "100vh" }}>
        <div className="eng-grid pointer-events-none absolute inset-0 z-0 opacity-[0.12]" />
        <div className="radial-fade pointer-events-none absolute inset-0 z-0" />

        <div className="pointer-events-none absolute left-1/2 top-20 z-30 hidden -translate-x-1/2 text-center md:block">
          <div className="font-mono text-[10px] uppercase tracking-[0.4em] text-amber-400">{COMPANY.tagline}</div>
          <h2 className="mt-1 font-heading text-xl font-bold tracking-tight md:text-2xl">
            <span className="gradient-text">VERTEX</span> <span className="text-white">SYNERGY</span>
          </h2>
        </div>

        <div className="pointer-events-auto relative z-20 px-6 pt-10 md:absolute md:left-16 md:top-1/2 md:w-[34rem] md:max-w-[calc(100vw-7rem)] md:-translate-y-1/2 md:px-0 md:pt-0">
          <div className="relative min-h-[210px] md:min-h-[420px]">
            {stages.map((s, i) => (
              <StageText key={s.no} stage={s} last={i === stages.length - 1} />
            ))}
          </div>
        </div>

        <div className={cn("relative z-10 h-[50vh] w-full transition-opacity duration-700 md:absolute md:inset-0 md:h-full", loaded ? "opacity-100" : "opacity-0")}>
          <div
            className="pointer-events-none absolute left-1/2 bottom-[22%] z-0 -translate-x-1/2 rounded-[50%] blur-2xl"
            style={{ width: "46vw", height: "90px", background: "radial-gradient(ellipse at 50% 50%, rgba(0,0,0,0.5), transparent 70%)" }}
          />
          {urlsReady && inView && <StageCanvas slots={slots} urls={urls} state={stateRef.current} isMobile={isMobile} />}
        </div>

        <div className="relative z-20 px-6 pb-6 md:absolute md:bottom-10 md:left-16 md:px-0">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:gap-6">
            <div className="flex flex-wrap gap-3 md:flex-row md:items-center md:gap-6">
              {stages.map((s, i) => (
                <Step key={i} idx={i} active={activeStage === i} stage={s} stepLabel={stepLabels[i]} onClick={() => scrollToStage(i)} />
              ))}
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={goPrev}
                disabled={activeStage === 0}
                aria-label="Previous stage"
                className="flex h-9 w-9 items-center justify-center rounded-md border border-slate-700 bg-slate-900/60 font-mono text-sm text-slate-300 transition-all hover:border-amber-500/60 hover:text-amber-400 disabled:cursor-not-allowed disabled:opacity-30"
              >
                ←
              </button>
              <span className="font-mono text-[10px] tracking-[0.2em] text-slate-500">
                {String(activeStage + 1).padStart(2, "0")} / {String(stages.length).padStart(2, "0")}
              </span>
              <button
                onClick={goNext}
                disabled={activeStage === stages.length - 1}
                aria-label="Next stage"
                className="flex h-9 w-9 items-center justify-center rounded-md border border-slate-700 bg-slate-900/60 font-mono text-sm text-slate-300 transition-all hover:border-amber-500/60 hover:text-amber-400 disabled:cursor-not-allowed disabled:opacity-30"
              >
                →
              </button>
            </div>
          </div>
        </div>

        {/* loading */}
        {!loaded && !errorUrl && (
          <div className="absolute inset-0 z-40 flex items-center justify-center bg-[#000000] px-6">
            <div className="text-center">
              <div className="font-mono text-[10px] uppercase tracking-[0.4em] text-amber-400">{COMPANY.tagline}</div>
              <h1 className="mt-4 font-heading text-4xl font-bold leading-[1] tracking-tight md:text-6xl">{loadingTitle}</h1>
              <div className="mt-10 font-mono text-[10px] uppercase tracking-[0.3em] text-amber-400">{loadingLabel}</div>
              <div className="mt-3 font-heading text-5xl text-white">{Math.round(progress)}%</div>
              <div className="mx-auto mt-4 h-px w-48 overflow-hidden bg-slate-800">
                <div className="h-full bg-amber-500 transition-all duration-300" style={{ width: `${progress}%` }} />
              </div>
            </div>
          </div>
        )}

        {/* error */}
        {errorUrl && (
          <div className="absolute inset-0 z-40 flex items-center justify-center bg-[#000000] p-6">
            <div className="max-w-md rounded-md border border-red-500/50 bg-black/60 p-6 text-center font-mono text-xs leading-relaxed text-red-300">
              GLB failed to load:
              <br />
              <span className="break-all text-red-200">{errorUrl}</span>
            </div>
          </div>
        )}
      </section>
    </>
  );
}