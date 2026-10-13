'use client';

import ActionIcon from '@/base-ui/ActionIcon';
import { Flexbox } from '@/Flex';

import type { TableIconActionProps, TableIconActionsProps } from './type';

/** `ActionIcon` `size="small"` is 24px. */
const ACTION_ICON_SIZE = 24;
const ACTION_ICON_GAP = 4;
/** Table cell horizontal padding, so the icons are not clipped by the column. */
const ACTION_CELL_PADDING = 32;

/** Column width for a row of `count` small filled action icons. */
export const tableActionColumnWidth = (count: number) =>
  count * ACTION_ICON_SIZE + Math.max(0, count - 1) * ACTION_ICON_GAP + ACTION_CELL_PADDING;

/** Right-aligned row of icon actions for a table's last column. */
const TableIconActions = ({ children }: TableIconActionsProps) => (
  <Flexbox horizontal align={'center'} gap={ACTION_ICON_GAP} justify={'flex-end'} width={'100%'}>
    {children}
  </Flexbox>
);

TableIconActions.displayName = 'TableIconActions';

/** One row action: a small filled icon button whose label is its name and tooltip. */
export const TableIconAction = ({
  danger,
  disabled,
  icon,
  label,
  loading,
  onClick,
}: TableIconActionProps) => (
  <ActionIcon
    aria-label={label}
    danger={danger}
    disabled={disabled}
    icon={icon}
    loading={loading}
    size={'small'}
    title={label}
    variant={'filled'}
    onClick={onClick}
  />
);

TableIconAction.displayName = 'TableIconAction';

export default TableIconActions;
