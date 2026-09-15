import React from "react";

const offices = ["Riyadh", "Dubai", "London", "New York"];
const columns = [
  { title: "Company", links: ["About", "Careers", "Press"] },
  { title: "Projects", links: ["Overview", "Case Studies", "Method"] },
  { title: "Services", links: ["Platform", "Trust", "Blockchain"] },
  { title: "Legal", links: ["Let's Talk", "Privacy Policy", "Terms of Use"] },
];

export default function SiteFooter() {
  return (
    <footer className="bg-charcoal pt-20 pb-10">
      <div className="mx-auto max-w-6xl px-6">
        <div className="flex flex-wrap items-end justify-between gap-8 border-b border-white/10 pb-12">
          <h2 className="font-body text-4xl font-bold tracking-tight text-white md:text-6xl">
            VERTEX <span className="text-emerald-400">SYNERGY</span>
          </h2>
          <div className="flex flex-wrap gap-x-6 gap-y-2">
            {offices.map((o) => (
              <span key={o} className="font-body text-sm text-white/50">{o}</span>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-2 gap-8 py-12 md:grid-cols-4">
          {columns.map((c) => (
            <div key={c.title}>
              <p className="font-body text-[11px] uppercase tracking-widest text-emerald-400">{c.title}</p>
              <ul className="mt-4 space-y-3">
                {c.links.map((l) => (
                  <li key={l}>
                    <a href="#cta" className="font-body text-sm text-white/60 transition-colors hover:text-white">{l}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 sm:flex-row">
          <span className="font-body text-xs text-white/40">© {new Date().getFullYear()} Vertex Synergy. All rights reserved.</span>
          <span className="font-body text-xs text-white/40">Construction · Engineering · Project Delivery</span>
        </div>
      </div>
    </footer>
  );
}