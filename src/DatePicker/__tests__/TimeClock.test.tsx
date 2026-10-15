import { cleanup, fireEvent, render as rtlRender, screen } from '@testing-library/react';
import dayjs from 'dayjs';
import { motion } from 'motion/react';
import type { ReactNode } from 'react';

import { MotionProvider } from '@/MotionProvider';

import DatePicker from '../DatePicker';

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

const popup = () => document.querySelector<HTMLElement>('.lobe-picker-dropdown')!;
const input = () => screen.getAllByRole('textbox')[0] as HTMLInputElement;
const dial = () => popup().querySelector<HTMLElement>('.lobe-picker-time-clock-dial')!;
const dialLabels = () =>
  [...dial().querySelectorAll<HTMLElement>('button')].map((node) => node.textContent);
const okButton = () => popup().querySelector<HTMLButtonElement>('.lobe-picker-ok button')!;

describe('DatePicker clock time panel', () => {
  afterEach(cleanup);

  test('timePanel="clock" swaps the scroll columns for a dial', () => {
    render(<DatePicker open picker="time" timePanel="clock" />);

    expect(popup().querySelector('.lobe-picker-time-panel-column')).toBeNull();
    expect(dial()).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Hour 9' })).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Hour 21' })).toBeTruthy();
  });

  test('the default panel keeps the scroll columns', () => {
    render(<DatePicker open picker="time" />);

    expect(popup().querySelector('.lobe-picker-time-panel-column')).toBeTruthy();
    expect(popup().querySelector('.lobe-picker-time-clock-dial')).toBeNull();
  });

  test('picking an hour moves the dial to minutes, then the time commits with OK', () => {
    const onChange = vi.fn();
    render(<DatePicker format="HH:mm" picker="time" timePanel="clock" onChange={onChange} />);
    fireEvent.click(input());

    fireEvent.click(screen.getByRole('button', { name: 'Hour 9' }));
    expect(screen.getByRole('button', { name: 'Minute 30' })).toBeTruthy();
    expect(screen.queryByRole('button', { name: 'Hour 9' })).toBeNull();

    fireEvent.click(screen.getByRole('button', { name: 'Minute 30' }));
    fireEvent.click(okButton());

    expect(onChange.mock.calls[0][1]).toBe('09:30');
  });

  test('the header segments switch between the hour and minute dials', () => {
    render(
      <DatePicker open picker="time" timePanel="clock" value={dayjs('2026-10-14 09:30:00')} />,
    );

    fireEvent.click(screen.getByRole('button', { name: 'Minutes' }));
    expect(screen.getByRole('button', { name: 'Minute 30' }).getAttribute('aria-pressed')).toBe(
      'true',
    );

    fireEvent.click(screen.getByRole('button', { name: 'Hours' }));
    expect(screen.getByRole('button', { name: 'Hour 9' }).getAttribute('aria-pressed')).toBe(
      'true',
    );
  });

  test('use12Hours shows one ring of hours and AM / PM toggles', () => {
    const onCalendarChange = vi.fn();
    render(
      <DatePicker
        open
        use12Hours
        picker="time"
        timePanel="clock"
        value={dayjs('2026-10-14 09:30:00')}
        onCalendarChange={onCalendarChange}
      />,
    );

    expect(screen.queryByRole('button', { name: 'Hour 21' })).toBeNull();
    expect(dialLabels()).toHaveLength(12);

    fireEvent.click(screen.getByRole('button', { name: 'PM' }));

    expect(dayjs(onCalendarChange.mock.calls.at(-1)![0]).hour()).toBe(21);
  });

  test('minuteStep and disabledTime disable the dial numbers they rule out', () => {
    render(
      <DatePicker
        open
        disabledTime={() => ({ disabledHours: () => [3] })}
        picker="time"
        showTime={{ minuteStep: 15 }}
        timePanel="clock"
        value={dayjs('2026-10-14 09:30:00')}
      />,
    );

    expect(screen.getByRole('button', { name: 'Hour 3' })).toHaveProperty('disabled', true);

    fireEvent.click(screen.getByRole('button', { name: 'Minutes' }));
    expect(screen.getByRole('button', { name: 'Minute 15' })).toHaveProperty('disabled', false);
    expect(screen.getByRole('button', { name: 'Minute 10' })).toHaveProperty('disabled', true);
  });

  test('seconds are a stepper beside the dial when the format has them', () => {
    const onCalendarChange = vi.fn();
    render(
      <DatePicker
        open
        picker="time"
        timePanel="clock"
        value={dayjs('2026-10-14 09:30:58')}
        onCalendarChange={onCalendarChange}
      />,
    );

    fireEvent.click(screen.getByRole('button', { name: 'Next second' }));
    expect(dayjs(onCalendarChange.mock.calls.at(-1)![0]).second()).toBe(59);

    cleanup();
    render(<DatePicker open format="HH:mm" picker="time" timePanel="clock" />);
    expect(screen.queryByRole('button', { name: 'Next second' })).toBeNull();
  });

  test('arrow keys on the dial step the focused unit', () => {
    const onCalendarChange = vi.fn();
    render(
      <DatePicker
        open
        picker="time"
        timePanel="clock"
        value={dayjs('2026-10-14 09:30:00')}
        onCalendarChange={onCalendarChange}
      />,
    );

    fireEvent.keyDown(dial(), { key: 'ArrowRight' });

    expect(dayjs(onCalendarChange.mock.calls.at(-1)![0]).hour()).toBe(10);
  });

  test('showTime={{ timePanel: "clock" }} puts the dial beside the date panel', () => {
    render(<DatePicker open showTime={{ timePanel: 'clock' }} />);

    expect(
      popup().querySelector('.lobe-picker-datetime-panel .lobe-picker-date-panel'),
    ).toBeTruthy();
    expect(dial()).toBeTruthy();
  });
});
