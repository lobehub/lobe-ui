'use client';

import { cva } from 'class-variance-authority';
import { memo, useEffect, useMemo, useState } from 'react';

import { useHighlight } from '@/hooks/useHighlight';

import type { SyntaxHighlighterProps } from '../type';
import { useStyles } from './style';

const Span = memo<{ data: string }>(({ data }) => {
  return (
    <span
      dangerouslySetInnerHTML={{
        __html: data,
      }}
    />
  );
});

const Line = memo<{ data?: string }>(({ data }) => {
  const [contents, setContents] = useState<string[]>([]);

  useEffect(() => {
    if (data && typeof data === 'string') {
      // Extract all lines from the HTML content
      // We need to handle the structure from shiki which gives us HTML with a <pre><code> structure
      const parser = new DOMParser();
      const doc = parser.parseFromString(data, 'text/html');
      const codeElement = doc.querySelector('span.line');

      if (codeElement) {
        const spanLines = codeElement.querySelectorAll('span');
        const newLines = [...spanLines].map((line) => line.outerHTML);
        setContents(newLines);
      } else {
        // Fallback if the structure is different
        const htmlLines = data.split('\n').map((line) => `<span>${line}</span>`);
        setContents(htmlLines);
      }
    }
  }, [data]);

  return (
    <span className={'line'}>
      {contents && contents.length > 0 ? (
        contents.map((span, index) => <Span data={span || ' '} key={index} />)
      ) : (
        <span> </span>
      )}
    </span>
  );
});

Line.displayName = 'HighlighterLine';

Span.displayName = 'HighlighterSpan';

const SyntaxHighlighter = memo<SyntaxHighlighterProps>(
  ({ ref, children, language, className, style, enableTransformer, variant, theme }) => {
    const { styles, cx } = useStyles();
    const isDefaultTheme = theme === 'lobe-theme' || !theme;
    const showBackground = !isDefaultTheme && variant === 'filled';
    const { data } = useHighlight(children, {
      enableTransformer,
      language,
      theme: isDefaultTheme ? undefined : theme,
    });
    const [contentLines, setContentLines] = useState<string[]>([]);

    useEffect(() => {
      if (data && typeof data === 'string') {
        // Extract all lines from the HTML content
        // We need to handle the structure from shiki which gives us HTML with a <pre><code> structure
        const parser = new DOMParser();
        const doc = parser.parseFromString(data, 'text/html');
        const codeElement = doc.querySelector('pre code');

        if (codeElement) {
          const spanLines = codeElement.querySelectorAll('.line');
          const newLines = [...spanLines].map((line) => line.outerHTML);

          // Only update if the lines have changed
          setContentLines((prevLines) => {
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
          const htmlLines = data.split('\n').map((line) => `<span class="line">${line}</span>`);
          setContentLines(htmlLines);
        }
      }
    }, [data]);

    const variants = useMemo(
      () =>
        cva(styles.root, {
          defaultVariants: {
            shiki: false,
            showBackground: false,
            variant: 'borderless',
          },
          /* eslint-disable sort-keys-fix/sort-keys-fix */
          variants: {
            shiki: {
              false: styles.unshiki,
              true: styles.shiki,
            },
            variant: {
              filled: styles.padding,
              outlined: styles.padding,
              borderless: styles.noPadding,
            },
            showBackground: {
              false: styles.noBackground,
              true: null,
            },
          },
          /* eslint-enable sort-keys-fix/sort-keys-fix */
        }),
      [styles],
    );

    if (contentLines.length === 0)
      return (
        <div
          className={cx(variants({ shiki: false, showBackground, variant }), className)}
          dir="ltr"
          ref={ref}
          style={style}
        >
          <pre>
            <code>{children}</code>
          </pre>
        </div>
      );

    return (
      <div
        className={cx(variants({ shiki: true, showBackground, variant }), className)}
        dir="ltr"
        ref={ref}
        style={style}
      >
        <pre className="shiki">
          <code>
            {contentLines.map((line, index) => (
              <Line data={line} key={index} />
            ))}
          </code>
        </pre>
      </div>
    );
  },
);

SyntaxHighlighter.displayName = 'SyntaxHighlighter';

export default SyntaxHighlighter;
