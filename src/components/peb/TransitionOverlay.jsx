// Technical SVG overlays drawn over the canvas during the two model
// transitions. The parent master timeline animates the classed elements
// (stroke draw, node pop, scanline sweep, group fade) at the transition
// windows. On mobile the overlay is reduced to just the scanline.
export default function TransitionOverlay({ isMobile }) {
  if (isMobile) {
    return (
      <div className="pointer-events-none absolute inset-0 z-20" aria-hidden>
        <div
          className="peb-scan absolute inset-y-0 w-px bg-amber-500/70"
          style={{ left: "50%", opacity: 0, boxShadow: "0 0 24px rgba(249,115,22,0.7)" }}
        />
      </div>
    );
  }
  return (
    <div className="pointer-events-none absolute inset-0 z-20" aria-hidden>
      <svg className="h-full w-full" viewBox="0 0 100 56" preserveAspectRatio="xMidYMid slice" fill="none">
        {/* Phase 1 — raw to frame */}
        <g className="peb-phase-1" style={{ opacity: 0 }}>
          <line className="peb-measure" x1="18" y1="14" x2="82" y2="14" stroke="#7dd3fc" strokeWidth="0.25" strokeDasharray="2 1.5" opacity="0.6" />
          <line className="peb-measure" x1="18" y1="28" x2="82" y2="28" stroke="#7dd3fc" strokeWidth="0.25" strokeDasharray="2 1.5" opacity="0.6" />
          <line className="peb-measure" x1="18" y1="42" x2="82" y2="42" stroke="#7dd3fc" strokeWidth="0.25" strokeDasharray="2 1.5" opacity="0.6" />
          {[14, 28, 42].map((y) => (
            <g key={y}>
              <line className="peb-measure" x1="18" y1={y - 1.5} x2="18" y2={y + 1.5} stroke="#7dd3fc" strokeWidth="0.3" />
              <line className="peb-measure" x1="82" y1={y - 1.5} x2="82" y2={y + 1.5} stroke="#7dd3fc" strokeWidth="0.3" />
            </g>
          ))}
          <line className="peb-path" x1="6" y1="6" x2="50" y2="28" stroke="#f97316" strokeWidth="0.4" />
          <line className="peb-path" x1="94" y1="6" x2="50" y2="28" stroke="#f97316" strokeWidth="0.4" />
          <line className="peb-path" x1="6" y1="50" x2="50" y2="28" stroke="#f97316" strokeWidth="0.4" />
          <line className="peb-path" x1="94" y1="50" x2="50" y2="28" stroke="#f97316" strokeWidth="0.4" />
          <circle className="peb-node-1" cx="50" cy="28" r="1.2" fill="#f97316" />
          <circle className="peb-node-1" cx="6" cy="6" r="0.8" fill="#f97316" />
          <circle className="peb-node-1" cx="94" cy="6" r="0.8" fill="#f97316" />
          <circle className="peb-node-1" cx="6" cy="50" r="0.8" fill="#f97316" />
          <circle className="peb-node-1" cx="94" cy="50" r="0.8" fill="#f97316" />
        </g>
        {/* Phase 2 — frame to complete */}
        <g className="peb-phase-2" style={{ opacity: 0 }}>
          <polyline className="peb-roof" points="20,22 50,10 80,22" stroke="#f97316" strokeWidth="0.4" />
          <line className="peb-wall" x1="20" y1="22" x2="20" y2="44" stroke="#f97316" strokeWidth="0.4" />
          <line className="peb-wall" x1="80" y1="22" x2="80" y2="44" stroke="#f97316" strokeWidth="0.4" />
          <line className="peb-front" x1="20" y1="44" x2="80" y2="44" stroke="#f97316" strokeWidth="0.4" />
          <line className="peb-front" x1="30" y1="44" x2="30" y2="30" stroke="#f97316" strokeWidth="0.3" />
          <line className="peb-front" x1="30" y1="30" x2="42" y2="30" stroke="#f97316" strokeWidth="0.3" />
          <line className="peb-front" x1="42" y1="30" x2="42" y2="44" stroke="#f97316" strokeWidth="0.3" />
          <circle className="peb-node-2" cx="50" cy="10" r="0.8" fill="#f97316" />
          <circle className="peb-node-2" cx="20" cy="22" r="0.8" fill="#f97316" />
          <circle className="peb-node-2" cx="80" cy="22" r="0.8" fill="#f97316" />
          <circle className="peb-node-2" cx="20" cy="44" r="0.8" fill="#f97316" />
          <circle className="peb-node-2" cx="80" cy="44" r="0.8" fill="#f97316" />
        </g>
      </svg>
      <div
        className="peb-scan absolute inset-y-0 w-px bg-amber-500/70"
        style={{ left: "50%", opacity: 0, boxShadow: "0 0 24px rgba(249,115,22,0.7)" }}
      />
    </div>
  );
}