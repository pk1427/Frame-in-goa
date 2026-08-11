import type { PfpInput } from "@/lib/types";
import { coverFit } from "@/lib/image/cover";
import { colors, layout } from "./theme";
import { imbueFamily, victorMonoFamily } from "./fonts";
import { drawCornerRibbon, drawStickerBadge, seededRotation } from "./motifs";
import { applyBrandDuotone } from "@/lib/image/duotone";

function drawArcText(
  ctx: CanvasRenderingContext2D,
  text: string,
  cx: number,
  cy: number,
  radius: number
): void {
  const chars = text.split("");
  ctx.font = `700 36px ${victorMonoFamily}`;
  ctx.fillStyle = colors.white;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  const totalWidth = chars.reduce(
    (sum, char) => sum + ctx.measureText(char).width,
    0
  );
  const totalAngle = totalWidth / radius;
  const startAngle = -Math.PI / 2 - totalAngle / 2;

  let angle = startAngle;
  for (const char of chars) {
    const charWidth = ctx.measureText(char).width;
    const charAngle = charWidth / radius;

    ctx.save();
    ctx.translate(
      cx + Math.cos(angle) * radius,
      cy + Math.sin(angle) * radius
    );
    ctx.rotate(angle + Math.PI / 2);
    ctx.fillText(char, 0, 0);
    ctx.restore();

    angle += charAngle;
  }
}

export function drawPfp(ctx: CanvasRenderingContext2D, input: PfpInput): void {
  const size = layout.pfpSize;
  const cx = size / 2;
  const cy = size / 2 - 40;

  ctx.clearRect(0, 0, size, size);

  ctx.fillStyle = colors.primary;
  ctx.fillRect(0, 0, size, size);

  const photoR = size * 0.3;
  ctx.save();
  ctx.beginPath();
  ctx.arc(cx, cy, photoR, 0, Math.PI * 2);
  ctx.clip();

  const cover = coverFit(
    input.image.naturalWidth,
    input.image.naturalHeight,
    photoR * 2,
    photoR * 2,
    input.offset
  );
  ctx.drawImage(
    input.image,
    cover.sx,
    cover.sy,
    cover.sw,
    cover.sh,
    cx - photoR,
    cy - photoR,
    photoR * 2,
    photoR * 2
  );
  ctx.restore();

  if (input.brandTint !== false) {
    applyBrandDuotone(ctx, Math.round(cx - photoR), Math.round(cy - photoR), Math.round(photoR * 2), Math.round(photoR * 2));
  }

  const outerR = photoR + 30;
  ctx.beginPath();
  ctx.arc(cx, cy, outerR, 0, Math.PI * 2);
  ctx.strokeStyle = colors.accent;
  ctx.lineWidth = 16;
  ctx.stroke();

  const pinkR = outerR + 40;
  ctx.beginPath();
  ctx.arc(cx, cy, pinkR, 0, Math.PI * 2);
  ctx.strokeStyle = colors.pink;
  ctx.lineWidth = 8;
  ctx.setLineDash([20, 15]);
  ctx.stroke();
  ctx.setLineDash([]);

  drawArcText(ctx, "HH GOA 2026 · OPEN TRIALS", cx, cy, pinkR + 50);

  ctx.font = `700 56px ${imbueFamily}`;
  ctx.fillStyle = colors.accent;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("#FrameInGoa", cx, size - 100);

  drawStickerBadge(ctx, "🌴", cx + pinkR - 10, cy - pinkR - 20, 72);

  ctx.font = `700 28px ${victorMonoFamily}`;
  ctx.fillStyle = colors.accent;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  const seed = `${input.image.naturalWidth}-${input.image.naturalHeight}-${input.offset.x}-${input.offset.y}`;
  const idRotation = seededRotation(seed, 2);
  const idLabelX = cx - pinkR + 30;
  const idLabelY = cy + pinkR - 20;
  ctx.save();
  ctx.translate(idLabelX, idLabelY);
  ctx.rotate(idRotation);
  ctx.fillText("ID CARD", 0, 0);
  ctx.restore();

  drawCornerRibbon(ctx, "HH GOA 2026");
}
