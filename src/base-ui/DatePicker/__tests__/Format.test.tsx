import { act, cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import dayjs, { type Dayjs } from 'dayjs';
import { motion } from 'motion/react';

import { MotionProvider } from '@/MotionProvider';

import DatePicker from '../DayjsDatePicker';
import DateRangePicker from '../DayjsDateRangePicker';

if (!globalThis.ResizeObserver) {
  globalThis.ResizeObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
  } as any;
}

const input = () => screen.getByRole('textbox') as HTMLInputElement;
const inputs = () => screen.getAllByRole('textbox') as HTMLInputElement[];
const day = (date: Dayjs | null | undefined) => date?.format('YYYY-MM-DD');
const pick = (title: string) =>
  fireEvent.click(
    document.querySelector<HTMLElement>(`.lobe-picker-dropdown td[title="${title}"] div`)!,
  );

/** Types `text` into `el` and submits it with Enter. */
const typeAndEnter = (el: HTMLInputElement, text: string) => {
  fireEvent.click(el);
  fireEvent.change(el, { target: { value: text } });
  fireEvent.keyDown(el, { key: 'Enter' });
};

/** Presses each character of `keys` on a mask input. */
const pressKeys = (el: HTMLInputElement, keys: string) => {
  for (const key of keys) fireEvent.keyDown(el, { key });
};

