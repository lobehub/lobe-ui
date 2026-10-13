import { fireEvent, render, screen } from '@testing-library/react';

import FilterStrip from './FilterStrip';

describe('FilterStrip', () => {
  test('formats counts, shows the empty text, and selects', () => {
    const onChange = vi.fn();
    render(
      <FilterStrip
        emptyText="n/a"
        label="Status"
        value="all"
        items={[
          { count: 12_345, key: 'all', label: 'All' },
          { key: 'none', label: 'None' },
        ]}
        onChange={onChange}
      />,
    );

    expect(screen.getByText('12,345')).toBeTruthy();
    expect(screen.getByText('n/a')).toBeTruthy();
    fireEvent.click(screen.getByRole('radio', { name: /None/ }));
    expect(onChange).toHaveBeenCalledWith('none');
  });
});
