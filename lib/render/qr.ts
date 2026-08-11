import QRCode from "qrcode";
import { colors, layout } from "./theme";
import { getPhotoCells, GRID_PADDING, FOOTER_RESERVE } from "./grid";
import type { Mode } from "@/lib/types";

export const QR_SIZE = 120;

export function getQrPosition(
  url: string,
  photoCount: number,
  mode: Mode
): { x: number; y: number; size: number } | null {
  if (mode === "combined") {
    const cells = getPhotoCells(photoCount);
    const gridBottom = Math.max(...cells.map((c) => c.y + c.h));
    const footerY = gridBottom + GRID_PADDING;
    return {
      x: layout.cardWidth - GRID_PADDING - QR_SIZE - 40,
      y: footerY + (FOOTER_RESERVE - QR_SIZE) / 2,
      size: QR_SIZE,
    };
  }

  if (mode === "card") {
    const innerMargin = 64;
    const footerTop = layout.cardHeight - 320;
    const footerHeight = 280;
    return {
      x: layout.cardWidth - innerMargin - QR_SIZE - 40,
      y: footerTop + (footerHeight - QR_SIZE) / 2,
      size: QR_SIZE,
    };
  }

  return null;
}

export async function drawQrOnCanvas(
  ctx: CanvasRenderingContext2D,
  url: string,
  photoCount: number,
  mode: Mode
): Promise<void> {
  const pos = getQrPosition(url, photoCount, mode);
  if (!pos) return;

  const dataUrl = await QRCode.toDataURL(url, {
    width: pos.size,
    margin: 1,
    color: {
      dark: colors.ink,
      light: colors.offwhite,
    },
  });

  return new Promise<void>((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      ctx.drawImage(img, pos.x, pos.y, pos.size, pos.size);
      resolve();
    };
    img.onerror = reject;
    img.src = dataUrl;
  });
}
