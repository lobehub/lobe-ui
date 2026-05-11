import { Button, HtmlPreview, type HtmlPreviewStreamingMode, Segmented } from '@lobehub/ui';
import { useCallback, useEffect, useRef, useState } from 'react';

import { Flexbox } from '@/Flex';

import { html } from './data';

const CHUNK_SIZE = 14;
const TICK_MS = 24;

export default () => {
  const [streamed, setStreamed] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamingMode, setStreamingMode] = useState<HtmlPreviewStreamingMode>('auto');
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const stop = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    setIsStreaming(false);
  }, []);

  const start = useCallback(() => {
    stop();
    setStreamed('');
    setIsStreaming(true);

    let pos = 0;
    const tick = () => {
      pos = Math.min(pos + CHUNK_SIZE, html.length);
      setStreamed(html.slice(0, pos));
      if (pos >= html.length) {
        setIsStreaming(false);
        return;
      }
      timerRef.current = setTimeout(tick, TICK_MS);
    };
    timerRef.current = setTimeout(tick, TICK_MS);
  }, [stop]);

  useEffect(() => start(), [start]);
  useEffect(() => () => stop(), [stop]);

  return (
    <Flexbox gap={12} style={{ width: '100%' }}>
      <Flexbox horizontal align={'center'} gap={8} justify={'space-between'}>
        <Flexbox horizontal gap={8}>
          <Button loading={isStreaming} type={'primary'} onClick={start}>
            {isStreaming ? 'Streaming…' : 'Restart streaming'}
          </Button>
          {isStreaming && (
            <Button danger onClick={stop}>
              Stop
            </Button>
          )}
        </Flexbox>
        <Segmented
          size={'small'}
          value={streamingMode}
          options={[
            { label: 'auto', value: 'auto' },
            { label: 'live', value: 'live' },
            { label: 'defer', value: 'defer' },
          ]}
          onChange={(v) => setStreamingMode(v as HtmlPreviewStreamingMode)}
        />
      </Flexbox>
      <HtmlPreview
        animated={isStreaming}
        defaultHeight={360}
        streamingMode={streamingMode}
        theme={'light'}
      >
        {streamed}
      </HtmlPreview>
    </Flexbox>
  );
};
