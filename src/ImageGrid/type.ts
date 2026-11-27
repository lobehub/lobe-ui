import type { CSSProperties, HTMLAttributes, Ref } from 'react';

import type { ImagePreviewOptions } from '@/Image';

export interface ImageGridItem {
  /** Shown under the image. */
  caption?: string;
  /** What the image shows (its alt text). */
  description?: string;
  /** Opens this URL in a new tab instead of the image viewer. */
  href?: string;
  url: string;
}

export interface ImageGridClassNames {
  caption?: string;
  image?: string;
  item?: string;
  root?: string;
}

export interface ImageGridStyles {
  caption?: CSSProperties;
  image?: CSSProperties;
  item?: CSSProperties;
  root?: CSSProperties;
}

export type ImageGridLayout = 'grid' | 'bento';

export type ImageGridVariant = 'default' | 'a2ui';

export interface ImageGridProps extends HTMLAttributes<HTMLDivElement> {
  /** Aspect ratio of each image (the bento lead image fills its 2×2 area). @default '1 / 1' */
  aspectRatio?: string;
  classNames?: ImageGridClassNames;
  /** @default 3 */
  columns?: number;
  /** Gap in 4px steps (a number) or any CSS length. @default 2 */
  gap?: number | string;
  images: ImageGridItem[];
  /** `bento` makes the first image twice as large. @default 'grid' */
  layout?: ImageGridLayout;
  /**
   * Click to open the lobe-ui image viewer with the other images a swipe away; `false` turns it
   * off. Images with `href` open their link instead.
   * @default true
   */
  preview?: boolean | ImagePreviewOptions;
  ref?: Ref<HTMLDivElement>;
  styles?: ImageGridStyles;
  /**
   * `default`: lobe-ui image tiles (filled, hairline border, theme radius).
   * `a2ui`: the CopilotKit Gen UI standard image grid (flat images, 8px radius, 12px captions).
   * @default 'default'
   */
  variant?: ImageGridVariant;
}
