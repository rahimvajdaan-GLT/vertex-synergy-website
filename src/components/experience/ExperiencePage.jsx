import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Nav from "@/components/site/Nav";
import Footer from "@/components/site/Footer";
import { useSmoothScroll } from "@/hooks/useSmoothScroll";
import CustomCursor from "./CustomCursor";
import HeroExperience from "./HeroExperience";
import ServicesExperience from "./ServicesExperience";
import AboutExperience from "./AboutExperience";
import ProjectsExperience from "./ProjectsExperience";
import TankVideoExperience from "@/components/tank/TankVideoExperience";
import PortacabinVideoExperience from "@/components/portacabin/PortacabinVideoExperience";
import IndustriesExperience from "./IndustriesExperience";
import ProcessExperience from "./ProcessExperience";
import TestimonialsExperience from "./TestimonialsExperience";
import ContactExperience from "./ContactExperience";

gsap.registerPlugin(ScrollTrigger);

// One continuous premium experience: smooth inertial scroll, a premium
// loading screen, custom cursor, the pinned 7-scene building journey, then
// cinematic content scenes that share a single shifting background — so the
// whole page reads as one continuous animated presentation, not stacked
// rectangular sections.
export default function ExperiencePage() {
  const rootRef = useRef(null);
  const bgRef = useRef(null);
  useSmoothScroll(true);

  // Continuous background colour transitions across every scene.
  useEffect(() => {
    const root = rootRef.current;
    const bg = bgRef.current;
    if (!root || !bg) return;
    const ctx = gsap.context(() => {
      root.querySelectorAll("[data-bg]").forEach((sec) => {
        const color = sec.getAttribute("data-bg");
        gsap.to(bg, {
          backgroundColor: color,
          ease: "none",
          scrollTrigger: { trigger: sec, start: "top center", end: "bottom center", scrub: true },
        });
      });
      const fa = root.querySelector(".footer-accent");
      if (fa) {
        gsap.fromTo(fa, { scaleX: 0 }, {
          scaleX: 1, duration: 1.2, ease: "power2.inOut",
          scrollTrigger: { trigger: fa, start: "top 92%" },
        });
      }
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={rootRef} id="top" className="relative bg-black">
      <div ref={bgRef} className="fixed inset-0 -z-10 bg-black" />
      <CustomCursor />
      <Nav />
      <HeroExperience />
      <TankVideoExperience />
      <PortacabinVideoExperience />
      <main className="relative z-10">
        <ServicesExperience />
        <AboutExperience />
        <ProjectsExperience />
        <IndustriesExperience />
        <ProcessExperience />
        <TestimonialsExperience />
        <ContactExperience />
        <div className="footer-accent mx-auto h-px w-full max-w-6xl origin-left bg-gradient-to-r from-transparent via-amber-500/60 to-transparent" />
        <Footer />
      </main>
    </div>
  );
}