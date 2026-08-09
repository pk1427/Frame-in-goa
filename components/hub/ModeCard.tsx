"use client";

interface ModeCardProps {
  icon: string;
  title: string;
  description: string;
}

export function ModeCard({ icon, title, description }: ModeCardProps) {
  return (
    <div className="p-6 rounded-lg border border-sand bg-background flex flex-col gap-3">
      <div className="w-8 h-8 rounded-full border border-sand flex items-center justify-center font-mono text-xs text-coral">
        {icon}
      </div>
      <div>
        <h3 className="font-display text-lg text-ink">{title}</h3>
        <p className="font-sans text-sm text-foreground/70 mt-1">{description}</p>
      </div>
    </div>
  );
}
