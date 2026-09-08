import { act, cleanup, render, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { Streamdown } from './Streamdown';
import { useSmoothStreamContent } from './useSmoothStreamContent';

beforeEach(() => vi.useFakeTimers());
afterEach(() => {
  cleanup();
  vi.useRealTimers();
});

const advance = (ms = 100) => act(() => vi.advanceTimersByTime(ms));

describe('buffered complete blocks', () => {
  it('keeps up with sustained small chunks at 2000 characters per second', () => {
    const { result, rerender } = renderHook(({ content }) => useSmoothStreamContent(content), {
      initialProps: { content: '' },
    });
    const source = Array.from(
      { length: 20 },
      (_, i) => `Paragraph ${i}: ${'text '.repeat(10)}\n\n`,
    ).join('');
    for (let end = 20; end < source.length; end += 20) {
      rerender({ content: source.slice(0, end) });
      advance(10);
    }
    rerender({ content: source });
    advance();
    expect(result.current).toBe(source);
  });

  it('releases multiple complete paragraphs in one commit while smoothing the unfinished tail', () => {
    const { result, rerender } = renderHook(({ content }) => useSmoothStreamContent(content), {
      initialProps: { content: '' },
    });
    const complete = `${'甲😀'.repeat(10)}\n\n${'乙'.repeat(20)}\n\n`;
    rerender({ content: complete + 'unfinished paragraph continues here' });
    advance();
    expect(result.current).toBe(complete);
    advance(2000);
    expect(result.current).toBe(complete + 'unfinished paragraph continues here');
    rerender({ content: 'new stream' });
    expect(result.current).toBe('new stream');
  });

  it.each([
    '```js\nfirst line\n\nsecond line still inside the fence',
    '- first item\n\n- second item still inside the list',
    '    indented code\n\n    more indented code',
  ])('does not flush an unfinished block at an internal blank line: %s', (content) => {
    const { result, rerender } = renderHook(({ content }) => useSmoothStreamContent(content), {
      initialProps: { content: '' },
    });
    rerender({ content });
    advance();
    expect(result.current.length).toBeGreaterThan(0);
    expect(result.current.length).toBeLessThan(content.indexOf('\n\n') + 2);
  });

  it('fades complete paragraphs together without character spans or a serial queue', () => {
    const { container, rerender } = render(<Streamdown content="" />);
    rerender(
      <Streamdown content={'First **complete** paragraph.\n\nSecond complete paragraph.\n\n'} />,
    );
    advance();
    const paragraphs = container.querySelectorAll('p');
    expect(paragraphs).toHaveLength(2);
    expect([...paragraphs].map((p) => p.textContent)).toEqual([
      'First complete paragraph.',
      'Second complete paragraph.',
    ]);
    expect(container.querySelectorAll('p.stream-block')).toHaveLength(2);
    expect(container.querySelectorAll('.stream-char')).toHaveLength(0);
    expect(container.querySelector('strong')?.textContent).toBe('complete');
  });

  it('does not restart a visible paragraph when a burst completes it and adds more blocks', () => {
    const { container, rerender } = render(<Streamdown content="" />);
    rerender(<Streamdown content="Already visible" />);
    advance(1000);
    const first = container.querySelector('p');
    rerender(
      <Streamdown content={'Already visible, now complete.\n\nNew complete paragraph.\n\n'} />,
    );
    advance();
    expect(container.querySelector('p')).toBe(first);
    expect(first?.classList.contains('stream-block')).toBe(false);
    expect(container.querySelector('p.stream-block')?.textContent).toBe('New complete paragraph.');
  });
});
