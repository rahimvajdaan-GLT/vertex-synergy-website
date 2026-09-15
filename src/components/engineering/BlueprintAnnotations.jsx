import React from "react";

// Technical blueprint overlay rendered inside each stage. It inherits the
// stage container's GSAP-driven opacity + clip-path, so the linework and tags
// fade (and wipe) in as the user scrolls to that stage — no extra timeline
// wiring needed. Purely decorative: pointer-events disabled, no logic.

const REG = 7;

function Cross({ className }) {
  return (
    <div className={className} style={{ width: REG, height: REG, position: "relative" }}>
      <div className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-cyan-400/60" />
      <div className="absolute top-1/2 left-0 h-px w-full -translate-y-1/2 bg-cyan-400/60" />
    </div>
  );
}

function buildTags(stage) {
  if (Array.isArray(stage.callouts) && stage.callouts.length)
    return stage.callouts.map((c) => (typeof c === "string" ? c : `${c.k}: ${c.v}`));
  if (stage.mep) return stage.mep.map((m) => m.label);
  if (stage.timeline) return stage.timeline.map((t) => t.label);
  return stage.isHero
    ? ["Integrated Vision", "Urban Context", "Performance"]
    : ["Delivery", "Performance", "Lifecycle"];
}

export default function BlueprintAnnotations({ stage, isMobile }) {
  const tags = buildTags(stage).slice(0, isMobile ? 2 : 3);
  const dwg = `DWG-0${stage.phase}`;
  const discipline = (stage.layer || "").toUpperCase();

  const chipPos = isMobile
    ? [{ left: "5%", top: "7%" }, { right: "5%", bottom: "30%" }]
    : [{ left: "9%", top: "32%" }, { right: "26%", top: "20%" }, { left: "11%", bottom: "26%" }];

  return (
    <div className="pointer-events-none absolute inset-0 z-20 font-mono">
      <Cross className="absolute left-3 top-3" />
      <Cross className="absolute bottom-3 right-3" />

      {!isMobile && (
        <>
          {/* Top dimension line + coordinate ticks */}
          <div className="absolute left-[9%] right-[9%] top-[6.5%]">
            <div className="relative h-3">
              <div className="absolute left-0 top-1/2 h-px w-full -translate-y-1/2 bg-amber-500/45" />
              <div className="absolute left-0 top-1/2 h-2 w-px -translate-y-1/2 bg-amber-500/70" />
              <div className="absolute right-0 top-1/2 h-2 w-px -translate-y-1/2 bg-amber-500/70" />
              {[25, 50, 75].map((p) => (
                <div key={p} className="absolute top-1/2 h-1.5 w-px -translate-y-1/2 bg-cyan-400/45" style={{ left: `${p}%` }} />
              ))}
            </div>
            <div className="mt-0.5 flex justify-between text-[8px] tracking-wider text-slate-400">
              <span>0.0</span><span>12.0</span><span>24.0</span><span>36.0</span><span>48.5 m</span>
            </div>
          </div>

          {/* Left dimension line */}
          <div className="absolute left-[5.5%] top-[15%] bottom-[19%]">
            <div className="relative h-full w-3">
              <div className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-amber-500/45" />
              <div className="absolute left-1/2 top-0 h-px w-2 -translate-x-1/2 bg-amber-500/70" />
              <div className="absolute left-1/2 bottom-0 h-px w-2 -translate-x-1/2 bg-amber-500/70" />
              {[33, 66].map((p) => (
                <div key={p} className="absolute left-1/2 w-1.5 h-px -translate-x-1/2 bg-cyan-400/45" style={{ top: `${p}%` }} />
              ))}
            </div>
          </div>
        </>
      )}

      {/* Callout chips with leader lines */}
      {tags.map((label, i) => {
        const pos = chipPos[i] || chipPos[0];
        return (
          <div key={i} className="absolute" style={pos}>
            <div className="flex items-center gap-2">
              <div className="h-1.5 w-1.5 rounded-full bg-amber-400 shadow-[0_0_8px_rgba(249,115,22,0.8)]" />
              <div className="h-px w-6 bg-amber-500/55" />
              <div className="border border-cyan-400/40 bg-[#0a0e17]/75 px-2 py-1 backdrop-blur-sm">
                <div className="text-[7px] uppercase tracking-[0.18em] text-cyan-300">
                  {stage.phase}.{i + 1}
                </div>
                <div className="whitespace-nowrap text-[9px] font-semibold text-slate-100">{label}</div>
              </div>
            </div>
          </div>
        );
      })}

      {/* Bottom drawing block */}
      <div className="absolute bottom-4 left-4 md:bottom-6 md:left-6">
        <div className="border border-slate-500/30 bg-[#0a0e17]/75 px-3 py-2 backdrop-blur-sm">
          <div className="flex items-center gap-2 text-[8px] tracking-[0.2em]">
            <span className="text-amber-400">{dwg}</span>
            <span className="text-slate-600">·</span>
            <span className="text-cyan-300">{discipline}</span>
          </div>
          <div className="mt-1.5 flex items-center gap-2">
            <div className="flex">
              {[0, 1, 2, 3].map((s) => (
                <div key={s} className={`h-2 w-4 border border-slate-400/40 ${s % 2 ? "bg-transparent" : "bg-slate-300/70"}`} />
              ))}
            </div>
            <span className="text-[8px] tracking-wider text-slate-400">SCALE NTS</span>
          </div>
          <div className="mt-1 text-[7px] tracking-[0.3em] text-slate-500">VERTEX SYNERGY · ENGINEERING</div>
        </div>
      </div>
    </div>
  );
}