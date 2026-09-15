import React from "react";
import Reveal from "./Reveal";

const cards = [
  { stat: "-24%", label: "cost overrun risk", title: "Project Costs Built on Truth, Not Estimates.", body: "Every figure ties back to verified site progress — so budgets reflect reality, not assumptions." },
  { stat: "360°", label: "project clarity", title: "Real-World Site Data. Enterprise-Wide Project Clarity.", body: "A single source of truth connects the jobsite to the boardroom, across every project and team." },
];

export default function StatCards() {
  return (
    <section className="bg-charcoal py-28">
      <div className="mx-auto max-w-6xl px-6">
        <div className="grid gap-6 md:grid-cols-2">
          {cards.map((c, i) => (
            <Reveal key={c.title} delay={i * 0.1}>
              <div className="h-full rounded-2xl border border-white/10 bg-white/[0.03] p-9 transition-colors hover:border-emerald-400/40">
                <div className="flex items-baseline gap-3">
                  <span className="font-body text-4xl font-bold text-emerald-400">{c.stat}</span>
                  <span className="font-body text-xs uppercase tracking-widest text-white/50">{c.label}</span>
                </div>
                <h3 className="mt-6 font-body text-2xl font-bold tracking-tight text-white">{c.title}</h3>
                <p className="mt-4 font-body text-base leading-relaxed text-white/60">{c.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}