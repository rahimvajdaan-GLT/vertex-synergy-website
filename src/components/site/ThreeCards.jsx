import React from "react";
import Reveal from "./Reveal";

const cards = [
  { title: "The Biggest Problem", img: "https://images.unsplash.com/photo-1504302368-b0b1f1e4c5b4?auto=format&fit=crop&w=1000&q=80", body: "Site progress lives in spreadsheets and guesses — disconnected from the schedule and impossible to verify." },
  { title: "Our Action", img: "https://images.unsplash.com/photo-1517089596392-fb9a9033e86b?auto=format&fit=crop&w=1000&q=80", body: "We capture real jobsite data and translate it into schedule-ready, blockchain-verified reports you can act on." },
  { title: "Your Trust", img: "https://images.unsplash.com/photo-1487958449943-2429e8be8625?auto=format&fit=crop&w=1000&q=80", body: "Every milestone is provable — giving owners, lenders, and teams one source of truth across the portfolio." },
];

export default function ThreeCards() {
  return (
    <section className="bg-white py-28">
      <div className="mx-auto max-w-6xl px-6">
        <div className="grid gap-6 md:grid-cols-3">
          {cards.map((c, i) => (
            <Reveal key={c.title} delay={i * 0.1}>
              <div className="h-full overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 transition-shadow hover:shadow-xl">
                <div className="aspect-[16/10] overflow-hidden">
                  <img src={c.img} alt={c.title} className="h-full w-full object-cover" />
                </div>
                <div className="p-7">
                  <span className="font-body text-[11px] uppercase tracking-widest text-emerald-600">0{i + 1}</span>
                  <h3 className="mt-3 font-body text-xl font-bold tracking-tight text-slate-900">{c.title}</h3>
                  <p className="mt-3 font-body text-base leading-relaxed text-slate-600">{c.body}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}