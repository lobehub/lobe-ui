import { useEffect, useRef, useState } from 'react';

const DEFAULT_STREAM_WINDOW_MS = 200;

export const useWindowedStreamContent = (
  content: string,
  windowMs: number = DEFAULT_STREAM_WINDOW_MS,
): string => {
  const [windowedContent, setWindowedContent] = useState(content);
  const pendingContentRef = useRef(content);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const windowStartRef = useRef<number | null>(null);

  useEffect(() => {
    pendingContentRef.current = content;

    if (content === windowedContent) return;

    const isAppendUpdate =
      content.length >= windowedContent.length && content.startsWith(windowedContent);

    if (!isAppendUpdate || windowMs <= 0) {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }

      windowStartRef.current = null;
      setWindowedContent(content);
      return;
    }

    if (timerRef.current) return;

    const now = Date.now();
    const windowStart = windowStartRef.current ?? now;
    windowStartRef.current = windowStart;

    const delay = Math.max(windowMs - (now - windowStart), 0);
    timerRef.current = setTimeout(() => {
      timerRef.current = null;
      windowStartRef.current = null;
      setWindowedContent(pendingContentRef.current);
    }, delay);
  }, [content, windowMs, windowedContent]);

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  return windowedContent;
};
