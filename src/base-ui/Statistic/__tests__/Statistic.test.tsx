import { cleanup, render, screen } from '@testing-library/react';

import { formatStatisticValue } from '../formatValue';
import Statistic from '../Statistic';

describe('formatStatisticValue', () => {
  test.each([
    [1284390, undefined, '1,284,390'],
    [-1234, undefined, '-1,234'],
    [3.14159, undefined, '3.14159'],
    [42.5, 2, '42.50'],
    [1234.567, 1, '1,234.6'],
    [1e-7, undefined, '1e-7'],
    [Number.NaN, undefined, 'NaN'],
    ['12 / 3', undefined, '12 / 3'],
    [undefined, undefined, ''],
  ])('formats %s with precision %s as %s', (value, precision, expected) => {
    expect(formatStatisticValue(value as number | string | undefined, precision)).toBe(expected);
  });
});

describe('Statistic', () => {
  afterEach(cleanup);

  test('renders the title and the formatted value', () => {
    render(<Statistic title="Total tokens" value={1284390} />);

    expect(screen.getByText('Total tokens')).toBeTruthy();
    expect(screen.getByText('1,284,390')).toBeTruthy();
  });

  test('renders prefix and suffix around the value', () => {
    render(<Statistic precision={2} prefix="$" suffix="/ mo" value={42.5} />);

    expect(screen.getByText('$')).toBeTruthy();
    expect(screen.getByText('42.50')).toBeTruthy();
    expect(screen.getByText('/ mo')).toBeTruthy();
  });

  test('formatter overrides the built-in formatting', () => {
    render(<Statistic formatter={(value) => `~${value}`} value={1000} />);

    expect(screen.getByText('~1000')).toBeTruthy();
  });

  test('loading hides the value and keeps the title', () => {
    render(<Statistic loading title="Credits" value={1000} />);

    expect(screen.getByText('Credits')).toBeTruthy();
    expect(screen.queryByText('1,000')).toBeNull();
  });

  test('applies styles.value to the value element', () => {
    render(<Statistic styles={{ value: { color: 'rgb(1, 2, 3)' } }} value={7} />);

    expect(screen.getByText('7').parentElement!.getAttribute('style')).toContain('rgb(1, 2, 3)');
  });

  test('sets the displayName', () => {
    expect(Statistic.displayName).toBe('Statistic');
  });
});
