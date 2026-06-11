'use client';

import { createContext, memo, type PropsWithChildren, use } from 'react';

import { useStableValue } from '@/hooks/useStableValue';

import { type SyntaxMarkdownProps } from '../type';

export type MarkdownContentConfig = Omit<SyntaxMarkdownProps, 'children' | 'reactMarkdownProps'>;

export const MarkdownContext = createContext<MarkdownContentConfig>({});

export const MarkdownProvider = memo<PropsWithChildren<MarkdownContentConfig>>(
  ({ children, ...config }) => {
    // The rest-spread builds a fresh object on every render while `children`
    // changes on every streamed chunk, so without stabilisation each chunk
    // swaps the context identity and re-renders every consumer inside every
    // block, bypassing the per-block memo entirely.
    const stableConfig = useStableValue(config);

    return <MarkdownContext value={stableConfig}>{children}</MarkdownContext>;
  },
);

export const useMarkdownContext = () => {
  return use(MarkdownContext);
};
