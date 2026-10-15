'use client';

import { useImperativeHandle, useLayoutEffect, useMemo, useState } from 'react';

import { styleProps } from '@/styles/stylex/props';

import { VideoContext, type VideoContextValue } from '../context';
import { createVideoStore, type VideoStore } from '../store';
import { styles } from '../style';
import { sortSections } from '../time';
import type { VideoMarker, VideoRootProps, VideoSection } from '../type';
import { handleVideoKey } from '../useKeyboard';
import { useVideoState } from '../useVideo';

const NO_MARKERS: VideoMarker[] = [];
const NO_SECTIONS: VideoSection[] = [];

const Root = ({
  ref,
  player,
  src,
  poster,
  autoPlay,
  loop,
  preload = 'metadata',
  onPlay,
  onPause,
  onEnded,
  onError,
  onTimeUpdate,
  sections = NO_SECTIONS,
  markers = NO_MARKERS,
  fps = 30,
  playbackRates,
  defaultPlaybackRate,
  muted,
  onMutedChange,
  onRateChange,
  onMarkerClick,
  onRetry,
  captions = true,
  width,
  height,
  maxHeight,
  className,
  style,
  children,
}: VideoRootProps) => {
  const [ownStore] = useState(createVideoStore);
  const store = (player as VideoStore | undefined) ?? ownStore;

  // Assigned during render so the store already has them when a child Frame
  // attaches its <video> in an effect, which runs before this component's own.
  store.setOptions({ defaultPlaybackRate, muted, onMutedChange, onRateChange });

  useImperativeHandle(ref, () => store, [store]);

  const sorted = useMemo(() => sortSections(sections), [sections]);

  useLayoutEffect(() => {
    store.setData({ fps, markers, sections: sorted });
  }, [store, fps, markers, sorted]);

  useLayoutEffect(() => {
    if (!captions) store.setCaptions(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [store]);

  const size = useVideoState(store, (state) => state.size);
  const aspect = size?.height ? size.width / size.height : 16 / 9;
  const sizing =
    maxHeight === undefined
      ? { height, width }
      : { maxWidth: `${Math.round(maxHeight * aspect)}px`, width: '100%' };

  const value = useMemo<VideoContextValue>(
    () => ({
      config: { fps, markers, onMarkerClick, onRetry, playbackRates, sections: sorted },
      media: {
        autoPlay,
        loop,
        onEnded,
        onError,
        onPause,
        onPlay,
        onTimeUpdate,
        poster,
        preload,
        src,
      },
      store,
    }),
    [
      autoPlay,
      fps,
      loop,
      markers,
      onEnded,
      onError,
      onMarkerClick,
      onPause,
      onPlay,
      onRetry,
      onTimeUpdate,
      playbackRates,
      poster,
      preload,
      sorted,
      src,
      store,
    ],
  );

  return (
    <VideoContext value={value}>
      <div
        ref={store.attachRoot}
        tabIndex={0}
        onKeyDown={(event) => {
          if (handleVideoKey(event, store, playbackRates)) event.preventDefault();
        }}
        {...styleProps(styles.root, className, { ...sizing, ...style })}
      >
        {children}
      </div>
    </VideoContext>
  );
};

Root.displayName = 'VideoRoot';

export default Root;
