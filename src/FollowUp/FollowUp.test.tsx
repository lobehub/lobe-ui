import { cleanup, fireEvent, render, screen } from '@testing-library/react';

import FollowUp from './FollowUp';

describe('FollowUp', () => {
  afterEach(cleanup);

  test('renders the title and pills and sends the message', () => {
    const onFollowUp = vi.fn();
    const { container } = render(
      <FollowUp
        items={['Export as CSV', { label: 'By region', message: 'Break it down by region' }]}
        title="Try next"
        onFollowUp={onFollowUp}
      />,
    );
    expect((container.firstElementChild as HTMLElement).dataset.variant).toBe('default');
    expect(screen.getByText('Try next')).toBeTruthy();
    fireEvent.click(screen.getByText('By region'));
    expect(onFollowUp).toHaveBeenCalledWith(
      'Break it down by region',
      expect.objectContaining({ label: 'By region' }),
      1,
    );
    fireEvent.click(screen.getByText('Export as CSV'));
    expect(onFollowUp).toHaveBeenLastCalledWith('Export as CSV', expect.anything(), 0);
  });

  test('a2ui variant switches the look and renders nothing without items', () => {
    const { container, rerender } = render(<FollowUp items={['A']} variant="a2ui" />);
    const root = container.firstElementChild as HTMLElement;
    expect(root.dataset.variant).toBe('a2ui');
    expect(container.querySelectorAll('button')).toHaveLength(1);
    rerender(<FollowUp items={[]} variant="a2ui" />);
    expect(container.firstElementChild).toBeNull();
  });
});
