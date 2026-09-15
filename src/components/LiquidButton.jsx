import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export default function LiquidButton({ children, className = "", as = "button", ...props }) {
  const Comp = as === "a" ? motion.a : motion.button;
  return (
    <Comp
      whileHover={{ scale: 1.04 }}
      whileTap={{ scale: 0.96 }}
      transition={{ type: "spring", stiffness: 400, damping: 18 }}
      className={cn(
        "group relative inline-flex items-center gap-2 overflow-hidden rounded-full border border-accent/40 bg-card/5 px-8 py-4 font-mono text-[11px] uppercase tracking-[0.25em] text-foreground backdrop-blur-md",
        className
      )}
      {...props}
    >
      <span className="absolute inset-0 z-0 origin-bottom scale-y-0 bg-gradient-to-r from-accent via-secondary to-destructive transition-transform duration-500 ease-out group-hover:scale-y-100" />
      <span className="pointer-events-none absolute inset-0 z-20 -translate-x-full bg-gradient-to-r from-transparent via-white/40 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-full" />
      <span className="relative z-30 flex items-center gap-2 transition-colors duration-300 group-hover:text-background">
        {children}
      </span>
    </Comp>
  );
}