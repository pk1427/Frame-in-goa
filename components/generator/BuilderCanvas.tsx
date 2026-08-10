"use client";

import { useLayoutEffect, useEffect, useRef } from "react";
import { drawPfp } from "@/lib/render/drawPfp";
import { drawCard } from "@/lib/render/drawCard";
import { drawCombined } from "@/lib/render/drawCombined";
import type { PfpInput, CardInput, CombinedFrameInput, PhotoSlot, LayoutMode } from "@/lib/types";
import { layout, colors } from "@/lib/render/theme";
import QRCode from "qrcode";

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
  }, [mode, image, offset, photos, layoutMode, name, stack, builderClass, shareId]);

  useEffect(() => {
    if (!shareId) return;
    const canvas = localRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const url = `${window.location.origin}/s/${shareId}`;
    const qrSize = 120;
    let qrX = 0;
    let qrY = 0;

    if (mode === "card") {
      const W = layout.cardWidth;
      const H = layout.cardHeight;
      const innerMargin = 64;
      qrX = W - innerMargin - qrSize - 40;
      qrY = H - 320 + (280 - qrSize) / 2;
    } else if (mode === "combined") {
      const W = layout.cardWidth;
      const H = layout.cardHeight;
      const padding = 80;
      const footerReserve = 200;
      qrX = W - padding - qrSize - 40;
      qrY = H - footerReserve + (footerReserve - qrSize) / 2;
    }

    QRCode.toDataURL(url, {
      width: qrSize,
      margin: 1,
      color: {
        dark: colors.ink,
        light: colors.offwhite,
      },
    })
      .then((dataUrl: string) => {
        const img = new Image();
        img.onload = () => {
          ctx.drawImage(img, qrX, qrY, qrSize, qrSize);
        };
        img.src = dataUrl;
      })
      .catch((err: unknown) => console.error("[FrameInGoa] QR generation error:", err));
  }, [shareId, mode]);

  return (
    <canvas
      ref={setRef}
      className="block w-full max-w-[360px] h-auto transform-none mx-auto rounded-lg border-2 border-sand"
    />
  );
}
