'use client';

import { type CSSProperties, type ReactNode, useDeferredValue, useSyncExternalStore } from 'react';

import Button from '@/Button';

import { type StreamdownProfiler, type StreamdownProfilerSnapshot } from './profiler';

const EMPTY_SNAPSHOT: StreamdownProfilerSnapshot = {
  animation: {
    avgMs: 0,
    animationAutoDisabled: false,
    count: 0,
    disableCount: 0,
    lastArrivalCps: 0,
    lastBacklog: 0,
    lastDisableReason: 'none',
    lastInputActive: false,
    lastMs: 0,
    lastRevealChars: 0,
    lastSettling: false,
    maxArrivalCps: 0,
    maxBacklog: 0,
    maxMs: 0,
    maxRevealChars: 0,
    revealFrameCount: 0,
    recoverThresholdBacklog: 0,
    recoverThresholdCps: 0,
    skippedFrameCount: 0,
    slowFrameCount: 0,
    thresholdBacklog: 0,
    thresholdCps: 0,
    totalMs: 0,
  },
  blocks: [],
  blocksAggregate: {
    avgMs: 0,
    count: 0,
    lastMs: 0,
    maxMs: 0,
    totalMs: 0,
    trackedCount: 0,
  },
  calculations: [],
  createdAt: 0,
  fps: {
    avgFps: 0,
    currentFps: 0,
    index: 0,
    maxFps: 0,
    minFps: 0,
    samples: [],
    targetFps: 60,
  },
  input: {
    avgChars: 0,
    count: 0,
    lastChars: 0,
    lastContentLength: 0,
    maxChars: 0,
    totalChars: 0,
  },
  label: 'streamdown',
  root: {
    avgMs: 0,
    count: 0,
    lastBaseDuration: 0,
    lastBlockCount: 0,
    lastMs: 0,
    lastPhase: 'mount',
    lastTextLength: 0,
    maxBaseDuration: 0,
    maxBlockCount: 0,
    maxMs: 0,
    maxTextLength: 0,
    mountCount: 0,
    totalMs: 0,
    updateCount: 0,
  },
  sessionId: 0,
  updatedAt: 0,
};

const noopSubscribe = () => () => {};

const panelStyle: CSSProperties = {
  background: 'var(--lobe-color-bg-container)',
  border: '1px solid var(--lobe-color-border)',
  borderRadius: 16,
  display: 'flex',
  flexDirection: 'column',
  gap: 16,
  minWidth: 0,
  padding: 16,
  position: 'sticky',
  top: 0,
};

const headerStyle: CSSProperties = {
  alignItems: 'flex-start',
  display: 'flex',
  gap: 12,
  justifyContent: 'space-between',
};

const eyebrowStyle: CSSProperties = {
  color: 'var(--lobe-color-text-secondary)',
  fontSize: 12,
  fontWeight: 600,
  letterSpacing: '0.08em',
  marginBottom: 4,
  textTransform: 'uppercase',
};

const titleStyle: CSSProperties = {
  fontSize: 16,
  fontWeight: 700,
  lineHeight: 1.3,
  margin: 0,
};

const metaStyle: CSSProperties = {
  color: 'var(--lobe-color-text-secondary)',
  display: 'flex',
  flexWrap: 'wrap',
  fontSize: 12,
  gap: 12,
  lineHeight: 1.5,
};

const metricGridStyle: CSSProperties = {
  display: 'grid',
  gap: 12,
  gridTemplateColumns: 'repeat(auto-fit, minmax(132px, 1fr))',
};

const metricCardStyle: CSSProperties = {
  background: 'var(--lobe-color-fill-secondary)',
  borderRadius: 12,
  minWidth: 0,
  padding: 12,
};

const metricLabelStyle: CSSProperties = {
  color: 'var(--lobe-color-text-secondary)',
  fontSize: 12,
  marginBottom: 6,
};

const metricValueStyle: CSSProperties = {
  fontSize: 18,
  fontWeight: 700,
  lineHeight: 1.2,
  marginBottom: 4,
};

const metricHintStyle: CSSProperties = {
  color: 'var(--lobe-color-text-secondary)',
  fontSize: 12,
  lineHeight: 1.4,
};

