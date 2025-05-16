'use client';

import { type ReactNode, createContext, memo, use } from 'react';

import type { SyntaxMarkdownProps } from '../type';

export type MarkdownContentConfig = Omit<SyntaxMarkdownProps, 'children' | 'reactMarkdownProps'>;

export const MarkdownContext = createContext<MarkdownContentConfig>({});

export const MarkdownProvider = memo<{ children: ReactNode; config?: MarkdownContentConfig }>(
  ({ children, config = {} }) => {
    return <MarkdownContext value={config}>{children}</MarkdownContext>;
  },
);

export const useMarkdownContext = () => {
  return use(MarkdownContext);
};
