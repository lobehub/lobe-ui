import { act, renderHook } from '@testing-library/react';
import { useEffect, useState } from 'react';
import { describe, expect, it } from 'vitest';

describe('Markdown Streaming Demo', () => {
  it('should stream content correctly', () => {
    const mockContent = 'Hello World';
    const mockSpeed = 25;

    const { result } = renderHook(() => {
      const [streamedContent, setStreamedContent] = useState('');
      const [isStreaming, setIsStreaming] = useState(true);
      const [isPaused, setIsPaused] = useState(false);

      useEffect(() => {
        if (!isStreaming || isPaused) return;

        let currentPosition = 0;
        if (streamedContent.length > 0) {
          currentPosition = streamedContent.length;
        }

        const intervalId = setInterval(() => {
          if (currentPosition < mockContent.length) {
            const nextChunkSize = Math.min(3, mockContent.length - currentPosition);
            const nextContent = mockContent.slice(0, Math.max(0, currentPosition + nextChunkSize));
            setStreamedContent(nextContent);
            currentPosition += nextChunkSize;
          } else {
            clearInterval(intervalId);
            setIsStreaming(false);
          }
        }, mockSpeed);

        return () => clearInterval(intervalId);
      }, [mockContent, mockSpeed, isStreaming, isPaused, streamedContent.length]);

      return {
        isPaused,
        isStreaming,
        setIsPaused,
        setIsStreaming,
        setStreamedContent,
        streamedContent,
      };
    });

    // Initial state
    expect(result.current.streamedContent).toBe('');
    expect(result.current.isStreaming).toBe(true);
    expect(result.current.isPaused).toBe(false);

    // Test pause functionality
    act(() => {
      result.current.setIsPaused(true);
    });
    expect(result.current.isPaused).toBe(true);

    // Test resume
    act(() => {
      result.current.setIsPaused(false);
    });
    expect(result.current.isPaused).toBe(false);

    // Test restart
    act(() => {
      result.current.setStreamedContent('');
      result.current.setIsStreaming(true);
      result.current.setIsPaused(false);
    });
    expect(result.current.streamedContent).toBe('');
    expect(result.current.isStreaming).toBe(true);
    expect(result.current.isPaused).toBe(false);
  });

  it('should handle empty content', () => {
    const mockContent = '';
    const mockSpeed = 25;

    const { result } = renderHook(() => {
      const [streamedContent, setStreamedContent] = useState('');
      const [isStreaming, setIsStreaming] = useState(true);
      const [isPaused] = useState(false);

      useEffect(() => {
        if (!isStreaming || isPaused) return;

        let currentPosition = 0;
        if (streamedContent.length > 0) {
          currentPosition = streamedContent.length;
        }

        const intervalId = setInterval(() => {
          if (currentPosition < mockContent.length) {
            const nextChunkSize = Math.min(3, mockContent.length - currentPosition);
            const nextContent = mockContent.slice(0, Math.max(0, currentPosition + nextChunkSize));
            setStreamedContent(nextContent);
            currentPosition += nextChunkSize;
          } else {
            clearInterval(intervalId);
            setIsStreaming(false);
          }
        }, mockSpeed);

        return () => clearInterval(intervalId);
      }, [mockContent, mockSpeed, isStreaming, isPaused, streamedContent.length]);

      return {
        isPaused,
        isStreaming,
        streamedContent,
      };
    });

    expect(result.current.streamedContent).toBe('');
    expect(result.current.isStreaming).toBe(true);
  });

  it('should handle long content in chunks', () => {
    const mockContent = 'A'.repeat(100);
    const mockSpeed = 25;

    const { result } = renderHook(() => {
      const [streamedContent, setStreamedContent] = useState('');
      const [isStreaming, setIsStreaming] = useState(true);
      const [isPaused] = useState(false);

      useEffect(() => {
        if (!isStreaming || isPaused) return;

        let currentPosition = 0;
        if (streamedContent.length > 0) {
          currentPosition = streamedContent.length;
        }

        const intervalId = setInterval(() => {
          if (currentPosition < mockContent.length) {
            const nextChunkSize = Math.min(3, mockContent.length - currentPosition);
            const nextContent = mockContent.slice(0, Math.max(0, currentPosition + nextChunkSize));
            setStreamedContent(nextContent);
            currentPosition += nextChunkSize;
          } else {
            clearInterval(intervalId);
            setIsStreaming(false);
          }
        }, mockSpeed);

        return () => clearInterval(intervalId);
      }, [mockContent, mockSpeed, isStreaming, isPaused, streamedContent.length]);

      return {
        isStreaming,
        streamedContent,
      };
    });

    expect(result.current.streamedContent).toBe('');
    expect(result.current.isStreaming).toBe(true);
  });
});
