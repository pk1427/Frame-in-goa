const TEAM_TEMPLATES = [
  "Squad: Full-Stack Raiders",
  "Crew: Monsoon Shippers",
  "Unit: Beachcomber Devs",
  "Squad: Sunset Cartographers",
  "Crew: Backwater Architects",
  "Unit: Spice Route Coders",
  "Squad: Monsoon Engineers",
  "Crew: Temple UX Designers",
  "Unit: River Delta PMs",
  "Squad: Cashew Alchemists",
  "Crew: Fort Builders",
  "Unit: Goa Coast Riders",
];

function hashClasses(classes: string[]): number {
  const sorted = [...classes].sort();
  let hash = 0;
  for (const c of sorted) {
    for (let i = 0; i < c.length; i++) {
      hash = ((hash << 5) - hash) + c.charCodeAt(i);
      hash |= 0;
    }
  }
  return Math.abs(hash);
}

export function computeTeamClass(individualClasses: string[]): { label: string; power: number } {
  const validClasses = individualClasses.filter((c) => c && c.trim().length > 0);
  const uniqueClasses = [...new Set(validClasses)].sort();
  const teamSize = validClasses.length;
  const power = Math.min(100, teamSize * 25 + uniqueClasses.length * 10);
  const idx = hashClasses(uniqueClasses) % TEAM_TEMPLATES.length;
  return { label: TEAM_TEMPLATES[idx], power };
}
