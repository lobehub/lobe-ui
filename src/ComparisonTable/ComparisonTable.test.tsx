import { cleanup, render, screen } from '@testing-library/react';

import ComparisonTable from './ComparisonTable';
import { comparisonTableClasses } from './stable';

if (!globalThis.ResizeObserver) {
  globalThis.ResizeObserver = class {
    disconnect() {}
    observe() {}
    unobserve() {}
  } as any;
}

const rows = [
  { feature: 'Price per seat', values: ['$0', '$24/mo', 'Custom'] },
  { feature: 'Projects', values: [3, 'Unlimited', 1200] },
  { feature: 'SSO and SAML', values: [false, true, true] },
  { feature: 'Uptime SLA', values: ['', '99.9%', null] },
];

describe('ComparisonTable', () => {
  afterEach(cleanup);

  it('renders options as columns and features as rows', () => {
    const { container } = render(
      <ComparisonTable
        highlight={1}
        options={['Starter', 'Pro', 'Enterprise']}
        rows={rows}
        title="Pick a plan"
      />,
    );
    expect(container.querySelector(`.${comparisonTableClasses.block}`)).toBeTruthy();
    expect(screen.getByRole('heading', { name: 'Pick a plan' })).toBeTruthy();
    expect(screen.getAllByRole('columnheader').map((th) => th.textContent)).toEqual([
      'Feature',
      'Starter',
      'RecommendedPro',
      'Enterprise',
    ]);
    expect(screen.getAllByRole('row')).toHaveLength(5);
    expect(screen.getByText('1,200')).toBeTruthy();
  });

  it('draws booleans as check / cross and blanks as a dash', () => {
    render(<ComparisonTable options={['A', 'B', 'C']} rows={rows} />);
    expect(screen.getAllByLabelText('Yes')).toHaveLength(2);
    expect(screen.getAllByLabelText('No')).toHaveLength(1);
    expect(screen.getAllByText('-')).toHaveLength(2);
    expect(screen.queryByText('Recommended')).toBeNull();
    expect(screen.queryByRole('heading')).toBeNull();
  });

  it('takes custom labels', () => {
    render(
      <ComparisonTable
        featureLabel="Plan"
        highlight={0}
        options={['A']}
        recommendedLabel="Best value"
        rows={[{ feature: 'x', values: [true] }]}
      />,
    );
    expect(screen.getByText('Plan')).toBeTruthy();
    expect(screen.getByText('Best value')).toBeTruthy();
  });

  it('defaults to the lobe-ui variant and switches to a2ui', () => {
    const { container, rerender } = render(
      <ComparisonTable highlight={0} options={['Starter', 'Pro']} rows={rows} title="Plans" />,
    );
    const root = container.querySelector(`.${comparisonTableClasses()}`) as HTMLElement;
    expect(root.dataset.variant).toBe('default');
    const defaultClass = root.className;

    rerender(
      <ComparisonTable
        highlight={0}
        options={['Starter', 'Pro']}
        rows={rows}
        title="Plans"
        variant="a2ui"
      />,
    );
    expect(root.dataset.variant).toBe('a2ui');
    expect(root.className).not.toBe(defaultClass);
  });
});
