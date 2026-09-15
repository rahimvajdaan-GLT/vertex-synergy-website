import React, { useState, useEffect, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import { base44 } from "@/api/base44Client";
import { Image } from "@/components/ui/image";
import Counter from "@/components/Counter";
import Navbar from "@/components/Navbar";
import CustomCursor from "@/components/CustomCursor";
import Footer from "@/components/Footer";
import { ArrowLeft, ArrowRight, MapPin, Calendar, User, Building, FileText, CheckCircle2, AlertTriangle, Lightbulb } from "lucide-react";

export default function ProjectDetail() {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [next, setNext] = useState(null);
  const [loading, setLoading] = useState(true);
  const timelineRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: timelineRef, offset: ["start center", "end center"] });
  const lineScale = useTransform(scrollYProgress, [0, 1], [0, 1]);

  useEffect(() => {
    window.scrollTo(0, 0);
    (async () => {
      try {
        const all = await base44.entities.Project.list("-created_date", 50);
        const idx = all.findIndex((p) => p.id === id);
        setProject(all[idx]);
        setNext(all[(idx + 1) % all.length]);
      } catch (e) { console.error(e); }
      setLoading(false);
    })();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-secondary/20 border-t-accent rounded-full animate-spin" />
      </div>
    );
  }
  if (!project) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center gap-4">
        <p className="font-mono text-sm uppercase tracking-widest text-muted-foreground">Project not found.</p>
        <Link to="/" className="text-accent font-mono text-xs uppercase tracking-widest">← Back to home</Link>
      </div>
    );
  }

  const milestones = [
    { label: "Project Kickoff", date: project.start_date, desc: "Mobilization and site setup." },
    { label: "Foundation & Structure", date: "", desc: "Substructure and structural framework." },
    { label: "MEP & Fit-Out", date: "", desc: "Mechanical, electrical, plumbing installations." },
    { label: "Testing & Commissioning", date: "", desc: "Systems validation and quality checks." },
    { label: "Handover", date: project.completion_date, desc: project.status === "Completed" ? "Delivered to client." : "In progress." },
  ].filter((m) => m.date !== undefined);

  const metaItems = [
    { icon: User, label: "Client", value: project.client },
    { icon: MapPin, label: "Location", value: project.location },
    { icon: Building, label: "Contract Value", value: project.contract_value },
    { icon: Calendar, label: "Duration", value: project.start_date && project.completion_date ? `${project.start_date} → ${project.completion_date}` : (project.year || "—") },
    { icon: FileText, label: "Built-Up Area", value: project.built_up_area },
    { icon: CheckCircle2, label: "Status", value: `${project.status} · ${project.completion_percentage}%` },
  ];

  return (
    <div className="bg-black">
      <Navbar />
      <CustomCursor />

      {/* Hero */}
      <section className="relative h-screen w-full overflow-hidden">
        <Image src={project.main_image} alt={project.title} fittingType="fill" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-black/40" />
        <div className="absolute inset-0 blueprint-grid opacity-30" />

        <div className="absolute inset-0 flex flex-col justify-end pb-20 px-6 lg:px-10 max-w-[1600px] mx-auto">
          <Link to="/#projects" className="font-mono text-[10px] uppercase tracking-widest text-foreground/60 hover:text-accent transition-colors mb-4 inline-flex items-center gap-2 w-fit">
            <ArrowLeft size={14} /> Back to Projects
          </Link>
          <div className="flex items-center gap-3 mb-4">
            <span className={`font-mono text-[10px] uppercase tracking-widest px-3 py-1 rounded-full ${project.status === "Ongoing" ? "bg-blue text-background" : "bg-accent text-accent-foreground"}`}>{project.status}</span>
            <span className="border border-secondary/25 bg-slate-950/50 font-mono text-[10px] uppercase tracking-widest px-3 py-1 rounded-full text-foreground/70">{project.category}</span>
            <span className="font-mono text-[10px] uppercase tracking-widest text-foreground/50">{project.year}</span>
          </div>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="font-heading font-bold tracking-tighter text-6xl md:text-8xl text-foreground max-w-4xl leading-[0.9]"
          >
            {project.title}
          </motion.h1>
          <p className="mt-5 max-w-xl text-foreground/60 text-lg">{project.description}</p>
        </div>
      </section>

      {/* Meta */}
      <section className="relative bg-black py-16 border-y border-secondary/15">
        <div className="mx-auto max-w-[1600px] px-6 lg:px-10 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-px bg-secondary/15">
          {metaItems.map((m) => (
            <div key={m.label} className="bg-black p-6">
              <m.icon size={18} className="text-accent mb-3" />
              <div className="font-mono text-[9px] uppercase tracking-widest text-muted-foreground mb-1">{m.label}</div>
              <div className="font-heading font-bold tracking-tighter text-base text-foreground">{m.value || "—"}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Key stats */}
      {project.key_stats?.length > 0 && (
        <section className="relative bg-black py-24">
          <div className="mx-auto max-w-[1600px] px-6 lg:px-10">
            <div className="font-mono text-[10px] uppercase tracking-widest text-accent mb-3">Key Statistics</div>
            <h2 className="font-heading font-bold tracking-tighter text-4xl md:text-6xl mb-12">By the numbers.</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-secondary/15">
              {project.key_stats.map((s) => {
                const num = parseFloat(s.value);
                const pureNumeric = !isNaN(num) && /^[\d.]+/.test(s.value) && !/[A-Za-z]{2,}/.test(s.value.replace(/^[\d.]+/, ""));
                return (
                  <div key={s.label} className="bg-black p-8">
                    <div className="font-heading font-bold tracking-tighter text-4xl md:text-5xl text-accent">
                      {pureNumeric ? <Counter to={num} suffix={s.value.replace(/^[\d.]+/, "")} /> : s.value}
                    </div>
                    <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground mt-2">{s.label}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Scope + challenges/solutions/achievements */}
      <section className="relative bg-black py-24">
        <div className="mx-auto max-w-[1600px] px-6 lg:px-10 grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div>
            <div className="font-mono text-[10px] uppercase tracking-widest text-accent mb-3">Scope of Work</div>
            <h2 className="font-heading font-bold tracking-tighter text-3xl md:text-5xl mb-5">What we delivered.</h2>
            <p className="text-muted-foreground">{project.scope_of_work || project.description}</p>
          </div>
          <div className="space-y-8">
            {project.challenges?.length > 0 && (
              <div>
                <h3 className="font-mono text-[10px] uppercase tracking-widest text-accent mb-3 flex items-center gap-2"><AlertTriangle size={14} /> Main Challenges</h3>
                <ul className="space-y-2">
                  {project.challenges.map((c) => <li key={c} className="text-foreground/70 text-sm flex gap-2"><span className="text-accent">—</span> {c}</li>)}
                </ul>
              </div>
            )}
            {project.solutions?.length > 0 && (
              <div>
                <h3 className="font-mono text-[10px] uppercase tracking-widest text-accent mb-3 flex items-center gap-2"><Lightbulb size={14} /> Solutions Delivered</h3>
                <ul className="space-y-2">
                  {project.solutions.map((c) => <li key={c} className="text-foreground/70 text-sm flex gap-2"><span className="text-accent">—</span> {c}</li>)}
                </ul>
              </div>
            )}
            {project.achievements?.length > 0 && (
              <div>
                <h3 className="font-mono text-[10px] uppercase tracking-widest text-accent mb-3 flex items-center gap-2"><CheckCircle2 size={14} /> Key Achievements</h3>
                <ul className="space-y-2">
                  {project.achievements.map((c) => <li key={c} className="text-foreground/70 text-sm flex gap-2"><span className="text-accent">—</span> {c}</li>)}
                </ul>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Gallery */}
      {project.gallery_images?.length > 0 && (
        <section className="relative bg-black py-24">
          <div className="mx-auto max-w-[1600px] px-6 lg:px-10">
            <div className="font-mono text-[10px] uppercase tracking-widest text-accent mb-3">Project Gallery</div>
            <h2 className="font-heading font-bold tracking-tighter text-4xl md:text-6xl mb-10">Visual record.</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {project.gallery_images.map((g, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  className={`relative overflow-hidden rounded-2xl ${i === 0 ? "col-span-2 md:row-span-2 h-[400px] md:h-full" : "h-56"}`}
                >
                  <Image src={g} alt={`${project.title} ${i + 1}`} fittingType="fill" className="w-full h-full object-cover hover:scale-110 transition-transform duration-700" />
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Construction timeline */}
      <section ref={timelineRef} className="relative bg-black py-24">
        <div className="mx-auto max-w-3xl px-6">
          <div className="font-mono text-[10px] uppercase tracking-widest text-accent mb-3">Construction Timeline</div>
          <h2 className="font-heading font-bold tracking-tighter text-4xl md:text-6xl mb-16">From ground to skyline.</h2>
          <div className="relative pl-8">
            <div className="absolute left-3 top-0 bottom-0 w-px bg-secondary/15" />
            <motion.div className="absolute left-3 top-0 bottom-0 w-px bg-accent origin-top" style={{ scaleY: lineScale }} />
            {milestones.map((m, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ delay: i * 0.1 }}
                className="relative mb-12"
              >
                <div className="absolute -left-[1.45rem] top-1 w-3 h-3 rounded-full bg-accent ring-4 ring-black" />
                <div className="font-mono text-[10px] uppercase tracking-widest text-accent mb-1">{m.date || `Stage ${i + 1}`}</div>
                <h3 className="font-heading font-bold tracking-tighter text-2xl mb-1">{m.label}</h3>
                <p className="text-muted-foreground text-sm">{m.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Next project */}
      {next && (
        <Link to={`/project/${next.id}`} className="group relative block h-[50vh] overflow-hidden">
          <Image src={next.main_image} alt={next.title} fittingType="fill" className="w-full h-full object-cover opacity-50 group-hover:opacity-70 transition-opacity duration-500" />
          <div className="absolute inset-0 bg-black/60" />
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
            <div className="font-mono text-[10px] uppercase tracking-widest text-accent mb-3">View Next Project</div>
            <h2 className="font-heading font-bold tracking-tighter text-4xl md:text-7xl group-hover:text-accent transition-colors">{next.title}</h2>
            <span className="mt-4 flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-foreground/70 group-hover:text-accent transition-colors">
              Explore Case Study <ArrowRight size={16} />
            </span>
          </div>
        </Link>
      )}

      <Footer />
    </div>
  );
}