import { useLayoutEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// Builds the single master GSAP timeline that drives the whole pinned
// engineering story. One timeline, scrubbed; all per-stage layers and text
// animate from this timeline via refs (no per-frame React state). The hook
// also reports the active stage + intra-stage fraction (for the nav ring) and
// a transitioning flag (to dampen mouse parallax during reveals).
export function useEngineeringTimeline({
  rootRef,
  cameraRef,
  parallaxRef,
  stageRefs,
  textRefs,
  blueprintRef,
  lightRef,
  ringRef,
  stages,
  isMobile,
  ready,
  onActive,
  isTransitioningRef,
}) {
  useLayoutEffect(() => {
    if (!ready || !rootRef.current) return;

    const ctx = gsap.context(() => {
      const total = stages.length;
      const extra = isMobile ? 0.4 : 0.6; // final hold extension
      const totalDur = total + extra;

      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: rootRef.current,
          start: "top top",
          end: () => (isMobile ? "+=450%" : `+=${totalDur * 100}%`),
          pin: true,
          scrub: 1.4,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            const t = self.progress * totalDur;
            const idx = Math.max(0, Math.min(total - 1, Math.floor(t)));
            const frac = Math.max(0, Math.min(1, t - idx));
            onActive && onActive(idx, frac);
            // transitioning window: stage-local 0.55–0.9
            const trans = frac > 0.55 && frac < 0.9;
            if (isTransitioningRef) isTransitioningRef.current = trans;
            if (ringRef.current) {
              const len = ringRef.current.getTotalLength
                ? ringRef.current.getTotalLength()
                : 88;
              ringRef.current.style.strokeDashoffset = String(len * (1 - frac));
            }
          },
        },
      });

      // Continuous camera move across the whole journey (no per-stage reset).
      tl.to(
        cameraRef.current,
        {
          keyframes: [
            { scale: 1.08, x: -22, y: -14, rotateY: 1.5, rotateX: -0.8 },
            { scale: 0.98, x: 10, y: 6, rotateY: -0.6, rotateX: 0.4 },
            { scale: 1.05, x: 0, y: 0, rotateY: 0, rotateX: 0 },
          ],
          duration: totalDur,
          ease: "none",
        },
        0
      );

      stages.forEach((stg, i) => {
        const vis = stageRefs.current[i];
        const txt = textRefs.current[i];
        if (!vis || !txt) return;

        const lines = txt.querySelectorAll(".st-line");
        const descInner = txt.querySelector(".st-desc-inner");
        const callouts = txt.querySelectorAll(".st-callout");
        const ctas = txt.querySelector(".st-ctas");
        const tlBars = txt.querySelectorAll(".st-tl-bar > span");

        // initial states
        gsap.set(vis, {
          opacity: 0,
          scale: i === 0 ? 1.12 : 0.9,
          filter:
            i === 0 ? "blur(18px) brightness(0.7)" : "blur(14px) brightness(0.6)",
          clipPath: i === 0 ? fullClipLocal("left") : hiddenClipLocal(stg.wipe),
          zIndex: i + 1,
        });
        gsap.set(txt, { opacity: 0 });
        gsap.set(lines, { yPercent: 110, opacity: 0 });
        gsap.set(descInner, { yPercent: 110, opacity: 0 });
        gsap.set(callouts, { opacity: 0, yPercent: 60 });
        gsap.set(ctas, { opacity: 0, yPercent: 40 });
        gsap.set(tlBars, { width: "0%" });
        if (i === 0) gsap.set(lines, { xPercent: (idx) => (idx % 2 ? 120 : -120), yPercent: 0 });

        // Elite sub-element initial states (framed composition)
        const ring = vis.querySelector(".st-ring");
        const frame = vis.querySelector(".st-frame");
        const ticks = vis.querySelectorAll(".st-tick");
        const scan = vis.querySelector(".st-scan");
        const subjImg = vis.querySelector(".st-img");
        const chips = vis.querySelectorAll(".st-chip");
        const particles = vis.querySelectorAll(".st-particle");
        gsap.set(ring, { scale: 0.7, opacity: 0 });
        gsap.set(frame, { scaleX: 0.94, scaleY: 0.94, opacity: 0 });
        gsap.set(ticks, { opacity: 0, scale: 0.4 });
        gsap.set(scan, { yPercent: -120, opacity: 0 });
        gsap.set(subjImg, { scale: 1.18, opacity: 0, clipPath: "inset(0 100% 0 0)" });
        gsap.set(chips, { opacity: 0, y: 12 });
        gsap.set(particles, { opacity: 0 });
        const bgpar = vis.querySelector(".st-bgpar");
        const fg = vis.querySelector(".st-fg");
        gsap.set(bgpar, { y: 26 });
        gsap.set(fg, { y: 22 });

        // Reveal incoming
        if (i === 0) {
          // Hero reveal is auto-played on load (see intro timeline below) so
          // the first header shows everything immediately — not scroll-gated.
        } else {
          const revealStart = i - 0.45;
          // Seamless zoom-through crossfade: the incoming stage zooms in from
          // behind (scale 0.82 -> 1) while de-blurring and unmasking, so it
          // dissolves through the outgoing image instead of hard-cutting.
          tl.fromTo(
            vis,
            { opacity: 0, scale: 0.82, filter: "blur(18px) brightness(0.55)" },
            {
              opacity: 1,
              scale: 1,
              filter: "blur(0px) brightness(1)",
              clipPath: fullClipLocal(stg.wipe),
              duration: 0.55,
              ease: "power2.out",
            },
            revealStart
          );

          // Elite sub-element choreography
          const ring = vis.querySelector(".st-ring");
          const frame = vis.querySelector(".st-frame");
          const ticks = vis.querySelectorAll(".st-tick");
          const scan = vis.querySelector(".st-scan");
          const subjImg = vis.querySelector(".st-img");
          const chips = vis.querySelectorAll(".st-chip");
          const particles = vis.querySelectorAll(".st-particle");
          tl.to(ring, { scale: 1, opacity: 1, duration: 0.5, ease: "power2.out" }, revealStart + 0.02);
          tl.to(frame, { scaleX: 1, scaleY: 1, opacity: 1, duration: 0.45, ease: "power3.out" }, revealStart + 0.04);
          tl.to(subjImg, { clipPath: "inset(0 0 0 0)", scale: 1, opacity: 1, duration: 0.45, ease: "power2.out" }, revealStart + 0.08);
          tl.fromTo(scan, { yPercent: -120, opacity: 0.7 }, { yPercent: 120, opacity: 0, duration: 0.55, ease: "power1.inOut" }, revealStart + 0.1);
          tl.to(ticks, { opacity: 1, scale: 1, duration: 0.3, stagger: 0.05, ease: "back.out(2)" }, revealStart + 0.2);
          tl.to(chips, { opacity: 1, y: 0, duration: 0.3, stagger: 0.06, ease: "power2.out" }, i + 0.1);
          tl.to(particles, { opacity: 0.5, duration: 0.6, stagger: 0.02, ease: "power2.out" }, revealStart + 0.05);

          // text in after settle
          tl.to(txt, { opacity: 1, duration: 0.1 }, i + 0.02);
          tl.to(lines, { yPercent: 0, opacity: 1, duration: 0.18, stagger: 0.07, ease: "power3.out" }, i + 0.05);
          tl.to(descInner, { yPercent: 0, opacity: 1, duration: 0.16, ease: "power3.out" }, i + 0.2);
          tl.to(callouts, { opacity: 1, yPercent: 0, duration: 0.12, stagger: 0.06 }, i + 0.3);
          if (tlBars.length) {
            tl.to(tlBars, { width: (idx) => `${stg.timeline[idx].pct}%`, duration: 0.12, stagger: 0.06, ease: "power2.out" }, i + 0.3);
          }
          if (ctas) tl.to(ctas, { opacity: 1, yPercent: 0, duration: 0.16, ease: "power3.out" }, i + 0.42);
        }

        // Depth parallax: background drifts slowly, foreground moves faster
        const pStart = i === 0 ? 0 : i - 0.2;
        tl.fromTo(bgpar, { y: 26 }, { y: -26, ease: "none", duration: i === 0 ? 0.8 : 0.95 }, pStart);
        tl.fromTo(fg, { y: 22 }, { y: -48, ease: "none", duration: i === 0 ? 0.8 : 0.95 }, pStart + 0.05);

        // Transition out (depth) into next stage
        if (i < total - 1) {
          const outStart = i + 0.5;
          // Outgoing pushes forward (zoom in) and dissolves, overlapping the
          // incoming zoom so the two images crossfade through one another.
          tl.to(
            vis,
            { scale: 1.16, filter: "blur(16px) brightness(0.5)", opacity: 0, duration: 0.5, ease: "power2.in" },
            outStart
          );
          tl.to(txt, { opacity: 0, yPercent: -30, duration: 0.22, ease: "power2.in" }, outStart);

          // Blueprint bridge — traced during the middle of the transition
          const bp = blueprintRef.current;
          if (bp) {
            const bpLines = bp.querySelectorAll(".bp-line");
            tl.to(bp, { opacity: 0.85, duration: 0.06 }, outStart + 0.06);
            tl.fromTo(
              bpLines,
              { strokeDashoffset: (_idx, el) => el.getTotalLength() },
              { strokeDashoffset: 0, duration: 0.14, stagger: 0.012, ease: "none" },
              outStart + 0.06
            );
            tl.to(bp, { opacity: 0.12, duration: 0.1 }, outStart + 0.24);
            tl.set(bpLines, { strokeDashoffset: (_idx, el) => el.getTotalLength() }, outStart + 0.4);
          }

          // Light sweep across the stage
          if (lightRef.current) {
            tl.fromTo(
              lightRef.current,
              { xPercent: -120, opacity: 0 },
              { xPercent: 120, opacity: 0.5, duration: 0.35, ease: "power1.inOut" },
              outStart
            );
            tl.to(lightRef.current, { opacity: 0, duration: 0.08 }, outStart + 0.34);
          }
        }
      });

      // Hero intro — auto-plays on load (not scroll-gated): image first, then
      // title lines fly in from alternating sides, then description + CTAs.
      const vis0 = stageRefs.current[0];
      const txt0 = textRefs.current[0];
      if (vis0 && txt0) {
        const lines0 = txt0.querySelectorAll(".st-line");
        const descInner0 = txt0.querySelector(".st-desc-inner");
        const ctas0 = txt0.querySelector(".st-ctas");
        gsap.set(txt0, { opacity: 1 });
        gsap.set(lines0, { xPercent: (idx) => (idx % 2 ? 120 : -120), opacity: 0 });
        gsap.set(descInner0, { yPercent: 110, opacity: 0 });
        gsap.set(ctas0, { opacity: 0, yPercent: 40 });
        const ring0 = vis0.querySelector(".st-ring");
        const frame0 = vis0.querySelector(".st-frame");
        const ticks0 = vis0.querySelectorAll(".st-tick");
        const scan0 = vis0.querySelector(".st-scan");
        const subjImg0 = vis0.querySelector(".st-img");
        const chips0 = vis0.querySelectorAll(".st-chip");
        const particles0 = vis0.querySelectorAll(".st-particle");

        const intro = gsap.timeline({ delay: 0.15 });
        intro.to(vis0, { opacity: 1, scale: 1, filter: "blur(0px) brightness(1)", duration: 0.6, ease: "power2.out" }, 0);
        intro.to(lines0, { xPercent: 0, opacity: 1, duration: 0.5, stagger: 0.12, ease: "power3.out" }, 0.4);
        intro.to(descInner0, { yPercent: 0, opacity: 1, duration: 0.4, ease: "power3.out" }, 0.75);
        intro.to(ctas0, { opacity: 1, yPercent: 0, duration: 0.4, ease: "power3.out" }, 0.9);
        intro.to(ring0, { scale: 1, opacity: 1, duration: 0.8, ease: "power2.out" }, 0.5);
        intro.to(frame0, { scaleX: 1, scaleY: 1, opacity: 1, duration: 0.7, ease: "power3.out" }, 0.3);
        intro.to(subjImg0, { clipPath: "inset(0 0 0 0)", scale: 1, opacity: 1, duration: 1, ease: "power2.out" }, 0.2);
        intro.fromTo(scan0, { yPercent: -120, opacity: 0.8 }, { yPercent: 120, opacity: 0, duration: 1, ease: "power1.inOut" }, 0.4);
        intro.to(ticks0, { opacity: 1, scale: 1, duration: 0.4, stagger: 0.08, ease: "back.out(2)" }, 0.6);
        intro.to(chips0, { opacity: 1, y: 0, duration: 0.4, stagger: 0.08, ease: "power2.out" }, 0.9);
        intro.to(particles0, { opacity: 0.5, duration: 0.8, stagger: 0.03, ease: "power2.out" }, 0.3);
      }

      ScrollTrigger.refresh();
    }, rootRef);

    return () => ctx.revert();
  }, [ready, isMobile, stages.length]);
}

// local copies so the hook module stays self-contained
function hiddenClipLocal(wipe) {
  switch (wipe) {
    case "left": return "inset(0 100% 0 0)";
    case "right": return "inset(0 0 0 100%)";
    case "top": return "inset(100% 0 0 0)";
    case "radial": return "circle(0% at 50% 50%)";
    case "diagonal": return "polygon(0 100%, 0 100%, -100% 0, -100% 0)";
    default: return "inset(0 100% 0 0)";
  }
}
function fullClipLocal(wipe) {
  switch (wipe) {
    case "radial": return "circle(145% at 50% 50%)";
    case "diagonal": return "polygon(0 100%, 200% 100%, 100% 0, -100% 0)";
    default: return "inset(0 0 0 0)";
  }
}