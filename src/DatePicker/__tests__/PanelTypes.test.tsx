import { cleanup, fireEvent, screen, waitFor } from '@testing-library/react';
import dayjs, { type Dayjs } from 'dayjs';

import DatePicker from '../DatePicker';
import DateRangePicker from '../DateRangePicker';
import type { CellRenderInfo } from '../type';
import { getPageStart, isSameCell, moveGridCell } from '../usePanelKeyboard';
import { render } from './render';

if (!globalThis.ResizeObserver) {
  globalThis.ResizeObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
  } as any;
}

const input = () => screen.getAllByRole('textbox')[0] as HTMLInputElement;
const inputs = () => screen.getAllByRole('textbox') as HTMLInputElement[];
const popup = () => document.querySelector<HTMLElement>('.lobe-picker-dropdown')!;
const panels = (type: string) => popup().querySelectorAll(`.lobe-picker-${type}-panel`);
const inViewTexts = () =>
  [...popup().querySelectorAll('.lobe-picker-cell-in-view .lobe-picker-cell-inner')].map(
    (node) => node.textContent,
  );
const cellByText = (text: string, nth = 0) =>
  [...popup().querySelectorAll<HTMLElement>('.lobe-picker-cell-in-view')].filter(
    (node) => node.querySelector('.lobe-picker-cell-inner')?.textContent === text,
  )[nth];
const headerText = () => popup().querySelector('.lobe-picker-header-view')!.textContent;
const activeTexts = () =>
  [...popup().querySelectorAll('.lobe-picker-cell-keyboard-active')].map(
    (node) => node.closest('td')!.querySelector('.lobe-picker-cell-inner')!.textContent,
  );
const key = (k: string, target: HTMLElement = input()) => fireEvent.keyDown(target, { key: k });

