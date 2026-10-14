import { act, cleanup, fireEvent, screen } from '@testing-library/react';
import dayjs, { type Dayjs } from 'dayjs';
import type { RefObject } from 'react';

import type { RangePickerRef } from '../core/interface';
import DateRangePicker from '../DateRangePicker';
import { render } from './render';

if (!globalThis.ResizeObserver) {
  globalThis.ResizeObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
  } as any;
}

const inputs = () => screen.getAllByRole('textbox') as HTMLInputElement[];
const openAt = (index: 0 | 1) => fireEvent.click(inputs()[index]);
const cell = (title: string) =>
  document.querySelector<HTMLElement>(`.lobe-picker-dropdown td[title="${title}"]`)!;
const pick = (title: string) => fireEvent.click(cell(title).querySelector('div')!);
const days = (dates: [Dayjs | null, Dayjs | null] | null) =>
  dates?.map((date) => date?.format('YYYY-MM-DD') ?? null);

describe('DateRangePicker', () => {
  afterEach(cleanup);

  test('renders two inputs with placeholders and two month panels', () => {
    render(<DateRangePicker />);

    expect(inputs().map((input) => input.placeholder)).toEqual(['Start date', 'End date']);

    openAt(0);
    expect(document.querySelectorAll('.lobe-picker-date-panel')).toHaveLength(2);
  });

  test('defaultValue / value render as Dayjs pairs', () => {
    const { rerender } = render(
      <DateRangePicker defaultValue={[dayjs('2026-09-22'), dayjs('2026-10-08')]} />,
    );
    expect(inputs().map((input) => input.value)).toEqual(['2026-09-22', '2026-10-08']);

    rerender(<DateRangePicker value={[dayjs('2027-01-01'), dayjs('2027-01-05')]} />);
    expect(inputs().map((input) => input.value)).toEqual(['2027-01-01', '2027-01-05']);
  });

  test('picking start then end emits (dates, dateStrings)', () => {
    const onChange = vi.fn();
    const onCalendarChange = vi.fn();
    render(
      <DateRangePicker
        defaultPickerValue={[dayjs('2026-10-01'), dayjs('2026-11-01')]}
        onCalendarChange={onCalendarChange}
        onChange={onChange}
      />,
    );

    openAt(0);
    pick('2026-10-10');
    expect(onCalendarChange.mock.calls[0][2]).toEqual({ range: 'start' });
    pick('2026-11-05');

    const [dates, dateStrings] = onChange.mock.calls.at(-1)!;
    expect(days(dates)).toEqual(['2026-10-10', '2026-11-05']);
    expect(dateStrings).toEqual(['2026-10-10', '2026-11-05']);
    expect(onCalendarChange.mock.calls.at(-1)![2]).toEqual({ range: 'end' });
  });

  test('emits an ordered pair even when the end is picked earlier than the start', () => {
    const onChange = vi.fn();
    render(<DateRangePicker defaultPickerValue={dayjs('2026-10-01')} onChange={onChange} />);

    openAt(0);
    pick('2026-10-20');
    pick('2026-10-08');

    expect(days(onChange.mock.calls.at(-1)![0])).toEqual(['2026-10-08', '2026-10-20']);
  });

  test('clear emits null', () => {
    const onChange = vi.fn();
    render(
      <DateRangePicker
        defaultValue={[dayjs('2026-09-22'), dayjs('2026-10-08')]}
        onChange={onChange}
      />,
    );

    fireEvent.click(screen.getByRole('button', { name: 'Clear' }));

    expect(onChange).toHaveBeenCalledWith(null, null);
  });

  test('separator, status, size and onClear apply to the range picker', () => {
    const onClear = vi.fn();
    render(
      <DateRangePicker
        defaultValue={[dayjs('2026-09-22'), dayjs('2026-10-08')]}
        separator="~"
        size="small"
        status="warning"
        onClear={onClear}
      />,
    );

    expect(document.querySelector('.lobe-picker-range-separator')!.textContent).toBe('~');
    expect(document.querySelector('.lobe-picker-range.lobe-picker-status-warning')).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: 'Clear' }));
    expect(onClear).toHaveBeenCalledTimes(1);
  });

  test('mode tuple is controlled and reported through onPanelChange', () => {
    const onPanelChange = vi.fn();
    render(
      <DateRangePicker
        open
        defaultPickerValue={dayjs('2026-01-01')}
        mode={['month', 'month']}
        onPanelChange={onPanelChange}
      />,
    );

    expect(document.querySelectorAll('.lobe-picker-month-panel').length).toBeGreaterThan(0);
    fireEvent.click(document.querySelector('.lobe-picker-year-btn')!);

    const [, modes] = onPanelChange.mock.calls.at(-1)!;
    expect(modes).toEqual(['year', 'month']);
  });

  test('pickerValue tuple is controlled', () => {
    const onPickerValueChange = vi.fn();
    render(
      <DateRangePicker
        open
        pickerValue={[dayjs('2030-02-01'), dayjs('2030-03-01')]}
        onPickerValueChange={onPickerValueChange}
      />,
    );

    expect(cell('2030-02-14')).toBeTruthy();
    fireEvent.click(document.querySelector('.lobe-picker-header-prev-btn')!);
    const [dates, info] = onPickerValueChange.mock.calls.at(-1)!;
    expect(dates[0].format('YYYY-MM')).toBe('2030-01');
    expect(info).toMatchObject({ source: 'panel' });
  });

  test('minDate / maxDate limit both ends', () => {
    render(
      <DateRangePicker
        open
        defaultPickerValue={dayjs('2026-10-01')}
        maxDate={dayjs('2026-11-10')}
        minDate={dayjs('2026-10-05')}
      />,
    );

    expect(cell('2026-10-04').className).toContain('lobe-picker-cell-disabled');
    expect(cell('2026-10-05').className).not.toContain('lobe-picker-cell-disabled');
    expect(cell('2026-11-11').className).toContain('lobe-picker-cell-disabled');
  });

  test('ref exposes focus, blur and nativeElement', () => {
    const ref: RefObject<RangePickerRef | null> = { current: null };
    render(<DateRangePicker ref={ref} />);

    expect(ref.current!.nativeElement.classList.contains('lobe-picker-range')).toBe(true);
    act(() => ref.current!.focus());
    expect(document.activeElement).toBe(inputs()[0]);
    act(() => ref.current!.blur());
    expect(document.activeElement).not.toBe(inputs()[0]);
  });
});

describe('DateRangePicker sizing', () => {
  it('sizes to content: both inputs keep a natural size', () => {
    const { container } = render(<DateRangePicker />);
    const root = container.querySelector<HTMLElement>('.lobe-picker')!;
    expect(root.classList.contains('lobe-picker-root')).toBe(true);
    const inputs = root.querySelectorAll('input');
    expect(inputs).toHaveLength(2);
    inputs.forEach((input) => expect(Number(input.getAttribute('size'))).toBeGreaterThan(0));
  });
});
