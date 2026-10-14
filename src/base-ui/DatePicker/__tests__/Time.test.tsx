import { act, cleanup, fireEvent, render as rtlRender, screen } from '@testing-library/react';
import dayjs, { type Dayjs } from 'dayjs';
import { motion } from 'motion/react';
import type { ReactNode } from 'react';

import Button from '@/base-ui/Button';
import { MotionProvider } from '@/MotionProvider';

import DatePicker from '../DayjsDatePicker';
import DateRangePicker from '../DayjsDateRangePicker';
import type { CellRenderInfo } from '../type';

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

const input = () => screen.getAllByRole('textbox')[0] as HTMLInputElement;
const inputs = () => screen.getAllByRole('textbox') as HTMLInputElement[];
const popup = () => document.querySelector<HTMLElement>('.lobe-picker-dropdown')!;
const columns = () =>
  [...popup().querySelectorAll<HTMLElement>('.lobe-picker-time-panel-column')].map(
    (node) => node.dataset.type,
  );
const column = (type: string) =>
  popup().querySelector<HTMLElement>(`.lobe-picker-time-panel-column[data-type="${type}"]`)!;
const timeCells = (type: string) => [
  ...column(type).querySelectorAll<HTMLElement>('.lobe-picker-time-panel-cell'),
];
const timeCell = (type: string, value: number) =>
  column(type).querySelector<HTMLElement>(`.lobe-picker-time-panel-cell[data-value="${value}"]`)!;
const disabledValues = (type: string) =>
  timeCells(type)
    .filter((node) => node.classList.contains('lobe-picker-time-panel-cell-disabled'))
    .map((node) => Number(node.dataset.value));
const dateCell = (text: string) =>
  [...popup().querySelectorAll<HTMLElement>('.lobe-picker-cell-in-view')].find(
    (node) => node.querySelector('.lobe-picker-cell-inner')?.textContent === text,
  )!;
const okButton = () => popup().querySelector<HTMLButtonElement>('.lobe-picker-ok button')!;
const nowButton = () => popup().querySelector<HTMLElement>('.lobe-picker-now-btn')!;

