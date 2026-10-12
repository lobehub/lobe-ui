import type { CSSProperties, Key, ReactEventHandler, ReactNode, Ref } from 'react';

export interface VideoSection {
  start: number;
  title: string;
}

export type VideoMarkerColor = 'success' | 'warning' | 'error' | 'info' | (string & {});

export interface VideoMarker {
  color?: VideoMarkerColor;
  content?: ReactNode;
  key?: Key;
  label?: ReactNode;
  time: number;
}

export type VideoStatus = 'loading' | 'ready' | 'error';

export interface VideoState {
  activeMarkers: VideoMarker[];
  activeSection?: VideoSection;
  captions: boolean;
  duration: number;
  muted: boolean;
  paused: boolean;
  rate: number;
  size?: { height: number; width: number };
  status: VideoStatus;
  time: number;
}

export interface VideoPlayer {
  getState: () => VideoState;
  pause: () => void;
  play: () => Promise<void>;
  requestFullscreen: () => Promise<void>;
  readonly root: HTMLDivElement | null;
  seek: (seconds: number) => void;
  setCaptions: (captions: boolean) => void;
  setMuted: (muted: boolean) => void;
  setRate: (rate: number) => void;
  step: (frames: number) => void;
  subscribe: (listener: (state: VideoState) => void) => () => void;
  toggle: () => void;
  toggleMute: () => void;
  readonly video: HTMLVideoElement | null;
}

export interface VideoMediaProps {
  autoPlay?: boolean;
  loop?: boolean;
  onEnded?: ReactEventHandler<HTMLVideoElement>;
  onError?: ReactEventHandler<HTMLVideoElement>;
  onPause?: ReactEventHandler<HTMLVideoElement>;
  onPlay?: ReactEventHandler<HTMLVideoElement>;
  onTimeUpdate?: ReactEventHandler<HTMLVideoElement>;
  poster?: string;
  preload?: HTMLVideoElement['preload'];
  src: string;
}

export interface VideoRootProps extends VideoMediaProps {
  captions?: boolean;
  children?: ReactNode;
  className?: string;
  defaultPlaybackRate?: number;
  fps?: number;
  height?: number | string;
  markers?: VideoMarker[];
  maxHeight?: number;
  muted?: boolean;
  onMarkerClick?: (marker: VideoMarker) => void;
  onMutedChange?: (muted: boolean) => void;
  onRateChange?: (rate: number) => void;
  onRetry?: () => Promise<unknown> | void;
  playbackRates?: number[];
  player?: VideoPlayer;
  ref?: Ref<VideoPlayer>;
  sections?: VideoSection[];
  style?: CSSProperties;
  width?: number | string;
}

export interface VideoTimelineProps {
  children?: ReactNode;
  className?: string;
  style?: CSSProperties;
  thumbnails?: boolean;
}

export interface VideoControlsProps {
  children?: ReactNode;
  className?: string;
  extra?: ReactNode;
  frameStep?: boolean;
  style?: CSSProperties;
}

export interface VideoCaptionProps {
  action?: (marker: VideoMarker) => ReactNode;
  className?: string;
  style?: CSSProperties;
}

export interface VideoFrameProps {
  children?: ReactNode;
  className?: string;
  style?: CSSProperties;
}

export interface VideoSectionListProps {
  className?: string;
  style?: CSSProperties;
}

export interface VideoProps extends Omit<VideoRootProps, 'children'> {
  classNames?: {
    controls?: string;
    frame?: string;
    root?: string;
    timeline?: string;
  };
  frameStep?: boolean;
  overlay?: (state: VideoState) => ReactNode;
  styles?: {
    controls?: CSSProperties;
    frame?: CSSProperties;
    root?: CSSProperties;
    timeline?: CSSProperties;
  };
  thumbnails?: boolean;
}
