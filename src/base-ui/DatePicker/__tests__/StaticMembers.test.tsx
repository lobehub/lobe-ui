import type { GenerateConfig } from '@rc-component/picker/generate';
import dayjsGenerateConfig from '@rc-component/picker/generate/dayjs';
import { act, cleanup, fireEvent, render as rtlRender, screen } from '@testing-library/react';
import dayjs, { type Dayjs } from 'dayjs';
import { motion } from 'motion/react';
import type { ReactNode } from 'react';
import { expectTypeOf } from 'vitest';

import { MotionProvider } from '@/MotionProvider';

import * as entry from '..';
import DatePicker from '../DayjsDatePicker';
import DateRangePicker from '../DayjsDateRangePicker';
import generatePicker from '../generatePicker';
import type {
  DatePickerProps,
  DatePickerSemanticType,
  MonthPickerProps,
  PickerProps,
  RangePickerProps,
  TimePickerProps,
  WeekPickerProps,
} from '../type';

if (!globalThis.ResizeObserver) {
  globalThis.ResizeObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
  } as any;
}

// The OK button is a base-ui Button, which needs the motion component.
const Wrapper = ({ children }: { children: ReactNode }) => (
  <MotionProvider motion={motion}>{children}</MotionProvider>
);
const render = (ui: ReactNode) => rtlRender(ui, { wrapper: Wrapper });

const inputs = () => screen.getAllByRole('textbox') as HTMLInputElement[];
const input = () => inputs()[0];
const popup = () => document.querySelector<HTMLElement>('.lobe-picker-dropdown')!;
const cellByText = (text: string) =>
  [...popup().querySelectorAll<HTMLElement>('.lobe-picker-cell-in-view')].find(
    (node) => node.querySelector('.lobe-picker-cell-inner')?.textContent === text,
  )!;

/** A native `Date` adapter built over the Dayjs one: what a `generatePicker` user brings. */
const toDayjs = (arg: unknown) => (arg instanceof Date ? dayjs(arg) : arg);
const toDate = (result: unknown) => (dayjs.isDayjs(result) ? result.toDate() : result);
const wrap =
  (fn: (...args: any[]) => unknown) =>
  (...args: unknown[]) =>
    toDate(fn(...args.map(toDayjs)));
const { locale, ...methods } = dayjsGenerateConfig;
const dateGenerateConfig = {
  ...Object.fromEntries(Object.entries(methods).map(([name, fn]) => [name, wrap(fn as any)])),
  locale: Object.fromEntries(Object.entries(locale).map(([name, fn]) => [name, wrap(fn as any)])),
} as unknown as GenerateConfig<Date>;

