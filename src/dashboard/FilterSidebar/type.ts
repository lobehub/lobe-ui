import type { ReactNode } from 'react';

export interface FilterSidebarProps {
  /** Scrolling choices. `dismiss` closes the compact drawer. */
  body: (dismiss: () => void) => ReactNode;
  children: ReactNode;
  /**
   * Fill the parent and scroll the two panes separately.
   * Leave this off when a header or tabs sit above the split.
   */
  flush?: boolean;
  /**
   * Fixed controls, such as search. They stay put while `body` scrolls.
   * `dismiss` closes the compact drawer.
   */
  head?: (dismiss: () => void) => ReactNode;
  /** Title block rendered in the content pane, above the compact trigger. */
  header?: ReactNode;
  /** Names the sidebar, and titles the drawer on compact screens. */
  label: string;
  /** Persists width and collapsed state. */
  storageKey?: string;
  /** Current filter, shown on the compact trigger. */
  summary: string;
  /** Wider rail. Default width is 264px; wide is 300px. */
  wide?: boolean;
}

export interface FilterRowProps {
  count?: ReactNode;
  name: ReactNode;
}

export interface FilterOptionProps {
  count?: ReactNode;
  icon?: ReactNode;
  /** Overrides the accessible name when the visible one lacks context. */
  label?: string;
  name: ReactNode;
  onClick: () => void;
  selected: boolean;
  title?: string;
}
