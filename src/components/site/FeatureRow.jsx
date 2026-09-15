import React from "react";
import Reveal from "./Reveal";

const features = ["On-Site Action", "Integrated Scheduling", "Blockchain-Verified Records", "Built for Complex Projects"];

export default function FeatureRow() {
  return (
    <section className="relative overflow-hidden py-28">
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&w=2400&q=80"
          alt="Jobsite equipment"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-charcoal/82" />
      </div>
      <div className="relative mx-auto max-w-6xl px-6">
        <Reveal>
          <h2 className="max-w-2xl font-body text-3xl font-bold tracking-tight text-white md:text-5xl">Built for the realities of the jobsite.</h2>
        </Reveal>
        <div className="mt-14 grid grid-cols-2 gap-8 md:grid-cols-4">
          {features.map((t, i) => (
            <Reveal key={t} delay={i * 0.1}>
              <div className="border-t border-emerald-400/40 pt-4">
                <span className="font-body text-[11px] uppercase tracking-widest text-emerald-400">0{i + 1}</span>
                <p className="mt-3 font-body text-lg font-semibold text-white">{t}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}