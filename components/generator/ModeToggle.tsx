"use client";

interface ModeToggleProps {
  mode: "pfp" | "card" | "combined";
  onModeChange: (mode: "pfp" | "card" | "combined") => void;
}

export function ModeToggle({ mode, onModeChange }: ModeToggleProps) {
  return (
    <div className="flex rounded-lg border-2 border-sand overflow-hidden">
      <button
        onClick={() => onModeChange("pfp")}
        className={`flex-1 py-3 px-4 font-mono text-sm uppercase tracking-wider transition-colors ${
          mode === "pfp"
            ? "bg-accent text-ink"
            : "bg-primary text-white hover:bg-sand/50"
        }`}
      >
        PFP Frame
      </button>
      <button
        onClick={() => onModeChange("card")}
        className={`flex-1 py-3 px-4 font-mono text-sm uppercase tracking-wider transition-colors ${
          mode === "card"
            ? "bg-accent text-ink"
            : "bg-primary text-white hover:bg-sand/50"
        }`}
      >
        Builder ID
      </button>
      <button
        onClick={() => onModeChange("combined")}
        className={`flex-1 py-3 px-4 font-mono text-sm uppercase tracking-wider transition-colors ${
          mode === "combined"
            ? "bg-accent text-ink"
            : "bg-primary text-white hover:bg-sand/50"
        }`}
      >
        Team Frame
      </button>
    </div>
  );
}
