import { act, fireEvent } from '@testing-library/react';
import { createPortal } from 'react-dom';

import { playerRef, renderVideo } from './__tests__/render';
import Frame from './parts/Frame';
import Root from './parts/Root';

const setup = () => {
  const ref = playerRef();
  const utils = renderVideo(
    <Root ref={ref} src="a.mp4">
      <Frame>
        <button type="button">inside</button>
      </Frame>
    </Root>,
  );
  const root = utils.container.firstElementChild as HTMLElement;
  const press = (key: string, init: KeyboardEventInit = {}) =>
    fireEvent.keyDown(root, { key, ...init });
  return { ...utils, player: ref.current!, press, root };
};

describe('player keyboard', () => {
  it('toggles playback with Space and K', () => {
    const { press, video } = setup();
    press(' ');
    expect(video.paused).toBe(false);
    press('k');
    expect(video.paused).toBe(true);
  });

  it('steps frames with comma and period', () => {
    const { player, press } = setup();
    press('.');
    expect(player.getState().time).toBeCloseTo(1.5 / 30);
    press(',');
    expect(player.getState().time).toBeCloseTo(0.5 / 30);
  });

  it('seeks with the arrows, five seconds with Shift', () => {
    const { player, press } = setup();
    act(() => player.seek(10));
    press('ArrowRight');
    expect(player.getState().time).toBe(11);
    press('ArrowLeft', { shiftKey: true });
    expect(player.getState().time).toBe(6);
  });

  it('walks the playback rates with J and L', () => {
    const { player, press } = setup();
    press('l');
    expect(player.getState().rate).toBe(1.5);
    press('j');
    press('j');
    expect(player.getState().rate).toBe(0.5);
    press('j');
    expect(player.getState().rate).toBe(0.5);
  });

  it('mutes with M and toggles captions with C', () => {
    const { player, press } = setup();
    press('m');
    expect(player.getState().muted).toBe(true);
    press('c');
    expect(player.getState().captions).toBe(false);
  });

  it('leaves Space to a focused button', () => {
    const { container, video } = setup();
    const button = container.querySelector('button')!;
    fireEvent.keyDown(button, { key: ' ' });
    expect(video.paused).toBe(true);
  });

  it('ignores keys while the video is not ready', () => {
    const ref = playerRef();
    const { container } = renderVideo(
      <Root ref={ref} src="a.mp4">
        <Frame />
      </Root>,
    );
    act(() => container.querySelector('video')!.dispatchEvent(new Event('error')));
    fireEvent.keyDown(container.firstElementChild!, { key: ' ' });
    expect(ref.current?.getState().paused).toBe(true);
  });

  it('ignores keys from portalled content such as an open menu', () => {
    const { container } = renderVideo(
      <Root src="a.mp4">
        <Frame>
          {createPortal(<div data-testid="menu" role="menuitem" tabIndex={-1} />, document.body)}
        </Frame>
      </Root>,
    );
    const video = container.querySelector('video')!;
    fireEvent.keyDown(document.querySelector('[data-testid="menu"]')!, { key: ' ' });
    expect(video.paused).toBe(true);
  });

  it('ignores keys typed into an editor inside the player', () => {
    const { container, video } = renderVideo(
      <Root src="a.mp4">
        <Frame>
          <div contentEditable suppressContentEditableWarning data-testid="editor" />
          <select data-testid="picker" />
        </Frame>
      </Root>,
    );
    fireEvent.keyDown(container.querySelector('[data-testid="editor"]')!, { key: 'k' });
    fireEvent.keyDown(container.querySelector('[data-testid="picker"]')!, { key: ' ' });
    expect(video.paused).toBe(true);
  });
});
