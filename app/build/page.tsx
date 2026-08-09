"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ModeCard } from "@/components/hub/ModeCard";

const cards = [
  {
    href: "/build/frame",
    icon: "1",
    title: "Frame",
    description: "Build your PFP frame — upload, drag, download, share.",
  },
  {
    href: "/build/pass",
    icon: "2",
    title: "Builder Pass",
    description: "Build your builder ID card with name, stack, and class.",
  },
  {
    href: "/build/team",
    icon: "3",
    title: "Team Frame",
    description: "Build a team frame with 2–4 photos, arranged and styled live.",
  },
];

const containerVariants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.12 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0 },
};

export default function BuildHub() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <main className="w-full max-w-4xl flex flex-col items-center gap-8">
        <div className="text-center">
          <h1 className="font-display text-3xl md:text-4xl text-ink">
            Frame In Goa
          </h1>
          <p className="font-sans text-foreground/70 mt-2">
            Choose a builder to get started
          </p>
        </div>
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full"
          variants={containerVariants}
          initial="hidden"
          animate="show"
        >
          {cards.map((card) => (
            <motion.div key={card.href} variants={itemVariants}>
              <Link href={card.href} className="block">
                <ModeCard
                  icon={card.icon}
                  title={card.title}
                  description={card.description}
                />
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </main>
    </div>
  );
}
