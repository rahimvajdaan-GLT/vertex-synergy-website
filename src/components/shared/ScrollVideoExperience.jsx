import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { cn } from "@/lib/utils";

gsap.registerPlugin(ScrollTrigger);

// Number of frames to extract from the video and the max width of each
// captured frame. More frames = smoother scrub but more memory; 48 at 1024px
// is a good balance for a full-bleed background.
const FRAME_COUNT = 48;
const MAX_WIDTH = 1024;

// Reusable full-bleed, scroll-controlled video background. Instead of seeking
// the video element's `currentTime` on scroll (which stutters/hangs because each
// seek waits on a decode), we extract a fixed image sequence from the video
// (as ImageBitmaps) and paint the matching frame to a <canvas> as the user
// scrolls. The very first frame is painted the moment it is decoded so the
// section is never dark; the remaining frames fill in afterwards.
export default function ScrollVideoExperience({
  eyebrow,
  headingPrefix,
  headingAccent,
  stages,
  videoUrl = "",
  height = "180vh",
  dataBg = "#000000",
  indexLabel = "01",
}) {
  const sectionRef = useRef(null);
  const canvasRef = useRef(null);
  const lineRef = useRef(null);
  const framesRef = useRef([]); // ImageBitmaps, grows as frames are captured
  const capRef = useRef(null); // reusable capture canvas
  const [ready, setReady] = useState(false); // first frame painted
  const [prep, setPrep] = useState(0); // 0..100 extraction progress
  const [activeStage, setActiveStage] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const fn = () => setReducedMotion(mq.matches);
    mq.addEventListener?.("change", fn);
    return () => mq.removeEventListener?.("change", fn);
  }, []);

  // Extract a fixed image sequence from the video. We use the browser's native
  // preloading (preload="auto"), paint frame 0 as soon as the first frame is
  // decoded (so the section is never blank), then capture the remaining frames
  // sequentially in the background.
  useEffect(() => {
    if (!videoUrl) {
      framesRef.current = [];
      setReady(false);
      setPrep(0);
      return;
    }
    let cancelled = false;
    const video = document.createElement("video");
    video.muted = true;
    video.playsInline = true;
    video.preload = "auto";
    video.crossOrigin = "anonymous";
    video.src = videoUrl;
    video.load(); // kick off native preloading immediately
    const bitmaps = [];

    const drawCurrent = async () => {
      const vw = video.videoWidth || MAX_WIDTH;
      const vh = video.videoHeight || Math.round((MAX_WIDTH * 9) / 16);
      const w = Math.min(MAX_WIDTH, vw);
      const h = Math.round((w * vh) / vw);
      if (!capRef.current) {
        const cap = document.createElement("canvas");
        cap.width = w;
        cap.height = h;
        capRef.current = cap;
      }
      const cap = capRef.current;
      cap.getContext("2d").drawImage(video, 0, 0, cap.width, cap.height);
      return window.createImageBitmap(cap);
    };

    const seekTo = (t) =>
      new Promise((resolve) => {
        const onSeeked = () => {
          video.removeEventListener("seeked", onSeeked);
          requestAnimationFrame(resolve);
        };
        video.addEventListener("seeked", onSeeked);
        try {
          video.currentTime = t;
        } catch {
          resolve();
        }
      });

    const run = async () => {
      // Wait until the first frame is available, then paint it immediately.
      await new Promise((resolve) => {
        if (video.readyState >= 2) return resolve();
        video.addEventListener("loadeddata", resolve, { once: true });
      });
      if (cancelled) return;
      const dur = video.duration;
      if (!dur || !isFinite(dur)) return;

      let first;
      try {
        first = await drawCurrent();
      } catch (e) {
        console.error("Frame extraction failed", e);
        return;
      }
      if (cancelled || !first) return;
      bitmaps.push(first);
      framesRef.current = [first];
      setReady(true);
      setPrep(Math.round((1 / FRAME_COUNT) * 100));

      // Capture the remaining frames sequentially (native buffering serves seeks).
      for (let i = 1; i < FRAME_COUNT; i++) {
        if (cancelled) return;
        const t = (i / (FRAME_COUNT - 1)) * dur;
        await seekTo(t);
        if (cancelled) return;
        let bmp;
        try {
          bmp = await drawCurrent();
        } catch (e) {
          console.error("Frame extraction failed", e);
          return;
        }
        if (cancelled || !bmp) return;
        bitmaps.push(bmp);
        framesRef.current = bitmaps.slice();
        setPrep(Math.round(((i + 1) / FRAME_COUNT) * 100));
      }
    };

    run();

    return () => {
      cancelled = true;
      bitmaps.forEach((b) => b.close?.());
      framesRef.current = [];
      capRef.current = null;
      video.removeAttribute("src");
      video.load();
    };
  }, [videoUrl]);

  // Drive the canvas from scroll: GSAP scrubs a proxy 0→1, and each tick we
  // paint the frame at the matching index. No video seeking happens here.
  useEffect(() => {
    if (!ready) return;
    const canvas = canvasRef.current;
    const section = sectionRef.current;
    if (!canvas || !section) return;
    const ctx = canvas.getContext("2d");

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.max(1, Math.floor(canvas.clientWidth * dpr));
      canvas.height = Math.max(1, Math.floor(canvas.clientHeight * dpr));
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    const draw = (p) => {
      const fr = framesRef.current;
      if (!fr.length) return;
      const idx = Math.min(fr.length - 1, Math.max(0, Math.round(p * (fr.length - 1))));
      const bmp = fr[idx];
      if (!bmp) return;
      const cw = canvas.width;
      const ch = canvas.height;
      const scale = Math.max(cw / bmp.width, ch / bmp.height);
      const dw = bmp.width * scale;
      const dh = bmp.height * scale;
      ctx.drawImage(bmp, (cw - dw) / 2, (ch - dh) / 2, dw, dh);
    };

    draw(0);

    if (reducedMotion) {
      draw(0.5);
      if (lineRef.current) lineRef.current.style.transform = "scaleX(0.5)";
      return () => ro.disconnect();
    }

    const proxy = { p: 0 };
    const gsapCtx = gsap.context(() => {
      gsap.to(proxy, {
        p: 1,
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "bottom bottom",
          scrub: 1.2,
          invalidateOnRefresh: true,
        },
        onUpdate: () => {
          draw(proxy.p);
          if (lineRef.current) lineRef.current.style.transform = `scaleX(${proxy.p})`;
          const stage = proxy.p < 0.3 ? 0 : proxy.p < 0.7 ? 1 : 2;
          setActiveStage((prev) => (prev === stage ? prev : stage));
        },
      });
    }, section);
    return () => {
      gsapCtx.revert();
      ro.disconnect();
    };
  }, [ready, reducedMotion]);

  // Drive stage crossfade from scroll before the first frame is ready.
  useEffect(() => {
    if (ready || reducedMotion) return;
    const section = sectionRef.current;
    if (!section) return;
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: section,
        start: "top top",
        end: "bottom bottom",
        scrub: 1,
        onUpdate: (self) => {
          const p = self.progress;
          if (lineRef.current) lineRef.current.style.transform = `scaleX(${p})`;
          const stage = p < 0.3 ? 0 : p < 0.7 ? 1 : 2;
          setActiveStage((prev) => (prev === stage ? prev : stage));
        },
      });
    }, section);
    return () => ctx.revert();
  }, [ready, reducedMotion]);

  const stage = stages[activeStage];
  const hasVideo = !!videoUrl;

  return (
    <section ref={sectionRef} data-bg={dataBg} className="relative bg-[#000000]" style={{ height }}>
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        {/* Background: pre-captured frames painted to a canvas when ready,
            otherwise a placeholder. */}
        {ready ? (
          <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />
        ) : (
          <div className="absolute inset-0 bg-[#070a12]">
            <div className="radial-fade absolute inset-0" />
            <div className="eng-grid absolute inset-0 opacity-[0.08]" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="font-mono text-[10px] uppercase tracking-[0.4em] text-slate-500">
                {hasVideo ? `Loading ${prep}%` : "Video to be uploaded"}
              </div>
            </div>
          </div>
        )}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-black/80 via-black/45 to-black/20" />
        <div className="eng-grid pointer-events-none absolute inset-0 opacity-[0.07]" />

        {/* Loading indicator while frames are being extracted */}
        {hasVideo && !ready && !reducedMotion && (
          <div className="absolute right-6 top-6 z-30 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.3em] text-slate-400">
            <span className="h-3 w-3 animate-spin rounded-full border border-slate-500 border-t-amber-400" />
            Loading {prep}%
          </div>
        )}

        {/* Stage text panel — overlaid on the background */}
        <div className="absolute inset-0 z-20 flex items-center">
          <div className="mx-auto w-full max-w-7xl px-6 md:px-10">
            <div className="max-w-xl">
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="font-mono text-[10px] uppercase tracking-[0.4em] text-amber-400 md:text-[11px]"
              >
                {eyebrow}
              </motion.div>
              <motion.h2
                initial={{ opacity: 0, y: 22 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="mt-3 font-heading text-3xl font-bold leading-[1.05] tracking-tight text-white md:text-5xl"
              >
                {headingPrefix} <span className="gradient-text">{headingAccent}</span>
              </motion.h2>

              {/* Stage text — crossfades on stage change */}
              <div className="relative mt-5 min-h-[190px] md:mt-7 md:min-h-[230px]">
                <AnimatePresence initial={false}>
                  <motion.div
                    key={activeStage}
                    initial={{ opacity: 0, y: 26 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -26 }}
                    transition={{ duration: 0.45, ease: "easeOut" }}
                    className="absolute inset-0"
                  >
                    <div className="font-mono text-[11px] tracking-[0.3em] text-amber-400">{stage.no}</div>
                    <h3 className="mt-2 font-heading text-lg font-bold text-white md:text-2xl">{stage.title}</h3>
                    <p className="mt-2 max-w-md text-xs text-slate-300 md:text-sm">{stage.desc}</p>
                    <ul className="mt-3 flex flex-wrap gap-2">
                      {stage.callouts.map((c, i) => (
                        <motion.li
                          key={c}
                          initial={{ opacity: 0, y: 16 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.1 + i * 0.05, duration: 0.3, ease: "easeOut" }}
                          className="rounded-sm border border-slate-600/50 bg-slate-900/40 px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider text-slate-200 backdrop-blur-sm"
                        >
                          {c}
                        </motion.li>
                      ))}
                    </ul>
                    {stage.cta && (
                      <button className="mt-4 inline-flex items-center gap-2 rounded-sm border border-amber-500/60 px-4 py-2 font-mono text-[10px] uppercase tracking-[0.2em] text-amber-400 transition hover:bg-amber-500/10 md:mt-5 md:text-[11px]">
                        {stage.ctaLabel || "Explore"}
                      </button>
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Progress indicator */}
              <div className="mt-5 md:mt-7">
                <div className="relative h-px w-full bg-slate-600/50">
                  <div
                    ref={lineRef}
                    className="absolute left-0 top-0 h-px w-full origin-left bg-amber-500"
                    style={{ transform: "scaleX(0)" }}
                  />
                </div>
                <div className="mt-3 flex max-w-xs justify-between">
                  {stages.map((s, i) => {
                    const active = activeStage === i;
                    return (
                      <div key={s.no} className="flex flex-col items-center gap-1.5">
                        <span
                          className={cn(
                            "flex h-6 w-6 items-center justify-center rounded-full border font-mono text-[9px] transition-all duration-300 md:h-7 md:w-7 md:text-[10px]",
                            active ? "scale-110 border-amber-500 bg-amber-500 text-black" : "border-slate-500 text-slate-400"
                          )}
                        >
                          {s.no}
                        </span>
                        <span
                          className={cn(
                            "font-mono text-[9px] uppercase tracking-[0.15em] transition-colors duration-300 md:text-[10px]",
                            active ? "text-amber-400" : "text-slate-500"
                          )}
                        >
                          {s.short}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}