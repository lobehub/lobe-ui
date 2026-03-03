'use client';

import { marked } from 'marked';
import { memo, useEffect, useId, useMemo, useRef } from 'react';
import Markdown, { type Options } from 'react-markdown';
import remend from 'remend';
import type { Pluggable, PluggableList } from 'unified';

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

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null;

const isDeepEqualValue = (a: unknown, b: unknown): boolean => {
  if (a === b) return true;

  if (Array.isArray(a) || Array.isArray(b)) {
    if (!Array.isArray(a) || !Array.isArray(b)) return false;
    if (a.length !== b.length) return false;
    for (let i = 0; i < a.length; i++) {
      if (!isDeepEqualValue(a[i], b[i])) return false;
    }
    return true;
  }

  if (!isRecord(a) || !isRecord(b)) return false;

  const keysA = Object.keys(a);
  const keysB = Object.keys(b);
  if (keysA.length !== keysB.length) return false;

  for (const key of keysA) {
    if (!isDeepEqualValue(a[key], b[key])) return false;
  }

  return true;
};

const isSamePlugin = (prevPlugin: Pluggable, nextPlugin: Pluggable): boolean => {
  const prevTuple = Array.isArray(prevPlugin) ? prevPlugin : [prevPlugin];
  const nextTuple = Array.isArray(nextPlugin) ? nextPlugin : [nextPlugin];

  if (prevTuple.length !== nextTuple.length) return false;
  if (prevTuple[0] !== nextTuple[0]) return false;

  return isDeepEqualValue(prevTuple.slice(1), nextTuple.slice(1));
};

const isSamePlugins = (
  prevPlugins?: PluggableList | null,
  nextPlugins?: PluggableList | null,
): boolean => {
  if (prevPlugins === nextPlugins) return true;
  if (!prevPlugins || !nextPlugins) return !prevPlugins && !nextPlugins;
  if (prevPlugins.length !== nextPlugins.length) return false;

  for (let i = 0; i < prevPlugins.length; i++) {
    if (!isSamePlugin(prevPlugins[i], nextPlugins[i])) return false;
  }

  return true;
};

const useStablePlugins = (plugins: PluggableList): PluggableList => {
  const stableRef = useRef<PluggableList>(plugins);

  if (!isSamePlugins(stableRef.current, plugins)) {
    stableRef.current = plugins;
  }

  return stableRef.current;
};

const StreamdownBlock = memo<Options>(
  ({ children, ...rest }) => {
    return <Markdown {...rest}>{children}</Markdown>;
  },
  (prevProps, nextProps) =>
    prevProps.children === nextProps.children &&
    prevProps.components === nextProps.components &&
    isSamePlugins(prevProps.rehypePlugins, nextProps.rehypePlugins) &&
    isSamePlugins(prevProps.remarkPlugins, nextProps.remarkPlugins),
);

StreamdownBlock.displayName = 'StreamdownBlock';

export const StreamdownRender = memo<Options>(({ children, ...rest }) => {
  const escapedContent = useMarkdownContent(children || '');
  const components = useMarkdownComponents();
  const baseRehypePlugins = useStablePlugins(useMarkdownRehypePlugins());
  const remarkPlugins = useStablePlugins(useMarkdownRemarkPlugins());
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

  const revealedPlugins: Pluggable[] = useMemo(
    () => [...baseRehypePlugins, [rehypeStreamAnimated, { revealed: true }]],
    [baseRehypePlugins],
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
          plugins = revealedPlugins;
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
