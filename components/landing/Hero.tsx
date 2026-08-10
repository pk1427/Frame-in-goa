"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export function Hero() {
  return (
    <section className="relative flex flex-col items-center justify-center px-4 py-16 md:py-24 overflow-hidden bg-primary">
      <div className="absolute inset-0 bg-radial from-accent/25 via-accent/5 to-transparent pointer-events-none" />
      <div className="absolute inset-0 hero-noise pointer-events-none" />
      <motion.div
        className="relative z-10 flex flex-col items-center gap-6 max-w-3xl mx-auto text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
      >
          <h1 className="font-display font-bold text-5xl md:text-7xl text-white tracking-tight leading-tight">
          Frame In Goa
        </h1>
        <p className="font-mono text-lg md:text-xl text-white/80 max-w-xl tracking-wide">
          HEADS DOWN. BUILD YOUR HACKER HOUSE IDENTITY.
        </p>
        <Link
          href="/build"
          className="inline-flex items-center gap-2 px-8 py-4 rounded-lg bg-accent text-ink font-mono font-bold text-sm uppercase tracking-wider hover:bg-primary hover:text-white transition-colors shadow-sticker btn-torn"
        >
          BUILD YOURS →
        </Link>
      </motion.div>
    </section>
  );
}
