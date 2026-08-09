export type Mode = "pfp" | "card" | "combined";

export type LayoutMode = "grid-2" | "grid-3" | "grid-4";

export interface PhotoSlot {
  id: string;
  image: HTMLImageElement;
  offset: { x: number; y: number };
}

export interface PfpInput {
  mode: "pfp";
  image: HTMLImageElement;
  offset: { x: number; y: number };
}

export interface CardInput {
  mode: "card";
  image: HTMLImageElement;
  offset: { x: number; y: number };
  name: string;
  stack: string;
  builderClass: string;
}

export interface CombinedFrameInput {
  mode: "combined";
  photos: PhotoSlot[];
  layout: LayoutMode;
  name?: string;
}

export type FrameInput = PfpInput | CardInput | CombinedFrameInput;
