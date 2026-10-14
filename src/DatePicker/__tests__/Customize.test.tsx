import { act, cleanup, fireEvent, render as rtlRender, screen } from '@testing-library/react';
import dayjs, { type Dayjs } from 'dayjs';
import { motion } from 'motion/react';
import type { InputHTMLAttributes, ReactNode } from 'react';

import { MotionProvider } from '@/MotionProvider';

import DatePicker from '../DayjsDatePicker';
import DateRangePicker from '../DayjsDateRangePicker';
import type { PickerPanelProps } from '../type';

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
const popup = () => document.querySelector<HTMLElement>('.lobe-picker-dropdown')!;
const presetItems = () => [...popup().querySelectorAll<HTMLElement>('.lobe-picker-presets li')];
const preset = (label: string) => presetItems().find((node) => node.textContent === label)!;
const footerExtra = () => popup().querySelector<HTMLElement>('.lobe-picker-footer-extra');
const nowButton = () => popup().querySelector<HTMLElement>('.lobe-picker-now-btn');
const okButton = () => popup().querySelector<HTMLButtonElement>('.lobe-picker-ok button')!;
const fmt = (date?: Dayjs | null) => date?.format('YYYY-MM-DD');

describe('DatePicker presets', () => {
  afterEach(cleanup);

  test('lists the presets in a sidebar; clicking one commits its value', () => {
    const onChange = vi.fn();
    render(
      <DatePicker
        open
        presets={[
          { label: 'Yesterday', value: dayjs('2026-10-12') },
          { label: 'Last week', value: dayjs('2026-10-06') },
        ]}
        onChange={onChange}
      />,
    );
    expect(presetItems().map((node) => node.textContent)).toEqual(['Yesterday', 'Last week']);
    // The sidebar sits in the panel layout, before the panels.
    const layout = popup().querySelector('.lobe-picker-panel-layout')!;
    expect(layout.firstElementChild?.classList.contains('lobe-picker-presets')).toBe(true);

    fireEvent.click(preset('Last week'));
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(fmt(onChange.mock.calls[0][0])).toBe('2026-10-06');
    expect(onChange.mock.calls[0][1]).toBe('2026-10-06');
  });

  test('a function value is evaluated when the preset is hovered or picked', () => {
    const value = vi.fn(() => dayjs('2026-01-31'));
    const onChange = vi.fn();
    render(<DatePicker open presets={[{ label: 'End of Jan', value }]} onChange={onChange} />);
    expect(value).not.toHaveBeenCalled();

    // Hovering previews the value in the input.
    fireEvent.mouseEnter(preset('End of Jan'));
    expect(value).toHaveBeenCalled();
    expect(inputs()[0].value).toBe('2026-01-31');
    fireEvent.mouseLeave(preset('End of Jan'));
    expect(inputs()[0].value).toBe('');

    fireEvent.click(preset('End of Jan'));
    expect(fmt(onChange.mock.calls[0][0])).toBe('2026-01-31');
  });

  test('no presets, no sidebar', () => {
    render(<DatePicker open />);
    expect(popup().querySelector('.lobe-picker-presets')).toBeNull();
  });

  test('range presets take a tuple, or a function returning one', () => {
    const onChange = vi.fn();
    render(
      <DateRangePicker
        open
        presets={[
          { label: 'Q1', value: [dayjs('2026-01-01'), dayjs('2026-03-31')] },
          { label: 'Today ~ +2', value: () => [dayjs('2026-10-13'), dayjs('2026-10-15')] },
        ]}
        onChange={onChange}
      />,
    );
    fireEvent.click(preset('Q1'));
    expect(onChange.mock.calls[0][1]).toEqual(['2026-01-01', '2026-03-31']);

    fireEvent.mouseDown(inputs()[0]);
    fireEvent.click(preset('Today ~ +2'));
    expect(onChange.mock.calls.at(-1)![1]).toEqual(['2026-10-13', '2026-10-15']);
  });

  test('with showTime, a range preset still needs no OK', () => {
    const onChange = vi.fn();
    render(
      <DateRangePicker
        open
        showTime
        presets={[{ label: 'Day', value: [dayjs('2026-10-13 08:00'), dayjs('2026-10-13 18:00')] }]}
        onChange={onChange}
      />,
    );
    fireEvent.click(preset('Day'));
    expect(onChange.mock.calls[0][1]).toEqual(['2026-10-13 08:00:00', '2026-10-13 18:00:00']);
  });

  test('the deprecated `ranges` maps to presets on the range picker', () => {
    const warn = vi.spyOn(console, 'error').mockImplementation(() => {});
    const onChange = vi.fn();
    render(
      <DateRangePicker
        open
        ranges={{ Week: [dayjs('2026-10-12'), dayjs('2026-10-18')] }}
        onChange={onChange}
      />,
    );
    fireEvent.click(preset('Week'));
    expect(onChange.mock.calls[0][1]).toEqual(['2026-10-12', '2026-10-18']);
    warn.mockRestore();
  });
});

