import { useCallback, useEffect, useRef, useState } from 'react';

export interface BlockInfo {
  content: string;
  startOffset: number;
}

export type BlockState = 'revealed' | 'animating' | 'streaming' | 'queued';

const BASE_DELAY = 18;
const ACCELERATION_FACTOR = 0.3;
const MAX_BLOCK_DURATION = 3000;
const FADE_DURATION = 280;
const MAX_DELAY = 36;
const MIN_DELAY = 6;

function countChars(text: string): number {
  return [...text].length;
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function computeCharDelay(
  queueLength: number,
  charCount: number,
  preferredDelay = BASE_DELAY,
): number {
  const acceleration = 1 + queueLength * ACCELERATION_FACTOR;
  let delay = preferredDelay / acceleration;
  delay = Math.min(delay, MAX_BLOCK_DURATION / Math.max(charCount, 1));
  return clamp(delay, MIN_DELAY, MAX_DELAY);
}

export interface UseStreamQueueReturn {
  charDelay: number;
  getBlockState: (index: number) => BlockState;
  queueLength: number;
}

interface UseStreamQueueOptions {
  preferredCharDelay?: number;
}

export function useStreamQueue(
  blocks: BlockInfo[],
  { preferredCharDelay = BASE_DELAY }: UseStreamQueueOptions = {},
): UseStreamQueueReturn {
  const [revealedCount, setRevealedCount] = useState(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const prevBlocksLenRef = useRef(0);
  const minRevealedRef = useRef(0);

  // Synchronous auto-reveal during render.
  // When blocks grow, the previous tail (streaming block) is instantly
  // promoted to revealed — its chars are already visible via stream-mode
  // animation. This runs during render (not in effect) so there is NO
  // intermediate frame where the old streaming block enters 'animating'
  // state and gets stagger plugins that would restart its animations.
  if (blocks.length === 0 && prevBlocksLenRef.current !== 0) {
    minRevealedRef.current = 0;
  }
  if (blocks.length > prevBlocksLenRef.current && prevBlocksLenRef.current > 0) {
    const prevTail = prevBlocksLenRef.current - 1;
    minRevealedRef.current = Math.max(minRevealedRef.current, prevTail + 1);
  }
  prevBlocksLenRef.current = blocks.length;

  // State reset when stream restarts (blocks empty)
  useEffect(() => {
    if (blocks.length === 0) {
      setRevealedCount(0);
      minRevealedRef.current = 0;
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    }
  }, [blocks.length]);

  const effectiveRevealedCount = Math.max(revealedCount, minRevealedRef.current);
  const tailIndex = blocks.length - 1;

  const getBlockState = useCallback(
    (index: number): BlockState => {
      if (index < effectiveRevealedCount) return 'revealed';
      if (index === effectiveRevealedCount && index < tailIndex) return 'animating';
      if (index === effectiveRevealedCount && index === tailIndex) return 'streaming';
      return 'queued';
    },
    [effectiveRevealedCount, tailIndex],
  );

  const queueLength = Math.max(0, tailIndex - effectiveRevealedCount - 1);

  const animatingIndex = effectiveRevealedCount < tailIndex ? effectiveRevealedCount : -1;
  const animatingCharCount =
    animatingIndex >= 0 ? countChars(blocks[animatingIndex]?.content ?? '') : 0;

  const streamingIndex = animatingIndex < 0 && tailIndex >= effectiveRevealedCount ? tailIndex : -1;
  const activeIndex = animatingIndex >= 0 ? animatingIndex : streamingIndex;
  const activeCharCount = activeIndex >= 0 ? countChars(blocks[activeIndex]?.content ?? '') : 0;

  // Freeze charDelay when entering a new active block (animating or streaming)
  const frozenRef = useRef({ delay: BASE_DELAY, index: -1 });
  const nextDelay = computeCharDelay(queueLength, activeCharCount, preferredCharDelay);
  if (activeIndex >= 0 && activeIndex !== frozenRef.current.index) {
    frozenRef.current = {
      delay: nextDelay,
      index: activeIndex,
    };
  } else if (activeIndex >= 0) {
    // Allow in-flight blocks to accelerate with the upstream stream rate
    // without regressing already-started character progress.
    frozenRef.current = {
      delay: Math.min(frozenRef.current.delay, nextDelay),
      index: activeIndex,
    };
  }
  const charDelay = activeIndex >= 0 ? frozenRef.current.delay : nextDelay;

  const onAnimationDone = useCallback(() => {
    setRevealedCount(effectiveRevealedCount + 1);
  }, [effectiveRevealedCount]);

  useEffect(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }

    if (animatingIndex < 0) return;

    const totalTime = Math.max(0, (animatingCharCount - 1) * charDelay) + FADE_DURATION;
    timerRef.current = setTimeout(onAnimationDone, totalTime);

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [animatingIndex, animatingCharCount, charDelay, onAnimationDone]);

  return { charDelay, getBlockState, queueLength };
}
