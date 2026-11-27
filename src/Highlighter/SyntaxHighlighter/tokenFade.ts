import { STREAM_FADE_DURATION } from '@lobehub/streamdown';
import type { ThemedToken } from '@pierre/highlights';
import type { CSSProperties } from 'react';

const MIN_GAP_MS = 16;
const MAX_GAP_MS = 160;
const MIN_CHAR_PACE_MS = 2;
const MAX_CHAR_PACE_MS = 18;

export interface TokenFadeStore {
  /**
   * Birth timestamp per source char. A char's birth is the birth of the
   * token it is displayed in, and it only ever moves earlier: the tokenizer
   * re-splits the last line as it completes (`'rea` becomes `'`, `rea`,
   * `'`) and merges tokens the other way, and a char that was already on
   * screen at some opacity must never drop below it in the new token.
   */
  births: number[];
  lastCommitTs: number;
  styles: Map<number, { birth: number; style: CSSProperties | null }>;
}

export const createTokenFadeStore = (): TokenFadeStore => ({
  births: [],
  lastCommitTs: 0,
  styles: new Map(),
});

/**
 * Keep the births of the chars `prevText` and `nextText` share and drop the
 * rest, instead of starting a fresh store. A code block's text is not
 * append-only: while its closing fence streams in, the partial fence
 * (one or two backticks on the last line) is part of the code, and it
 * disappears once the fence completes. Resetting
 * the whole store there would give every char a new birth and replay the
 * fade over the entire block.
 */
export const retainCommonPrefix = (store: TokenFadeStore, prevText: string, nextText: string) => {
  const limit = Math.min(prevText.length, nextText.length, store.births.length);
  let common = 0;
  while (common < limit && prevText.charCodeAt(common) === nextText.charCodeAt(common)) common++;
  if (common < store.births.length) store.births.length = common;
  for (const offset of store.styles.keys()) {
    if (offset >= common) store.styles.delete(offset);
  }
};

/**
 * When the last token of `line` (starting at `start`) finishes fading in,
 * or `0` when none is fading at `now`.
 */
export const getLineFadeEnd = (
  store: TokenFadeStore,
  line: ThemedToken[],
  start: number,
  now: number,
): number => {
  let end = 0;
  let offset = start;
  for (const token of line) {
    const birth = store.births[offset];
    const fadeEnd = birth + STREAM_FADE_DURATION;
    if (fadeEnd > now && fadeEnd > end) end = fadeEnd;
    offset += token.content.length;
  }
  return end;
};

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

const RETOKENIZED_LINES = 2;

export const markTokenBirths = (
  store: TokenFadeStore,
  lines: ThemedToken[][],
  now: number,
): number[] => {
  const lineStarts: number[] = [];
  const tokens: { length: number; offset: number }[] = [];
  let offset = 0;

  for (const [lineIndex, line] of lines.entries()) {
    if (lineIndex > 0) offset += 1;
    lineStarts.push(offset);
    if (lineIndex >= lines.length - RETOKENIZED_LINES) {
      for (const token of line) {
        tokens.push({ length: token.content.length, offset });
        offset += token.content.length;
      }
    } else {
      for (const token of line) offset += token.content.length;
    }
  }

  const { births } = store;
  const newChars = offset - births.length;
  if (newChars > 0) {
    const gapMs =
      store.lastCommitTs === 0
        ? MIN_GAP_MS
        : clamp(now - store.lastCommitTs, MIN_GAP_MS, MAX_GAP_MS);
    const pace = clamp(gapMs / newChars, MIN_CHAR_PACE_MS, MAX_CHAR_PACE_MS);
    const cap = now + gapMs + STREAM_FADE_DURATION;
    for (let i = births.length; i < offset; i++) {
      const chained = i > 0 ? births[i - 1] + pace : now;
      births.push(Math.min(cap, Math.max(chained, now)));
    }
    store.lastCommitTs = now;
  }

  for (const token of tokens) {
    let birth = births[token.offset];
    for (let i = token.offset + 1; i < token.offset + token.length; i++) {
      if (births[i] < birth) birth = births[i];
    }
    for (let i = token.offset; i < token.offset + token.length; i++) births[i] = birth;
  }

  return lineStarts;
};

export const resolveTokenFadeStyle = (
  store: TokenFadeStore,
  offset: number,
  now: number,
): CSSProperties | null => {
  const birth = store.births[offset];
  const elapsed = now - birth;
  // A finished fade renders plain, so the span drops `.stream-char` and its
  // CSS animation instead of holding `opacity: 1` via `forwards` forever.
  if (!(elapsed < STREAM_FADE_DURATION)) {
    store.styles.delete(offset);
    return null;
  }

  // The delay is frozen at the first render so re-renders of a token that is
  // mid-fade do not touch its running animation.
  const cached = store.styles.get(offset);
  if (cached && cached.birth === birth) return cached.style;

  const style = { animationDelay: `${-elapsed}ms` };
  store.styles.set(offset, { birth, style });
  return style;
};
