'use client';

import { useEffect, useRef, useState } from 'react';

import { type MermaidRenderResult, renderMermaid, useMermaidScopeId } from './useMermaid';

const EMPTY: MermaidRenderResult = { svg: '' };
const PENDING: MermaidRenderResult = { loading: true, svg: '' };
const THROTTLE = 150;

// Most prefixes of a diagram are not valid syntax yet, so a failed render keeps
// the last good SVG instead of flashing an error; the static renderer that takes
// over once streaming ends is the one that reports real errors.
export const useStreamMermaid = (
  content: string,
  { enabled = true }: { enabled?: boolean } = {},
): MermaidRenderResult => {
  const scopeId = useMermaidScopeId();
  const [result, setResult] = useState<MermaidRenderResult>(EMPTY);
  const lastRenderRef = useRef(0);

  useEffect(() => {
    if (!enabled || !content) {
      setResult(EMPTY);
      return;
    }

    // Throttle rather than debounce: chunks arrive faster than any debounce
    // window, which would hold the diagram back until the stream pauses.
    const wait = Math.max(0, THROTTLE - (Date.now() - lastRenderRef.current));
    const timer = setTimeout(() => {
      lastRenderRef.current = Date.now();
      const next = renderMermaid(content, scopeId);
      setResult((previous) => {
        if (!next.error) return next;
        return previous.svg ? previous : PENDING;
      });
    }, wait);

    return () => clearTimeout(timer);
  }, [enabled, content, scopeId]);

  return result;
};
