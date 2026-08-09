"use client";

import { useCallback } from "react";

interface DropZoneProps {
  onFileSelected: (file: File) => void;
  disabled?: boolean;
  multiple?: boolean;
  onFilesSelected?: (files: File[]) => void;
}

function collectImageFiles(fileList: FileList | File[]): File[] {
  return Array.from(fileList).filter((f) => f.type.startsWith("image/"));
}

export function DropZone({
  onFileSelected,
  disabled,
  multiple = false,
  onFilesSelected,
}: DropZoneProps) {
  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      if (disabled) return;
      const files = collectImageFiles(e.dataTransfer.files);
      if (files.length === 0) return;
      if (multiple && onFilesSelected) {
        onFilesSelected(files);
      } else {
        files.forEach((f) => onFileSelected(f));
      }
    },
    [onFileSelected, disabled, multiple, onFilesSelected]
  );

  const handleDragOver = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
    },
    []
  );

  const handleClick = useCallback(() => {
    if (disabled) return;
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*,.heic,.heif";
    input.multiple = multiple;
    input.onchange = () => {
      const files = input.files;
      if (!files) return;
      const imageFiles = collectImageFiles(files);
      if (imageFiles.length === 0) return;
      if (multiple && onFilesSelected) {
        onFilesSelected(imageFiles);
      } else {
        imageFiles.forEach((f) => onFileSelected(f));
      }
    };
    input.click();
  }, [onFileSelected, disabled, multiple, onFilesSelected]);

  return (
    <div
      onClick={handleClick}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      className={`w-full rounded-xl border-2 border-dashed p-8 text-center cursor-pointer transition-colors ${
        disabled
          ? "opacity-50 cursor-not-allowed border-foreground/20"
          : "border-coral hover:border-lagoon hover:bg-sand/10"
      }`}
    >
      <p className="font-display text-lg text-ink">
        {multiple
          ? "Drop multiple photos here or tap to upload"
          : "Drop a photo here or tap to upload"}
      </p>
      <p className="font-mono text-xs text-ink/60 mt-2">
        {multiple ? "Upload multiple photos" : "JPG, PNG, HEIC"}
      </p>
    </div>
  );
}
