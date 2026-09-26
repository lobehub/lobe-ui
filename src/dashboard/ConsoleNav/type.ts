import type { ReactNode } from 'react';

import type { IconProps } from '@/Icon';

export interface ConsoleNavItem {
  /** Count shown beside the label. Collapses to a dot on the icon rail. */
  badge?: number;
  /** Match only this path, not its descendants. `/` is always exact. */
  end?: boolean;
  /** Opens in a new tab. The default anchor adds `target` and `rel`. */
  external?: boolean;
  href: string;
  /** Omit for a text-only row. Items without an icon are left off the icon rail. */
  icon?: IconProps['icon'];
  label: string;
}

export interface ConsoleNavGroup {
  /** Start open or closed, overriding the nav-wide `defaultExpanded` for this group. */
  defaultExpanded?: boolean;
  /** Nested groups, listed after this group's own items. */
  groups?: ConsoleNavGroup[];
  /** Overview page for the group. On the icon rail, a group with an icon links here. */
  href?: string;
  /** Shown before the label. On the icon rail the whole group folds into this icon. */
  icon?: IconProps['icon'];
  items?: ConsoleNavItem[];
  key: string;
  label: string;
}

export interface ConsoleNavLinkProps {
  'aria-current'?: 'page';
  'aria-label'?: string;
  'children': ReactNode;
  'className': string;
  'data-active': boolean;
  'data-collapsed': boolean;
  /** Nesting depth used for inline padding. Spread it onto the rendered link. */
  'data-indent': number;
  'external'?: boolean;
  'href': string;
  'onClick': () => void;
  'title'?: string;
}

export interface ConsoleNavProps {
  /** Show the icon rail. Defaults to the enclosing `ConsoleShell` state. */
  collapsed?: boolean;
  /**
   * `all` opens every group. `active` starts with every group closed and opens
   * the branch holding the current page, including after navigation.
   * @default 'all'
   */
  defaultExpanded?: 'active' | 'all';
  groups?: ConsoleNavGroup[];
  /** Ungrouped links listed before the groups. */
  items?: ConsoleNavItem[];
  /** Accessible name for the navigation landmark. */
  label?: string;
  /** Called with the item href. Prevents the anchor navigation when set. */
  onNavigate?: (href: string) => void;
  pathname: string;
  /**
   * Renders each item link. Use this to plug in a router `Link`.
   * The default render is an anchor.
   */
  renderLink?: (props: ConsoleNavLinkProps) => ReactNode;
  /** Persists which groups were opened or closed by hand. */
  storageKey?: string;
}
