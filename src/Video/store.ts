import { markersAt, sectionAt, sortSections, steppedTime } from './time';
import type { VideoMarker, VideoPlayer, VideoSection, VideoState } from './type';

export interface VideoStoreOptions {
  defaultPlaybackRate?: number;
  muted?: boolean;
  onMutedChange?: (muted: boolean) => void;
  onRateChange?: (rate: number) => void;
}

export interface VideoStoreData {
  fps: number;
  markers: VideoMarker[];
  sections: VideoSection[];
}

export interface VideoStore extends VideoPlayer {
  attach: (video: HTMLVideoElement) => () => void;
  attachRoot: (root: HTMLDivElement | null) => void;
  getData: () => VideoStoreData;
  reload: () => void;
  setData: (data: Partial<VideoStoreData>) => void;
  setOptions: (options: VideoStoreOptions) => void;
  toggleFullscreen: () => void;
}

const EMPTY_MARKERS: VideoMarker[] = [];

const sameMarkers = (a: VideoMarker[], b: VideoMarker[]) =>
  a.length === b.length && a.every((marker, index) => marker === b[index]);

type FrameVideo = HTMLVideoElement & {
  cancelVideoFrameCallback?: (handle: number) => void;
  requestVideoFrameCallback?: (
    callback: (now: number, frame: { mediaTime: number }) => void,
  ) => number;
};

