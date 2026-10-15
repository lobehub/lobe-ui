'use client';

import { createContext, use } from 'react';

import type { VideoStore } from './store';
import type { VideoMarker, VideoMediaProps, VideoSection } from './type';

export interface VideoConfig {
  fps: number;
  markers: VideoMarker[];
  onMarkerClick?: (marker: VideoMarker) => void;
  onRetry?: () => Promise<unknown> | void;
  playbackRates?: number[];
  sections: VideoSection[];
}

export interface VideoContextValue {
  config: VideoConfig;
  media: VideoMediaProps;
  store: VideoStore;
}

export const VideoContext = createContext<VideoContextValue | null>(null);

export const useVideoContext = () => {
  const value = use(VideoContext);
  if (!value) throw new Error('Video parts must be rendered inside <Video.Root>.');
  return value;
};

export interface FrameContextValue {
  hold: (held: boolean) => void;
  overlay: boolean;
  setOverlay: (overlay: boolean) => void;
  visible: boolean;
}

export const FrameContext = createContext<FrameContextValue | null>(null);
