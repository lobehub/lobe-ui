import { STREAM_FADE_DURATION } from '@lobehub/streamdown';
import type { CSSProperties } from 'react';
import type { ThemedToken } from 'shiki';

const MIN_GAP_MS = 16;
const MAX_GAP_MS = 160;
const MIN_CHAR_PACE_MS = 2;
const MAX_CHAR_PACE_MS = 18;

export interface TokenFadeStore {
  /**
   * Birth timestamp per source char. A char's birth is the birth of the
   * token it is displayed in, and it only ever moves earlier: shiki
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
  const cached = store.styles.get(offset);
  if (cached && cached.birth === birth) return cached.style;

  const elapsed = now - birth;
  const style = elapsed >= STREAM_FADE_DURATION ? null : { animationDelay: `${-elapsed}ms` };
  store.styles.set(offset, { birth, style });
  return style;
};
