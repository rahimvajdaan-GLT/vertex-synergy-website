import React from "react";
import { motion } from "framer-motion";
import Reveal from "./Reveal";

const arcs = [0, 0.6, 1.2];

export default function TrustSection() {
  return (
    <section id="trust" className="bg-charcoal py-28">
      <div className="mx-auto grid max-w-6xl items-center gap-14 px-6 md:grid-cols-2">
        <Reveal>
          <div className="relative flex h-80 items-center justify-center">
            <svg viewBox="0 0 400 320" className="h-full w-full">
              <line x1="200" y1="300" x2="200" y2="120" stroke="#34d399" strokeWidth="3" />
              <rect x="188" y="284" width="24" height="16" fill="#34d399" opacity="0.25" />
              <circle cx="200" cy="110" r="9" fill="#34d399" />
              {arcs.map((d, i) => (
                <motion.circle
                  key={i}
                  cx="200"
                  cy="110"
                  r="40"
                  fill="none"
                  stroke="#34d399"
                  strokeWidth="2"
                  style={{ transformBox: "fill-box", transformOrigin: "center" }}
                  animate={{ opacity: [0.7, 0], scale: [1, 2.1] }}
                  transition={{ duration: 2.6, repeat: Infinity, delay: d, ease: "easeOut" }}
                />
              ))}
            </svg>
          </div>
        </Reveal>
        <Reveal delay={0.1}>
          <p className="font-body text-xs uppercase tracking-[0.3em] text-emerald-400">Unmatched Trust</p>
          <h2 className="mt-5 font-body text-4xl font-bold tracking-tight text-white md:text-5xl">Unmatched Trust.</h2>
          <p className="mt-6 max-w-md font-body text-lg leading-relaxed text-white/65">
            The first to bring site-wide digital progress tracking to commercial construction — turning jobsite data into verified insight.
          </p>
        </Reveal>
      </div>
    </section>
  );
}