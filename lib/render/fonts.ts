function resolveCssVar(name: string): string {
  if (typeof document === "undefined") {
    return name;
  }
  const value = getComputedStyle(document.documentElement).getPropertyValue(
    name
  ).trim();
  return value || name;
}

export const victorMonoFamily = resolveCssVar("--font-victor-mono");
export const imbueFamily = resolveCssVar("--font-imbue");
