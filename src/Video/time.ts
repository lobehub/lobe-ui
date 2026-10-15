import type { VideoMarker, VideoSection } from './type';

export const CAPTION_SECONDS = 2;
export const MIN_SEGMENT_PX = 12;

const pad = (value: number) => String(value).padStart(2, '0');

export const formatTime = (seconds: number) => {
  const total = Number.isFinite(seconds) && seconds > 0 ? Math.floor(seconds) : 0;
  const hours = Math.floor(total / 3600);
  const minutes = Math.floor((total % 3600) / 60);
  const rest = total % 60;
  return hours > 0 ? `${hours}:${pad(minutes)}:${pad(rest)}` : `${minutes}:${pad(rest)}`;
};

// The epsilon absorbs float error at exact frame boundaries.
export const frameOf = (seconds: number, fps: number) => Math.floor(seconds * fps + 1e-6);

// Landing on frame centres means repeated steps never skip a frame or show one twice.
export const steppedTime = (current: number, frames: number, duration: number, fps: number) =>
  Math.min(Math.max((frameOf(current, fps) + frames + 0.5) / fps, 0), duration);

export const sortSections = (sections: VideoSection[]) =>
  [...sections].sort((a, b) => a.start - b.start);

export const sectionAt = (sorted: VideoSection[], time: number) =>
  sorted.findLast((section) => section.start <= time + 0.01);

export const markersAt = (markers: VideoMarker[], time: number, fps: number): VideoMarker[] => {
  let latest: number | undefined;
  for (const marker of markers) {
    if (marker.content === undefined || marker.content === null) continue;
    const onScreen = time >= marker.time - 0.5 / fps && time < marker.time + CAPTION_SECONDS;
    if (onScreen && (latest === undefined || marker.time > latest)) latest = marker.time;
  }
  if (latest === undefined) return [];
  return markers.filter(
    (marker) => marker.time === latest && marker.content !== undefined && marker.content !== null,
  );
};

export interface Segment {
  end: number;
  start: number;
}

export const mergeSegments = (
  sorted: VideoSection[],
  duration: number,
  trackPx: number,
  minPx = MIN_SEGMENT_PX,
): { hairlines: number[]; segments: Segment[] } => {
  if (!(duration > 0)) return { hairlines: [], segments: [] };

  const cuts = [
    ...new Set(sorted.map((s) => s.start).filter((start) => start > 0 && start < duration)),
  ];
  const bounds = [0, ...cuts, duration];
  const segments: Segment[] = [];
  const hairlines: number[] = [];
  const minSeconds = trackPx > 0 ? (minPx / trackPx) * duration : 0;
  let carry = false;

  for (let i = 0; i < bounds.length - 1; i++) {
    const raw = { end: bounds[i + 1], start: bounds[i] };
    const narrow = raw.end - raw.start < minSeconds;
    const last = segments.at(-1);
    if (last && (narrow || carry)) {
      last.end = raw.end;
      hairlines.push(raw.start);
      carry = false;
      continue;
    }
    segments.push(raw);
    carry = narrow;
  }

  return { hairlines, segments };
};
