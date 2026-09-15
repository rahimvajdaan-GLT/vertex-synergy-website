import React from "react";
import Reveal from "./Reveal";

export default function PhotoOverlay() {
  return (
    <section className="relative flex min-h-[90vh] items-center overflow-hidden">
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1503387837-b154d5074bd2?auto=format&fit=crop&w=2400&q=80"
          alt="Active jobsite"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-charcoal/78" />
      </div>
      <div className="relative mx-auto w-full max-w-5xl px-6 py-28">
        <Reveal>
          <p className="max-w-2xl font-body text-2xl font-medium leading-relaxed text-white md:text-4xl md:leading-snug">
            Our project-level management solutions translate complex site data into verifiable, schedule-ready reports — so you can drive measurable
            results, not just paperwork.
          </p>
        </Reveal>
      </div>
    </section>
  );
}