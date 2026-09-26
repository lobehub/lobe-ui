import { cleanup, render, screen } from '@testing-library/react';

import Progress from '../Progress';

describe('Progress', () => {
  afterEach(cleanup);

  test('renders the line variant with a label and percent value', () => {
    render(<Progress label="Uploading" percent={62} />);

    expect(screen.getByText('Uploading')).toBeTruthy();
    expect(screen.getByText('62%')).toBeTruthy();
  });

  test('clamps percent to the 0-100 range', () => {
    const { rerender } = render(<Progress percent={150} />);
    expect(screen.getByText('100%')).toBeTruthy();

    rerender(<Progress percent={-20} />);
    expect(screen.getByText('0%')).toBeTruthy();
  });

  test('hides the info row when showInfo is false and no label is set', () => {
    const { container } = render(<Progress percent={50} showInfo={false} />);

    expect(screen.queryByText('50%')).toBeNull();
    expect(container.querySelectorAll('div').length).toBeGreaterThan(0);
  });

  test('renders a custom format', () => {
    render(<Progress format={(p) => `${p} done`} percent={40} />);

    expect(screen.getByText('40 done')).toBeTruthy();
  });

  test('shows a check icon instead of the number on success', () => {
    const { container } = render(<Progress percent={100} status="success" />);

    expect(screen.queryByText('100%')).toBeNull();
    expect(container.querySelector('svg')).toBeTruthy();
  });

  test('shows a cross icon instead of the number on exception', () => {
    const { container } = render(<Progress percent={33} status="exception" />);

    expect(screen.queryByText('33%')).toBeNull();
    expect(container.querySelector('svg')).toBeTruthy();
  });

  test('renders the segments variant with the correct filled cell count', () => {
    const { container } = render(<Progress percent={50} segments={10} variant="segments" />);

    const cells = container.querySelectorAll('span[style]');
    const filled = container.querySelectorAll('span[style*="background"]');
    expect(cells.length + filled.length).toBeGreaterThan(0);
    expect(filled.length).toBe(5);
  });

  test('renders the inset variant with a bar width matching percent', () => {
    const { container } = render(<Progress percent={70} variant="inset" />);

    const bar = container.querySelector('div[style*="width: 70%"]');
    expect(bar).toBeTruthy();
  });

  test('renders the circle type with an svg ring and centered info', () => {
    render(<Progress percent={62} type="circle" />);

    expect(screen.getByText('62%')).toBeTruthy();
  });

  test('renders circle sizes as pixel diameters', () => {
    const { container } = render(<Progress percent={50} size="small" type="circle" />);

    const svg = container.querySelector('svg');
    expect(svg?.getAttribute('width')).toBe('20');
  });

  test('renders a numeric line size as the track height', () => {
    const { container } = render(<Progress percent={50} size={10} />);

    const track = container.querySelector('div[style*="height: 10px"]');
    expect(track).toBeTruthy();
  });

  test('applies strokeColor to the bar', () => {
    const { container } = render(<Progress percent={50} strokeColor="rgb(124, 77, 255)" />);

    const bar = container.querySelector('div[style*="rgb(124, 77, 255)"]');
    expect(bar).toBeTruthy();
  });

  test('sets the displayName', () => {
    expect(Progress.displayName).toBe('Progress');
  });

  test('exposes progressbar aria attributes on the line variant', () => {
    render(<Progress format={(p) => `${p} done`} percent={62} />);

    const root = screen.getByRole('progressbar');
    expect(root.getAttribute('aria-valuemin')).toBe('0');
    expect(root.getAttribute('aria-valuemax')).toBe('100');
    expect(root.getAttribute('aria-valuenow')).toBe('62');
    expect(root.getAttribute('aria-valuetext')).toBe('62 done');
  });

  test('gives the segments container flex: 1 so it fills the row', () => {
    const { container } = render(<Progress percent={50} variant="segments" />);

    const segmentsEl = container.querySelector('div > div');
    expect(segmentsEl && getComputedStyle(segmentsEl).flex).toBe('1 1 0%');
  });

  test('hides the centered info on small circles', () => {
    render(<Progress percent={62} size="small" type="circle" />);

    expect(screen.queryByText('62%')).toBeNull();
  });

  test('shows the centered info once the circle reaches 40px', () => {
    render(<Progress percent={62} size={40} type="circle" />);

    expect(screen.getByText('62%')).toBeTruthy();
  });

  test.each([
    [40, '12px'],
    [56, '14px'],
    [120, '24px'],
  ])('scales the centered info with a %ipx circle so it stays inside the ring', (size, font) => {
    render(
      <Progress format={(v) => `${v.toFixed(1)}%`} percent={62.5} size={size} type="circle" />,
    );

    expect(screen.getByText('62.5%').style.fontSize).toBe(font);
  });

  test('exposes progressbar aria attributes on the circle type', () => {
    render(<Progress percent={33} type="circle" />);

    const root = screen.getByRole('progressbar');
    expect(root.getAttribute('aria-valuenow')).toBe('33');
    expect(root.getAttribute('aria-valuemin')).toBe('0');
    expect(root.getAttribute('aria-valuemax')).toBe('100');
  });
});
