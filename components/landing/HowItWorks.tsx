const steps = [
  {
    title: "Upload",
    description: "Drop your photo or pick from your camera roll.",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 5v8m0 0l-3-3m3 3 3-3M5 19h14a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2z" />
      </svg>
    ),
  },
  {
    title: "Generate",
    description: "We render your frame, builder pass, or team frame live.",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M13 2L3 14h8v8l10-12h-8z" />
      </svg>
    ),
  },
  {
    title: "Share",
    description: "Download PNG or post straight to X.",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.72 19.72 0 0 1-8.63-3.07 19.42 19.42 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.63A2 2 0 0 1 4.09 2h3a2 2 0 0 1 2 1.72 21.16 21.16 0 0 0 1 .92 3.72a2 2 0 0 1-.46 1.94l-1.17 1.17a2 2 0 0 0 1.27 3.34 16.63 16.63 0 0 0 2.56.82 2 2 0 0 1 1.74 1.74 16.6 16.6 0 0 0 .82 2.56 2 2 0 0 1-1.94.46 14.6 14.6 0 0 1-2.43-.87 14.6 14.6 0 0 1-4.13-2.53 14.6 14.6 0 0 1-2.53-4.13 14.6 14.6 0 0 1-.87-2.43 2 2 0 0 1 .46-1.94l1.17-1.17a2 2 0 0 0 1.94-.46 14.6 14.6 0 0 1 2.53-4.13 14.6 14.6 0 0 1 4.13-2.53 14.6 14.6 0 0 1 2.43-.87 2 2 0 0 1 2.18.46M9 12h6v6l-6-6z" />
        <path d="M16 12h6m-3-3 3 3-3 3" />
      </svg>
    ),
  },
];

export function HowItWorks() {
  return (
    <section className="py-16 px-4">
      <div className="max-w-4xl mx-auto">
        <h2 className="font-display font-bold text-2xl md:text-3xl text-white text-center mb-10">
          How it works
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, i) => (
            <div key={i} className="flex flex-col items-center text-center gap-3">
              <div className="w-10 h-10 rounded-full border-2 border-accent flex items-center justify-center text-accent" aria-hidden="true">
                {step.icon}
              </div>
              <h3 className="font-display font-bold text-lg text-white">{step.title}</h3>
              <p className="font-mono text-sm text-white/70 uppercase tracking-wider text-xs">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
