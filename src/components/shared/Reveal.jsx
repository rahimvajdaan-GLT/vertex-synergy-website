import { motion } from "framer-motion";

// Subtle scroll reveal: fade in + slide up once the element enters view.
// Wraps each content section's inner container so the whole page feels
// connected and seamless as the user scrolls through it.
export default function Reveal({ children, className = "", y = 30, amount = 0.2 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount }}
      transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}