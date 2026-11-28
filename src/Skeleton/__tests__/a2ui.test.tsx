import { cleanup, render } from '@testing-library/react';

import Skeleton from '..';

describe('Skeleton variant="a2ui"', () => {
  afterEach(cleanup);

  test('text: lines with the last at 60%', () => {
    const { container } = render(<Skeleton lines={4} variant="a2ui" />);
    const root = container.firstElementChild as HTMLElement;
    expect(root.dataset.variant).toBe('a2ui');
    expect(root.dataset.type).toBe('text');
    const lines = [...root.querySelectorAll<HTMLElement>('.lobe-skeleton__line')];
    expect(lines).toHaveLength(4);
    expect(lines.at(-1)!.style.width).toBe('60%');
    expect(lines[0].style.width).toBe('100%');
  });

  test('card: avatar and three lines', () => {
    const { container } = render(<Skeleton type="card" variant="a2ui" />);
    const root = container.firstElementChild as HTMLElement;
    expect(root.dataset.type).toBe('card');
    expect(root.querySelectorAll('.lobe-skeleton__avatar')).toHaveLength(1);
    expect(root.querySelectorAll('.lobe-skeleton__line')).toHaveLength(3);
  });

  test('chart: seven bars sized in percent', () => {
    const { container } = render(<Skeleton type="chart" variant="a2ui" />);
    const bars = container.querySelectorAll<HTMLElement>('.lobe-skeleton__bar');
    expect(bars).toHaveLength(7);
    expect(bars[0].style.height).toBe('40%');
  });

  test('the default variant is unchanged', () => {
    const { container } = render(<Skeleton height={16} />);
    const root = container.firstElementChild as HTMLElement;
    expect(root.dataset.variant).toBeUndefined();
    expect(root.style.height).toBe('16px');
    expect(root.children).toHaveLength(0);
  });
});