describe('DatePicker panel types', () => {
  afterEach(cleanup);

  test('each picker has the antd default placeholder and format', () => {
    const value = dayjs('2026-10-15');
    const expected: Record<string, [string, string]> = {
      date: ['Select date', '2026-10-15'],
      month: ['Select month', '2026-10'],
      quarter: ['Select quarter', '2026-Q4'],
      week: ['Select week', '2026-42nd'],
      year: ['Select year', '2026'],
    };
    for (const [picker, [placeholder, text]] of Object.entries(expected)) {
      const { unmount, rerender } = render(<DatePicker picker={picker as any} />);
      expect(input().placeholder).toBe(placeholder);
      rerender(<DatePicker picker={picker as any} value={value} />);
      expect(input().value).toBe(text);
      unmount();
    }
  });

  test('range pickers have per-picker placeholders', () => {
    const expected: Record<string, string[]> = {
      date: ['Start date', 'End date'],
      month: ['Start month', 'End month'],
      quarter: ['Start quarter', 'End quarter'],
      week: ['Start week', 'End week'],
      year: ['Start year', 'End year'],
    };
    for (const [picker, placeholders] of Object.entries(expected)) {
      const { unmount } = render(<DateRangePicker picker={picker as any} />);
      expect(inputs().map((node) => node.placeholder)).toEqual(placeholders);
      unmount();
    }
  });

  test('week picker selects a whole week and shows the week column', () => {
    const onChange = vi.fn();
    render(
      <DatePicker defaultPickerValue={dayjs('2026-10-15')} picker="week" onChange={onChange} />,
    );
    fireEvent.click(input());

    expect(panels('week')).toHaveLength(1);
    expect(popup().querySelectorAll('td.lobe-picker-cell-week').length).toBe(6);

    fireEvent.click(cellByText('21'));
    const [date, dateString] = onChange.mock.calls[0];
    expect(date.format('YYYY-MM-DD')).toBe('2026-10-21');
    expect(dateString).toBe('2026-43rd');
    expect(input().value).toBe('2026-43rd');
  });

  test('quarter picker shows Q1–Q4 and emits YYYY-[Q]Q', () => {
    const onChange = vi.fn();
    render(
      <DatePicker defaultPickerValue={dayjs('2026-01-01')} picker="quarter" onChange={onChange} />,
    );
    fireEvent.click(input());

    expect(inViewTexts()).toEqual(['Q1', 'Q2', 'Q3', 'Q4']);
    fireEvent.click(cellByText('Q3'));
    const [date, dateString] = onChange.mock.calls[0];
    expect(date.month()).toBe(6);
    expect(dateString).toBe('2026-Q3');
  });

  test('year panel shows 10 years a page and drills up to a decade panel', () => {
    const onChange = vi.fn();
    render(<DatePicker defaultValue={dayjs('2026-05-01')} picker="year" onChange={onChange} />);
    fireEvent.click(input());

    expect(headerText()).toBe('2020-2029');
    expect(inViewTexts()).toEqual(Array.from({ length: 10 }, (_, index) => String(2020 + index)));
    expect(popup().querySelectorAll('.lobe-picker-year-panel td')).toHaveLength(12);

    fireEvent.click(popup().querySelector('.lobe-picker-header-view button')!);
    expect(panels('decade')).toHaveLength(1);
    expect(headerText()).toBe('2000-2099');
    expect(inViewTexts()[0]).toBe('2000-2009');

    fireEvent.click(cellByText('2040-2049'));
    expect(panels('year')).toHaveLength(1);
    expect(headerText()).toBe('2040-2049');
    fireEvent.click(cellByText('2043'));
    expect(onChange.mock.calls[0][1]).toBe('2043');
  });

  test('showWeek adds the week column to the date panel', () => {
    const { unmount } = render(
      <DatePicker open showWeek defaultPickerValue={dayjs('2026-10-15')} />,
    );
    expect(popup().querySelector('.lobe-picker-date-panel-show-week')).not.toBeNull();
    expect(popup().querySelectorAll('td.lobe-picker-cell-week').length).toBe(6);
    unmount();

    render(<DatePicker open defaultPickerValue={dayjs('2026-10-15')} />);
    expect(popup().querySelector('td.lobe-picker-cell-week')).toBeNull();
  });

  test('disabledDate reaches the quarter, week and decade panels with info.type', () => {
    const types = new Set<string>();
    const disabledDate = (current: Dayjs, info: { type: string }) => {
      types.add(info.type);
      return current.year() === 2026 && current.month() < 3;
    };
    const { unmount } = render(
      <DatePicker
        open
        defaultPickerValue={dayjs('2026-05-01')}
        disabledDate={disabledDate}
        picker="quarter"
      />,
    );
    expect(cellByText('Q1').className).toContain('lobe-picker-cell-disabled');
    expect(cellByText('Q2').className).not.toContain('lobe-picker-cell-disabled');
    unmount();

    render(
      <DatePicker
        open
        defaultPickerValue={dayjs('2026-01-15')}
        disabledDate={disabledDate}
        picker="week"
      />,
    );
    expect(cellByText('15').className).toContain('lobe-picker-cell-disabled');
    fireEvent.click(popup().querySelector('.lobe-picker-year-btn')!);
    fireEvent.click(popup().querySelector('.lobe-picker-decade-btn')!);
    expect([...types].sort()).toEqual(['decade', 'quarter', 'week', 'year']);
  });

  test('week picker hides the week column with showWeek={false}', () => {
    render(<DatePicker open picker="week" showWeek={false} />);
    expect(popup().querySelector('td.lobe-picker-cell-week')).toBeNull();
  });
});

describe('RangePicker panel types', () => {
  afterEach(cleanup);

  test.each([
    ['month', 'month', '2026', '2027'],
    ['quarter', 'quarter', '2026', '2027'],
    ['year', 'year', '2020-2029', '2030-2039'],
    ['week', 'week', 'Oct2026', 'Nov2026'],
  ])('%s range shows two adjacent panels', (picker, panel, first, second) => {
    render(
      <DateRangePicker
        defaultPickerValue={[dayjs('2026-10-15'), dayjs('2026-10-15')]}
        picker={picker as any}
      />,
    );
    fireEvent.click(input());

    expect(panels(panel)).toHaveLength(2);
    const headers = [...popup().querySelectorAll('.lobe-picker-header-view')].map(
      (node) => node.textContent,
    );
    expect(headers).toEqual([first, second]);
  });

  test('quarter range picks start and end', () => {
    const onChange = vi.fn();
    render(
      <DateRangePicker
        defaultPickerValue={[dayjs('2026-01-01'), dayjs('2026-01-01')]}
        picker="quarter"
        onChange={onChange}
      />,
    );
    fireEvent.click(input());
    fireEvent.click(cellByText('Q2'));
    fireEvent.click(cellByText('Q3', 1));

    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange.mock.calls[0][1]).toEqual(['2026-Q2', '2027-Q3']);
  });

  test('year range picks across the two decades', () => {
    const onChange = vi.fn();
    render(
      <DateRangePicker
        defaultPickerValue={[dayjs('2026-01-01'), dayjs('2026-01-01')]}
        picker="year"
        onChange={onChange}
      />,
    );
    fireEvent.click(input());
    fireEvent.click(cellByText('2024'));
    fireEvent.click(cellByText('2031'));

    expect(onChange.mock.calls[0][1]).toEqual(['2024', '2031']);
  });
});