describe('DatePicker format', () => {
  afterEach(cleanup);

  describe('default format (antd)', () => {
    test('date is YYYY-MM-DD and dateString uses it', () => {
      const onChange = vi.fn();
      render(<DatePicker defaultValue={dayjs('2026-10-15')} onChange={onChange} />);
      expect(input().value).toBe('2026-10-15');

      fireEvent.click(input());
      pick('2026-10-21');
      expect(onChange.mock.calls[0][1]).toBe('2026-10-21');
    });

    test('showTime defaults to YYYY-MM-DD HH:mm:ss', () => {
      render(<DatePicker showTime defaultValue={dayjs('2026-10-15 09:30:05')} />);
      expect(input().value).toBe('2026-10-15 09:30:05');
    });

    test('range picker uses the same default for both inputs', () => {
      render(<DateRangePicker defaultValue={[dayjs('2026-10-01'), dayjs('2026-10-15')]} />);
      expect(inputs().map((el) => el.value)).toEqual(['2026-10-01', '2026-10-15']);
    });
  });

  describe('string', () => {
    test('formats the value and the dateString, and parses typed text', () => {
      const onChange = vi.fn();
      render(
        <DatePicker defaultValue={dayjs('2015-01-01')} format="YYYY/MM/DD" onChange={onChange} />,
      );
      expect(input().value).toBe('2015/01/01');

      typeAndEnter(input(), '2026/10/13');
      const [date, dateString] = onChange.mock.calls.at(-1)!;
      expect(day(date)).toBe('2026-10-13');
      expect(dateString).toBe('2026/10/13');
      expect(input().value).toBe('2026/10/13');
    });

    test('text in another format is not parsed', async () => {
      const onChange = vi.fn();
      render(
        <DatePicker defaultValue={dayjs('2015-01-01')} format="YYYY/MM/DD" onChange={onChange} />,
      );
      typeAndEnter(input(), '2026-10-13');
      fireEvent.blur(input());

      expect(onChange).not.toHaveBeenCalled();
      await waitFor(() => expect(input().value).toBe('2015/01/01'));
    });

    test('picker="month" with a custom format', () => {
      const onChange = vi.fn();
      render(
        <DatePicker
          defaultValue={dayjs('2015-01-01')}
          format="YYYY/MM"
          picker="month"
          onChange={onChange}
        />,
      );
      expect(input().value).toBe('2015/01');

      typeAndEnter(input(), '2026/10');
      const [date, dateString] = onChange.mock.calls.at(-1)!;
      expect(date.format('YYYY-MM')).toBe('2026-10');
      expect(dateString).toBe('2026/10');
    });

    test('range picker formats and parses both ends', () => {
      const onChange = vi.fn();
      render(
        <DateRangePicker
          defaultValue={[dayjs('2015-01-01'), dayjs('2015-01-05')]}
          format="YYYY/MM/DD"
          onChange={onChange}
        />,
      );
      expect(inputs().map((el) => el.value)).toEqual(['2015/01/01', '2015/01/05']);

      const [start] = inputs();
      typeAndEnter(start, '2015/01/03');
      fireEvent.keyDown(inputs()[1], { key: 'Enter' });

      const [dates, dateStrings] = onChange.mock.calls.at(-1)!;
      expect(dates.map(day)).toEqual(['2015-01-03', '2015-01-05']);
      expect(dateStrings).toEqual(['2015/01/03', '2015/01/05']);
    });
  });

  describe('function', () => {
    test('receives a Dayjs and its result is shown and passed as dateString', () => {
      const format = vi.fn((value: Dayjs) => `custom format: ${value.format('YYYY/MM/DD')}`);
      const onChange = vi.fn();
      render(<DatePicker defaultValue={dayjs('2015-01-01')} format={format} onChange={onChange} />);

      expect(input().value).toBe('custom format: 2015/01/01');
      expect(format).toHaveBeenCalled();
      expect(format.mock.calls.every(([value]) => dayjs.isDayjs(value))).toBe(true);

      fireEvent.click(input());
      pick('2015-01-21');
      expect(onChange.mock.calls[0][1]).toBe('custom format: 2015/01/21');
      expect(input().value).toBe('custom format: 2015/01/21');
    });

    test('week range text built from a function (antd format demo)', () => {
      const weekFormat = (value: Dayjs) =>
        `${value.startOf('week').format('MM/DD')} ~ ${value.endOf('week').format('MM/DD')}`;
      render(<DatePicker defaultValue={dayjs('2026-10-14')} format={weekFormat} picker="week" />);

      const value = dayjs('2026-10-14');
      expect(input().value).toBe(
        `${value.startOf('week').format('MM/DD')} ~ ${value.endOf('week').format('MM/DD')}`,
      );
    });

    test('a function-only format does not parse typed text', async () => {
      const onChange = vi.fn();
      render(
        <DatePicker
          defaultValue={dayjs('2015-01-01')}
          format={(value) => `#${value.format('YYYY-MM-DD')}`}
          onChange={onChange}
        />,
      );
      typeAndEnter(input(), '2026-10-13');
      fireEvent.blur(input());

      expect(onChange).not.toHaveBeenCalled();
      await waitFor(() => expect(input().value).toBe('#2015-01-01'));
    });
  });

  describe('array', () => {
    const formats = ['DD/MM/YYYY', 'DD/MM/YY', 'DD-MM-YYYY', 'DD-MM-YY'];

    test('shows the value with the first format', () => {
      render(<DatePicker defaultValue={dayjs('2015-01-01')} format={formats} />);
      expect(input().value).toBe('01/01/2015');
    });

    test.each([
      ['13/10/2026', '2026-10-13'],
      ['13/10/26', '2026-10-13'],
      ['13-10-2026', '2026-10-13'],
      ['13-10-26', '2026-10-13'],
    ])('parses %s with any of the formats', (text, expected) => {
      const onChange = vi.fn();
      render(<DatePicker format={formats} onChange={onChange} />);

      typeAndEnter(input(), text);

      const [date, dateString] = onChange.mock.calls.at(-1)!;
      expect(day(date)).toBe(expected);
      // The committed value is shown and reported with the first format.
      expect(dateString).toBe(dayjs(expected).format('DD/MM/YYYY'));
      expect(input().value).toBe(dayjs(expected).format('DD/MM/YYYY'));
    });

    test('text matching none of the formats is rejected', async () => {
      const onChange = vi.fn();
      render(
        <DatePicker defaultValue={dayjs('2015-01-01')} format={formats} onChange={onChange} />,
      );
      typeAndEnter(input(), '2026.10.13');
      fireEvent.blur(input());

      expect(onChange).not.toHaveBeenCalled();
      await waitFor(() => expect(input().value).toBe('01/01/2015'));
    });

    test('a function first displays, the strings after it parse', () => {
      const onCalendarChange = vi.fn();
      render(
        <DatePicker
          defaultValue={dayjs('2015-01-01')}
          format={[(value: Dayjs) => `Day ${value.format('YYYY-MM-DD')}`, 'YYYY-MM-DD']}
          onCalendarChange={onCalendarChange}
        />,
      );
      expect(input().value).toBe('Day 2015-01-01');

      fireEvent.click(input());
      fireEvent.change(input(), { target: { value: '2026-10-13' } });
      // Parsed with the string format, then redrawn with the function (same as antd).
      expect(day(onCalendarChange.mock.calls.at(-1)![0])).toBe('2026-10-13');
      expect(input().value).toBe('Day 2026-10-13');
    });

    test('range picker parses either end with any of the formats', () => {
      const onChange = vi.fn();
      render(
        <DateRangePicker
          defaultValue={[dayjs('2015-01-01'), dayjs('2015-01-20')]}
          format={formats}
          onChange={onChange}
        />,
      );
      expect(inputs().map((el) => el.value)).toEqual(['01/01/2015', '20/01/2015']);

      typeAndEnter(inputs()[0], '05-01-15');
      fireEvent.keyDown(inputs()[1], { key: 'Enter' });

      const [dates, dateStrings] = onChange.mock.calls.at(-1)!;
      expect(dates.map(day)).toEqual(['2015-01-05', '2015-01-20']);
      expect(dateStrings).toEqual(['05/01/2015', '20/01/2015']);
    });
  });

  describe('mask ({ format, type: "mask" })', () => {
    const mask = { format: 'YYYY-MM-DD', type: 'mask' } as const;

    test('focusing an empty input fills it with the format as a template', () => {
      render(<DatePicker format={mask} />);
      expect(input().value).toBe('');

      act(() => input().focus());
      expect(input().value).toBe('YYYY-MM-DD');
    });

    test('digits fill one segment after another and Enter commits the date', () => {
      const onChange = vi.fn();
      render(<DatePicker format={mask} onChange={onChange} />);
      act(() => input().focus());

      pressKeys(input(), '2026');
      expect(input().value).toBe('2026-MM-DD');
      pressKeys(input(), '10');
      expect(input().value).toBe('2026-10-DD');
      pressKeys(input(), '13');
      expect(input().value).toBe('2026-10-13');

      fireEvent.keyDown(input(), { key: 'Enter' });
      const [date, dateString] = onChange.mock.calls.at(-1)!;
      expect(day(date)).toBe('2026-10-13');
      expect(dateString).toBe('2026-10-13');
    });

    test('a short segment is left-padded and non-digit keys are ignored', () => {
      render(<DatePicker format={mask} />);
      act(() => input().focus());

      pressKeys(input(), 'ab2026');
      pressKeys(input(), '3');
      // Month cell is waiting for its second digit, shown left-padded.
      expect(input().value).toBe('2026-03-DD');
    });

    test('ArrowUp / ArrowDown step the focused segment, Backspace resets it', () => {
      render(<DatePicker defaultValue={dayjs('2026-10-13')} format={mask} />);
      act(() => input().focus());

      // Focus starts on the year segment.
      fireEvent.keyDown(input(), { key: 'ArrowUp' });
      expect(input().value).toBe('2027-10-13');
      fireEvent.keyDown(input(), { key: 'ArrowDown' });
      fireEvent.keyDown(input(), { key: 'ArrowDown' });
      expect(input().value).toBe('2025-10-13');

      fireEvent.keyDown(input(), { key: 'ArrowRight' });
      fireEvent.keyDown(input(), { key: 'ArrowUp' });
      expect(input().value).toBe('2025-11-13');

      fireEvent.keyDown(input(), { key: 'Backspace' });
      expect(input().value).toBe('2025-MM-13');
    });

    test('pasting a full date in the format fills the input', () => {
      const onCalendarChange = vi.fn();
      render(<DatePicker format={mask} onCalendarChange={onCalendarChange} />);
      act(() => input().focus());

      fireEvent.paste(input(), { clipboardData: { getData: () => '2026-10-13' } });
      expect(input().value).toBe('2026-10-13');
      expect(day(onCalendarChange.mock.calls.at(-1)![0])).toBe('2026-10-13');
    });

    test('mask with a time format', () => {
      const onChange = vi.fn();
      // The showTime popup has the OK button, a base-ui Button that needs the motion component.
      render(
        <MotionProvider motion={motion}>
          <DatePicker
            showTime
            format={{ format: 'YYYY-MM-DD HH:mm:ss', type: 'mask' }}
            onChange={onChange}
          />
        </MotionProvider>,
      );
      act(() => input().focus());
      expect(input().value).toBe('YYYY-MM-DD HH:mm:ss');

      pressKeys(input(), '20261013093005');
      expect(input().value).toBe('2026-10-13 09:30:05');
      fireEvent.keyDown(input(), { key: 'Enter' });
      // With showTime, Enter fills the value; the OK button / blur submits it.
      fireEvent.blur(input());
      expect(onChange.mock.calls.at(-1)?.[0]?.format('YYYY-MM-DD HH:mm:ss')).toBe(
        '2026-10-13 09:30:05',
      );
    });

    test('range picker masks both inputs', () => {
      const onChange = vi.fn();
      render(<DateRangePicker format={mask} onChange={onChange} />);
      const [start, end] = inputs();

      act(() => start.focus());
      expect(start.value).toBe('YYYY-MM-DD');
      pressKeys(start, '20261001');
      expect(start.value).toBe('2026-10-01');
      fireEvent.keyDown(start, { key: 'Enter' });

      act(() => end.focus());
      expect(end.value).toBe('YYYY-MM-DD');
      pressKeys(end, '20261015');
      fireEvent.keyDown(end, { key: 'Enter' });

      const [dates, dateStrings] = onChange.mock.calls.at(-1)!;
      expect(dates.map(day)).toEqual(['2026-10-01', '2026-10-15']);
      expect(dateStrings).toEqual(['2026-10-01', '2026-10-15']);
    });
  });
});
