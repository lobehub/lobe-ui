import { act, fireEvent, screen } from '@testing-library/react';

import { playerRef, renderVideo } from './__tests__/render';
import Video, { useVideoPlayer } from './index';
import type { VideoPlayer } from './type';

if (!globalThis.ResizeObserver) {
  globalThis.ResizeObserver = class {
    disconnect() {}
    observe() {}
    unobserve() {}
  } as any;
}

const sections = [
  { start: 0, title: 'Intro' },
  { start: 47, title: 'Create agent' },
];
const markers = [{ color: 'success', content: 'Agent created', label: 'Check', time: 52 }];

describe('Video preset', () => {
  it('plays a bare src with overlay controls and center play', () => {
    const { container, video } = renderVideo(<Video src="a.mp4" />);
    expect(container.querySelector('[data-video-controls]')).toBeTruthy();
    fireEvent.click(screen.getAllByRole('button', { name: 'Play' })[0]);
    expect(video.paused).toBe(false);
  });

  it('exposes the player through ref', () => {
    const ref = playerRef();
    renderVideo(<Video ref={ref} src="a.mp4" />);
    act(() => ref.current?.seek(12));
    expect(ref.current?.getState().time).toBe(12);
  });

  it('captions markers and renders the overlay slot with state', () => {
    const ref = playerRef();
    renderVideo(
      <Video
        markers={markers}
        overlay={(state) => <span>overlay at {Math.round(state.time)}</span>}
        ref={ref}
        sections={sections}
        src="a.mp4"
      />,
    );
    act(() => ref.current?.seek(52.2));
    expect(screen.getAllByText('Agent created').length).toBeGreaterThan(0);
    expect(screen.getByText('overlay at 52')).toBeTruthy();
  });

  it('passes classNames to its parts', () => {
    const { container } = renderVideo(
      <Video
        classNames={{ controls: 'c-controls', frame: 'c-frame', root: 'c-root' }}
        src="a.mp4"
      />,
    );
    expect(container.querySelector('.c-root')).toBe(container.firstElementChild);
    expect(container.querySelector('.c-frame video')).toBeTruthy();
    expect(container.querySelector('.c-controls[data-video-controls]')).toBeTruthy();
  });

  it('turns on frame stepping', () => {
    renderVideo(<Video frameStep src="a.mp4" />);
    expect(screen.getByRole('button', { name: 'Next frame' })).toBeTruthy();
  });
});

describe('Video parts', () => {
  it('composes a review player driven from outside', () => {
    const outside: { player?: VideoPlayer } = {};
    const Review = () => {
      const player = useVideoPlayer();
      outside.player = player;
      return (
        <>
          <Video.Root player={player} sections={sections} src="a.mp4">
            <Video.Frame>
              <Video.Caption />
            </Video.Frame>
            <Video.Controls frameStep />
            <Video.SectionList />
          </Video.Root>
          <button type="button" onClick={() => player.seek(47)}>
            outside seek
          </button>
        </>
      );
    };
    const { container } = renderVideo(<Review />);
    fireEvent.click(screen.getByRole('button', { name: 'outside seek' }));
    expect(outside.player?.getState().time).toBe(47);
    const chips = container.querySelectorAll('[data-video-section]');
    expect(chips).toHaveLength(2);
    expect(chips[1].getAttribute('aria-current')).toBe('true');
    fireEvent.click(chips[0]);
    expect(outside.player?.getState().time).toBe(0);
  });
});
