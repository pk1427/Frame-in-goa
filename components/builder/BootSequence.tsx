"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const lines = [
  "> INITIALIZING HH GOA 2026 BUILDER PROFILE...",
  "> APPLYING GOA THEME...",
  "> READY.",
];

const LINE_DELAY = 180;
const FINAL_PAUSE = 250;

interface BootSequenceProps {
  onComplete: () => void;
}

export function BootSequence({ onComplete }: BootSequenceProps) {
  const [visibleLines, setVisibleLines] = useState(0);
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mq.matches) {
      onComplete();
      return;
    }

    const timers: ReturnType<typeof setTimeout>[] = [];

    for (let i = 1; i <= lines.length; i++) {
      timers.push(setTimeout(() => setVisibleLines(i), i * LINE_DELAY));
    }
    timers.push(
      setTimeout(() => {
        setExiting(true);
        timers.push(setTimeout(onComplete, 300));
      }, lines.length * LINE_DELAY + FINAL_PAUSE)
    );

    return () => timers.forEach(clearTimeout);
  }, [onComplete]);

  return (
    <motion.div
      className="font-mono text-sm text-pink/80 flex flex-col gap-1"
      initial={{ opacity: 0 }}
      animate={{ opacity: exiting ? 0 : 1 }}
      transition={{ duration: 0.3 }}
    >
      {lines.slice(0, visibleLines).map((line, i) => (
        <div key={i}>{line}</div>
      ))}
    </motion.div>
  );
}
