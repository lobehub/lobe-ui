import { useCallback, useEffect, useState } from 'react';

interface UseLocalStreamOptions {
  chunkSize: number;
  delayMs?: number;
  jitter?: number;
  loop?: boolean;
  tps?: number;
  tpsMax?: number;
}

const scatter = (value: number, jitter: number) =>
  value * (1 + (Math.random() * 2 - 1) * jitter);

const delayFromTps = (chunkSize: number, tps: number) =>
  Math.max(1, Math.round((chunkSize / Math.max(tps, 0.001)) * 1000));

export const useLocalStream = (
  content: string,
  { chunkSize, delayMs = 24, jitter = 0.5, loop = false, tps, tpsMax }: UseLocalStreamOptions,
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
      const rate =
        tps == null
          ? null
          : tpsMax != null && tpsMax > tps
            ? tps + Math.random() * (tpsMax - tps)
            : tps;
      const wait =
        rate == null ? Math.max(1, scatter(delayMs, jitter)) : delayFromTps(size, rate);
      position = Math.min(content.length, position + size);
      setText(content.slice(0, position));

      if (position < content.length) {
        timer = setTimeout(tick, wait);
      } else if (loop) {
        timer = setTimeout(() => setSession((s) => s + 1), 3000);
      }
    };

    timer = setTimeout(tick, tps == null ? delayMs : delayFromTps(chunkSize, tps));

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [content, chunkSize, delayMs, jitter, loop, session, tps, tpsMax]);

  const restart = useCallback(() => setSession((s) => s + 1), []);

  return { restart, text };
};
