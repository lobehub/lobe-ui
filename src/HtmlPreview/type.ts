import type { CSSProperties, ReactNode, Ref } from 'react';

import type { ActionIconProps } from '@/ActionIcon';
import type { DivProps } from '@/types';

export type HtmlPreviewMode = 'preview' | 'source';

/**
 * How to handle the preview while content is still streaming (`animated`):
 *
 * - `'defer'` — keep the iframe unmounted until the content stabilizes
 *   (`</html>` arrives or `animated` flips to false). Safest for
 *   script-heavy demos (p5.js, three.js) where `setup()` must run exactly
 *   once.
 * - `'live'` — mount the iframe immediately and update `srcDoc` as tokens
 *   arrive. Feels responsive for pure-markup content but reboots scripts
 *   on every chunk.
 * - `'auto'` (default) — `defer` if a `<script>` tag is present, otherwise
 *   `live`.
 */
export type HtmlPreviewStreamingMode = 'defer' | 'live' | 'auto';

export interface HtmlPreviewIframeProps {
  /**
   * When `true` the iframe stays mounted as a "shell" and content arrives
   * via postMessage + DOM morph — used during streaming so we can fade
   * new nodes in without reloading. When `false` the iframe loads the
   * user's HTML directly as `srcDoc`, which lets the browser's native
   * HTML pipeline handle `<script src>` tags (Tailwind / Chart.js /
   * p5.js style CDN integrations work the way they would on a normal
   * page).
   */
  animated?: boolean;
  background?: string;
  className?: string;
  content: string;
  defaultHeight?: number;
  ref?: Ref<HTMLIFrameElement>;
  sandbox?: string;
  style?: CSSProperties;
  title?: string;
}

export interface HtmlPreviewProps extends Omit<DivProps, 'onCopy'> {
  actionIconSize?: ActionIconProps['size'];
  actionsRender?: (props: {
    actionIconSize: ActionIconProps['size'];
    content: string;
    getContent: () => string;
    mode: HtmlPreviewMode;
    originalNode: ReactNode;
    setMode: (mode: HtmlPreviewMode) => void;
  }) => ReactNode;
  /**
   * When `true`, the component treats the content as a still-streaming document
   * and only renders the source view. The iframe mounts once streaming ends
   * (either `animated` flips to `false` or `</html>` appears in the content).
   *
   * This avoids re-booting iframes (and the scripts inside them) on every
   * token.
   */
  animated?: boolean;
  bodyRender?: (props: {
    content: string;
    mode: HtmlPreviewMode;
    originalNode: ReactNode;
  }) => ReactNode;
  children: string;
  classNames?: {
    content?: string;
    header?: string;
    iframe?: string;
  };
  copyable?: boolean;
  /**
   * Accepted for API compatibility with the rest of the Pre family. Has no
   * effect — the body is always rendered.
   */
  defaultExpand?: boolean;
  defaultHeight?: number;
  defaultMode?: HtmlPreviewMode;
  downloadable?: boolean;
  fileName?: string;
  /**
   * Accepted for API compatibility with the rest of the Pre family. The
   * toolbar is always inline, so this flag is a no-op.
   */
  fullFeatured?: boolean;
  language?: string;
  /**
   * Fires when the user clicks the expand button. Receives the full HTML.
   * Hosts typically open a portal/drawer/modal here.
   */
  onExpand?: (content: string) => void;
  /**
   * Override the iframe's `sandbox` attribute. **Strongly discouraged** —
   * the default omits `allow-same-origin` and other privileges on purpose
   * (see `const.ts` for rationale). If you override it, you take
   * responsibility for the security boundary.
   */
  sandbox?: string;
  shadow?: boolean;
  /** Accepted for API compatibility — the inline toolbar has no language tag. */
  showLanguage?: boolean;
  /** @see {@link HtmlPreviewStreamingMode} */
  streamingMode?: HtmlPreviewStreamingMode;
  styles?: {
    content?: CSSProperties;
    header?: CSSProperties;
    iframe?: CSSProperties;
  };
  theme?: 'light' | 'dark';
  variant?: 'filled' | 'outlined' | 'borderless';
}
