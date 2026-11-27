import type { HTMLAttributes } from 'react';

export type SkeletonAnimation = 'fade' | 'sweep';

export interface SkeletonBaseProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  animated?: boolean | SkeletonAnimation;
  height?: number | string;
  radius?: number | string;
  width?: number | string;
}

/** What an `a2ui` skeleton stands in for. */
export type SkeletonA2uiType = 'text' | 'card' | 'chart';

export interface SkeletonProps extends SkeletonBaseProps {
  /**
   * Number of text lines of `type="text"` (`variant="a2ui"`); the last one is 60% wide.
   * @default 3
   */
  lines?: number;
  /**
   * What the `a2ui` skeleton stands in for: `text` (lines), `card` (an avatar and three lines in a
   * card) or `chart` (bars in a card). Ignored by the default variant.
   * @default 'text'
   */
  type?: SkeletonA2uiType;
  /**
   * `default`: one block sized by `width` / `height` / `radius`.
   * `a2ui`: the A2UI playground skeleton, a pulsing text, card or chart placeholder (see `type`).
   * @default 'default'
   */
  variant?: 'default' | 'a2ui';
}

export interface SkeletonTextProps extends Omit<SkeletonBaseProps, 'width' | 'height'> {
  fontSize?: number;
  gap?: number;
  lineHeight?: number;
  rows?: number;
  width?: number | string | (number | string)[];
}

export interface SkeletonAvatarProps extends Omit<SkeletonBaseProps, 'radius'> {
  shape?: 'circle' | 'square';
  size?: number | string;
}
