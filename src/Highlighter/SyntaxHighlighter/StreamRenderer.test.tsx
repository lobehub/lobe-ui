import { STREAM_FADE_DURATION } from '@lobehub/streamdown';
import { render, waitFor } from '@testing-library/react';
import { afterEach, beforeAll, describe, expect, it, vi } from 'vitest';

import { loadEngine } from '../engine';
import SyntaxHighlighter from './index';

const CODE = ['const a = 1;', 'const b = 2;', 'function sum() {', '  return a + b;', '}'];

let clock = 1000;

const renderStream = (text: string) => (
  <SyntaxHighlighter animated language="ts">
    {text}
  </SyntaxHighlighter>
);

const lineTexts = (container: HTMLElement) =>
  [...container.querySelectorAll('span.line')].map((line) => line.textContent);

describe('StreamRenderer token fade', () => {
  beforeAll(async () => {
    await loadEngine();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('refolds faded tokens into plain spans once the fade ends', async () => {
    clock = 1000;
    vi.spyOn(performance, 'now').mockImplementation(() => clock);

    const { container, rerender } = render(renderStream(CODE[0]));
    await waitFor(() => expect(lineTexts(container)).toEqual([CODE[0]]));

    for (let i = 2; i <= CODE.length; i++) {
      clock += 30;
      rerender(renderStream(CODE.slice(0, i).join('\n')));
    }
    await waitFor(() => expect(lineTexts(container)).toEqual(CODE));
    expect(container.querySelectorAll('.stream-char').length).toBeGreaterThan(0);

    clock += STREAM_FADE_DURATION * 4;
    await waitFor(() => expect(container.querySelectorAll('.stream-char')).toHaveLength(0));
    expect(lineTexts(container)).toEqual(CODE);
    expect(container.querySelectorAll('span.line [style*="animation-delay"]')).toHaveLength(0);
  });

  it('does not replay the fade when a partial closing fence is dropped', async () => {
    clock = 1000;
    vi.spyOn(performance, 'now').mockImplementation(() => clock);

    const done = CODE.slice(0, 2).join('\n');
    const { container, rerender } = render(renderStream(done));
    await waitFor(() => expect(lineTexts(container)).toEqual(CODE.slice(0, 2)));

    clock += STREAM_FADE_DURATION * 4;
    await waitFor(() => expect(container.querySelectorAll('.stream-char')).toHaveLength(0));

    // While the closing fence streams in, its backticks are part of the code.
    clock += 30;
    rerender(renderStream(`${done}\n\``));
    await waitFor(() => expect(lineTexts(container)).toHaveLength(3));

    clock += 30;
    rerender(renderStream(done));
    await waitFor(() => expect(lineTexts(container)).toEqual(CODE.slice(0, 2)));
    expect(container.querySelectorAll('.stream-char')).toHaveLength(0);
  });
});
