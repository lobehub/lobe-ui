import { marked } from 'marked';

export interface ParsedBlock {
  endOffset: number;
  raw: string;
  renderKind: string;
  startOffset: number;
}

export interface RenderBlock extends ParsedBlock {
  disableAnimation: boolean;
  id: string;
}

export const getBlockRenderKind = (token: any): string => {
  if (token.type === 'heading') {
    return `heading-${token.depth || 0}`;
  }

  if (token.type === 'list') {
    return token.ordered ? 'list-ol' : 'list-ul';
  }

  return token.type;
};

export const parseMarkdownIntoBlocks = (markdown: string): ParsedBlock[] => {
  const tokens = marked.lexer(markdown);
  let offset = 0;

  return tokens.map((token) => {
    const raw = token.raw || '';
    const startOffset = offset;
    offset += raw.length;

    return {
      endOffset: offset,
      raw,
      renderKind: getBlockRenderKind(token),
      startOffset,
    };
  });
};

export const getTagChangedMask = (previousKinds: string[], currentKinds: string[]): boolean[] => {
  return currentKinds.map((kind, index) => !!previousKinds[index] && previousKinds[index] !== kind);
};
