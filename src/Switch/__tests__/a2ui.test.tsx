import { cleanup, fireEvent, render, screen } from '@testing-library/react';

import Switch from '../Switch';

describe('Switch variant="a2ui"', () => {
  afterEach(cleanup);

  test('renders a well row whose label toggles the switch', () => {
    const onChange = vi.fn();
    const { container } = render(
      <Switch
        description="Refunds under $50 skip the review queue."
        label="Auto-approve small refunds"
        variant="a2ui"
        onChange={onChange}
      />,
    );
    const field = container.firstElementChild as HTMLElement;
    expect(field.className).toContain('lobe-switch__field');
    expect(field.dataset.variant).toBe('a2ui');
    expect(screen.getByText('Refunds under $50 skip the review queue.')).toBeTruthy();
    const control = screen.getByRole('switch', { name: 'Auto-approve small refunds' });
    expect(control.getAttribute('aria-checked')).toBe('false');
    fireEvent.click(screen.getByText('Auto-approve small refunds'));
    expect(onChange).toHaveBeenCalledWith(true, expect.anything());
  });

  test('without a label it renders only the switch', () => {
    const { container } = render(<Switch defaultChecked variant="a2ui" />);
    const root = container.firstElementChild as HTMLElement;
    expect(root.getAttribute('role')).toBe('switch');
    expect(root.dataset.variant).toBe('a2ui');
    expect(root.getAttribute('aria-checked')).toBe('true');
  });
});
