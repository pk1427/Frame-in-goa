import { Fraunces, Space_Mono, Inter } from "next/font/google";

export const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
});

export const spaceMono = Space_Mono({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-space-mono",
});

export const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const colors = {
  ink: "#1a1a2e",
  sand: "#f4e4bc",
  coral: "#ff6b6b",
  lagoon: "#4ecdc4",
  gold: "#ffe66d",
  cream: "#fff8e7",
} as const;

export const radii = {
  card: 24,
  stamp: 9999,
} as const;

export const layout = {
  pfpSize: 1200,
  cardWidth: 1200,
  cardHeight: 1500,
  photoBox: 720,
  stampOuter: 320,
  stampInner: 260,
} as const;

export type Theme = typeof colors;
