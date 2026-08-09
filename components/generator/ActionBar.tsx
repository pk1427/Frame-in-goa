"use client";

import { useCallback, useRef, useState } from "react";
import type { Mode } from "@/lib/types";
import type { PhotoSlot } from "@/lib/types";
import { downscaleToJpeg } from "@/lib/image/downscale";
import { Toast } from "@/components/ui/Toast";

interface ActionBarProps {
  canvas: HTMLCanvasElement | null;
  mode: Mode;
  name: string;
  stack: string;
  builderClass: string;
  image: HTMLImageElement | null;
  photos?: PhotoSlot[];
}

const CAPTIONS = {
  pfp: "Built my HH Goa PFP 🌴 #FrameInGoa",
  card: "Built my HH Goa Builder ID 🌴 Can't wait to build with everyone. #FrameInGoa",
  combined: "Built our HH Goa Team Frame 🌴 #FrameInGoa",
};

export function ActionBar({
  canvas,
  mode,
  name,
  stack,
  builderClass,
  image,
  photos,
}: ActionBarProps) {
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" | "info" } | null>(null);
  const sharingRef = useRef(false);

  const handleDownload = useCallback(() => {
    if (!canvas) return;
    canvas.toBlob(
      (blob) => {
        if (!blob) return;
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "frame-in-goa.png";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      },
      "image/png"
    );
  }, [canvas]);

  const handlePostToX = useCallback(async () => {
    if ((!image && mode !== "combined") || sharingRef.current) return;
    if (mode === "combined" && (!photos || photos.length === 0)) return;
    sharingRef.current = true;
    setToast(null);

    const win = window.open("", "_blank");
    if (!win) {
      setToast({ message: "Popup blocked — please allow popups for this site", type: "error" });
      sharingRef.current = false;
      return;
    }

    try {
      const isCombined = mode === "combined";
      const photoDataUrl = isCombined
        ? photos![0].image
        : image!;
      const photoDataUrls = isCombined
        ? photos!.map((p) => downscaleToJpeg(p.image, 600))
        : undefined;

      const body: Record<string, unknown> = {
        mode,
        name,
        stack,
        builderClass,
      };
      if (isCombined) {
        body.photoDataUrls = photoDataUrls;
      } else {
        body.photoDataUrl = downscaleToJpeg(photoDataUrl, 600);
      }

      const res = await fetch("/api/share", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(`Share API responded ${res.status}: ${text}`);
      }

      const json = await res.json();
      const id = json.id as string | undefined;
      if (!id) {
        throw new Error(`Share API response missing id: ${JSON.stringify(json)}`);
      }

      const shareUrl = `${window.location.origin}/s/${id}`;
      const fullCaption = `${CAPTIONS[mode]} ${shareUrl}`;

      win.location.href = `https://twitter.com/intent/tweet?text=${encodeURIComponent(fullCaption)}`;

      setToast({
        message: "Opened X — your post is ready, just hit Tweet",
        type: "success",
      });
    } catch (err) {
      if (win && !win.closed) {
        win.close();
      }
      const message = err instanceof Error ? err.message : "Something went wrong.";
      setToast({ message, type: "error" });
      console.error("[FrameInGoa] Share handler error:", err);
    } finally {
      sharingRef.current = false;
    }
  }, [mode, name, stack, builderClass, image, photos]);

  const handleMoreOptions = useCallback(async () => {
    if ((!image && mode !== "combined") || sharingRef.current) return;
    if (mode === "combined" && (!photos || photos.length === 0)) return;
    sharingRef.current = true;
    setToast(null);

    try {
      const isCombined = mode === "combined";
      const body: Record<string, unknown> = {
        mode,
        name,
        stack,
        builderClass,
      };
      if (isCombined) {
        body.photoDataUrls = photos!.map((p) => downscaleToJpeg(p.image, 600));
      } else {
        body.photoDataUrl = downscaleToJpeg(image!, 600);
      }

      const res = await fetch("/api/share", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(`Share API responded ${res.status}: ${text}`);
      }

      const json = await res.json();
      const id = json.id as string | undefined;
      if (!id) {
        throw new Error(`Share API response missing id: ${JSON.stringify(json)}`);
      }

      const shareUrl = `${window.location.origin}/s/${id}`;
      const fullCaption = `${CAPTIONS[mode]} ${shareUrl}`;

      const blob = await new Promise<Blob | null>((resolve) => {
        if (!canvas) {
          resolve(null);
          return;
        }
        canvas.toBlob(resolve, "image/png");
      });

      let usedNativeShare = false;
      if (blob && typeof navigator !== "undefined" && navigator.canShare) {
        const file = new File([blob], "frame-in-goa.png", {
          type: "image/png",
        });
        const shareData = {
          title: "Frame In Goa",
          text: fullCaption,
          files: [file],
        };

        if (navigator.canShare(shareData)) {
          try {
            await navigator.share(shareData);
            usedNativeShare = true;
          } catch (shareErr) {
            const isAbort =
              shareErr instanceof DOMException &&
              shareErr.name === "AbortError";
            if (isAbort) {
              usedNativeShare = true;
            } else {
              console.error("[FrameInGoa] navigator.share failed, falling back to tweet intent:", shareErr);
            }
          }
        }
      }

      if (!usedNativeShare) {
        handleDownload();
        window.open(
          `https://twitter.com/intent/tweet?text=${encodeURIComponent(fullCaption)}`,
          "_blank",
          "noopener,noreferrer"
        );
      }

      setToast({
        message: "Opened X — your post is ready, just hit Tweet",
        type: "success",
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Something went wrong.";
      setToast({ message, type: "error" });
      console.error("[FrameInGoa] Share handler error:", err);
    } finally {
      sharingRef.current = false;
    }
  }, [canvas, mode, name, stack, builderClass, image, photos, handleDownload]);

  return (
    <div className="w-full flex flex-col gap-3">
      <button
        onClick={handlePostToX}
        disabled={!canvas || (!image && mode !== "combined") || (mode === "combined" && (!photos || photos.length === 0))}
        className="w-full py-3 px-4 rounded-lg bg-coral text-cream font-mono font-bold text-sm hover:bg-ink transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Post to X
      </button>
      <button
        onClick={handleMoreOptions}
        disabled={!canvas || (!image && mode !== "combined") || (mode === "combined" && (!photos || photos.length === 0))}
        className="w-full py-2 px-4 rounded-lg border border-sand text-ink font-mono text-xs hover:bg-sand/50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        More share options
      </button>
      <button
        onClick={handleDownload}
        disabled={!canvas}
        className="w-full py-2 px-4 rounded-lg border border-sand text-ink font-mono text-xs hover:bg-sand/50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Download PNG
      </button>
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onDismiss={() => setToast(null)}
        />
      )}
    </div>
  );
}
