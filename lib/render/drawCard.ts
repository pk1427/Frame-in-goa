import type { CardInput } from "@/lib/types";
import { coverFit } from "@/lib/image/cover";
import { colors, layout, radii } from "./theme";
import { frauncesFamily, spaceMonoFamily } from "./fonts";

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

  ctx.fillStyle = colors.cream;
  ctx.fillRect(0, 0, W, H);

  const margin = 48;
  roundRect(ctx, margin, margin, W - margin * 2, H - margin * 2, radii.card);
  ctx.fillStyle = colors.ink;
  ctx.fill();

  const innerMargin = 64;
  roundRect(
    ctx,
    innerMargin,
    innerMargin,
    W - innerMargin * 2,
    H - innerMargin * 2,
    radii.card - 8
  );
  ctx.fillStyle = colors.cream;
  ctx.fill();

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

  roundRect(ctx, photoX, photoY, photoSize, photoSize, radii.card);
  ctx.strokeStyle = colors.coral;
  ctx.lineWidth = 8;
  ctx.stroke();

  ctx.font = `700 64px ${frauncesFamily}`;
  ctx.fillStyle = colors.ink;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(input.name || "Your Name", W / 2, photoY + photoSize + 60);

  ctx.font = `400 36px ${spaceMonoFamily}`;
  ctx.fillStyle = colors.coral;
  ctx.fillText(input.stack || "Stack / Role", W / 2, photoY + photoSize + 115);

  const stampCx = W / 2;
  const stampCy = H - 280;
  const outerR = layout.stampOuter / 2;
  const innerR = layout.stampInner / 2;

  ctx.beginPath();
  ctx.arc(stampCx, stampCy, outerR, 0, Math.PI * 2);
  ctx.strokeStyle = colors.lagoon;
  ctx.lineWidth = 8;
  ctx.setLineDash([20, 15]);
  ctx.stroke();
  ctx.setLineDash([]);

  ctx.font = `700 40px ${spaceMonoFamily}`;
  ctx.fillStyle = colors.ink;
  const text = input.builderClass || "Builder Class";
  const maxWidth = innerR * 1.8;
  const lines = wrapText(ctx, text, maxWidth);

  const lineHeight = 52;
  const startY = stampCy - ((lines.length - 1) * lineHeight) / 2;
  lines.forEach((line, i) => {
    ctx.fillText(line, stampCx, startY + i * lineHeight);
  });

  ctx.font = `700 36px ${frauncesFamily}`;
  ctx.fillStyle = colors.coral;
  ctx.fillText("#FrameInGoa", W / 2, H - 60);
}
