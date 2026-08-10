"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import { coverFit, type CoverResult } from "@/lib/image/cover";
import type { PhotoSlot } from "@/lib/types";
import { layout, colors, radii } from "@/lib/render/theme";
import { getPhotoCells } from "@/lib/render/grid";

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
  ctx.lineTo(x + r, y);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

function hitTest(
  px: number,
  py: number,
  cells: ReturnType<typeof getPhotoCells>
): number | null {
  for (let i = 0; i < cells.length; i++) {
    const rect = cells[i];
    if (
      px >= rect.x &&
      px <= rect.x + rect.w &&
      py >= rect.y &&
      py <= rect.y + rect.h
    ) {
      return i;
    }
  }
  return null;
}

interface CollageStageProps {
  photos: PhotoSlot[];
  onOffsetChange: (id: string, offset: { x: number; y: number }) => void;
}

export function CollageStage({ photos, onOffsetChange }: CollageStageProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const lastPointer = useRef<{ x: number; y: number } | null>(null);

  const cells = getPhotoCells(photos.length);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const W = layout.cardWidth;
    const H = layout.cardHeight;

    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = colors.primary;
    ctx.fillRect(0, 0, W, H);

    for (let i = 0; i < photos.length; i++) {
      const photo = photos[i];
      const rect = cells[i];

      roundRect(ctx, rect.x, rect.y, rect.w, rect.h, radii.card);
      ctx.save();
      ctx.clip();

      const cover: CoverResult = coverFit(
        photo.image.naturalWidth,
        photo.image.naturalHeight,
        rect.w,
        rect.h,
        photo.offset
      );
      ctx.drawImage(
        photo.image,
        cover.sx,
        cover.sy,
        cover.sw,
        cover.sh,
        rect.x,
        rect.y,
        rect.w,
        rect.h
      );
      ctx.restore();

      roundRect(ctx, rect.x, rect.y, rect.w, rect.h, radii.card);
      ctx.strokeStyle = colors.accent;
      ctx.lineWidth = 8;
      ctx.stroke();

      if (i === hoveredIndex && draggingId !== photo.id) {
        roundRect(ctx, rect.x, rect.y, rect.w, rect.h, radii.card);
        ctx.strokeStyle = colors.accent;
        ctx.lineWidth = 12;
        ctx.stroke();
      }
    }
  }, [photos, cells, hoveredIndex, draggingId]);

  useEffect(() => {
    draw();
  }, [draw]);

  const getPointerPos = useCallback(
    (e: React.PointerEvent<HTMLCanvasElement>) => {
      const canvas = canvasRef.current;
      const wrapper = wrapperRef.current;
      if (!canvas || !wrapper) return { x: 0, y: 0 };

      const rect = wrapper.getBoundingClientRect();
      const scaleX = canvas.width / rect.width;
      const scaleY = canvas.height / rect.height;

      return {
        x: (e.clientX - rect.left) * scaleX,
        y: (e.clientY - rect.top) * scaleY,
      };
    },
    []
  );

  const handlePointerDown = useCallback(
    (e: React.PointerEvent<HTMLCanvasElement>) => {
      const pos = getPointerPos(e);
      const hitIndex = hitTest(pos.x, pos.y, cells);
      if (hitIndex !== null) {
        e.currentTarget.setPointerCapture(e.pointerId);
        setDraggingId(photos[hitIndex].id);
        lastPointer.current = pos;
      }
    },
    [getPointerPos, photos, cells]
  );

  const handlePointerMove = useCallback(
    (e: React.PointerEvent<HTMLCanvasElement>) => {
      const pos = getPointerPos(e);

      if (!draggingId) {
        const hitIndex = hitTest(pos.x, pos.y, cells);
        setHoveredIndex(hitIndex);
        return;
      }

      if (!lastPointer.current) return;
      const dx = pos.x - lastPointer.current.x;
      const dy = pos.y - lastPointer.current.y;
      lastPointer.current = pos;

      const photo = photos.find((p) => p.id === draggingId);
      if (photo) {
        onOffsetChange(photo.id, {
          x: photo.offset.x + dx,
          y: photo.offset.y + dy,
        });
      }
    },
    [draggingId, photos, cells, getPointerPos, onOffsetChange]
  );

  const handlePointerUp = useCallback(
    (e: React.PointerEvent<HTMLCanvasElement>) => {
      e.currentTarget.releasePointerCapture(e.pointerId);
      setDraggingId(null);
      lastPointer.current = null;
    },
    []
  );

  return (
    <div
      ref={wrapperRef}
      className="w-full max-w-[360px] overflow-hidden"
      style={{ aspectRatio: `${layout.cardWidth} / ${layout.cardHeight}` }}
    >
      <canvas
        ref={canvasRef}
        width={layout.cardWidth}
        height={layout.cardHeight}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        className={`block w-full h-full touch-none rounded-lg border-2 border-sand ${
          draggingId ? "cursor-grabbing" : "cursor-grab"
        }`}
      />
    </div>
  );
}
