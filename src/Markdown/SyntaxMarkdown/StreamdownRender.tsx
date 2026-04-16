'use client';

import { marked } from 'marked';
import {
  memo,
  Profiler,
  type ProfilerOnRenderCallback,
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
} from 'react';
import Markdown, { type Options } from 'react-markdown';
import remend from 'remend';
import type { Pluggable, PluggableList } from 'unified';

import {
  useMarkdownComponents,
  useMarkdownContent,
  useMarkdownRehypePlugins,
  useMarkdownRemarkPlugins,
} from '@/hooks/useMarkdown';
import { useMarkdownContext } from '@/Markdown/components/MarkdownProvider';
import { rehypeStreamAnimated } from '@/Markdown/plugins/rehypeStreamAnimated';
import { useStreamdownProfiler } from '@/Markdown/streamProfiler';

import { resolveBlockAnimationMeta } from './streamAnimationMeta';
import { styles } from './style';
import { useSmoothStreamContent } from './useSmoothStreamContent';
import { type BlockInfo, useStreamQueue } from './useStreamQueue';

const STREAM_FADE_DURATION = 280;
const REVEALED_STREAM_PLUGIN: Pluggable = [rehypeStreamAnimated, { revealed: true }];

function countChars(text: string): number {
  return [...text].length;
}

