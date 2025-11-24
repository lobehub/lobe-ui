import type { CSSProperties, HTMLAttributes, Key, ReactNode } from 'react';

import type { BlockProps } from '@/Block';

export interface AccordionItemProps
  extends Pick<BlockProps, 'padding' | 'paddingBlock' | 'paddingInline' | 'variant' | 'ref'> {
  /**
   * Action component that appears on hover
   */
  action?: ReactNode;
  /**
   * Content of the accordion item
   */
  children?: ReactNode;
  /**
   * Custom classNames for child elements
   */
  classNames?: {
    action?: string;
    base?: string;
    content?: string;
    header?: string;
    indicator?: string;
    title?: string;
  };
  /**
   * Whether the item is disabled
   */
  disabled?: boolean;
  headerWrapper?: (header: ReactNode) => ReactNode;
  /**
   * Whether to hide the chevron indicator
   * @default false
   */
  hideIndicator?: boolean;
  /**
   * Custom indicator component or function
   */
  indicator?: ReactNode | ((props: { isDisabled?: boolean; isOpen: boolean }) => ReactNode);
  /**
   * Indicator placement
   * @default 'start'
   */
  indicatorPlacement?: 'end' | 'start';
  /**
   * Unique identifier for the item (use as React key)
   */
  itemKey: Key;
  /**
   * Custom styles for child elements
   */
  styles?: {
    action?: CSSProperties;
    base?: CSSProperties;
    content?: CSSProperties;
    header?: CSSProperties;
    indicator?: CSSProperties;
    title?: CSSProperties;
  };
  /**
   * Title of the accordion item
   */
  title: ReactNode;
}

export interface AccordionProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange'>,
    Pick<BlockProps, 'variant'> {
  /**
   * Whether only one item can be expanded at a time
   * @default false
   */
  accordion?: boolean;
  /**
   * Accordion items
   */
  children?: ReactNode;
  /**
   * Custom classNames for child elements
   */
  classNames?: {
    base?: string;
  };
  /**
   * Default expanded keys (uncontrolled)
   */
  defaultExpandedKeys?: Key[];
  /**
   * Disable animation
   * @default false
   */
  disableAnimation?: boolean;
  /**
   * Controlled expanded keys
   */
  expandedKeys?: Key[];
  /**
   * Gap between accordion items
   */
  gap?: number;
  /**
   * Whether to hide the chevron indicator for all items
   * @default false
   */
  hideIndicator?: boolean;
  /**
   * Indicator placement for all items
   * @default 'start'
   */
  indicatorPlacement?: 'end' | 'start';
  /**
   * Keep content mounted when collapsed
   * @default false
   */
  keepContentMounted?: boolean;
  /**
   * Motion props for framer-motion animation
   */
  motionProps?: any;
  /**
   * Callback when expanded keys change
   */
  onExpandedChange?: (keys: Key[]) => void;
  /**
   * Whether to show dividers between items
   * @default false
   */
  showDivider?: boolean;
  /**
   * Custom styles for child elements
   */
  styles?: {
    base?: CSSProperties;
  };
}
