export interface ChunkInfo {
  index: number;
  content: string;
  delay: number;
}

export const createLocalStream = (
  content: string,
  chunkSizeMin: number,
  chunkSizeMax: number,
  chunkDelayMin: number,
  chunkDelayMax: number,
  onChunk: (chunk: ChunkInfo) => void
) => {
  const encoder = new TextEncoder();
  let currentPosition = 0;
  let chunkIndex = 0;

  return new ReadableStream({
    async start(controller) {
      while (currentPosition < content.length) {
        // Calculate random chunk size and delay
        const chunkSize =
          Math.floor(Math.random() * (chunkSizeMax - chunkSizeMin + 1)) + chunkSizeMin;
        const delay =
          Math.floor(Math.random() * (chunkDelayMax - chunkDelayMin + 1)) + chunkDelayMin;

        // Get chunk content
        const chunkContent = content.slice(currentPosition, currentPosition + chunkSize);
        
        // Wait for delay
        await new Promise((resolve) => setTimeout(resolve, delay));

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
    }
  });
};
