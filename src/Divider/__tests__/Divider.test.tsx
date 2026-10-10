import { cleanup, render, screen } from '@testing-library/react';

import Divider from '../Divider';

describe('Divider', () => {
  afterEach(cleanup);

  test('renders a horizontal separator by default', () => {
    render(<Divider />);

    const separator = screen.getByRole('separator');
    expect(separator.getAttribute('aria-orientation')).toBe('horizontal');
  });

  test('renders a vertical separator', () => {
    render(<Divider orientation="vertical" />);

    expect(screen.getByRole('separator').getAttribute('aria-orientation')).toBe('vertical');
  });

  test('dashed changes the class list', () => {
    const { container, rerender } = render(<Divider />);
    const plain = container.firstElementChild!.className;

    rerender(<Divider dashed />);

    expect(container.firstElementChild!.className).not.toBe(plain);
  });

  test('renders children as a centered label inside the separator', () => {
    render(<Divider>OR</Divider>);

    expect(screen.getByRole('separator').textContent).toBe('OR');
  });

  test('forwards className and style', () => {
    render(<Divider className="custom" style={{ marginBlock: 12 }} />);

    const separator = screen.getByRole('separator');
    expect(separator.className).toContain('custom');
    expect(separator.getAttribute('style')).toContain('margin-block: 12px');
  });

  test('sets the displayName', () => {
    expect(Divider.displayName).toBe('Divider');
  });
});
