import React from "react";
import Reveal from "./Reveal";

export default function CaseStudy() {
  return (
    <section className="bg-white py-28">
      <div className="mx-auto max-w-6xl px-6">
        <Reveal>
          <div className="grid overflow-hidden rounded-2xl border border-slate-200 md:grid-cols-2">
            <div className="aspect-[4/3] overflow-hidden md:aspect-auto">
              <img
                src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1400&q=80"
                alt="Case study"
                className="h-full w-full object-cover"
              />
            </div>
            <div className="flex flex-col justify-center p-9 md:p-12">
              <span className="font-body text-[11px] uppercase tracking-widest text-emerald-600">Case Study</span>
              <h3 className="mt-4 font-body text-3xl font-bold tracking-tight text-slate-900">Scaling Al-Madar's Projects with AI</h3>
              <p className="mt-4 font-body text-base leading-relaxed text-slate-600">
                How a leading contractor cut reporting cycles by 60% and proved progress to every stakeholder — across a portfolio of complex builds.
              </p>
              <a href="#cta" className="mt-6 inline-flex w-fit items-center gap-2 font-body text-sm font-semibold text-emerald-700 hover:gap-3 transition-all">
                Read More →
              </a>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}