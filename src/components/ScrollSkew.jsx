import React from "react";
import { motion, useScroll, useVelocity, useSpring, useTransform } from "framer-motion";

export default function ScrollSkew({ children }) {
  const { scrollY } = useScroll();
  const velocity = useVelocity(scrollY);
  const smooth = useSpring(velocity, { stiffness: 120, damping: 30, mass: 0.3 });
  const skewY = useTransform(smooth, [-3000, 3000], [-4, 4]);
  return (
    <motion.div style={{ skewY, transformOrigin: "center" }}>{children}</motion.div>
  );
}