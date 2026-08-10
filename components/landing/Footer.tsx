export function Footer() {
  return (
    <footer className="border-t border-white/20 py-8 px-4">
      <div className="max-w-4xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="font-mono text-xs text-white/50">
          FRAME IN GOA — BUILT FOR HH GOA 2026
        </p>
        <a
          href="https://hhgoa.com"
          target="_blank"
          rel="noopener noreferrer"
          className="font-mono text-xs text-pink hover:text-accent transition-colors"
        >
          HHGOA.COM →
        </a>
      </div>
    </footer>
  );
}
