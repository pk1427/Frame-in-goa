import type { CardInput } from "@/lib/types";
import { coverFit } from "@/lib/image/cover";
import { colors, layout, radii } from "./theme";
import { imbueFamily, victorMonoFamily } from "./fonts";
import { drawCornerRibbon, drawPinDot, seededRotation } from "./motifs";
import { applyBrandDuotone } from "@/lib/image/duotone";

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
): void {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number
): string[] {
  const words = text.split(" ");
  const lines: string[] = [];
  let currentLine = "";

  for (const word of words) {
    const testLine = currentLine ? `${currentLine} ${word}` : word;
    if (ctx.measureText(testLine).width > maxWidth && currentLine) {
      lines.push(currentLine);
      currentLine = word;
    } else {
      currentLine = testLine;
    }
  }

  if (currentLine) {
    lines.push(currentLine);
  }

  return lines;
}

export function drawCard(ctx: CanvasRenderingContext2D, input: CardInput): void {
  const W = layout.cardWidth;
  const H = layout.cardHeight;

  ctx.clearRect(0, 0, W, H);

  ctx.fillStyle = colors.primary;
  ctx.fillRect(0, 0, W, H);

  const margin = 48;
  roundRect(ctx, margin, margin, W - margin * 2, H - margin * 2, radii.card);
  ctx.fillStyle = colors.offwhite;
  ctx.fill();
  ctx.strokeStyle = colors.accent;
  ctx.lineWidth = 8;
  ctx.stroke();

  const innerMargin = 64;
  const photoSize = layout.photoBox;
  const photoX = (W - photoSize) / 2;
  const photoY = 100;
  roundRect(ctx, photoX, photoY, photoSize, photoSize, radii.card);
  ctx.save();
  ctx.clip();

  const cover = coverFit(
    input.image.naturalWidth,
    input.image.naturalHeight,
    photoSize,
    photoSize,
    input.offset
  );
  ctx.drawImage(
    input.image,
    cover.sx,
    cover.sy,
    cover.sw,
    cover.sh,
    photoX,
    photoY,
    photoSize,
    photoSize
  );
  ctx.restore();

  if (input.brandTint !== false) {
    applyBrandDuotone(ctx, Math.round(photoX), Math.round(photoY), photoSize, photoSize);
  }

  roundRect(ctx, photoX, photoY, photoSize, photoSize, radii.card);
  ctx.strokeStyle = colors.accent;
  ctx.lineWidth = 8;
  ctx.stroke();

  const nameY = photoY + photoSize + 80;
  ctx.font = `700 88px ${imbueFamily}`;
  ctx.fillStyle = colors.ink;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(input.name || "Your Name", W / 2, nameY);

  const stackLabelY = nameY + 70;
  ctx.font = `700 24px ${victorMonoFamily}`;
  ctx.fillStyle = colors.accent;
  ctx.fillText("STACK", W / 2, stackLabelY);

  const stackValueY = stackLabelY + 36;
  ctx.font = `400 28px ${victorMonoFamily}`;
  ctx.fillStyle = colors.ink;
  const stackText = input.stack || "Stack / Role";
  const stackLines = wrapText(ctx, stackText, W - innerMargin * 2 - 40);
  stackLines.forEach((line, i) => {
    ctx.fillText(line, W / 2, stackValueY + i * 36);
  });

  const footerTop = H - 320;
  const footerHeight = 280;

  ctx.strokeStyle = colors.sand;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(innerMargin + 20, footerTop);
  ctx.lineTo(W - innerMargin - 20, footerTop);
  ctx.stroke();

  const stampCx = innerMargin + 100;
  const stampCy = footerTop + footerHeight / 2;
  const outerR = 100;
  const innerR = 80;

  ctx.beginPath();
  ctx.arc(stampCx, stampCy, outerR, 0, Math.PI * 2);
  ctx.strokeStyle = colors.pink;
  ctx.lineWidth = 6;
  ctx.setLineDash([16, 12]);
  ctx.stroke();
  ctx.setLineDash([]);

  ctx.font = `700 28px ${victorMonoFamily}`;
  ctx.fillStyle = colors.ink;
  const builderText = input.builderClass || "Builder Class";
  const builderLines = wrapText(ctx, builderText, innerR * 1.6);
  const builderLineHeight = 36;
  const builderStartY = stampCy - ((builderLines.length - 1) * builderLineHeight) / 2;
  builderLines.forEach((line, i) => {
    ctx.fillText(line, stampCx, builderStartY + i * builderLineHeight);
  });

  const qrSize = 120;
  const qrX = W - innerMargin - qrSize - 40;
  const qrY = footerTop + (footerHeight - qrSize) / 2;

  ctx.strokeStyle = colors.sand;
  ctx.lineWidth = 2;
  ctx.strokeRect(qrX, qrY, qrSize, qrSize);

  ctx.font = `400 14px ${victorMonoFamily}`;
  ctx.fillStyle = colors.sand;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("QR AFTER SHARE", qrX + qrSize / 2, qrY + qrSize / 2);

  const pinRotation = seededRotation(input.builderClass, 2);
  ctx.save();
  ctx.translate(stampCx, stampCy - outerR - 4);
  ctx.rotate(pinRotation);
  drawPinDot(ctx, 0, 0, colors.pink);
  ctx.restore();

  drawCornerRibbon(ctx, "HH GOA 2026");
}
