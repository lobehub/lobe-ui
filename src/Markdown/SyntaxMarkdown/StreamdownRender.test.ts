import { describe, expect, it } from 'vitest';

import { updateBlockAnimation } from './StreamdownRender';
import { STREAM_FADE_DURATION } from './style';

type BlockRuntimes = Parameters<typeof updateBlockAnimation>[0]['runtimes'];

const createArgs = (content: string, initialContent?: string) => {
  const runtimes: BlockRuntimes = new Map();
  const renderNow = 1_000;

  updateBlockAnimation({
    blocks: [{ content, startOffset: 0 }],
    charDelay: 20,
    getBlockState: () => 'streaming',
    initialContent,
    pluginsCache: new Map(),
    renderNow,
    revealClock: { lastTs: 900 },
    runtimes,
  });

  return { renderNow, runtimes };
};

describe('updateBlockAnimation', () => {
  it('marks the initial content as already revealed and animates only the new suffix', () => {
    const { renderNow, runtimes } = createArgs('Hello world', 'Hello');
    const runtime = runtimes.get(0)!;

    expect(runtime.births).toHaveLength(11);
    expect(runtime.births.slice(0, 5)).toEqual(Array.from({length: 5}).fill(renderNow - STREAM_FADE_DURATION));
    expect(runtime.births.slice(5).every((birth) => birth >= renderNow)).toBe(true);
  });

  it('adds births only for content appended after the initial baseline', () => {
    const { renderNow, runtimes } = createArgs('Hello world', 'Hello');
    const runtime = runtimes.get(0)!;
    const existingBirths = [...runtime.births];

    updateBlockAnimation({
      blocks: [{ content: 'Hello world!', startOffset: 0 }],
      charDelay: 20,
      getBlockState: () => 'streaming',
      initialContent: 'Hello',
      pluginsCache: new Map(),
      renderNow: renderNow + 40,
      revealClock: { lastTs: renderNow },
      runtimes,
    });

    expect(runtime.births.slice(0, -1)).toEqual(existingBirths);
    expect(runtime.births.at(-1)).toBeGreaterThanOrEqual(renderNow + 40);
  });

  it('keeps the current behavior when no initial content is provided', () => {
    const { renderNow, runtimes } = createArgs('Hello');

    expect(runtimes.get(0)!.births.every((birth) => birth >= renderNow)).toBe(true);
  });

  it('does not prefill births when initial content is not a prefix', () => {
    const { renderNow, runtimes } = createArgs('Hello world', 'Hola');

    expect(runtimes.get(0)!.births.every((birth) => birth >= renderNow)).toBe(true);
  });
});
