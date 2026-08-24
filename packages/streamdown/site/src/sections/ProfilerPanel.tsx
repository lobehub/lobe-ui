import {
  type StreamdownProfiler,
  type StreamdownProfilerSnapshot,
} from '@lobehub/streamdown/profiler';
import { useSyncExternalStore } from 'react';

import { useMainThreadLoad } from '../lib/useMainThreadLoad';

const formatMs = (value: number) => {
  if (value >= 100) return value.toFixed(0);
  if (value >= 10) return value.toFixed(1);
  return value.toFixed(2);
};

const Stat = ({
  hint,
  label,
  unit,
  value,
}: {
  hint: string;
  label: string;
  unit: string;
  value: string;
}) => (
  <div className="stat">
    <div className="stat-key">{label}</div>
    <div className="stat-value">
      {value}
      <small> {unit}</small>
    </div>
    <div className="stat-hint">{hint}</div>
  </div>
);

export const ProfilerRate = ({ profiler }: { profiler: StreamdownProfiler }) => {
  const { fps } = useSyncExternalStore(
    profiler.subscribe,
    profiler.getSnapshot,
    profiler.getSnapshot,
  );

  return (
    <span className="live-dot">
      <i />
      {fps.currentFps.toFixed(0)}/s commits · avg {fps.avgFps.toFixed(0)}
    </span>
  );
};

export const ProfilerPanel = ({ profiler }: { profiler: StreamdownProfiler }) => {
  const snapshot: StreamdownProfilerSnapshot = useSyncExternalStore(
    profiler.subscribe,
    profiler.getSnapshot,
    profiler.getSnapshot,
  );

  const { animation, blocksAggregate, input, root } = snapshot;
  const { busy, peak, pressure } = useMainThreadLoad();

  return (
    <div className="stats">
      <Stat
        hint={pressure ? `peak ${peak.toFixed(0)}% · cpu ${pressure}` : `peak ${peak.toFixed(0)}%`}
        label="Main thread"
        unit="%"
        value={busy.toFixed(1)}
      />
      <Stat
        hint={`max ${formatMs(root.maxMs)} · ${root.updateCount} upd`}
        label="Root commit"
        unit="ms"
        value={formatMs(root.avgMs)}
      />
      <Stat
        hint={`max ${formatMs(blocksAggregate.maxMs)} · ${blocksAggregate.trackedCount} blk`}
        label="Block commit"
        unit="ms"
        value={formatMs(blocksAggregate.avgMs)}
      />
      <Stat
        hint={`${animation.revealFrameCount} rev · backlog ${animation.lastBacklog}`}
        label="Reveal frame"
        unit="ms"
        value={formatMs(animation.avgMs)}
      />
      <Stat
        hint={`${input.count} chunks · ${input.totalChars} ch`}
        label="Input chunk"
        unit="ch"
        value={input.avgChars.toFixed(1)}
      />
    </div>
  );
};
