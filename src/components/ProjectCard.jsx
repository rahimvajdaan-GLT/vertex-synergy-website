import React, { useRef, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { Link } from "react-router-dom";
import { Image } from "@/components/ui/image";
import { ArrowUpRight } from "lucide-react";

export default function ProjectCard({ project, index }) {
  const ref = useRef(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rotateX = useSpring(useTransform(my, [-0.5, 0.5], [7, -7]), { stiffness: 150, damping: 18 });
  const rotateY = useSpring(useTransform(mx, [-0.5, 0.5], [-7, 7]), { stiffness: 150, damping: 18 });

  const onMove = (e) => {
    const r = ref.current.getBoundingClientRect();
    mx.set((e.clientX - r.left) / r.width - 0.5);
    my.set((e.clientY - r.top) / r.height - 0.5);
  };
  const onLeave = () => { mx.set(0); my.set(0); };

  const statusColor = project.status === "Ongoing" ? "bg-blue" : project.status === "Upcoming" ? "bg-gold" : "bg-accent";

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, delay: (index % 3) * 0.08 }}
      style={{ perspective: 1000 }}
      data-hover
    >
      <motion.div
        ref={ref}
        onMouseMove={onMove}
        onMouseLeave={onLeave}
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        className="group relative h-[420px] glass rounded-2xl overflow-hidden hover:border-accent/50 transition-colors"
      >
        <Link to={`/project/${project.id}`} className="block w-full h-full">
          <motion.div className="absolute inset-0" style={{ transform: "translateZ(0)" }}>
            <Image src={project.main_image} alt={project.title} fittingType="fill" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
            <div className="absolute inset-0 bg-accent/0 group-hover:bg-accent/15 transition-colors duration-500" />
          </motion.div>

          {/* Status + category */}
          <div className="absolute top-4 left-4 right-4 flex items-center justify-between" style={{ transform: "translateZ(40px)" }}>
            <span className={`${statusColor} text-background font-mono text-[9px] uppercase tracking-widest px-2.5 py-1 rounded-full`}>
              {project.status}
            </span>
            <span className="glass-strong text-foreground/80 font-mono text-[9px] uppercase tracking-widest px-2.5 py-1 rounded-full">
              {project.category}
            </span>
          </div>

          {/* Details */}
          <motion.div
            className="absolute bottom-0 left-0 right-0 p-6"
            style={{ transform: "translateZ(30px)" }}
          >
            <div className="font-mono text-[10px] uppercase tracking-widest text-accent mb-1">{project.location}</div>
            <h3 className="font-heading font-bold tracking-tighter text-2xl md:text-3xl text-foreground mb-2">{project.title}</h3>
            <div className="overflow-hidden max-h-0 group-hover:max-h-40 transition-all duration-500">
              <p className="text-foreground/60 text-sm mb-3">{project.description}</p>
              <div className="flex flex-wrap gap-2 mb-3">
                {project.scope_of_work?.split(",").slice(0, 2).map((s) => (
                  <span key={s} className="font-mono text-[8px] uppercase tracking-widest text-foreground/50 border border-border px-2 py-0.5 rounded">{s.trim()}</span>
                ))}
              </div>
              <div className="flex items-center justify-between">
                <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">{project.client} · {project.year}</span>
                <span className="flex items-center gap-1 text-accent font-mono text-[10px] uppercase tracking-widest">View Case Study <ArrowUpRight size={12} /></span>
              </div>
            </div>
          </motion.div>
        </Link>
      </motion.div>
    </motion.div>
  );
}