import { cleanup, render, screen } from '@testing-library/react';

import Rate from '../Rate';

describe('Rate variant="a2ui"', () => {
  afterEach(cleanup);

  test('renders label, stars, one-decimal value and review count', () => {
    const { container } = render(
      <Rate label="Customer rating" reviewCount={1284} value={4.6} variant="a2ui" />,
    );

    expect(screen.getByText('Customer rating')).toBeTruthy();
    expect(screen.getByRole('img', { name: '4.6 out of 5' })).toBeTruthy();
    expect(screen.getByText('4.6')).toBeTruthy();
    expect(screen.getByText('1,284 reviews')).toBeTruthy();
    const widths = [...container.querySelectorAll<HTMLElement>('.lobe-rate__fill')].map(
      (el) => el.style.width,
    );
    expect(widths.slice(0, 4)).toEqual(['100%', '100%', '100%', '100%']);
    expect(Number.parseFloat(widths[4])).toBeCloseTo(60);
  });
});