const sectionStyle: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 8,
};

const sectionTitleStyle: CSSProperties = {
  fontSize: 13,
  fontWeight: 700,
};

const chartFrameStyle: CSSProperties = {
  background: 'var(--lobe-color-fill-secondary)',
  borderRadius: 12,
  minWidth: 0,
  overflow: 'hidden',
  padding: 12,
};

const chartMetaStyle: CSSProperties = {
  color: 'var(--lobe-color-text-secondary)',
  display: 'flex',
  flexWrap: 'wrap',
  fontSize: 12,
  gap: 12,
  lineHeight: 1.4,
  marginBottom: 10,
};

const noteStyle: CSSProperties = {
  color: 'var(--lobe-color-text-secondary)',
  fontSize: 12,
  lineHeight: 1.5,
};

const tableStyle: CSSProperties = {
  borderCollapse: 'collapse',
  fontSize: 12,
  width: '100%',
};

const tableCellStyle: CSSProperties = {
  borderBottom: '1px solid var(--lobe-color-border-secondary)',
  padding: '6px 0',
  textAlign: 'left',
  verticalAlign: 'top',
};

const headerCellStyle: CSSProperties = {
  ...tableCellStyle,
  color: 'var(--lobe-color-text-secondary)',
  fontWeight: 600,
};

const formatCount = (value: number) => {
  return new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(value);
};

const formatMs = (value: number) => {
  if (value >= 100) return `${value.toFixed(0)} ms`;
  if (value >= 10) return `${value.toFixed(1)} ms`;
  return `${value.toFixed(2)} ms`;
};

const formatFps = (value: number) => {
  if (value >= 100) return `${value.toFixed(0)} fps`;
  if (value >= 10) return `${value.toFixed(1)} fps`;
  return `${value.toFixed(2)} fps`;
};

const formatCps = (value: number) => {
  if (value >= 100) return `${value.toFixed(0)} cps`;
  if (value >= 10) return `${value.toFixed(1)} cps`;
  return `${value.toFixed(2)} cps`;
};

const getFpsIndexLabel = (index: number) => {
  if (index >= 95) return 'Excellent';
  if (index >= 80) return 'Stable';
  if (index >= 60) return 'Degrading';
  return 'Constrained';
};

const MetricCard = ({ hint, label, value }: { hint: string; label: string; value: string }) => {
  return (
    <div style={metricCardStyle}>
      <div style={metricLabelStyle}>{label}</div>
      <div style={metricValueStyle}>{value}</div>
      <div style={metricHintStyle}>{hint}</div>
    </div>
  );
};

const TablePlaceholder = ({ children }: { children: ReactNode }) => {
  return <div style={noteStyle}>{children}</div>;
};

const FpsSparkline = ({ samples, targetFps }: { samples: number[]; targetFps: number }) => {
  if (samples.length === 0) {
    return <TablePlaceholder>No FPS samples have been recorded yet.</TablePlaceholder>;
  }

  const width = 300;
  const height = 84;
  const ceiling = Math.max(targetFps, ...samples, 1);
  const points = samples
    .map((sample, index) => {
      const x = samples.length === 1 ? width / 2 : (index / (samples.length - 1)) * width;
      const y = height - (sample / ceiling) * height;
      return `${x},${Math.max(0, Math.min(height, y))}`;
    })
    .join(' ');
  const targetY = height - (targetFps / ceiling) * height;

  return (
    <div style={chartFrameStyle}>
      <div style={chartMetaStyle}>
        <span>Window: {formatCount(samples.length)} frames</span>
        <span>Target: {formatFps(targetFps)}</span>
      </div>
      <svg
        aria-label={'FPS sparkline'}
        height={height}
        role={'img'}
        style={{ display: 'block', height: 'auto', width: '100%' }}
        viewBox={`0 0 ${width} ${height}`}
      >
        <line
          stroke={'var(--lobe-color-border)'}
          strokeDasharray={'4 4'}
          strokeWidth={1}
          x1={0}
          x2={width}
          y1={targetY}
          y2={targetY}
        />
        <polyline
          fill={'none'}
          points={points}
          stroke={'var(--lobe-color-primary)'}
          strokeLinecap={'round'}
          strokeLinejoin={'round'}
          strokeWidth={2}
        />
      </svg>
    </div>
  );
};

