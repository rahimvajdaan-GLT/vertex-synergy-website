import React from "react";
import { motion, useTransform } from "framer-motion";
import { useScrollProgress } from "@/lib/ScrollContext";

export default function Atmosphere() {
  const progress = useScrollProgress();
  const blueprint = useTransform(progress, [0.1, 0.25], [0, 1], { clamp: true });
  const amber = useTransform(progress, [0.3, 0.5], [0, 1], { clamp: true });
  const steel = useTransform(progress, [0.6, 0.8], [1, 0.4], { clamp: true });
  const dawn = useTransform(progress, [0.85, 1], [0, 1], { clamp: true });
  if (!progress) {
    return <div className="fixed inset-0 z-0 bg-gradient-to-b from-navy via-background to-background" />;
  }
  return (
    <div className="fixed inset-0 z-0 overflow-hidden">
      <div className="absolute inset-0 bg-black" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_-10%,rgba(125,211,252,0.18),transparent_55%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,transparent_52%,rgba(100,116,139,0.07))]" />
      <motion.div style={{ opacity: blueprint }} className="absolute inset-0 bg-[radial-gradient(circle_at_50%_60%,rgba(34,211,238,0.12),transparent_60%)]" />
      <motion.div style={{ opacity: amber }} className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,179,71,0.1),transparent_60%)]" />
      <motion.div style={{ opacity: steel }} className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(125,211,252,0.16),transparent_70%)]" />
      <motion.div style={{ opacity: dawn }} className="absolute inset-0 bg-gradient-to-t from-accent/15 via-transparent to-transparent" />
    </div>
  );
}