'use client';

import { useEffect, useMemo, useRef, useState } from 'react';

import { styleProps } from '@/styles/stylex/props';

import { FrameContext, type FrameContextValue, useVideoContext } from '../context';
import { aspectOf, frameWidthOf, MIN_PLAYER_WIDTH } from '../sizing';
import { styles } from '../style';
import type { VideoFrameProps } from '../type';
import { useControlsIdle } from '../useControlsIdle';
import { useFullscreen } from '../useFullscreen';
import { useVideo } from '../useVideo';

const isFocusVisible = (element: Element) => {
  try {
    return element.matches(':focus-visible');
  } catch {
    return true;
  }
};

const Frame = ({ children, className, style }: VideoFrameProps) => {
  const { config, media, store } = useVideoContext();
  const fullscreen = useFullscreen(store);
  const videoRef = useRef<HTMLVideoElement>(null);
  const pointerTypeRef = useRef('mouse');
  const size = useVideo((state) => state.size);
  const idleForced = useVideo((state) => state.paused || state.status !== 'ready');
  const idle = useControlsIdle(idleForced);
  const [overlay, setOverlay] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    return store.attach(video);
  }, [store, media.src]);

  const frame = useMemo<FrameContextValue>(
    () => ({ hold: idle.hold, overlay, setOverlay, visible: idle.visible }),
    [idle.hold, idle.visible, overlay],
  );

  const aspectRatio = size?.height ? `${size.width} / ${size.height}` : '16 / 9';
  const narrow =
    config.maxHeight !== undefined &&
    !fullscreen &&
    frameWidthOf(config.maxHeight, aspectOf(size)) < MIN_PLAYER_WIDTH;
  // Overlay controls live inside the frame, so it widens and letterboxes the
  // video; controls below leave the frame at the video's own width, keeping
  // children positioned in video coordinates aligned.
  const sizing = !narrow
    ? { aspectRatio }
    : overlay
      ? { aspectRatio: `${MIN_PLAYER_WIDTH} / ${config.maxHeight}` }
      : {
          aspectRatio,
          marginInline: 'auto',
          maxWidth: `${frameWidthOf(config.maxHeight!, aspectOf(size))}px`,
        };

  return (
    <FrameContext value={frame}>
      <div
        {...styleProps(styles.frame, className, { ...sizing, ...style })}
        onBlur={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget as Node | null))
            idle.setFocused(false);
        }}
        onFocus={(event) => {
          idle.setFocused(isFocusVisible(event.target));
        }}
        onPointerDownCapture={(event) => {
          pointerTypeRef.current = event.pointerType || 'mouse';
        }}
        onPointerLeave={(event) => {
          if (event.pointerType !== 'touch') idle.sleep();
        }}
        onPointerMove={(event) => {
          if (event.pointerType !== 'touch') idle.wake();
        }}
      >
        <video
          playsInline
          autoPlay={media.autoPlay}
          loop={media.loop}
          poster={media.poster}
          preload={media.preload}
          ref={videoRef}
          src={media.src}
          onEnded={media.onEnded}
          onError={media.onError}
          onPause={media.onPause}
          onPlay={media.onPlay}
          onTimeUpdate={media.onTimeUpdate}
          {...styleProps(styles.video)}
        />
        <div
          data-video-surface=""
          {...styleProps(styles.surface)}
          onDoubleClick={() => store.toggleFullscreen()}
          onClick={() => {
            if (pointerTypeRef.current === 'touch' && !idle.visible) {
              idle.wake();
              return;
            }
            if (pointerTypeRef.current === 'touch') idle.wake();
            store.toggle();
          }}
        />
        {children}
      </div>
    </FrameContext>
  );
};

Frame.displayName = 'VideoFrame';

export default Frame;
