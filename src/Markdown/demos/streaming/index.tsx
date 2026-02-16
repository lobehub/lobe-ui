import { Button, Markdown } from '@lobehub/ui';
import { StoryBook, useControls, useCreateStore } from '@lobehub/ui/storybook';
import { folder } from 'leva';
import { useCallback, useEffect, useRef, useState } from 'react';

import { Flexbox } from '@/Flex';
import { type AnimationType } from '@/styles/animations';

import { markdownElements } from '../custom/plugins/MarkdownElements';
import { removeLineBreaksInAntArtifact } from '../custom/plugins/utils';
import { fullContent, fullContentCN } from './content';
import { type ChunkInfo, createLocalStream } from './createLocalStream';

const rehypePlugins = markdownElements.map((element) => element.rehypePlugin);
const components = Object.fromEntries(
  markdownElements.map((element) => [element.tag, element.Component]),
);

export default () => {
  const store = useCreateStore();
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
    streamAnimationType,
    streamAnimationWindowMs,
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
      streamAnimationWindowMs: {
        max: 500,
        min: 0,
        step: 50,
        value: 200,
      },
      streamAnimationType: {
        options: ['fadeIn', 'mask'] as const,
        value: 'fadeIn',
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
        value: false,
      },
      ReadableStream: folder(
        {
          chunkDelayMax: {
            max: 5000,
            min: 10,
            step: 10,
            value: 1000,
          },
          chunkDelayMin: {
            max: 1000,
            min: 5,
            step: 5,
            value: 20,
          },
          chunkSizeMax: {
            max: 200,
            min: 1,
            step: 1,
            value: 50,
          },
          chunkSizeMin: {
            max: 100,
            min: 1,
            step: 1,
            value: 3,
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

  const safeChildren = typeof children === 'string' ? children : '';

  const [streamedContent, setStreamedContent] = useState(safeChildren);
  const [isStreaming, setIsStreaming] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [chunks, setChunks] = useState<ChunkInfo[]>([]);
  const chunksEndRef = useRef<HTMLDivElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  const renderedContent = isStreaming ? streamedContent : safeChildren;

  useEffect(() => {
    chunksEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chunks.length]);

  const startReadableStreamStreaming = useCallback(async () => {
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setStreamedContent('');
    setChunks([]);
    setIsStreaming(true);

    try {
      const stream = createLocalStream(
        safeChildren,
        chunkSizeMin,
        chunkSizeMax,
        chunkDelayMin,
        chunkDelayMax,
        (chunk) => setChunks((prev) => [...prev, chunk]),
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
    }
  }, [safeChildren, chunkSizeMin, chunkSizeMax, chunkDelayMin, chunkDelayMax]);

  const restartStreaming = () => {
    if (useReadableStream) {
      startReadableStreamStreaming();
      return;
    }
    abortRef.current?.abort();
    setStreamedContent('');
    setIsStreaming(true);
    setIsPaused(false);
  };

  const togglePause = () => {
    setIsPaused(!isPaused);
  };

  // Local simulation streaming
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

      const newChunk = safeChildren.slice(currentPosition - chunkSize, currentPosition);
      console.log('delay', delay, newChunk);

      timerId = setTimeout(tick, delay);
    };

    timerId = setTimeout(
      tick,
      randomStreaming ? Math.floor(Math.random() * streamingSpeed) + 5 : streamingSpeed,
    );

    return () => clearTimeout(timerId);
  }, [
    safeChildren,
    streamingSpeed,
    randomStreaming,
    useReadableStream,
    isStreaming,
    isPaused,
    streamedContent.length,
  ]);

  return (
    <StoryBook levaStore={store}>
      <Flexbox
        gap={16}
        height={'100%'}
        width={'100%'}
        style={{
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
            disabled={!isStreaming || useReadableStream}
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
              }}
            >
              Stop
            </Button>
          )}
        </Flexbox>
        <Markdown
          animated={isStreaming}
          components={components}
          fullFeaturedCodeBlock={rest.fullFeaturedCodeBlock}
          rehypePlugins={rehypePlugins}
          streamAnimationType={streamAnimationType as AnimationType}
          streamAnimationWindowMs={streamAnimationWindowMs}
          variant="chat"
        >
          {removeLineBreaksInAntArtifact(renderedContent)}
        </Markdown>
      </Flexbox>
      {useReadableStream && chunks.length > 0 && (
        <Flexbox
          gap={0}
          style={{
            background: 'rgba(30, 30, 30, 0.95)',
            borderRadius: 8,
            bottom: 16,
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
            color: '#d4d4d4',
            fontFamily: 'monospace',
            fontSize: 12,
            maxHeight: 240,
            overflow: 'auto',
            padding: 12,
            position: 'fixed',
            right: 16,
            width: 420,
            zIndex: 1000,
          }}
        >
          <div style={{ color: '#888', marginBottom: 8 }}>
            Chunks: {chunks.length} | Total: {chunks.reduce((s, c) => s + c.content.length, 0)}{' '}
            chars
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
            <div ref={chunksEndRef} />
          </Flexbox>
        </Flexbox>
      )}
    </StoryBook>
  );
};
