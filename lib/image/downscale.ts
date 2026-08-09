export function downscaleToJpeg(
  image: HTMLImageElement,
  maxLongEdge = 600
): string {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    throw new Error("Canvas is not available in this environment");
  }

  const { naturalWidth, naturalHeight } = image;
  const longEdge = Math.max(naturalWidth, naturalHeight);

  if (longEdge <= maxLongEdge) {
    canvas.width = naturalWidth;
    canvas.height = naturalHeight;
  } else {
    const scale = maxLongEdge / longEdge;
    canvas.width = Math.round(naturalWidth * scale);
    canvas.height = Math.round(naturalHeight * scale);
  }

  ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
  return canvas.toDataURL("image/jpeg", 0.85);
}
