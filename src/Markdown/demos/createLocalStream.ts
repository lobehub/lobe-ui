export interface ChunkInfo {
  content: string;
  delay: number;
  index: number;
}

interface LocalStreamControl {
  shouldPause?: () => boolean;
  signal?: AbortSignal;
}

export const createLocalStream = (
  content: string,
  chunkSizeMin: number,
  chunkSizeMax: number,
  chunkDelayMin: number,
  chunkDelayMax: number,
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

        // Calculate random chunk size and delay
        const chunkSize =
          Math.floor(Math.random() * (chunkSizeMax - chunkSizeMin + 1)) + chunkSizeMin;
        const delay =
          Math.floor(Math.random() * (chunkDelayMax - chunkDelayMin + 1)) + chunkDelayMin;

        // Get chunk content
        const chunkContent = content.slice(currentPosition, currentPosition + chunkSize);

        // Wait for delay
        await sleep(delay);
        if (signal?.aborted) break;
        await waitIfPaused();
        if (signal?.aborted) break;

        // Enqueue chunk
        const encodedChunk = encoder.encode(chunkContent);
        controller.enqueue(encodedChunk);

        // Notify chunk info
        onChunk({
          index: chunkIndex++,
          content: chunkContent,
          delay,
        });

        currentPosition += chunkSize;
      }
      controller.close();
    },
    cancel() {
      // Optional: Handle cancellation if needed
    },
  });
};
