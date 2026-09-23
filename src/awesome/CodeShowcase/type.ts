import type { ReactNode } from 'react';

import type { DivProps } from '@/types';

export interface CodeShowcaseItem {
  /** The snippet shown on the left. Keep it short enough to read without scrolling. */
  code: string;
  key: string;
  label: ReactNode;
  /** @default 'tsx' */
  language?: string;
  /** The live render of the snippet, shown on the right. */
  preview: ReactNode;
}

export interface CodeShowcaseProps extends Omit<DivProps, 'onChange'> {
  activeKey?: string;
  defaultActiveKey?: string;
  items: CodeShowcaseItem[];
  /**
   * Minimum height of both panes in pixels.
   * @default 300
   */
  minHeight?: number;
  onChange?: (key: string) => void;
}
