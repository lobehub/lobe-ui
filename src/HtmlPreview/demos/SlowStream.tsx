import { Button, HtmlPreview } from '@lobehub/ui';
import { useCallback, useEffect, useRef, useState } from 'react';

import { Flexbox } from '@/Flex';

import { chinaTimelineHtml } from './chinaTimelineHtml';

// Simulate DeepSeek-class output speed (~30 tps × ~5 chars/token ≈
// 150 cps). On this rate, the document's ~4 KB inline `<style>` block
// takes ~25 s to fully stream — long enough that without an in-flight
// progress signal the user would just stare at a spinner. The loading
// state in HtmlPreview now streams the raw source dimly so the wait is
// at least informative.
const CHUNK = 4;
const TICK_MS = 26;

export default () => {
  const [streamed, setStreamed] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const stop = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = null;
    setIsStreaming(false);
  }, []);

  const start = useCallback(() => {
    stop();
    setStreamed('');
    setIsStreaming(true);
    let pos = 0;
    const tick = () => {
      pos = Math.min(pos + CHUNK, chinaTimelineHtml.length);
      setStreamed(chinaTimelineHtml.slice(0, pos));
      if (pos >= chinaTimelineHtml.length) {
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
      <HtmlPreview animated={isStreaming} defaultHeight={420}>
        {streamed}
      </HtmlPreview>
    </Flexbox>
  );
};
