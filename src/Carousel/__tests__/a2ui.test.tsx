import { act, cleanup, render, screen } from '@testing-library/react';

import Carousel from '../Carousel';
import type { CarouselRef } from '../type';

describe('Carousel variant="a2ui"', () => {
  afterEach(cleanup);

  test('renders a snapping scroller of slides with arrows and no dots', () => {
    const { container } = render(
      <Carousel aria-label="Highlights" variant="a2ui">
        <div>One</div>
        <div>Two</div>
        <div>Three</div>
      </Carousel>,
    );
    const root = container.firstElementChild as HTMLElement;
    expect(root.dataset.variant).toBe('a2ui');
    const region = screen.getByRole('region', { name: 'Highlights' });
    expect(region.className).toContain('lobe-carousel__scroller');
    expect(region.getAttribute('tabindex')).toBe('0');
    expect(screen.getAllByRole('group')).toHaveLength(3);
    expect(screen.getByRole('button', { name: 'Previous slide' })).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Next slide' })).toBeTruthy();
    expect(container.querySelector('.lobe-carousel__dots')).toBeNull();
  });

  test('ref.goTo scrolls to a slide; arrows can be turned off', () => {
    const ref: { current: CarouselRef | null } = { current: null };
    render(
      <Carousel arrows={false} ref={ref} variant="a2ui">
        <div>One</div>
        <div>Two</div>
      </Carousel>,
    );
    expect(screen.queryByRole('button')).toBeNull();
    expect(() => act(() => ref.current!.goTo(1))).not.toThrow();
  });
});
