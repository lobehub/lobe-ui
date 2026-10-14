'use client';

import { useCallback, useEffect, useId, useRef, useState } from 'react';

import type { GenerateConfig } from './core/generate';
import type { CellRender, PanelMode, PickerMode } from './core/interface';
import dayjsGenerateConfig from './generateConfig';
import { PREFIX_CLS } from './style';

/** Panels with a fixed grid of month / quarter / year / decade tiles. */
export type GridPanelMode = 'decade' | 'month' | 'quarter' | 'year';

const isGridMode = (mode?: PanelMode): mode is GridPanelMode =>
  mode === 'month' || mode === 'quarter' || mode === 'year' || mode === 'decade';

/** Cell steps per panel: one cell (←/→), one row (↑/↓) and one page (PageUp/PageDown). */
const GRID: Record<
  GridPanelMode,
  { col: number; page: number; row: number; unit: 'month' | 'year' }
> = {
  decade: { col: 10, page: 100, row: 30, unit: 'year' },
  month: { col: 1, page: 12, row: 3, unit: 'month' },
  quarter: { col: 3, page: 12, row: 12, unit: 'month' },
  year: { col: 1, page: 10, row: 3, unit: 'year' },
};

// Date math goes through rc-picker's `generateConfig`, so `generatePicker` works with any
// date library; the default is the Dayjs one.
const defaultConfig = dayjsGenerateConfig as GenerateConfig<any>;

/** Months since year 0, to compare tiles by position. */
const monthIndex = <D,>(date: D, config: GenerateConfig<D>) =>
  config.getYear(date) * 12 + config.getMonth(date);

/** First cell of the page `date` is on: Jan / Q1 of its year, first year of its decade… */
export const getPageStart = <D,>(
  date: D,
  mode: GridPanelMode,
  config: GenerateConfig<D> = defaultConfig,
) => {
  const year = config.getYear(date);
  const startYear =
    mode === 'year'
      ? Math.floor(year / 10) * 10
      : mode === 'decade'
        ? Math.floor(year / 100) * 100
        : year;
  const start = config.setDate(config.setMonth(config.setYear(date, startYear), 0), 1);
  return config.setHour(
    config.setMinute(config.setSecond(config.setMillisecond(start, 0), 0), 0),
    0,
  );
};

const getPageEnd = <D,>(date: D, mode: GridPanelMode, config: GenerateConfig<D>) => {
  const start = getPageStart(date, mode, config);
  if (mode === 'month') return config.setMonth(start, 11);
  if (mode === 'quarter') return config.setMonth(start, 9);
  return config.addYear(start, mode === 'year' ? 9 : 90);
};

/** Whether `a` and `b` fall in the same tile of a `mode` panel. */
export const isSameCell = <D,>(
  a: D,
  b: D,
  mode: GridPanelMode,
  config: GenerateConfig<D> = defaultConfig,
) => {
  const yearA = config.getYear(a);
  const yearB = config.getYear(b);
  if (mode === 'decade') return Math.floor(yearA / 10) === Math.floor(yearB / 10);
  if (mode === 'year') return yearA === yearB;
  if (mode === 'quarter') {
    return (
      yearA === yearB && Math.floor(config.getMonth(a) / 3) === Math.floor(config.getMonth(b) / 3)
    );
  }
  return yearA === yearB && config.getMonth(a) === config.getMonth(b);
};

/**
 * Where `key` moves the active tile of a `mode` panel, or `undefined` for other keys.
 * `rtl` mirrors ←/→.
 */
export const moveGridCell = <D,>(
  date: D,
  key: string,
  mode: GridPanelMode,
  rtl = false,
  config: GenerateConfig<D> = defaultConfig,
) => {
  const { col, page, row, unit } = GRID[mode];
  const add = (diff: number) =>
    unit === 'year' ? config.addYear(date, diff) : config.addMonth(date, diff);
  switch (key) {
    case 'ArrowLeft': {
      return add(rtl ? col : -col);
    }
    case 'ArrowRight': {
      return add(rtl ? -col : col);
    }
    case 'ArrowUp': {
      return add(-row);
    }
    case 'ArrowDown': {
      return add(row);
    }
    case 'PageUp': {
      return add(-page);
    }
    case 'PageDown': {
      return add(page);
    }
    case 'Home': {
      return getPageStart(date, mode, config);
    }
    case 'End': {
      return getPageEnd(date, mode, config);
    }
  }
};

const ACTIVE_CLS = `${PREFIX_CLS}-cell-keyboard-active`;

/** A date of the picker's library (`Dayjs` by default). */
type DateValue = object;
type Pair = [DateValue | undefined, DateValue | undefined];
type MaybePair<T> = T | [T, T] | null | undefined;

const toPair = (value: MaybePair<DateValue | null | undefined>): Pair =>
  Array.isArray(value)
    ? [value[0] ?? undefined, value[1] ?? undefined]
    : [value ?? undefined, undefined];

