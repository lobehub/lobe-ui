import { act, fireEvent, screen } from '@testing-library/react';

import { playerRef, renderVideo } from '../__tests__/render';
import type { VideoMarker } from '../type';
import Frame from './Frame';
import Root from './Root';
import Timeline from './Timeline';

const sections = [
  { start: 0, title: 'Intro' },
  { start: 18, title: 'Sign in' },
  { start: 47, title: 'Create agent' },
];
const markers: VideoMarker[] = [
  { color: 'success', content: 'Agent created', label: 'Check', time: 52 },
];

const TRACK_WIDTH = 1340;

beforeEach(() => {
  vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockImplementation(
    () =>
      ({
        bottom: 20,
        height: 20,
        left: 0,
        right: TRACK_WIDTH,
        top: 0,
        width: TRACK_WIDTH,
        x: 0,
        y: 0,
      }) as DOMRect,
  );
});

afterEach(() => vi.restoreAllMocks());

const setup = (props: { onMarkerClick?: (m: VideoMarker) => void; thumbnails?: boolean } = {}) => {
  const ref = playerRef();
  const utils = renderVideo(
    <Root
      markers={markers}
      ref={ref}
      sections={sections}
      src="a.mp4"
      onMarkerClick={props.onMarkerClick}
    >
      <Frame />
      <Timeline thumbnails={props.thumbnails}>
        <div>custom lane</div>
      </Timeline>
    </Root>,
  );
  return { ...utils, player: ref.current!, slider: screen.getByRole('slider') };
};

describe('Video.Timeline', () => {
  it('exposes the playhead as a slider', () => {
    const { player, slider } = setup();
    act(() => player.seek(64));
    expect(slider.getAttribute('aria-valuemax')).toBe('134');
    expect(slider.getAttribute('aria-valuenow')).toBe('64');
    expect(slider.getAttribute('aria-valuetext')).toBe('1:04 / 2:14, Create agent');
  });

  it('draws one segment per section', () => {
    const { container } = setup();
    expect(container.querySelectorAll('[data-video-segment]')).toHaveLength(3);
  });

  it('seeks where the track is pressed', () => {
    const { player, slider } = setup();
    fireEvent.pointerDown(slider, { button: 0, clientX: 670, pointerId: 1 });
    expect(player.getState().time).toBe(67);
  });

  it('pauses, seeks and reports when a marker is clicked', () => {
    const onMarkerClick = vi.fn();
    const { player, video } = setup({ onMarkerClick });
    act(() => {
      void video.play();
      player.setCaptions(false);
    });
    const marker = screen.getByRole('button', { name: /Check/ });
    fireEvent.pointerDown(marker, { button: 0, clientX: 10, pointerId: 1 });
    expect(player.getState().time).toBe(0);
    fireEvent.click(marker);
    expect(video.paused).toBe(true);
    expect(player.getState().time).toBe(52);
    expect(player.getState().captions).toBe(true);
    expect(onMarkerClick).toHaveBeenCalledWith(markers[0]);
  });

  it('previews the hovered time and section', () => {
    const { slider } = setup();
    fireEvent.pointerMove(slider, { clientX: 300, pointerType: 'mouse' });
    expect(screen.getByText('0:30')).toBeTruthy();
    expect(screen.getByText('Sign in')).toBeTruthy();
  });

  it('snaps the preview to a nearby marker', () => {
    const { slider } = setup();
    fireEvent.pointerMove(slider, { clientX: 525, pointerType: 'mouse' });
    expect(screen.getByText('0:52')).toBeTruthy();
    expect(screen.getAllByText('Agent created').length).toBeGreaterThan(0);
  });

  it('creates the probe video only on hover', () => {
    const { container, slider } = setup();
    expect(container.querySelectorAll('video')).toHaveLength(1);
    fireEvent.pointerMove(slider, { clientX: 300, pointerType: 'mouse' });
    expect(container.querySelectorAll('video')).toHaveLength(2);
    expect(container.querySelector('canvas')).toBeTruthy();
  });

  it('skips the thumbnail when thumbnails is off', () => {
    const { container, slider } = setup({ thumbnails: false });
    fireEvent.pointerMove(slider, { clientX: 300, pointerType: 'mouse' });
    expect(container.querySelectorAll('video')).toHaveLength(1);
    expect(container.querySelector('canvas')).toBeNull();
  });

  it('drops markers past the end of the media', () => {
    renderVideo(
      <Root markers={[...markers, { label: 'Late', time: 500 }]} sections={sections} src="a.mp4">
        <Frame />
        <Timeline />
      </Root>,
    );
    expect(screen.queryByRole('button', { name: /Late/ })).toBeNull();
    expect(screen.getByRole('button', { name: /Check/ })).toBeTruthy();
  });

  it('renders children as extra lanes', () => {
    setup();
    expect(screen.getByText('custom lane')).toBeTruthy();
  });
});
