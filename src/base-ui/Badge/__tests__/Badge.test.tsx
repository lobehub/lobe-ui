import { cleanup, render, screen } from '@testing-library/react';

import Badge from '../Badge';

describe('Badge', () => {
  afterEach(cleanup);

  test('renders status and text mode', () => {
    render(<Badge status="success" text="Online" />);

    expect(screen.getByText('Online')).toBeTruthy();
  });

  test.each(['success', 'processing', 'default', 'error', 'warning'] as const)(
    'renders the %s status dot',
    (status) => {
      const { container } = render(<Badge status={status} text={status} />);

      expect(container.querySelector('span')).toBeTruthy();
      expect(screen.getByText(status)).toBeTruthy();
    },
  );

  test('applies a custom color to the status dot', () => {
    const { container } = render(<Badge color="#7c4dff" text="Custom" />);

    const dot = container.querySelector('span > span');
    expect(dot?.getAttribute('style')).toContain('rgb(124, 77, 255)');
  });

  test('renders a numeric count pill on children', () => {
    render(
      <Badge count={5}>
        <span>content</span>
      </Badge>,
    );

    expect(screen.getByText('5')).toBeTruthy();
    expect(screen.getByText('content')).toBeTruthy();
  });

  test('caps the count at overflowCount with a plus suffix', () => {
    render(
      <Badge count={128} overflowCount={99}>
        <span>content</span>
      </Badge>,
    );

    expect(screen.getByText('99+')).toBeTruthy();
  });

  test('hides a zero count by default', () => {
    render(
      <Badge count={0}>
        <span>content</span>
      </Badge>,
    );

    expect(screen.queryByText('0')).toBeNull();
  });

  test('shows a zero count when showZero is set', () => {
    render(
      <Badge showZero count={0}>
        <span>content</span>
      </Badge>,
    );

    expect(screen.getByText('0')).toBeTruthy();
  });

  test('renders a dot instead of the count', () => {
    const { container } = render(
      <Badge dot count={5}>
        <span>content</span>
      </Badge>,
    );

    expect(screen.queryByText('5')).toBeNull();
    expect(container.querySelectorAll('span').length).toBeGreaterThan(1);
  });

  test('applies offset as a transform on the pill', () => {
    const { container } = render(
      <Badge count={5} offset={[4, -4]}>
        <span>content</span>
      </Badge>,
    );

    const pill = container.querySelector('span[style*="translate"]');
    expect(pill?.getAttribute('style')).toContain('translate(4px, -4px)');
  });

  test('keeps the pill transform bound to offset when a caller style sets transform on the wrapper', () => {
    const { container } = render(
      <Badge count={5} offset={[4, -4]} style={{ transform: 'scale(1.2)' }}>
        <span>content</span>
      </Badge>,
    );

    const wrapper = container.firstElementChild;
    expect(wrapper?.getAttribute('style')).toContain('scale(1.2)');

    const pill = container.querySelector('span[style*="translate"]');
    expect(pill?.getAttribute('style')).toContain('translate(4px, -4px)');
    expect(pill?.getAttribute('style')).not.toContain('scale(1.2)');
  });

  test('renders a smaller pill for size="small"', () => {
    render(
      <Badge count={4} size="small">
        <span>content</span>
      </Badge>,
    );

    expect(screen.getByText('4')).toBeTruthy();
  });

  test('renders an inline static pill with no children', () => {
    const { container } = render(<Badge count={12} />);

    expect(screen.getByText('12')).toBeTruthy();
    expect(container.children.length).toBe(1);
    expect(container.firstElementChild?.tagName).toBe('SPAN');
  });

  test('renders nothing with no children and a hidden count', () => {
    const { container } = render(<Badge count={0} />);

    expect(container.firstChild).toBeNull();
  });

  test('sets the displayName', () => {
    expect(Badge.displayName).toBe('Badge');
  });
});
