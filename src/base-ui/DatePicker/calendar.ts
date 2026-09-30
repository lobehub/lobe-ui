import dayjs from 'dayjs';

export type CalendarMode = 'date' | 'month' | 'year';

export interface DateBounds {
  disabledDate?: (date: Date) => boolean;
  max?: Date;
  min?: Date;
}

export const DEFAULT_FORMAT: Record<CalendarMode, string> = {
  date: 'MMM D, YYYY',
  month: 'MMMM YYYY',
  year: 'YYYY',
};

export const getWeekStart = (): number => {
  const locales = (dayjs as unknown as { Ls: Record<string, { weekStart?: number }> }).Ls;
  return locales[dayjs.locale()]?.weekStart ?? 0;
};

const offsetFromWeekStart = (date: Date, weekStart: number) =>
  (dayjs(date).day() - weekStart + 7) % 7;

export const buildMonthGrid = (month: Date, weekStart = getWeekStart()): Date[] => {
  const first = dayjs(month).startOf('month');
  const start = first.subtract(offsetFromWeekStart(first.toDate(), weekStart), 'day');
  return Array.from({ length: 42 }, (_, index) => start.add(index, 'day').toDate());
};

export const getWeekdayLabels = (weekStart = getWeekStart()): string[] =>
  Array.from({ length: 7 }, (_, index) =>
    dayjs()
      .day((weekStart + index) % 7)
      .format('dd'),
  );

export const isSameDay = (a?: Date | null, b?: Date | null) =>
  !!a && !!b && dayjs(a).isSame(b, 'day');

export const isDayDisabled = (date: Date, { disabledDate, max, min }: DateBounds) =>
  (!!min && dayjs(date).isBefore(min, 'day')) ||
  (!!max && dayjs(date).isAfter(max, 'day')) ||
  !!disabledDate?.(date);

export const isMonthDisabled = (month: Date, { max, min }: DateBounds) =>
  (!!min && dayjs(month).isBefore(min, 'month')) || (!!max && dayjs(month).isAfter(max, 'month'));

export const isYearDisabled = (year: Date, { max, min }: DateBounds) =>
  (!!min && dayjs(year).isBefore(min, 'year')) || (!!max && dayjs(year).isAfter(max, 'year'));

export const moveDayFocus = (date: Date, key: string, weekStart = getWeekStart()): Date | null => {
  const current = dayjs(date);
  const offset = offsetFromWeekStart(date, weekStart);
  switch (key) {
    case 'ArrowLeft': {
      return current.subtract(1, 'day').toDate();
    }
    case 'ArrowRight': {
      return current.add(1, 'day').toDate();
    }
    case 'ArrowUp': {
      return current.subtract(7, 'day').toDate();
    }
    case 'ArrowDown': {
      return current.add(7, 'day').toDate();
    }
    case 'PageUp': {
      return current.subtract(1, 'month').toDate();
    }
    case 'PageDown': {
      return current.add(1, 'month').toDate();
    }
    case 'Home': {
      return current.subtract(offset, 'day').toDate();
    }
    case 'End': {
      return current.add(6 - offset, 'day').toDate();
    }
    default: {
      return null;
    }
  }
};

export const orderRange = (a: Date, b: Date): [Date, Date] =>
  dayjs(a).isAfter(b, 'day') ? [b, a] : [a, b];
