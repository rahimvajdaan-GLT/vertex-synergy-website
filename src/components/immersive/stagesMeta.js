// Pure metadata for the immersive scroll stages (no Three.js).
// Captions drive the overlay; cameras drive the scroll-controlled camera path.
export const STAGES = [
  {
    id: "open",
    camera: { pos: [0, 1.4, 6], target: [0, 0.3, 0] },
    caption: {
      kind: "hero",
      tag: "CONSTRUCTION · ENGINEERING · PROJECT DELIVERY",
      name: "VERTEX SYNERGY",
      title: "Engineering What Comes Next",
      sub: "We deliver complex construction and engineering projects through precision, innovation, and integrated execution.",
      buttons: [
        { label: "Explore Projects", href: "#projects" },
        { label: "Start a Project", href: "#contact" },
      ],
    },
  },
  {
    id: "typo1",
    camera: { pos: [0, 1.1, 5], target: [0, 0, 0] },
    caption: { kind: "big", text: "WE BUILD WITH PURPOSE." },
  },
  {
    id: "concept",
    camera: { pos: [7, 4.5, 9], target: [0, 3, 0] },
    caption: {
      kind: "scene",
      no: "01",
      tag: "Concept & Design",
      title: "From Vision to Form",
      sub: "Geometric volumes assemble into a low-rise development — voids carved, terraces formed, façades composed.",
    },
  },
  {
    id: "structural",
    camera: { pos: [3.2, 3, 4.2], target: [0.8, 2, 0] },
    caption: {
      kind: "scene",
      no: "02",
      tag: "Structural Engineering",
      title: "Strength in Every Connection",
      sub: "Columns, beams and slabs fly into place — then we zoom into the detail that holds it all together.",
    },
  },
  {
    id: "services",
    camera: { pos: [4.5, 2.5, 5.5], target: [0, 1.6, 0] },
    caption: {
      kind: "scene",
      no: "03",
      tag: "Building Services",
      title: "Systems Designed to Perform",
      sub: "Ducts, pipes, cable trays and air-handling units flow through the frame as one coordinated system.",
    },
  },
  {
    id: "facade",
    camera: { pos: [0, 2, 6], target: [0, 1.6, 0] },
    caption: {
      kind: "scene",
      no: "04",
      tag: "Façade",
      title: "Precision in Every Layer",
      sub: "Frame, insulation, waterproofing, cladding and glazing separate — then reassemble into a single wall.",
    },
  },
  {
    id: "equipment",
    camera: { pos: [6, 5, 8], target: [0, 3, 0] },
    caption: {
      kind: "scene",
      no: "05",
      tag: "Construction Equipment",
      title: "Capability at Every Scale",
      sub: "Tower cranes slew and lift against a rising structure — the machinery that makes delivery possible.",
    },
  },
  {
    id: "typo2",
    camera: { pos: [0, 1.1, 4.8], target: [0, 0.2, 0] },
    caption: { kind: "big", text: "WE ENGINEER EVERY DETAIL." },
  },
  {
    id: "interior",
    camera: { pos: [4, 2.5, 5], target: [0, 1.3, 0] },
    caption: {
      kind: "scene",
      no: "06",
      tag: "Interior & Fit-Out",
      title: "Spaces Brought to Life",
      sub: "Partitions, ceilings, staircases and joinery assemble into a finished interior — light by light.",
    },
  },
  {
    id: "sequence",
    camera: { pos: [7, 5, 9], target: [0, 2, 0] },
    caption: {
      kind: "scene",
      no: "07",
      tag: "Construction Sequence",
      title: "From Groundwork to Handover",
      sub: "Foundations, frame, slabs, services, façade, interior and landscape — built in one continuous pass.",
    },
  },
  {
    id: "showcase",
    camera: { pos: [6.5, 4, 8.5], target: [0, 2, 0] },
    caption: {
      kind: "scene",
      no: "08",
      tag: "Project Showcase",
      title: "Projects That Define Progress",
      sub: "Completed buildings rotate into view — each a study in delivery, from groundwork to handover.",
    },
  },
  {
    id: "typo3",
    camera: { pos: [0, 1.1, 4.8], target: [0, 0.2, 0] },
    caption: { kind: "big", text: "WE DELIVER WITH PRECISION." },
  },
  {
    id: "materials",
    camera: { pos: [0, 2, 6], target: [0, 0.6, 0] },
    caption: {
      kind: "scene",
      no: "09",
      tag: "Materials",
      title: "Built from the Right Details",
      sub: "Concrete, glass, steel, aluminium, stone, timber and insulation — selected and assembled with intent.",
    },
  },
  {
    id: "safety",
    camera: { pos: [3, 2, 5], target: [0, 0.5, 0] },
    caption: {
      kind: "scene",
      no: "10",
      tag: "Safety & Quality",
      title: "Quality Verified. Safety Embedded.",
      sub: "Every site runs on discipline — protective equipment, barriers and verified inspection at every stage.",
    },
  },
  {
    id: "final",
    camera: { pos: [0, 2.2, 8], target: [0, 1, 0] },
    caption: {
      kind: "final",
      tag: "Vertex Synergy",
      title: "Let's Build What Comes Next",
      sub: "From a single connection to a completed skyline — engineered, integrated, delivered.",
      cta: { label: "Start Your Project", href: "#contact" },
    },
  },
];