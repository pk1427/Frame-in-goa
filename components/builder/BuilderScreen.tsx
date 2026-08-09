"use client";

import { useState, useCallback, useMemo } from "react";
import { DropZone } from "@/components/uploader/DropZone";
import { PhotoStage } from "@/components/uploader/PhotoStage";
import { CollageStage } from "@/components/uploader/CollageStage";
import { BuilderCanvas } from "@/components/generator/BuilderCanvas";
import { ActionBar } from "@/components/generator/ActionBar";
import { CardForm } from "@/components/generator/CardForm";
import { PreviewPulse } from "@/components/builder/PreviewPulse";
import { BootSequence } from "@/components/builder/BootSequence";
import { loadImage, loadImages, ImageLoadError } from "@/lib/image/loadImage";
import { pickRandom } from "@/lib/render/builderClasses";
import type { PhotoSlot, LayoutMode } from "@/lib/types";

interface BuilderScreenProps {
  mode: "pfp" | "card" | "combined";
}

export function BuilderScreen({ mode }: BuilderScreenProps) {
  const [image, setImage] = useState<HTMLImageElement | null>(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [photos, setPhotos] = useState<PhotoSlot[]>([]);
  const [layoutMode, setLayoutMode] = useState<LayoutMode>("grid-2");
  const [error, setError] = useState<string | null>(null);
  const [canvasEl, setCanvasEl] = useState<HTMLCanvasElement | null>(null);
  const [name, setName] = useState("");
  const [stack, setStack] = useState("");
  const [builderClass, setBuilderClass] = useState(() => pickRandom());
  const [bootComplete, setBootComplete] = useState(false);

  const handleFileSelected = useCallback(async (file: File) => {
    setError(null);
    try {
      const img = await loadImage(file);
      setImage(img);
      setOffset({ x: 0, y: 0 });
    } catch (err) {
      if (err instanceof ImageLoadError) {
        setError(err.message);
      } else {
        setError("Something went wrong. Please try another image.");
      }
      setImage(null);
    }
  }, []);

  const handleFilesSelected = useCallback(async (files: File[]) => {
    setError(null);
    try {
      const imgs = await loadImages(files);
      const slots: PhotoSlot[] = imgs.map((img, index) => ({
        id: `photo-${index}-${Date.now()}`,
        image: img,
        offset: { x: 0, y: 0 },
      }));
      setPhotos(slots);
    } catch (err) {
      if (err instanceof ImageLoadError) {
        setError(err.message);
      } else {
        setError("Something went wrong. Please try another image.");
      }
      setPhotos([]);
    }
  }, []);

  const handlePhotoOffsetChange = useCallback(
    (id: string, newOffset: { x: number; y: number }) => {
      setPhotos((prev) =>
        prev.map((p) => (p.id === id ? { ...p, offset: newOffset } : p))
      );
    },
    []
  );

  const handleReset = useCallback(() => {
    setImage(null);
    setOffset({ x: 0, y: 0 });
    setPhotos([]);
    setLayoutMode("grid-2");
    setError(null);
    setCanvasEl(null);
    setName("");
    setStack("");
    setBuilderClass(pickRandom());
  }, []);

  const isCombined = mode === "combined";

  const subtitle = isCombined
    ? "Upload 2–4 photos to build a team frame"
    : "Upload your photo to get started";

  const hasMedia = image || photos.length > 0;

  const previewUpdateKey = useMemo(() => {
    return `${image ? "1" : "0"}-${offset.x}-${offset.y}-${photos.length}-${photos.map(p => `${p.id}-${p.offset.x}-${p.offset.y}`).join(",")}-${layoutMode}-${name}-${stack}-${builderClass}`;
  }, [image, offset, photos, layoutMode, name, stack, builderClass]);

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <main className="w-full max-w-4xl flex flex-col items-center gap-6">
        <h1 className="font-display text-3xl md:text-4xl text-ink text-center">
          Frame In Goa
        </h1>
        <p className="font-sans text-foreground/70 text-center">{subtitle}</p>

        {error && (
          <div className="w-full p-4 rounded-lg bg-coral/10 border border-coral text-coral text-center">
            {error}
          </div>
        )}

        {!hasMedia ? (
          <DropZone
            onFileSelected={handleFileSelected}
            disabled={!!error}
            multiple={isCombined}
            onFilesSelected={isCombined ? handleFilesSelected : undefined}
          />
        ) : (
          /* Mobile: preview above controls (order-1 / order-2).
             Desktop: controls left, preview right (lg:order-1 / lg:order-2).
             This reversal is deliberate — seeing the result first reads better on phones. */
          <div className="flex flex-col lg:flex-row gap-6 w-full items-start">
            <div className="w-full lg:w-2/5 order-2 lg:order-1 flex flex-col gap-4">
              {isCombined ? (
                <CollageStage
                  photos={photos}
                  onOffsetChange={handlePhotoOffsetChange}
                />
              ) : (
                <PhotoStage
                  image={image!}
                  boxSize={360}
                  offset={offset}
                  onOffsetChange={setOffset}
                />
              )}
              {mode === "card" && (
                <CardForm
                  name={name}
                  stack={stack}
                  builderClass={builderClass}
                  onNameChange={setName}
                  onStackChange={setStack}
                  onBuilderClassChange={setBuilderClass}
                />
              )}
            </div>
            <div className="w-full lg:w-3/5 order-1 lg:order-2 flex flex-col gap-4 lg:sticky lg:top-4">
              {!bootComplete && hasMedia ? (
                <BootSequence onComplete={() => setBootComplete(true)} />
              ) : (
                <PreviewPulse updateKey={previewUpdateKey}>
                  <BuilderCanvas
                    mode={mode}
                    image={image ?? undefined}
                    offset={offset}
                    photos={photos}
                    layoutMode={layoutMode}
                    canvasRef={setCanvasEl}
                    name={name}
                    stack={stack}
                    builderClass={builderClass}
                  />
                </PreviewPulse>
              )}
              <div className="flex flex-col gap-3">
                <ActionBar
                  canvas={canvasEl}
                  mode={mode}
                  name={name}
                  stack={stack}
                  builderClass={builderClass}
                  image={image}
                  photos={photos}
                />
                <button
                  onClick={handleReset}
                  className="font-mono text-sm text-lagoon hover:text-coral transition-colors"
                >
                  Choose a different photo
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
