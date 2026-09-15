// Seven-stage scroll story. The visual layer is driven by the seven uploaded
// WebP isometric renders (STAGE_IMAGES) in the exact order requested:
// 1 hero-completed, 2 façade, 3 structural, 4 mep, 5 interior,
// 6 construction, 7 completed. STAGE_SLOTS / UNIQUE_SLOTS / MODEL_FILES are
// retained for the interactive ModelExplorer (GLB assets).

export const STAGE_SLOTS = [
  "completed",
  "main",
  "facade",
  "structure",
  "mep",
  "interior",
  "crane",
];

export const UNIQUE_SLOTS = [
  "completed",
  "main",
  "facade",
  "structure",
  "mep",
  "interior",
  "crane",
];

export const MODEL_FILES = UNIQUE_SLOTS.map((id) => ({ id }));

// The seven uploaded WebP visuals, in the exact scroll order requested.
export const STAGE_IMAGES = [
  "https://media.base44.com/images/public/6a62011d4b7a1c7d8b3b0f95/d8b749f99_hero-completed-building.webp",
  "https://media.base44.com/images/public/6a62011d4b7a1c7d8b3b0f95/7c116b766_facade-assembly.webp",
  "https://media.base44.com/images/public/6a62011d4b7a1c7d8b3b0f95/669b43255_structural-frame.webp",
  "https://media.base44.com/images/public/6a62011d4b7a1c7d8b3b0f95/ab54bdf59_mep-services.webp",
  "https://media.base44.com/images/public/6a62011d4b7a1c7d8b3b0f95/95a4060f1_interior-fitout.webp",
  "https://media.base44.com/images/public/6a62011d4b7a1c7d8b3b0f95/807c5c1ad_construction-stage.webp",
  "https://media.base44.com/images/public/6a62011d4b7a1c7d8b3b0f95/f8e13f1eb_completed-building.webp",
];

export const SLOTS = [
  {
    id: "stage-1",
    name: "Complete Building",
    title: "Complete Building",
    kicker: "Stage 01 — Complete Building",
    body: "The final integrated vision brought to life with precision, coordination and performance.",
    accent: "#f59e0b",
    icon: "Building2",
    layer: "Handover",
    phase: "01",
    callouts: [
      { k: "Performance", v: "Verified" },
      { k: "Urban Context", v: "Integrated" },
      { k: "Handover", v: "Complete" },
    ],
  },
  {
    id: "stage-2",
    name: "Façade Assembly",
    title: "Façade Assembly",
    kicker: "Stage 02 — Façade Assembly",
    body: "High-performance façade systems engineered for aesthetics, constructability and efficiency.",
    accent: "#34d399",
    icon: "PanelsTopLeft",
    layer: "Façade",
    phase: "02",
    callouts: [
      { k: "Glazing", v: "High-Performance" },
      { k: "System", v: "Unitized" },
      { k: "Detail", v: "Exploded" },
    ],
  },
  {
    id: "stage-3",
    name: "Structure Frame",
    title: "Structure Frame",
    kicker: "Stage 03 — Structure Frame",
    body: "The structural backbone that supports the architectural and engineering vision.",
    accent: "#fbbf24",
    icon: "Frame",
    layer: "Structure",
    phase: "03",
    callouts: [
      { k: "Frame", v: "Optimized" },
      { k: "Nodes", v: "Coordinated" },
      { k: "Material", v: "RCC / Steel" },
    ],
  },
  {
    id: "stage-4",
    name: "MEP Services",
    title: "MEP Services",
    kicker: "Stage 04 — MEP Services",
    body: "Coordinated mechanical, electrical and plumbing systems integrated across the building.",
    accent: "#3b82f6",
    icon: "Cable",
    layer: "MEP",
    phase: "04",
    mep: true,
    callouts: [
      { k: "HVAC", v: "Coordinated" },
      { k: "Electrical", v: "Routed" },
      { k: "Fire", v: "Integrated" },
    ],
  },
  {
    id: "stage-5",
    name: "Interior Fit-Out",
    title: "Interior Fit-Out",
    kicker: "Stage 05 — Interior Fit-Out",
    body: "Functional, high-quality interior spaces designed for comfort, usability and performance.",
    accent: "#a855f7",
    icon: "Armchair",
    layer: "Interiors",
    phase: "05",
    callouts: [
      { k: "Lighting", v: "Layered" },
      { k: "Finishes", v: "Coordinated" },
      { k: "Comfort", v: "Optimized" },
    ],
  },
  {
    id: "stage-6",
    name: "Construction Stage",
    title: "Construction Stage",
    kicker: "Stage 06 — Construction Stage",
    body: "The live execution phase where planning, logistics, engineering and site delivery come together.",
    accent: "#f97316",
    icon: "Construction",
    layer: "Execution",
    phase: "06",
    equipment: true,
    callouts: [
      { k: "Programme", v: "On Track" },
      { k: "Safety", v: "Controlled" },
      { k: "Quality", v: "Assured" },
    ],
    timeline: [
      { label: "Foundation", pct: 100 },
      { label: "Structure", pct: 100 },
      { label: "MEP Rough-In", pct: 85 },
      { label: "Façade", pct: 70 },
      { label: "Interior Fit-Out", pct: 45 },
      { label: "Completion", pct: 20 },
    ],
  },
  {
    id: "stage-7",
    name: "Complete Building",
    title: "Complete Building",
    kicker: "Stage 07 — Complete Building",
    body: "The final completed result — a fully integrated building delivered through engineering excellence.",
    accent: "#f59e0b",
    icon: "Building2",
    layer: "Delivery",
    phase: "07",
    final: true,
    closing: "Engineering Today for a Better Tomorrow",
    callouts: [
      { k: "Delivery", v: "End-to-End" },
      { k: "Performance", v: "Consistent" },
      { k: "Support", v: "Lifecycle" },
    ],
  },
];