import { render, screen } from '@testing-library/react';

import Switch from '../Switch';

describe('Switch aria/data forwarding', () => {
  test('forwards aria-label and data-* to the switch element', () => {
    render(<Switch aria-describedby="hint" aria-label="Enable SSO" data-testid="sso-switch" />);

    const switchEl = screen.getByRole('switch', { name: 'Enable SSO' });

    expect(switchEl.getAttribute('aria-label')).toBe('Enable SSO');
    expect(switchEl.getAttribute('aria-describedby')).toBe('hint');
    expect(screen.getByTestId('sso-switch')).toBe(switchEl);
  });
});
