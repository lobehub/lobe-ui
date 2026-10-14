import { cleanup, fireEvent, render as rtlRender } from '@testing-library/react';
import dayjs, { type Dayjs } from 'dayjs';
import { motion } from 'motion/react';
import type { ReactNode } from 'react';
import { useState } from 'react';

import { MotionProvider } from '@/MotionProvider';

import DatePicker from '../DatePicker';
import type { DatePickerProps, PickerTagProps } from '../type';

if (!globalThis.ResizeObserver) {
  globalThis.ResizeObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
  } as any;
}

const Wrapper = ({ children }: { children: ReactNode }) => (
  <MotionProvider motion={motion}>{children}</MotionProvider>
);
const render = (ui: ReactNode) => rtlRender(ui, { wrapper: Wrapper });

const root = () => document.querySelector<HTMLElement>('.lobe-picker')!;
const popup = () => document.querySelector<HTMLElement>('.lobe-picker-dropdown');
const cell = (title: string) =>
  document.querySelector<HTMLElement>(`.lobe-picker-dropdown td[title="${title}"]`)!;
const tags = () =>
  [...root().querySelectorAll<HTMLElement>('.lobe-picker-selection-item-content')].map(
    (node) => node.textContent,
  );
const fmt = (dates?: Dayjs[] | null) => dates?.map((date) => date.format('YYYY-MM-DD'));

const jan = (day: number) => dayjs('2024-01-01').date(day);

