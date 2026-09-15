import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { COMPANY, NAV_LINKS } from "@/lib/content";

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7 }}
        className="fixed inset-x-0 top-0 z-50 flex justify-center px-4"
      >
        <nav className={`mt-4 flex w-full max-w-6xl items-center justify-between rounded-2xl border px-5 py-3 transition-all duration-500 ${
          scrolled ? "border-slate-600/40 bg-[#0a0e17]/85 shadow-[0_10px_40px_-12px_rgba(0,0,0,0.6)] backdrop-blur-xl" : "border-white/5 bg-transparent"
        }`}>
          <a href="#top" className="flex items-center gap-2.5">
            <img src={COMPANY.logo} alt="Vertex Synergy" className="h-8 w-8 rounded-lg object-cover ring-1 ring-amber-500/40" />
            <span className="font-heading text-base font-bold tracking-tight text-white">
              VERTEX <span className="gradient-text">SYNERGY</span>
            </span>
          </a>
          <div className="hidden items-center gap-6 lg:flex">
            {NAV_LINKS.map((l) => (
              <a key={l.label} href={l.href} className="font-mono text-[10px] uppercase tracking-[0.18em] text-slate-300 transition-colors hover:text-amber-400">
                {l.label}
              </a>
            ))}
          </div>
          <div className="flex items-center gap-3">
            <a href="#contact" className="hidden rounded-full bg-amber-500 px-5 py-2 font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-950 transition-all hover:bg-amber-400 hover:shadow-[0_0_20px_-2px_rgba(249,115,22,0.6)] sm:inline-flex">
              Discuss a Project
            </a>
            <button onClick={() => setOpen(true)} className="flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-[0.18em] text-slate-300 lg:hidden">
              <Menu size={16} /> Menu
            </button>
          </div>
        </nav>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[60] flex flex-col bg-[#070a12]/97 backdrop-blur-xl">
            <div className="flex h-16 items-center justify-between border-b border-slate-700/50 px-6">
              <span className="font-heading font-bold tracking-tight text-white">VERTEX <span className="gradient-text">SYNERGY</span></span>
              <button onClick={() => setOpen(false)} className="flex items-center gap-2 font-mono text-xs uppercase tracking-[0.2em] text-slate-400">Close <X size={18} /></button>
            </div>
            <nav className="flex flex-1 flex-col justify-center gap-1 px-6">
              {NAV_LINKS.map((l, i) => (
                <motion.a key={l.label} href={l.href} onClick={() => setOpen(false)} initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
                  className="border-b border-slate-800/60 py-4 font-heading text-3xl font-bold tracking-tight text-white transition-colors hover:text-amber-400">
                  {l.label}
                </motion.a>
              ))}
              <a href="#contact" onClick={() => setOpen(false)} className="mt-6 inline-flex w-fit rounded-full bg-amber-500 px-7 py-3 font-mono text-xs font-semibold uppercase tracking-[0.2em] text-slate-950">Discuss a Project</a>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}