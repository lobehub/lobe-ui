import { marked } from 'marked';
import { describe, expect, it } from 'vitest';

import {
  codeSample,
  gfmEdgeSample,
  heroSample,
  inlineSample,
  latexSample,
  markdownSample,
  mathEdgeSample,
  stressSample,
} from '../site/src/lib/samples';
import { createBlockLexer } from './blockLexer';

const samples = {
  codeSample,
  gfmEdgeSample,
  heroSample,
  inlineSample,
  latexSample,
  lists: '- a\n\n- b\n\n1. x\n\n1. y\n\n    indented\n\n    more\n\n> q\n\n> r\n\ntext\n\n  x',
  markdownSample,
  mathEdgeSample,
  stressSample,
};

const fullBlocks = (processed: string) => {
  let offset = 0;
  return marked.lexer(processed).map((token) => {
    const block = { content: token.raw, startOffset: offset };
    offset += token.raw.length;
    return block;
  });
};

describe('createBlockLexer', () => {
  for (const [name, source] of Object.entries(samples)) {
    for (const step of [1, 7]) {
      it(`matches a full lex at every ${step}-char step of ${name}`, () => {
        const lex = createBlockLexer();
        for (let end = 1; end <= source.length; end += step) {
          const result = lex(source.slice(0, end));
          expect(result.blocks).toEqual(fullBlocks(result.processed));
        }
      });
    }
  }

  it('only mends the open tail, so frozen blocks cannot steer its closers', () => {
    const head = '$$\nx\n$$\n\n';
    const lex = createBlockLexer();
    lex(head);
    expect(lex(`${head}$$y`).processed).toBe(`${head}$$y$$`);
  });

  it('re-lexes from scratch when content is not an append', () => {
    const lex = createBlockLexer();
    lex('para one\n\npara two\n\n- item');
    const result = lex('fresh\n\nstart');
    expect(result.blocks).toEqual(fullBlocks(result.processed));
    expect(result.processed).toBe('fresh\n\nstart');
  });
});
