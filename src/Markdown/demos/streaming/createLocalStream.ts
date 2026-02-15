export interface ChunkInfo {
  content: string;
  delay: number;
  index: number;
}

export const createLocalStream = (
  text: string,
  chunkSizeMin: number,
  chunkSizeMax: number,
  delayMin: number,
  delayMax: number,
  onChunk?: (chunk: ChunkInfo) => void,
) => {
  const encoder = new TextEncoder();
  let position = 0;
  let index = 0;

  return new ReadableStream({
    pull(controller) {
      return new Promise((resolve) => {
        const delay = Math.floor(Math.random() * (delayMax - delayMin + 1)) + delayMin;
        setTimeout(() => {
          if (position >= text.length) {
            controller.close();
            resolve();
            return;
          }
          const size = Math.floor(Math.random() * (chunkSizeMax - chunkSizeMin + 1)) + chunkSizeMin;
          const chunk = text.slice(position, position + size);
          position += size;
          controller.enqueue(encoder.encode(chunk));
          onChunk?.({ content: chunk, delay, index: index++ });
          resolve();
        }, delay);
      });
    },
  });
};
