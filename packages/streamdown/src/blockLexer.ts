import { marked, type Token } from 'marked';
import remend from 'remend';

import { type BlockInfo } from './useStreamQueue';

export interface LexedBlocks {
  blocks: BlockInfo[];
  processed: string;
}

// Block types that marked can never extend once a blank line follows them
// (a list can — "- a\n\n" + "- b" merges back into one list, and so can
// indented code). Tokens up to such a boundary are frozen and re-used; only
// the text after it is re-mended and re-lexed on every reveal commit, so
// per-commit cost tracks the open tail instead of the whole document.
const FROZEN_TYPES = new Set(['blockquote', 'code', 'heading', 'hr', 'paragraph', 'table']);

const isFrozenBoundary = (token: Token, next: Token | undefined): boolean =>
  next?.type === 'space' &&
  FROZEN_TYPES.has(token.type) &&
  !(token.type === 'code' && token.codeBlockStyle === 'indented');

const toBlocks = (tokens: Token[], startOffset: number): BlockInfo[] => {
  let offset = startOffset;
  return tokens.map((token) => {
    const block = { content: token.raw, startOffset: offset };
    offset += token.raw.length;
    return block;
  });
};

export const createBlockLexer = () => {
  let frozenRaw = '';
  let frozenBlocks: BlockInfo[] = [];

  const freezePrefix = (rawTail: string, processedTail: string, tailTokens: Token[]) => {
    let divergeAt = 0;
    const max = Math.min(rawTail.length, processedTail.length);
    while (
      divergeAt < max &&
      rawTail.charCodeAt(divergeAt) === processedTail.charCodeAt(divergeAt)
    ) {
      divergeAt++;
    }

    let cutEnd = 0;
    let frozenCount = 0;
    let offset = 0;
    for (let i = 0; i < tailTokens.length - 1; i++) {
      offset += tailTokens[i].raw.length;
      if (offset > divergeAt) break;
      if (isFrozenBoundary(tailTokens[i], tailTokens[i + 1])) {
        cutEnd = offset;
        frozenCount = i + 1;
      }
    }
    if (frozenCount === 0) return;

    frozenBlocks = frozenBlocks.concat(
      toBlocks(tailTokens.slice(0, frozenCount), frozenRaw.length),
    );
    frozenRaw += processedTail.slice(0, cutEnd);
  };

  return (content: string): LexedBlocks => {
    if (!content.startsWith(frozenRaw)) {
      frozenRaw = '';
      frozenBlocks = [];
    }

    const rawTail = content.slice(frozenRaw.length);
    const processedTail = remend(rawTail);
    const tailTokens = marked.lexer(processedTail);
    const tailBlocks = toBlocks(tailTokens, frozenRaw.length);
    const result = {
      blocks: frozenBlocks.concat(tailBlocks),
      processed: frozenRaw + processedTail,
    };

    freezePrefix(rawTail, processedTail, tailTokens);

    return result;
  };
};
