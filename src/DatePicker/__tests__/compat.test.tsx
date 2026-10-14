import { fireEvent, screen } from '@testing-library/react';
import dayjs, { type Dayjs } from 'dayjs';
import { useState } from 'react';
import { describe, expect, expectTypeOf, it, vi } from 'vitest';

import { DatePicker, DateRangePicker, DayjsDatePicker, DayjsDateRangePicker } from '..';
import type {
  DatePickerProps,
  DateRangePickerProps,
  DateRangeValue,
  DayjsDatePickerProps,
  DayjsDateRangePickerProps,
} from '../type';
import { render } from './render';

if (!globalThis.ResizeObserver) {
  globalThis.ResizeObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
  } as any;
}

/**
 * Backward compatibility with the previous lobe DatePicker (native `Date` API):
 *   DatePickerProps:      value/defaultValue `Date | null`, onChange `(date: Date | null) => void`,
 *                         disabledDate `(date: Date) => boolean`, min/max `Date`
 *   DateRangeValue:       `[Date | null, Date | null]`
 *   DateRangePickerProps: value `DateRangeValue`, onChange `(range: DateRangeValue) => void`,
 *                         a cleared range is `[null, null]` (never `null`).
 * The downstream patterns below are copied verbatim and must keep compiling (this file is
 * type-checked by `tsc` in CI) and behaving the same at runtime.
 */

// ---------------------------------------------------------------- downstream patterns (verbatim)

// 1. single DatePicker with a Date value
const Pattern1 = ({ date }: { date: Date }) => <DatePicker value={date} />;

// 2. reading the picked value as `Date | undefined`
const Pattern2 = ({ onPick }: { onPick: (d: Date | undefined) => void }) => (
  <DatePicker onChange={(date) => onPick(date ?? undefined)} />
);

// 3. disabledDate typed with Date
const Pattern3 = () => (
  <DatePicker disabledDate={(current: Date) => current.getTime() > Date.now()} />
);

// 4. onChange={setState} with the old Date tuple state
const Pattern4 = () => {
  const [range, setRange] = useState<DateRangeValue>([null, null]);
  return <DateRangePicker value={range} onChange={setRange} />;
};

// 5. `[null, null] | [Date, Date]` values (WorkspaceAuditLog / SpendFilterBar)
const Pattern5 = ({ from, to }: { from?: Date; to?: Date }) => {
  const value: [null, null] | [Date, Date] = from && to ? [from, to] : [null, null];
  return <DateRangePicker value={value} />;
};

// 6. destructured DateRangeValue handler
const Pattern6 = ({ onRange }: { onRange: (s: Date | null, e: Date | null) => void }) => (
  <DateRangePicker
    onChange={([startDate, endDate]: DateRangeValue) => {
      onRange(startDate, endDate);
    }}
  />
);

// 7. Dayjs tuple (possibly undefined ends) as a range value
const Pattern7 = ({ v }: { v: [Dayjs | null | undefined, Dayjs | null | undefined] }) => (
  <DateRangePicker value={v} />
);

// 8. strings / timestamps, single and range
const Pattern8 = () => (
  <>
    <DatePicker
      defaultValue="2026-01-15"
      maxDate={new Date(2026, 11, 31)}
      minDate={new Date(2026, 0, 1)}
    />
    <DatePicker value={1_768_435_200_000} />
    <DateRangePicker defaultValue={['2026-01-01', '2026-01-31']} />
    <DateRangePicker value={[dayjs('2026-01-01'), new Date(2026, 0, 31)]} />
  </>
);

void [Pattern1, Pattern2, Pattern3, Pattern4, Pattern5, Pattern6, Pattern7, Pattern8];

describe('type compatibility with the previous native Date API', () => {
  it('keeps the old public types', () => {
    expectTypeOf<DateRangeValue>().toEqualTypeOf<[Date | null, Date | null]>();
    expectTypeOf<
      Parameters<NonNullable<DatePickerProps['onChange']>>[0]
    >().toEqualTypeOf<Date | null>();
    expectTypeOf<
      Parameters<NonNullable<DatePickerProps['disabledDate']>>[0]
    >().toEqualTypeOf<Date>();
    expectTypeOf<
      Parameters<NonNullable<DateRangePickerProps['onChange']>>[0]
    >().toEqualTypeOf<DateRangeValue>();
    expectTypeOf<Date>().toMatchTypeOf<NonNullable<DatePickerProps['value']>>();
    expectTypeOf<DateRangeValue>().toMatchTypeOf<NonNullable<DateRangePickerProps['value']>>();
  });

  it('keeps the dayjs (antd) API opt-in', () => {
    type DayjsChange = Parameters<NonNullable<DayjsDatePickerProps['onChange']>>[0];
    expectTypeOf<DayjsChange>().toEqualTypeOf<Dayjs | null>();
    type DayjsRange = Parameters<NonNullable<DayjsDateRangePickerProps['onChange']>>[0];
    expectTypeOf<DayjsRange>().toEqualTypeOf<[Dayjs | null, Dayjs | null] | null>();
  });
});

// ---------------------------------------------------------------- runtime

const inputs = () => [...document.querySelectorAll('input')] as HTMLInputElement[];
const cell = (title: string) =>
  document.querySelector<HTMLElement>(`.lobe-picker-dropdown td[title="${title}"]`)!;
