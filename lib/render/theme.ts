import { Imbue, Victor_Mono } from "next/font/google";

export const imbue = Imbue({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-imbue",
});

export const victorMono = Victor_Mono({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-victor-mono",
});

export const colors = {
  primary: "#0B683D",
  accent: "#FEE101",
  pink: "#E91E63",
  offwhite: "#FFFBE8",
  ink: "#1A1A1A",
  white: "#FFFFFF",
  sand: "#1B4D2E",
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
