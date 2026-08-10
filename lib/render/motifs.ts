import { colors } from "./theme";
import { victorMonoFamily } from "./fonts";

export function seededRotation(seed: string, maxDeg = 2.5): number {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = ((hash << 5) - hash + seed.charCodeAt(i)) | 0;
  }
  const normalized = (hash & 0xffff) / 0xffff;
  return (normalized * 2 - 1) * (maxDeg * Math.PI / 180);
}

export function drawCornerRibbon(
  ctx: CanvasRenderingContext2D,
  text: string
): void {
  const w = 200;
  const h = 52;
  const x = ctx.canvas.width - w - 16;
  const y = 16;

  ctx.save();
  ctx.translate(x + w / 2, y + h / 2);
  ctx.rotate(-Math.PI / 7);

  ctx.shadowColor = "rgba(0,0,0,0.25)";
  ctx.shadowBlur = 0;
  ctx.shadowOffsetX = 6;
  ctx.shadowOffsetY = 8;

  ctx.beginPath();
  ctx.moveTo(-w / 2 + 8, -h / 2);
  ctx.lineTo(w / 2 - 8, -h / 2);
  ctx.quadraticCurveTo(w / 2, -h / 2, w / 2, -h / 2 + 8);
  ctx.lineTo(w / 2, h / 2 - 8);
  ctx.quadraticCurveTo(w / 2, h / 2, w / 2 - 8, h / 2);
  ctx.lineTo(-w / 2 + 8, h / 2);
  ctx.quadraticCurveTo(-w / 2, h / 2, -w / 2, h / 2 - 8);
  ctx.lineTo(-w / 2, -h / 2 + 8);
  ctx.quadraticCurveTo(-w / 2, -h / 2, -w / 2 + 8, -h / 2);
  ctx.closePath();
  ctx.fillStyle = colors.accent;
  ctx.fill();

  ctx.shadowColor = "transparent";
  ctx.font = `700 20px ${victorMonoFamily}`;
  ctx.fillStyle = colors.ink;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(text, 0, 1);

  ctx.restore();
}

export function drawPinDot(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  color: string
): void {
  ctx.save();
  ctx.fillStyle = color;
  ctx.shadowColor = "rgba(0,0,0,0.25)";
  ctx.shadowBlur = 0;
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 4;
  ctx.beginPath();
  ctx.arc(cx, cy, 14, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

export function drawStickerBadge(
  ctx: CanvasRenderingContext2D,
  emoji: string,
  x: number,
  y: number,
  size: number
): void {
  ctx.save();
  ctx.font = `${size}px "Apple Color Emoji", "Segoe UI Emoji", "Noto Color Emoji", sans-serif`;
  ctx.fillStyle = colors.pink;
  ctx.textAlign = "left";
  ctx.textBaseline = "top";
  ctx.shadowColor = "rgba(0,0,0,0.25)";
  ctx.shadowBlur = 0;
  ctx.shadowOffsetX = 3;
  ctx.shadowOffsetY = 4;
  ctx.fillText(emoji, x, y);
  ctx.restore();
}


