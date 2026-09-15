import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { base44 } from "@/api/base44Client";
import ProjectCard from "@/components/ProjectCard";
import { SlidersHorizontal } from "lucide-react";

const filters = [
  "All Projects", "Commercial", "Residential", "Hospitality", "Infrastructure",
  "Industrial", "Healthcare", "Government", "Ongoing", "Completed",
];

export default function ProjectShowcase() {
  const [projects, setProjects] = useState([]);
  const [active, setActive] = useState("All Projects");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const data = await base44.entities.Project.list("-created_date", 50);
        setProjects(data);
      } catch (e) {
        console.error(e);
      }
      setLoading(false);
    })();
  }, []);

  const filtered = projects.filter((p) => {
    if (active === "All Projects") return true;
    if (active === "Ongoing" || active === "Completed") return p.status === active;
    return p.category === active;
  });

  return (
    <section id="projects" className="relative bg-card py-32 overflow-hidden">
      <div className="absolute inset-0 blueprint-grid-fine opacity-20" />
      <div className="mx-auto max-w-[1600px] px-6 lg:px-10 relative">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="font-mono text-[10px] uppercase tracking-widest text-accent mb-3">02 / Project Portfolio</div>
            <h2 className="font-heading font-bold tracking-tighter text-5xl md:text-7xl">
              Featured<br />Projects.
            </h2>
          </div>
          <p className="text-muted-foreground max-w-sm">
            Showcasing our expertise across infrastructure, hospitality, retail, and industrial sectors throughout Saudi Arabia.
          </p>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-3 mb-12 overflow-x-auto no-scrollbar pb-2">
          <SlidersHorizontal size={16} className="text-muted-foreground shrink-0" />
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => setActive(f)}
              className={`font-mono text-[10px] uppercase tracking-widest px-4 py-2 rounded-full whitespace-nowrap transition-colors ${
                active === f ? "bg-accent text-accent-foreground" : "glass text-foreground/60 hover:text-foreground"
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-[420px] glass rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : (
          <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence>
              {filtered.map((p, i) => (
                <ProjectCard key={p.id} project={p} index={i} />
              ))}
            </AnimatePresence>
          </motion.div>
        )}

        {!loading && filtered.length === 0 && (
          <div className="text-center py-20 font-mono text-sm uppercase tracking-widest text-muted-foreground">
            No projects in this category yet.
          </div>
        )}
      </div>
    </section>
  );
}