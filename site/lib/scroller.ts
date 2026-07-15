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

const readScrollTop = () =>
  window.scrollY || document.documentElement.scrollTop || document.body.scrollTop || 0;

export const springScrollTo = (y: number): AnimationHandle => {
  const from = readScrollTop();

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
    window.scrollTo(0, latest);

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
  const y = calculateElementTop(element);

  const to = y + delta;
  return springScrollTo(to);
};

const calculateElementTop = (el: HTMLElement) => {
  let top = 0;
  while (el) {
    top += el.offsetTop;
    el = el.offsetParent as HTMLElement;
  }
  return top;
};
