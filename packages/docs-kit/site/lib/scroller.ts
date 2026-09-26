import type { SpringOptions } from 'motion/react';
import { spring } from 'motion/react';

const springOptions: SpringOptions = {
  stiffness: 1000,
  damping: 250,
};

type AnimationHandle = {
  stop: () => void;
};

let currentAnimation: AnimationHandle | null = null;

/** Leaves room for the sticky "On this page" bar on narrow layouts. */
export const HEADING_SCROLL_OFFSET = -48;

/** The docs chrome scrolls inside the shell workspace, not the window. */
export const getScrollContainer = (): HTMLElement | null =>
  typeof document === 'undefined'
    ? null
    : document.querySelector<HTMLElement>('[data-console-shell] main');

const readScrollTop = (container: HTMLElement | null) =>
  container
    ? container.scrollTop
    : window.scrollY || document.documentElement.scrollTop || document.body.scrollTop || 0;

const writeScrollTop = (container: HTMLElement | null, top: number) => {
  if (container) container.scrollTop = top;
  else window.scrollTo(0, top);
};

export const springScrollTo = (y: number): AnimationHandle => {
  const container = getScrollContainer();
  const from = readScrollTop(container);

  currentAnimation?.stop();

  const generator = spring({
    ...springOptions,
    keyframes: [from, y],
  });

  let rafId = 0;
  let stopped = false;

  const finish = () => {
    if (stopped) return;
    stopped = true;
    cancelAnimationFrame(rafId);
    window.removeEventListener('wheel', finish);
    window.removeEventListener('touchmove', finish);
    if (currentAnimation === handle) {
      currentAnimation = null;
    }
  };

  // Clock starts on the first painted frame so the first on-screen sample is
  // exactly `from` (elapsed = 0). animateValue/play() used to stamp startTime
  // at click time, so the first rAF already had ~16ms of spring progress and
  // jumped dozens of pixels — the "hitch then lurch" at scroll start.
  let start: number | null = null;

  const tick = (now: number) => {
    if (stopped) return;

    if (start === null) {
      start = now;
    }

    const state = generator.next(now - start);
    const latest = Math.max(0, state.value);
    writeScrollTop(container, latest);

    if (state.done || (y <= 0 && latest <= 0)) {
      finish();
      return;
    }

    rafId = requestAnimationFrame(tick);
  };

  window.addEventListener('wheel', finish, { passive: true });
  window.addEventListener('touchmove', finish, { passive: true });
  rafId = requestAnimationFrame(tick);

  const handle: AnimationHandle = {
    stop: finish,
  };

  currentAnimation = handle;
  return handle;
};

export const springScrollToTop = () => springScrollTo(0);

export const springScrollToElement = (element: HTMLElement, delta = 40) => {
  const y = calculateElementTop(element, getScrollContainer());

  const to = y + delta;
  return springScrollTo(to);
};

const calculateElementTop = (element: HTMLElement, container: HTMLElement | null) => {
  if (container) {
    return (
      element.getBoundingClientRect().top -
      container.getBoundingClientRect().top +
      container.scrollTop
    );
  }

  let top = 0;
  let current: HTMLElement | null = element;
  while (current) {
    top += current.offsetTop;
    current = current.offsetParent as HTMLElement | null;
  }
  return top;
};
