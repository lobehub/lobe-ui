import type { ReactNode } from 'react';

export interface FilterStripItem {
  count?: number;
  /** Shown as the control's title. Definitions stay off the number so the row can be scanned. */
  hint?: string;
  key: string;
  label: ReactNode;
  loading?: boolean;
  /** Colors the count only when it is greater than zero; a zero is not an incident. */
  tone?: 'danger' | 'warning';
}

export interface FilterStripProps {
  /** Shown when an item has no count. Defaults to `--`. */
  emptyText?: ReactNode;
  /** Formats a count. Defaults to a grouped integer, e.g. `12,345`. */
  formatCount?: (count: number) => ReactNode;
  items: FilterStripItem[];
  /** Accessible name for the radio group. */
  label: string;
  onChange: (key: string) => void;
  value: string;
}
