import { cleanup, render, screen } from '@testing-library/react';

import Progress from '../Progress';

describe('Progress variant="a2ui"', () => {
  afterEach(cleanup);

  test('line renders label, rounded percent, bar width and caption', () => {
    const { container } = render(
      <Progress caption="72 GB of 100 GB" label="Storage used" percent={72.4} variant="a2ui" />,
    );

    expect(screen.getByRole('progressbar').dataset.variant).toBe('a2ui');
    expect(screen.getByText('Storage used')).toBeTruthy();
    expect(screen.getByText('72%')).toBeTruthy();
    expect(screen.getByText('72 GB of 100 GB')).toBeTruthy();
    expect(container.querySelector<HTMLElement>('.lobe-progress__bar')?.style.width).toBe('72.4%');
  });

  test('circle renders a ring card with label and the default caption', () => {
    const { container } = render(
      <Progress label="Sprint 42" percent={68} status="success" type="circle" variant="a2ui" />,
    );

    expect(container.querySelectorAll('circle')).toHaveLength(2);
    expect(screen.getByText('68%')).toBeTruthy();
    expect(screen.getByText('Sprint 42')).toBeTruthy();
    expect(screen.getByText('68 of 100')).toBeTruthy();
  });
});
