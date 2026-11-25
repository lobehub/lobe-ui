import type { VideoState } from './type';

// Room for the widest control row (frame stepping, captions, speed, fullscreen),
// so a portrait recording capped by maxHeight never pushes controls out of view.
export const MIN_PLAYER_WIDTH = 480;

export const aspectOf = (size: VideoState['size']) =>
  size?.height ? size.width / size.height : 16 / 9;

// Hover thumbnail box. The frame is fitted inside it, so a portrait recording
// keeps its own shape instead of being squashed into a 16:9 preview.
export const PREVIEW_WIDTH = 176;
export const PREVIEW_HEIGHT = 99;

export const previewSizeOf = (size: VideoState['size']) => {
  if (!size?.width || !size?.height) return { height: PREVIEW_HEIGHT, width: PREVIEW_WIDTH };
  const scale = Math.min(PREVIEW_WIDTH / size.width, PREVIEW_HEIGHT / size.height);
  return {
    height: Math.max(1, Math.round(size.height * scale)),
    width: Math.max(1, Math.round(size.width * scale)),
  };
};

export const frameWidthOf = (maxHeight: number, aspect: number) => Math.round(maxHeight * aspect);

export const playerWidthOf = (maxHeight: number, aspect: number) =>
  Math.max(MIN_PLAYER_WIDTH, frameWidthOf(maxHeight, aspect));
