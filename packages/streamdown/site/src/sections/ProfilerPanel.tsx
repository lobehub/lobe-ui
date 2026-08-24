import {
  type StreamdownProfiler,
  type StreamdownProfilerSnapshot,
} from '@lobehub/streamdown/profiler';
import { useSyncExternalStore } from 'react';

const formatMs = (value: number) => {
  if (value >= 100) return `${value.toFixed(0)}ms`;
  if (value >= 10) return `${value.toFixed(1)}ms`;
  return `${value.toFixed(2)}ms`;
};

const Metric = ({ hint, label, value }: { hint: string; label: string; value: string }) => (
  <div className="metric">
    <div className="metric-label">{label}</div>
    <div className="metric-value">{value}</div>
    <div className="metric-hint">{hint}</div>
  </div>
);

const CommitRateSparkline = ({ samples }: { samples: number[] }) => {
  const width = 280;
  const height = 60;
  const ceiling = Math.max(...samples, 1);
  const points = samples
    .map((sample, index) => {
      const x = samples.length === 1 ? width / 2 : (index / (samples.length - 1)) * width;
      const y = height - (sample / ceiling) * height;
      return `${x},${Math.max(0, Math.min(height, y))}`;
    })
    .join(' ');

  return (
    <svg
      aria-label="Commit rate sparkline"
      className="sparkline"
      role="img"
      viewBox={`0 0 ${width} ${height}`}
    >
      {samples.length > 0 && (
        <polyline
          fill="none"
          points={points}
          stroke="var(--accent)"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
        />
      )}
    </svg>
  );
};

export const ProfilerPanel = ({ profiler }: { profiler: StreamdownProfiler }) => {
  const snapshot: StreamdownProfilerSnapshot = useSyncExternalStore(
    profiler.subscribe,
    profiler.getSnapshot,
    profiler.getSnapshot,
  );

  const { animation, blocksAggregate, fps, input, root } = snapshot;

  return (
    <aside className="profiler">
      <div className="profiler-header">
        <span className="profiler-title">Live profiler</span>
        <span className="profiler-fps">
          {fps.currentFps.toFixed(0)}/s <em>commits · avg {fps.avgFps.toFixed(0)}</em>
        </span>
      </div>
      <CommitRateSparkline samples={fps.samples} />
      <p className="profiler-note">
        Reveal commits are deliberately throttled below the display refresh — per-character stagger
        is carried by CSS <code>animation-delay</code>, not by re-rendering every frame.
      </p>
      <div className="metric-grid">
        <Metric
          hint={`max ${formatMs(root.maxMs)} · ${root.updateCount} updates`}
          label="Root commit"
          value={formatMs(root.avgMs)}
        />
        <Metric
          hint={`max ${formatMs(blocksAggregate.maxMs)} · ${blocksAggregate.trackedCount} blocks`}
          label="Block commit"
          value={formatMs(blocksAggregate.avgMs)}
        />
        <Metric
          hint={`${animation.revealFrameCount} reveals · backlog ${animation.lastBacklog}`}
          label="Reveal frame"
          value={formatMs(animation.avgMs)}
        />
        <Metric
          hint={`${input.count} chunks · ${input.totalChars} chars`}
          label="Input chunk"
          value={`${input.avgChars.toFixed(1)} ch`}
        />
      </div>
    </aside>
  );
};
