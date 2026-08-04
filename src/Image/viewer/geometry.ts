export interface Size {
  height: number;
  width: number;
}

export interface Point {
  x: number;
  y: number;
}

export interface Rect {
  height: number;
  width: number;
  x: number;
  y: number;
}

export type Rotation = 0 | 90 | 180 | 270;

export type ZoomPolicy = 'auto' | 'actual' | 'fit';

export interface TransformState {
  scale: number;
  x: number;
  y: number;
}

export interface AxisBounds {
  max: number;
  min: number;
}

export const VIEWPORT_MARGIN = 24;
export const MIN_SCALE = 1;
export const DEFAULT_MAX_SCALE = 8;
export const DEFAULT_RUBBER_BAND_FACTOR = 0.15;
export const WHEEL_ZOOM_SENSITIVITY = 0.002;
export const DEFAULT_AUTO_ZOOM_THRESHOLD = 2;
export const WHEEL_LINE_HEIGHT = 16;

export const normalizeRotation = (degrees: number): Rotation =>
  (((degrees % 360) + 360) % 360) as Rotation;

const effectiveSize = (natural: Size, rotate: Rotation): Size =>
  rotate === 90 || rotate === 270 ? { height: natural.width, width: natural.height } : natural;

export const computeFit = (
  natural: Size,
  viewport: Size,
  rotate: Rotation,
  fillViewport = false,
): Rect => {
  const effective = effectiveSize(natural, rotate);
  const availableWidth = Math.max(viewport.width - VIEWPORT_MARGIN * 2, 0);
  const availableHeight = Math.max(viewport.height - VIEWPORT_MARGIN * 2, 0);
  // fillViewport drops the no-upscale cap: a dual-source thumbnail is a
  // stand-in for the hi-res image, so it must open at the viewport fit the
  // hi-res will land in — otherwise the swap re-fits mid-open.
  const containScale = Math.min(
    availableWidth / effective.width,
    availableHeight / effective.height,
    ...(fillViewport ? [] : [1]),
  );
  const width = effective.width * containScale;
  const height = effective.height * containScale;

  return {
    height,
    width,
    x: (viewport.width - width) / 2,
    y: (viewport.height - height) / 2,
  };
};

// computeFit returns the box the image occupies *after* the CSS rotation, but
// the element it is applied to is sized before that rotation runs. For quarter
// turns the two disagree, so the element box has to be the transpose about the
// same center — otherwise `object-fit: contain` letterboxes the image down to
// the short side and everything downstream (pan bounds, natural scale) is
// measuring a box the viewer never actually paints.
export const unrotatedRect = (fit: Rect, rotate: Rotation): Rect => {
  if (rotate !== 90 && rotate !== 270) return fit;

  const centerX = fit.x + fit.width / 2;
  const centerY = fit.y + fit.height / 2;

  return {
    height: fit.width,
    width: fit.height,
    x: centerX - fit.height / 2,
    y: centerY - fit.width / 2,
  };
};

export const anchoredZoom = (
  current: TransformState,
  targetScale: number,
  anchor: Point,
  fitRect: Rect,
): TransformState => {
  const centerX = fitRect.x + fitRect.width / 2;
  const centerY = fitRect.y + fitRect.height / 2;
  const ratio = targetScale / current.scale;

  return {
    scale: targetScale,
    x: anchor.x - centerX - ratio * (anchor.x - centerX - current.x),
    y: anchor.y - centerY - ratio * (anchor.y - centerY - current.y),
  };
};

export const panBounds = (
  state: TransformState,
  fitRect: Rect,
  viewport: Size,
): { x: AxisBounds; y: AxisBounds } => {
  const centerX = fitRect.x + fitRect.width / 2;
  const centerY = fitRect.y + fitRect.height / 2;
  const scaledWidth = fitRect.width * state.scale;
  const scaledHeight = fitRect.height * state.scale;

  const axis = (center: number, scaledSize: number, viewportSize: number): AxisBounds => {
    const overflow = scaledSize - viewportSize;
    if (overflow <= 0) return { max: 0, min: 0 };
    return { max: scaledSize / 2 - center, min: viewportSize - center - scaledSize / 2 };
  };

  return {
    x: axis(centerX, scaledWidth, viewport.width),
    y: axis(centerY, scaledHeight, viewport.height),
  };
};

export const clampPan = (state: TransformState, fitRect: Rect, viewport: Size): Point => {
  const bounds = panBounds(state, fitRect, viewport);
  return {
    x: Math.min(Math.max(state.x, bounds.x.min), bounds.x.max),
    y: Math.min(Math.max(state.y, bounds.y.min), bounds.y.max),
  };
};

export const rubberBand = (
  value: number,
  min: number,
  max: number,
  factor: number = DEFAULT_RUBBER_BAND_FACTOR,
): number => {
  if (value < min) return min - (min - value) * factor;
  if (value > max) return max + (value - max) * factor;
  return value;
};

export const clampScale = (scale: number, maxScale: number = DEFAULT_MAX_SCALE): number =>
  Math.min(Math.max(scale, MIN_SCALE), maxScale);

export const wheelZoomFactor = (deltaY: number): number =>
  Math.exp(-deltaY * WHEEL_ZOOM_SENSITIVITY);

// Firefox on Windows/Linux reports wheel notches as DOM_DELTA_LINE with a
// deltaY around 3, where Chrome/Safari report ~100 pixels for the same notch.
// Feeding those raw into wheelZoomFactor is a ~30x under-zoom (0.6% per notch,
// ~115 notches to double) and an equally dead scroll-to-close accumulator.
export const normalizeWheelDelta = (deltaY: number, deltaMode = 0, viewportHeight = 0): number => {
  if (deltaMode === 1) return deltaY * WHEEL_LINE_HEIGHT;
  if (deltaMode === 2) return deltaY * (viewportHeight || WHEEL_LINE_HEIGHT * 40);
  return deltaY;
};

export const naturalScale = (natural: Size, fitRect: Rect, rotate: Rotation): number =>
  effectiveSize(natural, rotate).width / fitRect.width;

// The scale the viewer opens at, expressed like every other scale here:
// relative to the fit rect, so MIN_SCALE is always still fit. Opening above
// MIN_SCALE is what makes a screenshot legible on open and — because the image
// then overflows the viewport — what gives panBounds something to work with.
export const resolveInitialScale = (
  policy: ZoomPolicy,
  natural: Size,
  fitRect: Rect,
  rotate: Rotation,
  threshold: number = DEFAULT_AUTO_ZOOM_THRESHOLD,
): number => {
  if (policy === 'fit') return MIN_SCALE;

  const target = naturalScale(natural, fitRect, rotate);
  if (!Number.isFinite(target) || target <= 0) return MIN_SCALE;
  if (policy === 'auto' && target > threshold) return MIN_SCALE;

  // fillViewport drops computeFit's no-upscale cap, so the fit rect can be
  // larger than the image and target can land below the zoom floor.
  return Math.max(MIN_SCALE, target);
};

export const doubleClickTarget = (
  currentScale: number,
  natural: Size,
  fitRect: Rect,
  rotate: Rotation,
): number => {
  if (currentScale > 1) return MIN_SCALE;
  return Math.max(2, naturalScale(natural, fitRect, rotate));
};
