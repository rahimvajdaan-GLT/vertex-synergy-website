// Engineering journey data + clip-path helpers shared by the stage view and
// the GSAP timeline. The seven uploaded WebP images are used in the exact
// order requested. Company copy is drawn from the existing Vertex Synergy
// content module (src/lib/content.js) where possible.

import { STAGE_IMAGES } from "./modelAssets";
import { COMPANY } from "./content";

// Per-stage incoming reveal direction (how the next image wipes in).
// 1→2 left, 2→3 diagonal, 3→4 radial, 4→5 right, 5→6 top, 6→7 radial (final light).
export const ENGINEERING_STAGES = [
  {
    image: STAGE_IMAGES[0],
    titleLines: ["BUILDING THE FUTURE", "WITH PRECISION"],
    desc: "An end-to-end engineering and construction partner delivering intelligent, sustainable and future-ready solutions.",
    accent: "#f59e0b",
    layer: "Handover",
    phase: "01",
    callouts: [],
    cta: [
      { label: "Explore Capabilities", href: "#services" },
      { label: "Discuss Your Project", href: "#contact" },
    ],
    isHero: true,
    wipe: null,
  },
  {
    image: STAGE_IMAGES[1],
    titleLines: ["Façade Assembly"],
    desc: "High-performance façade systems engineered for aesthetics, constructability and efficiency.",
    accent: "#34d399",
    layer: "Façade",
    phase: "02",
    callouts: ["Glazing", "Mullions", "Cladding Panels", "Support Brackets", "Architectural Fins"],
    wipe: "left",
  },
  {
    image: STAGE_IMAGES[2],
    titleLines: ["Structure Frame"],
    desc: "The structural backbone that supports the architectural and engineering vision.",
    accent: "#fbbf24",
    layer: "Structure",
    phase: "03",
    callouts: ["Columns", "Primary Beams", "Floor Slabs", "Core Walls", "Structural Grid"],
    wipe: "diagonal",
  },
  {
    image: STAGE_IMAGES[3],
    titleLines: ["MEP Services"],
    desc: "Coordinated mechanical, electrical and plumbing systems integrated across the building.",
    accent: "#3b82f6",
    layer: "MEP",
    phase: "04",
    callouts: [],
    mep: [
      { label: "HVAC", color: "#3b82f6" },
      { label: "Chilled Water", color: "#22d3ee" },
      { label: "Fire Protection", color: "#ef4444" },
      { label: "Electrical", color: "#eab308" },
      { label: "Plumbing & Drainage", color: "#a855f7" },
      { label: "Controls & ELV", color: "#22c55e" },
    ],
    wipe: "radial",
  },
  {
    image: STAGE_IMAGES[4],
    titleLines: ["Interior Fit-Out"],
    desc: "Functional, high-quality interior spaces designed for comfort, usability and performance.",
    accent: "#fb923c",
    layer: "Interiors",
    phase: "05",
    callouts: ["Partitions", "Ceiling Systems", "Lighting", "Finishes", "Joinery", "Integrated Services"],
    wipe: "right",
  },
  {
    image: STAGE_IMAGES[5],
    titleLines: ["Construction Stage"],
    desc: "The live execution phase where planning, logistics, engineering and site delivery come together.",
    accent: "#f97316",
    layer: "Execution",
    phase: "06",
    timeline: [
      { label: "Foundation", pct: 100 },
      { label: "Structure", pct: 100 },
      { label: "MEP Rough-In", pct: 85 },
      { label: "Façade", pct: 70 },
      { label: "Interior Fit-Out", pct: 45 },
      { label: "Testing & Handover", pct: 20 },
    ],
    wipe: "top",
  },
  {
    image: STAGE_IMAGES[6],
    titleLines: ["ENGINEERING TODAY", "FOR A BETTER TOMORROW"],
    desc: "Vertex Synergy delivers integrated engineering and construction solutions shaped by precision, coordination and performance.",
    accent: "#f59e0b",
    layer: "Delivery",
    phase: "07",
    callouts: [],
    cta: [
      { label: "Start Your Project", href: "#contact" },
      { label: "Contact Our Team", href: "#contact" },
    ],
    isFinal: true,
    wipe: "radial",
  },
];

export const STAGE_COUNT = ENGINEERING_STAGES.length;

// Clip-path reveal helpers. `hidden` and `full` must share the same shape per
// direction so GSAP can interpolate between them.
export function hiddenClip(wipe) {
  switch (wipe) {
    case "left":
      return "inset(0 100% 0 0)";
    case "right":
      return "inset(0 0 0 100%)";
    case "top":
      return "inset(100% 0 0 0)";
    case "radial":
      return "circle(0% at 50% 50%)";
    case "diagonal":
      return "polygon(0 100%, 0 100%, -100% 0, -100% 0)";
    default:
      return "inset(0 100% 0 0)";
  }
}

export function fullClip(wipe) {
  switch (wipe) {
    case "radial":
      return "circle(145% at 50% 50%)";
    case "diagonal":
      return "polygon(0 100%, 200% 100%, 100% 0, -100% 0)";
    default:
      return "inset(0 0 0 0)";
  }
}

export { COMPANY };