describe('DatePicker static members', () => {
  afterEach(cleanup);

  test('DatePicker carries antd statics; DateRangePicker is DatePicker.RangePicker', () => {
    expect(DateRangePicker).toBe(DatePicker.RangePicker);
    expect(entry.DateRangePicker).toBe(entry.DatePicker.RangePicker);
    expect(entry.generatePicker).toBe(DatePicker.generatePicker);
    expect(DatePicker.generatePicker).toBe(generatePicker);
    expect(
      Object.fromEntries(
        (
          [
            'RangePicker',
            'WeekPicker',
            'MonthPicker',
            'YearPicker',
            'QuarterPicker',
            'TimePicker',
          ] as const
        ).map((name) => [name, DatePicker[name].displayName]),
      ),
    ).toEqual({
      MonthPicker: 'MonthPicker',
      QuarterPicker: 'QuarterPicker',
      RangePicker: 'RangePicker',
      TimePicker: 'TimePicker',
      WeekPicker: 'WeekPicker',
      YearPicker: 'YearPicker',
    });
    expect(DatePicker.displayName).toBe('DatePicker');
    expect(typeof DatePicker._InternalPanelDoNotUseOrYouWillBeFired).toBe('function');
    expect(typeof DatePicker._InternalRangePanelDoNotUseOrYouWillBeFired).toBe('function');
  });

  test('DatePicker.RangePicker renders two inputs and emits a Dayjs pair', () => {
    const onChange = vi.fn();
    render(<DatePicker.RangePicker defaultPickerValue={dayjs('2026-10-01')} onChange={onChange} />);
    expect(inputs().map((node) => node.placeholder)).toEqual(['Start date', 'End date']);

    fireEvent.click(inputs()[0]);
    fireEvent.click(popup().querySelector('td[title="2026-10-05"] div')!);
    fireEvent.click(popup().querySelector('td[title="2026-10-09"] div')!);
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange.mock.calls[0][1]).toEqual(['2026-10-05', '2026-10-09']);
  });

  test('each preset picker fixes `picker`: placeholder, panel, format and suffix icon', () => {
    const value = dayjs('2026-10-15 08:30:05');
    const cases = [
      [DatePicker.WeekPicker, 'Select week', 'week', '2026-42nd'],
      [DatePicker.MonthPicker, 'Select month', 'month', '2026-10'],
      [DatePicker.QuarterPicker, 'Select quarter', 'quarter', '2026-Q4'],
      [DatePicker.YearPicker, 'Select year', 'year', '2026'],
      [DatePicker.TimePicker, 'Select time', 'time', '08:30:05'],
    ] as const;
    for (const [Picker, placeholder, panel, text] of cases) {
      // A `picker` prop (not in the types) does not override the preset one, as in antd.
      const props = { picker: 'date' } as object;
      const { unmount, rerender } = render(<Picker {...props} />);
      expect(input().placeholder).toBe(placeholder);
      fireEvent.click(input());
      expect(popup().querySelector(`.lobe-picker-${panel}-panel`)).toBeTruthy();
      expect(popup().querySelector('.lobe-picker-date-panel')).toBeNull();
      rerender(<Picker {...props} value={value} />);
      expect(input().value).toBe(text);
      unmount();
    }
  });

  test('DatePicker.TimePicker uses the clock suffix and picks a time with OK', () => {
    const onChange = vi.fn();
    const { container } = render(
      <DatePicker.TimePicker
        defaultOpen
        defaultPickerValue={dayjs('2026-10-15 00:00:00')}
        onChange={onChange}
      />,
    );
    expect(container.querySelector('.lucide-clock')).toBeTruthy();

    fireEvent.click(
      popup().querySelector('.lobe-picker-time-panel-column[data-type="hour"] [data-value="9"]')!,
    );
    fireEvent.click(popup().querySelector('.lobe-picker-ok button')!);
    expect(onChange.mock.calls[0][1]).toBe('09:00:00');
  });

  test('MonthPicker supports multiple like DatePicker', () => {
    const onChange = vi.fn();
    const ui = (open: boolean) => (
      <DatePicker.MonthPicker
        multiple
        defaultPickerValue={dayjs('2026-01-01')}
        open={open}
        onChange={onChange}
      />
    );
    const { rerender } = render(ui(true));
    fireEvent.click(cellByText('Mar'));
    fireEvent.click(cellByText('Jan'));
    expect(onChange).not.toHaveBeenCalled();
    // Commits on close, as in antd.
    rerender(ui(false));
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange.mock.calls[0][1]).toEqual(['2026-01', '2026-03']);
  });
});

describe('DatePicker pure panels', () => {
  afterEach(cleanup);

  test('_InternalPanelDoNotUseOrYouWillBeFired renders the popup inline and keeps it open', async () => {
    const PurePanel = DatePicker._InternalPanelDoNotUseOrYouWillBeFired;
    const onChange = vi.fn();
    const { container } = render(
      <PurePanel defaultPickerValue={dayjs('2026-10-01')} onChange={onChange} />,
    );
    await act(async () => {});

    // Inside the holder, not portaled to document.body.
    const holder = container.firstElementChild as HTMLElement;
    expect(holder.style.position).toBe('relative');
    expect(holder.querySelector('.lobe-picker-dropdown .lobe-picker-date-panel')).toBeTruthy();
    expect(popup().style.zIndex).toBe('auto');

    fireEvent.click(popup().querySelector('td[title="2026-10-15"] div')!);
    expect(onChange.mock.calls[0][1]).toBe('2026-10-15');
    fireEvent.mouseDown(document.body);
    await act(async () => {});
    expect(holder.querySelector('.lobe-picker-dropdown')).toBeTruthy();
    expect(popup().className).not.toContain('lobe-picker-dropdown-hidden');
  });

  test('_InternalPanelDoNotUseOrYouWillBeFired takes picker props and function styles', async () => {
    const PurePanel = DatePicker._InternalPanelDoNotUseOrYouWillBeFired;
    const { container } = render(
      <PurePanel picker="month" styles={() => ({ popup: { container: { color: 'red' } } })} />,
    );
    await act(async () => {});
    expect(container.querySelector('.lobe-picker-dropdown .lobe-picker-month-panel')).toBeTruthy();
    expect(popup().style.zIndex).toBe('auto');
    expect(popup().querySelector<HTMLElement>('.lobe-picker-panel-container')!.style.color).toBe(
      'red',
    );
  });

  test('_InternalRangePanelDoNotUseOrYouWillBeFired renders both month panels inline', async () => {
    const PureRangePanel = DatePicker._InternalRangePanelDoNotUseOrYouWillBeFired;
    const { container } = render(<PureRangePanel />);
    await act(async () => {});
    expect(inputs()).toHaveLength(2);
    expect(
      container.querySelectorAll('.lobe-picker-dropdown .lobe-picker-date-panel'),
    ).toHaveLength(2);
  });
});

