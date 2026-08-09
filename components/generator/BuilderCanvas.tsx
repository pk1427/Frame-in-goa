"use client";

import { useEffect, useRef } from "react";
import { drawPfp } from "@/lib/render/drawPfp";
import { drawCard } from "@/lib/render/drawCard";
import { drawCombined } from "@/lib/render/drawCombined";
import type { PfpInput, CardInput, CombinedFrameInput, PhotoSlot, LayoutMode } from "@/lib/types";
import { layout } from "@/lib/render/theme";

interface BuilderCanvasProps {
  mode: "pfp" | "card" | "combined";
  image?: HTMLImageElement;
  offset?: { x: number; y: number };
  photos?: PhotoSlot[];
  layoutMode?: LayoutMode;
  canvasRef?: React.Ref<HTMLCanvasElement | null>;
  name?: string;
  stack?: string;
  builderClass?: string;
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
}: BuilderCanvasProps) {
  const localRef = useRef<HTMLCanvasElement>(null);

  const setRef = (node: HTMLCanvasElement | null) => {
    localRef.current = node;
    if (!canvasRef) return;
    if (typeof canvasRef === "function") {
      canvasRef(node);
    }
  };

  useEffect(() => {
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
      };
      drawCard(ctx, input);
    }
  }, [mode, image, offset, photos, layoutMode, name, stack, builderClass]);

  return (
    <canvas
      ref={setRef}
      className="w-full max-w-[360px] h-auto rounded-lg border border-sand"
    />
  );
}
