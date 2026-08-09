export function Footer() {
  return (
    <footer className="border-t border-sand/50 py-8 px-4">
      <div className="max-w-4xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="font-mono text-xs text-foreground/50">
          Frame In Goa — built for HH Goa 2026
        </p>
        <a
          href="https://hhgoa.com"
          target="_blank"
          rel="noopener noreferrer"
          className="font-mono text-xs text-lagoon hover:text-coral transition-colors"
        >
          hhgoa.com →
        </a>
      </div>
    </footer>
  );
}
