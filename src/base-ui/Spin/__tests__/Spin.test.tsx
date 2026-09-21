import { cleanup, render, screen } from '@testing-library/react';
import { motion } from 'motion/react';

import ConfigProvider from '@/ConfigProvider';

import Spin from '../Spin';

const renderSpin = (props: Parameters<typeof Spin>[0] = {}) =>
  render(
    <ConfigProvider motion={motion}>
      <Spin {...props} />
    </ConfigProvider>,
  );

describe('Spin', () => {
  afterEach(cleanup);

  test('renders a status role with the default glyph', () => {
    renderSpin();

    const status = screen.getByRole('status');
    expect(status.querySelector('svg')).toBeTruthy();
    expect(Spin.displayName).toBe('Spin');
  });

  test('renders sizes as pixel dimensions', () => {
    const { rerender } = renderSpin({ size: 'small' });
    expect(screen.getByRole('status').querySelector('svg')?.getAttribute('width')).toBe('14');

    rerender(
      <ConfigProvider motion={motion}>
        <Spin size={48} />
      </ConfigProvider>,
    );
    expect(screen.getByRole('status').querySelector('svg')?.getAttribute('width')).toBe('48');
  });

  test('renders a determinate ring when percent is set', () => {
    renderSpin({ percent: 30 });

    const circles = screen.getByRole('status').querySelectorAll('circle');
    expect(circles).toHaveLength(2);
    expect(circles[1].getAttribute('stroke-dashoffset')).not.toBe('0');
  });

  test('renders the network variant glyph', () => {
    renderSpin({ size: 'small', variant: 'network' });

    const status = screen.getByRole('status');
    expect(status.querySelectorAll('line')).toHaveLength(18);
    expect(status.querySelectorAll('i')).toHaveLength(12);
    expect((status.querySelector('[style*="scale"]') as HTMLElement).style.transform).toBe(
      'scale(0.14)',
    );
  });

  test('renders a custom indicator instead of the built-in glyph', () => {
    renderSpin({ indicator: <span data-testid="custom-indicator" /> });

    expect(screen.getByTestId('custom-indicator')).toBeTruthy();
  });

  test('renders only children when spinning is false', () => {
    renderSpin({ children: <div>content</div>, spinning: false });

    expect(screen.getByText('content')).toBeTruthy();
    expect(screen.queryByRole('status')).toBeNull();
  });

  test('overlays children with the spinner and tip when spinning', () => {
    renderSpin({ children: <div>content</div>, tip: 'Loading…' });

    expect(screen.getByText('content')).toBeTruthy();
    expect(screen.getByText('Loading…')).toBeTruthy();
    expect(screen.getByRole('status')).toBeTruthy();
  });

  test('returns null when spinning is false and there are no children', () => {
    const { container } = renderSpin({ spinning: false });

    expect(container.firstChild).toBeNull();
  });
});
