import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

const links = ["Platform", "Trust", "Case Studies", "Company"];

export default function SiteNav() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -70, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7 }}
      className="fixed inset-x-0 top-0 z-50 flex justify-center px-4"
    >
      <nav
        className={`mt-4 flex w-full max-w-6xl items-center justify-between rounded-full border px-5 py-2.5 transition-all duration-500 ${
          scrolled ? "border-white/10 bg-charcoal/80 backdrop-blur-xl" : "border-white/5 bg-charcoal/40 backdrop-blur-md"
        }`}
      >
        <a href="#top" className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_10px_2px_rgba(52,211,153,0.6)]" />
          <span className="font-body text-sm font-bold tracking-tight text-white">
            VERTEX <span className="text-emerald-400">SYNERGY</span>
          </span>
        </a>
        <div className="hidden items-center gap-7 md:flex">
          {links.map((l) => (
            <a key={l} href={`#${l.toLowerCase().replace(/ /g, "-")}`} className="font-body text-[13px] text-white/70 transition-colors hover:text-white">
              {l}
            </a>
          ))}
        </div>
        <a href="#cta" className="rounded-full bg-emerald-400 px-4 py-1.5 font-body text-[12px] font-semibold text-charcoal transition-colors hover:bg-emerald-300">
          Let's Talk
        </a>
      </nav>
    </motion.header>
  );
}