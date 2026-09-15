import React from "react";
import { ENGINEERING_STAGES } from "@/lib/engineeringStages";

// Vertical stage navigation (01–07). The active stage brightens, extends its
// indicator line, shows the stage name and gains a circular progress ring
// driven by the scroll timeline. Clicking a stage scrolls to that stage.
export default function StageNavigation({ active, visible, ringRef, onSelect }) {
  return (
    <nav
      className={`fixed right-4 top-1/2 z-40 hidden -translate-y-1/2 flex-col gap-3 transition-opacity duration-500 md:flex ${
        visible ? "opacity-100" : "pointer-events-none opacity-0"
      }`}
    >
      {ENGINEERING_STAGES.map((s, i) => {
        const isActive = i === active;
        return (
          <button
            key={s.phase}
            onClick={() => onSelect(i)}
            className="group flex items-center justify-end gap-3"
            aria-label={`Go to stage ${s.phase}`}
          >
            <span
              className={`font-mono text-[9px] uppercase tracking-[0.18em] transition-all duration-300 ${
                isActive ? "text-slate-100 opacity-100" : "text-slate-500 opacity-0 group-hover:opacity-70"
              }`}
            >
              {s.layer}
            </span>
            <span
              className="h-px transition-all duration-300"
              style={{
                width: isActive ? 26 : 12,
                background: isActive ? s.accent : "#334155",
                boxShadow: isActive ? `0 0 8px ${s.accent}` : "none",
              }}
            />
            <span className="relative flex h-7 w-7 items-center justify-center">
              {isActive && (
                <svg className="absolute inset-0 h-full w-full -rotate-90" viewBox="0 0 32 32">
                  <circle cx="16" cy="16" r="14" fill="none" stroke="rgba(148,163,184,0.2)" strokeWidth="1.5" />
                  <circle
                    ref={ringRef}
                    cx="16"
                    cy="16"
                    r="14"
                    fill="none"
                    stroke={s.accent}
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    style={{ strokeDasharray: 88, strokeDashoffset: 88 }}
                  />
                </svg>
              )}
              <span
                className="font-mono text-[10px] tracking-[0.12em] transition-colors duration-300"
                style={{ color: isActive ? s.accent : "#475569" }}
              >
                {s.phase}
              </span>
            </span>
          </button>
        );
      })}
    </nav>
  );
}