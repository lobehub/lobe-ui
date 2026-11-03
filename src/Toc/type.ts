import type { ComponentProps } from 'react';

import type { AnchorItem } from '../Anchor';

export interface TocItem {
  href: string;
  level: 2 | 3;
  title: string;
}

/**
 * @title Toc
 */
export interface TocProps extends Omit<ComponentProps<'nav'>, 'children' | 'onChange' | 'onClick'> {
  /**
   * Controlled active key (the href or id of the active item)
   */
  activeKey?: string | null;
  /**
   * Returns the scroll container (default document.body)
   */
  getContainer?: () => HTMLElement | Window | null | undefined;
  /**
   * Table of contents items (supports both Anchor tree format and flat TocItem array)
   */
  items?: AnchorItem[] | TocItem[];
  /**
   * Pixels from the container top to mark a heading as active
   * @default 96
   */
  offset?: number;
  /**
   * Fires when the active item changes (passes the id, not the href)
   */
  onChange?: (activeId: string | null) => void;
  /**
   * Fires when a link is clicked (before the built-in scroll)
   */
  onClick?: (
    event: React.MouseEvent<HTMLAnchorElement>,
    item: { href: string; key: string; title: string },
  ) => void;
}
