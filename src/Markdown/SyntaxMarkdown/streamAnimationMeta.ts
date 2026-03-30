import { type BlockState } from './useStreamQueue';

export interface ResolveBlockAnimationMetaOptions {
  blockCharCount: number;
  currentCharDelay: number;
  fadeDuration: number;
  previousCharDelay?: number;
  state: BlockState;
  timelineElapsedMs: number;
}

export interface BlockAnimationMeta {
  charDelay: number;
  settled: boolean;
  timelineElapsedMs: number;
}

const isActiveBlock = (state: BlockState) => {
  return state === 'animating' || state === 'streaming';
};

export const resolveBlockAnimationMeta = ({
  blockCharCount,
  currentCharDelay,
  fadeDuration,
  previousCharDelay,
  state,
  timelineElapsedMs,
}: ResolveBlockAnimationMetaOptions): BlockAnimationMeta => {
  const charDelay = isActiveBlock(state)
    ? currentCharDelay
    : (previousCharDelay ?? currentCharDelay);
  const latestCharStart = Math.max(0, (blockCharCount - 1) * charDelay);
  const settled = state === 'revealed' && timelineElapsedMs >= latestCharStart + fadeDuration;

  return {
    charDelay,
    settled,
    timelineElapsedMs: settled ? latestCharStart + fadeDuration : timelineElapsedMs,
  };
};
