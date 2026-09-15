import StageExperience from "@/components/shared/StageExperience";

const CONFIG = {
  eyebrow: "03 / Tank Fabrication",
  headingWords: [
    { text: "TANK", accent: true },
    { text: "FABRICATION", accent: false },
  ],
  introDesc:
    "From raw steel plates to a completed storage tank — explore the tank fabrication and assembly journey, stage by stage.",
  slots: ["tank_raw", "tank_fabrication", "tank_complete"],
  stepLabels: ["RAW", "FAB", "COMPLETE"],
  loadingTitle: (
    <>
      <span className="gradient-text">TANK</span> <span className="text-white">FABRICATION</span>
    </>
  ),
  loadingLabel: "Loading Tank Experience",
  stages: [
    {
      no: "01",
      group: "TANK",
      title: "RAW STEEL",
      desc: "Steel plates and coils prepared for cutting, rolling and welding into storage tank shells.",
      callouts: ["Steel Plates", "Shell Courses", "Annular Plates", "Nozzles", "Filler Metals", "Coatings"],
    },
    {
      no: "02",
      group: "TANK",
      title: "FABRICATION & ASSEMBLY",
      desc: "Plates are rolled, welded and assembled into tank courses with nozzles and internal fittings.",
      callouts: ["Plate Rolling", "Welding", "Course Assembly", "Nozzle Fitting", "Internal Fittings", "Surface Prep"],
    },
    {
      no: "03",
      group: "TANK",
      title: "COMPLETED STORAGE TANK",
      desc: "A finished storage tank with coatings, roof and instrumentation installed, ready for commissioning.",
      callouts: ["Coated & Lined", "Roof Installed", "Instrumentation", "Manways", "Anchorage", "Ready to Commission"],
      cta: true,
      ctaLabel: "Start Your Tank Project",
    },
  ],
};

export default function TankExperience() {
  return <StageExperience config={CONFIG} />;
}