"use client";

import { useState, useCallback } from "react";
import { loadImage, ImageLoadError } from "@/lib/image/loadImage";
import { downscaleToJpeg } from "@/lib/image/downscale";

interface JoinFlowProps {
  id: string;
  slotsTotal: number;
  onJoined: () => void;
}

export function JoinFlow({ id, slotsTotal, onJoined }: JoinFlowProps) {
  const [joining, setJoining] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [filledSlots, setFilledSlots] = useState(1);

  const handleFileSelected = useCallback(async (file: File) => {
    setJoining(true);
    setError(null);
    setSuccess(false);
    try {
      const img = await loadImage(file);
      const photoDataUrl = downscaleToJpeg(img, 600);
      const res = await fetch(`/api/share/${id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ photoDataUrl }),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(`Failed to join: ${text}`);
      }

      const json = await res.json();
      setFilledSlots(json.slotsFilled ?? filledSlots + 1);
      if (json.status === "complete") {
        setSuccess(true);
        setTimeout(onJoined, 1500);
      } else {
        setSuccess(true);
      }
    } catch (err) {
      if (err instanceof ImageLoadError) {
        setError(err.message);
      } else {
        setError(err instanceof Error ? err.message : "Something went wrong.");
      }
    } finally {
      setJoining(false);
    }
  }, [id, onJoined, filledSlots]);

  return (
    <div className="w-full max-w-md flex flex-col items-center gap-6">
      <h2 className="font-display text-2xl text-white text-center">
        ADD YOUR PHOTO
      </h2>
      <p className="font-mono text-sm text-white/70 text-center">
        This team frame is still open. Upload your photo to join the squad.
      </p>

      {!success && (
        <p className="font-mono text-xs text-accent/80 text-center">
          {filledSlots}/{slotsTotal} SLOTS FILLED
        </p>
      )}

      {error && (
        <div className="w-full p-4 rounded-lg bg-pink/10 border border-pink text-pink text-center">
          {error}
        </div>
      )}

      {success ? (
        <div className="w-full p-4 rounded-lg bg-accent/10 border border-accent text-accent text-center font-mono text-sm">
          PHOTO ADDED — CHECK BACK FOR THE UPDATED FRAME
        </div>
      ) : (
        <div className="w-full">
          <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-sand rounded-lg cursor-pointer hover:border-accent transition-colors">
            <span className="font-mono text-xs text-white/50 uppercase tracking-wider mb-2">
              UPLOAD PHOTO
            </span>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleFileSelected(file);
              }}
              disabled={joining}
            />
            {joining && (
              <span className="font-mono text-xs text-accent uppercase tracking-wider">
                UPLOADING...
              </span>
            )}
          </label>
        </div>
      )}
    </div>
  );
}
