import type { CSSProperties } from 'react';

/**
 * Smooth Corners utility using Base64 SVG mask
 * A simpler alternative to CSS Houdini Paint API
 */

/**
 * Generate a smooth corners SVG path using superellipse formula
 * @param size - The size of the shape
 * @param n - The superellipse exponent (4 = squircle, 5 = iOS style)
 */
const generateSuperellipsePath = (size: number, n: number = 4): string => {
  const r = size / 2;
  const points: string[] = [];

  // Generate points for the superellipse
  for (let i = 0; i <= 360; i += 2) {
    const angle = (i * Math.PI) / 180;
    const cosAngle = Math.cos(angle);
    const sinAngle = Math.sin(angle);

    // Superellipse formula
    const x = r * Math.sign(cosAngle) * Math.pow(Math.abs(cosAngle), 2 / n);
    const y = r * Math.sign(sinAngle) * Math.pow(Math.abs(sinAngle), 2 / n);

    points.push(`${r + x},${r + y}`);
  }

  return `M${points[0]}L${points.slice(1).join('L')}Z`;
};

/**
 * Create a Base64 encoded SVG mask for smooth corners
 * @param options - Configuration options
 */
export const createSmoothCornersMask = (
  options: {
    cornerValue?: number;
    size?: number;
  } = {},
): string => {
  const { size = 100, cornerValue = 4 } = options;

  const path = generateSuperellipsePath(size, cornerValue);

  const svg = `
    <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
      <path d="${path}" fill="white"/>
    </svg>
  `
    .trim()
    .replaceAll(/\s+/g, ' ');

  return `data:image/svg+xml;base64,${btoa(svg)}`;
};

/**
 * Create a Base64 encoded SVG mask for circle shape
 * @param options - Configuration options
 */
export const createCircleMask = (
  options: {
    size?: number;
  } = {},
): string => {
  const { size = 100 } = options;
  const r = size / 2;

  const svg = `
    <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
      <circle cx="${r}" cy="${r}" r="${r}" fill="white"/>
    </svg>
  `
    .trim()
    .replaceAll(/\s+/g, ' ');

  return `data:image/svg+xml;base64,${btoa(svg)}`;
};

/**
 * Create a Base64 encoded SVG mask for rounded rectangle
 * @param options - Configuration options
 */
export const createRoundedRectMask = (
  options: {
    borderRadius?: number;
    size?: number;
  } = {},
): string => {
  const { size = 100, borderRadius = 15 } = options;

  const svg = `
    <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
      <rect x="0" y="0" width="${size}" height="${size}" rx="${borderRadius}" ry="${borderRadius}" fill="white"/>
    </svg>
  `
    .trim()
    .replaceAll(/\s+/g, ' ');

  return `data:image/svg+xml;base64,${btoa(svg)}`;
};

/**
 * Predefined smooth corners masks for common corner values
 */
export const SMOOTH_CORNER_MASKS = {
  // Basic shapes
  circle: createCircleMask(),
  // Superellipse shapes
  ios: createSmoothCornersMask({ cornerValue: 5 }),

  sharp: createSmoothCornersMask({ cornerValue: 6 }),
  smooth: createSmoothCornersMask({ cornerValue: 3 }),
  square: createRoundedRectMask({ borderRadius: 15 }),
  squircle: createSmoothCornersMask({ cornerValue: 4 }),
} as const;

/**
 * CSS helper to apply smooth corners mask
 */
export const getSmoothCornersMaskStyle = (
  cornerType: keyof typeof SMOOTH_CORNER_MASKS = 'squircle',
): CSSProperties => {
  return {
    // WebKit prefix for better browser support
    WebkitMaskImage: `url("${SMOOTH_CORNER_MASKS[cornerType]}")`,

    WebkitMaskPosition: 'center',

    WebkitMaskRepeat: 'no-repeat',

    WebkitMaskSize: '100% 100%',

    maskImage: `url("${SMOOTH_CORNER_MASKS[cornerType]}")`,
    maskPosition: 'center',
    maskRepeat: 'no-repeat',
    maskSize: '100% 100%',
  } as CSSProperties;
};
