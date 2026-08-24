import { useCallback, useEffect, useState } from 'react';

interface UseLocalStreamOptions {
  chunkSize: number;
  delayMs: number;
  jitter?: number;
  loop?: boolean;
}

const scatter = (value: number, jitter: number) =>
  value * (1 + (Math.random() * 2 - 1) * jitter);

export const useLocalStream = (
  content: string,
  { chunkSize, delayMs, jitter = 0.5, loop = false }: UseLocalStreamOptions,
) => {
  const [text, setText] = useState('');
  const [session, setSession] = useState(0);

  useEffect(() => {
    let position = 0;
    let timer: ReturnType<typeof setTimeout>;
    let cancelled = false;

    setText('');

    const tick = () => {
      if (cancelled) return;

      const size = Math.max(1, Math.round(scatter(chunkSize, jitter)));
      position = Math.min(content.length, position + size);
      setText(content.slice(0, position));

      if (position < content.length) {
        timer = setTimeout(tick, Math.max(1, scatter(delayMs, jitter)));
      } else if (loop) {
        timer = setTimeout(() => setSession((s) => s + 1), 3000);
      }
    };

    timer = setTimeout(tick, delayMs);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [content, chunkSize, delayMs, jitter, loop, session]);

  const restart = useCallback(() => setSession((s) => s + 1), []);

  return { restart, text };
};
