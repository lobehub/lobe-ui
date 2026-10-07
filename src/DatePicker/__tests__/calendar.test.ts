import {
  buildMonthGrid,
  getWeekdayLabels,
  isDayDisabled,
  isMonthDisabled,
  isSameDay,
  moveDayFocus,
  orderRange,
} from '../calendar';

const day = (y: number, m: number, d: number) => new Date(y, m, d);

describe('buildMonthGrid', () => {
  test('always 42 days, starting on the week start', () => {
    const sunday = buildMonthGrid(day(2026, 9, 1), 0);
    expect(sunday).toHaveLength(42);
    expect(isSameDay(sunday[0], day(2026, 8, 27))).toBe(true);
    expect(isSameDay(sunday[41], day(2026, 10, 7))).toBe(true);

    const monday = buildMonthGrid(day(2026, 9, 1), 1);
    expect(isSameDay(monday[0], day(2026, 8, 28))).toBe(true);
  });

  test('a month that starts on the week start begins on the 1st', () => {
    const grid = buildMonthGrid(day(2026, 1, 1), 0);
    expect(isSameDay(grid[0], day(2026, 1, 1))).toBe(true);
  });
});

describe('getWeekdayLabels', () => {
  test('rotates with the week start', () => {
    expect(getWeekdayLabels(0)[0]).toBe('Su');
    expect(getWeekdayLabels(1)[0]).toBe('Mo');
    expect(getWeekdayLabels(1)[6]).toBe('Su');
  });
});

describe('bounds', () => {
  test('compares by calendar day even when min carries a time of day', () => {
    const min = new Date(2026, 9, 8, 15, 42);
    expect(isDayDisabled(day(2026, 9, 8), { min })).toBe(false);
    expect(isDayDisabled(day(2026, 9, 7), { min })).toBe(true);
  });

  test('max and disabledDate', () => {
    const max = day(2026, 9, 20);
    expect(isDayDisabled(day(2026, 9, 21), { max })).toBe(true);
    expect(isDayDisabled(day(2026, 9, 10), { disabledDate: (d) => d.getDate() === 10 })).toBe(true);
  });

  test('months outside min / max', () => {
    const bounds = { max: day(2026, 11, 31), min: day(2026, 9, 15) };
    expect(isMonthDisabled(day(2026, 8, 1), bounds)).toBe(true);
    expect(isMonthDisabled(day(2026, 9, 1), bounds)).toBe(false);
  });
});

describe('moveDayFocus', () => {
  test('arrow, page and home / end keys', () => {
    const from = day(2026, 9, 15);
    expect(isSameDay(moveDayFocus(from, 'ArrowRight', 0), day(2026, 9, 16))).toBe(true);
    expect(isSameDay(moveDayFocus(from, 'ArrowUp', 0), day(2026, 9, 8))).toBe(true);
    expect(isSameDay(moveDayFocus(from, 'PageDown', 0), day(2026, 10, 15))).toBe(true);
    expect(isSameDay(moveDayFocus(from, 'Home', 0), day(2026, 9, 11))).toBe(true);
    expect(isSameDay(moveDayFocus(from, 'End', 0), day(2026, 9, 17))).toBe(true);
    expect(moveDayFocus(from, 'a', 0)).toBeNull();
  });
});

describe('orderRange', () => {
  test('returns the earlier date first', () => {
    const [start, end] = orderRange(day(2026, 9, 8), day(2026, 8, 22));
    expect(isSameDay(start, day(2026, 8, 22))).toBe(true);
    expect(isSameDay(end, day(2026, 9, 8))).toBe(true);
  });
});
