import { cleanup, fireEvent, render, screen } from '@testing-library/react';

import Segmented from '../Segmented';

describe('Segmented variant="a2ui"', () => {
  afterEach(cleanup);

  test('renders a labelled group and switches the pressed segment', () => {
    const onChange = vi.fn();
    render(
      <Segmented
        defaultValue="Week"
        label="Range"
        options={['Day', 'Week', 'Month']}
        variant="a2ui"
        onChange={onChange}
      />,
    );
    const group = screen.getByRole('group', { name: 'Range' });
    expect(group.dataset.variant).toBe('a2ui');
    expect(screen.getByRole('button', { name: 'Week' }).hasAttribute('data-pressed')).toBe(true);
    fireEvent.click(screen.getByRole('button', { name: 'Month' }));
    expect(onChange).toHaveBeenCalledWith('Month');
    expect(screen.getByRole('button', { name: 'Month' }).hasAttribute('data-pressed')).toBe(true);
  });
});
