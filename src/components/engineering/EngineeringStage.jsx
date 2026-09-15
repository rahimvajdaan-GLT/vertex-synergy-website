import React, { forwardRef } from "react";
import { Image } from "@/components/ui/image";
import { hiddenClip, fullClip } from "@/lib/engineeringStages";
import BlueprintAnnotations from "./BlueprintAnnotations";

// One stage's visual layer set — an elite, framed composition:
//   • deep blurred backdrop (visible context behind the subject)
//   • atmospheric ground glow
//   • floating accent particles
//   • contained subject inside a framed panel with an accent ring, corner
//     ticks, a light scan-sweep, vignette and coordinate chips.
// The timeline hook animates every sub-element for a layered reveal.
const TICKS = [
  "left-0 top-0 border-l-2 border-t-2",
  "right-0 top-0 border-r-2 border-t-2",
  "left-0 bottom-0 border-l-2 border-b-2",
  "right-0 bottom-0 border-r-2 border-b-2",
];

const EngineeringStage = forwardRef(function EngineeringStage({ stage, index, isMobile }, ref) {
  const accent = stage.accent;
  const subjectStyle = isMobile
    ? { left: "50%", transform: "translateX(-50%)", top: "24%", width: "80vw", height: "46vh" }
    : { right: "6vw", width: "44vw", maxWidth: "44vw", height: "64vh", maxHeight: "70vh" };

  return (
    <div
      ref={ref}
      className="absolute inset-0"
      style={{
        opacity: 0,
        clipPath: index === 0 ? fullClip("left") : hiddenClip(stage.wipe),
        transformOrigin: "50% 50%",
        zIndex: index + 1,
        willChange: "opacity, clip-path, filter, transform",
      }}
    >
      {/* Deep blurred backdrop — visible building context behind the subject */}
      <div className="st-bgpar absolute inset-0" style={{ willChange: "transform" }}>
        <div className="st-depth absolute inset-0" style={{ transform: "scale(1.25)", filter: "blur(30px)", opacity: 0.32 }}>
          <Image src={stage.image} fittingType="fill" loading="eager" className="block h-full w-full" alt="" />
          <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at 50% 45%, transparent 0%, #070a12 78%)" }} />
        </div>
      </div>

      {/* Soft ground glow */}
      <div
        className="absolute left-1/2 -translate-x-1/2 rounded-[50%] blur-2xl"
        style={{
          bottom: isMobile ? "8vh" : "14vh",
          width: "46vw",
          height: "90px",
          background: `radial-gradient(ellipse at 50% 50%, ${accent}40, transparent 70%)`,
        }}
      />

      {/* Floating accent particles */}
      <div className="pointer-events-none absolute inset-0">
        {Array.from({ length: 14 }).map((_, i) => (
          <span
            key={i}
            className="st-particle absolute block rounded-full float-y"
            style={{
              left: `${(i * 37) % 100}%`,
              top: `${(i * 53) % 88 + 6}%`,
              width: 3,
              height: 3,
              background: accent,
              opacity: 0,
              boxShadow: `0 0 8px ${accent}`,
              animationDelay: `${i * 0.4}s`,
            }}
          />
        ))}
      </div>

      {/* Framed subject */}
      <div className="st-subject-wrap absolute" style={subjectStyle}>
        <div className="st-fg relative h-full w-full" style={{ willChange: "transform" }}>
        {/* Accent ring behind */}
        <div className="st-ring absolute -inset-5 rounded-2xl border" style={{ borderColor: `${accent}40` }} />

        {/* Frame */}
        <div
          className="st-frame relative h-full w-full overflow-hidden rounded-xl border"
          style={{
            borderColor: "rgba(148,163,184,0.16)",
            background: "rgba(8,11,18,0.35)",
            boxShadow: `0 40px 80px -30px rgba(0,0,0,0.8), 0 0 60px -20px ${accent}40`,
          }}
        >
          <Image
            src={stage.image}
            fittingType="fit"
            loading="eager"
            className="st-img block h-full w-full"
            alt={`Vertex Synergy — ${stage.titleLines.join(" ")}`}
          />

          {/* Light scan sweep */}
          <div
            className="st-scan pointer-events-none absolute inset-x-0 top-0 h-28"
            style={{ background: `linear-gradient(to bottom, ${accent}55, transparent)`, opacity: 0 }}
          />

          {/* Vignette */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/10" />

          {/* Corner ticks */}
          {TICKS.map((c, i) => (
            <span key={i} className={`st-tick absolute h-7 w-7 ${c}`} style={{ borderColor: accent }} />
          ))}

          {/* Coordinate chip */}
          <div className="st-chip absolute bottom-3 left-3 flex items-center gap-2 rounded-md border border-slate-600/40 bg-black/50 px-2.5 py-1 font-mono text-[9px] uppercase tracking-[0.2em] text-slate-200 backdrop-blur-sm">
            <span className="h-1.5 w-1.5 rounded-full pulse-glow" style={{ background: accent }} />
            PHASE {stage.phase} · {stage.layer}
          </div>

          {/* Layer tag */}
          <div className="st-chip absolute right-3 top-3 font-mono text-[9px] uppercase tracking-[0.2em] text-slate-400">
            {stage.layer}
          </div>
        </div>
        </div>
      </div>

      <BlueprintAnnotations stage={stage} isMobile={isMobile} />
    </div>
  );
});

export default EngineeringStage;