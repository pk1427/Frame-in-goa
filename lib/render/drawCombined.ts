import type { CombinedFrameInput } from "@/lib/types";
import { coverFit } from "@/lib/image/cover";
import { colors, layout, radii } from "./theme";
import { imbueFamily, victorMonoFamily } from "./fonts";
import { drawCornerRibbon } from "./motifs";
import { getPhotoCells, GRID_PADDING } from "./grid";
import { applyBrandDuotone } from "@/lib/image/duotone";
import { computeTeamClass } from "./teamClass";

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

export function drawCombined(
  ctx: CanvasRenderingContext2D,
  input: CombinedFrameInput
): void {
  const W = layout.cardWidth;
  const H = layout.cardHeight;
  const photos = input.photos;

  ctx.clearRect(0, 0, W, H);

  ctx.fillStyle = colors.primary;
  ctx.fillRect(0, 0, W, H);

  const cells = getPhotoCells(photos.length);

  for (let i = 0; i < photos.length; i++) {
    const photo = photos[i];
    const cell = cells[i];

    roundRect(ctx, cell.x, cell.y, cell.w, cell.h, radii.card);
    ctx.save();
    ctx.clip();

    const cover = coverFit(
      photo.image.naturalWidth,
      photo.image.naturalHeight,
      cell.w,
      cell.h,
      photo.offset
    );
    ctx.drawImage(
      photo.image,
      cover.sx,
      cover.sy,
      cover.sw,
      cover.sh,
      cell.x,
      cell.y,
      cell.w,
      cell.h
    );
    ctx.restore();

    if (input.brandTint !== false) {
      applyBrandDuotone(ctx, Math.round(cell.x), Math.round(cell.y), Math.round(cell.w), Math.round(cell.h));
    }

    roundRect(ctx, cell.x, cell.y, cell.w, cell.h, radii.card);
    ctx.strokeStyle = colors.accent;
    ctx.lineWidth = 8;
    ctx.stroke();
  }

  const gridBottom = Math.max(...cells.map((c) => c.y + c.h));
  const footerY = gridBottom + GRID_PADDING;

  ctx.strokeStyle = colors.sand;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(GRID_PADDING + 20, footerY);
  ctx.lineTo(W - GRID_PADDING - 20, footerY);
  ctx.stroke();

  const teamClasses = photos.map((p) => p.builderClass || "").filter((c) => c.trim().length > 0);
  const teamInfo = computeTeamClass(teamClasses);

  ctx.font = `700 24px ${victorMonoFamily}`;
  ctx.fillStyle = colors.accent;
  ctx.textAlign = "left";
  ctx.textBaseline = "middle";
  ctx.fillText(`TEAM OF ${photos.length}`, GRID_PADDING + 40, footerY + 40);

  if (teamClasses.length > 0) {
    ctx.font = `700 28px ${imbueFamily}`;
    ctx.fillStyle = colors.accent;
    ctx.fillText(teamInfo.label, GRID_PADDING + 40, footerY + 75);

    ctx.font = `700 28px ${victorMonoFamily}`;
    ctx.fillStyle = colors.offwhite;
    ctx.fillText(`PWR ${teamInfo.power}`, GRID_PADDING + 40, footerY + 110);
  }

  ctx.font = `700 36px ${imbueFamily}`;
  ctx.fillStyle = colors.accent;
  ctx.textAlign = "center";
  ctx.fillText("#FrameInGoa", W / 2, footerY + 100);

  const qrSize = 120;
  const qrX = W - GRID_PADDING - qrSize - 40;
  const qrY = footerY + 40;

  ctx.strokeStyle = colors.sand;
  ctx.lineWidth = 2;
  ctx.strokeRect(qrX, qrY, qrSize, qrSize);

  ctx.font = `400 14px ${victorMonoFamily}`;
  ctx.fillStyle = colors.sand;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("QR AFTER SHARE", qrX + qrSize / 2, qrY + qrSize / 2);

  drawCornerRibbon(ctx, "HH GOA 2026");
}
