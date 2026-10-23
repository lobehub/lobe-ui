import { isValidElement, type ReactNode } from 'react';

import type { LobeTheme } from '@/styles/theme/scope';

import type { AvatarGeneratedFallbackVariant } from './type';

export const isDefaultAntAvatar = (avatar: ReactNode): boolean => {
  if (!avatar) return false;

  const isStringAvatar = typeof avatar === 'string';
  const isUrlOrDataUri =
    isStringAvatar && ['/', 'http', 'data:'].some((prefix) => avatar.startsWith(prefix));

  return Boolean(isUrlOrDataUri || isValidElement(avatar));
};

export const hasValidBackground = (background?: string | null): boolean => {
  return Boolean(
    background &&
    background !== 'transparent' &&
    background !== 'rgba(0,0,0,0)' &&
    background !== null,
  );
};

export const formatAvatarText = (text: string | undefined, sliceText: boolean): string => {
  if (!text) return '';

  const upperText = text.toUpperCase();
  return sliceText ? upperText.slice(0, 2) : upperText;
};

export const calculateEmojiSize = (
  size: number,
  hasBackground: boolean,
  emojiScaleWithBackground: boolean,
): number => {
  if (emojiScaleWithBackground) {
    return hasBackground ? size * 0.85 : size;
  }
  return size * 0.85;
};

export const AVATAR_GENERATED_FALLBACK_VARIANTS: readonly AvatarGeneratedFallbackVariant[] = [
  'marble',
  'beam',
  'pixel',
  'sunset',
  'ring',
  'bauhaus',
];

/**
 * Resolves the generated-fallback palette from theme tokens. `boring-avatars` writes the colors
 * into SVG attributes and derives contrast from them, so they must be concrete values rather
 * than CSS variables. Step 7 of each scale is a mid tone in both appearances, so the palette
 * stays soft in light mode and keeps enough depth in dark mode.
 */
export const getAvatarFallbackColors = (theme: LobeTheme): string[] => [
  theme.geekblue7,
  theme.purple7,
  theme.magenta7,
  theme.gold7,
  theme.cyan7,
];

/**
 * Stable seed for the generated fallback: `title`, then `alt`, then a string `avatar`
 * (e.g. the URL of an image that failed to load).
 */
export const getAvatarFallbackSeed = (
  avatar: ReactNode,
  title?: string,
  alt?: string,
): string | undefined => title || alt || (typeof avatar === 'string' && avatar) || undefined;
