import type { ReactElement } from 'react';

export interface VirtualListProps {
  /**
   * Typeahead label for a child row. Defaults to the row's `label` prop, then `aria-label`,
   * then the flattened text of its children.
   */
  getItemLabel?: (child: ReactElement, index: number) => string | undefined;
  /**
   * Extra child indices to keep mounted while virtualized, on top of the highlighted row.
   */
  keepMounted?: readonly number[];
  /**
   * Row height hint for the virtualizer; rows are still measured after mount.
   */
  listItemHeight?: number;
  /**
   * Only mount the rows near the scroll position. Use for long flat lists (hundreds of rows);
   * groups and submenus keep working but are kept mounted as one row.
   * @default false
   */
  virtual?: boolean;
}
