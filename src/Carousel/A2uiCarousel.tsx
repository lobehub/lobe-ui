'use client';

import clsx from 'clsx';
import {
  Children,
  isValidElement,
  memo,
  useEffect,
  useImperativeHandle,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';

import { useEventCallback } from '@/hooks/useEventCallback';
import { a2uiStyles } from '@/internal/a2ui/styles';
import { styleProps } from '@/styles/stylex/props';
import { toDataAttributes } from '@/utils/bem';

import { styles } from './a2uiStyle';
import { carouselClasses } from './stable';
import type { CarouselProps } from './type';

const EDGE = 4;

/**
 * `Carousel variant="a2ui"`. Adapted from CopilotKit Gen UI 2.0 standard catalog (MIT),
 * `standard/layout.tsx` Carousel: a horizontal snap scroller with previous and next arrows that
 * hide at either end. It can take keyboard focus, since it always scrolls.
 */
const A2uiCarousel = memo<CarouselProps>(
  ({
    arrows = true,
    children,
    className,
    defaultIndex,
    index,
    onIndexChange,
    ref,
    slideGap = 8,
    snap = 'proximity',
    style,
    // Default-variant props.
    adaptiveHeight: _adaptiveHeight,
    autoplay: _autoplay,
    dots: _dots,
    loop: _loop,
    pauseOnHover: _pauseOnHover,
    variant = 'a2ui',
    ...rest
  }) => {
    const slides = Children.toArray(children);
    const keys = slides.map((slide, slideIndex) =>
      isValidElement(slide) && slide.key !== null ? slide.key : slideIndex,
    );
    const scrollerRef = useRef<HTMLDivElement>(null);
    const [canPrev, setCanPrev] = useState(false);
    const [canNext, setCanNext] = useState(false);
    const lastIndex = useRef(index ?? defaultIndex ?? 0);
    const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

    const slideNodes = () => Array.from(scrollerRef.current?.children ?? []) as HTMLElement[];

    const update = useEventCallback(() => {
      const element = scrollerRef.current;
      if (!element) return;
      setCanPrev(element.scrollLeft > EDGE);
      setCanNext(element.scrollLeft + element.clientWidth < element.scrollWidth - EDGE);
    });

    /** The slide nearest the start edge. */
    const nearest = useEventCallback(() => {
      const element = scrollerRef.current;
      if (!element) return 0;
      let best = 0;
      let bestDistance = Infinity;
      slideNodes().forEach((slide, slideIndex) => {
        const distance = Math.abs(slide.offsetLeft - element.offsetLeft - element.scrollLeft);
        if (distance < bestDistance) {
          bestDistance = distance;
          best = slideIndex;
        }
      });
      return best;
    });

    const goTo = useEventCallback((target: number, smooth = true) => {
      const element = scrollerRef.current;
      const slide = slideNodes()[Math.max(0, Math.min(target, slides.length - 1))];
      if (!element || !slide) return;
      const left = slide.offsetLeft - element.offsetLeft;
      if (typeof element.scrollTo === 'function')
        element.scrollTo({ behavior: smooth ? 'smooth' : 'auto', left });
      else element.scrollLeft = left;
    });
    const next = useEventCallback(() => goTo(nearest() + 1));
    const prev = useEventCallback(() => goTo(nearest() - 1));

    useImperativeHandle(ref, () => ({ goTo, next, prev }), [goTo, next, prev]);

    useLayoutEffect(() => {
      update();
      if (defaultIndex) goTo(defaultIndex, false);
      // Only on mount.
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
      if (typeof index === 'number' && index !== nearest()) goTo(index);
    }, [goTo, index, nearest]);

    useEffect(() => {
      const element = scrollerRef.current;
      if (!element || typeof ResizeObserver === 'undefined') return;
      const observer = new ResizeObserver(() => update());
      observer.observe(element);
      return () => observer.disconnect();
    }, [update]);

    useEffect(
      () => () => {
        if (timer.current) clearTimeout(timer.current);
      },
      [],
    );

    const onScroll = () => {
      update();
      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(() => {
        const current = nearest();
        if (current === lastIndex.current) return;
        lastIndex.current = current;
        onIndexChange?.(current);
      }, 120);
    };

    const arrow = (direction: -1 | 1, enabled: boolean) => (
      <button
        aria-label={direction < 0 ? 'Previous slide' : 'Next slide'}
        disabled={!enabled}
        type="button"
        {...styleProps(
          [
            styles.arrow,
            direction < 0 ? styles.arrowPrev : styles.arrowNext,
            !enabled && styles.arrowHidden,
          ],
          carouselClasses(direction < 0 ? 'prev' : 'next'),
        )}
        onClick={(event) => {
          event.stopPropagation();
          if (direction < 0) prev();
          else next();
        }}
      >
        {direction < 0 ? '‹' : '›'}
      </button>
    );

    return (
      <div
        {...toDataAttributes({ variant })}
        {...styleProps([a2uiStyles.base, styles.root], clsx(carouselClasses(), className), style)}
      >
        <div
          aria-roledescription="carousel"
          ref={scrollerRef}
          role="region"
          tabIndex={0}
          {...rest}
          {...styleProps(styles.scroller, carouselClasses('scroller'), {
            gap: slideGap,
            scrollSnapType: snap === 'none' ? undefined : `x ${snap}`,
          })}
          onScroll={(event) => {
            rest.onScroll?.(event);
            onScroll();
          }}
        >
          {slides.map((slide, slideIndex) => (
            <div
              aria-roledescription="slide"
              key={keys[slideIndex]}
              role="group"
              {...styleProps(styles.slide, carouselClasses('slide'))}
            >
              {slide}
            </div>
          ))}
        </div>
        {arrows && arrow(-1, canPrev)}
        {arrows && arrow(1, canNext)}
      </div>
    );
  },
);

A2uiCarousel.displayName = 'A2uiCarousel';

export default A2uiCarousel;
