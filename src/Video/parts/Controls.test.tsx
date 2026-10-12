import { act, fireEvent, screen, waitFor } from '@testing-library/react';
import { Profiler } from 'react';

import { playerRef, renderVideo } from '../__tests__/render';
import type { VideoMarker } from '../type';
import Controls from './Controls';
import Frame from './Frame';
import Root from './Root';

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

const setup = ({
  frameStep,
  markers = [],
  placement = 'overlay',
}: { frameStep?: boolean; markers?: VideoMarker[]; placement?: 'overlay' | 'below' } = {}) => {
  const ref = playerRef();
  const controls = <Controls frameStep={frameStep} />;
  const utils = renderVideo(
    <Root markers={markers} ref={ref} sections={sections} src="a.mp4">
      {placement === 'overlay' ? (
        <Frame>{controls}</Frame>
      ) : (
        <>
          <Frame />
          {controls}
        </>
      )}
    </Root>,
  );
  return { ...utils, player: ref.current! };
};

describe('Video.Controls rendering', () => {
  it('commits nothing while the playhead moves within one second', () => {
    const ref = playerRef();
    const onRender = vi.fn();
    renderVideo(
      <Root markers={[{ content: 'x', time: 3 }]} ref={ref} sections={sections} src="a.mp4">
        <Frame>
          <Profiler id="controls" onRender={onRender}>
            <Controls />
          </Profiler>
        </Frame>
      </Root>,
    );
    act(() => ref.current?.seek(10.1));
    onRender.mockClear();
    act(() => ref.current?.seek(10.4));
    act(() => ref.current?.seek(10.8));
    expect(onRender).not.toHaveBeenCalled();
  });

  it('moves the playhead through a CSS variable instead of a render', () => {
    const ref = playerRef();
    renderVideo(
      <Root ref={ref} sections={sections} src="a.mp4">
        <Frame>
          <Controls />
        </Frame>
      </Root>,
    );
    act(() => ref.current?.seek(10.4));
    const slider = screen.getByRole('slider');
    expect(slider.style.getPropertyValue('--video-time')).toBe('10.4');
    expect(slider.getAttribute('aria-valuenow')).toBe('10');
  });
});

describe('Video.Controls', () => {
  it('toggles playback from the play button', () => {
    const { video } = setup();
    fireEvent.click(screen.getByRole('button', { name: 'Play' }));
    expect(video.paused).toBe(false);
    fireEvent.click(screen.getByRole('button', { name: 'Pause' }));
    expect(video.paused).toBe(true);
  });

  it('morphs one icon between play and pause', () => {
    const { video } = setup();
    const button = screen.getByRole('button', { name: 'Play' });
    const icon = button.querySelector('[data-video-play-icon]')!;
    expect(icon.getAttribute('data-state')).toBe('play');
    act(() => {
      void video.play();
    });
    expect(
      screen.getByRole('button', { name: 'Pause' }).querySelector('[data-video-play-icon]'),
    ).toBe(icon);
    expect(icon.getAttribute('data-state')).toBe('pause');
  });

  it('mutes and unmutes from the mute button', () => {
    const { video } = setup();
    fireEvent.click(screen.getByRole('button', { name: 'Mute' }));
    expect(video.muted).toBe(true);
    fireEvent.click(screen.getByRole('button', { name: 'Unmute' }));
    expect(video.muted).toBe(false);
  });

  it('shows elapsed and total time', () => {
    const { player } = setup();
    act(() => player.seek(64));
    expect(screen.getByText('1:04 / 2:14')).toBeTruthy();
  });

  it('renders the timeline by default', () => {
    setup();
    expect(screen.getByRole('slider')).toBeTruthy();
  });

  it('hides the captions toggle when no marker has content', () => {
    setup({ markers: [{ time: 10 }] });
    expect(screen.queryByRole('button', { name: /captions/i })).toBeNull();
  });

  it('toggles captions when a marker has content', () => {
    const { player } = setup({ markers: [{ content: 'note', time: 10 }] });
    fireEvent.click(screen.getByRole('button', { name: 'Hide captions' }));
    expect(player.getState().captions).toBe(false);
    expect(screen.getByRole('button', { name: 'Show captions' }).getAttribute('aria-pressed')).toBe(
      'false',
    );
  });

  it('adds frame stepping and the frame readout with frameStep', () => {
    const { player } = setup({ frameStep: true });
    fireEvent.click(screen.getByRole('button', { name: 'Next frame' }));
    expect(player.getState().time).toBeCloseTo(1.5 / 30);
    expect(screen.getByText('Frame 1')).toBeTruthy();
  });

  it('leaves frame stepping out by default', () => {
    setup();
    expect(screen.queryByRole('button', { name: 'Next frame' })).toBeNull();
  });

  it('jumps to a section from the section menu', async () => {
    const { player } = setup();
    fireEvent.click(screen.getByRole('button', { name: 'Intro' }));
    fireEvent.click(await screen.findByRole('menuitem', { name: /Create agent/ }));
    expect(player.getState().time).toBe(47);
  });

  it('slides the section label in the direction of travel', () => {
    const { container, player } = setup();
    const label = () => container.querySelector('[data-video-section-label]')!;
    const first = label();
    expect(first.textContent).toBe('Intro');
    act(() => player.seek(50));
    expect(label()).not.toBe(first);
    expect(label().textContent).toBe('Create agent');
    expect(label().getAttribute('data-direction')).toBe('forward');
    act(() => player.seek(2));
    expect(label().getAttribute('data-direction')).toBe('backward');
  });

  it('changes speed from the speed menu', async () => {
    const { player } = setup();
    fireEvent.click(screen.getByRole('button', { name: 'Playback speed' }));
    fireEvent.click(await screen.findByRole('menuitem', { name: /1\.5×/ }));
    expect(player.getState().rate).toBe(1.5);
  });

  it('hides over the frame once playback leaves the pointer idle', async () => {
    const { container, video } = setup();
    const bar = container.querySelector('[data-video-controls]')!;
    expect(bar.getAttribute('data-visible')).toBe('true');
    act(() => {
      void video.play();
    });
    fireEvent.pointerLeave(container.querySelector('[data-video-surface]')!.parentElement!);
    await waitFor(() => expect(bar.getAttribute('data-visible')).toBe('false'));
  });

  it('stays visible below the frame', () => {
    const { container, video } = setup({ placement: 'below' });
    act(() => {
      void video.play();
    });
    expect(container.querySelector('[data-video-controls]')!.getAttribute('data-visible')).toBe(
      'true',
    );
  });
});
