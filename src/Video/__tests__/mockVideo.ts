export interface MockVideo extends HTMLVideoElement {
  emit: (type: string) => void;
  enableFrameCallbacks: () => void;
  finish: () => void;
  finishNaturally: () => void;
  loadCalls: number;
  paintFrame: (mediaTime: number) => void;
  setMeta: (meta: { duration: number; height?: number; width?: number }) => void;
}

export const mockVideoElement = (element: HTMLVideoElement): MockVideo => {
  const video = element as MockVideo;
  let paused = true;
  let currentTime = 0;
  let duration = Number.NaN;
  let ended = false;
  let readyState = 0;
  let videoWidth = 0;
  let videoHeight = 0;
  let playbackRate = element.playbackRate || 1;
  let muted = element.muted;

  video.loadCalls = 0;
  video.emit = (type) => video.dispatchEvent(new Event(type));

  Object.defineProperties(video, {
    currentTime: {
      configurable: true,
      get: () => currentTime,
      set: (value: number) => {
        currentTime = value;
        ended = false;
      },
    },
    duration: { configurable: true, get: () => duration },
    ended: { configurable: true, get: () => ended },
    muted: {
      configurable: true,
      get: () => muted,
      set: (value: boolean) => {
        muted = value;
        video.emit('volumechange');
      },
    },
    paused: { configurable: true, get: () => paused },
    playbackRate: {
      configurable: true,
      get: () => playbackRate,
      set: (value: number) => {
        playbackRate = value;
        video.emit('ratechange');
      },
    },
    readyState: { configurable: true, get: () => readyState },
    videoHeight: { configurable: true, get: () => videoHeight },
    videoWidth: { configurable: true, get: () => videoWidth },
  });

  video.play = () => {
    paused = false;
    video.emit('play');
    return Promise.resolve();
  };
  video.pause = () => {
    if (paused) return;
    paused = true;
    video.emit('pause');
  };
  video.load = () => {
    video.loadCalls += 1;
  };
  video.finish = () => {
    currentTime = duration;
    ended = true;
    paused = true;
    video.emit('ended');
  };
  video.finishNaturally = () => {
    currentTime = duration;
    paused = true;
    video.emit('pause');
    ended = true;
    video.emit('ended');
  };
  let frameCallbacks: ((now: number, frame: { mediaTime: number }) => void)[] = [];
  video.enableFrameCallbacks = () => {
    Object.assign(video, {
      cancelVideoFrameCallback: () => {
        frameCallbacks = [];
      },
      requestVideoFrameCallback: (
        callback: (now: number, frame: { mediaTime: number }) => void,
      ) => {
        frameCallbacks.push(callback);
        return frameCallbacks.length;
      },
    });
  };
  video.paintFrame = (mediaTime) => {
    const pending = frameCallbacks;
    frameCallbacks = [];
    for (const callback of pending) callback(0, { mediaTime });
  };
  video.setMeta = (meta) => {
    duration = meta.duration;
    videoWidth = meta.width ?? 1280;
    videoHeight = meta.height ?? 720;
    readyState = 1;
    video.emit('loadedmetadata');
  };

  return video;
};

export const createMockVideo = (): MockVideo => mockVideoElement(document.createElement('video'));
