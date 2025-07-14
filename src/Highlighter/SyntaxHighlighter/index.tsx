'use client';

import { cva } from 'class-variance-authority';
import { CSSProperties, memo, useEffect, useMemo, useState } from 'react';

import { useHighlight } from '@/hooks/useHighlight';

import type { SyntaxHighlighterProps } from '../type';
import Line from './Line';
import { useStyles } from './style';

const SyntaxHighlighter = memo<SyntaxHighlighterProps>(
  ({ ref, children, language, className, style, enableTransformer, variant, theme, animated }) => {
    const { styles, cx } = useStyles();
    const isDefaultTheme = theme === 'lobe-theme' || !theme;
    const showBackground = !isDefaultTheme && variant === 'filled';
    const { data, isLoading } = useHighlight(children, {
      enableTransformer,
      language,
      theme: isDefaultTheme ? undefined : theme,
    });
    const [contentLines, setContentLines] = useState<string[]>([]);
    const [preStyle, setPreStyle] = useState<CSSProperties>({});
    
    // State for incremental rendering
    const [prevChildren, setPrevChildren] = useState<string>('');
    const [prevHighlightedData, setPrevHighlightedData] = useState<string>('');
    const [incrementalContent, setIncrementalContent] = useState<string>('');

    // Handle incremental content changes
    useEffect(() => {
      const currentChildren = children || '';
      
      // Check if current content starts with previous content (incremental addition)
      const isIncrementalAdd = currentChildren.startsWith(prevChildren) && 
                              currentChildren !== prevChildren && 
                              currentChildren.length > prevChildren.length;
      
      if (isIncrementalAdd && prevHighlightedData) {
        // Extract the newly added content
        const newContent = currentChildren.slice(prevChildren.length);
        
        // Create incremental content by combining previous highlighted content with new plain text
        const parser = new DOMParser();
        const prevDoc = parser.parseFromString(prevHighlightedData, 'text/html');
        const prevCodeElement = prevDoc.querySelector('pre code');
        
        if (prevCodeElement) {
          // Handle new content with proper line breaks
          const lines = newContent.split('\n');
          
          lines.forEach((line, index) => {
            // Create a new span for each line
            const newSpan = document.createElement('span');
            newSpan.className = 'line';
            newSpan.textContent = line;
            newSpan.style.opacity = '0.7'; // Make new content slightly transparent
            newSpan.style.backgroundColor = 'rgba(255, 255, 0, 0.1)'; // Light yellow background
            
            // Append to the existing code element
            prevCodeElement.appendChild(newSpan);
            
            // Add line break if not the last line
            if (index < lines.length - 1) {
              prevCodeElement.appendChild(document.createTextNode('\n'));
            }
          });
          
          // Update incremental content
          setIncrementalContent(prevDoc.documentElement.outerHTML);
          console.log(`[Incremental] Added ${newContent.length} chars (${lines.length} lines) to existing content`);
        } else {
          // Fallback: reset incremental content
          setIncrementalContent('');
        }
      } else if (currentChildren !== prevChildren) {
        // Content changed (deleted, modified, or completely different), reset incremental content
        setIncrementalContent('');
        console.log(`[Incremental] Content changed (length: ${prevChildren.length} -> ${currentChildren.length}), resetting`);
      }
    }, [children, prevChildren, prevHighlightedData]);

    useEffect(() => {
      if (data && typeof data === 'string') {
        const startTime = performance.now();
        console.log(`[Performance] Starting DOM parsing for ${data.length} chars of HTML`);
        
        // Extract all lines from the HTML content
        // We need to handle the structure from shiki which gives us HTML with a <pre><code> structure
        const parseStart = performance.now();
        const parser = new DOMParser();
        const doc = parser.parseFromString(data, 'text/html');
        const parseEnd = performance.now();
        console.log(`[Performance] DOM parsing time: ${(parseEnd - parseStart).toFixed(2)}ms`);
        
        const preElement = doc.querySelector('pre');

        const preStyle = preElement?.style;

        if (preStyle) {
          setPreStyle({
            backgroundColor: preStyle?.backgroundColor,
            color: preStyle?.color,
          });
        }

        const codeElement = doc.querySelector('pre code');

        if (codeElement) {
          const queryStart = performance.now();
          const spanLines = codeElement.querySelectorAll('.line');
          const newLines = [...spanLines].map((line) => line.outerHTML);
          const queryEnd = performance.now();
          console.log(`[Performance] Line extraction time (${newLines.length} lines): ${(queryEnd - queryStart).toFixed(2)}ms`);

          // Only update if the lines have changed
          setContentLines((prevLines) => {
            const diffStart = performance.now();
            if (prevLines.length !== newLines.length) {
              const diffEnd = performance.now();
              console.log(`[Performance] Line diff time (length change): ${(diffEnd - diffStart).toFixed(2)}ms`);
              return newLines;
            }

            let hasChanged = false;
            for (const [i, newLine] of newLines.entries()) {
              if (prevLines[i] !== newLine) {
                hasChanged = true;
                break;
              }
            }

            const diffEnd = performance.now();
            console.log(`[Performance] Line diff time (content check): ${(diffEnd - diffStart).toFixed(2)}ms, changed: ${hasChanged}`);
            return hasChanged ? newLines : prevLines;
          });
        } else {
          // Fallback if the structure is different
          const fallbackStart = performance.now();
          const htmlLines = data.split('\n').map((line) => `<span class="line">${line}</span>`);
          const fallbackEnd = performance.now();
          console.log(`[Performance] Fallback line processing time: ${(fallbackEnd - fallbackStart).toFixed(2)}ms`);
          setContentLines(htmlLines);
        }
        
        const endTime = performance.now();
        console.log(`[Performance] Total DOM processing time: ${(endTime - startTime).toFixed(2)}ms`);
        
        // Update previous state for incremental rendering
        setPrevChildren(children || '');
        setPrevHighlightedData(data);
        setIncrementalContent(''); // Clear incremental content since we have full highlight
        console.log(`[Incremental] Updated previous state with ${(children || '').length} chars`);
      }
    }, [data, children]);

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

    // Show incremental content while loading if available, otherwise show original code
    if (isLoading || !data) {
      // If we have incremental content, show it instead of plain text
      if (incrementalContent) {
        return (
          <div
            className={cx(variants({ shiki: true, showBackground, variant }), className)}
            dangerouslySetInnerHTML={{
              __html: incrementalContent,
            }}
            dir="ltr"
            ref={ref}
            style={{
              ...style,
              transition: 'opacity 0.2s ease-in-out',
              opacity: 0.9, // Slightly transparent to indicate it's still loading
            }}
          />
        );
      }
      
      // Fallback to original code
      return (
        <div
          className={cx(variants({ shiki: false, showBackground, variant }), className)}
          dir="ltr"
          ref={ref}
          style={{
            ...style,
            transition: 'opacity 0.2s ease-in-out',
            opacity: isLoading ? 0.7 : 1,
          }}
        >
          <pre>
            <code>{children}</code>
          </pre>
        </div>
      );
    }

    // Show highlighted code (non-animated)
    if (!animated) {
      return (
        <div
          className={cx(variants({ shiki: true, showBackground, variant }), className)}
          dangerouslySetInnerHTML={{
            __html: data,
          }}
          dir="ltr"
          ref={ref}
          style={{
            ...style,
            transition: 'opacity 0.2s ease-in-out',
            opacity: 1,
          }}
        />
      );
    }

    // Show highlighted code (animated) - fallback to incremental or original if no content lines
    if (contentLines.length === 0) {
      // If we have incremental content, show it instead of plain text
      if (incrementalContent) {
        return (
          <div
            className={cx(variants({ shiki: true, showBackground, variant }), className)}
            dangerouslySetInnerHTML={{
              __html: incrementalContent,
            }}
            dir="ltr"
            ref={ref}
            style={{
              ...style,
              transition: 'opacity 0.2s ease-in-out',
              opacity: 0.9,
            }}
          />
        );
      }
      
      // Fallback to original code
      return (
        <div
          className={cx(variants({ shiki: false, showBackground, variant }), className)}
          dir="ltr"
          ref={ref}
          style={{
            ...style,
            transition: 'opacity 0.2s ease-in-out',
            opacity: 0.7,
          }}
        >
          <pre>
            <code>{children}</code>
          </pre>
        </div>
      );
    }

    return (
      <div
        className={cx(variants({ shiki: true, showBackground, variant }), className)}
        dir="ltr"
        ref={ref}
        style={{
          ...style,
          transition: 'opacity 0.2s ease-in-out',
          opacity: 1,
        }}
      >
        <pre
          className={cx('shiki', isDefaultTheme ? undefined : theme)}
          style={preStyle}
          tabIndex={0}
        >
          <code style={{ display: 'flex', flexDirection: 'column' }}>
            {contentLines.map((line, index) => (
              <Line key={index}>{line}</Line>
            ))}
          </code>
        </pre>
      </div>
    );
  },
);

SyntaxHighlighter.displayName = 'SyntaxHighlighter';

export default SyntaxHighlighter;
