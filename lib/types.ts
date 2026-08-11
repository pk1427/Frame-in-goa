export type Mode = "pfp" | "card" | "combined";

export type LayoutMode = "grid-2" | "grid-3" | "grid-4";

export interface PhotoSlot {
  id: string;
  image: HTMLImageElement;
  offset: { x: number; y: number };
  builderClass?: string;
}

export interface PfpInput {
  mode: "pfp";
  image: HTMLImageElement;
  offset: { x: number; y: number };
  brandTint?: boolean;
}

export interface CardInput {
  mode: "card";
  image: HTMLImageElement;
  offset: { x: number; y: number };
  name: string;
  stack: string;
  builderClass: string;
  brandTint?: boolean;
}

export interface CombinedFrameInput {
  mode: "combined";
  photos: PhotoSlot[];
  layout: LayoutMode;
  name?: string;
  brandTint?: boolean;
}

export type FrameInput = PfpInput | CardInput | CombinedFrameInput;
