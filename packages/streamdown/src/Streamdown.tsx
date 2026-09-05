'use client';

import {
  memo,
  Profiler,
  type ProfilerOnRenderCallback,
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from 'react';
import { type Options } from 'react-markdown';
import type { Pluggable, PluggableList } from 'unified';

import { createBlockLexer } from './blockLexer';
import { CachedMarkdown } from './CachedMarkdown';
import { getNow, isDeepEqual, useStableValue } from './internal';
import { isLastFormulaRenderable } from './latex';
import { useStreamdownProfiler } from './profiler';
import { rehypeStreamAnimated, type StreamAnimatedRuntime } from './rehypeStreamAnimated';
import { type BlockAnimationMeta, resolveBlockAnimationMeta } from './streamAnimationMeta';
import { STREAM_TAIL_TAG, StreamTail } from './StreamTail';
import { STREAM_FADE_DURATION, STREAMDOWN_ANIMATED_CLASS, StreamdownStyles } from './styles';
import { type StreamAnimationGranularity, type StreamSmoothingPreset } from './types';
import { countChars, useSmoothStreamContent } from './useSmoothStreamContent';
import { type BlockInfo, type BlockState, useStreamQueue } from './useStreamQueue';

const EMPTY_PLUGINS: PluggableList = [];

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
    return <CachedMarkdown {...rest}>{children}</CachedMarkdown>;
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
  granularity: StreamAnimationGranularity;
  value: PluggableList;
}

interface UpdateBlockAnimationArgs {
  blocks: BlockInfo[];
  charDelay: number;
  getBlockState: (index: number) => BlockState;
  pluginsCache: Map<number, BlockPluginsCacheEntry>;
  renderNow: number;
  revealClock: { lastTs: number };
  runtimes: Map<number, BlockRuntime>;
}

const MIN_STREAM_CHAR_PACE_MS = 2;
const MAX_REVEAL_GAP_MS = 160;

// Runs in the render phase: refreshes each visible block's birth pacing in
// place and resolves its animation meta in one pass. Births themselves are
// assigned lazily by rehypeStreamAnimated per *rendered* char, because the
// raw markdown length over-counts (link URLs, emphasis markers) and indexing
// births by raw offset made chars after such syntax look already faded.
// Mutations are idempotent for a given block content/length, so discarded
// or StrictMode double renders re-derive the same state.
const updateBlockAnimation = ({
  blocks,
  charDelay,
  getBlockState,
  pluginsCache,
  renderNow,
  revealClock,
  runtimes,
}: UpdateBlockAnimationArgs): Map<number, BlockAnimationMeta> => {
  const blockAnimationMeta = new Map<number, BlockAnimationMeta>();
  const alive = new Set<number>();
  let revealedNewChars = false;

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
      runtime = { births: [], charCount: 0, rawLength: -1, settled: false, skipped: [] };
      runtimes.set(block.startOffset, runtime);
    }

    const births = runtime.births;

    if (runtime.rawLength !== block.content.length) {
      const nextCharCount = countChars(block.content);
      if (nextCharCount < runtime.charCount) {
        // Block content shrunk. Usually just marked dropping a paragraph's
        // trailing "\n" once the blank line completes, so only births past
        // the new raw length are stale; wiping them all would replay the
        // fade of every char in the block.
        births.length = Math.min(births.length, nextCharCount);
        runtime.skipped.length = births.length;
      }

      // Chain each new char monotonically after the previous one so fades
      // never race out of order. Cap how far the fade queue can run ahead
      // of "now" to prevent stream-faster-than-fade producing seconds of
      // invisible backlog at the tail.
      //
      // The streaming tail paces its stagger from the observed reveal-commit
      // gap instead of the queue's fixed charDelay: a commit's chars are
      // spread to land exactly until the next commit arrives, so the flow
      // stays per-char continuous no matter how far apart the throttled
      // commits are.
      const newChars = Math.max(1, nextCharCount - runtime.charCount);
      let pace = charDelay;
      let capMs = STREAM_FADE_DURATION;
      if (state === 'streaming') {
        revealedNewChars = true;
        const gapMs = Math.min(Math.max(renderNow - revealClock.lastTs, 16), MAX_REVEAL_GAP_MS);
        pace = Math.min(charDelay, Math.max(gapMs / newChars, MIN_STREAM_CHAR_PACE_MS));
        capMs = gapMs + STREAM_FADE_DURATION;
      }
      runtime.pacing = { capMs, pace };
      runtime.charCount = nextCharCount;
      runtime.rawLength = block.content.length;
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

  if (revealedNewChars) {
    revealClock.lastTs = renderNow;
  }

  for (const key of runtimes.keys()) {
    if (!alive.has(key)) {
      runtimes.delete(key);
      pluginsCache.delete(key);
    }
  }

  return blockAnimationMeta;
};

