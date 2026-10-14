import { act, cleanup, fireEvent, render as rtlRender, screen } from '@testing-library/react';
import dayjs, { type Dayjs } from 'dayjs';
import { motion } from 'motion/react';
import type { ReactNode, RefObject } from 'react';

import { MotionProvider } from '@/MotionProvider';

import DateRangePicker from '../DateRangePicker';
import type { RangePickerRef } from '../type';

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
/** Focus (as a real click does in the browser), then click to open. */
const openAt = (index: 0 | 1) => {
  act(() => inputs()[index].focus());
  fireEvent.click(inputs()[index]);
};
const cell = (title: string) =>
  document.querySelector<HTMLElement>(`.lobe-picker-dropdown td[title="${title}"]`)!;
const pick = (title: string) => fireEvent.click(cell(title).querySelector('div')!);
const days = (dates: [Dayjs | null, Dayjs | null] | null) =>
  dates?.map((date) => date?.format('YYYY-MM-DD') ?? null);
const pickerValue: [Dayjs, Dayjs] = [dayjs('2026-10-01'), dayjs('2026-11-01')];

describe('DateRangePicker interaction (WP-6)', () => {
  afterEach(cleanup);

  test('allowEmpty [false, true] commits a range with an empty end', () => {
    const onChange = vi.fn();
    render(
      <DateRangePicker
        allowEmpty={[false, true]}
        defaultPickerValue={pickerValue}
        onChange={onChange}
      />,
    );

    openAt(0);
    pick('2026-10-10');
    // Picking the start moves focus to the end; leaving it empty with Tab commits.
    expect(document.activeElement).toBe(inputs()[1]);
    fireEvent.keyDown(inputs()[1], { key: 'Tab' });

    expect(days(onChange.mock.lastCall![0])).toEqual(['2026-10-10', null]);
    expect(onChange.mock.lastCall![1]).toEqual(['2026-10-10', '']);
  });

  test('allowEmpty renders [null, dayjs] / [dayjs, null] / [null, null] values', () => {
    const { rerender } = render(<DateRangePicker allowEmpty value={[null, dayjs('2026-10-08')]} />);
    expect(inputs().map((input) => input.value)).toEqual(['', '2026-10-08']);

    rerender(<DateRangePicker allowEmpty value={[dayjs('2026-09-22'), null]} />);
    expect(inputs().map((input) => input.value)).toEqual(['2026-09-22', '']);

    rerender(<DateRangePicker allowEmpty value={[null, null]} />);
    expect(inputs().map((input) => input.value)).toEqual(['', '']);
  });

  test('without allowEmpty an empty end is not committed', () => {
    const onChange = vi.fn();
    render(<DateRangePicker defaultPickerValue={pickerValue} onChange={onChange} />);

    openAt(0);
    pick('2026-10-10');
    fireEvent.keyDown(inputs()[1], { key: 'Tab' });

    expect(onChange).not.toHaveBeenCalled();
  });

  test('disabled tuple disables only the given end', () => {
    const onChange = vi.fn();
    render(
      <DateRangePicker
        defaultPickerValue={pickerValue}
        defaultValue={[dayjs('2026-10-01'), dayjs('2026-10-20')]}
        disabled={[false, true]}
        onChange={onChange}
      />,
    );

    expect(inputs().map((input) => input.disabled)).toEqual([false, true]);

    openAt(0);
    pick('2026-10-05');
    expect(days(onChange.mock.lastCall![0])).toEqual(['2026-10-05', '2026-10-20']);
  });

  test('id object lands on the start and end inputs', () => {
    render(<DateRangePicker id={{ end: 'range-end', start: 'range-start' }} />);

    expect(inputs().map((input) => input.id)).toEqual(['range-start', 'range-end']);
  });

  test('onFocus / onBlur report info.range', () => {
    const onFocus = vi.fn();
    const onBlur = vi.fn();
    render(<DateRangePicker onBlur={onBlur} onFocus={onFocus} />);

    fireEvent.focus(inputs()[1]);
    expect(onFocus.mock.lastCall![1]).toEqual({ range: 'end' });
    fireEvent.blur(inputs()[1]);
    expect(onBlur.mock.lastCall![1]).toEqual({ range: 'end' });

    fireEvent.focus(inputs()[0]);
    expect(onFocus.mock.lastCall![1]).toEqual({ range: 'start' });
    fireEvent.blur(inputs()[0]);
    expect(onBlur.mock.lastCall![1]).toEqual({ range: 'start' });
  });

  test('clicking the end input first picks the end, then the start', () => {
    const onChange = vi.fn();
    const onCalendarChange = vi.fn();
    render(
      <DateRangePicker
        defaultPickerValue={pickerValue}
        onCalendarChange={onCalendarChange}
        onChange={onChange}
      />,
    );

    openAt(1);
    expect(document.querySelector('.lobe-picker-input-active')).toBe(
      inputs()[1].closest('.lobe-picker-input'),
    );

    pick('2026-11-05');
    expect(onCalendarChange.mock.calls[0][2]).toEqual({ range: 'end' });
    expect(days(onCalendarChange.mock.calls[0][0])).toEqual([null, '2026-11-05']);

    pick('2026-10-10');
    expect(onCalendarChange.mock.lastCall![2]).toEqual({ range: 'start' });
    expect(days(onChange.mock.lastCall![0])).toEqual(['2026-10-10', '2026-11-05']);
  });

  test('Tab switches the active end from start to end', () => {
    const onFocus = vi.fn();
    // As in antd, an empty start that does not allow empty keeps the focus.
    render(
      <DateRangePicker
        defaultValue={[dayjs('2026-10-10'), dayjs('2026-10-20')]}
        onFocus={onFocus}
      />,
    );

    openAt(0);
    // jsdom does not move focus on Tab; the browser focuses the next input, as here.
    fireEvent.keyDown(inputs()[0], { key: 'Tab' });
    act(() => inputs()[1].focus());

    expect(document.activeElement).toBe(inputs()[1]);
    expect(onFocus.mock.lastCall![1]).toEqual({ range: 'end' });
    expect(document.querySelector('.lobe-picker-input-active')).toBe(
      inputs()[1].closest('.lobe-picker-input'),
    );
  });

  test('disabledDate receives info.from once one end is picked', () => {
    const disabledDate = vi.fn(
      (current: Dayjs, { from }: { from?: Dayjs; type: string }) =>
        !!from && Math.abs(current.diff(from, 'day')) >= 7,
    );
    render(<DateRangePicker defaultPickerValue={pickerValue} disabledDate={disabledDate} />);

    openAt(0);
    expect(disabledDate.mock.calls.every(([, info]) => info.from === undefined)).toBe(true);

    pick('2026-10-28');
    const withFrom = disabledDate.mock.calls.find(([, info]) => info.from);
    expect(withFrom![1].from!.format('YYYY-MM-DD')).toBe('2026-10-28');
    expect(withFrom![1].type).toBe('date');
    // The end panel now shows November / December: 6 days later is allowed, 7 is not.
    expect(cell('2026-11-03').className).not.toContain('lobe-picker-cell-disabled');
    expect(cell('2026-11-04').className).toContain('lobe-picker-cell-disabled');
  });

  test('order defaults to true and swaps a reversed range', () => {
    const onChange = vi.fn();
    render(
      <DateRangePicker
        defaultPickerValue={pickerValue}
        defaultValue={[dayjs('2026-10-10'), dayjs('2026-10-20')]}
        onChange={onChange}
      />,
    );

    // Typing an end before the start: with order the pair is swapped.
    openAt(1);
    fireEvent.change(inputs()[1], { target: { value: '2026-10-01' } });
    fireEvent.keyDown(inputs()[1], { key: 'Enter' });
    fireEvent.keyDown(inputs()[1], { key: 'Tab' });

    expect(days(onChange.mock.lastCall![0])).toEqual(['2026-10-01', '2026-10-10']);
    expect(inputs().map((input) => input.value)).toEqual(['2026-10-01', '2026-10-10']);
  });

  test('order={false} keeps a reversed range as entered', () => {
    const onChange = vi.fn();
    render(
      <DateRangePicker
        defaultValue={[dayjs('2026-10-10'), dayjs('2026-10-20')]}
        order={false}
        onChange={onChange}
      />,
    );

    openAt(1);
    fireEvent.change(inputs()[1], { target: { value: '2026-10-01' } });
    fireEvent.keyDown(inputs()[1], { key: 'Enter' });
    fireEvent.keyDown(inputs()[1], { key: 'Tab' });

    expect(days(onChange.mock.lastCall![0])).toEqual(['2026-10-10', '2026-10-01']);
    expect(inputs().map((input) => input.value)).toEqual(['2026-10-10', '2026-10-01']);
  });

  test('ref.focus(index) focuses the given end', () => {
    const ref: RefObject<RangePickerRef | null> = { current: null };
    render(<DateRangePicker defaultValue={[dayjs('2026-10-10'), dayjs('2026-10-20')]} ref={ref} />);

    act(() => ref.current!.focus(1));
    expect(document.activeElement).toBe(inputs()[1]);

    act(() => ref.current!.blur());
    act(() => ref.current!.focus({ index: 0 }));
    expect(document.activeElement).toBe(inputs()[0]);

    act(() => ref.current!.blur());
    act(() => ref.current!.focus(1));
    expect(document.activeElement).toBe(inputs()[1]);
    act(() => ref.current!.blur());
    act(() => ref.current!.focus());
    expect(document.activeElement).toBe(inputs()[0]);
  });

  test('showTime: start and end each pick their own time, OK moves to the end', () => {
    const onChange = vi.fn();
    const onCalendarChange = vi.fn();
    render(
      <DateRangePicker
        defaultPickerValue={pickerValue}
        showTime={{ format: 'HH:mm' }}
        onCalendarChange={onCalendarChange}
        onChange={onChange}
      />,
    );

    openAt(0);
    pick('2026-10-10');
    const ok = () => document.querySelector<HTMLButtonElement>('.lobe-picker-ok button')!;
    fireEvent.click(ok());
    expect(onCalendarChange.mock.lastCall![2]).toEqual({ range: 'start' });
    expect(document.activeElement).toBe(inputs()[1]);

    pick('2026-11-12');
    expect(onCalendarChange.mock.lastCall![2]).toEqual({ range: 'end' });
    fireEvent.click(ok());
    expect(days(onChange.mock.lastCall![0])).toEqual(['2026-10-10', '2026-11-12']);
  });
});
