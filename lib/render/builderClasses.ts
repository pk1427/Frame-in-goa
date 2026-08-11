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

const QUIZ_ANSWERS: Record<string, string[]> = {
  q1_a: ["Beachcomber Dev", "Monsoon Engineer"],
  q1_b: ["Backwater Architect", "Fort Builder"],
  q1_c: ["Temple UX Designer", "River Delta PM"],
  q1_d: ["Monsoon Engineer", "Cashew Alchemist"],
  q2_a: ["Spice Route Coder", "Goa Coast Rider"],
  q2_b: ["Fort Builder", "Sunset Cartographer"],
  q2_c: ["Goa Coast Rider", "Beachcomber Dev"],
  q2_d: ["Cashew Alchemist", "Monsoon Engineer"],
  q3_a: ["Sunset Cartographer", "Backwater Architect"],
  q3_b: ["River Delta PM", "Temple UX Designer"],
  q3_c: ["Cashew Alchemist", "Spice Route Coder"],
  q3_d: ["Monsoon Engineer", "Goa Coast Rider"],
};

export function pickRandom(): string {
  return builderClasses[Math.floor(Math.random() * builderClasses.length)];
}

export function getClassFromQuizAnswers(answers: string[]): string {
  const scores: Record<string, number> = {};
  for (const cls of builderClasses) {
    scores[cls] = 0;
  }

  for (const answer of answers) {
    const classes = QUIZ_ANSWERS[answer] || [];
    for (const cls of classes) {
      scores[cls] = (scores[cls] || 0) + 1;
    }
  }

  let bestClass = builderClasses[0];
  let bestScore = -1;

  for (const cls of builderClasses) {
    if (scores[cls] > bestScore) {
      bestScore = scores[cls];
      bestClass = cls;
    } else if (scores[cls] === bestScore && cls < bestClass) {
      bestClass = cls;
    }
  }

  return bestClass;
}

export { builderClasses };
