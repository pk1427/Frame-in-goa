"use client";

interface ModeToggleProps {
  mode: "pfp" | "card" | "combined";
  onModeChange: (mode: "pfp" | "card" | "combined") => void;
}

export function ModeToggle({ mode, onModeChange }: ModeToggleProps) {
  return (
    <div className="flex rounded-lg border border-sand overflow-hidden">
      <button
        onClick={() => onModeChange("pfp")}
        className={`flex-1 py-3 px-4 font-mono text-sm transition-colors ${
          mode === "pfp"
            ? "bg-coral text-cream"
            : "bg-background text-ink hover:bg-sand/50"
        }`}
      >
        PFP Frame
      </button>
      <button
        onClick={() => onModeChange("card")}
        className={`flex-1 py-3 px-4 font-mono text-sm transition-colors ${
          mode === "card"
            ? "bg-coral text-cream"
            : "bg-background text-ink hover:bg-sand/50"
        }`}
      >
        Builder ID
      </button>
      <button
        onClick={() => onModeChange("combined")}
        className={`flex-1 py-3 px-4 font-mono text-sm transition-colors ${
          mode === "combined"
            ? "bg-coral text-cream"
            : "bg-background text-ink hover:bg-sand/50"
        }`}
      >
        Team Frame
      </button>
    </div>
  );
}
