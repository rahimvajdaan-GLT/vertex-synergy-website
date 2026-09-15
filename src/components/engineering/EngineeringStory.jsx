import React, { useEffect, useRef, useState } from "react";
import { Image } from "@/components/ui/image";
import EngineeringStage from "@/components/engineering/EngineeringStage";
import BlueprintOverlay from "@/components/engineering/BlueprintOverlay";
import StageNavigation from "@/components/engineering/StageNavigation";
import { useEngineeringTimeline } from "@/components/engineering/useEngineeringTimeline";
import { ENGINEERING_STAGES, COMPANY } from "@/lib/engineeringStages";

// Text block for one stage — masked title lines, description, callouts,
// optional MEP legend, optional construction timeline, optional CTAs.
function StageText({ stage }) {
  return (
    <>
      <div className="overflow-hidden">
        <h2 className="st-line font-heading text-4xl font-bold leading-[0.98] tracking-tight text-white md:text-6xl lg:text-7xl">
          {stage.titleLines[0]}
        </h2>
      </div>
      {stage.titleLines[1] && (
        <div className="overflow-hidden">
          <h2
            className="st-line font-heading text-4xl font-bold leading-[0.98] tracking-tight md:text-6xl lg:text-7xl"
            style={{ color: stage.accent }}
          >
            {stage.titleLines[1]}
          </h2>
        </div>
      )}

      <div className="mt-5 overflow-hidden">
        <p className="st-desc-inner max-w-md text-base text-slate-300 md:text-lg">
          {stage.desc}
        </p>
      </div>

      {/* Standard callouts */}
      {stage.callouts?.length > 0 && (
        <div className="mt-6 flex flex-wrap gap-2">
          {stage.callouts.map((c) => (
            <span
              key={c}
              className="st-callout rounded-md border px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.12em] text-slate-300"
              style={{ borderColor: `${stage.accent}55` }}
            >
              {c}
            </span>
          ))}
        </div>
      )}

      {/* MEP legend with pulsing nodes */}
      {stage.mep?.length > 0 && (
        <div className="mt-6 flex flex-wrap gap-2">
          {stage.mep.map((m) => (
            <span
              key={m.label}
              className="st-callout flex items-center gap-2 rounded-full border px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.12em] text-slate-200"
              style={{ borderColor: `${m.color}66` }}
            >
              <span className="h-2 w-2 rounded-full pulse-glow" style={{ background: m.color, boxShadow: `0 0 8px ${m.color}` }} />
              {m.label}
            </span>
          ))}
        </div>
      )}

      {/* Construction timeline */}
      {stage.timeline?.length > 0 && (
        <div className="mt-6 w-full max-w-md space-y-2.5">
          {stage.timeline.map((t) => (
            <div key={t.label} className="st-callout">
              <div className="flex justify-between font-mono text-[10px] text-slate-400">
                <span>{t.label}</span>
                <span style={{ color: stage.accent }}>{t.pct}%</span>
              </div>
              <div className="st-tl-bar mt-1 h-1 w-full rounded bg-slate-700/50">
                <span className="block h-1 rounded" style={{ background: stage.accent, width: "0%" }} />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* CTAs */}
      {stage.cta && (
        <div className="st-ctas mt-7 flex flex-wrap gap-3">
          {stage.cta.map((c, i) => (
            <a
              key={c.label}
              href={c.href}
              className={`rounded-full px-6 py-3 font-mono text-[11px] font-semibold uppercase tracking-[0.18em] transition-all ${
                i === 0
                  ? "bg-amber-500 text-slate-950 hover:bg-amber-400 hover:shadow-[0_0_24px_-4px_rgba(249,115,22,0.7)]"
                  : "border border-slate-500/60 text-slate-200 hover:border-amber-400/60 hover:text-amber-300"
              }`}
            >
              {c.label}
            </a>
          ))}
        </div>
      )}
    </>
  );
}

export default function EngineeringStory() {
  const [isMobile, setIsMobile] = useState(false);
  const [ready, setReady] = useState(false);
  const [pct, setPct] = useState(0);
  const [active, setActive] = useState(0);
  const [navVisible, setNavVisible] = useState(false);

  const rootRef = useRef(null);
  const cameraRef = useRef(null);
  const parallaxRef = useRef(null);
  const lightRef = useRef(null);
  const blueprintRef = useRef(null);
  const ringRef = useRef(null);
  const isTransitioningRef = useRef(false);
  const activeRef = useRef(0);
  const mouseCur = useRef({ x: 0, y: 0 });

  const stageRefs = useRef([]);
  const textRefs = useRef([]);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 768px)");
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  // Preload all seven images before activating the timeline.
  useEffect(() => {
    let loaded = 0;
    const total = ENGINEERING_STAGES.length;
    ENGINEERING_STAGES.forEach((s) => {
      const img = new window.Image();
      const done = () => {
        loaded += 1;
        setPct(Math.round((loaded / total) * 100));
        if (loaded >= total) setReady(true);
      };
      img.onload = done;
      img.onerror = done;
      img.src = s.image;
    });
  }, []);

  const onActive = (idx) => {
    if (idx !== activeRef.current) {
      activeRef.current = idx;
      setActive(idx);
    }
  };

  useEffect(() => {
    const onScroll = () => {
      const el = rootRef.current;
      if (!el) return;
      const start = el.offsetTop;
      const dist = (isMobile ? 4.5 : 7.6) * window.innerHeight;
      const inRange = window.scrollY >= start - 60 && window.scrollY <= start + dist + 60;
      setNavVisible((v) => (v !== inRange ? inRange : v));
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [isMobile]);

  useEngineeringTimeline({
    rootRef,
    cameraRef,
    parallaxRef,
    stageRefs,
    textRefs,
    blueprintRef,
    lightRef,
    ringRef,
    stages: ENGINEERING_STAGES,
    isMobile,
    ready,
    onActive,
    isTransitioningRef,
  });

  // Subtle mouse depth parallax (desktop only), dampened during transitions.
  useEffect(() => {
    if (isMobile || !ready) return;
    const target = { x: 0, y: 0 };
    const onMove = (e) => {
      target.x = (e.clientX / window.innerWidth) * 2 - 1;
      target.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("mousemove", onMove);
    let raf;
    const loop = () => {
      const t = isTransitioningRef.current ? { x: 0, y: 0 } : target;
      mouseCur.current.x += (t.x - mouseCur.current.x) * 0.05;
      mouseCur.current.y += (t.y - mouseCur.current.y) * 0.05;
      if (parallaxRef.current) {
        const { x, y } = mouseCur.current;
        parallaxRef.current.style.transform = `translate(${x * 8}px, ${y * 5}px) rotateY(${x * -1.5}deg) rotateX(${y * 1}deg)`;
      }
      raf = requestAnimationFrame(loop);
    };
    loop();
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
    };
  }, [isMobile, ready]);

  const scrollToStage = (i) => {
    const el = rootRef.current;
    if (!el) return;
    const totalUnits = isMobile ? 7.4 : 7.6;
    const scrollVh = isMobile ? 4.5 : 7.6;
    const top = el.offsetTop + (i / totalUnits) * scrollVh * window.innerHeight;
    window.scrollTo({ top, behavior: "smooth" });
  };

  return (
    <section id="story" ref={rootRef} className="relative h-screen w-full overflow-hidden bg-black" style={{ perspective: 1400 }}>
      {/* Atmospheric base */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_30%,#0c1322_0%,#070a12_70%,#000_100%)]" />
      <div className="eng-grid pointer-events-none absolute inset-0 opacity-[0.05]" />
      <div className="pointer-events-none absolute inset-0" style={{ boxShadow: "inset 0 0 240px 80px rgba(0,0,0,0.88)" }} />

      {/* Camera group (continuous move + perspective) */}
      <div ref={cameraRef} className="absolute inset-0" style={{ perspective: 1400 }}>
        <div ref={parallaxRef} className="absolute inset-0" style={{ transformStyle: "preserve-3d" }}>
          {ENGINEERING_STAGES.map((stage, i) => (
            <EngineeringStage
              key={stage.phase}
              ref={(el) => (stageRefs.current[i] = el)}
              stage={stage}
              index={i}
              isMobile={isMobile}
            />
          ))}
        </div>
      </div>

      {/* Blueprint bridge + light sweep */}
      <BlueprintOverlay ref={blueprintRef} />
      <div
        ref={lightRef}
        className="pointer-events-none absolute inset-y-0 left-0 w-1/3 opacity-0"
        style={{ background: "linear-gradient(90deg, transparent, rgba(249,115,22,0.28), transparent)", filter: "blur(8px)" }}
      />

      {/* Stage text layer (one per stage, stacked) */}
      {ENGINEERING_STAGES.map((stage, i) => (
        <div
          key={stage.phase}
          ref={(el) => (textRefs.current[i] = el)}
          className={`absolute z-20 ${isMobile ? "bottom-8 left-6 right-6" : "left-6 top-1/2 max-w-xl -translate-y-1/2 md:left-16"}`}
          style={{ opacity: i === 0 ? 1 : 0 }}
        >
          <div className="mb-3 flex items-center gap-3">
            <span className="font-mono text-[10px] uppercase tracking-[0.25em]" style={{ color: stage.accent }}>
              {stage.layer} · {stage.phase}
            </span>
            <span className="h-px w-10" style={{ background: stage.accent }} />
          </div>
          <StageText stage={stage} />
        </div>
      ))}

      {/* Logo (hero only, sits over stage 1) */}
      <div className="absolute left-6 top-6 z-30 flex items-center gap-3 md:left-16 md:top-10">
        <Image
          src={COMPANY.logo}
          alt="Vertex Synergy"
          fittingType="fit"
          className="h-10 w-12 rounded-md ring-1 ring-amber-500/30"
        />
        <span className="font-heading text-base font-bold tracking-tight text-white md:text-lg">
          VERTEX <span className="gradient-text">SYNERGY</span>
        </span>
      </div>

      {/* Stage navigation */}
      <StageNavigation active={active} visible={navVisible} ringRef={ringRef} onSelect={scrollToStage} />

      {/* Loading screen */}
      {!ready && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black">
          <div className="text-center">
            <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-amber-400">
              Loading Engineering Experience
            </div>
            <div className="mt-3 font-heading text-5xl font-bold text-white">{pct}%</div>
            <div className="mx-auto mt-4 h-px w-48 overflow-hidden bg-slate-800">
              <div className="h-full bg-amber-500 transition-all duration-300" style={{ width: `${pct}%` }} />
            </div>
          </div>
        </div>
      )}
    </section>
  );
}