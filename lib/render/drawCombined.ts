import type { CombinedFrameInput } from "@/lib/types";
import { coverFit } from "@/lib/image/cover";
import { colors, layout, radii } from "./theme";
import { frauncesFamily } from "./fonts";

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
  ctx.fillStyle = colors.cream;
  ctx.fillRect(0, 0, W, H);

  const padding = 80;
  const gap = 40;
  const footerReserve = 140;
  const cols = photos.length <= 2 ? photos.length : 2;
  const rows = Math.ceil(photos.length / cols);

  const availW = W - padding * 2 - gap * (cols - 1);
  const availH = H - padding * 2 - gap * (rows - 1) - footerReserve;
  const cellW = availW / cols;
  const cellH = availH / rows;

  for (let i = 0; i < photos.length; i++) {
    const photo = photos[i];
    const col = i % cols;
    const row = Math.floor(i / cols);
    const x = padding + col * (cellW + gap);
    const y = padding + row * (cellH + gap);

    roundRect(ctx, x, y, cellW, cellH, radii.card);
    ctx.save();
    ctx.clip();

    const cover = coverFit(
      photo.image.naturalWidth,
      photo.image.naturalHeight,
      cellW,
      cellH,
      photo.offset
    );
    ctx.drawImage(
      photo.image,
      cover.sx,
      cover.sy,
      cover.sw,
      cover.sh,
      x,
      y,
      cellW,
      cellH
    );
    ctx.restore();

    roundRect(ctx, x, y, cellW, cellH, radii.card);
    ctx.strokeStyle = colors.coral;
    ctx.lineWidth = 8;
    ctx.stroke();
  }

  ctx.font = `700 36px ${frauncesFamily}`;
  ctx.fillStyle = colors.coral;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("#FrameInGoa", W / 2, H - 60);
}
