import type { Ref } from 'react';

import type { SpanProps } from '@/types';

export type DiffStatKind = 'added' | 'deleted' | 'modified' | 'renamed';

export interface DiffStatProps extends Omit<SpanProps, 'children'> {
  /**
   * Number of added lines.
   * @default 0
   */
  additions?: number;
  /** Class names of the inner parts. */
  classNames?: { additions?: string; deletions?: string; kind?: string };
  /**
   * Number of removed lines.
   * @default 0
   */
  deletions?: number;
  /**
   * Hide a side that is zero, so a pure addition reads `+12` instead of `+12 −0`.
   * @default false
   */
  hideZero?: boolean;
  /**
   * Leads with a color-coded dot for how the file changed. The dot still renders when
   * both counts are zero, e.g. for a rename.
   */
  kind?: DiffStatKind;
  ref?: Ref<HTMLSpanElement>;
}
