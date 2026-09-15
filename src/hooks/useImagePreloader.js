import { useEffect, useState } from "react";

// Preloads a list of image URLs, reporting 0–100% progress and a `ready` flag
// once `threshold` fraction of the images have loaded (errors count as done).
export function useImagePreloader(urls, { threshold = 1 } = {}) {
  const [progress, setProgress] = useState(0);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!urls || !urls.length) {
      setProgress(100);
      setReady(true);
      return;
    }
    const total = urls.length;
    const target = Math.max(1, Math.ceil(total * threshold));
    let done = 0;
    let cancelled = false;

    const tick = () => {
      if (cancelled) return;
      done += 1;
      setProgress(Math.min(100, Math.round((done / total) * 100)));
      if (done >= target) setReady(true);
    };

    urls.forEach((url) => {
      const img = new window.Image();
      img.onload = tick;
      img.onerror = tick;
      img.src = url;
    });

    return () => {
      cancelled = true;
    };
  }, [urls, threshold]);

  return { progress, ready };
}