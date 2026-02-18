import { useCallback, useEffect, useRef, useState } from 'react';

import { STREAM_ANIMATION_LIMITS } from './streamAnimation.constants';
import { streamAnimationDebugLog } from './streamAnimation.debug';

interface UseWindowedStreamContentOptions {
  enabled: boolean;
  windowMs: number;
}

export const useWindowedStreamContent = (
  content: string,
  { enabled, windowMs }: UseWindowedStreamContentOptions,
) => {
  const normalizedWindowMs = Math.max(STREAM_ANIMATION_LIMITS.minWindowMs, windowMs);
  const [windowedContent, setWindowedContent] = useState(content);
  const latestContentRef = useRef(content);
  const flushedLengthRef = useRef(content.length);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const stopTimer = useCallback(() => {
    if (!timerRef.current) return;
    clearTimeout(timerRef.current);
    timerRef.current = null;
  }, []);

  const flushLatestContent = useCallback(() => {
    const nextContent = latestContentRef.current;
    const previousLength = flushedLengthRef.current;
    flushedLengthRef.current = nextContent.length;
    setWindowedContent(nextContent.slice(0, nextContent.length));
    streamAnimationDebugLog('window:flush', {
      delta: nextContent.length - previousLength,
      nextLength: nextContent.length,
      previousLength,
    });
  }, []);

  const scheduleFlush = useCallback(() => {
    if (!enabled || timerRef.current) return;

    streamAnimationDebugLog('window:schedule', {
      latestLength: latestContentRef.current.length,
      flushedLength: flushedLengthRef.current,
      windowMs: normalizedWindowMs,
    });

    timerRef.current = setTimeout(() => {
      timerRef.current = null;

      if (!enabled) return;
      if (latestContentRef.current.length <= flushedLengthRef.current) return;

      flushLatestContent();
    }, normalizedWindowMs);
  }, [enabled, normalizedWindowMs, flushLatestContent]);

  useEffect(() => {
    latestContentRef.current = content;

    if (!enabled) {
      stopTimer();
      flushLatestContent();
      return;
    }

    if (content.length < flushedLengthRef.current || !content.startsWith(windowedContent)) {
      streamAnimationDebugLog('window:reset', {
        contentLength: content.length,
        flushedLength: flushedLengthRef.current,
        windowedLength: windowedContent.length,
      });
      stopTimer();
      flushLatestContent();
      return;
    }

    if (content.length > flushedLengthRef.current) {
      scheduleFlush();
    }
  }, [content, enabled, flushLatestContent, scheduleFlush, stopTimer, windowedContent]);

  useEffect(() => stopTimer, [stopTimer]);

  return windowedContent;
};
