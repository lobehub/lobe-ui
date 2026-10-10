'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';
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
import useControlledState from 'use-merge-value';

import ActionIcon from '@/ActionIcon';
import { useEventCallback } from '@/hooks/useEventCallback';
import { cx } from '@/styles';

import { styles } from './style';
import type { CarouselProps } from './type';

const DEFAULT_INTERVAL = 5000;
const SWIPE_THRESHOLD = 40;
const ARROW_SIZE = { blockSize: 28, borderRadius: '50%', size: 16 };

const Carousel = memo<CarouselProps>(
  ({
    adaptiveHeight = false,
    arrows = false,
    autoplay = false,
    children,
    className,
    defaultIndex = 0,
    dots = true,
    index,
    loop = true,
    onIndexChange,
    onPointerEnter,
    onPointerLeave,
    pauseOnHover = true,
    ref,
    ...rest
  }) => {
    const slides = Children.toArray(children);
    const count = slides.length;
    const keys = slides.map((slide, slideIndex) =>
      isValidElement(slide) && slide.key !== null ? slide.key : slideIndex,
    );
    const [mergedIndex, setMergedIndex] = useControlledState(defaultIndex, {
      onChange: onIndexChange,
      value: index,
    });
    const current = Math.min(Math.max(mergedIndex, 0), Math.max(count - 1, 0));

    const [hovered, setHovered] = useState(false);
    const [height, setHeight] = useState<number>();
    const slidesRef = useRef<(HTMLDivElement | null)[]>([]);
    const swipeStartXRef = useRef<number | null>(null);

    const goTo = useEventCallback((target: number) => {
      if (count === 0) return;
      const next = loop
        ? ((target % count) + count) % count
        : Math.min(Math.max(target, 0), count - 1);
      if (next !== current) setMergedIndex(next);
    });
    const next = useEventCallback(() => goTo(current + 1));
    const prev = useEventCallback(() => goTo(current - 1));

    useImperativeHandle(ref, () => ({ goTo, next, prev }), [goTo, next, prev]);

    const interval = autoplay === true ? DEFAULT_INTERVAL : autoplay || 0;
    const paused = pauseOnHover && hovered;
    const atEnd = !loop && current >= count - 1;

    useEffect(() => {
      if (!interval || paused || count < 2 || atEnd) return;
      const timer = setTimeout(next, interval);
      return () => clearTimeout(timer);
    }, [interval, paused, count, atEnd, current, next]);

    useLayoutEffect(() => {
      const slide = slidesRef.current[current];
      if (!adaptiveHeight || !slide) return;
      setHeight(slide.offsetHeight);
      if (typeof ResizeObserver === 'undefined') return;
      const observer = new ResizeObserver(() => setHeight(slide.offsetHeight));
      observer.observe(slide);
      return () => observer.disconnect();
    }, [adaptiveHeight, current, count]);

    return (
      <div
        aria-roledescription="carousel"
        className={cx(styles.root, className)}
        role="region"
        onPointerEnter={(event) => {
          onPointerEnter?.(event);
          setHovered(true);
        }}
        onPointerLeave={(event) => {
          onPointerLeave?.(event);
          setHovered(false);
        }}
        {...rest}
      >
        <div
          className={styles.viewport}
          style={adaptiveHeight && height !== undefined ? { height } : undefined}
          onPointerCancel={() => {
            swipeStartXRef.current = null;
          }}
          onPointerDown={(event) => {
            if (event.pointerType !== 'mouse') swipeStartXRef.current = event.clientX;
          }}
          onPointerUp={(event) => {
            if (swipeStartXRef.current === null) return;
            const delta = event.clientX - swipeStartXRef.current;
            swipeStartXRef.current = null;
            if (Math.abs(delta) < SWIPE_THRESHOLD) return;
            if (delta < 0) next();
            else prev();
          }}
        >
          <div
            aria-live={interval && !paused ? 'off' : 'polite'}
            className={cx(styles.track, adaptiveHeight && styles.trackAdaptive)}
            style={{ transform: `translateX(-${current * 100}%)` }}
          >
            {slides.map((slide, slideIndex) => {
              const active = slideIndex === current;
              return (
                <div
                  aria-hidden={!active || undefined}
                  aria-label={`${slideIndex + 1} of ${count}`}
                  aria-roledescription="slide"
                  className={styles.slide}
                  inert={!active}
                  key={keys[slideIndex]}
                  role="group"
                  ref={(node) => {
                    slidesRef.current[slideIndex] = node;
                  }}
                >
                  {slide}
                </div>
              );
            })}
          </div>
          {arrows && count > 1 && (
            <>
              <ActionIcon
                aria-label="Previous slide"
                className={styles.arrow}
                disabled={!loop && current === 0}
                icon={ChevronLeft}
                size={ARROW_SIZE}
                style={{ insetInlineStart: 8 }}
                onClick={prev}
              />
              <ActionIcon
                aria-label="Next slide"
                className={styles.arrow}
                disabled={atEnd}
                icon={ChevronRight}
                size={ARROW_SIZE}
                style={{ insetInlineEnd: 8 }}
                onClick={next}
              />
            </>
          )}
        </div>
        {dots && count > 1 && (
          <div className={styles.dots}>
            {slides.map((_, dotIndex) => (
              <button
                aria-current={dotIndex === current || undefined}
                aria-label={`Go to slide ${dotIndex + 1}`}
                className={styles.dot}
                key={keys[dotIndex]}
                type="button"
                onClick={() => goTo(dotIndex)}
              />
            ))}
          </div>
        )}
      </div>
    );
  },
);

Carousel.displayName = 'Carousel';

export default Carousel;
