import { useEffect, useState } from "react";

// Returns true while the referenced element is within (or near) the viewport.
// Used to lazily mount heavy WebGL <Canvas> trees so the browser never tries
// to create too many WebGL contexts at once — the root cause of
// "Error creating WebGL context".
export function useInView(ref, rootMargin = "0px 0px") {
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      setInView(true);
      return;
    }
    const obs = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { rootMargin, threshold: 0 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [ref, rootMargin]);
  return inView;
}