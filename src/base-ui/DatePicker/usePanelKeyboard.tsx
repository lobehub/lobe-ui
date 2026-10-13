'use client';

import type { CellRender, PanelMode, PickerMode } from '@rc-component/picker/interface';
import dayjs, { type Dayjs } from 'dayjs';
import { useCallback, useEffect, useId, useRef, useState } from 'react';

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

/** First cell of the page `date` is on: Jan / Q1 of its year, first year of its decade… */
export const getPageStart = (date: Dayjs, mode: GridPanelMode) => {
  const year = date.year();
  if (mode === 'year') return date.year(Math.floor(year / 10) * 10).startOf('year');
  if (mode === 'decade') return date.year(Math.floor(year / 100) * 100).startOf('year');
  return date.startOf('year');
};

const getPageEnd = (date: Dayjs, mode: GridPanelMode) => {
  const start = getPageStart(date, mode);
  if (mode === 'month') return start.month(11);
  if (mode === 'quarter') return start.month(9);
  return start.add(mode === 'year' ? 9 : 90, 'year');
};

/** Whether `a` and `b` fall in the same tile of a `mode` panel. */
export const isSameCell = (a: Dayjs, b: Dayjs, mode: GridPanelMode) => {
  if (mode === 'decade') return Math.floor(a.year() / 10) === Math.floor(b.year() / 10);
  if (mode === 'year') return a.year() === b.year();
  if (mode === 'quarter') {
    return a.year() === b.year() && Math.floor(a.month() / 3) === Math.floor(b.month() / 3);
  }
  return a.year() === b.year() && a.month() === b.month();
};

/**
 * Where `key` moves the active tile of a `mode` panel, or `undefined` for other keys.
 * `rtl` mirrors ←/→.
 */
export const moveGridCell = (date: Dayjs, key: string, mode: GridPanelMode, rtl = false) => {
  const { col, page, row, unit } = GRID[mode];
  switch (key) {
    case 'ArrowLeft': {
      return date.add(rtl ? col : -col, unit);
    }
    case 'ArrowRight': {
      return date.add(rtl ? -col : col, unit);
    }
    case 'ArrowUp': {
      return date.add(-row, unit);
    }
    case 'ArrowDown': {
      return date.add(row, unit);
    }
    case 'PageUp': {
      return date.add(-page, unit);
    }
    case 'PageDown': {
      return date.add(page, unit);
    }
    case 'Home': {
      return getPageStart(date, mode);
    }
    case 'End': {
      return getPageEnd(date, mode);
    }
  }
};

const ACTIVE_CLS = `${PREFIX_CLS}-cell-keyboard-active`;

type Pair = [Dayjs | undefined, Dayjs | undefined];
type MaybePair<T> = T | [T, T] | null | undefined;

const toPair = (value: MaybePair<Dayjs | null | undefined>): Pair =>
  Array.isArray(value)
    ? [value[0] ?? undefined, value[1] ?? undefined]
    : [value ?? undefined, undefined];

export interface PanelKeyboardOptions {
  cellRender?: CellRender<Dayjs>;
  dateRender?: (currentDate: Dayjs, today: Dayjs) => React.ReactNode;
  defaultOpen?: boolean;
  defaultPickerValue?: MaybePair<Dayjs | null | undefined>;
  defaultValue?: MaybePair<Dayjs | null | undefined>;
  direction?: 'ltr' | 'rtl';
  mode?: MaybePair<PanelMode>;
  monthCellRender?: (currentDate: Dayjs, locale: any) => React.ReactNode;
  onChange?: (...args: any[]) => void;
  onFocus?: (...args: any[]) => void;
  onOpenChange?: (open: boolean) => void;
  onPanelChange?: (...args: any[]) => void;
  onPickerValueChange?: (...args: any[]) => void;
  open?: boolean;
  picker?: PickerMode;
  pickerValue?: MaybePair<Dayjs | null | undefined>;
  /** RangePicker: values, panel modes and picker values are `[start, end]` tuples. */
  range?: boolean;
  value?: MaybePair<Dayjs | null | undefined>;
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
  const [activeCell, setActiveCell] = useState<Dayjs>();
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
    defaultPickerValue: toPair(defaultPickerValue),
    direction,
    mergedPickerValue,
    onPickerValueChange,
    panelMode,
    picker,
    range,
    value: toPair(value === undefined ? (innerValue ?? defaultValue) : value),
  };
  const stateRef = useRef(state);
  stateRef.current = state;

  const commitPickerValue = useCallback((next: Dayjs) => {
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
        dayjs();
      // Two side-by-side pages on a RangePicker showing its own `picker` panel.
      const pages = range && panelMode === picker ? 2 : 1;
      const firstPage = getPageStart(pageDate, panelMode);
      const lastPage = getPageStart(moveGridCell(firstPage, 'PageDown', panelMode)!, panelMode);
      const isVisible = (date: Dayjs) => {
        const page = getPageStart(date, panelMode);
        return page.isSame(firstPage) || (pages === 2 && page.isSame(lastPage));
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
        ? moveGridCell(base, event.key, panelMode, direction === 'rtl')
        : moveGridCell(pageDate, event.key, panelMode, direction === 'rtl') && pageDate;
      if (!next) return;

      event.preventDefault();
      event.stopPropagation();
      setActiveCell(next);

      const nextPage = getPageStart(next, panelMode);
      if (nextPage.isBefore(firstPage)) {
        commitPickerValue(next);
      } else if (!isVisible(next)) {
        commitPickerValue(pages === 2 ? moveGridCell(next, 'PageUp', panelMode)! : next);
      }
    };

    document.addEventListener('keydown', onKeyDown, true);
    return () => document.removeEventListener('keydown', onKeyDown, true);
  }, [mergedOpen, scopeClassName, commitPickerValue]);

  const mergedCellRender: CellRender<Dayjs> = (current, info) => {
    let node: React.ReactNode = info.originNode;
    if (cellRender) node = cellRender(current, info);
    // rc-picker's legacy aliases: only date / month cells, which always get a Dayjs.
    else if (dateRender && info.type === 'date') node = dateRender(current as Dayjs, info.today);
    else if (monthCellRender && info.type === 'month') {
      node = monthCellRender(current as Dayjs, info.locale);
    }

    if (!activeCell || info.type !== panelMode || !isGridMode(info.type)) return node;
    if (!isSameCell(current as Dayjs, activeCell, info.type)) return node;
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
      setInnerValue(toPair(date));
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