describe('cellRender', () => {
  afterEach(cleanup);

  test('receives every antd info field on every panel', () => {
    const infos = new Map<string, CellRenderInfo<Dayjs>>();
    const cellRender = vi.fn((current: any, info: CellRenderInfo<Dayjs>) => {
      infos.set(info.type, info);
      expect(dayjs.isDayjs(current)).toBe(true);
      return info.originNode;
    });

    render(<DatePicker cellRender={cellRender} defaultPickerValue={dayjs('2026-10-15')} />);
    fireEvent.click(input());
    // date → month → year → decade through the header
    fireEvent.click(popup().querySelector('.lobe-picker-month-btn')!);
    fireEvent.click(popup().querySelector('.lobe-picker-year-btn')!);
    fireEvent.click(popup().querySelector('.lobe-picker-decade-btn')!);

    expect([...infos.keys()].sort()).toEqual(['date', 'decade', 'month', 'year']);
    for (const [type, info] of infos) {
      expect(info.type).toBe(type);
      expect(info.prefixCls).toBe('lobe-picker');
      expect(info.originNode).toBeTruthy();
      expect(dayjs.isDayjs(info.today)).toBe(true);
      expect(info.locale?.locale).toBeTruthy();
      expect(info.range).toBeUndefined();
    }
    cleanup();

    const types = new Set<string>();
    render(
      <DatePicker
        open
        picker="quarter"
        cellRender={(_c, info) => {
          types.add(info.type);
          return info.originNode;
        }}
      />,
    );
    cleanup();
    render(
      <DatePicker
        open
        picker="week"
        cellRender={(_c, info) => {
          types.add(info.type);
          return info.originNode;
        }}
      />,
    );
    expect([...types].sort()).toEqual(['quarter', 'week']);
  });

  test('replaces the cell content and reports info.range on RangePicker', () => {
    const ranges = new Set<string | undefined>();
    render(
      <DateRangePicker
        defaultPickerValue={[dayjs('2026-10-15'), dayjs('2026-10-15')]}
        cellRender={(current, info) => {
          ranges.add(info.range);
          return <span className="custom-cell">{(current as Dayjs).date()}!</span>;
        }}
      />,
    );
    fireEvent.click(inputs()[0]);
    expect(popup().querySelectorAll('.custom-cell').length).toBeGreaterThan(60);
    expect(ranges).toEqual(new Set(['start']));

    // picking the start hands the panel to the end field
    fireEvent.click(popup().querySelector('.lobe-picker-cell-in-view .custom-cell')!);
    expect(ranges.has('end')).toBe(true);
  });

  test('dateRender and monthCellRender stay as deprecated aliases', () => {
    const warn = vi.spyOn(console, 'error').mockImplementation(() => {});
    render(
      <DatePicker
        open
        defaultPickerValue={dayjs('2026-10-15')}
        monthCellRender={(current) => <span className="legacy-month">{current.month() + 1}</span>}
        dateRender={(current, today) => (
          <span className="legacy-date" data-today={today.format('YYYY-MM-DD')}>
            {current.date()}
          </span>
        )}
      />,
    );
    expect(popup().querySelectorAll('.legacy-date')).toHaveLength(42);
    expect(popup().querySelector('.legacy-date')!.getAttribute('data-today')).toBe(
      dayjs().format('YYYY-MM-DD'),
    );

    fireEvent.click(popup().querySelector('.lobe-picker-month-btn')!);
    expect(popup().querySelectorAll('.legacy-month')).toHaveLength(12);
    warn.mockRestore();
  });

  test('cellRender wins over the deprecated aliases', () => {
    const warn = vi.spyOn(console, 'error').mockImplementation(() => {});
    render(
      <DatePicker
        open
        cellRender={(_c, info) => <span className="modern">{info.originNode}</span>}
        dateRender={() => <span className="legacy-date" />}
      />,
    );
    expect(popup().querySelector('.legacy-date')).toBeNull();
    expect(popup().querySelectorAll('.modern')).toHaveLength(42);
    warn.mockRestore();
  });
});

