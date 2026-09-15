import React from "react";
import Reveal from "./Reveal";

const nodes = [
  { x: 60, y: 60, b: true },
  { x: 210, y: 40, b: false },
  { x: 350, y: 90, b: false },
  { x: 120, y: 170, b: false },
  { x: 280, y: 190, b: true },
  { x: 200, y: 280, b: false },
  { x: 70, y: 260, b: false },
];
const edges = [
  [0, 1], [1, 2], [1, 3], [3, 4], [4, 2], [3, 6], [6, 5], [4, 5], [0, 3],
];

export default function BlockchainSection() {
  return (
    <section className="bg-charcoal py-28">
      <div className="mx-auto grid max-w-6xl items-center gap-14 px-6 md:grid-cols-2">
        <Reveal>
          <p className="font-body text-xs uppercase tracking-[0.3em] text-emerald-400">Built on Blockchain</p>
          <h2 className="mt-5 font-body text-3xl font-bold tracking-tight text-white md:text-5xl">Every milestone, verified and traceable.</h2>
          <p className="mt-6 max-w-md font-body text-lg leading-relaxed text-white/65">
            Built on blockchain, our system ensures every project milestone is verified and fully traceable — so progress is provable, not promised.
          </p>
        </Reveal>
        <Reveal delay={0.1}>
          <div className="relative rounded-2xl border border-white/10 bg-white/[0.03] p-8">
            <svg viewBox="0 0 410 320" className="h-72 w-full">
              {edges.map(([a, b], i) => (
                <line key={i} x1={nodes[a].x} y1={nodes[a].y} x2={nodes[b].x} y2={nodes[b].y} stroke="#34d399" strokeWidth="1.5" opacity="0.4" />
              ))}
              {nodes.map((n, i) => (
                <circle key={i} cx={n.x} cy={n.y} r={n.b ? 9 : 6} fill={n.b ? "#34d399" : "#1f2937"} stroke="#34d399" strokeWidth="2" />
              ))}
            </svg>
            <div className="absolute -right-4 -top-4 rounded-xl border border-emerald-400/40 bg-charcoal px-5 py-3">
              <span className="font-body text-3xl font-bold text-emerald-400">24%</span>
              <p className="font-body text-[10px] uppercase tracking-widest text-white/50">faster verification</p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}