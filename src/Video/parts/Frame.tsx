'use client';

import { useEffect, useMemo, useRef } from 'react';

import { styleProps } from '@/styles/stylex/props';

import { FrameContext, type FrameContextValue, useVideoContext } from '../context';
import { styles } from '../style';
import type { VideoFrameProps } from '../type';
import { useControlsIdle } from '../useControlsIdle';
import { useVideo } from '../useVideo';

const isFocusVisible = (element: Element) => {
  try {
    return element.matches(':focus-visible');
  } catch {
    return true;
  }
};

const Frame = ({ children, className, style }: VideoFrameProps) => {
  const { media, store } = useVideoContext();
  const videoRef = useRef<HTMLVideoElement>(null);
  const pointerTypeRef = useRef('mouse');
  const size = useVideo((state) => state.size);
  const idleForced = useVideo((state) => state.paused || state.status !== 'ready');
  const idle = useControlsIdle(idleForced);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    return store.attach(video);
  }, [store, media.src]);

  const frame = useMemo<FrameContextValue>(
    () => ({ hold: idle.hold, visible: idle.visible }),
    [idle.hold, idle.visible],
  );

  const aspectRatio = size?.height ? `${size.width} / ${size.height}` : '16 / 9';

  return (
    <FrameContext value={frame}>
      <div
        {...styleProps(styles.frame, className, { aspectRatio, ...style })}
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
