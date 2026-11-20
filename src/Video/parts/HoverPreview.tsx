'use client';

import { useEffect, useRef, useState } from 'react';

import { styleProps } from '@/styles/stylex/props';

import { previewSizeOf } from '../sizing';
import { markerColor, styles } from '../style';
import { formatTime } from '../time';
import type { VideoMarker, VideoSection, VideoState } from '../type';

export interface HoverPreviewProps {
  marker?: VideoMarker;
  section?: VideoSection;
  size?: VideoState['size'];
  src: string;
  thumbnail: boolean;
  time: number;
  visible: boolean;
  x: number;
}

// Backing store for the canvas: 2× the CSS box keeps the frame crisp on retina
// displays without depending on the hover-time devicePixelRatio.
const PREVIEW_SCALE = 2;

// The frame comes from a hidden second <video>: seeking the one on screen
// would move the playhead the viewer is holding. Seeks queue so a fast sweep
// paints the latest position instead of stalling on stale frames.
const Thumbnail = ({
  size,
  src,
  time,
}: {
  size?: VideoState['size'];
  src: string;
  time: number;
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const probeRef = useRef<HTMLVideoElement>(null);
  const pendingRef = useRef<number | null>(null);
  const busyRef = useRef(false);
  // The player's metadata is usually there first, but a hover can outrun a
  // player that is still loading; the probe then reports its own shape.
  const [probeSize, setProbeSize] = useState<VideoState['size']>();
  const { height, width } = previewSizeOf(size ?? probeSize);

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
    const readSize = () => {
      setProbeSize({ height: probe.videoHeight, width: probe.videoWidth });
    };
    probe.addEventListener('seeked', paint);
    probe.addEventListener('error', reset);
    probe.addEventListener('loadedmetadata', readSize);
    return () => {
      probe.removeEventListener('seeked', paint);
      probe.removeEventListener('error', reset);
      probe.removeEventListener('loadedmetadata', readSize);
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

  // Resizing the canvas clears it; repaint the frame the probe already holds.
  useEffect(() => {
    const canvas = canvasRef.current;
    const probe = probeRef.current;
    if (!canvas || !probe || probe.readyState < 2) return;
    try {
      canvas.getContext('2d')?.drawImage(probe, 0, 0, canvas.width, canvas.height);
    } catch {
      // Keep whatever is already painted.
    }
  }, [height, width]);

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
      <canvas
        height={height * PREVIEW_SCALE}
        ref={canvasRef}
        width={width * PREVIEW_SCALE}
        {...styleProps(styles.previewCanvas, undefined, { height, width })}
      />
    </>
  );
};

const HoverPreview = ({
  marker,
  section,
  size,
  src,
  thumbnail,
  time,
  visible,
  x,
}: HoverPreviewProps) => (
  <div
    {...styleProps(styles.preview, undefined, { display: visible ? undefined : 'none', left: x })}
  >
    {thumbnail && <Thumbnail size={size} src={src} time={time} />}
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
