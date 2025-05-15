'use client';

import { memo, useMemo } from 'react';

import Span from './Span';

const Line = memo<{ children?: string; className?: string }>(({ children, className }) => {
  const contents = useMemo(() => {
    if (children && typeof children === 'string') {
      // Extract all lines from the HTML content
      // We need to handle the structure from shiki which gives us HTML with a <pre><code> structure
      const parser = new DOMParser();
      const doc = parser.parseFromString(children, 'text/html');
      const codeElement = doc.querySelector('span.line');

      if (codeElement) {
        const spanLines = codeElement.querySelectorAll('span');
        return [...spanLines].map((line) => line.outerHTML);
      } else {
        // Fallback if the structure is different
        return children.split('\n').map((line) => `<span>${line}</span>`);
      }
    }
    return;
  }, [children]);

  return (
    <span className={className}>
      {contents && contents.length > 0 ? (
        contents.map((span, index) => <Span key={index}>{span}</Span>)
      ) : (
        <span> </span>
      )}
    </span>
  );
});

Line.displayName = 'HighlighterLine';

export default Line;
