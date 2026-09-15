import React from "react";
import Reveal from "./Reveal";

export default function CraneSection() {
  return (
    <section className="bg-charcoal py-28 text-center">
      <div className="mx-auto max-w-6xl px-6">
        <Reveal>
          <svg viewBox="0 0 400 320" className="mx-auto h-72 w-auto" fill="none" stroke="#34d399" strokeWidth="3" strokeLinecap="round">
            <line x1="120" y1="300" x2="120" y2="70" />
            <line x1="100" y1="300" x2="140" y2="300" />
            <line x1="110" y1="300" x2="120" y2="284" />
            <line x1="130" y1="300" x2="120" y2="284" />
            <line x1="60" y1="70" x2="300" y2="70" />
            <line x1="120" y1="84" x2="92" y2="58" />
            <line x1="120" y1="84" x2="92" y2="84" />
            <line x1="260" y1="70" x2="260" y2="150" />
            <rect x="250" y="150" width="20" height="14" />
            <line x1="60" y1="70" x2="60" y2="92" />
          </svg>
          <h2 className="mx-auto mt-10 max-w-3xl font-body text-3xl font-bold tracking-tight text-white md:text-5xl">
            Just Real, Measured Progress. Delivered with Integrity.
          </h2>
        </Reveal>
      </div>
    </section>
  );
}