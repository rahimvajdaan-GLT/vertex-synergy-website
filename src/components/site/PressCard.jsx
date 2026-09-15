import React from "react";
import Reveal from "./Reveal";

export default function PressCard() {
  return (
    <section className="bg-white pb-28">
      <div className="mx-auto max-w-6xl px-6">
        <Reveal>
          <div className="grid items-center gap-8 overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 p-6 md:grid-cols-[200px_1fr] md:p-8">
            <div className="aspect-[4/3] overflow-hidden rounded-xl">
              <img
                src="https://images.unsplash.com/photo-1486406146775-50b0ec91d29e?auto=format&fit=crop&w=900&q=80"
                alt="Media feature"
                className="h-full w-full object-cover"
              />
            </div>
            <div>
              <span className="font-body text-[11px] uppercase tracking-widest text-emerald-600">Media & Press</span>
              <h3 className="mt-3 font-body text-2xl font-bold tracking-tight text-slate-900 md:text-3xl">
                Vertex Synergy's Site-Based Progress Reporting Explained
              </h3>
              <a href="#cta" className="mt-5 inline-flex items-center gap-2 font-body text-sm font-semibold text-emerald-700 hover:gap-3 transition-all">
                Full Story →
              </a>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}