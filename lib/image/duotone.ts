import { colors } from "@/lib/render/theme";

function hexToRgb(hex: string): [number, number, number] {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return [r, g, b];
}

function lerp(a: [number, number, number], b: [number, number, number], t: number): [number, number, number] {
  return [
    Math.round(a[0] + (b[0] - a[0]) * t),
    Math.round(a[1] + (b[1] - a[1]) * t),
    Math.round(a[2] + (b[2] - a[2]) * t),
  ];
}

export function applyBrandDuotone(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number
): void {
  const imageData = ctx.getImageData(x, y, w, h);
  const data = imageData.data;
  const primary = hexToRgb(colors.primary);
  const offwhite = hexToRgb(colors.offwhite);
  const blend = 0.45;

  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    const lum = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    const tinted = lerp(primary, offwhite, lum);
    data[i] = Math.round(r * (1 - blend) + tinted[0] * blend);
    data[i + 1] = Math.round(g * (1 - blend) + tinted[1] * blend);
    data[i + 2] = Math.round(b * (1 - blend) + tinted[2] * blend);
  }

  ctx.putImageData(imageData, x, y);
}
