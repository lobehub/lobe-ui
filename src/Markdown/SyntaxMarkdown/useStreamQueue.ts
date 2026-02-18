import { useCallback, useEffect, useRef, useState } from 'react';

export interface BlockInfo {
  content: string;
  startOffset: number;
}

export type BlockState = 'revealed' | 'animating' | 'streaming' | 'queued';

const BASE_DELAY = 20;
const ACCELERATION_FACTOR = 0.3;
const MAX_BLOCK_DURATION = 3000;
const FADE_DURATION = 150;

function countChars(text: string): number {
  return [...text].length;
}

function computeCharDelay(queueLength: number, charCount: number): number {
  const acceleration = 1 + queueLength * ACCELERATION_FACTOR;
  let delay = BASE_DELAY / acceleration;
  delay = Math.min(delay, MAX_BLOCK_DURATION / Math.max(charCount, 1));
  return delay;
}

export interface UseStreamQueueReturn {
  charDelay: number;
  getBlockState: (index: number) => BlockState;
  queueLength: number;
}

export function useStreamQueue(blocks: BlockInfo[]): UseStreamQueueReturn {
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

  // Freeze charDelay when a new block starts animating
  const frozenRef = useRef({ delay: BASE_DELAY, index: -1 });
  if (animatingIndex >= 0 && animatingIndex !== frozenRef.current.index) {
    frozenRef.current = {
      delay: computeCharDelay(queueLength, animatingCharCount),
      index: animatingIndex,
    };
  }
  const charDelay = animatingIndex >= 0 ? frozenRef.current.delay : BASE_DELAY;

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
