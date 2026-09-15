import React, { useEffect, useRef, forwardRef } from "react";

// SVG blueprint linework that bridges stages. Lines start hidden
// (stroke-dashoffset = length) and are traced by the GSAP timeline during the
// middle of each transition, then faded back to a faint ghost. The parent
// timeline animates the group's opacity and each .bp-line's strokeDashoffset.
const LINES = [
  // verticals
  { x1: 12, y1: 0, x2: 12, y2: 100 },
  { x1: 32, y1: 0, x2: 32, y2: 100 },
  { x1: 52, y1: 0, x2: 52, y2: 100 },
  { x1: 72, y1: 0, x2: 72, y2: 100 },
  { x1: 88, y1: 0, x2: 88, y2: 100 },
  // horizontals
  { x1: 0, y1: 18, x2: 100, y2: 18 },
  { x1: 0, y1: 42, x2: 100, y2: 42 },
  { x1: 0, y1: 64, x2: 100, y2: 64 },
  { x1: 0, y1: 84, x2: 100, y2: 84 },
  // diagonal + arch
  { x1: 0, y1: 100, x2: 100, y2: 0, dashed: true },
  { x1: 0, y1: 0, x2: 100, y2: 100, dashed: true },
];

const BlueprintOverlay = forwardRef(function BlueprintOverlay(_props, ref) {
  const svgRef = useRef(null);

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;
    const lines = svg.querySelectorAll(".bp-line");
    lines.forEach((l) => {
      try {
        const len = l.getTotalLength();
        l.style.strokeDasharray = String(len);
        l.style.strokeDashoffset = String(len);
      } catch {
        /* ignore */
      }
    });
  }, []);

  return (
    <svg
      ref={(node) => {
        svgRef.current = node;
        if (typeof ref === "function") ref(node);
        else if (ref) ref.current = node;
      }}
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      className="pointer-events-none absolute inset-0 h-full w-full"
      style={{ opacity: 0 }}
    >
      {LINES.map((l, i) => (
        <line
          key={i}
          className="bp-line"
          x1={l.x1}
          y1={l.y1}
          x2={l.x2}
          y2={l.y2}
          vectorEffect="non-scaling-stroke"
          stroke={l.dashed ? "rgba(56,189,248,0.85)" : "rgba(249,115,22,0.9)"}
          strokeWidth={l.dashed ? 1.1 : 1}
          style={{ vectorEffect: "non-scaling-stroke" }}
        />
      ))}
      {/* discipline label tick marks */}
      <text x="6" y="9" className="bp-text" fill="rgba(148,163,184,0.8)" fontSize="2.4" fontFamily="monospace">
        DISCIPLINE: STRUCTURAL · MEP · ARCH
      </text>
    </svg>
  );
});

export default BlueprintOverlay;