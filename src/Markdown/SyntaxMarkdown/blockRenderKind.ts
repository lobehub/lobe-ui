import { marked } from 'marked';

export interface ParsedBlock {
  raw: string;
  renderKind: string;
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
  return tokens.map((token) => ({ raw: token.raw, renderKind: getBlockRenderKind(token) }));
};

export const getTagChangedMask = (previousKinds: string[], currentKinds: string[]): boolean[] => {
  return currentKinds.map((kind, index) => !!previousKinds[index] && previousKinds[index] !== kind);
};
