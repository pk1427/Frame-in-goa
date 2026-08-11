"use client";

import { useLayoutEffect, useEffect, useRef } from "react";
import { drawPfp } from "@/lib/render/drawPfp";
import { drawCard } from "@/lib/render/drawCard";
import { drawCombined } from "@/lib/render/drawCombined";
import type { PfpInput, CardInput, CombinedFrameInput, PhotoSlot, LayoutMode } from "@/lib/types";
import { layout } from "@/lib/render/theme";
import { drawQrOnCanvas } from "@/lib/render/qr";

interface BuilderCanvasProps {
  mode: "pfp" | "card" | "combined";
  image?: HTMLImageElement;
  offset?: { x: number; y: number };
  photos?: PhotoSlot[];
  layoutMode?: LayoutMode;
  canvasRef?: (node: HTMLCanvasElement | null) => void;
  name?: string;
  stack?: string;
  builderClass?: string;
  shareId?: string | null;
  brandTint?: boolean;
}

export function BuilderCanvas({
  mode,
  image,
  offset = { x: 0, y: 0 },
  photos,
  layoutMode = "grid-2",
  canvasRef,
  name = "",
  stack = "",
  builderClass = "",
  shareId,
  brandTint = true,
}: BuilderCanvasProps) {
  const localRef = useRef<HTMLCanvasElement>(null);

  const setRef = (node: HTMLCanvasElement | null) => {
    localRef.current = node;
    if (!canvasRef) return;
    if (typeof canvasRef === "function") {
      canvasRef(node);
    }
  };

  useLayoutEffect(() => {
    const canvas = localRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    if (mode === "combined" && photos && photos.length > 0) {
      canvas.width = layout.cardWidth;
      canvas.height = layout.cardHeight;
      const input: CombinedFrameInput = {
        mode: "combined",
        photos,
        layout: layoutMode,
        brandTint,
      };
      drawCombined(ctx, input);
      return;
    }

    if (mode === "pfp" && image) {
      canvas.width = layout.pfpSize;
      canvas.height = layout.pfpSize;
      const input: PfpInput = {
        mode: "pfp",
        image,
        offset,
        brandTint,
      };
      drawPfp(ctx, input);
    } else if (mode === "card" && image) {
      canvas.width = layout.cardWidth;
      canvas.height = layout.cardHeight;
      const input: CardInput = {
        mode: "card",
        image,
        offset,
        name,
        stack,
        builderClass,
        brandTint,
      };
      drawCard(ctx, input);
    }
  }, [mode, image, offset, photos, layoutMode, name, stack, builderClass, shareId, brandTint]);

  useEffect(() => {
    if (!shareId) return;
    const canvas = localRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const url = `${window.location.origin}/s/${shareId}`;
    drawQrOnCanvas(ctx, url, photos?.length || 0, mode).catch((err: unknown) =>
      console.error("[FrameInGoa] QR generation error:", err)
    );
  }, [shareId, mode, photos]);

  return (
    <div className="w-full max-w-[360px] mx-auto overflow-hidden rounded-lg border-2 border-sand aspect-[4/5]">
      <canvas
        ref={setRef}
        width={layout.cardWidth}
        height={layout.cardHeight}
        className="block w-full h-full transform-none"
      />
    </div>
  );
}
