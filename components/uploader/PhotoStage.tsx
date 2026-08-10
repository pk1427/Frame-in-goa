"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import { coverFit, type CoverResult } from "@/lib/image/cover";

interface PhotoStageProps {
  image: HTMLImageElement;
  boxSize: number;
  offset: { x: number; y: number };
  onOffsetChange: (offset: { x: number; y: number }) => void;
}

export function PhotoStage({
  image,
  boxSize,
  offset,
  onOffsetChange,
}: PhotoStageProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [dragging, setDragging] = useState(false);
  const lastPointer = useRef<{ x: number; y: number } | null>(null);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const result: CoverResult = coverFit(
      image.naturalWidth,
      image.naturalHeight,
      boxSize,
      boxSize,
      offset
    );

    ctx.clearRect(0, 0, boxSize, boxSize);
    ctx.drawImage(
      image,
      result.sx,
      result.sy,
      result.sw,
      result.sh,
      0,
      0,
      boxSize,
      boxSize
    );
  }, [image, boxSize, offset]);

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
      e.currentTarget.setPointerCapture(e.pointerId);
      setDragging(true);
      lastPointer.current = getPointerPos(e);
    },
    [getPointerPos]
  );

  const handlePointerMove = useCallback(
    (e: React.PointerEvent<HTMLCanvasElement>) => {
      if (!dragging || !lastPointer.current) return;
      const pos = getPointerPos(e);
      const dx = pos.x - lastPointer.current.x;
      const dy = pos.y - lastPointer.current.y;
      lastPointer.current = pos;
      onOffsetChange({ x: offset.x + dx, y: offset.y + dy });
    },
    [dragging, offset, onOffsetChange, getPointerPos]
  );

  const handlePointerUp = useCallback(
    (e: React.PointerEvent<HTMLCanvasElement>) => {
      e.currentTarget.releasePointerCapture(e.pointerId);
      setDragging(false);
      lastPointer.current = null;
    },
    []
  );

  return (
    <div
      ref={wrapperRef}
      className="w-full max-w-[360px] aspect-square"
    >
      <canvas
        ref={canvasRef}
        width={boxSize}
        height={boxSize}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        className={`w-full h-full touch-none rounded-lg border-2 border-sand ${
          dragging ? "cursor-grabbing" : "cursor-grab"
        }`}
      />
    </div>
  );
}
