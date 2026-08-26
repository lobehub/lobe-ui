export const safeReadableColor = (bgColor: string): string =>
  `oklch(from ${bgColor} clamp(0, (l - 0.62) * -1000, 1) 0 h / 1)`;
