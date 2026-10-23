import { isValidElement, type ReactNode } from 'react';

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
 * Default palette of the generated fallback: charcoal, violet, cream, yellow and orange.
 * A charcoal anchor and a cream highlight give every variant contrast, a warm yellow / orange
 * pair keeps it lively, and violet adds one cool accent. It is a fixed palette on purpose:
 * the same name keeps the same avatar in light and dark mode. `boring-avatars` writes these into
 * SVG attributes, so they must be concrete colors rather than CSS variables.
 */
export const AVATAR_FALLBACK_COLORS: string[] = [
  '#383838',
  '#7858f9',
  '#f8f7bf',
  '#ffdd1f',
  '#f88c13',
];

/**
 * Stable seed for the generated fallback: `title`, then `alt`, then a string `avatar`
 * (a name / initials, or the URL of an image that failed to load).
 *
 * `boring-avatars` embeds the name in SVG ids (`url(#gradient_..._<name>)` for `sunset`), so
 * whitespace and URL-breaking characters are normalized to `_`; otherwise names such as
 * `"Arvin Xu"` would produce an invalid paint reference and an empty avatar.
 */
export const getAvatarFallbackSeed = (
  avatar: ReactNode,
  title?: string,
  alt?: string,
): string | undefined => {
  const seed = title || alt || (typeof avatar === 'string' && avatar) || undefined;
  return seed?.trim().replaceAll(/[\s"'()#\\]+/g, '_') || undefined;
};
