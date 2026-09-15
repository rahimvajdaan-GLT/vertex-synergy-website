import React from "react";
import Reveal from "./Reveal";

export default function TransitionBand() {
  return (
    <section className="bg-charcoal py-32 text-center">
      <Reveal>
        <p className="mx-auto max-w-4xl font-body text-3xl font-bold leading-snug tracking-tight text-white md:text-5xl">
          Structural Rigor. <span className="text-emerald-400">Commercial Precision.</span> Unmatched Trust.
        </p>
      </Reveal>
    </section>
  );
}