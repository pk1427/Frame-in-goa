const builderClasses = [
  "Goa Coast Rider",
  "Backwater Architect",
  "Sunset Cartographer",
  "Cashew Alchemist",
  "Fort Builder",
  "Spice Route Coder",
  "Beachcomber Dev",
  "Monsoon Engineer",
  "Temple UX Designer",
  "River Delta PM",
];

export function pickRandom(): string {
  return builderClasses[Math.floor(Math.random() * builderClasses.length)];
}
