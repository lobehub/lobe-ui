import type { PickerRef } from '@rc-component/picker';
import { act, cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import dayjs, { type Dayjs } from 'dayjs';
import type { RefObject } from 'react';

import { FloatingLayerProvider } from '@/hooks/useFloatingLayer';
import AppElementContext from '@/ThemeProvider/AppElementContext';

import DatePicker from '../DatePicker';

if (!globalThis.ResizeObserver) {
  globalThis.ResizeObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
  } as any;
}

const input = () => screen.getByRole('textbox') as HTMLInputElement;
const openPicker = () => fireEvent.click(input());
const cell = (title: string) =>
  document.querySelector<HTMLElement>(`.lobe-picker-dropdown td[title="${title}"]`)!;
const pick = (title: string) => fireEvent.click(cell(title).querySelector('div')!);
const popup = () => document.querySelector<HTMLElement>('.lobe-picker-dropdown');
const isOpen = () => !!popup() && !popup()!.className.includes('lobe-picker-dropdown-hidden');
const day = (date: Dayjs | null) => date?.format('YYYY-MM-DD');

describe('DatePicker', () => {
  afterEach(cleanup);

  test('renders an input with the placeholder, then the formatted Dayjs value', () => {
    const { rerender } = render(<DatePicker />);
    expect(input().placeholder).toBe('Select date');
    expect(input().value).toBe('');

    rerender(<DatePicker value={dayjs('2026-10-15 09:30')} />);
    expect(input().value).toBe('2026-10-15');
  });

  test('picking a day emits (Dayjs, dateString) and closes', async () => {
    const onChange = vi.fn();
    const onOpenChange = vi.fn();
    render(
      <DatePicker
        defaultValue={dayjs('2026-10-15')}
        onChange={onChange}
        onOpenChange={onOpenChange}
      />,
    );

    openPicker();
    expect(onOpenChange).toHaveBeenLastCalledWith(true);
    pick('2026-10-21');

    const [date, dateString] = onChange.mock.calls[0];
    expect(dayjs.isDayjs(date)).toBe(true);
    expect(day(date)).toBe('2026-10-21');
    expect(dateString).toBe('2026-10-21');
    expect(onOpenChange).toHaveBeenLastCalledWith(false);
  });

  test('clear emits null for both arguments', () => {
    const onChange = vi.fn();
    render(<DatePicker defaultValue={dayjs('2026-10-15')} onChange={onChange} />);

    fireEvent.click(screen.getByRole('button', { name: 'Clear' }));

    expect(onChange).toHaveBeenCalledWith(null, null);
    expect(input().value).toBe('');
  });

  test('emptying the text does not clear the value (as in antd); the clear button does', async () => {
    const onChange = vi.fn();
    render(<DatePicker defaultValue={dayjs('2026-10-15')} onChange={onChange} />);

    openPicker();
    fireEvent.change(input(), { target: { value: '' } });
    fireEvent.blur(input());

    await waitFor(() => expect(input().value).toBe('2026-10-15'));
    expect(onChange).not.toHaveBeenCalled();
  });

  test('typing a date parses it and Enter submits it', () => {
    const onChange = vi.fn();
    render(<DatePicker format={['YYYY-MM-DD', 'DD/MM/YYYY']} onChange={onChange} />);

    openPicker();
    fireEvent.change(input(), { target: { value: '13/10/2026' } });
    fireEvent.keyDown(input(), { key: 'Enter' });

    expect(day(onChange.mock.calls.at(-1)![0])).toBe('2026-10-13');
    expect(input().value).toBe('2026-10-13');
  });

  test('inputReadOnly makes the input read-only', () => {
    render(<DatePicker inputReadOnly />);
    expect(input().readOnly).toBe(true);
  });

  test('invalid input resets on blur unless preserveInvalidOnBlur is set', async () => {
    render(<DatePicker defaultValue={dayjs('2026-10-15')} />);
    openPicker();
    fireEvent.change(input(), { target: { value: 'not a date' } });
    fireEvent.blur(input());
    await waitFor(() => expect(input().value).toBe('2026-10-15'));

    cleanup();
    render(<DatePicker preserveInvalidOnBlur defaultValue={dayjs('2026-10-15')} />);
    openPicker();
    fireEvent.change(input(), { target: { value: 'not a date' } });
    fireEvent.blur(input());
    expect(input().value).toBe('not a date');
  });

  test('picker="month" and picker="year" emit the picked period with its dateString', () => {
    const onMonth = vi.fn();
    render(<DatePicker defaultValue={dayjs('2026-10-01')} picker="month" onChange={onMonth} />);
    expect(input().placeholder).toBe('Select month');
    expect(input().value).toBe('2026-10');

    openPicker();
    expect(document.querySelector('.lobe-picker-month-panel')).toBeTruthy();
    pick('2026-11');
    expect(day(onMonth.mock.calls[0][0])).toBe('2026-11-01');
    expect(onMonth.mock.calls[0][1]).toBe('2026-11');

    cleanup();
    const onYear = vi.fn();
    render(<DatePicker defaultValue={dayjs('2026-01-01')} picker="year" onChange={onYear} />);
    expect(input().placeholder).toBe('Select year');
    openPicker();
    expect(document.querySelector('.lobe-picker-year-panel')).toBeTruthy();
    pick('2028');
    expect(onYear.mock.calls[0][0].year()).toBe(2028);
    expect(onYear.mock.calls[0][1]).toBe('2028');
  });

  test('minDate / maxDate disable cells and limit navigation; min / max are aliases', () => {
    render(
      <DatePicker
        defaultValue={dayjs('2026-10-15')}
        maxDate={dayjs('2026-10-25')}
        minDate={dayjs('2026-10-08 15:42')}
      />,
    );
    openPicker();

    expect(cell('2026-10-07').className).toContain('lobe-picker-cell-disabled');
    expect(cell('2026-10-08').className).not.toContain('lobe-picker-cell-disabled');
    expect(cell('2026-10-26').className).toContain('lobe-picker-cell-disabled');
    expect(
      document.querySelector('.lobe-picker-header-prev-btn')!.className.includes('disabled'),
    ).toBe(true);

    cleanup();
    render(<DatePicker defaultValue={dayjs('2026-10-15')} min={dayjs('2026-10-08')} />);
    openPicker();
    expect(cell('2026-10-07').className).toContain('lobe-picker-cell-disabled');
  });

  test('disabledDate receives (current: Dayjs, info) on every panel', () => {
    const disabledDate = vi.fn((current: Dayjs, _info: { type: string }) => current.month() === 10);
    render(<DatePicker defaultValue={dayjs('2026-10-15')} disabledDate={disabledDate} />);
    openPicker();

    const [current, info] = disabledDate.mock.calls[0];
    expect(dayjs.isDayjs(current)).toBe(true);
    expect(info.type).toBe('date');
    expect(cell('2026-11-01').className).toContain('lobe-picker-cell-disabled');

    fireEvent.click(document.querySelector('.lobe-picker-month-btn')!);
    expect(disabledDate.mock.calls.some(([, i]) => i.type === 'month')).toBe(true);
    expect(cell('2026-11').className).toContain('lobe-picker-cell-disabled');
  });

  test('controlled mode renders that panel and reports onPanelChange', () => {
    const onPanelChange = vi.fn();
    render(
      <DatePicker
        defaultOpen
        defaultValue={dayjs('2026-10-15')}
        mode="month"
        onPanelChange={onPanelChange}
      />,
    );

    expect(document.querySelector('.lobe-picker-month-panel')).toBeTruthy();
    fireEvent.click(document.querySelector('.lobe-picker-year-btn')!);

    const [value, mode] = onPanelChange.mock.calls[0];
    expect(dayjs.isDayjs(value)).toBe(true);
    expect(mode).toBe('year');
    // still controlled: the month panel stays until `mode` changes
    expect(document.querySelector('.lobe-picker-month-panel')).toBeTruthy();
  });

  test('open is controllable; defaultOpen opens on mount', async () => {
    const onOpenChange = vi.fn();
    const { rerender } = render(<DatePicker open={false} onOpenChange={onOpenChange} />);

    openPicker();
    expect(onOpenChange).toHaveBeenCalledWith(true);
    expect(isOpen()).toBe(false);

    rerender(<DatePicker open onOpenChange={onOpenChange} />);
    await waitFor(() => expect(isOpen()).toBe(true));

    cleanup();
    render(<DatePicker defaultOpen />);
    expect(isOpen()).toBe(true);
  });

  test('pickerValue is controlled and onPickerValueChange reports panel navigation', () => {
    const onPickerValueChange = vi.fn();
    render(
      <DatePicker
        open
        pickerValue={dayjs('2027-03-01')}
        onPickerValueChange={onPickerValueChange}
      />,
    );

    expect(document.querySelector('.lobe-picker-header-view')!.textContent).toContain('Mar');
    expect(document.querySelector('.lobe-picker-header-view')!.textContent).toContain('2027');

    fireEvent.click(document.querySelector('.lobe-picker-header-next-btn')!);
    const [date, info] = onPickerValueChange.mock.calls.at(-1)!;
    expect(date.format('YYYY-MM')).toBe('2027-04');
    expect(info).toMatchObject({ mode: 'date', source: 'panel' });
    // controlled: the panel stays on March until the prop changes
    expect(document.querySelector('.lobe-picker-header-view')!.textContent).toContain('Mar');
  });

  test('defaultPickerValue sets the month shown when opening', () => {
    render(<DatePicker defaultPickerValue={dayjs('2030-06-01')} />);
    openPicker();
    expect(cell('2030-06-15')).toBeTruthy();
  });

  test('onCalendarChange fires on each pick; onSelect is an alias', () => {
    const onCalendarChange = vi.fn();
    const onSelect = vi.fn();
    render(
      <DatePicker
        defaultValue={dayjs('2026-10-15')}
        onCalendarChange={onCalendarChange}
        onSelect={onSelect}
      />,
    );

    openPicker();
    pick('2026-10-03');

    expect(day(onCalendarChange.mock.calls[0][0])).toBe('2026-10-03');
    expect(onCalendarChange.mock.calls[0][1]).toBe('2026-10-03');
    expect(day(onSelect.mock.calls[0][0])).toBe('2026-10-03');
  });

  test('focus / blur / keydown events and input attributes pass through', () => {
    const onFocus = vi.fn();
    const onBlur = vi.fn();
    const onKeyDown = vi.fn();
    render(
      <DatePicker
        aria-label="Due date"
        id="due"
        name="due"
        onBlur={onBlur}
        onFocus={onFocus}
        onKeyDown={onKeyDown}
      />,
    );

    expect(input().id).toBe('due');
    expect(input().name).toBe('due');
    expect(input().getAttribute('aria-label')).toBe('Due date');

    fireEvent.focus(input());
    fireEvent.keyDown(input(), { key: 'a' });
    fireEvent.blur(input());

    expect(onFocus).toHaveBeenCalled();
    expect(onKeyDown).toHaveBeenCalled();
    expect(onKeyDown.mock.calls[0][0].key).toBe('a');
    expect(onBlur).toHaveBeenCalled();
  });

  test('Escape closes the popup', async () => {
    const onOpenChange = vi.fn();
    render(<DatePicker onOpenChange={onOpenChange} />);
    openPicker();
    expect(isOpen()).toBe(true);

    fireEvent.keyDown(input(), { key: 'Escape' });
    await waitFor(() => expect(onOpenChange).toHaveBeenLastCalledWith(false));
  });

  test('ref exposes focus, blur and nativeElement', () => {
    const ref: RefObject<PickerRef | null> = { current: null };
    render(<DatePicker ref={ref} />);

    expect(ref.current!.nativeElement.classList.contains('lobe-picker')).toBe(true);
    act(() => ref.current!.focus());
    expect(document.activeElement).toBe(input());
    act(() => ref.current!.blur());
    expect(document.activeElement).not.toBe(input());
  });

  test('footer is an alias of renderExtraFooter', () => {
    render(<DatePicker defaultOpen footer={<span>Never expires</span>} />);
    expect(document.querySelector('.lobe-picker-footer-extra')!.textContent).toBe('Never expires');
  });

  test('uses the lobe-picker prefix and base-ui Input look', () => {
    render(<DatePicker shadow size="small" variant="filled" />);
    const root = document.querySelector('.lobe-picker')!;
    expect(root.querySelector('input')).toBeTruthy();
    expect(document.querySelector('[class*="ant-picker"]')).toBeNull();
  });

  test('the popup mounts in the closest base-ui floating layer and takes a z-index', () => {
    const layer = document.createElement('div');
    document.body.append(layer);

    render(
      <FloatingLayerProvider value={layer}>
        <DatePicker defaultOpen />
      </FloatingLayerProvider>,
    );

    expect(layer.querySelector('.lobe-picker-dropdown')).toBeTruthy();
    expect(Number(popup()!.style.zIndex)).toBeGreaterThan(1100);
    layer.remove();
  });

  test('the popup mounts inside an enclosing dialog when there is no floating layer', () => {
    render(
      <div role="dialog">
        <DatePicker defaultOpen />
      </div>,
    );

    expect(screen.getByRole('dialog').querySelector('.lobe-picker-dropdown')).toBeTruthy();
  });

  test('outside floating layers the popup mounts on body with the theme css-var scope', () => {
    const scope = document.createElement('div');
    scope.className = 'ant-app css-var-test';
    const host = document.createElement('div');
    scope.append(host);
    document.body.append(scope);

    render(
      <AppElementContext value={host as HTMLDivElement}>
        <DatePicker defaultOpen />
      </AppElementContext>,
    );

    expect(popup()!.parentElement!.closest('.css-var-test')).toBeNull();
    expect(popup()!.classList.contains('css-var-test')).toBe(true);
    scope.remove();
  });
});
