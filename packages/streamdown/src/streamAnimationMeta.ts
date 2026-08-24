import { type BlockState } from './useStreamQueue';

export interface ResolveBlockAnimationMetaOptions {
  currentCharDelay: number;
  fadeDuration: number;
  lastElapsedMs: number;
  previousCharDelay?: number;
  state: BlockState;
}

export interface BlockAnimationMeta {
  charDelay: number;
  settled: boolean;
}

const isActiveBlock = (state: BlockState) => {
  return state === 'animating' || state === 'streaming';
};

export const resolveBlockAnimationMeta = ({
  currentCharDelay,
  fadeDuration,
  lastElapsedMs,
  previousCharDelay,
  state,
}: ResolveBlockAnimationMetaOptions): BlockAnimationMeta => {
  const charDelay = isActiveBlock(state)
    ? currentCharDelay
    : (previousCharDelay ?? currentCharDelay);
  const settled = state === 'revealed' && lastElapsedMs >= fadeDuration;

  return {
    charDelay,
    settled,
  };
};
