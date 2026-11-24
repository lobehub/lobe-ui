'use client';

import { useEffect, useState } from 'react';

import type { ElapsedTimeFormat, ElapsedTimeValue, UseElapsedOptions } from './type';

const pad = (value: number) => String(value).padStart(2, '0');

export const toTimestamp = (value?: ElapsedTimeValue | null): number | undefined => {
  if (value === undefined || value === null) return undefined;
  const time = value instanceof Date ? value.getTime() : new Date(value).getTime();
  return Number.isFinite(time) ? time : undefined;
};

/**
 * `short`: `850ms`, `12.3s`, `1m 05s`, `1h 02m`. Tenths are dropped past a minute,
 * where they stop carrying information.
 * `clock`: `00:12`, `12:05`, `1:02:03`.
 */
export const formatElapsed = (milliseconds: number, format: ElapsedTimeFormat = 'short') => {
  const ms = Math.max(0, Number.isFinite(milliseconds) ? milliseconds : 0);
  const totalSeconds = Math.floor(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  if (format === 'clock') {
    return hours > 0
      ? `${hours}:${pad(minutes)}:${pad(seconds)}`
      : `${pad(minutes)}:${pad(seconds)}`;
  }

  if (ms < 1000) return `${Math.round(ms)}ms`;
  if (ms < 60_000) return `${(ms / 1000).toFixed(1)}s`;
  if (hours > 0) return `${hours}h ${pad(minutes)}m`;
  return `${minutes}m ${pad(seconds)}s`;
};

/**
 * Milliseconds since `startTime` (or since the hook mounted), refreshed on an
 * interval while enabled. Returns 0 until the first client render, so server and
 * client markup agree.
 */
export const useElapsed = (
  startTime?: ElapsedTimeValue | null,
  { enabled = true, interval = 1000 }: UseElapsedOptions = {},
): number => {
  const start = toTimestamp(startTime);
  const [mountedAt, setMountedAt] = useState<number>();
  const [now, setNow] = useState<number>();

  useEffect(() => {
    const current = Date.now();
    setMountedAt((previous) => previous ?? current);
    setNow(current);
    if (!enabled) return;
    const timer = setInterval(() => setNow(Date.now()), Math.max(16, interval));
    return () => clearInterval(timer);
  }, [enabled, interval, start]);

  const origin = start ?? mountedAt;
  if (now === undefined || origin === undefined) return 0;
  return Math.max(0, now - origin);
};
