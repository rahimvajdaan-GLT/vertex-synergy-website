import ScrollVideoExperience from "@/components/shared/ScrollVideoExperience";

// The uploaded PEB transformation video ("generated_video").
const PEB_VIDEO_URL =
  "https://media.base44.com/videos/public/6a62011d4b7a1c7d8b3b0f95/eeea89ba9_PEB.mp4";

const STAGES = [
  {
    no: "01",
    short: "MATERIALS",
    title: "RAW MATERIALS",
    desc: "Structural steel members, roof panels, wall panels, purlins and connection components prepared for fabrication.",
    callouts: ["Primary Steel", "Purlins", "Roof Panels", "Wall Panels", "Connection Components"],
  },
  {
    no: "02",
    short: "ASSEMBLY",
    title: "FABRICATION AND ASSEMBLY",
    desc: "Columns, rafters, bracing and secondary steel are assembled into the complete structural frame.",
    callouts: ["Structural Columns", "Rafters", "Bracing", "Secondary Steel", "Frame Connections"],
  },
  {
    no: "03",
    short: "COMPLETE",
    title: "COMPLETED PEB BUILDING",
    desc: "A complete, durable and efficient pre-engineered building ready for operational use.",
    callouts: ["Complete Structure", "Roofing System", "Wall Cladding", "Doors and Windows", "Finished Envelope"],
  },
];

// The hero doubles as the PEB scroll-controlled video experience.
export default function HeroExperience() {
  return (
    <ScrollVideoExperience
      eyebrow="01 / PRE-ENGINEERED BUILDINGS"
      headingPrefix="FROM RAW STEEL TO"
      headingAccent="COMPLETE PEB"
      stages={STAGES}
      videoUrl={PEB_VIDEO_URL}
      dataBg="#000000"
    />
  );
}