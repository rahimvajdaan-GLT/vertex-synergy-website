import StageExperience from "@/components/shared/StageExperience";

const CONFIG = {
  eyebrow: "02 / Pre-Engineered Buildings",
  headingWords: [
    { text: "PEB", accent: true },
    { text: "FABRICATION", accent: false },
  ],
  introDesc:
    "From raw steel to a completed pre-engineered building — explore the PEB fabrication journey, stage by stage.",
  slots: ["peb_raw", "peb_frame", "peb_complete"],
  stepLabels: ["RAW", "FRAME", "COMPLETE"],
  loadingTitle: (
    <>
      <span className="gradient-text">PEB</span> <span className="text-white">FABRICATION</span>
    </>
  ),
  loadingLabel: "Loading PEB Experience",
  stages: [
    {
      no: "01",
      group: "PEB",
      title: "RAW MATERIALS",
      desc: "Pre-engineered steel framing, roof and wall sheeting, insulation and cold-formed components prepared for fabrication.",
      callouts: ["Primary Steel", "Roof Sheeting", "Wall Panels", "Insulation", "Cold-Formed Purlins", "Fixings & Bracing"],
    },
    {
      no: "02",
      group: "PEB",
      title: "FRAME ERECTION",
      desc: "Columns and rafters are bolted up, purlins and bracing installed, forming the structural skeleton of the building.",
      callouts: ["Columns & Rafters", "Bolted Connections", "Purlins", "Roof Bracing", "Wall Bracing", "Mezzanine Beams"],
    },
    {
      no: "03",
      group: "PEB",
      title: "COMPLETED BUILDING",
      desc: "A finished pre-engineered building with cladding, insulation, doors and glazing installed, ready for handover.",
      callouts: ["Cladding", "Insulated Envelope", "Doors & Glazing", "Crane Systems", "Finishes", "Ready for Handover"],
      cta: true,
      ctaLabel: "Start Your PEB Project",
    },
  ],
};

export default function PEBExperience() {
  return <StageExperience config={CONFIG} />;
}