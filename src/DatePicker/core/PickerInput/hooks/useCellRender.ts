import * as React from 'react';

import type { CellRender, CellRenderInfo, SharedPickerProps } from '../../interface';
import { warning } from '../../utils/common';

export default function useCellRender<DateType extends object = any>(
  cellRender: SharedPickerProps<DateType>['cellRender'],
  dateRender?: SharedPickerProps<DateType>['dateRender'],
  monthCellRender?: SharedPickerProps<DateType>['monthCellRender'],
  range?: CellRenderInfo<DateType>['range'],
) {
  // ========================= Warn =========================
  if (process.env.NODE_ENV !== 'production') {
    warning(!dateRender, `'dateRender' is deprecated. Please use 'cellRender' instead.`);
    warning(!monthCellRender, `'monthCellRender' is deprecated. Please use 'cellRender' instead.`);
  }

  // ======================== Render ========================
  // Merged render
  const mergedCellRender = React.useMemo(() => {
    if (cellRender) {
      return cellRender;
    }

    return (current: DateType | number | string, info: CellRenderInfo<DateType>) => {
      const date = current as DateType;

      if (dateRender && info.type === 'date') {
        return dateRender(date, info.today);
      }
      if (monthCellRender && info.type === 'month') {
        return monthCellRender(date, info.locale!);
      }
      return info.originNode;
    };
  }, [cellRender, monthCellRender, dateRender]);

  // Cell render
  const onInternalCellRender: CellRender<DateType> = React.useCallback(
    (date, info) => mergedCellRender(date, { ...info, range }),
    [mergedCellRender, range],
  );

  return onInternalCellRender;
}