describe('panel keyboard', () => {
  afterEach(cleanup);

  test('grid helpers move by cell, row and page', () => {
    const date = dayjs('2026-10-15');
    expect(moveGridCell(date, 'ArrowRight', 'month')!.format('YYYY-MM')).toBe('2026-11');
    expect(moveGridCell(date, 'ArrowLeft', 'month', true)!.format('YYYY-MM')).toBe('2026-11');
    expect(moveGridCell(date, 'ArrowDown', 'month')!.format('YYYY-MM')).toBe('2027-01');
    expect(moveGridCell(date, 'PageUp', 'month')!.format('YYYY-MM')).toBe('2025-10');
    expect(moveGridCell(date, 'Home', 'month')!.format('YYYY-MM')).toBe('2026-01');
    expect(moveGridCell(date, 'End', 'month')!.format('YYYY-MM')).toBe('2026-12');
    expect(moveGridCell(date, 'ArrowRight', 'quarter')!.format('YYYY-MM')).toBe('2027-01');
    expect(moveGridCell(date, 'ArrowDown', 'quarter')!.format('YYYY-MM')).toBe('2027-10');
    expect(moveGridCell(date, 'End', 'quarter')!.format('YYYY-MM')).toBe('2026-10');
    expect(moveGridCell(date, 'ArrowUp', 'year')!.year()).toBe(2023);
    expect(moveGridCell(date, 'End', 'year')!.year()).toBe(2029);
    expect(moveGridCell(date, 'PageDown', 'year')!.year()).toBe(2036);
    expect(moveGridCell(date, 'ArrowRight', 'decade')!.year()).toBe(2036);
    expect(moveGridCell(date, 'Home', 'decade')!.year()).toBe(2000);
    expect(moveGridCell(date, 'Tab', 'month')).toBeUndefined();
    expect(getPageStart(date, 'year').year()).toBe(2020);
    expect(isSameCell(dayjs('2026-07-01'), dayjs('2026-09-30'), 'quarter')).toBe(true);
    expect(isSameCell(dayjs('2021-01-01'), dayjs('2029-12-31'), 'decade')).toBe(true);
  });

  test('month panel: arrows move the highlight, Enter picks it', () => {
    const onChange = vi.fn();
    render(<DatePicker defaultValue={dayjs('2026-10-15')} picker="month" onChange={onChange} />);
    fireEvent.click(input());
    expect(activeTexts()).toEqual([]);

    key('ArrowRight');
    expect(activeTexts()).toEqual(['Nov']);
    key('ArrowUp');
    expect(activeTexts()).toEqual(['Aug']);
    key('Home');
    expect(activeTexts()).toEqual(['Jan']);
    key('End');
    expect(activeTexts()).toEqual(['Dec']);

    key('Enter');
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange.mock.calls[0][1]).toBe('2026-12');
  });

  test('month panel: leaving the page moves the panel with it', () => {
    const onChange = vi.fn();
    render(<DatePicker defaultValue={dayjs('2026-11-01')} picker="month" onChange={onChange} />);
    fireEvent.click(input());
    expect(headerText()).toBe('2026');

    key('ArrowDown');
    expect(headerText()).toBe('2027');
    expect(activeTexts()).toEqual(['Feb']);

    key('PageUp');
    key('PageUp');
    expect(headerText()).toBe('2025');
    expect(activeTexts()).toEqual(['Feb']);

    key('Enter');
    expect(onChange.mock.calls[0][1]).toBe('2025-02');
  });

  test('without a value the first key highlights the current page date', () => {
    render(<DatePicker defaultPickerValue={dayjs('2026-04-10')} picker="month" />);
    fireEvent.click(input());
    key('ArrowLeft');
    expect(activeTexts()).toEqual(['Apr']);
    key('ArrowLeft');
    expect(activeTexts()).toEqual(['Mar']);
  });

  test('uncontrolled: after picking, the next opening moves from the picked tile', async () => {
    const onOpenChange = vi.fn();
    render(
      <DatePicker
        defaultPickerValue={dayjs('2026-01-01')}
        picker="year"
        onOpenChange={onOpenChange}
      />,
    );
    fireEvent.click(input());
    fireEvent.click(cellByText('2023'));
    await waitFor(() => expect(onOpenChange).toHaveBeenLastCalledWith(false));

    fireEvent.click(input());
    key('ArrowRight');
    expect(activeTexts()).toEqual(['2024']);
  });

  test('quarter panel: ←/→ move a quarter, ↑/↓ a year', () => {
    const onChange = vi.fn();
    render(<DatePicker defaultValue={dayjs('2026-05-01')} picker="quarter" onChange={onChange} />);
    fireEvent.click(input());

    key('ArrowRight');
    expect(activeTexts()).toEqual(['Q3']);
    key('ArrowDown');
    expect(headerText()).toBe('2027');
    expect(activeTexts()).toEqual(['Q3']);
    key('ArrowLeft');
    key('Enter');
    expect(onChange.mock.calls[0][1]).toBe('2027-Q2');
  });

  test('year and decade panels navigate and Enter drills down', () => {
    const onChange = vi.fn();
    render(<DatePicker defaultValue={dayjs('2029-01-01')} picker="year" onChange={onChange} />);
    fireEvent.click(input());

    key('ArrowRight');
    expect(headerText()).toBe('2030-2039');
    expect(activeTexts()).toEqual(['2030']);

    // up to the decade panel: the highlight resets, Enter on a decade drills back down
    fireEvent.click(popup().querySelector('.lobe-picker-header-view button')!);
    expect(panels('decade')).toHaveLength(1);
    expect(activeTexts()).toEqual([]);
    // the first key moves from the selected decade (2020s)
    key('ArrowLeft');
    expect(activeTexts()).toEqual(['2010-2019']);
    key('ArrowRight');
    key('ArrowRight');
    key('ArrowRight');
    expect(activeTexts()).toEqual(['2040-2049']);
    key('Enter');
    expect(panels('year')).toHaveLength(1);
    expect(headerText()).toBe('2040-2049');

    // the selected 2029 is off this page, so the first key starts from the page
    key('ArrowRight');
    expect(activeTexts()).toEqual(['2040']);
    key('ArrowRight');
    key('Enter');
    expect(onChange.mock.calls[0][1]).toBe('2041');
  });

  test('date panel inside a date picker: month panel keys work after drilling up', () => {
    const onChange = vi.fn();
    render(<DatePicker defaultValue={dayjs('2026-10-15')} onChange={onChange} />);
    fireEvent.click(input());

    // the date panel keeps antd's input keys
    key('ArrowRight');
    expect(popup().querySelector('.lobe-picker-cell-keyboard-active')).toBeNull();

    fireEvent.click(popup().querySelector('.lobe-picker-month-btn')!);
    key('ArrowRight');
    expect(activeTexts()).toEqual(['Nov']);
    key('Enter');
    expect(panels('date')).toHaveLength(1);
    expect(headerText()).toContain('Nov');
    expect(onChange).not.toHaveBeenCalled();
  });

  test('closing the popup clears the highlight', async () => {
    const onOpenChange = vi.fn();
    render(
      <DatePicker defaultValue={dayjs('2026-10-15')} picker="month" onOpenChange={onOpenChange} />,
    );
    fireEvent.click(input());
    key('ArrowRight');
    expect(activeTexts()).toEqual(['Nov']);

    key('Escape');
    await waitFor(() => expect(onOpenChange).toHaveBeenLastCalledWith(false));
    fireEvent.click(input());
    expect(activeTexts()).toEqual([]);
  });

  test('range month picker: keys pick the start, then the end', () => {
    const onChange = vi.fn();
    render(
      <DateRangePicker
        defaultValue={[dayjs('2026-03-01'), dayjs('2026-05-01')]}
        picker="month"
        onChange={onChange}
      />,
    );
    fireEvent.click(inputs()[0]);

    key('ArrowLeft', inputs()[0]);
    expect(activeTexts()).toEqual(['Feb']);
    key('Enter', inputs()[0]);

    // focus moves to the end field; its highlight starts from the end value
    key('ArrowDown', inputs()[1]);
    expect(activeTexts()).toEqual(['Aug']);
    // the second visible page (2027) is reached without moving the panels
    key('PageDown', inputs()[1]);
    expect(activeTexts()).toEqual(['Aug']);
    expect(
      [...popup().querySelectorAll('.lobe-picker-header-view')].map((n) => n.textContent),
    ).toEqual(['2026', '2027']);
    key('Enter', inputs()[1]);

    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange.mock.calls[0][1]).toEqual(['2026-02', '2027-08']);
  });

  test('controlled pickerValue: keys page through onPickerValueChange', () => {
    const onPickerValueChange = vi.fn();
    render(
      <DatePicker
        open
        picker="year"
        pickerValue={dayjs('2026-01-01')}
        onPickerValueChange={onPickerValueChange}
      />,
    );
    fireEvent.focus(input());
    key('ArrowRight');
    expect(activeTexts()).toEqual(['2026']);
    key('PageDown');
    expect(onPickerValueChange).toHaveBeenLastCalledWith(
      expect.objectContaining({ $y: 2036 }),
      expect.objectContaining({ mode: 'year', source: 'panel' }),
    );
  });
});
