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
import {
  rehypeStreamAnimated,
  type StreamAnimatedRuntime,
} from '@/Markdown/plugins/rehypeStreamAnimated';
import { useStreamdownProfiler } from '@/Markdown/streamProfiler';
import { getNow } from '@/utils/getNow';
import { isDeepEqual } from '@/utils/isDeepEqual';

import { type BlockAnimationMeta, resolveBlockAnimationMeta } from './streamAnimationMeta';
import { styles } from './style';
import { countChars, useSmoothStreamContent } from './useSmoothStreamContent';
import { type BlockInfo, type BlockState, useStreamQueue } from './useStreamQueue';

const STREAM_FADE_DURATION = 280;

const isSamePlugin = (prevPlugin: Pluggable, nextPlugin: Pluggable): boolean => {
  const prevTuple = Array.isArray(prevPlugin) ? prevPlugin : [prevPlugin];
  const nextTuple = Array.isArray(nextPlugin) ? nextPlugin : [nextPlugin];

  if (prevTuple.length !== nextTuple.length) return false;
  if (prevTuple[0] !== nextTuple[0]) return false;

  return isDeepEqual(prevTuple.slice(1), nextTuple.slice(1));
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

interface BlockRuntime extends StreamAnimatedRuntime {
  charCount: number;
  charDelay?: number;
  rawLength: number;
  settled: boolean;
}

interface BlockPluginsCacheEntry {
  base: PluggableList;
  value: PluggableList;
}

interface UpdateBlockAnimationArgs {
  blocks: BlockInfo[];
  charDelay: number;
  getBlockState: (index: number) => BlockState;
  pluginsCache: Map<number, BlockPluginsCacheEntry>;
  renderNow: number;
  runtimes: Map<number, BlockRuntime>;
}

// Runs in the render phase: extends each visible block's birth timeline in
// place and resolves its animation meta in one pass. Mutations are
// idempotent for a given block content/length, so discarded or StrictMode
// double renders re-derive the same state.
const updateBlockAnimation = ({
  blocks,
  charDelay,
  getBlockState,
  pluginsCache,
  renderNow,
  runtimes,
}: UpdateBlockAnimationArgs): Map<number, BlockAnimationMeta> => {
  const blockAnimationMeta = new Map<number, BlockAnimationMeta>();
  const alive = new Set<number>();

  for (const [index, block] of blocks.entries()) {
    alive.add(block.startOffset);

    // Queued blocks are not rendered. Defer birth assignment so that
    // when the block later transitions to animating/streaming, its
    // chars start fading from that moment instead of having already
    // "aged out" of the fade window.
    const state = getBlockState(index);
    if (state === 'queued') continue;

    let runtime = runtimes.get(block.startOffset);
    if (!runtime) {
      runtime = { births: [], charCount: 0, rawLength: -1, settled: false, styles: [] };
      runtimes.set(block.startOffset, runtime);
    }

    if (runtime.rawLength !== block.content.length) {
      runtime.charCount = countChars(block.content);
      runtime.rawLength = block.content.length;
    }

    const blockCharCount = runtime.charCount;
    const births = runtime.births;

    if (births.length > blockCharCount) {
      // Block content shrunk (stream restart or upstream rewrite).
      births.length = blockCharCount;
      runtime.styles.length = blockCharCount;
    }

    if (births.length < blockCharCount) {
      // Chain each new char monotonically after the previous one so fades
      // never race out of order. Cap how far the fade queue can run ahead
      // of renderNow to prevent stream-faster-than-fade producing seconds
      // of invisible backlog at the tail.
      const cap = renderNow + STREAM_FADE_DURATION;
      for (let i = births.length; i < blockCharCount; i++) {
        const prevBirth = i > 0 ? births[i - 1] : renderNow - charDelay;
        const chained = prevBirth + charDelay;
        births.push(Math.min(cap, Math.max(chained, renderNow)));
      }
    }

    let meta: BlockAnimationMeta;
    if (runtime.settled) {
      // Settled is monotone: a revealed block's births are frozen, so once
      // its last fade completed it stays settled until the runtime is
      // pruned by a stream restart.
      meta = { charDelay: runtime.charDelay ?? charDelay, settled: true };
    } else {
      const lastBirthTs = births.length > 0 ? (births.at(-1) ?? renderNow) : renderNow;
      meta = resolveBlockAnimationMeta({
        currentCharDelay: charDelay,
        fadeDuration: STREAM_FADE_DURATION,
        lastElapsedMs: renderNow - lastBirthTs,
        previousCharDelay: runtime.charDelay,
        state,
      });
      runtime.settled = meta.settled;
    }
    runtime.charDelay = meta.charDelay;

    blockAnimationMeta.set(block.startOffset, meta);
  }

  for (const key of runtimes.keys()) {
    if (!alive.has(key)) {
      runtimes.delete(key);
      pluginsCache.delete(key);
    }
  }

  return blockAnimationMeta;
};

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
  const blockRuntimesRef = useRef<Map<number, BlockRuntime>>(new Map());
  const blockPluginsRef = useRef<Map<number, BlockPluginsCacheEntry>>(new Map());

  const renderNow = getNow();

  const animationStart = profiler ? getNow() : 0;
  const blockAnimationMeta = updateBlockAnimation({
    blocks,
    charDelay,
    getBlockState,
    pluginsCache: blockPluginsRef.current,
    renderNow,
    runtimes: blockRuntimesRef.current,
  });
  const blockAnimationDurationMs = profiler ? getNow() - animationStart : 0;

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
      durationMs: blockAnimationDurationMs,
      itemCount: blocks.length,
      name: 'block-births',
      textLength: processedContent.length,
    });
  }, [blockAnimationDurationMs, blocks.length, processedContent.length, profiler]);

  const resolveBlockPlugins = (startOffset: number, settled: boolean): PluggableList => {
    if (settled) return baseRehypePlugins;

    const cache = blockPluginsRef.current;
    const entry = cache.get(startOffset);
    if (entry && entry.base === baseRehypePlugins) {
      return entry.value;
    }

    const runtime = blockRuntimesRef.current.get(startOffset);
    const value: PluggableList = [
      ...baseRehypePlugins,
      [rehypeStreamAnimated, { fadeDuration: STREAM_FADE_DURATION, runtime }],
    ];
    cache.set(startOffset, { base: baseRehypePlugins, value });
    return value;
  };

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
        const animationMeta = blockAnimationMeta.get(block.startOffset);
        if (!animationMeta) return null;

        const plugins = resolveBlockPlugins(block.startOffset, animationMeta.settled);
        const key = `${generatedId}-${block.startOffset}`;

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
            <StreamdownBlock
              {...rest}
              components={components}
              rehypePlugins={plugins}
              remarkPlugins={remarkPlugins}
            >
              {block.content}
            </StreamdownBlock>
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
