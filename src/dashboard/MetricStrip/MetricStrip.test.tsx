import { render, screen } from '@testing-library/react';

import StatCard from '../StatCard/StatCard';
import MetricStrip from './MetricStrip';

const items = [
  { delta: '+1%', direction: 'up' as const, label: 'Users', value: '10' },
  { label: 'Errors', value: '2' },
];

describe('MetricStrip', () => {
  test('joined renders one card, split renders one card per item', () => {
    const joined = render(<MetricStrip items={items} />);
    expect(joined.container.childElementCount).toBe(1);
    expect(joined.container.querySelectorAll('[class]').length).toBeGreaterThan(2);
    joined.unmount();

    const split = render(<MetricStrip items={items} variant="split" />);
    expect(split.container.firstElementChild!.childElementCount).toBe(2);
    expect(screen.getByText('Users')).toBeTruthy();
  });

  test('StatCard renders the same item markup as a split strip item', () => {
    const strip = render(<MetricStrip items={[items[0]]} variant="split" />);
    const stripItem = strip.container.firstElementChild!.firstElementChild!.innerHTML;
    strip.unmount();

    const card = render(<StatCard delta="+1%" direction="up" label="Users" value="10" />);
    const cardItem = card.container.firstElementChild!.innerHTML;
    expect(cardItem).toContain('lobe-dashboard-stat-card__cell');
    expect(cardItem.replaceAll('lobe-dashboard-stat-card__', 'lobe-dashboard-metric-strip__')).toBe(
      stripItem,
    );
  });

  test('size="small" marks the strip and columns fix the count', () => {
    const { container } = render(<MetricStrip columns={4.6} items={items} size="small" />);
    const strip = container.firstElementChild as HTMLElement;
    expect(strip.dataset.size).toBe('small');
    const grid = container.querySelector<HTMLElement>('.lobe-dashboard-metric-strip__grid')!;
    expect(grid.style.getPropertyValue('--metric-columns')).toBe('4');
  });

  test('a default strip keeps fitting columns and carries no size attribute', () => {
    const { container } = render(<MetricStrip items={items} />);
    expect((container.firstElementChild as HTMLElement).dataset.size).toBeUndefined();
    const grid = container.querySelector<HTMLElement>('.lobe-dashboard-metric-strip__grid')!;
    expect(grid.style.getPropertyValue('--metric-columns')).toBe('');
  });
});

