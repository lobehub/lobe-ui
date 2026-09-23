import type { ReactNode } from 'react';

export interface BreadcrumbItem {
  href?: string;
  label: ReactNode;
  /** Called instead of following `href`. */
  onClick?: () => void;
  /** Dropped on narrow screens. Use this for a group name that the page title already repeats. */
  optional?: boolean;
}

export interface BreadcrumbLinkProps {
  children: ReactNode;
  className: string;
  href: string;
  onClick?: () => void;
}

export interface BreadcrumbProps {
  items: BreadcrumbItem[];
  /** Accessible name for the navigation landmark. */
  label?: string;
  renderLink?: (props: BreadcrumbLinkProps) => ReactNode;
}
