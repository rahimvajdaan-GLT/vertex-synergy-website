import StageExperience from "@/components/shared/StageExperience";

const CONFIG = {
  eyebrow: "04 / Modular Construction",
  headingWords: [
    { text: "MODULAR", accent: true },
    { text: "PORTACABIN", accent: false },
  ],
  introDesc:
    "From prepared structural materials to a complete, ready-to-deploy modular portacabin unit.",
  slots: ["portacabin_raw", "portacabin_assembly", "portacabin_complete"],
  stepLabels: ["MATERIALS", "ASSEMBLY", "COMPLETE"],
  loadingTitle: (
    <>
      <span className="gradient-text">MODULAR</span> <span className="text-white">PORTACABIN</span>
    </>
  ),
  loadingLabel: "Loading Portacabin Experience",
  stages: [
    {
      no: "01",
      title: "RAW MATERIALS",
      desc: "Steel framing sections, wall and roof panels, insulation, glazing and fittings prepared for modular assembly.",
      callouts: ["Steel Frame Sections", "Wall Panels", "Roof Panels", "Insulation", "Windows & Doors", "Flooring"],
    },
    {
      no: "02",
      title: "ASSEMBLY",
      desc: "The modular frame is erected, walls and roof fitted, and openings installed to form the unit structure.",
      callouts: ["Frame Erection", "Wall Installation", "Roof Fitting", "Window & Door Fitting", "Insulation", "Interior Lining"],
    },
    {
      no: "03",
      title: "COMPLETED PORTACABIN",
      desc: "A finished modular portacabin unit with completed interior, electrical fit-out and external finishes, ready for deployment.",
      callouts: ["Finished Unit", "Completed Interior", "Electrical Fit-Out", "Windows & Doors", "External Finish", "Ready for Use"],
      cta: true,
      ctaLabel: "Explore Modular Solutions",
    },
  ],
};

export default function PortacabinExperience() {
  return <StageExperience config={CONFIG} />;
}