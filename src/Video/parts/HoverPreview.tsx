'use client';

import { useEffect, useRef } from 'react';

import { styleProps } from '@/styles/stylex/props';

import { markerColor, styles } from '../style';
import { formatTime } from '../time';
import type { VideoMarker, VideoSection } from '../type';

export interface HoverPreviewProps {
  marker?: VideoMarker;
  section?: VideoSection;
  src: string;
  thumbnail: boolean;
  time: number;
  visible: boolean;
  x: number;
}

// The frame comes from a hidden second <video>: seeking the one on screen
// would move the playhead the viewer is holding. Seeks queue so a fast sweep
// paints the latest position instead of stalling on stale frames.
const Thumbnail = ({ src, time }: { src: string; time: number }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const probeRef = useRef<HTMLVideoElement>(null);
  const pendingRef = useRef<number | null>(null);
  const busyRef = useRef(false);

  useEffect(() => {
    const probe = probeRef.current;
    if (!probe) return;
    const paint = () => {
      const canvas = canvasRef.current;
      try {
        canvas?.getContext('2d')?.drawImage(probe, 0, 0, canvas.width, canvas.height);
      } catch {
        // A frame that cannot be decoded yet leaves the previous paint in place.
      }
      busyRef.current = false;
      if (pendingRef.current === null) return;
      busyRef.current = true;
      probe.currentTime = pendingRef.current;
      pendingRef.current = null;
    };
    const reset = () => {
      busyRef.current = false;
    };
    probe.addEventListener('seeked', paint);
    probe.addEventListener('error', reset);
    return () => {
      probe.removeEventListener('seeked', paint);
      probe.removeEventListener('error', reset);
      // An unmounted element with a src keeps downloading until it is collected.
      probe.removeAttribute('src');
      probe.load?.();
    };
  }, []);

  useEffect(() => {
    const probe = probeRef.current;
    if (!probe) return;
    if (busyRef.current) {
      pendingRef.current = time;
      return;
    }
    busyRef.current = true;
    probe.currentTime = time;
  }, [time]);

  return (
    <>
      <video
        muted
        playsInline
        preload="auto"
        ref={probeRef}
        src={src}
        style={{ display: 'none' }}
      />
      <canvas height={99} ref={canvasRef} width={176} {...styleProps(styles.previewCanvas)} />
    </>
  );
};

const HoverPreview = ({ marker, section, src, thumbnail, time, visible, x }: HoverPreviewProps) => (
  <div
    {...styleProps(styles.preview, undefined, { display: visible ? undefined : 'none', left: x })}
  >
    {thumbnail && <Thumbnail src={src} time={time} />}
    {(section || marker) && (
      <div {...styleProps(styles.previewLabel)}>
        {section && <div {...styleProps(styles.previewTitle)}>{section.title}</div>}
        {marker && (
          <div>
            <span
              {...styleProps(styles.dot, undefined, {
                background: markerColor(marker.color),
                display: 'inline-block',
                marginInlineEnd: 6,
              })}
            />
            {marker.content ?? marker.label}
          </div>
        )}
      </div>
    )}
    <div {...styleProps(styles.previewTime)}>{formatTime(time)}</div>
  </div>
);

export default HoverPreview;
