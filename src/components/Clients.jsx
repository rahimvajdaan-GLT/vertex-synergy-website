import React from "react";
import { motion } from "framer-motion";

const clients = [
  "SANS", "ARAMCO", "Virgin Megastore", "Mitsubishi", "Capella",
  "Emaar", "Nesma", "FISIA", "Ford", "REDAR", "House of Saud", "Aramco PetroRabigh",
];

export default function Clients() {
  return (
    <section className="relative bg-background py-20 overflow-hidden border-y border-border">
      <div className="text-center mb-10">
        <div className="font-mono text-[10px] uppercase tracking-widest text-accent mb-2">07 / Clients & Partners</div>
        <h2 className="font-heading font-bold tracking-tighter text-3xl md:text-5xl">Trusted by industry leaders.</h2>
      </div>
      <div className="relative">
        <motion.div
          className="flex gap-16 whitespace-nowrap will-change-transform"
          animate={{ x: ["0%", "-50%"] }}
          transition={{ repeat: Infinity, duration: 35, ease: "linear" }}
        >
          {[...clients, ...clients].map((c, i) => (
            <span
              key={i}
              data-hover
              className="font-heading font-bold tracking-tighter text-3xl md:text-5xl text-foreground/30 hover:text-accent transition-colors duration-300 shrink-0"
            >
              {c}
            </span>
          ))}
        </motion.div>
      </div>
    </section>
  );
}