import { layout } from "./theme";

export interface PhotoCell {
  x: number;
  y: number;
  w: number;
  h: number;
}

export const GRID_PADDING = 80;
export const GRID_GAP = 40;
export const FOOTER_RESERVE = 200;
export const MAX_PHOTOS = 4;

export function getPhotoCells(count: number): PhotoCell[] {
  const W = layout.cardWidth;
  const H = layout.cardHeight;

  const gridTop = GRID_PADDING;
  const gridBottom = H - GRID_PADDING - FOOTER_RESERVE;

  if (count <= 0) return [];

  if (count === 1) {
    return [
      {
        x: GRID_PADDING,
        y: gridTop,
        w: W - GRID_PADDING * 2,
        h: gridBottom - gridTop,
      },
    ];
  }

  if (count === 2) {
    const availW = W - GRID_PADDING * 2 - GRID_GAP;
    const cellW = availW / 2;
    const cellH = gridBottom - gridTop;
    return [
      { x: GRID_PADDING, y: gridTop, w: cellW, h: cellH },
      {
        x: GRID_PADDING + cellW + GRID_GAP,
        y: gridTop,
        w: cellW,
        h: cellH,
      },
    ];
  }

  if (count === 3) {
    const availW = W - GRID_PADDING * 2 - GRID_GAP;
    const cellW = availW / 2;
    const rowH = (gridBottom - gridTop - GRID_GAP) / 2;
    return [
      { x: GRID_PADDING, y: gridTop, w: cellW, h: rowH },
      {
        x: GRID_PADDING + cellW + GRID_GAP,
        y: gridTop,
        w: cellW,
        h: rowH,
      },
      {
        x: GRID_PADDING,
        y: gridTop + rowH + GRID_GAP,
        w: availW,
        h: rowH,
      },
    ];
  }

  const cols = 2;
  const rows = 2;
  const availW = W - GRID_PADDING * 2 - GRID_GAP * (cols - 1);
  const availH = gridBottom - gridTop - GRID_GAP * (rows - 1);
  const cellW = availW / cols;
  const cellH = availH / rows;

  const cells: PhotoCell[] = [];
  for (let i = 0; i < Math.min(count, MAX_PHOTOS); i++) {
    const col = i % cols;
    const row = Math.floor(i / cols);
    cells.push({
      x: GRID_PADDING + col * (cellW + GRID_GAP),
      y: gridTop + row * (cellH + GRID_GAP),
      w: cellW,
      h: cellH,
    });
  }
  return cells;
}

export function getGridBounds(): { top: number; bottom: number } {
  return {
    top: GRID_PADDING,
    bottom: layout.cardHeight - GRID_PADDING - FOOTER_RESERVE,
  };
}
