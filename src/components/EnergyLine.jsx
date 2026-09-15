import React, { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const stages = [
{ label: "Header", sub: "Site & context" },
{ label: "About us", sub: "Concept & massing" },
{ label: "SOLUTIONS", sub: "Substructure" },
{ label: "Projects", sub: "Frame & slabs" },
{ label: "DIGITAL", sub: "Systems routing" },
{ label: "hse", sub: "Coordination" },
{ label: "path", sub: "Envelope" },
{ label: "TRUST", sub: "Fit-out" },
{ label: "timeLINES", sub: "Quality & HSE" },
{ label: "CLIENTS", sub: "Execution" },
{ label: "Completion", sub: "Handover" }];


export default function EnergyLine() {
  const [p, setP] = useState(0);

  useEffect(() => {
    let raf = null;
    const compute = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setP(max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0);
      raf = null;
    };
    const onScroll = () => {if (raf == null) raf = requestAnimationFrame(compute);};
    compute();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  const active = useMemo(() => Math.min(stages.length - 1, Math.floor(p * stages.length)), [p]);
  const n = stages.length;
  const last = n - 1;

  const nodeClass = (i) =>
  i === active ?
  "h-3.5 w-3.5 border-2 border-accent bg-accent shadow-[0_0_12px_2px_rgba(255,159,28,0.45)]" :
  i < active ?
  "h-2.5 w-2.5 border border-secondary/50 bg-secondary/30" :
  "h-2 w-2 border border-border bg-white/80";

  return (
    <div className="pointer-events-none fixed left-0 top-0 z-40 hidden h-screen md:flex">
      <div className="flex h-full flex-col py-20 pl-7 pr-4">
        <div className="relative h-full w-px">
          {/* base rail */}
          <div className="absolute inset-0 w-px bg-border/60" />
          {/* rail caps */}
          <span className="absolute -left-[5px] top-0 h-px w-[11px] bg-border/70" />
          <span className="absolute -left-[5px] bottom-0 h-px w-[11px] bg-border/70" />
          {/* progress fill */}
          <div
            className="absolute left-0 top-0 w-px bg-gradient-to-b from-secondary/50 via-secondary to-accent"
            style={{ height: `${p * 100}%` }} />
          
          {/* moving tracer */}
          <div className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2" style={{ top: `${p * 100}%` }}>
            <span className="block h-3 w-3 rounded-full bg-accent ring-2 ring-white shadow-[0_0_14px_3px_rgba(255,159,28,0.4)]" />
            <span className="absolute left-1/2 top-1/2 h-px w-7 -translate-y-1/2 bg-gradient-to-r from-accent/70 to-transparent" />
          </div>

          {/* nodes + labels */}
          {stages.map((s, i) => {
            const tp = i / last * 100;
            const isActive = i === active;
            const done = i < active;
            return (
              <div key={s.label} className="absolute left-0 -translate-y-1/2" style={{ top: `${tp}%` }}>
                <span className={`absolute left-0 -translate-x-1/2 block rounded-full ${nodeClass(i)} transition-all duration-300`} />
                <span className={`absolute left-0 top-1/2 h-px -translate-y-1/2 ${isActive ? "w-4 bg-accent/60" : done ? "w-3 bg-secondary/40" : "w-2.5 bg-border/60"}`} style={{ transform: "translate(2px,-50%)" }} />
                <div className="pointer-events-auto ml-4 cursor-default whitespace-nowrap transition-all duration-300">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[7px] tracking-[0.2em] text-muted-foreground/60">{String(i + 1).padStart(2, "0")}</span>
                    <span className={`font-mono uppercase tracking-[0.22em] transition-all duration-300 ${isActive ? "text-[9px] font-bold text-accent" : done ? "text-[9px] font-medium text-secondary/70" : "text-[9px] font-normal text-muted-foreground/60"}`}>{s.label}</span>
                  </div>
                  <AnimatePresence>
                    {isActive &&
                    <motion.span
                      initial={{ opacity: 0, height: 0, y: -4 }}
                      animate={{ opacity: 1, height: "auto", y: 0 }}
                      exit={{ opacity: 0, height: 0, y: -4 }}
                      transition={{ duration: 0.3 }}
                      className="mt-0.5 block overflow-hidden font-mono text-[8px] lowercase tracking-wider text-secondary/70">
                      
                        {s.sub}
                      </motion.span>
                    }
                  </AnimatePresence>
                </div>
              </div>);

          })}
        </div>
      </div>
    </div>);

}