describe('DatePicker footer', () => {
  afterEach(cleanup);

  test('renderExtraFooter receives the current panel mode', () => {
    const renderExtraFooter = vi.fn((mode: string) => `extra: ${mode}`);
    render(<DatePicker open renderExtraFooter={renderExtraFooter} />);
    expect(footerExtra()?.textContent).toContain('extra: date');

    fireEvent.click(popup().querySelector('.lobe-picker-month-btn')!);
    expect(footerExtra()?.textContent).toContain('extra: month');
    expect(renderExtraFooter).toHaveBeenCalledWith('month');
  });

  test('works on month picker and with showTime', () => {
    render(
      <>
        <DatePicker open picker="month" renderExtraFooter={(mode) => `month footer ${mode}`} />
      </>,
    );
    expect(footerExtra()?.textContent).toContain('month footer month');
    cleanup();

    render(<DatePicker open showTime renderExtraFooter={() => 'time footer'} />);
    expect(footerExtra()?.textContent).toContain('time footer');
    // The extra row sits above the Now / OK row.
    expect(footerExtra()!.nextElementSibling?.classList.contains('lobe-picker-ranges')).toBe(true);
    expect(okButton()).toBeTruthy();
  });

  test('range picker supports renderExtraFooter', () => {
    render(<DateRangePicker open renderExtraFooter={(mode) => `range ${mode}`} />);
    expect(footerExtra()?.textContent).toContain('range date');
    cleanup();

    render(<DateRangePicker open showTime renderExtraFooter={() => 'range time'} />);
    expect(footerExtra()?.textContent).toContain('range time');
  });

  test('the date panel shows a Today button that picks today', () => {
    vi.useFakeTimers({ now: new Date('2026-10-13T10:00:00'), toFake: ['Date'] });
    const onChange = vi.fn();
    render(<DatePicker open showNow onChange={onChange} />);
    expect(nowButton()?.textContent).toContain('Today');
    fireEvent.click(nowButton()!);
    expect(onChange.mock.calls[0][1]).toBe('2026-10-13');
    vi.useRealTimers();
  });

  test('Today is disabled when today is a disabled date', () => {
    render(<DatePicker open showNow disabledDate={(current) => current.isSame(dayjs(), 'day')} />);
    expect(nowButton()?.classList.contains('lobe-picker-now-btn-disabled')).toBe(true);
  });

  test('the footer is hidden by default', () => {
    render(<DatePicker open />);
    expect(popup().querySelector('.lobe-picker-footer')).toBeNull();
  });

  test('showToday is the deprecated alias of showNow; showNow wins', () => {
    render(<DatePicker open showToday={false} />);
    expect(nowButton()).toBeNull();
    cleanup();

    render(<DatePicker open showNow showToday={false} />);
    expect(nowButton()).toBeTruthy();
    cleanup();

    // Range pickers hide it by default; showToday turns it on.
    render(<DateRangePicker open showToday />);
    expect(nowButton()?.textContent).toContain('Today');
  });
});

