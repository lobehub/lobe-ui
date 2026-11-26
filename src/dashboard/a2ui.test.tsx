import { render, screen } from '@testing-library/react';
import { TrendingUp } from 'lucide-react';

import MetricStrip from './MetricStrip/MetricStrip';
import Section from './Section/Section';
import StatCard from './StatCard/StatCard';
import Surface from './Surface/Surface';

describe('dashboard a2ui variants', () => {
  test('StatCard a2ui renders label, figure, inferred delta direction, caption and icon tile', () => {
    const { container } = render(
      <StatCard
        delta="-2.1%"
        hint="vs. last month"
        label="Revenue"
        mark={TrendingUp}
        value="$48.2k"
        variant="a2ui"
      />,
    );
    const root = container.firstElementChild as HTMLElement;
    expect(root.dataset.variant).toBe('a2ui');
    expect(screen.getByText('$48.2k').className).toContain('lobe-dashboard-stat-card__value');
    expect(container.querySelector('[data-direction="down"]')?.textContent).toBe('-2.1%');
    expect(screen.getByText('vs. last month')).toBeTruthy();
    expect(container.querySelector('.lobe-dashboard-stat-card__mark svg')).toBeTruthy();
  });

  test('StatCard default variant keeps the MetricStrip cell markup', () => {
    const { container } = render(<StatCard label="Users" value="10" />);
    expect(container.innerHTML).toContain('lobe-dashboard-stat-card__cell');
    expect((container.firstElementChild as HTMLElement).dataset.variant).toBeUndefined();
  });

  test('MetricStrip a2ui renders one card with a cell per item and formats numbers', () => {
    const { container } = render(
      <MetricStrip
        variant="a2ui"
        items={[
          { delta: '+8.1%', label: 'Visitors', value: '84,210' },
          { delta: '0.0%', direction: 'flat', label: 'Signups', value: 2318 },
        ]}
      />,
    );
    expect(container.childElementCount).toBe(1);
    expect(container.querySelectorAll('.lobe-dashboard-metric-strip__cell')).toHaveLength(2);
    expect(screen.getByText('2,318')).toBeTruthy();
    expect(container.querySelector('[data-direction="up"]')?.textContent).toBe('+8.1%');
    expect(container.querySelector('[data-direction="flat"]')?.textContent).toBe('0.0%');
  });

  test('Surface a2ui renders a titled card with a padded body', () => {
    const { container } = render(
      <Surface title="This week" variant="a2ui">
        body
      </Surface>,
    );
    const root = container.firstElementChild as HTMLElement;
    expect(root.dataset.variant).toBe('a2ui');
    expect(screen.getByText('This week')).toBeTruthy();
    expect(container.querySelector('.lobe-dashboard-surface__body')?.textContent).toBe('body');
  });

  test('Section a2ui puts the eyebrow after the title and renders the description', () => {
    const { container } = render(
      <Section desc="Activity" eyebrow="Overview" title="This week" variant="a2ui">
        child
      </Section>,
    );
    expect(container.firstElementChild!.tagName).toBe('SECTION');
    const title = screen.getByText('This week');
    expect(title.tagName).toBe('H3');
    expect(title.nextElementSibling?.textContent).toBe('Overview');
    expect(screen.getByText('Activity').tagName).toBe('P');
    expect(screen.getByText('child')).toBeTruthy();
  });
});
