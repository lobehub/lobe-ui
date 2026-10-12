'use client';

import {
  Captions,
  ChevronLeft,
  ChevronRight,
  Maximize,
  Minimize,
  Volume2,
  VolumeX,
} from 'lucide-react';
import { type ReactNode, use, useLayoutEffect } from 'react';

import videoMessages from '@/i18n/resources/en/video';
import { useTranslation } from '@/i18n/useTranslation';
import { styleProps } from '@/styles/stylex/props';

import { FrameContext, useVideoContext } from '../context';
import { styles } from '../style';
import { formatTime, frameOf } from '../time';
import type { VideoControlsProps } from '../type';
import { useFullscreen } from '../useFullscreen';
import { useVideo } from '../useVideo';
import PlayPauseIcon from './PlayPauseIcon';
import RateMenu from './RateMenu';
import SectionMenu from './SectionMenu';
import Timeline from './Timeline';

const BarButton = ({
  active,
  children,
  label,
  onClick,
  pressed,
  shortcut,
}: {
  active?: boolean;
  children: ReactNode;
  label: string;
  onClick: () => void;
  pressed?: boolean;
  shortcut?: string;
}) => (
  <button
    aria-label={label}
    aria-pressed={pressed}
    title={shortcut ? `${label} (${shortcut})` : label}
    type="button"
    {...styleProps([styles.barButton, active && styles.barButtonActive])}
    onClick={onClick}
  >
    {children}
  </button>
);

// Leaves so playback re-renders only these, and the clock only once a second.
const TimeReadout = () => {
  const seconds = useVideo((state) => Math.floor(state.time));
  const duration = useVideo((state) => state.duration);
  return (
    <span {...styleProps(styles.time, undefined, { marginInline: 6 })}>
      {`${formatTime(seconds)} / ${formatTime(duration)}`}
    </span>
  );
};

const FrameReadout = () => {
  const { config } = useVideoContext();
  const { t } = useTranslation(videoMessages);
  const frame = useVideo((state) => frameOf(state.time, config.fps));
  return (
    <span {...styleProps(styles.frameNo, undefined, { marginInlineEnd: 6 })}>
      {`${t('video.frame')} ${frame}`}
    </span>
  );
};

const Controls = ({ children, className, extra, frameStep, style }: VideoControlsProps) => {
  const { config, store } = useVideoContext();
  const frame = use(FrameContext);
  const { t } = useTranslation(videoMessages);
  const paused = useVideo((state) => state.paused);
  const muted = useVideo((state) => state.muted);
  const captions = useVideo((state) => state.captions);
  const ready = useVideo((state) => state.status === 'ready');
  const fullscreen = useFullscreen(store);
  const overlay = frame !== null;

  useLayoutEffect(() => {
    if (!frame) return;
    frame.setOverlay(true);
    return () => frame.setOverlay(false);
  }, [frame?.setOverlay]);
  const visible = !overlay || frame.visible;
  const hasCaptions = config.markers.some(
    (marker) => marker.content !== undefined && marker.content !== null,
  );

  return (
    <div
      data-video-controls=""
      data-visible={String(visible)}
      {...styleProps(
        [
          styles.controls,
          overlay ? styles.controlsOverlay : styles.controlsBelow,
          overlay && !visible && styles.controlsHidden,
        ],
        className,
        style,
      )}
      onClick={(event) => event.stopPropagation()}
      onDoubleClick={(event) => event.stopPropagation()}
    >
      <div {...styleProps(!ready && styles.disabled)}>
        {children ?? <Timeline />}
        <div {...styleProps(styles.row)}>
          <BarButton
            label={paused ? t('video.play') : t('video.pause')}
            shortcut="K"
            onClick={store.toggle}
          >
            <PlayPauseIcon paused={paused} />
          </BarButton>
          <BarButton
            label={muted ? t('video.unmute') : t('video.mute')}
            shortcut="M"
            onClick={store.toggleMute}
          >
            {muted ? <VolumeX size={16} /> : <Volume2 size={16} />}
          </BarButton>
          {frameStep && (
            <>
              <BarButton
                label={t('video.previousFrame')}
                shortcut=","
                onClick={() => store.step(-1)}
              >
                <ChevronLeft size={16} />
              </BarButton>
              <BarButton label={t('video.nextFrame')} shortcut="." onClick={() => store.step(1)}>
                <ChevronRight size={16} />
              </BarButton>
            </>
          )}
          <TimeReadout />
          {frameStep && <FrameReadout />}
          <SectionMenu />
          <div {...styleProps(styles.spacer)} />
          {extra}
          {hasCaptions && (
            <BarButton
              active={captions}
              label={captions ? t('video.captionsHide') : t('video.captionsShow')}
              pressed={captions}
              shortcut="C"
              onClick={() => store.setCaptions(!captions)}
            >
              <Captions size={16} />
            </BarButton>
          )}
          <RateMenu />
          <BarButton
            label={fullscreen ? t('video.exitFullscreen') : t('video.fullscreen')}
            shortcut="F"
            onClick={store.toggleFullscreen}
          >
            {fullscreen ? <Minimize size={15} /> : <Maximize size={15} />}
          </BarButton>
        </div>
      </div>
    </div>
  );
};

Controls.displayName = 'VideoControls';

export default Controls;
