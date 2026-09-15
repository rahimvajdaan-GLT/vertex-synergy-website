import React from "react";
import Reveal from "./Reveal";

const badges = ["-24% Delays", "98.2% On-Budget", "100% Verified"];

export default function StatementSection() {
  return (
    <section className="bg-white py-28">
      <div className="mx-auto max-w-5xl px-6 text-center">
        <Reveal>
          <div className="flex flex-wrap justify-center gap-3">
            {badges.map((b) => (
              <span key={b} className="rounded-full border border-emerald-200 bg-emerald-50 px-4 py-1.5 font-body text-sm font-semibold text-emerald-700">
                {b}
              </span>
            ))}
          </div>
          <h2 className="mt-10 font-body text-3xl font-bold leading-tight tracking-tight text-slate-900 md:text-5xl">
            We're Not Just Building Structures. <br className="hidden md:block" /> We're Redefining the Process.
          </h2>
        </Reveal>
      </div>
    </section>
  );
}