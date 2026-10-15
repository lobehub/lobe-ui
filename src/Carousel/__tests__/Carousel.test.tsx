import { act, cleanup, fireEvent, render, screen } from '@testing-library/react';

import Carousel from '../Carousel';
import type { CarouselRef } from '../type';

const slides = ['One', 'Two', 'Three'].map((label) => <div key={label}>{label}</div>);

const activeSlide = () =>
  screen.getAllByRole('group', { hidden: true }).findIndex((slide) => !slide.hasAttribute('inert'));

describe('Carousel', () => {
  afterEach(() => {
    cleanup();
    vi.useRealTimers();
  });

  test('ref.goTo, next and prev move between slides and wrap when looping', () => {
    const ref: { current: CarouselRef | null } = { current: null };
    const onIndexChange = vi.fn();
    render(
      <Carousel ref={ref} onIndexChange={onIndexChange}>
        {slides}
      </Carousel>,
    );

    act(() => ref.current!.goTo(2));
    expect(activeSlide()).toBe(2);
    expect(onIndexChange).toHaveBeenLastCalledWith(2, 0);

    act(() => ref.current!.next());
    expect(activeSlide()).toBe(0);

    act(() => ref.current!.prev());
    expect(activeSlide()).toBe(2);
  });

  test('does not wrap when loop is off', () => {
    const ref: { current: CarouselRef | null } = { current: null };
    render(
      <Carousel defaultIndex={2} loop={false} ref={ref}>
        {slides}
      </Carousel>,
    );

    act(() => ref.current!.next());

    expect(activeSlide()).toBe(2);
  });

  test('dots switch slides and mark the current one', () => {
    render(<Carousel>{slides}</Carousel>);

    fireEvent.click(screen.getByRole('button', { name: 'Go to slide 2' }));

    expect(activeSlide()).toBe(1);
    expect(screen.getByRole('button', { name: 'Go to slide 2' }).getAttribute('aria-current')).toBe(
      'true',
    );
  });

  test('controlled index only changes through the parent', () => {
    const onIndexChange = vi.fn();
    const { rerender } = render(
      <Carousel index={0} onIndexChange={onIndexChange}>
        {slides}
      </Carousel>,
    );

    fireEvent.click(screen.getByRole('button', { name: 'Go to slide 3' }));
    expect(onIndexChange).toHaveBeenCalledWith(2, 0);
    expect(activeSlide()).toBe(0);

    rerender(
      <Carousel index={2} onIndexChange={onIndexChange}>
        {slides}
      </Carousel>,
    );
    expect(activeSlide()).toBe(2);
  });

  test('autoplay advances on the interval and pauses on hover', () => {
    vi.useFakeTimers();
    render(<Carousel autoplay={1000}>{slides}</Carousel>);

    act(() => vi.advanceTimersByTime(1000));
    expect(activeSlide()).toBe(1);

    fireEvent.pointerEnter(screen.getByRole('region'));
    act(() => vi.advanceTimersByTime(3000));
    expect(activeSlide()).toBe(1);

    fireEvent.pointerLeave(screen.getByRole('region'));
    act(() => vi.advanceTimersByTime(1000));
    expect(activeSlide()).toBe(2);
  });

  test('touch swipe moves to the next slide', () => {
    const { container } = render(<Carousel>{slides}</Carousel>);
    const viewport = container.querySelector('[aria-roledescription="carousel"] > div')!;

    fireEvent.pointerDown(viewport, { clientX: 200, pointerType: 'touch' });
    fireEvent.pointerUp(viewport, { clientX: 100, pointerType: 'touch' });

    expect(activeSlide()).toBe(1);
  });

  test('hides dots when disabled and with a single slide', () => {
    const { rerender } = render(<Carousel dots={false}>{slides}</Carousel>);
    expect(screen.queryByRole('button')).toBeNull();

    rerender(<Carousel>{slides[0]}</Carousel>);
    expect(screen.queryByRole('button')).toBeNull();
  });
});