const pick = (title: string) => fireEvent.click(cell(title).querySelector('div')!);
const clickClear = () => {
  const clear = [...document.querySelectorAll<HTMLElement>('.lobe-picker-clear')].at(-1)!;
  fireEvent.mouseDown(clear);
  fireEvent.click(clear);
};

describe('runtime compatibility with the previous native Date API', () => {
  it('renders Date, Dayjs, string and timestamp values', () => {
    const { unmount } = render(<Pattern1 date={new Date(2026, 0, 15)} />);
    expect(inputs()[0].value).toBe('2026-01-15');
    unmount();
    for (const node of [
      <DatePicker key="dayjs" value={dayjs('2026-01-15')} />,
      <DatePicker key="string" value="2026-01-15" />,
      <DatePicker key="timestamp" value={new Date(2026, 0, 15).getTime()} />,
    ]) {
      const r = render(node);
      expect(inputs()[0].value).toBe('2026-01-15');
      r.unmount();
    }
    // the dayjs pickers accept native Date / strings too
    const d = render(<DayjsDatePicker value={new Date(2026, 0, 15)} />);
    expect(inputs()[0].value).toBe('2026-01-15');
    d.unmount();
    const dr = render(<DayjsDateRangePicker value={['2026-01-01', new Date(2026, 0, 31)]} />);
    expect(inputs().map((i) => i.value)).toEqual(['2026-01-01', '2026-01-31']);
    dr.unmount();
    render(<Pattern5 from={new Date(2026, 0, 1)} to={new Date(2026, 0, 31)} />);
    expect(inputs().map((i) => i.value)).toEqual(['2026-01-01', '2026-01-31']);
  });

  it('renders Dayjs tuples and string ranges', () => {
    const r = render(<Pattern7 v={[dayjs('2026-01-01'), undefined]} />);
    expect(inputs().map((i) => i.value)).toEqual(['2026-01-01', '']);
    r.unmount();
    render(<DateRangePicker defaultValue={['2026-01-01', '2026-01-31']} />);
    expect(inputs().map((i) => i.value)).toEqual(['2026-01-01', '2026-01-31']);
  });

  it('single onChange emits a native Date, and null on clear', () => {
    const onPick = vi.fn();
    const { container } = render(<Pattern2 onPick={onPick} />);
    fireEvent.click(inputs()[0]);
    pick(dayjs().date(15).format('YYYY-MM-DD'));
    const picked = onPick.mock.calls.at(-1)![0];
    expect(picked).toBeInstanceOf(Date);
    expect(dayjs(picked).format('YYYY-MM-DD')).toBe(dayjs().date(15).format('YYYY-MM-DD'));

    const onChange = vi.fn();
    render(<DatePicker allowClear defaultValue={new Date(2026, 0, 15)} onChange={onChange} />);
    clickClear();
    expect(onChange).toHaveBeenCalled();
    expect(onChange.mock.calls.at(-1)![0]).toBeNull();
    void container;
  });

  it('disabledDate receives native Date', () => {
    const disabledDate = vi.fn((current: Date) => current.getDate() === 13);
    render(
      <DatePicker open defaultPickerValue={new Date(2026, 0, 1)} disabledDate={disabledDate} />,
    );
    expect(disabledDate).toHaveBeenCalled();
    for (const [d] of disabledDate.mock.calls) expect(d).toBeInstanceOf(Date);
    expect(cell('2026-01-13').className).toMatch(/disabled/);
  });

  it('range onChange={setState} gets a Date tuple, and [null, null] on clear', () => {
    const onRange = vi.fn();
    render(<Pattern6 onRange={onRange} />);
    fireEvent.click(inputs()[0]);
    const base = dayjs();
    pick(base.date(10).format('YYYY-MM-DD'));
    pick(base.date(20).format('YYYY-MM-DD'));
    expect(onRange).toHaveBeenCalledTimes(1);
    const [s, e] = onRange.mock.calls[0];
    expect(s).toBeInstanceOf(Date);
    expect(e).toBeInstanceOf(Date);
    expect(dayjs(s).format('YYYY-MM-DD')).toBe(base.date(10).format('YYYY-MM-DD'));
    expect(dayjs(e).format('YYYY-MM-DD')).toBe(base.date(20).format('YYYY-MM-DD'));

    const onChange = vi.fn();
    render(
      <DateRangePicker
        allowClear
        defaultValue={[new Date(2026, 0, 1), new Date(2026, 0, 31)]}
        onChange={onChange}
      />,
    );
    clickClear();
    expect(onChange).toHaveBeenCalled();
    expect(onChange.mock.calls.at(-1)).toEqual([
      [null, null],
      ['', ''],
    ]);
  });

  it('controlled state from pattern 4 round-trips', () => {
    render(<Pattern4 />);
    fireEvent.click(inputs()[0]);
    const base = dayjs();
    pick(base.date(10).format('YYYY-MM-DD'));
    pick(base.date(20).format('YYYY-MM-DD'));
    expect(inputs().map((i) => i.value)).toEqual([
      base.date(10).format('YYYY-MM-DD'),
      base.date(20).format('YYYY-MM-DD'),
    ]);
  });

  it('renders patterns 3 and 8 without errors', () => {
    render(<Pattern3 />);
    render(<Pattern8 />);
    expect(screen.getAllByRole('textbox').length).toBeGreaterThan(0);
  });
});
