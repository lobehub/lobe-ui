import type { ComponentProps, CSSProperties, ReactNode, Ref } from 'react';

import type { FlexboxProps } from '@/Flex';

export interface AvatarClassNames {
  content?: string;
  img?: string;
  loading?: string;
  root?: string;
}

export interface AvatarStyles {
  content?: CSSProperties;
  img?: CSSProperties;
  loading?: CSSProperties;
  root?: CSSProperties;
}

export interface AvatarProps extends ComponentProps<'div'> {
  /**
   * Alias for the native `alt` attribute of the rendered image
   */
  alt?: string;
  /**
   * Play the animated emoji variant instead of the static one
   */
  animation?: boolean;
  /**
   * Avatar content: an image URL, an emoji, or a custom React node
   */
  avatar?: string | ReactNode;
  /**
   * Background color, ignored when the avatar is an image or a custom node
   */
  background?: string;
  /**
   * Show the outer ring
   */
  bordered?: boolean;
  /**
   * Custom color for the outer ring
   */
  borderedColor?: string;
  /**
   * Custom class names for each part
   */
  classNames?: AvatarClassNames;
  /**
   * Native `crossOrigin` attribute forwarded to the rendered image
   */
  crossOrigin?: '' | 'anonymous' | 'use-credentials';
  /**
   * Native `draggable` attribute of the rendered image
   * @default false
   */
  draggable?: boolean;
  /**
   * Scale the emoji down when a background color is present
   * @default true
   */
  emojiScaleWithBackground?: boolean;
  /**
   * Show the full-size loading overlay
   */
  loading?: boolean;
  ref?: Ref<HTMLDivElement>;
  /**
   * Apply the lobe shadow style
   */
  shadow?: boolean;
  /**
   * @default 'square'
   */
  shape?: 'circle' | 'square';
  /**
   * Width and height in pixels
   * @default 48
   */
  size?: number;
  /**
   * Slice fallback text to its first two characters
   * @default true
   */
  sliceText?: boolean;
  /**
   * Custom styles for each part
   */
  styles?: AvatarStyles;
  /**
   * Fallback text when no avatar content resolves; also used as the default image alt text
   */
  title?: string;
  /**
   * Reserved for tooltip integration; not rendered yet
   */
  tooltipProps?: Record<string, unknown>;
  /**
   * Accepted for compatibility with next/image-based avatars; has no effect on the native img
   */
  unoptimized?: boolean;
  /**
   * Visual variant
   * @default 'borderless'
   */
  variant?: 'borderless' | 'filled' | 'outlined';
}

export interface AvatarGroupItemType extends Pick<
  AvatarProps,
  'avatar' | 'title' | 'alt' | 'onClick' | 'style' | 'className' | 'loading'
> {
  key: string;
}

export interface AvatarGroupProps
  extends
    Pick<
      AvatarProps,
      | 'variant'
      | 'bordered'
      | 'shadow'
      | 'size'
      | 'background'
      | 'animation'
      | 'draggable'
      | 'shape'
    >,
    Omit<FlexboxProps, 'children' | 'draggable' | 'onClick' | 'ref'> {
  classNames?: {
    avatar?: string;
    count?: string;
  };
  items: AvatarGroupItemType[];
  max?: number;
  onClick?: (props: { item: AvatarGroupItemType; key: string }) => void;
  ref?: Ref<HTMLDivElement>;
  styles?: {
    avatar?: CSSProperties;
    count?: CSSProperties;
  };
  zIndexReverse?: boolean;
}
