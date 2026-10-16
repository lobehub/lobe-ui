import type { VideoState } from './type';

// Room for the widest control row (frame stepping, captions, speed, fullscreen),
// so a portrait recording capped by maxHeight never pushes controls out of view.
export const MIN_PLAYER_WIDTH = 480;

export const aspectOf = (size: VideoState['size']) =>
  size?.height ? size.width / size.height : 16 / 9;

export const frameWidthOf = (maxHeight: number, aspect: number) => Math.round(maxHeight * aspect);

export const playerWidthOf = (maxHeight: number, aspect: number) =>
  Math.max(MIN_PLAYER_WIDTH, frameWidthOf(maxHeight, aspect));