/** The selection the keys start from; with `multiple`, the last picked date. */
const toValuePair = (
  value: MaybePair<DateValue | null | undefined> | DateValue[],
  range?: boolean,
) =>
  !range && Array.isArray(value) ? toPair(value.at(-1)) : toPair(value as MaybePair<DateValue>);

export interface PanelKeyboardOptions {
  cellRender?: CellRender<any>;
  dateRender?: (currentDate: any, today: any) => React.ReactNode;
  defaultOpen?: boolean;
  defaultPickerValue?: MaybePair<DateValue | null | undefined>;
  /** An array with DatePicker `multiple`. */
  defaultValue?: MaybePair<DateValue | null | undefined> | DateValue[];
  direction?: 'ltr' | 'rtl';
  generateConfig?: GenerateConfig<any>;
  mode?: MaybePair<PanelMode>;
  monthCellRender?: (currentDate: any, locale: any) => React.ReactNode;
  onChange?: (...args: any[]) => void;
  onFocus?: (...args: any[]) => void;
  onOpenChange?: (open: boolean) => void;
  onPanelChange?: (...args: any[]) => void;
  onPickerValueChange?: (...args: any[]) => void;
  open?: boolean;
  picker?: PickerMode;
  pickerValue?: MaybePair<DateValue | null | undefined>;
  /** RangePicker: values, panel modes and picker values are `[start, end]` tuples. */
  range?: boolean;
  value?: MaybePair<DateValue | null | undefined> | DateValue[];
}

/**
 * lobe enhancement over rc-picker (ADR §8 step 6): arrow keys, PageUp / PageDown and
 * Home / End move an active tile on the month, quarter, year and decade panels while
 * focus stays in the input, and Enter picks it — as a click on that tile would.
 *
 * rc-picker has no grid navigation of its own, so this is layered on top: a capture
 * listener reads the keys before rc-picker's input handlers, the active tile is marked
 * through `cellRender`, and `pickerValue` is driven so the active tile stays on screen.
 * The date and week panels keep the input's text-editing keys, as in antd.
 */
