import type { HTMLAttributes, ReactNode } from 'react';

export interface ConsoleShellState {
  /** Closes the compact navigation drawer. */
  closeNavigation: () => void;
  /** Icon rail, only when the sidebar is collapsed on a wide viewport. */
  collapsed: boolean;
  /** Sidebar is a drawer. Matches the laptop breakpoint. */
  compact: boolean;
}

export interface ConsoleBrandLinkProps {
  'aria-label': string;
  'children': ReactNode;
  'className': string;
  'href': string;
  'onClick': () => void;
}

export interface ConsoleBrandProps {
  href?: string;
  /** Accessible name for the home link. Defaults to `title`. */
  label?: string;
  /** Mark shown on its own when the sidebar is an icon rail. */
  logo: ReactNode;
  /**
   * Renders the home link. Use this to plug in a router `Link`.
   * The default render is an anchor.
   */
  renderLink?: (props: ConsoleBrandLinkProps) => ReactNode;
  /**
   * Name beside the mark. Omit when `logo` already includes the wordmark,
   * such as a combine lockup.
   */
  title?: ReactNode;
}

export interface ConsoleShellProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  /** Home mark. Rendered at the top of the sidebar. */
  brand?: ReactNode;
  /** Location shown in the top bar, usually a `Breadcrumb`. */
  breadcrumb?: ReactNode;
  children?: ReactNode;
  /** Collapse the sidebar to an icon rail. Ignored while compact. */
  collapsed?: boolean;
  collapseLabel?: string;
  defaultCollapsed?: boolean;
  expandLabel?: string;
  /** Account menu or other content pinned to the bottom of the sidebar. */
  footer?: ReactNode;
  /**
   * Collapse and expand with Mod+B while focus is inside the shell.
   * @default true
   */
  hotkey?: boolean;
  /** Grouped navigation. Collapsed state comes from the shell. */
  navigation?: ReactNode;
  onCollapsedChange?: (collapsed: boolean) => void;
  openNavigationLabel?: string;
  skipToContentLabel?: string;
  /**
   * Persists the collapsed rail. Omit to keep the choice in memory only.
   */
  storageKey?: string;
  /** Actions at the end of the top bar. */
  tools?: ReactNode;
}
