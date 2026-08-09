"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export function Hero() {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center px-4 overflow-hidden bg-gradient-to-b from-coral/10 via-background to-background">
      <motion.div
        className="relative z-10 flex flex-col items-center gap-6 max-w-3xl mx-auto text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
      >
        <h1 className="font-display text-5xl md:text-7xl text-ink tracking-tight">
          Frame In Goa
        </h1>
        <p className="font-sans text-lg md:text-xl text-foreground/70 max-w-xl">
          Build your hacker-house identity — frame, builder pass, or team frame.
          Everything you need to show up at HH Goa 2026.
        </p>
        <Link
          href="/build"
          className="inline-flex items-center gap-2 px-8 py-4 rounded-lg bg-coral text-cream font-mono font-bold text-sm hover:bg-ink transition-colors"
        >
          Build yours →
        </Link>
      </motion.div>
    </section>
  );
}
