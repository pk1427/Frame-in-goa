const steps = [
  {
    title: "Upload",
    description: "Drop your photo or pick from your camera roll.",
  },
  {
    title: "Generate",
    description: "We render your frame, builder pass, or team frame live.",
  },
  {
    title: "Share",
    description: "Download PNG or post straight to X.",
  },
];

export function HowItWorks() {
  return (
    <section className="py-16 px-4">
      <div className="max-w-4xl mx-auto">
        <h2 className="font-display text-2xl md:text-3xl text-ink text-center mb-10">
          How it works
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, i) => (
            <div key={i} className="flex flex-col items-center text-center gap-3">
              <div className="w-10 h-10 rounded-full border border-sand flex items-center justify-center font-mono text-sm text-coral">
                {i + 1}
              </div>
              <h3 className="font-display text-lg text-ink">{step.title}</h3>
              <p className="font-sans text-sm text-foreground/70">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