describe('DatePicker panelRender / components / inputRender', () => {
  afterEach(cleanup);

  test('panelRender wraps the whole panel, presets and footer included', () => {
    render(
      <DatePicker
        open
        presets={[{ label: 'P', value: dayjs() }]}
        renderExtraFooter={() => 'foot'}
        panelRender={(panel) => (
          <div data-testid="wrapper">
            <div>Header from panelRender</div>
            {panel}
          </div>
        )}
      />,
    );
    const wrapper = screen.getByTestId('wrapper');
    expect(wrapper?.textContent).toContain('Header from panelRender');
    expect(wrapper.querySelector('.lobe-picker-presets')).toBeTruthy();
    expect(wrapper.querySelector('.lobe-picker-date-panel')).toBeTruthy();
    expect(wrapper.querySelector('.lobe-picker-footer-extra')?.textContent).toContain('foot');
  });

  test('panelRender works on the range picker', () => {
    render(
      <DateRangePicker open panelRender={(panel) => <section aria-label="p">{panel}</section>} />,
    );
    expect(screen.getByLabelText('p').querySelectorAll('.lobe-picker-date-panel')).toHaveLength(2);
  });

  test('components.date replaces the date panel; onSelect / onHover drive the value', () => {
    const onChange = vi.fn();
    const MyPanel = ({ onHover, onSelect, value }: PickerPanelProps<Dayjs>) => (
      <div data-testid="my-panel">
        <span>value: {value?.format('YYYY-MM-DD') ?? 'none'}</span>
        <button type="button" onMouseEnter={() => onHover?.(dayjs('2026-05-05'))}>
          hover
        </button>
        <button type="button" onClick={() => onSelect(dayjs('2026-05-06'))}>
          select
        </button>
      </div>
    );
    render(<DatePicker open components={{ date: MyPanel }} showNow={false} onChange={onChange} />);
    expect(screen.getByTestId('my-panel')).toBeTruthy();
    expect(popup().querySelector('.lobe-picker-date-panel')).toBeNull();

    fireEvent.mouseEnter(screen.getByText('hover'));
    expect(inputs()[0].value).toBe('2026-05-05');

    fireEvent.click(screen.getByText('select'));
    expect(fmt(onChange.mock.calls[0][0])).toBe('2026-05-06');
  });

  test('components can replace the month panel too', () => {
    const MonthPanel = () => <div data-testid="month-panel">custom month</div>;
    render(<DatePicker open components={{ month: MonthPanel }} picker="month" />);
    expect(screen.getByTestId('month-panel')).toBeTruthy();
  });

  test('components.input replaces the input element', () => {
    const MyInput = (props: InputHTMLAttributes<HTMLInputElement>) => (
      <input {...props} data-testid="my-input" />
    );
    render(<DatePicker components={{ input: MyInput }} />);
    const input = screen.getByTestId('my-input');
    expect(input.getAttribute('placeholder')).toBe('Select date');
    // The picker still drives it: typing a date commits it.
    const onChange = vi.fn();
    cleanup();
    render(<DatePicker components={{ input: MyInput }} onChange={onChange} />);
    fireEvent.mouseDown(screen.getByTestId('my-input'));
    fireEvent.change(screen.getByTestId('my-input'), { target: { value: '2026-02-03' } });
    fireEvent.keyDown(screen.getByTestId('my-input'), { key: 'Enter' });
    expect(onChange.mock.calls[0][1]).toBe('2026-02-03');
  });

  test('the deprecated inputRender is an alias of components.input', () => {
    render(<DateRangePicker inputRender={(props) => <input {...props} data-custom="yes" />} />);
    expect(inputs()).toHaveLength(2);
    for (const node of inputs()) expect(node.getAttribute('data-custom')).toBe('yes');
  });

  test('components.button replaces the OK button; other components keep the base-ui one', () => {
    const MyButton = (props: { children?: ReactNode; onClick?: () => void }) => (
      <button className="my-ok" type="button" onClick={props.onClick}>
        {props.children}!
      </button>
    );
    const onOk = vi.fn();
    render(<DatePicker needConfirm open components={{ button: MyButton }} onOk={onOk} />);
    const ok = popup().querySelector<HTMLButtonElement>('.lobe-picker-ok .my-ok')!;
    expect(ok?.textContent).toContain('OK!');
    cleanup();

    // A components object without `button` keeps the base-ui OK button.
    render(<DatePicker needConfirm open components={{ input: 'input' }} />);
    expect(okButton().className).not.toBe('');
    expect(okButton()?.textContent).toContain('OK');
  });

  test('a custom panel closes the popup after select when no confirm is needed', async () => {
    const MyPanel = ({ onSelect }: PickerPanelProps<Dayjs>) => (
      <button type="button" onClick={() => onSelect(dayjs('2026-07-07'))}>
        pick
      </button>
    );
    const onOpenChange = vi.fn();
    render(<DatePicker components={{ date: MyPanel }} onOpenChange={onOpenChange} />);
    fireEvent.mouseDown(inputs()[0]);
    fireEvent.click(inputs()[0]);
    await act(async () => {});
    fireEvent.click(screen.getByText('pick'));
    expect(inputs()[0].value).toBe('2026-07-07');
    expect(onOpenChange).toHaveBeenLastCalledWith(false);
  });
});
