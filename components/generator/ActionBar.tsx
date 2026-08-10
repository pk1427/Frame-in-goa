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
  onShareComplete?: (id: string) => void;
}

const CAPTION_TEXT = {
  pfp: "#FrameInGoa built my hh goa pfp frame 🏖️",
  card: "#FrameInGoa builder id locked in 🏖️",
  combined: "#FrameInGoa team frame shipped 🏖️",
};

function useCanExport(
  mode: Mode,
  image: HTMLImageElement | null,
  photos: PhotoSlot[] | undefined,
  canvas: HTMLCanvasElement | null
): boolean {
  if (!canvas) return false;
  if (mode === "combined") {
    return !!(photos && photos.length >= 1);
  }
  return !!image;
}

async function postWithRetry(
  url: string,
  options: RequestInit,
  maxRetries = 1
): Promise<Response> {
  let lastErr: unknown;
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const res = await fetch(url, options);
      if (res.ok) return res;
      if (attempt >= maxRetries) return res;
    } catch (err) {
      lastErr = err;
    }
    if (attempt < maxRetries) {
      await new Promise((r) => setTimeout(r, 500 * (attempt + 1)));
    }
  }
  if (lastErr) throw lastErr;
  throw new Error("Max retries exceeded");
}

export function ActionBar({
  canvas,
  mode,
  name,
  stack,
  builderClass,
  image,
  photos,
  onShareComplete,
}: ActionBarProps) {
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" | "info" } | null>(null);
  const sharingRef = useRef(false);

  const canExport = useCanExport(mode, image, photos, canvas);

  const buildBody = useCallback((): Record<string, unknown> | null => {
    const isCombined = mode === "combined";
    if (!isCombined && !image) return null;
    if (isCombined && (!photos || photos.length === 0)) return null;

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
    return body;
  }, [mode, name, stack, builderClass, image, photos]);

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

  const buildShareUrl = useCallback((id: string): string => {
    return `${window.location.origin}/s/${id}`;
  }, []);

  const buildTweetUrl = useCallback(
    (caption: string, shareUrl: string): string => {
      const encodedText = encodeURIComponent(caption);
      const encodedUrl = encodeURIComponent(shareUrl);
      return `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}&via=247pmstudio`;
    },
    []
  );

  const handlePostToX = useCallback(async () => {
    if (!canExport || sharingRef.current) return;
    sharingRef.current = true;
    setToast(null);

    try {
      const body = buildBody();
      if (!body) {
        throw new Error("Missing photo data — upload a photo first.");
      }

      const res = await postWithRetry("/api/share", {
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

      if (onShareComplete) {
        onShareComplete(id);
      }

      const shareUrl = buildShareUrl(id);
      const caption = CAPTION_TEXT[mode];

      if (!caption.includes("#FrameInGoa")) {
        setToast({
          message: "Caption missing #FrameInGoa — please include the hashtag",
          type: "error",
        });
        return;
      }

      const tweetUrl = buildTweetUrl(caption, shareUrl);

      const isMobile = /Mobi|Android/i.test(navigator.userAgent);
      const canUseWebShare =
        typeof navigator !== "undefined" &&
        navigator.canShare &&
        navigator.canShare({});

      if (isMobile && canUseWebShare) {
        const blob = await new Promise<Blob | null>((resolve) => {
          if (!canvas) {
            resolve(null);
            return;
          }
          canvas.toBlob(resolve, "image/png");
        });

        if (blob) {
          const file = new File([blob], "frame-in-goa.png", {
            type: "image/png",
          });

          if (navigator.canShare({ files: [file], text: caption, url: shareUrl })) {
            try {
              await navigator.share({
                files: [file],
                text: caption,
                url: shareUrl,
              });
              setToast({
                message: "Shared via system dialog",
                type: "success",
              });
              sharingRef.current = false;
              return;
            } catch (shareErr) {
              const isAbort =
                shareErr instanceof DOMException &&
                shareErr.name === "AbortError";
              if (!isAbort) {
                console.error("[FrameInGoa] navigator.share failed:", shareErr);
              }
            }
          }
        }
      }

      handleDownload();

      const win = window.open(tweetUrl, "_blank", "noopener,noreferrer");
      if (!win) {
        setToast({
          message: "Popup blocked — please allow popups for this site",
          type: "error",
        });
        return;
      }
      win.focus();

      setToast({
        message: "Downloaded — attach image in X and hit Tweet",
        type: "success",
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Something went wrong.";
      setToast({ message, type: "error" });
      console.error("[FrameInGoa] Share handler error:", err);
    } finally {
      sharingRef.current = false;
    }
  }, [
    canExport,
    mode,
    buildBody,
    onShareComplete,
    buildShareUrl,
    buildTweetUrl,
    handleDownload,
    canvas,
  ]);

  const handleMoreOptions = useCallback(async () => {
    if (!canExport || sharingRef.current) return;
    sharingRef.current = true;
    setToast(null);

    try {
      const body = buildBody();
      if (!body) {
        throw new Error("Missing photo data — upload a photo first.");
      }

      const res = await postWithRetry("/api/share", {
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

      if (onShareComplete) {
        onShareComplete(id);
      }

      const shareUrl = buildShareUrl(id);
      const caption = CAPTION_TEXT[mode];
      const tweetUrl = buildTweetUrl(caption, shareUrl);

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
          text: caption,
          url: shareUrl,
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
        window.open(tweetUrl, "_blank", "noopener,noreferrer");
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
  }, [
    canExport,
    mode,
    buildBody,
    onShareComplete,
    buildShareUrl,
    buildTweetUrl,
    handleDownload,
    canvas,
  ]);

  return (
    <div className="w-full flex flex-col gap-3">
      <button
        onClick={handlePostToX}
        disabled={!canExport}
        aria-disabled={!canExport}
        className="w-full py-3 px-4 rounded-lg bg-accent text-ink font-mono font-bold text-sm uppercase tracking-wider hover:bg-primary hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        SHIP TO X
      </button>
      <button
        onClick={handleMoreOptions}
        disabled={!canExport}
        aria-disabled={!canExport}
        className="w-full py-2 px-4 rounded-lg border-2 border-sand font-mono text-xs text-white uppercase tracking-wider hover:bg-sand/50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        MORE OPTIONS
      </button>
      <button
        onClick={handleDownload}
        disabled={!canExport}
        aria-disabled={!canExport}
        className="w-full py-2 px-4 rounded-lg border-2 border-sand font-mono text-xs text-white uppercase tracking-wider hover:bg-sand/50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        DOWNLOAD
      </button>
      {!canExport && (
        <p className="font-mono text-xs text-pink uppercase tracking-wider">
          UPLOAD A PHOTO FIRST
        </p>
      )}
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
