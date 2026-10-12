import { act, fireEvent, screen, waitFor } from '@testing-library/react';

import { playerRef, renderVideo } from '../__tests__/render';
import Caption from './Caption';
import Controls from './Controls';
import Frame from './Frame';
import LoadError from './LoadError';
import Root from './Root';

if (!globalThis.ResizeObserver) {
  globalThis.ResizeObserver = class {
    disconnect() {}
    observe() {}
    unobserve() {}
  } as any;
}

const markers = [
  { color: 'success', content: 'Agent created', label: 'Check', time: 52 },
  { color: 'warning', content: 'Toast overlapped', label: 'Flag', time: 52 },
];

const setup = (action?: (marker: (typeof markers)[number]) => React.ReactNode) => {
  const ref = playerRef();
  const utils = renderVideo(
    <Root markers={markers} ref={ref} src="a.mp4">
      <Frame>
        <Caption action={action as never} />
      </Frame>
    </Root>,
  );
  return { ...utils, player: ref.current! };
};

describe('Video.Caption', () => {
  it('shows every marker on the current frame', () => {
    const { player } = setup();
    expect(screen.queryByText('Agent created')).toBeNull();
    act(() => player.seek(52.2));
    expect(screen.getByText('Agent created')).toBeTruthy();
    expect(screen.getByText('Toast overlapped')).toBeTruthy();
    expect(screen.getByText('Check')).toBeTruthy();
  });

  it('hides while captions are off', () => {
    const { player } = setup();
    act(() => {
      player.seek(52.2);
      player.setCaptions(false);
    });
    expect(screen.queryByText('Agent created')).toBeNull();
  });

  it('rises above overlay controls only', () => {
    const below = playerRef();
    const { container, unmount } = renderVideo(
      <Root markers={markers} ref={below} src="a.mp4">
        <Frame>
          <Caption />
        </Frame>
        <Controls />
      </Root>,
    );
    act(() => below.current?.seek(52.2));
    expect(container.querySelector('[data-video-caption]')!.getAttribute('data-raised')).toBe(
      'false',
    );
    unmount();

    const over = playerRef();
    const overlay = renderVideo(
      <Root markers={markers} ref={over} src="a.mp4">
        <Frame>
          <Caption />
          <Controls />
        </Frame>
      </Root>,
    );
    act(() => over.current?.seek(52.2));
    expect(
      overlay.container.querySelector('[data-video-caption]')!.getAttribute('data-raised'),
    ).toBe('true');
  });

  it('renders the action for each marker', () => {
    const { player } = setup((marker) => <button type="button">dispute {marker.label}</button>);
    act(() => player.seek(52.2));
    expect(screen.getByRole('button', { name: 'dispute Check' })).toBeTruthy();
    expect(screen.getByRole('button', { name: 'dispute Flag' })).toBeTruthy();
  });
});

describe('Video.LoadError', () => {
  it('reloads after onRetry settles', async () => {
    const order: string[] = [];
    let release: () => void = () => {};
    const onRetry = () =>
      new Promise<void>((resolve) => {
        order.push('retry');
        release = resolve;
      });
    const { container, video } = renderVideo(
      <Root src="a.mp4" onRetry={onRetry}>
        <Frame>
          <LoadError />
        </Frame>
      </Root>,
    );
    const originalLoad = video.load;
    video.load = () => {
      order.push('load');
      originalLoad();
    };
    expect(screen.queryByRole('button', { name: 'Reload' })).toBeNull();
    act(() => container.querySelector('video')!.dispatchEvent(new Event('error')));
    expect(screen.getByRole('link', { name: 'Download' }).getAttribute('href')).toBe('a.mp4');
    fireEvent.click(screen.getByRole('button', { name: 'Reload' }));
    expect(order).toEqual(['retry']);
    await act(async () => release());
    await waitFor(() => expect(order).toEqual(['retry', 'load']));
  });
});
