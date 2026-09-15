import EngineeringStory from "@/components/engineering/EngineeringStory";

// The continuous 7-scene building journey (Hero → Façade → Structure → MEP →
// Interior → Construction → Final) is the pinned, scrubbed spine of the
// experience. It already drives camera movement, masked text, blueprint
// overlays, light sweeps, MEP legends and the stage navigator.
export default function BuildingJourney() {
  return (
    <div id="journey" className="relative">
      <EngineeringStory />
    </div>
  );
}