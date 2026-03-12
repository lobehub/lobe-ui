'use client';

import { createContext, memo, type PropsWithChildren, use } from 'react';

import { type SyntaxMarkdownProps } from '../type';

export interface MarkdownContentConfig extends Omit<
  SyntaxMarkdownProps,
  'children' | 'reactMarkdownProps'
> {
  onStreamAnimationDelayChange?: (delayMs: number) => void;
}

export const MarkdownContext = createContext<MarkdownContentConfig>({});

export const MarkdownProvider = memo<PropsWithChildren<MarkdownContentConfig>>(
  ({ children, ...config }) => {
    return <MarkdownContext value={config}>{children}</MarkdownContext>;
  },
);

export const useMarkdownContext = () => {
  return use(MarkdownContext);
};
