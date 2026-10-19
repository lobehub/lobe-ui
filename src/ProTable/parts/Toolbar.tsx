'use client';

import clsx from 'clsx';
import { CircleHelp } from 'lucide-react';
import type { Key, ReactNode, RefObject } from 'react';

import ActionIcon from '@/ActionIcon';
import type { TableInternalHandle } from '@/Table/internal';

import { useSelectedRowKeys } from '../hooks/useTableSelection';
import { proTableClasses } from '../stable';
import { PRO_PREFIX_CLS, styles } from '../style';
import type { ProTableActionType, ProTableProps } from '../type';

interface ToolbarProps<T> {
  actionRef: RefObject<ProTableActionType | undefined>;
  actions?: ReactNode[];
  filter?: ReactNode;
  getRow: (key: Key) => T | undefined;
  handleRef: RefObject<TableInternalHandle | null>;
  keyword?: ReactNode;
  settings: ReactNode;
  subTitle?: ReactNode;
  title?: ReactNode;
  toolBarRender?: Exclude<ProTableProps<T>['toolBarRender'], false>;
  tooltip?: ReactNode;
}

const Toolbar = <T,>({
  actionRef,
  actions,
  filter,
  getRow,
  handleRef,
  keyword,
  settings,
  subTitle,
  title,
  toolBarRender,
  tooltip,
}: ToolbarProps<T>) => {
  const selectedRowKeys = useSelectedRowKeys(handleRef);
  const rendered = toolBarRender
    ? toolBarRender(actionRef.current, {
        selectedRowKeys,
        selectedRows: selectedRowKeys
          .map((key) => getRow(key))
          .filter((row): row is T => row !== undefined),
      })
    : [];
  const empty =
    title === undefined &&
    !subTitle &&
    !filter &&
    !keyword &&
    !actions?.length &&
    !rendered.length &&
    !settings;
  if (empty) return null;

  return (
    <div className={clsx(styles.toolbar, `${PRO_PREFIX_CLS}-toolbar`, proTableClasses('toolbar'))}>
      {(title !== undefined || subTitle) && (
        <div className={clsx(styles.title, proTableClasses('toolbar-title'))}>
          {title}
          {tooltip && <ActionIcon icon={CircleHelp} size="small" title={tooltip} />}
          {subTitle && <span className={styles.titleSub}>{subTitle}</span>}
        </div>
      )}
      <div className={styles.toolbarActions}>
        {filter}
        {keyword}
        {actions}
        {rendered}
        {settings && <div className={styles.toolbarOptions}>{settings}</div>}
      </div>
    </div>
  );
};

export default Toolbar;
