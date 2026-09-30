'use client';

import { cx } from 'antd-style';
import dayjs from 'dayjs';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { type KeyboardEvent, memo, useEffect, useRef, useState } from 'react';

import { panelStyles } from '@/base-ui/panelStyles';
import datePickerMessages from '@/i18n/resources/en/datePicker';
import { useTranslation } from '@/i18n/useTranslation';
import Icon from '@/Icon';

import {
  buildMonthGrid,
  type CalendarMode,
  type DateBounds,
  getWeekdayLabels,
  getWeekStart,
  isDayDisabled,
  isMonthDisabled,
  isSameDay,
  isYearDisabled,
  moveDayFocus,
  orderRange,
} from './calendar';
import { styles } from './style';

export interface CalendarPanelProps {
  bounds: DateBounds;
  hovered?: Date | null;
  mode: CalendarMode;
  month: Date;
  onHover?: (date: Date | null) => void;
  onMonthChange: (month: Date) => void;
  onSelect: (date: Date) => void;
  range?: [Date | null, Date | null];
  selected?: Date | null;
  showNav?: boolean;
}

const MONTHS = Array.from({ length: 12 }, (_, index) => index);

const CalendarPanel = memo<CalendarPanelProps>(
  ({
    bounds,
    hovered,
    mode,
    month,
    onHover,
    onMonthChange,
    onSelect,
    range,
    selected,
    showNav = true,
  }) => {
    const { t } = useTranslation(datePickerMessages);
    const [view, setView] = useState<CalendarMode>(mode);
    const [focused, setFocused] = useState<Date>(selected ?? month);
    const gridRef = useRef<HTMLDivElement>(null);
    const weekStart = getWeekStart();
    const today = new Date();
    const current = dayjs(month);
    const decadeStart = Math.floor(current.year() / 12) * 12;
    const focusDay = dayjs(focused).isSame(month, 'month')
      ? focused
      : current.startOf('month').toDate();

    useEffect(() => {
      const target = gridRef.current?.querySelector<HTMLButtonElement>('[data-focus-target]');
      if (target && gridRef.current?.contains(document.activeElement)) target.focus();
    }, [focused]);

    const step = (direction: 1 | -1) => {
      const unit = view === 'date' ? 'month' : 'year';
      const amount = view === 'year' ? 12 * direction : direction;
      onMonthChange(current.add(amount, unit).toDate());
    };

    const drillUp = () => setView(view === 'date' ? 'month' : 'year');

    const handleDayKey = (event: KeyboardEvent<HTMLButtonElement>) => {
      const next = moveDayFocus(focusDay, event.key, weekStart);
      if (!next) return;
      event.preventDefault();
      setFocused(next);
      if (!dayjs(next).isSame(month, 'month')) onMonthChange(next);
    };

    const band = (() => {
      if (!range?.[0]) return null;
      const end = range[1] ?? hovered;
      return end ? orderRange(range[0], end) : null;
    })();

    const renderDays = () => {
      const days = buildMonthGrid(month, weekStart);
      return (
        <div
          aria-label={current.format('MMMM YYYY')}
          className={styles.grid}
          ref={gridRef}
          role="grid"
          onMouseLeave={() => onHover?.(null)}
        >
          {getWeekdayLabels(weekStart).map((label) => (
            <span className={cx(styles.weekday, panelStyles.label)} key={label} role="columnheader">
              {label}
            </span>
          ))}
          {days.map((date) => {
            const outside = !dayjs(date).isSame(month, 'month');
            const isStart = !outside && !!band && isSameDay(date, band[0]);
            const isEnd = !outside && !!band && isSameDay(date, band[1]);
            const inBand =
              !outside &&
              !!band &&
              dayjs(date).isAfter(band[0], 'day') &&
              dayjs(date).isBefore(band[1], 'day');
            const pressed = !outside && (isSameDay(date, selected) || isStart || isEnd);
            const focusTarget = isSameDay(date, focusDay) && !outside;

            return (
              <span
                aria-selected={pressed}
                key={date.toISOString()}
                role="gridcell"
                className={cx(
                  styles.cell,
                  inBand && styles.band,
                  isStart && !isEnd && styles.bandStart,
                  isEnd && !isStart && styles.bandEnd,
                )}
              >
                <button
                  aria-label={dayjs(date).format('MMMM D, YYYY')}
                  aria-pressed={pressed}
                  className={styles.day}
                  data-focus-target={focusTarget ? '' : undefined}
                  data-outside={outside ? '' : undefined}
                  data-today={isSameDay(date, today) ? '' : undefined}
                  disabled={isDayDisabled(date, bounds)}
                  tabIndex={focusTarget ? 0 : -1}
                  type="button"
                  onClick={() => onSelect(dayjs(date).startOf('day').toDate())}
                  onKeyDown={handleDayKey}
                  onMouseEnter={() => onHover?.(date)}
                >
                  {date.getDate()}
                </button>
              </span>
            );
          })}
        </div>
      );
    };

    const renderMonths = () => (
      <div className={styles.tiles}>
        {MONTHS.map((index) => {
          const date = current.month(index).startOf('month').toDate();
          return (
            <button
              aria-pressed={!!selected && dayjs(selected).isSame(date, 'month')}
              className={styles.tile}
              data-today={dayjs(today).isSame(date, 'month') ? '' : undefined}
              disabled={isMonthDisabled(date, bounds)}
              key={index}
              type="button"
              onClick={() => {
                if (mode === 'month') return onSelect(date);
                onMonthChange(date);
                setView('date');
              }}
            >
              {dayjs(date).format('MMM')}
            </button>
          );
        })}
      </div>
    );

    const renderYears = () => (
      <div className={styles.tiles}>
        {MONTHS.map((index) => {
          const date = dayjs(new Date(decadeStart + index, 0, 1)).toDate();
          return (
            <button
              aria-pressed={!!selected && dayjs(selected).isSame(date, 'year')}
              className={styles.tile}
              data-today={dayjs(today).isSame(date, 'year') ? '' : undefined}
              disabled={isYearDisabled(date, bounds)}
              key={index}
              type="button"
              onClick={() => {
                if (mode === 'year') return onSelect(date);
                onMonthChange(current.year(decadeStart + index).toDate());
                setView('month');
              }}
            >
              {decadeStart + index}
            </button>
          );
        })}
      </div>
    );

    const title = (() => {
      if (view === 'date')
        return (
          <>
            {current.format('MMMM')}{' '}
            <span className={panelStyles.titleMuted}>{current.format('YYYY')}</span>
          </>
        );
      if (view === 'month') return current.format('YYYY');
      return `${decadeStart} – ${decadeStart + 11}`;
    })();

    return (
      <div className={styles.calendar}>
        <div className={styles.header}>
          <button
            className={panelStyles.title}
            disabled={view === 'year'}
            type="button"
            onClick={drillUp}
          >
            {title}
          </button>
          {showNav && (
            <div className={styles.navGroup}>
              <button
                aria-label={t('datePicker.previous')}
                className={panelStyles.nav}
                type="button"
                onClick={() => step(-1)}
              >
                <Icon icon={ChevronLeft} size={14} />
              </button>
              <button
                aria-label={t('datePicker.next')}
                className={panelStyles.nav}
                type="button"
                onClick={() => step(1)}
              >
                <Icon icon={ChevronRight} size={14} />
              </button>
            </div>
          )}
        </div>
        {view === 'date' && renderDays()}
        {view === 'month' && renderMonths()}
        {view === 'year' && renderYears()}
      </div>
    );
  },
);

CalendarPanel.displayName = 'CalendarPanel';

export default CalendarPanel;
