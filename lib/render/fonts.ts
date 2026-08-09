function resolveCssVar(name: string): string {
  if (typeof document === "undefined") {
    return name;
  }
  const value = getComputedStyle(document.documentElement).getPropertyValue(
    name
  ).trim();
  return value || name;
}

export const spaceMonoFamily = resolveCssVar("--font-space-mono");
export const frauncesFamily = resolveCssVar("--font-fraunces");
export const interFamily = resolveCssVar("--font-inter");