describe('DatePicker multiple', () => {
  afterEach(cleanup);

  test('renders each value as a tag and the readonly input carries them all', () => {
    render(<DatePicker multiple defaultValue={[jan(1), jan(3)]} />);
    expect(root().classList.contains('lobe-picker-multiple')).toBe(true);
    expect(tags()).toEqual(['2024-01-01', '2024-01-03']);
    const input = root().querySelector<HTMLInputElement>('.lobe-picker-multiple-input')!;
    expect(input.readOnly).toBe(true);
    expect(input.value).toBe('2024-01-01,2024-01-03');
  });

  test('a click toggles a date; the list commits on close (needConfirm defaults to false)', () => {
    const onCalendarChange = vi.fn();
    const onChange = vi.fn();
    const { rerender } = render(
      <DatePicker
        multiple
        open
        defaultValue={[jan(5)]}
        onCalendarChange={onCalendarChange}
        onChange={onChange}
      />,
    );
    // No OK button: multiple needs no confirmation.
    expect(popup()!.querySelector('.lobe-picker-ok')).toBeNull();

    fireEvent.click(cell('2024-01-02'));
    expect(fmt(onCalendarChange.mock.calls[0][0])).toEqual(['2024-01-02', '2024-01-05']);
    expect(onCalendarChange.mock.calls[0][1]).toEqual(['2024-01-02', '2024-01-05']);
    expect(tags()).toEqual(['2024-01-02', '2024-01-05']);

    // Clicking a picked cell again removes it.
    fireEvent.click(cell('2024-01-05'));
    expect(fmt(onCalendarChange.mock.calls[1][0])).toEqual(['2024-01-02']);
    expect(tags()).toEqual(['2024-01-02']);
    expect(onChange).not.toHaveBeenCalled();

    rerender(
      <DatePicker
        multiple
        defaultValue={[jan(5)]}
        open={false}
        onCalendarChange={onCalendarChange}
        onChange={onChange}
      />,
    );
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(fmt(onChange.mock.calls[0][0])).toEqual(['2024-01-02']);
    expect(onChange.mock.calls[0][1]).toEqual(['2024-01-02']);
  });

  test('order sorts the dates by default; order={false} keeps picking order', () => {
    const sorted = vi.fn();
    const { unmount } = render(
      <DatePicker multiple open defaultValue={[jan(20)]} onCalendarChange={sorted} />,
    );
    fireEvent.click(cell('2024-01-10'));
    fireEvent.click(cell('2024-01-05'));
    expect(sorted.mock.calls[1][1]).toEqual(['2024-01-05', '2024-01-10', '2024-01-20']);
    expect(tags()).toEqual(['2024-01-05', '2024-01-10', '2024-01-20']);
    unmount();

    const unordered = vi.fn();
    const onChange = vi.fn();
    const { rerender } = render(
      <DatePicker
        multiple
        open
        defaultValue={[jan(20)]}
        order={false}
        onCalendarChange={unordered}
        onChange={onChange}
      />,
    );
    fireEvent.click(cell('2024-01-10'));
    fireEvent.click(cell('2024-01-05'));
    expect(unordered.mock.calls[1][1]).toEqual(['2024-01-20', '2024-01-10', '2024-01-05']);
    expect(tags()).toEqual(['2024-01-20', '2024-01-10', '2024-01-05']);
    rerender(
      <DatePicker
        multiple
        defaultValue={[jan(20)]}
        open={false}
        order={false}
        onCalendarChange={unordered}
        onChange={onChange}
      />,
    );
    expect(onChange.mock.calls[0][1]).toEqual(['2024-01-20', '2024-01-10', '2024-01-05']);
  });

  test('needConfirm can still be turned on', () => {
    const onChange = vi.fn();
    render(<DatePicker multiple needConfirm open defaultValue={[jan(5)]} onChange={onChange} />);
    fireEvent.click(cell('2024-01-02'));
    expect(onChange).not.toHaveBeenCalled();
    fireEvent.click(popup()!.querySelector<HTMLElement>('.lobe-picker-ok button')!);
    expect(fmt(onChange.mock.calls[0][0])).toEqual(['2024-01-02', '2024-01-05']);
  });

  test('the remove icon drops a date; removeIcon replaces it', () => {
    const onChange = vi.fn();
    render(
      <DatePicker
        multiple
        defaultValue={[jan(1), jan(3)]}
        removeIcon={<i data-testid="remove">x</i>}
        onChange={onChange}
      />,
    );
    const removes = root().querySelectorAll<HTMLElement>('.lobe-picker-selection-item-remove');
    expect(removes).toHaveLength(2);
    expect(removes[0].querySelector('[data-testid="remove"]')).toBeTruthy();

    fireEvent.click(removes[0]);
    expect(fmt(onChange.mock.calls[0][0])).toEqual(['2024-01-03']);
    expect(tags()).toEqual(['2024-01-03']);
  });

  test('defaults to the lobe X remove icon', () => {
    render(<DatePicker multiple defaultValue={[jan(1)]} />);
    const remove = root().querySelector('.lobe-picker-selection-item-remove')!;
    expect(remove.querySelector('svg.lucide')).toBeTruthy();
  });

  test('maxTagCount folds the rest into a "+ N ..." tag', () => {
    render(<DatePicker multiple defaultValue={[jan(1), jan(2), jan(3), jan(4)]} maxTagCount={2} />);
    expect(tags()).toEqual(['2024-01-01', '2024-01-02', '+ 2 ...']);
  });

  test('maxTagCount="responsive" measures the tags with rc-overflow', () => {
    render(<DatePicker multiple defaultValue={[jan(1), jan(2)]} maxTagCount="responsive" />);
    const overflow = root().querySelector('.lobe-picker-selection-overflow')!;
    // jsdom has no layout, so tags are measured as not fitting and folded into the rest.
    expect(overflow.querySelector('.lobe-picker-selection-overflow-item-rest')).toBeTruthy();
    expect(tags().at(-1)).toMatch(/^\+ \d+ \.\.\.$/);
  });

  test('tagRender renders each tag with its label, value and onClose', () => {
    const onChange = vi.fn();
    const tagRender = vi.fn(({ label, onClose, value }: PickerTagProps) => (
      <span className="custom-tag" data-date={value.format('YYYY-MM-DD')}>
        {label}
        <button type="button" onClick={onClose}>
          remove
        </button>
      </span>
    ));
    render(
      <DatePicker
        multiple
        defaultValue={[jan(1), jan(2)]}
        tagRender={tagRender}
        onChange={onChange}
      />,
    );
    const custom = [...root().querySelectorAll<HTMLElement>('.custom-tag')];
    expect(custom.map((node) => node.dataset.date)).toEqual(['2024-01-01', '2024-01-02']);
    expect(tagRender.mock.calls[0][0]).toMatchObject({
      closable: true,
      disabled: false,
      label: '2024-01-01',
    });

    fireEvent.click(custom[1].querySelector('button')!);
    expect(fmt(onChange.mock.calls[0][0])).toEqual(['2024-01-01']);
  });

  test('disabled: tags have no remove icon', () => {
    render(<DatePicker disabled multiple defaultValue={[jan(1)]} />);
    expect(root().classList.contains('lobe-picker-disabled')).toBe(true);
    expect(root().querySelector('.lobe-picker-selection-item-remove')).toBeNull();
  });

  test('shows the placeholder while empty', () => {
    render(<DatePicker multiple placeholder="Bamboo" />);
    expect(root().querySelector('.lobe-picker-selection-placeholder')?.textContent).toBe('Bamboo');
  });

  test('clearing commits an empty list', () => {
    const onChange = vi.fn();
    render(<DatePicker multiple defaultValue={[jan(1)]} onChange={onChange} />);
    fireEvent.mouseDown(root().querySelector('.lobe-picker-clear')!);
    fireEvent.mouseUp(root().querySelector('.lobe-picker-clear')!);
    fireEvent.click(root().querySelector('.lobe-picker-clear')!);
    expect(onChange).toHaveBeenCalled();
    expect(onChange.mock.lastCall![0] ?? []).toEqual([]);
    expect(tags()).toEqual([]);
  });

  test('controlled value follows onChange', () => {
    const Controlled = ({ open }: { open: boolean }) => {
      const [value, setValue] = useState<Dayjs[]>(() => [jan(4)]);
      return (
        <>
          <DatePicker
            multiple
            open={open}
            value={value}
            onChange={(dates) => setValue(dates ?? [])}
          />
          <output>{fmt(value)?.join(',')}</output>
        </>
      );
    };
    const { rerender } = render(<Controlled open />);
    fireEvent.click(cell('2024-01-06'));
    expect(tags()).toEqual(['2024-01-04', '2024-01-06']);
    rerender(<Controlled open={false} />);
    expect(document.querySelector('output')!.textContent).toBe('2024-01-04,2024-01-06');
    expect(tags()).toEqual(['2024-01-04', '2024-01-06']);
  });

  test('works on the month, quarter, year and week pickers', () => {
    const onChange = vi.fn();
    const { unmount } = render(
      <DatePicker
        multiple
        open
        defaultValue={[dayjs('2024-02-01')]}
        picker="month"
        onCalendarChange={onChange}
      />,
    );
    fireEvent.click(cell('2024-05'));
    expect(onChange.mock.calls[0][1]).toEqual(['2024-02', '2024-05']);
    unmount();

    for (const [picker, value, title, expected] of [
      ['year', '2024-01-01', '2026', ['2024', '2026']],
      ['quarter', '2024-01-01', '2024-Q3', ['2024-Q1', '2024-Q3']],
    ] as const) {
      const onPick = vi.fn();
      const view = render(
        <DatePicker
          multiple
          open
          defaultValue={[dayjs(value)]}
          picker={picker}
          onCalendarChange={onPick}
        />,
      );
      fireEvent.click(cell(title));
      expect(onPick.mock.calls[0][1]).toEqual(expected);
      view.unmount();
    }

    const onWeek = vi.fn();
    render(
      <DatePicker multiple open defaultValue={[jan(1)]} picker="week" onCalendarChange={onWeek} />,
    );
    fireEvent.click(cell('2024-01-17'));
    expect(onWeek.mock.calls[0][1]).toHaveLength(2);
    // Every picked week row is styled as selected through the multiple popup class.
    expect(popup()!.classList.contains('lobe-picker-dropdown-multiple')).toBe(true);
    const pickedRows = popup()!.querySelectorAll(
      ':is(.lobe-picker-week-panel-row-selected, .lobe-picker-week-panel-row-hover)',
    );
    expect(pickedRows).toHaveLength(2);
    expect(tags()).toHaveLength(2);
  });

  test('types: multiple infers Dayjs[] values', () => {
    const onChange: DatePickerProps<Dayjs[]>['onChange'] = (dates, strings) => {
      expectTypeOf(dates).toEqualTypeOf<Dayjs[] | null>();
      expectTypeOf(strings).toEqualTypeOf<string[]>();
    };
    const single: DatePickerProps['onChange'] = (date, string) => {
      expectTypeOf(date).toEqualTypeOf<Dayjs | null>();
      expectTypeOf(string).toEqualTypeOf<string | null>();
    };
    render(
      <>
        <DatePicker
          multiple
          defaultValue={[jan(1)]}
          onChange={(dates) => expectTypeOf(dates).toEqualTypeOf<Dayjs[] | null>()}
        />
        <DatePicker multiple onChange={onChange} />
        <DatePicker onChange={single} />
      </>,
    );
    expect(document.querySelectorAll('.lobe-picker')).toHaveLength(3);
  });
});
