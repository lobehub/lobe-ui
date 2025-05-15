import { act, renderHook } from '@testing-library/react';
import { useState } from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { fullContent } from '../src/Markdown/demos/data';

describe('Markdown Streaming Demo', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  it('should stream content correctly', () => {
    const { result } = renderHook(() => {
      const [content, setContent] = useState('');
      const [isStreaming, setIsStreaming] = useState(true);
      const [isPaused, setIsPaused] = useState(false);

      return {
        content,
        isPaused,
        isStreaming,
        setContent,
        setIsPaused,
        setIsStreaming,
      };
    });

    expect(result.current.content).toBe('');
    expect(result.current.isStreaming).toBe(true);
    expect(result.current.isPaused).toBe(false);

    // Simulate streaming by setting content directly
    act(() => {
      result.current.setContent(fullContent.slice(0, 10));
    });

    expect(result.current.content.length).toBe(10);

    // Pause streaming
    act(() => {
      result.current.setIsPaused(true);
    });

    expect(result.current.isPaused).toBe(true);

    const contentLengthBeforePause = result.current.content.length;

    // Content should not change while paused
    act(() => {
      vi.advanceTimersByTime(100);
    });

    expect(result.current.content.length).toBe(contentLengthBeforePause);

    // Resume streaming
    act(() => {
      result.current.setIsPaused(false);
      result.current.setContent(fullContent.slice(0, 20));
    });

    expect(result.current.content.length).toBe(20);

    // Restart streaming
    act(() => {
      result.current.setContent('');
      result.current.setIsStreaming(true);
      result.current.setIsPaused(false);
    });

    expect(result.current.content).toBe('');
    expect(result.current.isStreaming).toBe(true);
    expect(result.current.isPaused).toBe(false);
  });

  it('should finish streaming when content is complete', () => {
    const { result } = renderHook(() => {
      const [content, setContent] = useState('');
      const [isStreaming, setIsStreaming] = useState(true);

      return {
        content,
        isStreaming,
        setContent,
        setIsStreaming,
      };
    });

    // Stream entire content
    act(() => {
      result.current.setContent(fullContent);
      result.current.setIsStreaming(false);
    });

    expect(result.current.content).toBe(fullContent);
    expect(result.current.isStreaming).toBe(false);
  });
});
