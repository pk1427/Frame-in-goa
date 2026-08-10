"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ModeCard } from "@/components/hub/ModeCard";

const cards = [
  {
    href: "/build/frame",
    icon: "1",
    title: "Frame",
    description: "BUILD YOUR PFP FRAME",
  },
  {
    href: "/build/pass",
    icon: "2",
    title: "Builder Pass",
    description: "BUILD YOUR BUILDER ID CARD",
  },
  {
    href: "/build/team",
    icon: "3",
    title: "Team Frame",
    description: "BUILD YOUR TEAM FRAME",
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
    <div className="min-h-screen bg-primary flex flex-col items-center justify-center p-4">
      <main className="w-full max-w-4xl flex flex-col items-center gap-8">
        <div className="text-center">
          <h1 className="font-display text-3xl md:text-4xl text-white">
            FRAME IN GOA
          </h1>
          <p className="font-mono text-white/70 mt-2 uppercase tracking-wider text-xs">
            CHOOSE YOUR BUILDER
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
