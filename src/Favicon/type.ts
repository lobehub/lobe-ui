import type { ReactNode, Ref } from 'react';

import type { SpanProps } from '@/types';

export interface FaviconProps extends Omit<SpanProps, 'children'> {
  /** Alternative text of the image. Empty by default, since a favicon is decoration next to a label. */
  alt?: string;
  /**
   * Shown when there is no usable host or the icon fails to load. Defaults to a globe.
   */
  fallback?: ReactNode;
  /**
   * Builds the icon URL from a host name. Defaults to the DuckDuckGo icon service; pass
   * your own to route requests through a proxy or another provider.
   */
  getIconUrl?: (host: string) => string;
  /** Host name of the site, e.g. `github.com`. Takes precedence over `url`. */
  host?: string;
  ref?: Ref<HTMLSpanElement>;
  /**
   * `square` rounds the corners slightly, `circle` clips to a disc.
   * @default 'square'
   */
  shape?: 'circle' | 'square';
  /**
   * Edge length in pixels.
   * @default 16
   */
  size?: number;
  /** Explicit icon URL. Skips the lookup by host. */
  src?: string;
  /** Any URL of the site; the host is derived from it. An invalid URL falls back quietly. */
  url?: string;
}
