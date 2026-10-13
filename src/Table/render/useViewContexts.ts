import { type CSSProperties, useMemo } from 'react';

import { useEventCallback } from '@/hooks/useEventCallback';

import { PREFIX_CLS } from '../constants';
import { DEFAULT_SORT_DIRECTIONS } from '../pipeline/useSorter';
import type { NormalizedSemantic } from '../semantic';
import type { TableProps, TableSorterTooltipProps } from '../type';
import type { useTableController } from '../useTableController';
import type { HeaderView, SelectionView, TableComponentSet, TableViewValue } from './context';

const DEFAULT_SORTER_TOOLTIP: TableSorterTooltipProps = { target: 'full-header' };

interface ViewContextsOptions<T> {
  controller: ReturnType<typeof useTableController<T>>;
  props: TableProps<T>;
  semanticClassNames: NormalizedSemantic<string>;
  semanticStyles: NormalizedSemantic<CSSProperties>;
}

export const useViewContexts = <T>({
  controller,
  props,
  semanticClassNames,
  semanticStyles,
}: ViewContextsOptions<T>) => {
  const {
    components,
    expandable,
    getPopupContainer,
    onHeaderRow,
    onRow,
    rowClassName,
    rowHoverable = true,
    rowSelection,
    showSorterTooltip = DEFAULT_SORTER_TOOLTIP,
    sortDirections = DEFAULT_SORT_DIRECTIONS,
    virtual,
  } = props;
  const { model, selection, state, tableLocale } = controller;
  const leafColumns = model.leafColumns;

  const componentSet = useMemo((): TableComponentSet => {
    const fallback = virtual ? 'div' : undefined;
    return {
      bodyCell: components?.body?.cell ?? fallback,
      bodyRow: components?.body?.row ?? fallback,
      bodyWrapper: components?.body?.wrapper,
      headerCell: components?.header?.cell,
      headerRow: components?.header?.row,
      headerTable: components?.header?.table,
      headerWrapper: components?.header?.wrapper,
      table: components?.table,
    };
  }, [components, virtual]);

  const toggleExpand = useEventCallback((record: T) => controller.toggleExpand(record));
  const fixColumn = controller.horizonScroll && leafColumns.some((leaf) => leaf.fixed);

  const viewValue = useMemo(
    (): TableViewValue<T> => ({
      components: componentSet,
      expand: {
        expandedRowClassName: expandable?.expandedRowClassName,
        expandedRowRender: expandable?.expandedRowRender,
        expandIcon: controller.expandIcon,
        expandRowByClick: expandable?.expandRowByClick,
        forceRender: expandable?.forceRender,
        indentSize: controller.indentSize,
        nestIconColumnIndex: controller.nestIconColumnIndex,
        rowExpandable: expandable?.rowExpandable,
        toggle: toggleExpand,
        type: controller.expandType,
      },
      fixColumn,
      getRowKey: controller.getRowKey,
      horizonScroll: controller.horizonScroll,
      leafColumns,
      onRow,
      prefixCls: PREFIX_CLS,
      rowClassName,
      rowHoverable,
      semanticClassNames,
      semanticStyles,
      virtualWidths: controller.virtualWidths,
    }),
    [
      componentSet,
      expandable,
      controller.expandIcon,
      controller.indentSize,
      controller.nestIconColumnIndex,
      toggleExpand,
      controller.expandType,
      fixColumn,
      controller.getRowKey,
      controller.horizonScroll,
      leafColumns,
      onRow,
      rowClassName,
      rowHoverable,
      semanticClassNames,
      semanticStyles,
      controller.virtualWidths,
    ],
  );

  const selectionValue = useMemo(
    (): SelectionView<T> => ({
      actions: selection.actions,
      checkboxPropsMap: selection.checkboxPropsMap,
      expandType: controller.expandType,
      getRowKey: controller.getRowKey,
      getTitleCheckboxProps: rowSelection?.getTitleCheckboxProps,
      hideSelectAll: rowSelection?.hideSelectAll,
      locale: tableLocale,
      renderCell: rowSelection?.renderCell,
      selections: selection.mergedSelections,
      title: rowSelection?.columnTitle,
      type: rowSelection?.type ?? 'checkbox',
    }),
    [selection, controller.expandType, controller.getRowKey, rowSelection, tableLocale],
  );

  const triggerSort = useEventCallback(state.triggerSort);
  const triggerFilter = useEventCallback(state.triggerFilter);
  const headerValue = useMemo(
    (): HeaderView<T> => ({
      filterStates: state.filterStates,
      getPopupContainer,
      locale: tableLocale,
      onHeaderRow,
      showSorterTooltip,
      sortDirections,
      sortStates: state.sortStates,
      titleProps: state.titleProps,
      triggerFilter,
      triggerSort,
    }),
    [
      state.filterStates,
      getPopupContainer,
      tableLocale,
      onHeaderRow,
      showSorterTooltip,
      sortDirections,
      state.sortStates,
      state.titleProps,
      triggerFilter,
      triggerSort,
    ],
  );

  return { headerValue, selectionValue, viewValue };
};
