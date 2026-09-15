import React, { useRef, useState } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { Image } from "@/components/ui/image";

const projects = [
  {
    id: "VS-01",
    title: "Makkah Train Station",
    location: "Makkah",
    year: "Completed",
    type: "Infrastructure",
    img: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=900&q=80",
  },
  {
    id: "VS-02",
    title: "SANS — 27 Airports",
    location: "Throughout Kingdom",
    year: "Completed",
    type: "Infrastructure",
    img: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=900&q=80",
  },
  {
    id: "VS-03",
    title: "REDAR System",
    location: "Multiple Locations",
    year: "Completed",
    type: "Infrastructure",
    img: "https://images.unsplash.com/photo-1578575437130-527eed3abbec?w=900&q=80",
  },
  {
    id: "VS-04",
    title: "Capella Hotel Diriyah",
    location: "Diriyah, Riyadh",
    year: "Ongoing",
    type: "Hospitality",
    img: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=900&q=80",
  },
  {
    id: "VS-05",
    title: "Virgin Megastore — 7 Stores",
    location: "Multiple Locations, KSA",
    year: "Completed",
    type: "Retail",
    img: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=900&q=80",
  },
  {
    id: "VS-06",
    title: "PetroRabigh Aramco Facility",
    location: "PetroRabigh",
    year: "Completed",
    type: "Temporary Facility",
    img: "https://vsyenergy.com/project-aramco.png",
  },
];

export default function ProjectGallery() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const x = useTransform(scrollYProgress, [0, 1], ["0%", "-72%"]);
  const [hovered, setHovered] = useState(null);
  const [cursor, setCursor] = useState({ x: 0, y: 0 });
  const progressWidth = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <section id="projects" ref={ref} className="relative h-[400vh] bg-foreground text-background">
      <div className="sticky top-0 h-screen overflow-hidden">
        {/* Header */}
        <div className="absolute top-0 left-0 right-0 z-30 pt-24 px-6 lg:px-10 flex items-end justify-between">
          <div>
            <div className="font-mono text-[10px] uppercase tracking-widest text-amber mb-3">02 / Featured Projects</div>
            <h2 className="font-heading font-bold tracking-tighter text-5xl md:text-7xl">Selected Works</h2>
          </div>
          <div className="hidden md:block max-w-xs text-background/60 text-sm">
            Iconic projects across infrastructure, hospitality, and retail — scroll to traverse the archive.
          </div>
        </div>

        {/* Horizontal track */}
        <motion.div style={{ x }} className="flex h-full items-center gap-6 pl-[10vw] pr-[20vw]">
          {projects.map((p, i) => (
            <motion.div
              key={p.id}
              data-hover
              initial={{ opacity: 0, y: 80 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ delay: i * 0.1, type: "spring", stiffness: 80, damping: 18 }}
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
              onMouseMove={(e) => {
                const r = e.currentTarget.parentElement.getBoundingClientRect();
                setCursor({ x: e.clientX - r.left, y: e.clientY - r.top });
              }}
              className="relative shrink-0 w-[80vw] md:w-[42vw] h-[64vh] group"
            >
              <motion.div
                animate={{ scale: hovered === null ? 1 : hovered === i ? 1.06 : 0.9, opacity: hovered === null ? 1 : hovered === i ? 1 : 0.45 }}
                transition={{ type: "spring", stiffness: 150, damping: 24 }}
                className="relative w-full h-full overflow-hidden border border-background/10"
              >
                <Image src={p.img} alt={p.title} fittingType="fill" className="w-full h-full transition-transform duration-[1.2s] group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/85 via-transparent to-transparent" />
                <div className="absolute top-4 left-4 font-mono text-[10px] uppercase tracking-widest text-background bg-amber px-2 py-1">
                  {p.year}
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-6 flex items-end justify-between">
                  <div>
                    <div className="font-mono text-[10px] uppercase tracking-widest text-amber">{p.id} · {p.type}</div>
                    <h3 className="font-heading font-bold tracking-tighter text-3xl md:text-4xl mt-1">{p.title}</h3>
                    <div className="text-background/60 text-sm mt-1">{p.location}</div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          ))}
        </motion.div>

        {/* Cursor-following title */}
        <AnimatePresence>
          {hovered !== null && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="pointer-events-none absolute z-40 font-mono text-xs uppercase tracking-widest text-amber bg-foreground/80 backdrop-blur px-3 py-1 border border-amber"
              style={{ left: cursor.x, top: cursor.y, translateX: "-50%", translateY: "-150%" }}
            >
              {projects[hovered].title} ↗
            </motion.div>
          )}
        </AnimatePresence>

        {/* Progress bar */}
        <div className="absolute bottom-8 left-6 lg:left-10 right-6 lg:right-10 z-30">
          <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-widest text-background/40 mb-2">
            <span>Archive Traverse</span>
            <span>{projects.length} Monuments</span>
          </div>
          <div className="h-px bg-background/20 relative">
            <motion.div className="absolute left-0 top-0 h-full bg-amber" style={{ width: progressWidth }} />
          </div>
        </div>
      </div>
    </section>
  );
}