import React from "react";
import Reveal from "./Reveal";

const cards = [
  { tag: "Planned", title: "The Designed Model", img: "https://images.unsplash.com/photo-1486406146775-50b0ec91d29e?auto=format&fit=crop&w=1600&q=80" },
  { tag: "Built", title: "The Verified Outcome", img: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=1600&q=80" },
];

export default function Comparison() {
  return (
    <section className="bg-charcoal py-28">
      <div className="mx-auto max-w-6xl px-6">
        <Reveal>
          <h2 className="max-w-3xl font-body text-3xl font-bold tracking-tight text-white md:text-5xl">Validating What the Jobsite Delivers Naturally.</h2>
        </Reveal>
        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {cards.map((c, i) => (
            <Reveal key={c.title} delay={i * 0.1}>
              <div className="group relative overflow-hidden rounded-2xl border border-white/10">
                <div className="relative aspect-[4/3]">
                  <img src={c.img} alt={c.title} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-charcoal/20 to-transparent" />
                <div className="absolute bottom-0 p-6">
                  <span className="font-body text-xs uppercase tracking-widest text-emerald-400">{c.tag}</span>
                  <p className="mt-1 font-body text-xl font-semibold text-white">{c.title}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}