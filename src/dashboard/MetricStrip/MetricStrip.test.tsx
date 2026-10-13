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
    expect(card.container.firstElementChild!.innerHTML).toBe(stripItem);
  });
});
