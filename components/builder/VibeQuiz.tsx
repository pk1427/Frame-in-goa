"use client";

import { useState } from "react";

const QUESTIONS = [
  {
    id: "q1",
    text: "How do you debug at 3am?",
    options: [
      { value: "q1_a", label: "Coffee and console.log" },
      { value: "q1_b", label: "Stack Overflow deep dive" },
      { value: "q1_c", label: "Ask the team at sunrise" },
      { value: "q1_d", label: "It just works... somehow" },
    ],
  },
  {
    id: "q2",
    text: "Your ideal hackathon meal?",
    options: [
      { value: "q2_a", label: "Prawn curry and rice" },
      { value: "q2_b", label: "Cold brew and protein bar" },
      { value: "q2_c", label: "Street food tour" },
      { value: "q2_d", label: "Whatever is left in the fridge" },
    ],
  },
  {
    id: "q3",
    text: "What's your merge strategy?",
    options: [
      { value: "q3_a", label: "Rebase everything" },
      { value: "q3_b", label: "Squash and merge" },
      { value: "q3_c", label: "Merge commits for days" },
      { value: "q3_d", label: "Push directly to main" },
    ],
  },
];

interface VibeQuizProps {
  onComplete: (answers: string[]) => void;
  onSkip: () => void;
}

export function VibeQuiz({ onComplete, onSkip }: VibeQuizProps) {
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);

  const handleSelect = (value: string) => {
    const next = [...answers, value];
    setAnswers(next);
    if (current + 1 < QUESTIONS.length) {
      setCurrent(current + 1);
    } else {
      onComplete(next);
    }
  };

  const question = QUESTIONS[current];
  const progress = ((current) / QUESTIONS.length) * 100;

  return (
    <div className="w-full max-w-md flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <span className="font-mono text-xs text-accent uppercase tracking-wider">
          VIBE CHECK
        </span>
        <span className="font-mono text-xs text-white/50 uppercase tracking-wider">
          {current + 1}/{QUESTIONS.length}
        </span>
      </div>

      <div className="w-full h-1 bg-sand rounded-full overflow-hidden">
        <div
          className="h-full bg-accent transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>

      <p className="font-display text-xl text-white text-center">
        {question.text}
      </p>

      <div className="flex flex-col gap-3">
        {question.options.map((option) => (
          <button
            key={option.value}
            onClick={() => handleSelect(option.value)}
            className="w-full py-3 px-4 rounded-lg border-2 border-sand bg-transparent text-left font-mono text-sm text-white hover:bg-accent hover:text-ink hover:border-accent transition-colors"
          >
            {option.label}
          </button>
        ))}
      </div>

      <button
        onClick={onSkip}
        className="font-mono text-xs text-pink hover:text-accent uppercase tracking-wider transition-colors text-center"
      >
        SKIP
      </button>
    </div>
  );
}
