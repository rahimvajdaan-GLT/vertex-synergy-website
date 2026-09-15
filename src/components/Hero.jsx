import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import ParticleField from "@/components/ParticleField";
import LiquidButton from "@/components/LiquidButton";

export default function Hero() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const yText = useTransform(scrollYProgress, [0, 1], ["0%", "40%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  return (
    <section id="home" ref={ref} className="relative h-screen w-full overflow-hidden bg-background">
      <div className="absolute inset-0 bg-gradient-to-b from-navy via-background to-background" />
      <ParticleField className="absolute inset-0 h-full w-full" />
      <div className="noise absolute inset-0 opacity-[0.04] mix-blend-overlay" />
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[60rem] w-[60rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent/[0.06] blur-[160px]" />

      <motion.div
        style={{ y: yText, opacity }}
        className="absolute inset-0 z-10 flex flex-col items-center justify-center px-6 text-center"
      >
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="font-mono text-[10px] uppercase tracking-[0.5em] text-accent md:text-xs"
        >
          ◇ NEXUS // Interactive Interface
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45, duration: 0.9 }}
          className="mt-6 font-display text-[18vw] font-bold leading-[0.82] tracking-tighter gradient-text pulse-glow md:text-[11vw] lg:text-[9rem]"
        >
          ENTER THE
          <br />
          NEXUS
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="mt-8 max-w-xl text-base text-muted-foreground md:text-lg"
        >
          A living interface between human intent and machine intelligence — sleek, expensive, alive.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="mt-10 flex flex-col items-center gap-4 sm:flex-row"
        >
          <LiquidButton as="a" href="#features" className="neon-border">
            Initiate Sequence
          </LiquidButton>
          <a
            href="#vision"
            className="font-mono text-[11px] uppercase tracking-[0.25em] text-foreground/60 transition-colors hover:text-accent"
          >
            Observe ↓
          </a>
        </motion.div>
      </motion.div>

      <motion.div
        style={{ opacity }}
        className="absolute bottom-8 left-1/2 z-20 flex -translate-x-1/2 flex-col items-center gap-2"
      >
        <span className="font-mono text-[9px] uppercase tracking-widest text-muted-foreground">Scroll</span>
        <div className="relative h-12 w-px overflow-hidden bg-foreground/15">
          <motion.div
            animate={{ y: [-48, 48] }}
            transition={{ repeat: Infinity, duration: 1.6, ease: "easeInOut" }}
            className="absolute h-6 w-px bg-accent"
          />
        </div>
      </motion.div>
    </section>
  );
}