export const createVideoStore = (): VideoStore => {
  let data: VideoStoreData = { fps: 30, markers: [], sections: [] };
  let options: VideoStoreOptions = {};
  let video: FrameVideo | null = null;
  let root: HTMLDivElement | null = null;
  // The frame actually on screen while playing. `currentTime` runs ahead of
  // the painted frame, and pausing would otherwise land a frame past it.
  let painted: number | undefined;
  let state: VideoState = {
    activeMarkers: EMPTY_MARKERS,
    activeSection: undefined,
    captions: true,
    duration: 0,
    muted: false,
    paused: true,
    rate: 1,
    size: undefined,
    status: 'loading',
    time: 0,
  };
  const listeners = new Set<(state: VideoState) => void>();

  const derive = (next: VideoState): VideoState => {
    const activeSection = sectionAt(data.sections, next.time);
    const found = markersAt(data.markers, next.time, data.fps);
    const activeMarkers =
      found.length === 0
        ? EMPTY_MARKERS
        : sameMarkers(found, state.activeMarkers)
          ? state.activeMarkers
          : found;
    return { ...next, activeMarkers, activeSection };
  };

  const commit = (patch: Partial<VideoState>) => {
    const next = derive({ ...state, ...patch });
    const changed = (Object.keys(next) as (keyof VideoState)[]).some(
      (key) => next[key] !== state[key],
    );
    if (!changed) return;
    state = next;
    for (const listener of listeners) listener(state);
  };

  const frameTime = () => {
    if (!video) return 0;
    return video.paused ? video.currentTime : (painted ?? video.currentTime);
  };

  // Before metadata the duration is NaN: only the lower bound applies, and the
  // element keeps the value as its start position.
  const clampToMedia = (seconds: number) => {
    const lower = Math.max(seconds, 0);
    return video && Number.isFinite(video.duration) ? Math.min(lower, video.duration) : lower;
  };

  const atEnd = () =>
    Boolean(video) &&
    (video!.ended ||
      (Number.isFinite(video!.duration) && video!.currentTime >= video!.duration - 0.5 / data.fps));

  const seek = (seconds: number) => {
    if (!video || !Number.isFinite(seconds)) return;
    painted = undefined;
    video.currentTime = clampToMedia(seconds);
    commit({ time: video.currentTime });
  };

  let attachedOnce = false;

  const store: VideoStore = {
    attach: (element) => {
      const target = element as FrameVideo;
      video = target;
      let handle = 0;
      let running = false;

      const cancel = () => {
        if (!running) return;
        running = false;
        if (target.cancelVideoFrameCallback) target.cancelVideoFrameCallback(handle);
        else cancelAnimationFrame(handle);
      };
      const schedule = () => {
        handle = target.requestVideoFrameCallback
          ? target.requestVideoFrameCallback(tick)
          : requestAnimationFrame(() => tick());
      };
      function tick(_now?: number, frame?: { mediaTime: number }) {
        if (!running) return;
        if (!target.paused) painted = frame?.mediaTime;
        commit({ time: target.paused ? target.currentTime : (painted ?? target.currentTime) });
        schedule();
      }
      const start = () => {
        if (running) return;
        running = true;
        schedule();
      };

      const onMeta = () =>
        commit({
          duration: target.duration,
          time: target.currentTime,
          size: { height: target.videoHeight, width: target.videoWidth },
          status: 'ready',
        });
      const onPlay = () => {
        commit({ paused: false });
        start();
      };
      const onPause = () => {
        cancel();
        const held = painted;
        painted = undefined;
        // At the end the element must stay ended, or play() would resume on
        // the last frame instead of restarting.
        if (!atEnd() && held !== undefined && Math.abs(target.currentTime - held) > 1e-3)
          target.currentTime = held;
        commit({ paused: true, time: target.currentTime });
      };
      const onSeeked = () => {
        painted = undefined;
        commit({ time: target.currentTime });
      };
      const onRate = () => {
        if (target.playbackRate === state.rate) return;
        commit({ rate: target.playbackRate });
        options.onRateChange?.(target.playbackRate);
      };
      const onVolume = () => {
        if (target.muted === state.muted) return;
        commit({ muted: target.muted });
        options.onMutedChange?.(target.muted);
      };
      const onError = () => commit({ status: 'error' });

      // Initial props apply once; a later video (a new src) keeps the viewer's choices.
      const muted = attachedOnce ? state.muted : (options.muted ?? false);
      const rate = attachedOnce ? state.rate : (options.defaultPlaybackRate ?? 1);
      attachedOnce = true;
      commit({
        duration: Number.isFinite(target.duration) ? target.duration : 0,
        muted,
        paused: target.paused,
        rate,
        size: undefined,
        status: 'loading',
        time: target.currentTime,
      });
      if (target.muted !== muted) target.muted = muted;
      if (target.playbackRate !== rate) target.playbackRate = rate;

      const events: [string, () => void][] = [
        ['loadedmetadata', onMeta],
        ['play', onPlay],
        ['pause', onPause],
        ['ended', onPause],
        ['seeked', onSeeked],
        ['ratechange', onRate],
        ['volumechange', onVolume],
        ['error', onError],
      ];
      for (const [type, handler] of events) target.addEventListener(type, handler);
      if (target.readyState >= 1) onMeta();
      if (!target.paused) start();

      return () => {
        cancel();
        for (const [type, handler] of events) target.removeEventListener(type, handler);
        if (video === target) video = null;
      };
    },
    attachRoot: (element) => {
      root = element;
    },
    getData: () => data,
    getState: () => state,
    pause: () => video?.pause(),
    play: async () => {
      await video?.play();
    },
    reload: () => {
      if (!video) return;
      commit({ status: 'loading' });
      video.load();
    },
    requestFullscreen: async () => {
      await root?.requestFullscreen?.();
    },
    get root() {
      return root;
    },
    seek,
    setCaptions: (captions) => commit({ captions }),
    setData: (next) => {
      data = {
        ...data,
        ...next,
        sections: next.sections ? sortSections(next.sections) : data.sections,
      };
      commit({});
    },
    setMuted: (muted) => {
      if (video) video.muted = muted;
    },
    setOptions: (next) => {
      options = { ...options, ...next };
    },
    setRate: (rate) => {
      if (video) video.playbackRate = rate;
    },
    step: (frames) => {
      if (!video) return;
      const from = frameTime();
      painted = undefined;
      video.pause();
      const limit = Number.isFinite(video.duration) ? video.duration : Number.POSITIVE_INFINITY;
      video.currentTime = steppedTime(from, frames, limit, data.fps);
      commit({ time: video.currentTime });
    },
    subscribe: (listener) => {
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
      };
    },
    toggle: () => {
      if (!video) return;
      if (!video.paused) return video.pause();
      if (atEnd()) video.currentTime = 0;
      void video.play();
    },
    toggleFullscreen: () => {
      if (typeof document !== 'undefined' && document.fullscreenElement) {
        void document.exitFullscreen?.();
        return;
      }
      void root?.requestFullscreen?.();
    },
    toggleMute: () => {
      if (video) video.muted = !video.muted;
    },
    get video() {
      return video;
    },
  };

  return store;
};
