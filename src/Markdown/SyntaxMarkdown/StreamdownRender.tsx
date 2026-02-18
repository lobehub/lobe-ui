'use client';

import { marked } from 'marked';
import { memo, useEffect, useId, useMemo, useRef } from 'react';
import Markdown, { type Options } from 'react-markdown';
import remend from 'remend';
import type { Pluggable } from 'unified';

import {
  useMarkdownComponents,
  useMarkdownContent,
  useMarkdownRehypePlugins,
  useMarkdownRemarkPlugins,
} from '@/hooks/useMarkdown';
import { rehypeStreamAnimated } from '@/Markdown/plugins/rehypeStreamAnimated';

import { styles } from './style';
import { type BlockInfo, useStreamQueue } from './useStreamQueue';

const STREAM_CHAR_DELAY = 15;

function countChars(text: string): number {
  return [...text].length;
}

const StreamdownBlock = memo<Options>(({ children, ...rest }) => {
  return <Markdown {...rest}>{children}</Markdown>;
});

StreamdownBlock.displayName = 'StreamdownBlock';

export const StreamdownRender = memo<Options>(({ children, ...rest }) => {
  const escapedContent = useMarkdownContent(children || '');
  const components = useMarkdownComponents();
  const baseRehypePlugins = useMarkdownRehypePlugins();
  const remarkPlugins = useMarkdownRemarkPlugins();
  const generatedId = useId();

  const processedContent = useMemo(() => {
    const content = typeof escapedContent === 'string' ? escapedContent : '';
    return remend(content);
  }, [escapedContent]);

  const blocks: BlockInfo[] = useMemo(() => {
    const tokens = marked.lexer(processedContent);
    let offset = 0;
    return tokens.map((token) => {
      const block = { content: token.raw, startOffset: offset };
      offset += token.raw.length;
      return block;
    });
  }, [processedContent]);

  const { getBlockState, charDelay } = useStreamQueue(blocks);

  const staggerPlugins: Pluggable[] = useMemo(
    () => [...baseRehypePlugins, [rehypeStreamAnimated, { baseCharCount: 0, charDelay }]],
    [baseRehypePlugins, charDelay],
  );

  // prevCharCount tracks the PREVIOUS render's streaming char count.
  // Updated in useEffect (after render) to avoid stale reads during
  // synchronous re-renders (e.g. useLayoutEffect auto-reveal).
  const prevCharCountRef = useRef(0);
  const prevStreamOffsetRef = useRef(-1);

  useEffect(() => {
    const tailIdx = blocks.length - 1;
    if (tailIdx >= 0) {
      const tail = blocks[tailIdx];
      if (tail.startOffset !== prevStreamOffsetRef.current) {
        prevStreamOffsetRef.current = tail.startOffset;
        prevCharCountRef.current = 0;
      }
      prevCharCountRef.current = countChars(tail.content);
    } else {
      prevCharCountRef.current = 0;
      prevStreamOffsetRef.current = -1;
    }
  }, [blocks]);

  return (
    <div className={styles.animated}>
      {blocks.map((block, index) => {
        const state = getBlockState(index);
        if (state === 'queued') return null;

        let plugins: Pluggable[];
        if (state === 'streaming') {
          const baseCharCount =
            block.startOffset === prevStreamOffsetRef.current ? prevCharCountRef.current : 0;
          plugins = [
            ...baseRehypePlugins,
            [rehypeStreamAnimated, { baseCharCount, charDelay: STREAM_CHAR_DELAY }],
          ];
        } else if (state === 'animating') {
          plugins = staggerPlugins;
        } else {
          plugins = baseRehypePlugins;
        }

        return (
          <StreamdownBlock
            {...rest}
            components={components}
            key={`${generatedId}-${block.startOffset}`}
            rehypePlugins={plugins}
            remarkPlugins={remarkPlugins}
          >
            {block.content}
          </StreamdownBlock>
        );
      })}
    </div>
  );
});

StreamdownRender.displayName = 'StreamdownRender';

export default StreamdownRender;
