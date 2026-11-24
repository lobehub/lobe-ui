import type { CSSProperties, Ref } from 'react';

import type { DivProps } from '@/types';

export interface GlideHighlightBox {
  height: number;
  left: number;
  top: number;
  width: number;
}

export interface UseGlideHighlightOptions {
  /**
   * Stop tracking rows and hide the highlight.
   * @default false
   */
  disabled?: boolean;
  /**
   * CSS selector of the rows the highlight may land on.
   * @default '[data-glide-row]'
   */
  rowSelector?: string;
}

export interface GlideHighlightProps extends DivProps {
  /** Class names of the inner parts. */
  classNames?: { highlight?: string };
  /**
   * Stop tracking rows and hide the highlight.
   * @default false
   */
  disabled?: boolean;
  ref?: Ref<HTMLDivElement>;
  /**
   * CSS selector of the rows the highlight may land on.
   * @default '[data-glide-row]'
   */
  rowSelector?: string;
  /** Inline styles of the inner parts. */
  styles?: { highlight?: CSSProperties };
}
