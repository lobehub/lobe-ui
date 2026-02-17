import { useCallback, useEffect, useRef, useState } from 'react';

import { STREAM_ANIMATION_LIMITS } from './streamAnimation.constants';

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
    flushedLengthRef.current = nextContent.length;
    setWindowedContent(nextContent.slice(0, nextContent.length));
  }, []);

  const scheduleFlush = useCallback(() => {
    if (!enabled || timerRef.current) return;

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
