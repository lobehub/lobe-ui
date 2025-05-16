'use client';

import { memo, useEffect, useState } from 'react';

import Span from './Span';

const Line = memo<{ children?: string }>(({ children }) => {
  const [contents, setContents] = useState<string[]>([]);

  useEffect(() => {
    if (children && typeof children === 'string') {
      // Extract all lines from the HTML content
      // We need to handle the structure from shiki which gives us HTML with a <pre><code> structure
      const parser = new DOMParser();
      const doc = parser.parseFromString(children, 'text/html');
      const codeElement = doc.querySelector('span.line');

      if (codeElement) {
        const spanLines = codeElement.querySelectorAll('span');
        const newLines = [...spanLines].map((line) => line.outerHTML);
        setContents((prevLines) => {
          if (prevLines.length !== newLines.length) return newLines;

          let hasChanged = false;
          for (const [i, newLine] of newLines.entries()) {
            if (prevLines[i] !== newLine) {
              hasChanged = true;
              break;
            }
          }

          return hasChanged ? newLines : prevLines;
        });
      } else {
        // Fallback if the structure is different
        const htmlLines = children.split('\n').map((line) => `<span>${line}</span>`);
        setContents(htmlLines);
      }
    }
  }, [children]);

  return (
    <span className={'line'}>
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


export { Line };