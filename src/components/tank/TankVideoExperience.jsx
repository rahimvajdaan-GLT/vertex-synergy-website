import ScrollVideoExperience from "@/components/shared/ScrollVideoExperience";

// Replace with the uploaded tank fabrication transformation video URL.
const TANK_VIDEO_URL =
  "https://media.base44.com/videos/public/6a62011d4b7a1c7d8b3b0f95/b781a94ae_tank.mp4";

const STAGES = [
  {
    no: "01",
    short: "RAW",
    title: "RAW STEEL",
    desc: "Steel plates and coils prepared for cutting, rolling and welding into storage tank shells.",
    callouts: ["Steel Plates", "Shell Courses", "Annular Plates", "Nozzles", "Filler Metals", "Coatings"],
  },
  {
    no: "02",
    short: "FAB",
    title: "FABRICATION & ASSEMBLY",
    desc: "Plates are rolled, welded and assembled into tank courses with nozzles and internal fittings.",
    callouts: ["Plate Rolling", "Welding", "Course Assembly", "Nozzle Fitting", "Internal Fittings", "Surface Prep"],
  },
  {
    no: "03",
    short: "COMPLETE",
    title: "COMPLETED STORAGE TANK",
    desc: "A finished storage tank with coatings, roof and instrumentation installed, ready for commissioning.",
    callouts: ["Coated & Lined", "Roof Installed", "Instrumentation", "Manways", "Anchorage", "Ready to Commission"],
    cta: true,
    ctaLabel: "Start Your Tank Project",
  },
];

export default function TankVideoExperience() {
  return (
    <ScrollVideoExperience
      eyebrow="03 / TANK FABRICATION"
      headingPrefix="FROM RAW STEEL TO"
      headingAccent="COMPLETE TANK"
      stages={STAGES}
      videoUrl={TANK_VIDEO_URL}
      dataBg="#070a12"
    />
  );
}