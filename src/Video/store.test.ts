import { createMockVideo } from './__tests__/mockVideo';
import { createVideoStore } from './store';

const sections = [
  { start: 0, title: 'Intro' },
  { start: 18, title: 'Sign in' },
  { start: 47, title: 'Create agent' },
];
const markers = [
  { content: 'Agent created', label: 'Check', time: 52 },
  { label: 'Silent', time: 60 },
];

const setup = () => {
  const store = createVideoStore();
  store.setData({ fps: 30, markers, sections });
  const video = createMockVideo();
  const detach = store.attach(video);
  video.setMeta({ duration: 134, height: 720, width: 1280 });
  return { detach, store, video };
};

describe('createVideoStore', () => {
  it('becomes ready with duration and size on metadata', () => {
    const { store } = setup();
    expect(store.getState()).toMatchObject({
      duration: 134,
      size: { height: 720, width: 1280 },
      status: 'ready',
    });
  });

  it('notifies subscribers only when state changes', () => {
    const { store } = setup();
    const listener = vi.fn();
    store.subscribe(listener);
    store.seek(20);
    expect(listener).toHaveBeenCalledTimes(1);
    store.seek(20);
    expect(listener).toHaveBeenCalledTimes(1);
  });

  it('keeps activeSection identity while the playhead stays inside it', () => {
    const { store } = setup();
    store.seek(20);
    const first = store.getState().activeSection;
    store.seek(30);
    expect(store.getState().activeSection).toBe(first);
    expect(first?.title).toBe('Sign in');
    store.seek(50);
    expect(store.getState().activeSection?.title).toBe('Create agent');
  });

  it('keeps activeMarkers identity between frames of the same caption', () => {
    const { store } = setup();
    store.seek(52.1);
    const first = store.getState().activeMarkers;
    expect(first.map((m) => m.content)).toEqual(['Agent created']);
    store.seek(52.5);
    expect(store.getState().activeMarkers).toBe(first);
    store.seek(56);
    expect(store.getState().activeMarkers).toEqual([]);
  });

  it('clamps seeks to the media range', () => {
    const { store, video } = setup();
    store.seek(-4);
    expect(video.currentTime).toBe(0);
    store.seek(500);
    expect(video.currentTime).toBe(134);
    expect(store.getState().time).toBe(134);
  });

  it('steps one frame from the frame on screen and pauses', async () => {
    const { store, video } = setup();
    await store.play();
    store.seek(1);
    store.step(1);
    expect(video.paused).toBe(true);
    expect(video.currentTime).toBeCloseTo(31.5 / 30);
  });

  it('restarts from the beginning when toggled after the end', () => {
    const { store, video } = setup();
    video.finish();
    store.toggle();
    expect(video.currentTime).toBe(0);
    expect(video.paused).toBe(false);
  });

  it('tracks paused from media events', async () => {
    const { store } = setup();
    await store.play();
    expect(store.getState().paused).toBe(false);
    store.pause();
    expect(store.getState().paused).toBe(true);
  });

  it('syncs mute with the element and reports changes', () => {
    const onMutedChange = vi.fn();
    const { store, video } = setup();
    store.setOptions({ onMutedChange });
    store.toggleMute();
    expect(video.muted).toBe(true);
    expect(store.getState().muted).toBe(true);
    expect(onMutedChange).toHaveBeenCalledWith(true);
    video.muted = false;
    expect(store.getState().muted).toBe(false);
  });

  it('syncs playback rate and reports changes', () => {
    const onRateChange = vi.fn();
    const { store, video } = setup();
    store.setOptions({ onRateChange });
    store.setRate(1.5);
    expect(video.playbackRate).toBe(1.5);
    expect(store.getState().rate).toBe(1.5);
    expect(onRateChange).toHaveBeenCalledWith(1.5);
  });

  it('applies initial mute and rate on attach', () => {
    const store = createVideoStore();
    store.setOptions({ defaultPlaybackRate: 2, muted: true });
    const video = createMockVideo();
    store.attach(video);
    expect(video.muted).toBe(true);
    expect(video.playbackRate).toBe(2);
  });

  it('enters the error state and reloads', () => {
    const { store, video } = setup();
    video.emit('error');
    expect(store.getState().status).toBe('error');
    store.reload();
    expect(store.getState().status).toBe('loading');
    expect(video.loadCalls).toBe(1);
  });

  it('is safe to drive before a video is attached', async () => {
    const store = createVideoStore();
    expect(store.video).toBeNull();
    expect(() => store.seek(10)).not.toThrow();
    expect(() => store.step(1)).not.toThrow();
    await expect(store.play()).resolves.toBeUndefined();
  });

  it('stops listening after detach', () => {
    const { detach, store, video } = setup();
    detach();
    video.emit('error');
    expect(store.getState().status).toBe('ready');
    expect(store.video).toBeNull();
  });

  it('turns captions on and off', () => {
    const { store } = setup();
    expect(store.getState().captions).toBe(true);
    store.setCaptions(false);
    expect(store.getState().captions).toBe(false);
  });

  it('restarts from the beginning after a natural end with painted frames', async () => {
    const store = createVideoStore();
    const video = createMockVideo();
    video.enableFrameCallbacks();
    store.attach(video);
    video.setMeta({ duration: 134 });
    await store.play();
    video.paintFrame(133.96);
    video.finishNaturally();
    expect(video.currentTime).toBe(134);
    store.toggle();
    expect(video.currentTime).toBe(0);
    expect(video.paused).toBe(false);
  });

  it('restarts when toggled within half a frame of the end', () => {
    const { store, video } = setup();
    video.currentTime = 134 - 0.01;
    store.toggle();
    expect(video.currentTime).toBe(0);
  });

  it('keeps a seek made before metadata loads', () => {
    const store = createVideoStore();
    const video = createMockVideo();
    store.attach(video);
    store.seek(52);
    expect(video.currentTime).toBe(52);
  });

  it('ignores non-finite seeks such as on a live stream', () => {
    const { store, video } = setup();
    store.seek(10);
    expect(() => store.seek(Number.POSITIVE_INFINITY)).not.toThrow();
    expect(() => store.seek(Number.NaN)).not.toThrow();
    expect(video.currentTime).toBe(10);
  });

  it('resets time and keeps the viewer mute and speed when a new video attaches', () => {
    const onMutedChange = vi.fn();
    const { detach, store } = setup();
    store.setOptions({ onMutedChange });
    store.seek(45);
    store.toggleMute();
    store.setRate(1.5);
    onMutedChange.mockClear();
    detach();
    const next = createMockVideo();
    store.attach(next);
    expect(store.getState()).toMatchObject({
      duration: 0,
      size: undefined,
      status: 'loading',
      time: 0,
    });
    expect(next.muted).toBe(true);
    expect(next.playbackRate).toBe(1.5);
    expect(onMutedChange).not.toHaveBeenCalled();
  });
});
