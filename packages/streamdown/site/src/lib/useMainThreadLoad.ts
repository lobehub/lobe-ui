import { useEffect, useState } from 'react';

const INTERVAL = 200;
const SMOOTHING = 0.25;

interface PressureRecord {
  state: string;
}

interface PressureObserverLike {
  disconnect: () => void;
  observe: (source: string, options?: { sampleInterval?: number }) => Promise<void>;
}

type PressureObserverCtor = new (
  callback: (records: PressureRecord[]) => void,
) => PressureObserverLike;

/**
 * Browsers expose no CPU percentage. Two real signals stand in for it: event-loop
 * lag (how long a 200ms timer is actually delayed — a direct read of main-thread
 * saturation) and, where the Compute Pressure API exists, the OS-level CPU state.
 */
export const useMainThreadLoad = () => {
  const [busy, setBusy] = useState(0);
  const [peak, setPeak] = useState(0);
  const [pressure, setPressure] = useState('');

  useEffect(() => {
    let last = performance.now();
    let smoothed = 0;

    const timer = setInterval(() => {
      const now = performance.now();
      const elapsed = now - last;
      last = now;

      const ratio = Math.max(0, elapsed - INTERVAL) / elapsed;
      smoothed = smoothed * (1 - SMOOTHING) + ratio * SMOOTHING;

      setBusy(smoothed * 100);
      setPeak((current) => Math.max(current, ratio * 100));
    }, INTERVAL);

    const Ctor = (globalThis as unknown as { PressureObserver?: PressureObserverCtor })
      .PressureObserver;
    const observer = Ctor
      ? new Ctor((records) => setPressure(records.at(-1)?.state ?? ''))
      : undefined;
    observer?.observe('cpu', { sampleInterval: 1000 }).catch(() => {});

    return () => {
      clearInterval(timer);
      observer?.disconnect();
    };
  }, []);

  return { busy, peak, pressure };
};
