import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { useScrollProgress } from "@/lib/ScrollContext";
import { useLocation } from "react-router-dom";
import { Image } from "@/components/ui/image";

const links = [
  { label: "Projects", href: "#projects" },
  { label: "Services", href: "#services" },
  { label: "Contact", href: "#contact" },
];

export default function Navbar() {
  const progress = useScrollProgress();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const isHome = useLocation().pathname === "/";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const home = (href) => (isHome ? href : `/${href}`);

  return (
    <>
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7 }}
        className="fixed left-0 right-0 top-0 z-50 flex justify-center px-4"
      >
        <nav
          className={`mt-4 flex h-14 w-full max-w-6xl items-center justify-between rounded-full border px-4 pl-5 transition-all duration-500 ${
            scrolled
              ? "border-slate-200 bg-white/70 shadow-[0_8px_30px_-12px_rgba(0,0,0,0.15)] backdrop-blur-xl"
              : "border-white/40 bg-white/40 backdrop-blur-md"
          }`}
        >
          <a href={isHome ? "#home" : "/"} className="flex items-center gap-2.5">
            <Image
              src="https://media.base44.com/images/public/6a62011d4b7a1c7d8b3b0f95/e562c4f9b_image.png"
              alt="Vertex Synergy"
              fittingType="fit"
              className="h-8 w-8 rounded-full ring-1 ring-slate-200"
            />
            <span className="font-display text-sm font-bold tracking-tight text-slate-900">
              VERTEX
              <span
                className="bg-clip-text text-transparent"
                style={{ backgroundImage: "linear-gradient(90deg,#E0B18E,#C1A98E,#A9A696,#89A6A8)" }}
              >
                {" "}
                SYNERGY
              </span>
            </span>
          </a>

          <div className="hidden items-center gap-7 lg:flex">
            {links.map((l) => (
              <a
                key={l.label}
                href={home(l.href)}
                className="font-mono text-[11px] uppercase tracking-[0.18em] text-slate-600 transition-colors hover:text-slate-900"
              >
                {l.label}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <a
              href={home("#contact")}
              className="hidden rounded-full bg-orange-500 px-5 py-2 font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-white transition-all hover:bg-orange-600 hover:shadow-[0_0_18px_-2px_rgba(255,122,24,0.5)] sm:inline-flex"
            >
              Start a Project
            </a>
            <button
              onClick={() => setOpen(true)}
              className="flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-[0.18em] text-slate-600 lg:hidden"
            >
              <Menu size={16} /> Menu
            </button>
          </div>
        </nav>

        {progress && (
          <div className="pointer-events-none absolute bottom-0 h-px w-full max-w-6xl overflow-hidden">
            <motion.div
              style={{ scaleX: progress }}
              className="h-full w-full origin-left bg-gradient-to-r from-orange-500 via-orange-400 to-slate-400"
            />
          </div>
        )}
      </motion.header>

      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-[60] flex flex-col bg-white/95 backdrop-blur-xl"
        >
          <div className="flex h-16 items-center justify-between border-b border-slate-200 px-6">
            <a href={isHome ? "#home" : "/"} onClick={() => setOpen(false)} className="font-display font-bold tracking-tight text-slate-900">
              VERTEX
              <span
                className="bg-clip-text text-transparent"
                style={{ backgroundImage: "linear-gradient(90deg,#E0B18E,#C1A98E,#A9A696,#89A6A8)" }}
              >
                {" "}
                SYNERGY
              </span>
            </a>
            <button
              onClick={() => setOpen(false)}
              className="flex items-center gap-2 font-mono text-xs uppercase tracking-[0.2em] text-slate-600"
            >
              Close <X size={18} />
            </button>
          </div>
          <nav className="flex flex-1 flex-col justify-center gap-1 px-6">
            {links.map((l, i) => (
              <motion.a
                key={l.label}
                href={home(l.href)}
                onClick={() => setOpen(false)}
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.06 }}
                className="border-b border-slate-100 py-4 font-display text-3xl font-bold tracking-tight text-slate-900 transition-colors hover:text-orange-500"
              >
                {l.label}
              </motion.a>
            ))}
            <a
              href={home("#contact")}
              onClick={() => setOpen(false)}
              className="mt-6 inline-flex w-fit rounded-full bg-orange-500 px-7 py-3 font-mono text-xs font-semibold uppercase tracking-[0.2em] text-white"
            >
              Start a Project
            </a>
          </nav>
        </motion.div>
      )}
    </>
  );
}