function getNow(): number {
  return typeof performance === 'undefined' ? Date.now() : performance.now();
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
  const { streamSmoothingPreset = 'balanced' } = useMarkdownContext();
  const profiler = useStreamdownProfiler();
  const escapedContent = useMarkdownContent(children || '');
  const components = useMarkdownComponents();
  const baseRehypePlugins = useStablePlugins(useMarkdownRehypePlugins());
  const remarkPlugins = useStablePlugins(useMarkdownRemarkPlugins());
  const generatedId = useId();
  const smoothedContent = useSmoothStreamContent(
    typeof escapedContent === 'string' ? escapedContent : '',
    { preset: streamSmoothingPreset },
  );

  const processedContentResult = useMemo(() => {
    const start = profiler ? getNow() : 0;
    const value = remend(smoothedContent);

    return {
      durationMs: profiler ? getNow() - start : 0,
      value,
    };
  }, [profiler, smoothedContent]);
  const processedContent = processedContentResult.value;

  const blocksResult = useMemo(() => {
    const start = profiler ? getNow() : 0;
    const tokens = marked.lexer(processedContent);
    let offset = 0;

    const value = tokens.map((token) => {
      const block = { content: token.raw, startOffset: offset };
      offset += token.raw.length;
      return block;
    });

    return {
      durationMs: profiler ? getNow() - start : 0,
      value,
    };
  }, [processedContent, profiler]);
  const blocks: BlockInfo[] = blocksResult.value;

  const { getBlockState, charDelay } = useStreamQueue(blocks);
  const blockCharDelayRef = useRef<Map<number, number>>(new Map());
  const blockBirthsRef = useRef<Map<number, number[]>>(new Map());

  const renderNow = getNow();

  const birthsResult = useMemo(() => {
    const start = profiler ? getNow() : 0;
    const nextBirths = new Map<number, number[]>();
    const prevBirths = blockBirthsRef.current;

    for (const [index, block] of blocks.entries()) {
      const state = getBlockState(index);
      // Queued blocks are not rendered. Defer birth assignment so that
      // when the block later transitions to animating/streaming, its
      // chars start fading from that moment instead of having already
      // "aged out" of the fade window.
      if (state === 'queued') continue;

      const blockCharCount = countChars(block.content);
      const prev = prevBirths.get(block.startOffset);
      let arr: number[];

      if (prev && prev.length === blockCharCount) {
        arr = prev;
      } else if (prev && prev.length > blockCharCount) {
        // Block content shrunk (stream restart or upstream rewrite).
        arr = prev.slice(0, blockCharCount);
      } else {
        arr = prev ? prev.slice() : [];
        const startIdx = arr.length;
        // Chain each new char monotonically after the previous one so fades
        // never race out of order. Cap how far the fade queue can run ahead
        // of renderNow to prevent stream-faster-than-fade producing seconds
        // of invisible backlog at the tail.
        const cap = renderNow + STREAM_FADE_DURATION;
        for (let i = startIdx; i < blockCharCount; i++) {
          const prevBirth = i > 0 ? (arr[i - 1] as number) : renderNow - charDelay;
          const chained = prevBirth + charDelay;
          arr.push(Math.min(cap, Math.max(chained, renderNow)));
        }
      }

      nextBirths.set(block.startOffset, arr);
    }

    return {
      durationMs: profiler ? getNow() - start : 0,
      value: nextBirths,
    };
  }, [blocks, charDelay, getBlockState, profiler, renderNow]);
  const birthsForRender = birthsResult.value;

  useEffect(() => {
    if (!profiler) return;

    profiler.recordCalculation({
      durationMs: processedContentResult.durationMs,
      name: 'content-normalize',
      textLength: processedContent.length,
    });
  }, [processedContent.length, processedContentResult.durationMs, profiler]);

  useEffect(() => {
    if (!profiler) return;

    profiler.recordCalculation({
      durationMs: blocksResult.durationMs,
      itemCount: blocks.length,
      name: 'block-lex',
      textLength: processedContent.length,
    });
  }, [blocks.length, blocksResult.durationMs, processedContent.length, profiler]);

  useEffect(() => {
    if (!profiler) return;

    profiler.recordCalculation({
      durationMs: birthsResult.durationMs,
      itemCount: blocks.length,
      name: 'block-births',
      textLength: processedContent.length,
    });
  }, [birthsResult.durationMs, blocks.length, processedContent.length, profiler]);

  const blockAnimationMetaResult = useMemo(() => {
    const nextBlockCharDelay = new Map<number, number>();
    const blockAnimationMeta = new Map<number, ReturnType<typeof resolveBlockAnimationMeta>>();

    for (const [index, block] of blocks.entries()) {
      const state = getBlockState(index);
      const births = birthsForRender.get(block.startOffset);
      const lastBirthTs = births && births.length > 0 ? (births.at(-1) ?? renderNow) : renderNow;
      const lastElapsedMs = renderNow - lastBirthTs;
      const animationMeta = resolveBlockAnimationMeta({
        currentCharDelay: charDelay,
        fadeDuration: STREAM_FADE_DURATION,
        lastElapsedMs,
        previousCharDelay: blockCharDelayRef.current.get(block.startOffset),
        state,
      });

      nextBlockCharDelay.set(block.startOffset, animationMeta.charDelay);
      blockAnimationMeta.set(block.startOffset, animationMeta);
    }

    return {
      blockAnimationMeta,
      blockCharDelay: nextBlockCharDelay,
    };
  }, [birthsForRender, blocks, charDelay, getBlockState, renderNow]);

  useEffect(() => {
    blockCharDelayRef.current = blockAnimationMetaResult.blockCharDelay;
    blockBirthsRef.current = birthsForRender;
  }, [birthsForRender, blockAnimationMetaResult.blockCharDelay]);

  const handleRootRender = useCallback<ProfilerOnRenderCallback>(
    (_, phase, actualDuration, baseDuration) => {
      profiler?.recordRootCommit({
        actualDuration,
        baseDuration,
        blockCount: blocks.length,
        phase,
        textLength: processedContent.length,
      });
    },
    [blocks.length, processedContent.length, profiler],
  );

  const handleBlockRender = useCallback<ProfilerOnRenderCallback>(
    (id, phase, actualDuration, baseDuration) => {
      if (!profiler) return;

      const [, indexText, offsetText] = id.split(':');
      const blockIndex = Number(indexText);

      if (!Number.isFinite(blockIndex)) return;

      const block = blocks[blockIndex];
      if (!block) return;

      profiler.recordBlockCommit({
        actualDuration,
        baseDuration,
        blockChars: countChars(block.content),
        blockIndex,
        blockKey: offsetText ?? String(block.startOffset),
        phase,
        state: getBlockState(blockIndex),
      });
    },
    [blocks, getBlockState, profiler],
  );

  const content = (
    <div className={styles.animated}>
      {blocks.map((block, index) => {
        const state = getBlockState(index);
        if (state === 'queued') return null;
        const animationMeta = blockAnimationMetaResult.blockAnimationMeta.get(block.startOffset);
        if (!animationMeta) return null;

        const births = birthsForRender.get(block.startOffset);
        const plugins: Pluggable[] = animationMeta.settled
          ? [...baseRehypePlugins, REVEALED_STREAM_PLUGIN]
          : [
              ...baseRehypePlugins,
              [
                rehypeStreamAnimated,
                {
                  births,
                  fadeDuration: STREAM_FADE_DURATION,
                  nowMs: renderNow,
                },
              ],
            ];

        const key = `${generatedId}-${block.startOffset}`;
        const blockNode = (
          <StreamdownBlock
            {...rest}
            components={components}
            rehypePlugins={plugins}
            remarkPlugins={remarkPlugins}
          >
            {block.content}
          </StreamdownBlock>
        );

        if (!profiler) {
          return (
            <StreamdownBlock
              {...rest}
              components={components}
              key={key}
              rehypePlugins={plugins}
              remarkPlugins={remarkPlugins}
            >
              {block.content}
            </StreamdownBlock>
          );
        }

        return (
          <Profiler
            id={`streamdown-block:${index}:${block.startOffset}`}
            key={key}
            onRender={handleBlockRender}
          >
            {blockNode}
          </Profiler>
        );
      })}
    </div>
  );

  if (!profiler) return content;

  return (
    <Profiler id={'streamdown-root'} onRender={handleRootRender}>
      {content}
    </Profiler>
  );
});

StreamdownRender.displayName = 'StreamdownRender';

export default StreamdownRender;
