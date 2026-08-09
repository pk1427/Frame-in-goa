export interface CoverResult {
  sx: number;
  sy: number;
  sw: number;
  sh: number;
}

export function coverFit(
  imageWidth: number,
  imageHeight: number,
  boxWidth: number,
  boxHeight: number,
  offset: { x: number; y: number }
): CoverResult {
  const imageAspect = imageWidth / imageHeight;
  const boxAspect = boxWidth / boxHeight;

  let scale: number;
  if (imageAspect > boxAspect) {
    scale = boxHeight / imageHeight;
  } else {
    scale = boxWidth / imageWidth;
  }

  const scaledW = imageWidth * scale;
  const scaledH = imageHeight * scale;

  const overflowX = scaledW - boxWidth;
  const overflowY = scaledH - boxHeight;

  const maxOffsetX = overflowX / 2;
  const maxOffsetY = overflowY / 2;

  const clampedX = Math.max(-maxOffsetX, Math.min(maxOffsetX, offset.x));
  const clampedY = Math.max(-maxOffsetY, Math.min(maxOffsetY, offset.y));

  const sx = (clampedX + maxOffsetX) / scale;
  const sy = (clampedY + maxOffsetY) / scale;
  const sw = boxWidth / scale;
  const sh = boxHeight / scale;

  return { sx, sy, sw, sh };
}
