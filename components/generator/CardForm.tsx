"use client";

import { Field } from "@/components/ui/Field";
import { Button } from "@/components/ui/Button";
import { pickRandom } from "@/lib/render/builderClasses";

interface CardFormProps {
  name: string;
  stack: string;
  builderClass: string;
  onNameChange: (name: string) => void;
  onStackChange: (stack: string) => void;
  onBuilderClassChange: (builderClass: string) => void;
}

export function CardForm({
  name,
  stack,
  builderClass,
  onNameChange,
  onStackChange,
  onBuilderClassChange,
}: CardFormProps) {
  const handleReroll = () => {
    onBuilderClassChange(pickRandom());
  };

  return (
    <div className="flex flex-col gap-4 w-full max-w-[360px]">
      <Field
        label="Name"
        value={name}
        onChange={(e) => onNameChange(e.target.value)}
        placeholder="Your name"
      />
      <Field
        label="Stack / Role"
        value={stack}
        onChange={(e) => onStackChange(e.target.value)}
        placeholder="e.g. Full-stack Dev"
      />
      <div className="flex flex-col gap-1">
        <span className="font-mono text-xs text-ink/70">Builder Class</span>
        <div className="flex gap-2">
          <Field
            label=""
            value={builderClass}
            onChange={(e) => onBuilderClassChange(e.target.value)}
            className="flex-1"
          />
          <Button
            variant="secondary"
            onClick={handleReroll}
            type="button"
          >
            Reroll
          </Button>
        </div>
      </div>
    </div>
  );
}
