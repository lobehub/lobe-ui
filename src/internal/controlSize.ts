export const controlHeight = {
  large: 40,
  middle: 32,
  small: 24,
} as const;

export type ControlSize = keyof typeof controlHeight;
