'use client';

import {
  type PointerEvent as ReactPointerEvent,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import videoMessages from '@/i18n/resources/en/video';
import { useTranslation } from '@/i18n/useTranslation';
import { styleProps } from '@/styles/stylex/props';

import { useVideoContext } from '../context';
import { markerColor, styles } from '../style';
import { formatTime, mergeSegments, sectionAt } from '../time';
import type { VideoMarker, VideoState, VideoTimelineProps } from '../type';
import { useVideo } from '../useVideo';
import HoverPreview from './HoverPreview';

const SNAP_RATIO = 0.012;
const GAP_PX = 3;
const PREVIEW_HALF = 88;

interface Hover {
  marker?: VideoMarker;
  time: number;
  x: number;
}

const canHover = () =>
  typeof window === 'undefined' || !window.matchMedia?.('(hover: none)').matches;

const markerName = (marker: VideoMarker) =>
  [formatTime(marker.time), marker.label, marker.content]
    .filter((part) => typeof part === 'string')
    .join(' ');

const Timeline = ({ children, className, style, thumbnails = true }: VideoTimelineProps) => {
  const { config, media, store } = useVideoContext();
  const { t } = useTranslation(videoMessages);
  const duration = useVideo((state) => (Number.isFinite(state.duration) ? state.duration : 0));
  const trackRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);
  const [hover, setHover] = useState<Hover | null>(null);
  const [hovering, setHovering] = useState(false);

  useLayoutEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    setWidth(track.getBoundingClientRect().width);
    if (typeof ResizeObserver === 'undefined') return;
    const observer = new ResizeObserver(([entry]) => setWidth(entry.contentRect.width));
    observer.observe(track);
    return () => observer.disconnect();
  }, []);

  // Playback must not re-render the timeline: the playhead and the played
  // fills read --video-time, written straight to the track on every frame.
  useLayoutEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const setOnChange = (name: string, value: string) => {
      if (track.getAttribute(name) !== value) track.setAttribute(name, value);
    };
    const paint = (state: VideoState) => {
      track.style.setProperty('--video-time', String(state.time));
      setOnChange('aria-valuenow', String(Math.round(state.time)));
      setOnChange(
        'aria-valuetext',
        [`${formatTime(state.time)} / ${formatTime(state.duration)}`, state.activeSection?.title]
          .filter(Boolean)
          .join(', '),
      );
    };
    paint(store.getState());
    return store.subscribe(paint);
  }, [store]);

  const { hairlines, segments } = useMemo(
    () => mergeSegments(config.sections, duration, width),
    [config.sections, duration, width],
  );

  const visibleMarkers = useMemo(
    () => config.markers.filter((marker) => marker.time >= 0 && marker.time <= duration),
    [config.markers, duration],
  );

  const pct = (seconds: number) => (duration > 0 ? (seconds / duration) * 100 : 0);
  const timeAt = (element: HTMLElement, clientX: number) => {
    const box = element.getBoundingClientRect();
    if (!box.width) return 0;
    return Math.min(Math.max((clientX - box.left) / box.width, 0), 1) * duration;
  };

  const onPointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (event.button !== 0 || !duration) return;
    const element = event.currentTarget;
    store.seek(timeAt(element, event.clientX));
    element.setPointerCapture?.(event.pointerId);
    const move = (next: PointerEvent) => store.seek(timeAt(element, next.clientX));
    const up = () => {
      element.removeEventListener('pointermove', move);
      element.removeEventListener('pointerup', up);
      element.removeEventListener('pointercancel', up);
    };
    element.addEventListener('pointermove', move);
    element.addEventListener('pointerup', up);
    element.addEventListener('pointercancel', up);
  };

  const onPointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (event.pointerType === 'touch' || !duration || !canHover()) return;
    const element = event.currentTarget;
    const box = element.getBoundingClientRect();
    const seconds = timeAt(element, event.clientX);
    const snap = duration * SNAP_RATIO;
    const marker = visibleMarkers.find((item) => Math.abs(item.time - seconds) < snap);
    setHovering(true);
    setHover({
      marker,
      time: marker?.time ?? seconds,
      x: Math.min(
        Math.max(event.clientX - box.left, PREVIEW_HALF),
        Math.max(box.width - PREVIEW_HALF, PREVIEW_HALF),
      ),
    });
  };

  return (
    <div {...styleProps(undefined, className, { position: 'relative', ...style })}>
      {hover && (
        <HoverPreview
          marker={hover.marker}
          section={sectionAt(config.sections, hover.time)}
          src={media.src}
          thumbnail={thumbnails}
          time={hover.time}
          visible={hovering}
          x={hover.x}
        />
      )}
      <div
        aria-label={t('video.seek')}
        aria-valuemax={Math.round(duration)}
        aria-valuemin={0}
        ref={trackRef}
        role="slider"
        {...styleProps(styles.track)}
        onPointerDown={onPointerDown}
        onPointerLeave={() => setHovering(false)}
        onPointerMove={onPointerMove}
      >
        {segments.map((segment, index) => {
          const span = segment.end - segment.start;
          const hovered =
            hovering && hover !== null && hover.time >= segment.start && hover.time < segment.end;
          const hoverFill =
            hovering && hover ? Math.min(Math.max((hover.time - segment.start) / span, 0), 1) : 0;
          const leftInset = index === 0 ? 0 : GAP_PX / 2;
          const rightInset = index === segments.length - 1 ? 0 : GAP_PX / 2;
          return (
            <div
              data-video-segment=""
              key={segment.start}
              {...styleProps([styles.segment, hovered && styles.segmentHovered], undefined, {
                left: `calc(${pct(segment.start)}% + ${leftInset}px)`,
                width: `calc(${pct(span)}% - ${leftInset + rightInset}px)`,
              })}
            >
              {hoverFill > 0 && (
                <div
                  {...styleProps(styles.segmentFill, undefined, {
                    background: 'rgb(255 255 255 / 32%)',
                    width: `${hoverFill * 100}%`,
                  })}
                />
              )}
              <div
                {...styleProps(styles.segmentFill, undefined, {
                  background: '#fff',
                  width: `calc(clamp(0, (var(--video-time, 0) - ${segment.start}) / ${span}, 1) * 100%)`,
                })}
              />
            </div>
          );
        })}
        {hairlines.map((at) => (
          <div key={at} {...styleProps(styles.hairline, undefined, { left: `${pct(at)}%` })} />
        ))}
        <div
          {...styleProps(styles.head, undefined, {
            left: duration > 0 ? `calc(var(--video-time, 0) / ${duration} * 100%)` : 0,
          })}
        />
        {visibleMarkers.map((marker, index) => (
          <button
            aria-label={markerName(marker)}
            key={marker.key ?? `${marker.time}-${index}`}
            type="button"
            {...styleProps(styles.marker, undefined, {
              background: markerColor(marker.color),
              left: `${pct(marker.time)}%`,
            })}
            onPointerDown={(event) => event.stopPropagation()}
            onClick={(event) => {
              event.stopPropagation();
              store.pause();
              store.seek(marker.time);
              store.setCaptions(true);
              config.onMarkerClick?.(marker);
            }}
          />
        ))}
      </div>
      {children}
    </div>
  );
};

Timeline.displayName = 'VideoTimeline';

export default Timeline;
