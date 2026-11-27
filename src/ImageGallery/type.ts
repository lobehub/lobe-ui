import type { CSSProperties, HTMLAttributes, Ref } from 'react';

import type { ImagePreviewOptions } from '@/Image';

export interface ImageGalleryItem {
  /** Alt text; defaults to the caption. */
  alt?: string;
  /** Laid over the bottom of the image (`a2ui`) or under it (`default`). */
  caption?: string;
  url: string;
}

export interface ImageGalleryClassNames {
  caption?: string;
  item?: string;
  root?: string;
}

export interface ImageGalleryStyles {
  caption?: CSSProperties;
  item?: CSSProperties;
  root?: CSSProperties;
}

export type ImageGalleryVariant = 'default' | 'a2ui';

export interface ImageGalleryProps extends HTMLAttributes<HTMLDivElement> {
  classNames?: ImageGalleryClassNames;
  /** Columns, 2 to 4. @default 3 */
  columns?: number;
  images: ImageGalleryItem[];
  /**
   * Click to open the lobe-ui image viewer, with the other images of the gallery a swipe away;
   * `false` turns it off.
   * @default true
   */
  preview?: boolean | ImagePreviewOptions;
  ref?: Ref<HTMLDivElement>;
  styles?: ImageGalleryStyles;
  /**
   * `default`: lobe-ui image tiles with the caption below.
   * `a2ui`: the A2UI playground gallery (12px hairline tiles, captions on a dark fade, hover zoom).
   * @default 'default'
   */
  variant?: ImageGalleryVariant;
}