describe('generatePicker', () => {
  afterEach(cleanup);

  const DateFnsLikePicker = generatePicker<Date>(dateGenerateConfig);

  test('returns a DatePicker with all statics', () => {
    for (const name of [
      'RangePicker',
      'WeekPicker',
      'MonthPicker',
      'YearPicker',
      'QuarterPicker',
      'TimePicker',
    ] as const) {
      expect(typeof DateFnsLikePicker[name]).toBe('function');
    }
    expect(DateFnsLikePicker).not.toBe(DatePicker);
  });

  test('reads and writes values of the given date library', () => {
    const onChange = vi.fn();
    render(<DateFnsLikePicker defaultValue={new Date(2026, 9, 15)} onChange={onChange} />);
    expect(input().value).toBe('2026-10-15');

    fireEvent.click(input());
    fireEvent.click(popup().querySelector('td[title="2026-10-20"] div')!);
    const [date, dateString] = onChange.mock.calls[0];
    expect(date).toBeInstanceOf(Date);
    expect(dateString).toBe('2026-10-20');
    expect((date as Date).getDate()).toBe(20);
  });

  test('RangePicker emits a pair of the given date type', () => {
    const onChange = vi.fn();
    render(
      <DateFnsLikePicker.RangePicker
        defaultPickerValue={new Date(2026, 9, 1)}
        onChange={onChange}
      />,
    );
    fireEvent.click(inputs()[0]);
    fireEvent.click(popup().querySelector('td[title="2026-10-05"] div')!);
    fireEvent.click(popup().querySelector('td[title="2026-10-09"] div')!);
    const [dates, dateStrings] = onChange.mock.calls[0];
    expect(dates.every((date: unknown) => date instanceof Date)).toBe(true);
    expect(dateStrings).toEqual(['2026-10-05', '2026-10-09']);
  });

  test('month panel keyboard navigation runs on the given date type', () => {
    const onChange = vi.fn();
    render(
      <DateFnsLikePicker.MonthPicker defaultValue={new Date(2026, 9, 1)} onChange={onChange} />,
    );
    fireEvent.click(input());
    fireEvent.keyDown(input(), { key: 'ArrowDown' });
    fireEvent.keyDown(input(), { key: 'Enter' });
    expect(onChange.mock.calls[0][0]).toBeInstanceOf(Date);
    expect(onChange.mock.calls[0][1]).toBe('2027-01');
  });

  test('statics fix `picker` on the given date type', () => {
    render(<DateFnsLikePicker.YearPicker value={new Date(2031, 0, 1)} />);
    expect(input().placeholder).toBe('Select year');
    expect(input().value).toBe('2031');
  });
});

describe('antd-style type aliases', () => {
  test('match the component props', () => {
    expectTypeOf<WeekPickerProps>().toEqualTypeOf<MonthPickerProps>();
    expectTypeOf<PickerProps>().toEqualTypeOf<DatePickerProps>();
    expectTypeOf<[Dayjs | null | undefined, Dayjs | null | undefined]>().toMatchTypeOf<
      NonNullable<RangePickerProps<Dayjs>['value']>
    >();
    expectTypeOf<RangePickerProps<Dayjs>['onChange']>()
      .parameter(0)
      .toEqualTypeOf<[Dayjs | null, Dayjs | null] | null>();
    // The default (native Date) range never emits `null`: a cleared range is `[null, null]`.
    expectTypeOf<RangePickerProps<Date>['onChange']>()
      .parameter(0)
      .toEqualTypeOf<[Date | null, Date | null]>();
    expectTypeOf<Date | null | undefined>().toMatchTypeOf<PickerProps<Date>['value']>();
    expectTypeOf<TimePickerProps>().not.toHaveProperty('showTime');
    expectTypeOf<WeekPickerProps>().not.toHaveProperty('picker');
    expectTypeOf<DatePickerSemanticType['classNames']>().toMatchTypeOf<
      { root?: string; popup?: unknown } | undefined
    >();
  });
});
