import React from "react";
import { COMPANY, NAV_LINKS } from "@/lib/content";

export default function Footer() {
  const year = new Date().getFullYear();
  const links = NAV_LINKS.filter((l) => ["About", "Services", "Projects", "Contact"].includes(l.label));
  const legal = ["Privacy Policy", "Terms"];

  return (
    <footer className="relative border-t border-slate-800/60 bg-[#070a12] px-6 py-16 md:px-16">
      <div className="eng-grid pointer-events-none absolute inset-0 opacity-20" />
      <div className="relative mx-auto max-w-6xl">
        <div className="grid gap-10 md:grid-cols-12">
          <div className="md:col-span-5">
            <div className="flex items-center gap-2.5">
              <img src={COMPANY.logo} alt="Vertex Synergy" className="h-9 w-9 rounded-lg object-cover ring-1 ring-amber-500/40" />
              <span className="font-heading text-lg font-bold tracking-tight text-white">VERTEX <span className="gradient-text">SYNERGY</span></span>
            </div>
            <p className="mt-5 max-w-sm text-sm text-slate-400">Vertex Synergy Co. — engineering, construction and specialist building systems for commercial, industrial and municipal facilities.</p>
            <p className="mt-4 font-heading text-sm font-semibold text-amber-300">{COMPANY.slogan}</p>
            <div className="mt-5 space-y-1 font-mono text-[10px] uppercase tracking-widest text-slate-500">
              <div>{COMPANY.location}</div>
              <div><a href={COMPANY.phoneHref} className="hover:text-amber-300">{COMPANY.phone}</a></div>
              <div><a href={`mailto:${COMPANY.email}`} className="hover:text-amber-300">{COMPANY.email}</a></div>
            </div>
          </div>
          <div className="md:col-span-3">
            <div className="font-mono text-[9px] uppercase tracking-widest text-amber-400">Navigate</div>
            <ul className="mt-4 space-y-2 text-sm text-slate-400">
              {links.map((l) => <li key={l.label}><a href={l.href} className="transition-colors hover:text-amber-300">{l.label}</a></li>)}
            </ul>
          </div>
          <div className="md:col-span-2">
            <div className="font-mono text-[9px] uppercase tracking-widest text-amber-400">Legal</div>
            <ul className="mt-4 space-y-2 text-sm text-slate-400">
              {legal.map((l) => <li key={l}><a href="#contact" className="transition-colors hover:text-amber-300">{l}</a></li>)}
              <li><a href="#contact" className="transition-colors hover:text-amber-300">LinkedIn</a></li>
            </ul>
          </div>
          <div className="md:col-span-2">
            <div className="font-mono text-[9px] uppercase tracking-widest text-amber-400">Company</div>
            <ul className="mt-4 space-y-2 text-sm text-slate-400">
              <li>Vertex Synergy Co.</li>
              <li>Aramco Approved Contractor</li>
              <li>ISO Certified Quality Management</li>
            </ul>
          </div>
        </div>
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-slate-800/60 py-6 sm:flex-row">
          <span className="font-mono text-[10px] uppercase tracking-widest text-slate-500">© {year} Vertex Synergy Co. All rights reserved.</span>
          <a href="#top" className="font-mono text-[10px] uppercase tracking-widest text-slate-500 transition-colors hover:text-amber-300">Back to top ↑</a>
        </div>
      </div>
    </footer>
  );
}