import { act, fireEvent, renderHook, screen } from '@testing-library/react';

import { playerRef, renderVideo } from '../__tests__/render';
import { useVideoPlayer } from '../useVideo';
import CenterPlay from './CenterPlay';
import Frame from './Frame';
import Root from './Root';

describe('Video.Root', () => {
  it('hands the player to ref', () => {
    const ref = playerRef();
    const { container } = renderVideo(
      <Root ref={ref} src="a.mp4">
        <Frame />
      </Root>,
    );
    expect(ref.current?.root).toBe(container.firstElementChild);
    expect(ref.current?.video).toBe(container.querySelector('video'));
    act(() => ref.current?.seek(30));
    expect(ref.current?.getState().time).toBe(30);
  });

  it('gives ref the same object as the player prop', () => {
    const { result } = renderHook(() => useVideoPlayer());
    const ref = playerRef();
    renderVideo(
      <Root player={result.current} ref={ref} src="a.mp4">
        <Frame />
      </Root>,
    );
    expect(ref.current).toBe(result.current);
    expect(result.current.getState().status).toBe('ready');
  });

  it('applies the initial mute state to the element', () => {
    const { video } = renderVideo(
      <Root muted src="a.mp4">
        <Frame />
      </Root>,
    );
    expect(video.muted).toBe(true);
  });

  it('starts with captions off when asked', () => {
    const ref = playerRef();
    renderVideo(
      <Root captions={false} ref={ref} src="a.mp4">
        <Frame />
      </Root>,
    );
    expect(ref.current?.getState().captions).toBe(false);
  });

  it('caps width by maxHeight and the intrinsic aspect ratio', () => {
    const { container } = renderVideo(
      <Root maxHeight={360} src="a.mp4">
        <Frame />
      </Root>,
    );
    const root = container.firstElementChild as HTMLElement;
    expect(root.style.maxWidth).toBe('640px');
    expect(root.style.width).toBe('100%');
  });
});

describe('Video.Frame', () => {
  it('toggles playback on click', () => {
    const { container, video } = renderVideo(
      <Root src="a.mp4">
        <Frame />
      </Root>,
    );
    fireEvent.click(container.querySelector('[data-video-surface]')!);
    expect(video.paused).toBe(false);
    fireEvent.click(container.querySelector('[data-video-surface]')!);
    expect(video.paused).toBe(true);
  });

  it('reveals controls on the first touch instead of toggling', () => {
    const { container, video } = renderVideo(
      <Root src="a.mp4">
        <Frame />
      </Root>,
    );
    act(() => {
      void video.play();
    });
    const surface = container.querySelector('[data-video-surface]')!;
    fireEvent.pointerLeave(surface);
    fireEvent.pointerDown(surface, { pointerType: 'touch' });
    fireEvent.click(surface);
    expect(video.paused).toBe(false);
    fireEvent.pointerDown(surface, { pointerType: 'touch' });
    fireEvent.click(surface);
    expect(video.paused).toBe(true);
  });
});

describe('Video.CenterPlay', () => {
  it('shows while paused at the start and plays on click', () => {
    const { video } = renderVideo(
      <Root src="a.mp4">
        <Frame>
          <CenterPlay />
        </Frame>
      </Root>,
    );
    fireEvent.click(screen.getByRole('button', { name: 'Play' }));
    expect(video.paused).toBe(false);
    expect(screen.queryByRole('button', { name: 'Play' })).toBeNull();
  });

  it('stays hidden once the playhead has moved', () => {
    const ref = playerRef();
    renderVideo(
      <Root ref={ref} src="a.mp4">
        <Frame>
          <CenterPlay />
        </Frame>
      </Root>,
    );
    act(() => ref.current?.seek(10));
    expect(screen.queryByRole('button', { name: 'Play' })).toBeNull();
  });
});
