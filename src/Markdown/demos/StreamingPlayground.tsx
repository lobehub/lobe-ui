import { Button, Markdown } from '@lobehub/ui';
import { StoryBook, useControls, useCreateStore } from '@lobehub/ui/storybook';
import { folder } from 'leva';
import {
  type CSSProperties,
  type RefObject,
  startTransition,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';

import { Flexbox } from '@/Flex';

import {
  createStreamdownProfiler,
  StreamdownProfilerPanel,
  StreamdownProfilerProvider,
} from '../streamProfiler';
import { type StreamSmoothingPreset } from '../type';
import { fullContent, fullContentCN } from './content';
import { type ChunkInfo, createLocalStream } from './createLocalStream';
import { markdownElements } from './custom/plugins/MarkdownElements';
import { removeLineBreaksInAntArtifact } from './custom/plugins/utils';

const rehypePlugins = markdownElements.map((element) => element.rehypePlugin);
const components = Object.fromEntries(
  markdownElements.map((element) => [element.tag, element.Component]),
);

const chunkPanelStyle: CSSProperties = {
  background: 'rgba(30, 30, 30, 0.95)',
  borderRadius: 8,
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
  color: '#d4d4d4',
  fontFamily: 'monospace',
  fontSize: 12,
  maxHeight: 240,
  overflow: 'auto',
  padding: 12,
  zIndex: 1000,
};

interface ChunkPanelProps {
  chunks: ChunkInfo[];
  floating?: boolean;
  innerRef?: RefObject<HTMLDivElement | null>;
}

const ChunkPanel = ({ chunks, floating = false, innerRef }: ChunkPanelProps) => {
  return (
    <Flexbox
      gap={0}
      style={{
        ...chunkPanelStyle,
        bottom: floating ? 16 : undefined,
        marginTop: floating ? 0 : 16,
        position: floating ? 'fixed' : 'relative',
        right: floating ? 16 : undefined,
        width: floating ? 420 : '100%',
      }}
    >
      <div style={{ color: '#888', marginBottom: 8 }}>
        Chunks: {chunks.length} | Total:{' '}
        {chunks.reduce((sum, chunk) => sum + chunk.content.length, 0)} chars
      </div>
      <Flexbox gap={2}>
        {chunks.map((chunk) => (
          <div key={chunk.index} style={{ display: 'flex', gap: 8, lineHeight: 1.6 }}>
            <span style={{ color: '#6a9955', minWidth: 40 }}>#{chunk.index}</span>
            <span style={{ color: '#569cd6', minWidth: 56 }}>{chunk.delay}ms</span>
            <span style={{ color: '#ce9178', flex: 1, wordBreak: 'break-all' }}>
              {JSON.stringify(chunk.content)}
            </span>
          </div>
        ))}
        <div ref={innerRef} />
      </Flexbox>
    </Flexbox>
  );
};

export interface StreamingPlaygroundProps {
  defaultShowProfiler?: boolean;
}

export const StreamingPlayground = ({ defaultShowProfiler = false }: StreamingPlaygroundProps) => {
  const store = useCreateStore();
  const profilerRef = useRef(
    createStreamdownProfiler({
      label: defaultShowProfiler ? 'streaming-profiler-demo' : 'streaming-demo',
    }),
  );
  const profiler = profilerRef.current;

  const {
    children,
    streamingSpeed,
    randomStreaming,
    useReadableStream,
    chunkSizeMin,
    chunkSizeMax,
    chunkDelayMin,
    chunkDelayMax,
    language,
    streamSmoothingPreset,
    streamDebug,
    showProfilerPanel,
    resetProfilerOnRestart,
    ...rest
  } = useControls(
    {
      language: {
        options: ['en-US', 'zh-CN'],
        value: 'en-US',
      },
      children: {
        rows: true,
        value: fullContent,
      },
      streamDebug: {
        value: false,
      },
      showProfilerPanel: {
        value: defaultShowProfiler,
      },
      resetProfilerOnRestart: {
        value: true,
      },
      fullFeaturedCodeBlock: {
        value: true,
      },
      randomStreaming: {
        value: false,
      },
      streamingSpeed: {
        max: 100,
        min: 5,
        step: 5,
        value: 25,
      },
      useReadableStream: {
        value: true,
      },
      streamSmoothingPreset: {
        options: ['realtime', 'balanced', 'silky'],
        value: 'balanced',
      },
      ReadableStream: folder(
        {
          chunkDelayMax: {
            max: 5000,
            min: 10,
            step: 10,
            value: 120,
          },
          chunkDelayMin: {
            max: 1000,
            min: 5,
            step: 5,
            value: 35,
          },
          chunkSizeMax: {
            max: 200,
            min: 1,
            step: 1,
            value: 8,
          },
          chunkSizeMin: {
            max: 100,
            min: 1,
            step: 1,
            value: 2,
          },
        },
        { render: (get) => get('useReadableStream') },
      ),
    },
    { store },
  );

  useEffect(() => {
    store.set({ children: language === 'zh-CN' ? fullContentCN : fullContent }, true);
  }, [language, store]);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    (
      window as Window & { __LOBE_MARKDOWN_STREAM_DEBUG__?: boolean }
    ).__LOBE_MARKDOWN_STREAM_DEBUG__ = streamDebug;
  }, [streamDebug]);

  const safeChildren = typeof children === 'string' ? children : '';
  const safeSmoothingPreset: StreamSmoothingPreset =
    streamSmoothingPreset === 'realtime' ||
    streamSmoothingPreset === 'balanced' ||
    streamSmoothingPreset === 'silky'
      ? streamSmoothingPreset
      : 'balanced';

  const [streamedContent, setStreamedContent] = useState(safeChildren);
  const [isStreaming, setIsStreaming] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [chunks, setChunks] = useState<ChunkInfo[]>([]);
  const chunksEndRef = useRef<HTMLDivElement>(null);
  const abortRef = useRef<AbortController | null>(null);
  const isPausedRef = useRef(false);

  const renderedContent = isStreaming ? streamedContent : safeChildren;

  const resetProfiler = useCallback(
    (reason: string) => {
      profiler.reset(
        `${useReadableStream ? 'readable-stream' : 'timer'}:${safeSmoothingPreset}:${reason}`,
      );
    },
    [profiler, safeSmoothingPreset, useReadableStream],
  );

  useEffect(() => {
    if (!showProfilerPanel) return;

    resetProfiler('panel-enabled');
  }, [resetProfiler, showProfilerPanel]);

  useEffect(() => {
    chunksEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chunks.length]);

  useEffect(() => {
    isPausedRef.current = isPaused;
  }, [isPaused]);

  const activeProfiler = showProfilerPanel ? profiler : null;

  const startReadableStreamStreaming = useCallback(async () => {
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    if (showProfilerPanel && resetProfilerOnRestart) {
      resetProfiler('readable-stream-start');
    }

    setStreamedContent('');
    setChunks([]);
    setIsStreaming(true);
    setIsPaused(false);
    isPausedRef.current = false;

    try {
      const stream = createLocalStream(
        safeChildren,
        chunkSizeMin,
        chunkSizeMax,
        chunkDelayMin,
        chunkDelayMax,
        (chunk) => {
          startTransition(() => {
            setChunks((prev) => [...prev, chunk]);
          });
        },
        {
          shouldPause: () => isPausedRef.current,
          signal: controller.signal,
        },
      );
      const reader = stream.getReader();
      const decoder = new TextDecoder();
      let accumulated = '';

      while (!controller.signal.aborted) {
        const { done, value } = await reader.read();
        if (done) break;

        accumulated += decoder.decode(value, { stream: true });
        setStreamedContent(accumulated);
      }

      if (controller.signal.aborted) {
        await reader.cancel();
      }
    } finally {
      setIsStreaming(false);
      setIsPaused(false);
    }
  }, [
    chunkDelayMax,
    chunkDelayMin,
    chunkSizeMax,
    chunkSizeMin,
    resetProfiler,
    resetProfilerOnRestart,
    safeChildren,
    showProfilerPanel,
  ]);

  const restartStreaming = () => {
    if (showProfilerPanel && resetProfilerOnRestart) {
      resetProfiler('manual-restart');
    }

    if (useReadableStream) {
      startReadableStreamStreaming();
      return;
    }

    abortRef.current?.abort();
    setStreamedContent('');
    setChunks([]);
    setIsStreaming(true);
    setIsPaused(false);
    isPausedRef.current = false;
  };

  const togglePause = () => {
    setIsPaused((prev) => {
      const next = !prev;
      isPausedRef.current = next;
      return next;
    });
  };

  useEffect(() => {
    if (useReadableStream || !isStreaming || isPaused) return;

    let currentPosition = streamedContent.length;
    let timerId: ReturnType<typeof setTimeout>;

    const tick = () => {
      if (currentPosition >= safeChildren.length) {
        setIsStreaming(false);
        return;
      }

      const chunkSize = randomStreaming
        ? Math.min(Math.floor(Math.random() * 8) + 1, safeChildren.length - currentPosition)
        : Math.min(3, safeChildren.length - currentPosition);

      currentPosition += chunkSize;
      setStreamedContent(safeChildren.slice(0, currentPosition));

      const delay = randomStreaming
        ? Math.floor(Math.random() * streamingSpeed * 2) + 5
        : streamingSpeed;

      timerId = setTimeout(tick, delay);
    };

    timerId = setTimeout(
      tick,
      randomStreaming ? Math.floor(Math.random() * streamingSpeed) + 5 : streamingSpeed,
    );

    return () => clearTimeout(timerId);
  }, [
    isPaused,
    isStreaming,
    randomStreaming,
    safeChildren,
    streamedContent.length,
    streamingSpeed,
    useReadableStream,
  ]);

  const markdownNode = (
    <Markdown
      animated={isStreaming}
      components={components}
      fullFeaturedCodeBlock={rest.fullFeaturedCodeBlock}
      rehypePlugins={rehypePlugins}
      streamSmoothingPreset={safeSmoothingPreset}
      variant="chat"
    >
      {removeLineBreaksInAntArtifact(renderedContent)}
    </Markdown>
  );

  const showInlineChunkPanel = showProfilerPanel && useReadableStream && chunks.length > 0;

  return (
    <StoryBook levaStore={store}>
      <div
        style={{
          display: 'grid',
          gap: 16,
          gridTemplateColumns: showProfilerPanel ? 'minmax(0, 1.7fr) minmax(320px, 420px)' : '1fr',
          height: '100%',
          overflow: 'auto',
          width: '100%',
        }}
      >
        <Flexbox
          gap={16}
          style={{
            minWidth: 0,
            overflow: 'auto',
          }}
        >
          <Flexbox direction="horizontal" gap={8}>
            <Button
              block
              loading={!isPaused && isStreaming}
              type={'primary'}
              onClick={restartStreaming}
            >
              {useReadableStream ? 'Start ReadableStream' : 'Restart Streaming'}
            </Button>
            <Button
              block
              disabled={!isStreaming}
              type={isPaused ? 'default' : 'primary'}
              onClick={togglePause}
            >
              {isPaused ? 'Resume' : 'Pause'}
            </Button>
            {useReadableStream && isStreaming && (
              <Button
                block
                danger
                onClick={() => {
                  abortRef.current?.abort();
                  setIsStreaming(false);
                  setIsPaused(false);
                }}
              >
                Stop
              </Button>
            )}
          </Flexbox>

          {activeProfiler ? (
            <StreamdownProfilerProvider profiler={activeProfiler}>
              {markdownNode}
            </StreamdownProfilerProvider>
          ) : (
            markdownNode
          )}
        </Flexbox>

        {showProfilerPanel && (
          <div style={{ minWidth: 0 }}>
            <StreamdownProfilerPanel profiler={activeProfiler} />
          </div>
        )}
      </div>

      {!showInlineChunkPanel && useReadableStream && chunks.length > 0 && (
        <ChunkPanel floating chunks={chunks} innerRef={chunksEndRef} />
      )}
    </StoryBook>
  );
};

export default StreamingPlayground;
