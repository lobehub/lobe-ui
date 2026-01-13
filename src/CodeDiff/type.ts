import type { FileDiffOptions } from '@pierre/diffs';
import type { CSSProperties, ReactNode } from 'react';

import type { FlexboxProps } from '@/Flex';

export type DiffViewMode = 'split' | 'unified';

export interface CodeDiffProps extends Omit<FlexboxProps, 'children'> {
  /**
   * Actions to render in the header
   */
  actionsRender?: (props: {
    newContent: string;
    oldContent: string;
    originalNode: ReactNode;
  }) => ReactNode;
  /**
   * Custom class names for different parts
   */
  classNames?: {
    body?: string;
    header?: string;
  };
  /**
   * Options for the diff component
   */
  diffOptions?: FileDiffOptions<string>;
  /**
   * File name to display
   */
  fileName?: string;
  /**
   * Programming language for syntax highlighting
   */
  language?: string;
  /**
   * New content (after changes)
   */
  newContent: string;
  /**
   * Old content (before changes)
   */
  oldContent: string;
  /**
   * Whether to show file header
   * @default true
   */
  showHeader?: boolean;
  /**
   * Custom styles for different parts
   */
  styles?: {
    body?: CSSProperties;
    header?: CSSProperties;
  };
  /**
   * Visual variant
   * @default 'filled'
   */
  variant?: 'filled' | 'outlined' | 'borderless';
  /**
   * View mode for diff display
   * @default 'split'
   */
  viewMode?: DiffViewMode;
}

export interface PatchDiffProps extends Omit<FlexboxProps, 'children'> {
  /**
   * Actions to render in the header
   */
  actionsRender?: (props: { originalNode: ReactNode; patch: string }) => ReactNode;
  /**
   * Custom class names for different parts
   */
  classNames?: {
    body?: string;
    header?: string;
  };
  /**
   * Options for the diff component
   */
  diffOptions?: FileDiffOptions<string>;
  /**
   * File name to display (optional, extracted from patch if not provided)
   */
  fileName?: string;
  /**
   * Programming language for syntax highlighting
   */
  language?: string;
  /**
   * Unified diff patch string
   */
  patch: string;
  /**
   * Whether to show file header
   * @default true
   */
  showHeader?: boolean;
  /**
   * Custom styles for different parts
   */
  styles?: {
    body?: CSSProperties;
    header?: CSSProperties;
  };
  /**
   * Visual variant
   * @default 'filled'
   */
  variant?: 'filled' | 'outlined' | 'borderless';
  /**
   * View mode for diff display
   * @default 'split'
   */
  viewMode?: DiffViewMode;
}