describe('DatePicker time', () => {
  afterEach(() => {
    cleanup();
    vi.useRealTimers();
  });

  test('showTime adds the time panel, the datetime format and the OK button', () => {
    const onChange = vi.fn();
    const onOk = vi.fn();
    render(
      <DatePicker
        showTime
        defaultPickerValue={dayjs('2026-10-01')}
        onChange={onChange}
        onOk={onOk}
      />,
    );
    expect(input().placeholder).toBe('Select date');
    fireEvent.click(input());

    expect(
      popup().querySelector('.lobe-picker-datetime-panel .lobe-picker-date-panel'),
    ).toBeTruthy();
    expect(
      popup().querySelector('.lobe-picker-datetime-panel .lobe-picker-time-panel'),
    ).toBeTruthy();
    expect(columns()).toEqual(['hour', 'minute', 'second']);

    // needConfirm defaults to true with showTime: picking only fills the input.
    fireEvent.click(dateCell('15'));
    fireEvent.click(timeCell('hour', 9));
    fireEvent.click(timeCell('minute', 30));
    expect(onChange).not.toHaveBeenCalled();
    expect(input().value).toMatch(/^2026-10-15 09:30:\d\d$/);

    // OK is the base-ui Button.
    expect(okButton().textContent).toBe('OK');
    const { container } = render(
      <Button size="small" type="primary">
        OK
      </Button>,
    );
    expect(okButton().className).toBe(container.querySelector('button')!.className);
    fireEvent.click(okButton());
    expect(onOk).toHaveBeenCalledTimes(1);
    expect((onOk.mock.calls[0][0] as Dayjs).format('YYYY-MM-DD HH:mm')).toBe('2026-10-15 09:30');
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange.mock.calls[0][1]).toMatch(/^2026-10-15 09:30:\d\d$/);
  });

  test('the OK button stays disabled until there is a value, and components.button overrides it', () => {
    const { unmount } = render(<DatePicker open showTime />);
    expect(okButton().disabled).toBe(true);
    unmount();

    render(
      <DatePicker
        open
        showTime
        components={{ button: (props: any) => <button data-custom {...props} /> }}
      />,
    );
    expect(popup().querySelector('.lobe-picker-ok button[data-custom]')).toBeTruthy();
  });

  test('showTime.format decides the columns and the display format', () => {
    const { rerender } = render(
      <DatePicker open showTime={{ format: 'HH:mm' }} value={dayjs('2026-10-15 09:30:45')} />,
    );
    expect(columns()).toEqual(['hour', 'minute']);
    // As in antd, showTime.format only drives the columns and the time panel header;
    // the input keeps `format` (default `YYYY-MM-DD HH:mm:ss`).
    expect(
      popup().querySelector('.lobe-picker-time-panel .lobe-picker-header-view')!.textContent,
    ).toBe('09:30');
    expect(input().value).toBe('2026-10-15 09:30:45');

    rerender(
      <DatePicker
        open
        showTime={{ showHour: true, showMinute: true, showSecond: false }}
        value={dayjs('2026-10-15 09:30:45')}
      />,
    );
    expect(columns()).toEqual(['hour', 'minute']);
  });

  test('use12Hours adds the meridiem column and steps thin the options', () => {
    render(
      <DatePicker
        open
        use12Hours
        picker="time"
        showTime={{ hourStep: 2, minuteStep: 15, secondStep: 30 }}
      />,
    );
    expect(columns()).toEqual(['hour', 'minute', 'second', 'meridiem']);
    expect(timeCells('hour')).toHaveLength(6);
    expect(timeCells('minute').map((node) => node.textContent)).toEqual(['00', '15', '30', '45']);
    expect(timeCells('second').map((node) => node.textContent)).toEqual(['00', '30']);
    expect(timeCells('meridiem').map((node) => node.textContent)).toEqual(['AM', 'PM']);
  });

  test('picker="time" shows only the time panel with time placeholders and format', () => {
    const onChange = vi.fn();
    const { unmount } = render(<DatePicker picker="time" onChange={onChange} />);
    expect(input().placeholder).toBe('Select time');
    fireEvent.click(input());
    expect(popup().querySelector('.lobe-picker-date-panel')).toBeNull();
    expect(popup().querySelector('.lobe-picker-time-panel')).toBeTruthy();
    fireEvent.click(timeCell('hour', 8));
    fireEvent.click(timeCell('minute', 5));
    fireEvent.click(timeCell('second', 0));
    fireEvent.click(okButton());
    expect(onChange.mock.calls[0][1]).toBe('08:05:00');
    unmount();

    render(<DateRangePicker picker="time" />);
    expect(inputs().map((node) => node.placeholder)).toEqual(['Start time', 'End time']);
  });

  test('mode="time" shows the time panel on a date picker', () => {
    render(<DatePicker open mode="time" />);
    expect(popup().querySelector('.lobe-picker-time-panel')).toBeTruthy();
    expect(popup().querySelector('.lobe-picker-date-panel')).toBeNull();
  });

  test('disabledTime disables time options and hideDisabledOptions removes them', () => {
    const disabledTime = vi.fn((_date: Dayjs) => ({
      disabledHours: () => [0, 1, 2, 3],
      disabledMinutes: (hour: number) => (hour === 9 ? [0, 15] : []),
    }));
    const value = dayjs('2026-10-15 09:30:00');
    const { rerender } = render(
      <DatePicker open showTime disabledTime={disabledTime} value={value} />,
    );
    expect(disabledTime).toHaveBeenCalled();
    expect(dayjs.isDayjs(disabledTime.mock.calls[0][0])).toBe(true);
    expect(disabledValues('hour')).toEqual([0, 1, 2, 3]);
    expect(disabledValues('minute')).toEqual([0, 15]);

    rerender(
      <DatePicker
        open
        disabledTime={disabledTime}
        showTime={{ hideDisabledOptions: true }}
        value={value}
      />,
    );
    expect(timeCells('hour')).toHaveLength(20);
    expect(timeCell('hour', 0)).toBeNull();
  });

  test('range disabledTime gets the partial and info.from', () => {
    const disabledTime = vi.fn((_date: Dayjs, partial: 'start' | 'end', _info: { from?: Dayjs }) =>
      partial === 'end' ? { disabledHours: () => [0, 1] } : {},
    );
    render(
      <DateRangePicker
        defaultPickerValue={[dayjs('2026-10-01'), dayjs('2026-11-01')]}
        disabledTime={disabledTime}
        showTime={{
          defaultOpenValue: [dayjs('2000-01-01 09:00:00'), dayjs('2000-01-01 18:00:00')],
        }}
      />,
    );
    fireEvent.mouseDown(inputs()[0]);
    fireEvent.click(inputs()[0]);
    expect(disabledTime.mock.calls.some(([, partial]) => partial === 'start')).toBe(true);
    expect(disabledValues('hour')).toEqual([]);

    // Confirming the start moves on to the end field, which knows where the range starts.
    fireEvent.click(dateCell('15'));
    fireEvent.click(okButton());
    const endCall = disabledTime.mock.calls.findLast(([, partial]) => partial === 'end')!;
    expect(endCall).toBeTruthy();
    expect(endCall[2].from?.format('YYYY-MM-DD HH:mm')).toBe('2026-10-15 09:00');
    expect(disabledValues('hour')).toEqual([0, 1]);
  });

  test('showNow picks the current time', () => {
    vi.useFakeTimers({ now: new Date('2026-10-13T14:25:36'), toFake: ['Date'] });
    const onChange = vi.fn();
    render(<DatePicker showNow showTime onChange={onChange} />);
    fireEvent.click(input());
    expect(nowButton().textContent).toBe('Now');
    fireEvent.click(nowButton());
    expect(input().value).toBe('2026-10-13 14:25:36');
    fireEvent.click(okButton());
    expect(onChange.mock.calls[0][1]).toBe('2026-10-13 14:25:36');
  });

  test('showNow={false} hides the Now button', () => {
    render(<DatePicker open showTime showNow={false} />);
    expect(popup().querySelector('.lobe-picker-now')).toBeNull();
    expect(okButton()).toBeTruthy();
  });

  test('needConfirm on a date picker requires OK; needConfirm={false} on showTime commits on close', () => {
    const onChange = vi.fn();
    const { unmount } = render(
      <DatePicker needConfirm defaultPickerValue={dayjs('2026-10-01')} onChange={onChange} />,
    );
    fireEvent.click(input());
    fireEvent.click(dateCell('15'));
    expect(onChange).not.toHaveBeenCalled();
    fireEvent.click(okButton());
    expect(onChange.mock.calls[0][1]).toBe('2026-10-15');
    unmount();

    onChange.mockClear();
    render(
      <DatePicker
        showTime
        defaultPickerValue={dayjs('2026-10-01')}
        needConfirm={false}
        onChange={onChange}
      />,
    );
    fireEvent.click(input());
    expect(popup().querySelector('.lobe-picker-ok')).toBeNull();
    fireEvent.click(dateCell('15'));
    fireEvent.click(timeCell('hour', 9));
    fireEvent.keyDown(input(), { key: 'Enter' });
    expect(onChange).toHaveBeenCalled();
    expect(onChange.mock.lastCall![1]).toMatch(/^2026-10-15 09:/);
  });

  test('changeOnBlur maps to needConfirm={false}', () => {
    const { rerender } = render(<DatePicker changeOnBlur open showTime />);
    expect(popup().querySelector('.lobe-picker-ok')).toBeNull();
    rerender(<DatePicker changeOnBlur needConfirm open showTime />);
    expect(okButton()).toBeTruthy();
  });

  test('previewValue shows the hovered cell in the input unless false', () => {
    const { unmount } = render(<DatePicker defaultPickerValue={dayjs('2026-10-01')} />);
    fireEvent.click(input());
    fireEvent.mouseEnter(dateCell('15'));
    expect(input().value).toBe('2026-10-15');
    fireEvent.mouseLeave(dateCell('15'));
    expect(input().value).toBe('');
    unmount();

    render(<DatePicker defaultPickerValue={dayjs('2026-10-01')} previewValue={false} />);
    fireEvent.click(input());
    fireEvent.mouseEnter(dateCell('15'));
    expect(input().value).toBe('');
  });

  test('defaultOpenValue (top level, showTime and the showTime.defaultValue alias) sets the time of a picked date', () => {
    const cases = [
      { defaultOpenValue: dayjs('2000-01-01 10:20:30') },
      { showTime: { defaultOpenValue: dayjs('2000-01-01 10:20:30') } },
      { showTime: { defaultValue: dayjs('2000-01-01 10:20:30') } },
    ];
    for (const props of cases) {
      const { unmount } = render(
        <DatePicker showTime defaultPickerValue={dayjs('2026-10-01')} {...(props as any)} />,
      );
      fireEvent.click(input());
      fireEvent.click(dateCell('15'));
      expect(input().value).toBe('2026-10-15 10:20:30');
      unmount();
    }
  });

  test('cellRender receives the time cells with subType', () => {
    const subTypes = new Set<string>();
    render(
      <DatePicker
        open
        showTime
        use12Hours
        cellRender={(current, info: CellRenderInfo<Dayjs>) => {
          if (info.type !== 'time') return info.originNode;
          subTypes.add(info.subType!);
          return (
            <div data-time-cell className="lobe-picker-time-panel-cell-inner">
              {String(current).padStart(2, '0')}
            </div>
          );
        }}
      />,
    );
    expect([...subTypes].sort()).toEqual(['hour', 'meridiem', 'minute', 'second']);
    expect(column('minute').querySelectorAll('[data-time-cell]')).toHaveLength(60);
  });

  test('changeOnScroll picks the option scrolled to', () => {
    // jsdom has no layout: report the columns as visible so the scroll sync settles.
    const offsetParent = Object.getOwnPropertyDescriptor(HTMLElement.prototype, 'offsetParent');
    Object.defineProperty(HTMLElement.prototype, 'offsetParent', {
      configurable: true,
      get: () => document.body,
    });
    vi.useFakeTimers({ now: new Date('2026-10-13T00:00:00') });
    try {
      const { unmount } = render(<DatePicker open picker="time" />);
      fireEvent.scroll(column('hour'));
      act(() => {
        vi.runAllTimers();
      });
      expect(input().value).toBe('');
      unmount();

      render(<DatePicker open picker="time" showTime={{ changeOnScroll: true }} />);
      act(() => {
        vi.runAllTimers();
      });
      fireEvent.scroll(column('hour'));
      act(() => {
        vi.runAllTimers();
      });
      expect(input().value).toBe('00:00:00');
    } finally {
      if (offsetParent) Object.defineProperty(HTMLElement.prototype, 'offsetParent', offsetParent);
    }
  });
});
