import ScrollVideoExperience from "@/components/shared/ScrollVideoExperience";

// Uploaded modular portacabin transformation video.
const PORTACABIN_VIDEO_URL =
  "https://media.base44.com/videos/public/6a62011d4b7a1c7d8b3b0f95/fdaebadec_Portacabin.mp4";

const STAGES = [
  {
    no: "01",
    short: "MATERIALS",
    title: "RAW MATERIALS",
    desc: "Steel framing sections, wall and roof panels, insulation, glazing and fittings prepared for modular assembly.",
    callouts: ["Steel Frame Sections", "Wall Panels", "Roof Panels", "Insulation", "Windows & Doors", "Flooring"],
  },
  {
    no: "02",
    short: "ASSEMBLY",
    title: "ASSEMBLY",
    desc: "The modular frame is erected, walls and roof fitted, and openings installed to form the unit structure.",
    callouts: ["Frame Erection", "Wall Installation", "Roof Fitting", "Window & Door Fitting", "Insulation", "Interior Lining"],
  },
  {
    no: "03",
    short: "COMPLETE",
    title: "COMPLETED PORTACABIN",
    desc: "A finished modular portacabin unit with completed interior, electrical fit-out and external finishes, ready for deployment.",
    callouts: ["Finished Unit", "Completed Interior", "Electrical Fit-Out", "Windows & Doors", "External Finish", "Ready for Use"],
    cta: true,
    ctaLabel: "Explore Modular Solutions",
  },
];

export default function PortacabinVideoExperience() {
  return (
    <ScrollVideoExperience
      eyebrow="04 / MODULAR CONSTRUCTION"
      headingPrefix="FROM MATERIALS TO"
      headingAccent="COMPLETE PORTACABIN"
      stages={STAGES}
      videoUrl={PORTACABIN_VIDEO_URL}
      dataBg="#070a12"
    />
  );
}