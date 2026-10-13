import type { TableSize } from './type';

export const PREFIX_CLS = 'lobe-table';

export const EXPAND_COLUMN_WIDTH = 48;
export const SELECTION_COLUMN_WIDTH = 32;
export const SELECTION_DROPDOWN_WIDTH = 24;
export const DEFAULT_INDENT_SIZE = 15;

export const VIRTUAL_ROW_HEIGHT: Record<TableSize, number> = {
  large: 16 * 2 + 22 + 1,
  middle: 12 * 2 + 22 + 1,
  small: 8 * 2 + 22 + 1,
};

export const SIZE_CLASS: Record<TableSize, string> = {
  large: `${PREFIX_CLS}-large`,
  middle: `${PREFIX_CLS}-medium`,
  small: `${PREFIX_CLS}-small`,
};
