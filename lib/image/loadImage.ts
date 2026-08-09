export class ImageLoadError extends Error {
  constructor(
    message: string,
    public readonly code: "decode" | "unsupported" | "invalid"
  ) {
    super(message);
    this.name = "ImageLoadError";
  }
}

export async function loadImage(
  file: File,
  maxLongEdge = 2000
): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();

    const cleanup = () => {
      URL.revokeObjectURL(url);
    };

    img.onload = () => {
      cleanup();

      const { naturalWidth, naturalHeight } = img;
      if (naturalWidth === 0 || naturalHeight === 0) {
        reject(
          new ImageLoadError(
            "This image appears to be empty or corrupted.",
            "invalid"
          )
        );
        return;
      }

      const longEdge = Math.max(naturalWidth, naturalHeight);
      if (longEdge <= maxLongEdge) {
        resolve(img);
        return;
      }

      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        reject(
          new ImageLoadError(
            "Canvas is not available in this environment.",
            "decode"
          )
        );
        return;
      }

      const scale = maxLongEdge / longEdge;
      canvas.width = Math.round(naturalWidth * scale);
      canvas.height = Math.round(naturalHeight * scale);

      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      const dataUrl = canvas.toDataURL("image/jpeg", 0.92);
      const downscaled = new Image();
      downscaled.onload = () => resolve(downscaled);
      downscaled.onerror = () => {
        reject(
          new ImageLoadError("Failed to process this image.", "decode")
        );
      };
      downscaled.src = dataUrl;
    };

    img.onerror = () => {
      cleanup();
      const isHeic =
        file.type === "image/heic" ||
        file.type === "image/heif" ||
        file.name.toLowerCase().endsWith(".heic") ||
        file.name.toLowerCase().endsWith(".heif");

      if (isHeic) {
        reject(
          new ImageLoadError(
            "This browser can't open HEIC files. Try Photos > Export as JPEG or PNG.",
            "unsupported"
          )
        );
      } else {
        reject(
          new ImageLoadError("Failed to decode this image.", "decode")
        );
      }
    };

    img.src = url;
  });
}

export async function loadImages(
  files: FileList | File[],
  maxLongEdge = 2000
): Promise<HTMLImageElement[]> {
  return Promise.all(Array.from(files).map((file) => loadImage(file, maxLongEdge)));
}
