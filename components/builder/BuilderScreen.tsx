"use client";

import { useState, useCallback, useMemo } from "react";
import { DropZone } from "@/components/uploader/DropZone";
import { PhotoStage } from "@/components/uploader/PhotoStage";
import { CollageStage } from "@/components/uploader/CollageStage";
import { BuilderCanvas } from "@/components/generator/BuilderCanvas";
import { ActionBar } from "@/components/generator/ActionBar";
import { CardForm } from "@/components/generator/CardForm";
import { VibeQuiz } from "@/components/builder/VibeQuiz";
import { PreviewPulse } from "@/components/builder/PreviewPulse";
import { BootSequence } from "@/components/builder/BootSequence";
import { loadImage, loadImages, ImageLoadError } from "@/lib/image/loadImage";
import { pickRandom, getClassFromQuizAnswers } from "@/lib/render/builderClasses";
import type { PhotoSlot, LayoutMode } from "@/lib/types";

interface BuilderScreenProps {
  mode: "pfp" | "card" | "combined";
}

export function BuilderScreen({ mode }: BuilderScreenProps) {
  const [image, setImage] = useState<HTMLImageElement | null>(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [photos, setPhotos] = useState<PhotoSlot[]>([]);
  const [layoutMode, setLayoutMode] = useState<LayoutMode>("grid-2");
  const [slotsTotal, setSlotsTotal] = useState(2);
  const [error, setError] = useState<string | null>(null);
  const [canvasEl, setCanvasEl] = useState<HTMLCanvasElement | null>(null);
  const [name, setName] = useState("");
  const [stack, setStack] = useState("");
  const [builderClass, setBuilderClass] = useState(() => pickRandom());
  const [bootComplete, setBootComplete] = useState(false);
  const [shareId, setShareId] = useState<string | null>(null);
  const [showQuiz, setShowQuiz] = useState(mode === "card");
  const [quizAnswers, setQuizAnswers] = useState<string[]>([]);
  const [brandTintEnabled, setBrandTintEnabled] = useState(true);

  const handleFileSelected = useCallback(async (file: File) => {
    setBootComplete(false);
    setShareId(null);
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
    setBootComplete(false);
    setShareId(null);
    setError(null);
    try {
       const imgs = await loadImages(files.slice(0, 4));
      const slots: PhotoSlot[] = imgs.map((img, index) => ({
        id: `photo-${index}-${Date.now()}`,
        image: img,
        offset: { x: 0, y: 0 },
        builderClass: pickRandom(),
      }));
      setPhotos(slots);
      setSlotsTotal(Math.max(2, slots.length));
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

  const handlePhotoClassChange = useCallback(
    (id: string, newClass: string) => {
      setPhotos((prev) =>
        prev.map((p) => (p.id === id ? { ...p, builderClass: newClass } : p))
      );
    },
    []
  );

  const handleReset = useCallback(() => {
    setImage(null);
    setOffset({ x: 0, y: 0 });
    setPhotos([]);
    setLayoutMode("grid-2");
    setSlotsTotal(2);
    setError(null);
    setCanvasEl(null);
    setName("");
    setStack("");
    setBuilderClass(pickRandom());
    setBootComplete(false);
    setShareId(null);
    setBrandTintEnabled(true);
    setShowQuiz(mode === "card");
    setQuizAnswers([]);
  }, [mode]);

  const isCombined = mode === "combined";

  const subtitle = isCombined
    ? "UPLOAD 2–4 PHOTOS TO BUILD YOUR TEAM FRAME"
    : "UPLOAD YOUR PHOTO TO GET STARTED";

  const hasMedia = image || photos.length > 0;

  const previewUpdateKey = useMemo(() => {
    const photoClasses = photos.map(p => `${p.id}-${p.builderClass || ""}`).join(",");
    return `${image ? "1" : "0"}-${offset.x}-${offset.y}-${photos.length}-${photos.map(p => `${p.id}-${p.offset.x}-${p.offset.y}`).join(",")}-${layoutMode}-${name}-${stack}-${builderClass}-${photoClasses}-${showQuiz}-${quizAnswers.join(",")}-${slotsTotal}`;
  }, [image, offset, photos, layoutMode, name, stack, builderClass, showQuiz, quizAnswers, slotsTotal]);

  return (
    <div className="min-h-screen bg-primary flex flex-col items-center justify-center p-4">
      <main className="w-full max-w-4xl flex flex-col items-center gap-6">
        <h1 className="font-display text-3xl md:text-4xl text-white text-center">
          FRAME IN GOA
        </h1>
        <p className="font-mono text-foreground/70 text-center uppercase tracking-wider text-xs">
          {subtitle}
        </p>

        {error && (
          <div className="w-full p-4 rounded-lg bg-accent/10 border border-accent text-accent text-center">
            {error}
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-6 w-full items-start">
          <div className="w-full lg:w-2/5 order-2 lg:order-1 flex flex-col gap-4">
              <div className="rounded-lg border-2 border-sand p-4">
                <p className="font-mono text-xs text-white/50 mb-3 uppercase tracking-wider">
                  UPLOAD
                </p>
                <DropZone
                  onFileSelected={handleFileSelected}
                  disabled={!!error}
                  multiple={isCombined}
                  onFilesSelected={isCombined ? handleFilesSelected : undefined}
                />
                <label className="flex items-center gap-3 mt-4 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={brandTintEnabled}
                    onChange={(e) => setBrandTintEnabled(e.target.checked)}
                    className="w-4 h-4 accent-accent"
                  />
                  <span className="font-mono text-xs text-white uppercase tracking-wider">
                    BRAND TINT
                  </span>
                </label>
              </div>
            {isCombined && photos.length > 0 && (
              <CollageStage
                photos={photos}
                onOffsetChange={handlePhotoOffsetChange}
              />
            )}
            {isCombined && photos.length > 0 && (
              <div className="flex flex-col gap-2">
                <p className="font-mono text-xs text-white/50 uppercase tracking-wider">
                  BUILDER CLASSES
                </p>
                {photos.map((photo) => (
                  <input
                    key={photo.id}
                    type="text"
                    value={photo.builderClass || ""}
                    onChange={(e) => handlePhotoClassChange(photo.id, e.target.value)}
                    placeholder="Builder class..."
                    className="w-full rounded-lg border-2 border-sand bg-offwhite px-3 py-2 text-sm text-ink focus:outline-none focus:border-accent"
                  />
                ))}
              </div>
            )}
            {isCombined && (
              <div className="flex flex-col gap-2">
                <p className="font-mono text-xs text-white/50 uppercase tracking-wider">
                  TOTAL SLOTS
                </p>
                <div className="flex gap-2">
                  {[2, 3, 4].map((n) => (
                    <button
                      key={n}
                      onClick={() => setSlotsTotal(n)}
                      className={`flex-1 py-2 rounded-lg border-2 font-mono text-sm uppercase tracking-wider transition-colors ${
                        slotsTotal === n
                          ? "bg-accent text-ink border-accent"
                          : "border-sand text-white hover:bg-sand/50"
                      }`}
                    >
                      {n}
                    </button>
                  ))}
                </div>
                {slotsTotal > photos.length && (
                  <p className="font-mono text-xs text-accent/80 text-center">
                    {photos.length}/{slotsTotal} SLOTS FILLED — SHARE LINK WITH YOUR TEAM
                  </p>
                )}
              </div>
            )}
            {!isCombined && image && (
              <PhotoStage
                image={image!}
                boxSize={360}
                offset={offset}
                onOffsetChange={setOffset}
              />
            )}
            {mode === "card" && !showQuiz && (
              <CardForm
                name={name}
                stack={stack}
                builderClass={builderClass}
                onNameChange={setName}
                onStackChange={setStack}
                onBuilderClassChange={setBuilderClass}
              />
            )}
            {mode === "card" && showQuiz && (
              <VibeQuiz
                onComplete={(answers) => {
                  setQuizAnswers(answers);
                  setBuilderClass(getClassFromQuizAnswers(answers));
                  setShowQuiz(false);
                }}
                onSkip={() => setShowQuiz(false)}
              />
            )}
            {mode === "card" && !showQuiz && quizAnswers.length > 0 && (
              <button
                onClick={() => setShowQuiz(true)}
                className="font-mono text-xs text-accent hover:text-white uppercase tracking-wider transition-colors"
              >
                RETAKE VIBE QUIZ
              </button>
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
                  shareId={shareId}
                  brandTint={brandTintEnabled}
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
                onShareComplete={setShareId}
                slotsTotal={isCombined ? slotsTotal : undefined}
              />
              <button
                onClick={handleReset}
                className="font-mono text-sm text-pink hover:text-accent uppercase tracking-wider transition-colors"
              >
                CHANGE PHOTO
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
