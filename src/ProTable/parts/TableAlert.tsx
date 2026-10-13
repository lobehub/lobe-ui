'use client';

import clsx from 'clsx';
import type { Key, RefObject } from 'react';

import Button from '@/Button';
import type { TableInternalHandle } from '@/Table/internal';

import { useSelectedRowKeys } from '../hooks/useTableSelection';
import type { ProTableLocaleResolved } from '../locale';
import { PRO_PREFIX_CLS, styles } from '../style';
import type { ProTableAlertRender } from '../type';

interface TableAlertProps<T> {
  alwaysShow?: boolean;
  getRow: (key: Key) => T | undefined;
  handleRef: RefObject<TableInternalHandle | null>;
  locale: ProTableLocaleResolved;
  onClear: () => void;
  optionRender?: ProTableAlertRender<T>;
  render?: ProTableAlertRender<T>;
}

const TableAlert = <T,>({
  alwaysShow,
  getRow,
  handleRef,
  locale,
  onClear,
  optionRender,
  render,
}: TableAlertProps<T>) => {
  const selectedRowKeys = useSelectedRowKeys(handleRef);
  if (render === false || (selectedRowKeys.length === 0 && !alwaysShow)) return null;

  const selectedRows = selectedRowKeys
    .map((key) => getRow(key))
    .filter((row): row is T => row !== undefined);
  const props = { onCleanSelected: onClear, selectedRowKeys, selectedRows };
  const info = render ? render(props) : locale.alertSelected(selectedRowKeys.length);
  const option =
    optionRender === false ? null : optionRender ? (
      optionRender(props)
    ) : (
      <Button size="small" type="link" onClick={onClear}>
        {locale.alertClear}
      </Button>
    );

  return (
    <div className={clsx(styles.alert, `${PRO_PREFIX_CLS}-alert`)} role="status">
      <div className={styles.alertInfo}>{info}</div>
      {option && <div className={styles.alertOption}>{option}</div>}
    </div>
  );
};

export default TableAlert;
