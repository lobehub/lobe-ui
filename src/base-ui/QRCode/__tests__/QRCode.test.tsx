import { cleanup, fireEvent, render, screen } from '@testing-library/react';

import QRCode from '../QRCode';
import { buildQrPath } from '../qrPath';

describe('buildQrPath', () => {
  test('one square per dark module, skipping the centre hole', () => {
    const matrix = [
      [true, false, true],
      [false, true, false],
      [true, false, true],
    ];
    expect(buildQrPath(matrix, 0)).toBe(
      'M0 0h1v1h-1zM2 0h1v1h-1zM1 1h1v1h-1zM0 2h1v1h-1zM2 2h1v1h-1z',
    );
    expect(buildQrPath(matrix, 1)).toBe('M0 0h1v1h-1zM2 0h1v1h-1zM0 2h1v1h-1zM2 2h1v1h-1z');
  });
});

describe('QRCode', () => {
  afterEach(cleanup);

  test('renders an svg path labelled with the value', () => {
    const { container } = render(<QRCode value="https://lobehub.com" />);

    expect(screen.getByRole('img', { name: 'https://lobehub.com' })).toBeTruthy();
    expect(container.querySelector('svg path')?.getAttribute('d')?.length).toBeGreaterThan(100);
  });

  test('defaults to dark modules on white', () => {
    const { container } = render(<QRCode value="x" />);

    expect(container.querySelector('svg path')?.getAttribute('fill')).toBe('#000');
    expect(container.querySelector('svg rect')?.getAttribute('fill')).toBe('#fff');
  });

  test('expired shows Refresh only with onRefresh', () => {
    const onRefresh = vi.fn();
    const { rerender } = render(<QRCode status="expired" value="x" />);
    expect(screen.getByText('Expired')).toBeTruthy();
    expect(screen.queryByRole('button', { name: 'Refresh' })).toBeNull();

    rerender(<QRCode status="expired" value="x" onRefresh={onRefresh} />);
    fireEvent.click(screen.getByRole('button', { name: 'Refresh' }));
    expect(onRefresh).toHaveBeenCalledTimes(1);
  });

  test('icon clears a hole in the modules', () => {
    const { container, rerender } = render(<QRCode value="https://lobehub.com" />);
    const full = container.querySelector('svg path')!.getAttribute('d')!.length;

    rerender(<QRCode icon={<span>L</span>} value="https://lobehub.com" />);
    const holed = container.querySelector('svg path')!.getAttribute('d')!.length;

    expect(screen.getByText('L')).toBeTruthy();
    expect(holed).toBeLessThan(full * 1.5);
  });

  test('loading spinner stays dark on the white overlay', () => {
    render(<QRCode status="loading" value="x" />);

    const spinner = screen.getByRole('status', { name: 'Loading' })
      .firstElementChild as HTMLElement;
    expect(spinner.style.color).toBe('rgb(102, 102, 102)');
  });
});
