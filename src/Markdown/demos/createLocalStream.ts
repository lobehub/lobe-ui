export interface ChunkInfo {
  content: string;
  delay: number;
  index: number;
}

interface LocalStreamControl {
  shouldPause?: () => boolean;
  signal?: AbortSignal;
}

export const delayFromTps = (chunkSize: number, tps: number) =>
  Math.max(1, Math.round((chunkSize / Math.max(tps, 0.001)) * 1000));

const sampleInt = (min: number, max: number) => {
  const lo = Math.min(min, max);
  const hi = Math.max(min, max);
  return Math.floor(Math.random() * (hi - lo + 1)) + lo;
};

const sampleRate = (min: number, max: number) => {
  const lo = Math.min(min, max);
  const hi = Math.max(min, max);
  return lo === hi ? lo : lo + Math.random() * (hi - lo);
};

export const createLocalStream = (
  content: string,
  chunkSizeMin: number,
  chunkSizeMax: number,
  tpsMin: number,
  tpsMax: number,
  onChunk: (chunk: ChunkInfo) => void,
  control: LocalStreamControl = {},
) => {
  const encoder = new TextEncoder();
  let currentPosition = 0;
  let chunkIndex = 0;
  const { shouldPause, signal } = control;

  const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
  const waitIfPaused = async () => {
    while (shouldPause?.()) {
      if (signal?.aborted) return;
      await sleep(50);
    }
  };

  return new ReadableStream({
    async start(controller) {
      while (currentPosition < content.length) {
        if (signal?.aborted) break;
        await waitIfPaused();
        if (signal?.aborted) break;

        const chunkSize = sampleInt(chunkSizeMin, chunkSizeMax);
        const delay = delayFromTps(chunkSize, sampleRate(tpsMin, tpsMax));
        const chunkContent = content.slice(currentPosition, currentPosition + chunkSize);

        await sleep(delay);
        if (signal?.aborted) break;
        await waitIfPaused();
        if (signal?.aborted) break;

        controller.enqueue(encoder.encode(chunkContent));

        onChunk({
          index: chunkIndex++,
          content: chunkContent,
          delay,
        });

        currentPosition += chunkSize;
      }
      controller.close();
    },
    cancel() {},
  });
};
