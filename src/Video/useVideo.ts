'use client';

import { useState, useSyncExternalStore } from 'react';

import { useVideoContext } from './context';
import { createVideoStore } from './store';
import type { VideoPlayer, VideoState } from './type';

const identity = (state: VideoState) => state as unknown;

export function useVideoState(player: VideoPlayer): VideoState;
export function useVideoState<T>(player: VideoPlayer, selector: (state: VideoState) => T): T;
export function useVideoState(
  player: VideoPlayer,
  selector: (state: VideoState) => unknown = identity,
) {
  return useSyncExternalStore(
    player.subscribe,
    () => selector(player.getState()),
    () => selector(player.getState()),
  );
}

export function useVideo(): VideoState;
export function useVideo<T>(selector: (state: VideoState) => T): T;
export function useVideo(selector: (state: VideoState) => unknown = identity) {
  return useVideoState(useVideoContext().store, selector);
}

export const useVideoPlayer = (): VideoPlayer => useState(createVideoStore)[0];
