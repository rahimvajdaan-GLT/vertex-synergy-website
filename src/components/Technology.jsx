import React from "react";
import { motion } from "framer-motion";
import { Cpu, Monitor, Plane, Brain, Box, Activity, Leaf, BarChart3 } from "lucide-react";

const techs = [
  { icon: Cpu, title: "BIM", desc: "Building Information Modeling across every discipline." },
  { icon: Monitor, title: "Digital PM", desc: "Real-time digital project management platforms." },
  { icon: Plane, title: "Drone Monitoring", desc: "Aerial surveillance and progress tracking." },
  { icon: Brain, title: "AI-Powered Planning", desc: "Predictive scheduling and resource optimization." },
  { icon: Box, title: "3D Coordination", desc: "Clash detection and spatial coordination." },
  { icon: Activity, title: "Smart Construction", desc: "IoT sensors and connected site operations." },
  { icon: Leaf, title: "Sustainability", desc: "Green building practices and LEED alignment." },
  { icon: BarChart3, title: "Real-Time Reporting", desc: "Live dashboards and instant project insights." },
];

export default function Technology() {
  return (
    <section id="technology" className="relative bg-background py-32 overflow-hidden">
      <div className="absolute top-1/4 right-1/4 w-[500px] h-[500px] bg-blue/10 rounded-full blur-[160px] animated-gradient" />
      <div className="absolute inset-0 blueprint-grid opacity-20" />
      <div className="mx-auto max-w-[1600px] px-6 lg:px-10 relative">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-16">
          <div className="md:col-span-7">
            <div className="font-mono text-[10px] uppercase tracking-widest text-blue mb-3">05 / Technology & Innovation</div>
            <h2 className="font-heading font-bold tracking-tighter text-5xl md:text-7xl">
              Building the<br /><span className="text-blue">future, digitally.</span>
            </h2>
          </div>
          <div className="md:col-span-4 md:col-start-9 self-end">
            <p className="text-muted-foreground">
              We fuse construction expertise with cutting-edge digital tools to deliver smarter, safer, faster projects.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {techs.map((t, i) => (
            <motion.div
              key={t.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: (i % 4) * 0.08 }}
              whileHover={{ y: -6 }}
              data-hover
              className="group glass rounded-2xl p-7 hover:border-blue/40 transition-colors relative overflow-hidden"
            >
              <div className="absolute -bottom-10 -left-10 w-28 h-28 bg-blue/10 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
              <t.icon size={28} className="text-blue mb-5 group-hover:scale-110 transition-transform" />
              <h3 className="font-heading font-bold tracking-tighter text-lg mb-2">{t.title}</h3>
              <p className="text-sm text-muted-foreground">{t.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}