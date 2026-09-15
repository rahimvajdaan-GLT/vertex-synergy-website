import { forwardRef } from "react";

// Presentational full-viewport scene container with an optional background
// colour (used by the master background-transition system via data-bg).
const SceneWrapper = forwardRef(function SceneWrapper(
  { children, className = "", id, bg, full = true },
  ref
) {
  return (
    <section
      ref={ref}
      id={id}
      data-bg={bg}
      className={`relative ${full ? "min-h-screen" : ""} ${className}`}
      style={bg ? { background: bg } : undefined}
    >
      {children}
    </section>
  );
});

export default SceneWrapper;