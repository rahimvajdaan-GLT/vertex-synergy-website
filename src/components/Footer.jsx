import React from "react";

const buildings = [40, 70, 50, 90, 60, 110, 80, 130, 70, 100, 55, 85, 95, 60, 120];

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer id="footer" className="relative z-10 overflow-hidden border-t border-slate-200 bg-white pt-24">
      <div className="pointer-events-none absolute inset-x-0 bottom-0 flex h-44 items-end justify-center gap-1 opacity-50">
        {buildings.map((h, i) => (
          <div key={i} className="w-8 bg-gradient-to-t from-orange-100 to-sky-200/70" style={{ height: `${h}%` }} />
        ))}
      </div>
      <div className="relative mx-auto max-w-6xl px-6">
        <div className="grid grid-cols-2 gap-10 md:grid-cols-12">
          <div className="col-span-2 md:col-span-5">
            <h3 className="font-display text-3xl font-bold tracking-tight text-slate-900">VERTEX <span className="gradient-text">SYNERGY</span></h3>
            <p className="mt-4 max-w-sm text-sm text-slate-500">Intelligent construction and engineering — from blueprint to skyline, delivered with precision and trust.</p>
            <div className="mt-5 space-y-1 font-mono text-[10px] uppercase tracking-widest text-slate-500">
              <div>Jeddah · Saudi Arabia</div>
              <div><a href="tel:+966566424971" className="hover:text-orange-500">+966 56 642 4971</a></div>
              <div><a href="mailto:info@vsyenergy.com" className="hover:text-orange-500">info@vsyenergy.com</a></div>
            </div>
          </div>
          <div className="md:col-span-2">
            <div className="font-mono text-[9px] uppercase tracking-widest text-sky-500">Navigate</div>
            <ul className="mt-4 space-y-2 text-sm text-slate-600">
              {[["Projects", "#projects"], ["Services", "#services"], ["Contact", "#contact"]].map(([l, h]) => (
                <li key={l}><a href={h} className="transition-colors hover:text-orange-500">{l}</a></li>
              ))}
            </ul>
          </div>
          <div className="md:col-span-3">
            <div className="font-mono text-[9px] uppercase tracking-widest text-sky-500">Services</div>
            <ul className="mt-4 space-y-2 text-sm text-slate-600">
              {["Civil Engineering", "Electrical Systems", "MEP Services", "Temporary Facilities", "Security Systems"].map((s) => (
                <li key={s}><a href="#services" className="transition-colors hover:text-orange-500">{s}</a></li>
              ))}
            </ul>
          </div>
          <div className="md:col-span-2">
            <div className="font-mono text-[9px] uppercase tracking-widest text-sky-500">Connect</div>
            <ul className="mt-4 space-y-2 text-sm text-slate-600">
              <li><a href="#projects" className="transition-colors hover:text-orange-500">Projects</a></li>
              <li><a href="#contact" className="transition-colors hover:text-orange-500">Careers</a></li>
              <li><a href="#contact" className="transition-colors hover:text-orange-500">Start a Project</a></li>
            </ul>
          </div>
        </div>
        <div className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-slate-100 py-8 sm:flex-row">
          <span className="font-mono text-[10px] uppercase tracking-widest text-slate-400">© {year} Vertex Synergy · Building the Future Beyond Imagination</span>
          <div className="flex gap-5 font-mono text-[10px] uppercase tracking-widest text-slate-400">
            <a href="#home" className="transition-colors hover:text-orange-500">Top ↑</a>
            <a href="#contact" className="transition-colors hover:text-orange-500">LinkedIn</a>
            <a href="#contact" className="transition-colors hover:text-orange-500">Instagram</a>
          </div>
        </div>
      </div>
    </footer>
  );
}