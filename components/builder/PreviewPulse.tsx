"use client";

import { motion } from "framer-motion";

interface PreviewPulseProps {
  updateKey: string;
  children: React.ReactNode;
}

export function PreviewPulse({ updateKey, children }: PreviewPulseProps) {
  return (
    <motion.div
      key={updateKey}
      initial={{ scale: 0.985, opacity: 0.85 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.18, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}