interface StreamdownBlocksProps {
  content: string;
  granularity: StreamAnimationGranularity;
  markdownOptions: Omit<Options, 'children'>;
  tailUnitsRef: { current: number };
}

const StreamdownBlocks = memo<StreamdownBlocksProps>(
  ({ content: smoothedContent, granularity, markdownOptions, tailUnitsRef }) => {
    const profiler = useStreamdownProfiler();
    const { components: baseComponents, ...rest } = markdownOptions;
    const baseRehypePlugins = useStablePlugins(markdownOptions.rehypePlugins ?? EMPTY_PLUGINS);
    const remarkPlugins = useStablePlugins(markdownOptions.remarkPlugins ?? EMPTY_PLUGINS);
    const generatedId = useId();
    const [lexBlocks] = useState(createBlockLexer);

    const components = useMemo<Options['components']>(
      () => ({ ...baseComponents, [STREAM_TAIL_TAG]: StreamTail }) as Options['components'],
      [baseComponents],
    );

    const blocksResult = useMemo(() => {
      const start = profiler ? getNow() : 0;
      const value = lexBlocks(smoothedContent);

      return {
        durationMs: profiler ? getNow() - start : 0,
        value,
      };
    }, [lexBlocks, profiler, smoothedContent]);
    const { blocks, processed: processedContent } = blocksResult.value;
    tailUnitsRef.current = blocks.at(-1)?.content.length ?? 0;

    const { getBlockState, charDelay } = useStreamQueue(blocks);
    const blockRuntimesRef = useRef<Map<number, BlockRuntime>>(new Map());
    const blockPluginsRef = useRef<Map<number, BlockPluginsCacheEntry>>(new Map());
    const revealClockRef = useRef<{ lastTs: number }>({ lastTs: 0 });

    const renderNow = getNow();

    const animationStart = profiler ? getNow() : 0;
    const blockAnimationMeta = updateBlockAnimation({
      blocks,
      charDelay,
      getBlockState,
      pluginsCache: blockPluginsRef.current,
      renderNow,
      revealClock: revealClockRef.current,
      runtimes: blockRuntimesRef.current,
    });
    const blockAnimationDurationMs = profiler ? getNow() - animationStart : 0;

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
      if (entry && entry.base === baseRehypePlugins && entry.granularity === granularity) {
        return entry.value;
      }

      const runtime = blockRuntimesRef.current.get(startOffset);
      const value: PluggableList = [
        ...baseRehypePlugins,
        [
          rehypeStreamAnimated,
          {
            fadeDuration: STREAM_FADE_DURATION,
            granularity,
            runtime,
          },
        ],
      ];
      cache.set(startOffset, {
        base: baseRehypePlugins,
        granularity,
        value,
      });
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
      <div className={STREAMDOWN_ANIMATED_CLASS}>
        <StreamdownStyles />
        {blocks.map((block: BlockInfo, index) => {
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
  },
);

StreamdownBlocks.displayName = 'StreamdownBlocks';

// Holds the last content whose trailing formula was renderable, so a
// half-streamed `$$...` block keeps showing the previous valid frame
// instead of flashing raw LaTeX source or a KaTeX parse error.
const useLatexGuard = (content: string, enabled: boolean): string => {
  const validRef = useRef('');

  if (!enabled) return content;

  if (isLastFormulaRenderable(content)) {
    validRef.current = content;
    return content;
  }

  return validRef.current || content;
};

export interface StreamdownProps extends Omit<Options, 'children'> {
  content: string;
  granularity?: StreamAnimationGranularity;
  /**
   * Hold the previous frame while the trailing LaTeX formula is still
   * incomplete, preventing raw-source flashes mid-stream. Enable when the
   * pipeline renders math (remark-math + rehype-katex).
   */
  latexGuard?: boolean;
  preprocess?: (text: string) => string;
  smoothing?: StreamSmoothingPreset;
}

// The outer component absorbs the upstream per-chunk prop churn: every
// streamed chunk re-renders it, but it only feeds the smoother and renders
// a memoized child keyed on the smoother's output — so the expensive block
// pipeline runs per reveal commit, not per chunk AND per commit.
export const Streamdown = memo<StreamdownProps>(
  ({ content, granularity = 'char', latexGuard = false, preprocess, smoothing, ...rest }) => {
    const preprocessed = useMemo(
      () => (preprocess ? preprocess(content) : content),
      [content, preprocess],
    );
    const guardedContent = useLatexGuard(preprocessed, latexGuard);
    const tailUnitsRef = useRef(0);
    const smoothedContent = useSmoothStreamContent(guardedContent, {
      preset: smoothing ?? 'balanced',
      tailUnitsRef,
    });
    const markdownOptions = useStableValue(rest);

    return (
      <StreamdownBlocks
        content={smoothedContent}
        granularity={granularity}
        markdownOptions={markdownOptions}
        tailUnitsRef={tailUnitsRef}
      />
    );
  },
);

Streamdown.displayName = 'Streamdown';

export default Streamdown;
