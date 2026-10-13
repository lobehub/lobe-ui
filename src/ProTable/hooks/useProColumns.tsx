import { CircleHelp } from 'lucide-react';
import { type ReactNode, type RefObject, useMemo } from 'react';

import ActionIcon from '@/ActionIcon';
import type { TableColumn } from '@/Table/type';

import type { SettingColumn } from '../parts/ColumnSetting';
import { CopyableText, renderValue } from '../parts/renderValue';
import { styles } from '../style';
import type { ProColumnType, ProTableActionType, ProTableColumnsStateMap } from '../type';
import {
  getByPath,
  getProColumnKey,
  isEmptyValue,
  resolveValueEnum,
  resolveValueType,
  valueEnumToList,
} from '../utils';

interface ProColumnsOptions<T> {
  actionRef: RefObject<ProTableActionType | undefined>;
  columnEmptyText: ReactNode | false;
  columns: ProColumnType<T>[];
  copyLabel: string;
  current: number;
  pageSize: number;
  state: ProTableColumnsStateMap;
}

const orderOf = (state: ProTableColumnsStateMap, key: string, index: number) =>
  state[key]?.order ?? index;

const sortedEntries = <T,>(columns: ProColumnType<T>[], state: ProTableColumnsStateMap) =>
  columns
    .map((column, index) => ({ column, index, key: getProColumnKey(column, index) }))
    .sort((a, b) => orderOf(state, a.key, a.index) - orderOf(state, b.key, b.index));

export const useProColumns = <T,>({
  actionRef,
  columnEmptyText,
  columns,
  copyLabel,
  current,
  pageSize,
  state,
}: ProColumnsOptions<T>) => {
  const tableColumns = useMemo(() => {
    const offset = (current - 1) * pageSize;

    const convert = (
      column: ProColumnType<T>,
      index: number,
      top: boolean,
    ): TableColumn<T> | null => {
      const key = getProColumnKey(column, index);
      const columnState = top ? state[key] : undefined;
      if (column.hideInTable || columnState?.show === false) return null;

      const {
        children,
        colSize: _colSize,
        copyable,
        disable: _disable,
        fieldProps,
        filters,
        formItemProps: _formItemProps,
        hideInForm: _hideInForm,
        hideInSearch: _hideInSearch,
        hideInSetting: _hideInSetting,
        hideInTable: _hideInTable,
        initialValue: _initialValue,
        onFilter,
        order: _order,
        render,
        renderFormItem: _renderFormItem,
        renderText,
        search: _search,
        sorter,
        title,
        tooltip: columnTooltip,
        valueEnum: _valueEnum,
        valueType: _valueType,
        ...rest
      } = column;

      const titleNode: ReactNode = columnTooltip ? (
        <span className={styles.titleTooltip}>
          {title}
          <ActionIcon icon={CircleHelp} size="small" title={columnTooltip} />
        </span>
      ) : (
        title
      );

      if (children?.length) {
        const childColumns = children
          .map((child, childIndex) => convert(child, childIndex, false))
          .filter((child): child is TableColumn<T> => child !== null);
        return { ...(rest as any), children: childColumns, key, title: titleNode };
      }

      const valueType = resolveValueType(column);
      const staticEnum = typeof column.valueEnum === 'function' ? undefined : column.valueEnum;
      const fixed = columnState?.fixed ?? rest.fixed;
      return {
        ...(rest as any),
        ...(valueType === 'option' && rest.align === undefined && { align: 'end' }),
        ...((valueType === 'index' || valueType === 'indexBorder') &&
          rest.width === undefined && { width: 56 }),
        filters:
          filters === true
            ? valueEnumToList(staticEnum).map((item) => ({ text: item.text, value: item.value }))
            : filters || undefined,
        fixed: fixed === 'left' ? 'start' : fixed === 'right' ? 'end' : fixed,
        key,
        onFilter:
          onFilter === true
            ? (value: unknown, record: T) =>
                String(getByPath(record, column.dataIndex)) === String(value)
            : onFilter || undefined,
        sorter: typeof sorter === 'string' ? true : sorter,
        title: titleNode,
        render: (value: any, record: T, rowIndex: number) => {
          const action = actionRef.current;
          const text = renderText ? renderText(value, record, rowIndex, action) : value;
          let dom: ReactNode = renderValue(text, {
            emptyText: columnEmptyText === false ? null : columnEmptyText,
            fieldProps,
            rowIndex: offset + rowIndex,
            valueEnum: resolveValueEnum(column, record),
            valueType: resolveValueType(column, record),
          });
          if (copyable && !isEmptyValue(text)) {
            dom = (
              <CopyableText label={copyLabel} text={String(text)}>
                {dom}
              </CopyableText>
            );
          }
          if (!render) return dom;
          const result = render(dom, record, rowIndex, action, column);
          if (valueType === 'option' && Array.isArray(result)) {
            return <div className={styles.optionCell}>{result}</div>;
          }
          return result;
        },
      } as TableColumn<T>;
    };

    return sortedEntries(columns, state)
      .map(({ column, index }) => convert(column, index, true))
      .filter((column): column is TableColumn<T> => column !== null);
  }, [actionRef, columnEmptyText, columns, copyLabel, current, pageSize, state]);

  const settingColumns = useMemo(() => {
    const list: SettingColumn[] = [];
    sortedEntries(columns, state).forEach(({ column, key }) => {
      if (column.hideInTable || column.hideInSetting) return;
      const disable =
        state[key]?.disable ??
        (typeof column.disable === 'object' ? column.disable.checkbox : column.disable);
      list.push({ disabled: !!disable, key, title: column.title ?? key });
    });
    return list;
  }, [columns, state]);

  const sortFieldOf = useMemo(() => {
    const map = new Map<string, string>();
    const walk = (list: ProColumnType<T>[]) =>
      list.forEach((column, index) => {
        if (column.children?.length) walk(column.children);
        const key = getProColumnKey(column, index);
        if (typeof column.sorter === 'string') map.set(key, column.sorter);
        else if (Array.isArray(column.dataIndex)) map.set(key, column.dataIndex.join('.'));
        else if (column.dataIndex !== undefined) map.set(key, String(column.dataIndex));
      });
    walk(columns);
    return map;
  }, [columns]);

  return { settingColumns, sortFieldOf, tableColumns };
};
