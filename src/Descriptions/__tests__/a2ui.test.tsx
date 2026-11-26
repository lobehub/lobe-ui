import { cleanup, render, screen } from '@testing-library/react';

import Descriptions from '../Descriptions';

describe('Descriptions variant="a2ui"', () => {
  afterEach(cleanup);

  test('renders a titled key-value card with hints and formatted numbers', () => {
    const { container } = render(
      <Descriptions
        title="Order #A-20481"
        variant="a2ui"
        items={[
          { children: 'Oct 14, 2026', hint: '9:42 AM PT', label: 'Placed' },
          { children: 1284, label: 'Items' },
        ]}
      />,
    );

    expect(screen.getByRole('heading', { name: 'Order #A-20481' })).toBeTruthy();
    expect(container.querySelectorAll('dt')).toHaveLength(2);
    expect(screen.getByText('9:42 AM PT')).toBeTruthy();
    expect(screen.getByText('1,284')).toBeTruthy();
    // a2ui has no colon after labels
    expect(screen.getByText('Placed').textContent).toBe('Placed');
  });
});
