import { Flexbox } from '@lobehub/ui';
import {
  DayjsDatePicker as DatePicker,
  type DayjsDatePickerProps as DatePickerProps,
  DayjsDateRangePicker as DateRangePicker,
} from '@lobehub/ui/base-ui';
import type { Dayjs } from 'dayjs';
import { cloneElement, type CSSProperties, type ReactElement } from 'react';

// Theme tokens are exposed as CSS variables by the ThemeProvider.
const colorPrimary = 'var(--ant-color-primary)';
const colorSuccess = 'var(--ant-color-success)';
const colorWarning = 'var(--ant-color-warning)';

const cellRender: DatePickerProps['cellRender'] = (current, info) => {
  if (info.type !== 'date') return info.originNode;
  if (typeof current === 'number' || typeof current === 'string') {
    return <div className={`${info.prefixCls}-cell-inner`}>{current}</div>;
  }
  const date = current as Dayjs;
  const style =
    date.date() === 1 ? { border: `1px solid ${colorPrimary}`, borderRadius: '50%' } : {};
  return (
    <div className={`${info.prefixCls}-cell-inner`} style={style}>
      {date.date()}
    </div>
  );
};

// Every panel goes through `cellRender`; `info.type` tells which one, and on a RangePicker
// `info.range` tells which end is being picked.
const allPanels: DatePickerProps['cellRender'] = (current, info) => {
  if (typeof current !== 'object') return info.originNode;
  const date = current as Dayjs;
  const marked =
    (info.type === 'month' && date.month() === 0) ||
    (info.type === 'quarter' && date.month() === 0) ||
    (info.type === 'year' && date.year() % 5 === 0) ||
    (info.type === 'decade' && date.year() % 50 === 0);
  if (!marked) return info.originNode;
  return cloneElement(info.originNode as ReactElement<{ style?: CSSProperties }>, {
    style: { color: info.range === 'end' ? colorWarning : colorSuccess },
  });
};

// Time cells get `info.type === 'time'` and `info.subType` (`hour` / `minute` / `second` /
// `millisecond` / `meridiem`); `current` is the cell's number (or `am` / `pm`).
const timeCells: DatePickerProps['cellRender'] = (current, info) => {
  if (info.type !== 'time') return info.originNode;
  const marked =
    (info.subType === 'hour' && Number(current) % 6 === 0) ||
    (info.subType === 'minute' && Number(current) % 15 === 0);
  if (!marked) return info.originNode;
  return cloneElement(info.originNode as ReactElement<{ style?: CSSProperties }>, {
    style: { color: info.subType === 'hour' ? colorPrimary : colorSuccess, fontWeight: 600 },
  });
};

export default () => (
  <Flexbox gap={12} padding={16} style={{ maxWidth: 400 }}>
    <DatePicker cellRender={cellRender} />
    <DateRangePicker cellRender={cellRender} />
    <DatePicker cellRender={allPanels} picker="month" />
    <DateRangePicker cellRender={allPanels} picker="quarter" />
    <DateRangePicker cellRender={allPanels} picker="year" />
    <DatePicker showTime cellRender={timeCells} />
  </Flexbox>
);
