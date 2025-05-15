'use client';

import { memo, useMemo } from 'react';

import Line from './Line';

const AnimatedHighlighter = memo<{ children: string }>(({ children }) => {
  const contentLines: { className: string; content: string }[] = useMemo(() => {
    if (children && typeof children === 'string') {
      // Extract all lines from the HTML content
      // We need to handle the structure from shiki which gives us HTML with a <pre><code> structure
      const parser = new DOMParser();
      const doc = parser.parseFromString(children, 'text/html');
      const codeElement = doc.querySelector('pre code');

      if (codeElement) {
        const spanLines = codeElement.querySelectorAll('.line');
        return [...spanLines].map((line) => ({
          className: line.className,
          content: line.outerHTML,
        }));
      } else {
        // Fallback if the structure is different
        return children.split('\n').map((line) => ({
          className: 'line',
          content: line,
        }));
      }
    }
    return [];
  }, [children]);

  return (
    <pre className="shiki">
      <code>
        {contentLines.map((line, index) => (
          <Line className={line.className} key={index}>
            {line.content}
          </Line>
        ))}
      </code>
    </pre>
  );
});

AnimatedHighlighter.displayName = 'AnimatedHighlighter';

export default AnimatedHighlighter;