export const usePanelKeyboard = ({
  cellRender,
  dateRender,
  defaultOpen,
  defaultPickerValue,
  defaultValue,
  direction,
  generateConfig: config = defaultConfig,
  mode,
  monthCellRender,
  onChange,
  onFocus,
  onOpenChange,
  onPanelChange,
  onPickerValueChange,
  open,
  picker = 'date',
  pickerValue,
  range,
  value,
}: PanelKeyboardOptions) => {
  const scopeId = useId();
  const scopeClassName = `${PREFIX_CLS}-kb-${scopeId.replaceAll(/[^\w-]/g, '')}`;

  const [innerOpen, setInnerOpen] = useState(!!defaultOpen);
  const mergedOpen = open ?? innerOpen;
  const [activeIndex, setActiveIndex] = useState<0 | 1>(0);
  const [innerMode, setInnerMode] = useState<PanelMode>(picker);
  const [innerPickerValue, setInnerPickerValue] = useState<Pair>([undefined, undefined]);
  const [activeCell, setActiveCell] = useState<DateValue>();
  // Uncontrolled: the last committed value, so the first key starts from it.
  const [innerValue, setInnerValue] = useState<Pair>();

  const controlledMode = Array.isArray(mode) ? mode[activeIndex] : mode;
  const panelMode = controlledMode ?? innerMode;

  // rc-picker resets the panel to `picker` on every opening and field switch; a new
  // panel starts without a highlighted tile.
  const resetKey = `${mergedOpen}|${activeIndex}|${picker}`;
  const [prevResetKey, setPrevResetKey] = useState(resetKey);
  if (prevResetKey !== resetKey) {
    setPrevResetKey(resetKey);
    setInnerMode(picker);
    setActiveCell(undefined);
  }
  const [prevPanelMode, setPrevPanelMode] = useState(panelMode);
  if (prevPanelMode !== panelMode) {
    setPrevPanelMode(panelMode);
    setActiveCell(undefined);
  }

  const mergedPickerValue: Pair =
    pickerValue === undefined ? innerPickerValue : toPair(pickerValue);

  const state = {
    activeCell,
    activeIndex,
    config,
    defaultPickerValue: toPair(defaultPickerValue),
    direction,
    mergedPickerValue,
    onPickerValueChange,
    panelMode,
    picker,
    range,
    value:
      value === undefined
        ? (innerValue ?? toValuePair(defaultValue, range))
        : toValuePair(value, range),
  };
  const stateRef = useRef(state);
  stateRef.current = state;

  const commitPickerValue = useCallback((next: DateValue) => {
    const { activeIndex, mergedPickerValue, onPickerValueChange, panelMode, range } =
      stateRef.current;
    const nextPair: Pair = [...mergedPickerValue];
    nextPair[activeIndex] = next;
    setInnerPickerValue(nextPair);
    if (range) {
      onPickerValueChange?.(nextPair, {
        mode: [panelMode, panelMode],
        range: activeIndex === 1 ? 'end' : 'start',
        source: 'panel',
      });
    } else {
      onPickerValueChange?.(next, { mode: panelMode, source: 'panel' });
    }
  }, []);

  useEffect(() => {
    if (!mergedOpen) return;

    const onKeyDown = (event: KeyboardEvent) => {
      const {
        activeCell,
        activeIndex,
        config,
        defaultPickerValue,
        direction,
        mergedPickerValue,
        panelMode,
        picker,
        range,
        value,
      } = stateRef.current;
      if (!isGridMode(panelMode) || event.altKey || event.ctrlKey || event.metaKey) return;
      if (!(event.target instanceof Element) || !event.target.closest(`.${scopeClassName}`)) return;

      if (event.key === 'Enter') {
        if (!activeCell) return;
        const cells = [...document.querySelectorAll(`.${scopeClassName} .${ACTIVE_CLS}`)]
          .map((node) => node.closest('td'))
          .filter((node): node is HTMLTableCellElement => !!node);
        const cell = cells.find((node) => node.classList.contains(`${PREFIX_CLS}-cell-in-view`));
        event.preventDefault();
        event.stopPropagation();
        (cell ?? cells[0])?.click();
        return;
      }

      // Until rc-picker reports a change, its panel date is the same fallback chain.
      const pageDate =
        mergedPickerValue[activeIndex] ??
        defaultPickerValue[activeIndex] ??
        value[activeIndex] ??
        config.getNow();
      const rtl = direction === 'rtl';
      // Two side-by-side pages on a RangePicker showing its own `picker` panel.
      const pages = range && panelMode === picker ? 2 : 1;
      const pageIndex = (date: DateValue) =>
        monthIndex(getPageStart(date, panelMode, config), config);
      const firstPage = pageIndex(pageDate);
      const lastPage = pageIndex(moveGridCell(pageDate, 'PageDown', panelMode, rtl, config)!);
      const isVisible = (date: DateValue) => {
        const page = pageIndex(date);
        return page === firstPage || (pages === 2 && page === lastPage);
      };

      // The first key starts from the selected tile when on screen, otherwise from the page.
      const selected = value[activeIndex];
      const base =
        activeCell && isVisible(activeCell)
          ? activeCell
          : selected && isVisible(selected)
            ? selected
            : undefined;
      const next = base
        ? moveGridCell(base, event.key, panelMode, rtl, config)
        : moveGridCell(pageDate, event.key, panelMode, rtl, config) && pageDate;
      if (!next) return;

      event.preventDefault();
      event.stopPropagation();
      setActiveCell(next);

      if (pageIndex(next) < firstPage) {
        commitPickerValue(next);
      } else if (!isVisible(next)) {
        commitPickerValue(
          pages === 2 ? moveGridCell(next, 'PageUp', panelMode, rtl, config)! : next,
        );
      }
    };

    document.addEventListener('keydown', onKeyDown, true);
    return () => document.removeEventListener('keydown', onKeyDown, true);
  }, [mergedOpen, scopeClassName, commitPickerValue]);

  const mergedCellRender: CellRender<any> = (current, info) => {
    let node: React.ReactNode = info.originNode;
    if (cellRender) node = cellRender(current, info);
    // rc-picker's legacy aliases: only date / month cells, which always get a date.
    else if (dateRender && info.type === 'date') node = dateRender(current, info.today);
    else if (monthCellRender && info.type === 'month') {
      node = monthCellRender(current, info.locale);
    }

    if (!activeCell || info.type !== panelMode || !isGridMode(info.type)) return node;
    if (!isSameCell(current as DateValue, activeCell, info.type, config)) return node;
    return (
      <>
        {node}
        <span aria-hidden className={ACTIVE_CLS} />
      </>
    );
  };

  const hasPickerValue = pickerValue !== undefined || innerPickerValue.some(Boolean);

  return {
    cellRender: mergedCellRender,
    onChange: (date: any, dateString: any) => {
      setInnerValue(toValuePair(date, range));
      onChange?.(date, dateString);
    },
    onFocus: (event: any, info?: { range?: 'end' | 'start' }) => {
      if (range && info?.range) setActiveIndex(info.range === 'end' ? 1 : 0);
      onFocus?.(event, info);
    },
    onOpenChange: (next: boolean) => {
      setInnerOpen(next);
      onOpenChange?.(next);
    },
    onPanelChange: (date: any, nextMode: any) => {
      setInnerMode(Array.isArray(nextMode) ? nextMode[stateRef.current.activeIndex] : nextMode);
      onPanelChange?.(date, nextMode);
    },
    onPickerValueChange: (date: any, info: any) => {
      setInnerPickerValue(toPair(date));
      onPickerValueChange?.(date, info);
    },
    /** Controlled once known, so a key can move the visible page. */
    pickerValue: hasPickerValue
      ? range
        ? (mergedPickerValue as any)
        : mergedPickerValue[0]
      : undefined,
    scopeClassName,
  };
};
