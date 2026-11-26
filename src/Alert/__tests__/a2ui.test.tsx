import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import Alert from '../Alert';

describe('Alert a2ui variants', () => {
  it('renders the a2ui alert with its title, message and type', () => {
    render(
      <Alert
        description="You will hit the request limit in about 3 days."
        title="Usage at 92% of plan"
        type="warning"
        variant="a2ui"
      />,
    );

    const alert = screen.getByRole('alert');
    expect(alert.dataset.alertVariant).toBe('a2ui');
    expect(alert.dataset.alertType).toBe('warning');
    expect(screen.getByText('Usage at 92% of plan').tagName).toBe('P');
    expect(screen.getByText('You will hit the request limit in about 3 days.')).toBeTruthy();
    expect(alert.querySelector('svg')).toBeTruthy();
  });

  it('draws an action config as its own button in the callout', () => {
    const onClick = vi.fn();
    render(
      <Alert
        action={{ label: 'Learn more', onClick }}
        description="Fixed-schema surfaces paint as soon as the data lands."
        title="Tip"
        variant="a2ui-callout"
      />,
    );

    expect(screen.getByRole('alert').dataset.alertVariant).toBe('a2ui-callout');
    fireEvent.click(screen.getByRole('button', { name: 'Learn more' }));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('still renders a node action as is', () => {
    render(<Alert action={<a href="#docs">Docs</a>} title="Tip" variant="a2ui-callout" />);

    expect(screen.getByRole('link', { name: 'Docs' })).toBeTruthy();
  });
});
