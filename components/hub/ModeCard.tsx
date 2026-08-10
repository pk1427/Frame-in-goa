"use client";

interface ModeCardProps {
  icon: string;
  title: string;
  description: string;
}

const rotations = ["rotate-1", "rotate-[-1.5deg]", "rotate-2"];

export function ModeCard({ icon, title, description }: ModeCardProps) {
  const rotation = rotations[(parseInt(icon, 10) - 1) % rotations.length];

  return (
    <div
      className={`
        relative p-6 rounded-xl
        bg-offwhite text-ink
        border-2 border-accent
        shadow-sticker ${rotation}
        transition-transform hover:scale-105
        group
      `.trim().replace(/\s+/g, " ")}
    >
      <div
        className="absolute -top-4 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-pink shadow-[0_4px_0_rgba(0,0,0,0.25)]"
        aria-hidden="true"
      />
      <div className="w-8 h-8 rounded-full border-2 border-pink flex items-center justify-center font-mono text-xs text-pink mb-3">
        {icon}
      </div>
      <div>
          <h3 className="font-display font-bold text-lg text-ink group-hover:text-primary transition-colors">
          {title}
        </h3>
        <p className="font-mono text-xs text-ink/70 mt-1 tracking-wider uppercase">
          {description}
        </p>
      </div>
    </div>
  );
}
