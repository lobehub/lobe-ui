'use client';

import { createContext, memo, use, useCallback, useMemo, useRef } from 'react';

import type { ImagePreviewOptions, PreviewGroupProps } from './type';

export interface PreviewGroupEntry {
  getElement: () => HTMLImageElement | null;
  id: string;
  previewSrc?: string;
  src: string;
}

interface PreviewGroupContextValue {
  getEntries: () => PreviewGroupEntry[];
  preview?: boolean | ImagePreviewOptions;
  register: (entry: PreviewGroupEntry) => () => void;
}

const PreviewGroupContext = createContext<PreviewGroupContextValue | null>(null);

export const usePreviewGroupContext = () => use(PreviewGroupContext);

const compareEntries = (a: PreviewGroupEntry, b: PreviewGroupEntry) => {
  const elementA = a.getElement();
  const elementB = b.getElement();
  if (!elementA || !elementB) return 0;
  const position = elementA.compareDocumentPosition(elementB);
  if (position & Node.DOCUMENT_POSITION_FOLLOWING) return -1;
  if (position & Node.DOCUMENT_POSITION_PRECEDING) return 1;
  return 0;
};

const PreviewGroup = memo<PreviewGroupProps>(({ children, enable = true, preview }) => {
  const entriesRef = useRef(new Map<string, PreviewGroupEntry>());

  const register = useCallback((entry: PreviewGroupEntry) => {
    entriesRef.current.set(entry.id, entry);
    return () => {
      entriesRef.current.delete(entry.id);
    };
  }, []);

  const getEntries = useCallback(() => [...entriesRef.current.values()].sort(compareEntries), []);

  const value = useMemo<PreviewGroupContextValue>(
    () => ({ getEntries, preview, register }),
    [getEntries, preview, register],
  );

  if (!enable) return children;

  return <PreviewGroupContext value={value}>{children}</PreviewGroupContext>;
});

PreviewGroup.displayName = 'PreviewGroup';

export default PreviewGroup;
