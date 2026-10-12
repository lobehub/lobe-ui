import { act, render, renderHook, screen } from '@testing-library/react';

import { createMockVideo } from './__tests__/mockVideo';
import { VideoContext } from './context';
import { createVideoStore } from './store';
import { useVideo, useVideoPlayer, useVideoState } from './useVideo';

describe('useVideoPlayer', () => {
  it('returns the same handle across renders', () => {
    const { result, rerender } = renderHook(() => useVideoPlayer());
    const first = result.current;
    rerender();
    expect(result.current).toBe(first);
  });
});

describe('useVideoState', () => {
  it('re-renders with the selected slice when the player seeks', () => {
    const store = createVideoStore();
    const video = createMockVideo();
    store.attach(video);
    video.setMeta({ duration: 100 });

    const Readout = () => <span data-testid="time">{useVideoState(store, (s) => s.time)}</span>;
    render(<Readout />);
    expect(screen.getByTestId('time').textContent).toBe('0');
    act(() => store.seek(42));
    expect(screen.getByTestId('time').textContent).toBe('42');
  });

  it('skips renders when an unrelated slice changes', () => {
    const store = createVideoStore();
    const video = createMockVideo();
    store.attach(video);
    video.setMeta({ duration: 100 });
    let renders = 0;
    const Muted = () => {
      renders += 1;
      return <span>{String(useVideoState(store, (s) => s.muted))}</span>;
    };
    render(<Muted />);
    const before = renders;
    act(() => store.seek(10));
    expect(renders).toBe(before);
  });
});

describe('useVideo', () => {
  it('reads the store from context', () => {
    const store = createVideoStore();
    const { result } = renderHook(() => useVideo((s) => s.status), {
      wrapper: ({ children }) => (
        <VideoContext
          value={{ config: { fps: 30, markers: [], sections: [] }, media: { src: 'a.mp4' }, store }}
        >
          {children}
        </VideoContext>
      ),
    });
    expect(result.current).toBe('loading');
  });

  it('throws outside a Video.Root', () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    expect(() => renderHook(() => useVideo())).toThrow(/Video\.Root/);
  });
});
