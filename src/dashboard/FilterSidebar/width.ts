const MIN_WIDTH = 200;
const MAX_WIDTH = 480;

export function clampSidebarWidth(width: number, fallback: number) {
  if (!Number.isFinite(width)) return fallback;
  return Math.min(MAX_WIDTH, Math.max(MIN_WIDTH, Math.round(width)));
}

export const sidebarWidth = {
  collapse: 80,
  max: MAX_WIDTH,
  min: MIN_WIDTH,
  narrow: 264,
  wide: 300,
};
