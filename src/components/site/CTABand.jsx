import React from "react";
import Reveal from "./Reveal";

export default function CTABand() {
  return (
    <section id="cta" className="bg-emerald-800 py-24">
      <div className="mx-auto max-w-4xl px-6 text-center">
        <Reveal>
          <h2 className="font-body text-3xl font-bold tracking-tight text-white md:text-5xl">Turn Site Data Into Business Results.</h2>
          <p className="mx-auto mt-5 max-w-xl font-body text-lg text-emerald-50/80">
            Make real progress with data you can verify, audit, and act on.
          </p>
          <a
            href="#contact"
            className="mt-9 inline-flex rounded-full bg-white px-8 py-4 font-body text-sm font-semibold text-emerald-800 transition-colors hover:bg-emerald-50"
          >
            Let's Talk
          </a>
        </Reveal>
      </div>
    </section>
  );
}