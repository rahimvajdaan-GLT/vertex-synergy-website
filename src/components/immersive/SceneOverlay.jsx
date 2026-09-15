import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { STAGES } from "./stagesMeta";

export default function SceneOverlay({ stageIndex, progress }) {
  const stage = STAGES[stageIndex];
  const c = stage.caption;
  const N = STAGES.length;

  return (
    <div className="pointer-events-none absolute inset-0">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_52%,rgba(15,23,42,0.14)_100%)]" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-white/80 to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-white/80 to-transparent" />
      <div className="absolute inset-0 flex items-end justify-start px-6 pb-[12vh] md:px-16 md:pb-[14vh]">
        <AnimatePresence mode="wait">
          <motion.div
            key={stageIndex}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-3xl"
          >
            {c.kind === "hero" && (
              <>
                <div className="font-mono text-[11px] uppercase tracking-[0.35em] text-slate-500 md:text-xs">{c.tag}</div>
                <div className="mt-4 font-display text-[12vw] font-bold leading-[0.9] tracking-tighter text-slate-900 md:text-[7vw]">{c.name}</div>
                <div className="mt-5 font-display text-2xl font-bold tracking-tight text-slate-800 md:text-4xl">{c.title}</div>
                <p className="mt-3 max-w-xl text-sm text-slate-600 md:text-base">{c.sub}</p>
                <div className="pointer-events-auto mt-7 flex flex-wrap gap-3">
                  {c.buttons.map((b) => (
                    <a
                      key={b.label}
                      href={b.href}
                      className={
                        b.label.includes("Start")
                          ? "inline-flex items-center rounded-full bg-orange-500 px-6 py-3 font-mono text-[11px] uppercase tracking-[0.2em] text-white shadow-lg shadow-orange-500/30 transition-colors hover:bg-orange-600"
                          : "inline-flex items-center rounded-full border border-slate-300 bg-white/60 px-6 py-3 font-mono text-[11px] uppercase tracking-[0.2em] text-slate-700 backdrop-blur transition-colors hover:border-slate-400"
                      }
                    >
                      {b.label}
                    </a>
                  ))}
                </div>
              </>
            )}

            {c.kind === "big" && (
              <div className="font-display text-[13vw] font-bold leading-[0.92] tracking-tighter text-slate-900 md:text-[10vw]">{c.text}</div>
            )}

            {c.kind === "scene" && (
              <>
                <div className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.3em] text-slate-500">
                  <span className="text-orange-500">{c.no}</span>
                  <span className="h-px w-8 bg-slate-300" />
                  {c.tag}
                </div>
                <div className="mt-4 font-display text-3xl font-bold tracking-tighter text-slate-900 md:text-6xl">{c.title}</div>
                <p className="mt-3 max-w-xl text-sm text-slate-600 md:text-base">{c.sub}</p>
              </>
            )}

            {c.kind === "final" && (
              <>
                <div className="font-mono text-[11px] uppercase tracking-[0.35em] text-slate-500">{c.tag}</div>
                <div className="mt-4 font-display text-4xl font-bold tracking-tighter text-slate-900 md:text-7xl">{c.title}</div>
                <p className="mt-3 max-w-xl text-sm text-slate-600 md:text-base">{c.sub}</p>
                <div className="pointer-events-auto mt-7">
                  <a href={c.cta.href} className="inline-flex items-center rounded-full bg-orange-500 px-7 py-3.5 font-mono text-[11px] uppercase tracking-[0.2em] text-white shadow-lg shadow-orange-500/30 transition-colors hover:bg-orange-600">
                    {c.cta.label}
                  </a>
                </div>
              </>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="absolute bottom-6 right-6 flex items-center gap-3 md:bottom-8 md:right-10">
        <span className="font-mono text-[11px] tracking-[0.2em] text-slate-500">
          {String(stageIndex + 1).padStart(2, "0")} / {String(N).padStart(2, "0")}
        </span>
        <span className="h-px w-24 overflow-hidden bg-slate-200">
          <span className="block h-full bg-orange-500" style={{ width: `${progress * 100}%` }} />
        </span>
      </div>

      {stageIndex === 0 && progress < 0.02 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 font-mono text-[10px] uppercase tracking-[0.3em] text-slate-500"
        >
          Scroll to explore
        </motion.div>
      )}
    </div>
  );
}