const useProfilerSnapshot = (profiler?: StreamdownProfiler | null) => {
  return useSyncExternalStore(
    profiler?.subscribe ?? noopSubscribe,
    profiler?.getSnapshot ?? (() => EMPTY_SNAPSHOT),
    profiler?.getSnapshot ?? (() => EMPTY_SNAPSHOT),
  );
};

export interface StreamdownProfilerPanelProps {
  maxBlocks?: number;
  profiler?: StreamdownProfiler | null;
  title?: string;
}

export const StreamdownProfilerPanel = ({
  maxBlocks = 8,
  profiler,
  title = 'Streamdown Profiler',
}: StreamdownProfilerPanelProps) => {
  const snapshot = useProfilerSnapshot(profiler);
  const deferredSnapshot = useDeferredValue(snapshot);
  if (!profiler) return null;

  const elapsedMs = Math.max(0, deferredSnapshot.updatedAt - deferredSnapshot.createdAt);
  const visibleBlocks = deferredSnapshot.blocks.slice(0, maxBlocks);
  const fpsIndexLabel = getFpsIndexLabel(deferredSnapshot.fps.index);
  const animationModeLabel = deferredSnapshot.animation.animationAutoDisabled
    ? 'Degraded'
    : 'Animated';
  const animationReasonLabel =
    deferredSnapshot.animation.lastDisableReason === 'none'
      ? 'none'
      : deferredSnapshot.animation.lastDisableReason;

  return (
    <aside style={panelStyle}>
      <div style={headerStyle}>
        <div>
          <div style={eyebrowStyle}>Performance Baseline</div>
          <h3 style={titleStyle}>{title}</h3>
        </div>
        <Button size={'small'} onClick={() => profiler.reset(deferredSnapshot.label)}>
          Reset
        </Button>
      </div>

      <div style={metaStyle}>
        <span>Label: {deferredSnapshot.label}</span>
        <span>Session: {deferredSnapshot.sessionId}</span>
        <span>Elapsed: {formatMs(elapsedMs)}</span>
      </div>

      <div style={metricGridStyle}>
        <MetricCard
          label={'Root Commits'}
          value={formatCount(deferredSnapshot.root.count)}
          hint={`mount ${formatCount(deferredSnapshot.root.mountCount)} / update ${formatCount(
            deferredSnapshot.root.updateCount,
          )}`}
        />
        <MetricCard
          label={'Root Commit Cost'}
          value={formatMs(deferredSnapshot.root.avgMs)}
          hint={`max ${formatMs(deferredSnapshot.root.maxMs)} / blocks ${formatCount(
            deferredSnapshot.root.maxBlockCount,
          )}`}
        />
        <MetricCard
          label={'Block Commits'}
          value={formatCount(deferredSnapshot.blocksAggregate.count)}
          hint={`tracked ${formatCount(
            deferredSnapshot.blocksAggregate.trackedCount,
          )} / max ${formatMs(deferredSnapshot.blocksAggregate.maxMs)}`}
        />
        <MetricCard
          label={'Animation Tick Cost'}
          value={formatMs(deferredSnapshot.animation.avgMs)}
          hint={`slow ${formatCount(
            deferredSnapshot.animation.slowFrameCount,
          )} / backlog ${formatCount(deferredSnapshot.animation.maxBacklog)}`}
        />
        <MetricCard
          label={'Animation Frames'}
          value={formatCount(deferredSnapshot.animation.count)}
          hint={`reveal ${formatCount(
            deferredSnapshot.animation.revealFrameCount,
          )} / skip ${formatCount(deferredSnapshot.animation.skippedFrameCount)}`}
        />
        <MetricCard
          label={'Animation Mode'}
          value={animationModeLabel}
          hint={`trigger ${animationReasonLabel} / count ${formatCount(
            deferredSnapshot.animation.disableCount,
          )}`}
        />
        <MetricCard
          label={'Arrival Rate'}
          value={formatCps(deferredSnapshot.animation.lastArrivalCps)}
          hint={`peak ${formatCps(deferredSnapshot.animation.maxArrivalCps)} / disable ${formatCps(
            deferredSnapshot.animation.thresholdCps,
          )} / recover ${formatCps(deferredSnapshot.animation.recoverThresholdCps)}`}
        />
        <MetricCard
          label={'Input Append Size'}
          value={formatCount(Math.round(deferredSnapshot.input.avgChars))}
          hint={`max ${formatCount(deferredSnapshot.input.maxChars)} / total ${formatCount(
            deferredSnapshot.input.totalChars,
          )}`}
        />
        <MetricCard
          hint={`${fpsIndexLabel} / current ${formatFps(deferredSnapshot.fps.currentFps)}`}
          label={'FPS Index'}
          value={`${formatCount(deferredSnapshot.fps.index)}/100`}
        />
        <MetricCard
          label={'Avg FPS'}
          value={formatFps(deferredSnapshot.fps.avgFps)}
          hint={`min ${formatFps(deferredSnapshot.fps.minFps)} / max ${formatFps(
            deferredSnapshot.fps.maxFps,
          )}`}
        />
        <MetricCard
          label={'Backlog'}
          value={formatCount(deferredSnapshot.animation.lastBacklog)}
          hint={`max ${formatCount(deferredSnapshot.animation.maxBacklog)} / disable ${formatCount(
            deferredSnapshot.animation.thresholdBacklog,
          )} / recover ${formatCount(deferredSnapshot.animation.recoverThresholdBacklog)}`}
        />
      </div>

      <div style={sectionStyle}>
        <div style={sectionTitleStyle}>FPS Curve</div>
        <FpsSparkline
          samples={deferredSnapshot.fps.samples}
          targetFps={deferredSnapshot.fps.targetFps}
        />
      </div>

      <div style={sectionStyle}>
        <div style={sectionTitleStyle}>Calculation Hotspots</div>
        {deferredSnapshot.calculations.length === 0 ? (
          <TablePlaceholder>No calculation samples have been recorded yet.</TablePlaceholder>
        ) : (
          <table style={tableStyle}>
            <thead>
              <tr>
                <th style={headerCellStyle}>Stage</th>
                <th style={headerCellStyle}>Count</th>
                <th style={headerCellStyle}>Avg</th>
                <th style={headerCellStyle}>Max</th>
                <th style={headerCellStyle}>Items</th>
              </tr>
            </thead>
            <tbody>
              {deferredSnapshot.calculations.map((calculation) => (
                <tr key={calculation.name}>
                  <td style={tableCellStyle}>{calculation.name}</td>
                  <td style={tableCellStyle}>{formatCount(calculation.count)}</td>
                  <td style={tableCellStyle}>{formatMs(calculation.avgMs)}</td>
                  <td style={tableCellStyle}>{formatMs(calculation.maxMs)}</td>
                  <td style={tableCellStyle}>{formatCount(calculation.lastItemCount)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div style={sectionStyle}>
        <div style={sectionTitleStyle}>Top Block Re-renders</div>
        {visibleBlocks.length === 0 ? (
          <TablePlaceholder>No block-level render commits have been recorded yet.</TablePlaceholder>
        ) : (
          <table style={tableStyle}>
            <thead>
              <tr>
                <th style={headerCellStyle}>Block</th>
                <th style={headerCellStyle}>State</th>
                <th style={headerCellStyle}>Commits</th>
                <th style={headerCellStyle}>Avg</th>
                <th style={headerCellStyle}>Chars</th>
              </tr>
            </thead>
            <tbody>
              {visibleBlocks.map((block) => (
                <tr key={block.blockKey}>
                  <td style={tableCellStyle}>#{block.blockIndex}</td>
                  <td style={tableCellStyle}>{block.lastState}</td>
                  <td style={tableCellStyle}>{formatCount(block.count)}</td>
                  <td style={tableCellStyle}>{formatMs(block.avgMs)}</td>
                  <td style={tableCellStyle}>{formatCount(block.blockChars)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div style={noteStyle}>
        Panel updates are throttled to reduce observer-induced re-render noise during streaming.
      </div>
    </aside>
  );
};
