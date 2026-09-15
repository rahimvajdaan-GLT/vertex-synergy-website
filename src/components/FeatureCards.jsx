import React from "react";
import TiltCard from "@/components/TiltCard";
import IconDraw from "@/components/IconDraw";
import Reveal from "@/components/Reveal";
import LiquidButton from "@/components/LiquidButton";

const features = [
  {
    title: "Neural Interface",
    desc: "Direct low-latency linkage between human intent and system execution.",
    orb: "#00F0FF",
    icon: "M24 8 L24 40 M8 16 L24 24 L40 16 M8 32 L24 24 L40 32",
  },
  {
    title: "Quantum Compute",
    desc: "Entangled processing for problems beyond the reach of classical silicon.",
    orb: "#8B5CF6",
    icon: "M6 24 C 6 14, 42 14, 42 24 C 42 34, 6 34, 6 24 Z M6 24 C 6 34, 42 34, 42 24 C 42 14, 6 14, 6 24 Z",
  },
  {
    title: "Holo Render",
    desc: "Real-time volumetric rendering at photoreal fidelity, anywhere on the grid.",
    orb: "#FF006E",
    icon: "M24 6 L42 16 L42 34 L24 44 L6 34 L6 16 Z M24 6 L24 24 M24 24 L42 16 M24 24 L6 16 M24 24 L24 44",
  },
  {
    title: "Adaptive AI",
    desc: "Self-optimizing models that learn, reroute, and heal continuously.",
    orb: "#00F0FF",
    icon: "M10 24 H20 L26 18 H38 M10 24 H20 L26 30 H38 M24 12 V36",
  },
];

export default function FeatureCards() {
  return (
    <section id="features" className="relative mx-auto max-w-6xl scroll-mt-24 px-6 py-32">
      <Reveal>
        <p className="font-mono text-[10px] uppercase tracking-[0.4em] text-accent">/ Capabilities</p>
        <h2 className="mt-4 font-display text-4xl font-bold tracking-tight gradient-text md:text-6xl">
          Engineered for the impossible
        </h2>
        <p className="mt-4 max-w-xl text-muted-foreground">
          Four core systems, one seamless interface — each tuned for scale, speed, and sentience.
        </p>
      </Reveal>
      <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {features.map((f, i) => (
          <Reveal key={f.title} delay={i * 0.1} className="h-full">
            <TiltCard orbColor={f.orb} className="h-full">
              <div className="flex h-full flex-col">
                <div className="text-accent">
                  <IconDraw d={f.icon} />
                </div>
                <h3 className="mt-6 font-heading text-xl font-bold tracking-tight">{f.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{f.desc}</p>
                <div className="mt-6 flex-1" />
                <LiquidButton className="self-start px-5 py-2.5 text-[10px]">Engage</LiquidButton>
              </div>
            </TiltCard>
          </Reveal>
        ))}
      </div>
    </section>
  );
}