import { describe, expect, it } from 'vitest';

import { preprocessMarkdownContent } from '@/hooks/useMarkdown/utils';

import { getInitialRevealedChars, updateBlockAnimation } from './StreamdownRender';
import { STREAM_FADE_DURATION } from './style';

type BlockRuntimes = Parameters<typeof updateBlockAnimation>[0]['runtimes'];

const createArgs = (
  content: string,
  initialContent?: string,
  initialRevealedChars?: Map<number, number>,
  renderedCharCounts?: Map<number, number>,
) => {
  const runtimes: BlockRuntimes = new Map();
  const renderNow = 1_000;

  updateBlockAnimation({
    blocks: [{ content, startOffset: 0 }],
    charDelay: 20,
    getBlockState: () => 'streaming',
    initialContent,
    initialRevealedChars,
    pluginsCache: new Map(),
    renderNow,
    revealClock: { lastTs: 900 },
    renderedCharCounts,
    runtimes,
  });

  return { renderNow, runtimes };
};

describe('updateBlockAnimation', () => {
  it('marks the initial content as already revealed and animates only the new suffix', () => {
    const { renderNow, runtimes } = createArgs('Hello world', 'Hello');
    const runtime = runtimes.get(0)!;

    expect(runtime.births).toHaveLength(11);
    expect(runtime.births.slice(0, 5)).toEqual(
      Array.from({ length: 5 }).fill(renderNow - STREAM_FADE_DURATION),
    );
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

  it('uses the rendered baseline length instead of Markdown source characters', () => {
    const { renderNow, runtimes } = createArgs(
      '**Hi** there',
      '**Hi**',
      new Map([[0, 2]]),
      new Map([[0, 8]]),
    );
    const runtime = runtimes.get(0)!;

    expect(runtime.births).toHaveLength(8);
    expect(runtime.births.slice(0, 2)).toEqual(
      Array.from({ length: 2 }).fill(renderNow - STREAM_FADE_DURATION),
    );
    expect(runtime.births.slice(2).every((birth) => birth >= renderNow)).toBe(true);

    updateBlockAnimation({
      blocks: [{ content: '**Hi** there!', startOffset: 0 }],
      charDelay: 20,
      getBlockState: () => 'streaming',
      initialContent: '**Hi**',
      initialRevealedChars: new Map([[0, 2]]),
      pluginsCache: new Map(),
      renderNow: renderNow + 40,
      renderedCharCounts: new Map([[0, 9]]),
      revealClock: { lastTs: renderNow },
      runtimes,
    });

    expect(runtime.births).toHaveLength(9);
    expect(runtime.births.at(-1)).toBeGreaterThanOrEqual(renderNow + 40);
  });

  it('matches an initial snapshot after Markdown preprocessing', () => {
    const initialContent = preprocessMarkdownContent('See [1]', {
      citationsLength: 1,
      enableCustomFootnotes: true,
    });
    const content = preprocessMarkdownContent('See [1] now', {
      citationsLength: 1,
      enableCustomFootnotes: true,
    });

    const revealedChars = getInitialRevealedChars({
      blocks: [{ content, startOffset: 0 }],
      content,
      initialContent,
      rehypePlugins: [],
      remarkPlugins: [],
    });

    expect(revealedChars?.get(0)).toBe('See #citation-1'.length);
  });
});
