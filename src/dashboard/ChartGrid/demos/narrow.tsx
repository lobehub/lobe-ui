import { ChartGrid, Surface } from '@lobehub/ui/dashboard';
import { cssVar } from 'antd-style';
import { type ReactNode, useId } from 'react';

const Area = ({ points }: { points: number[] }) => {
  const id = useId();
  const max = Math.max(...points);
  const step = 100 / (points.length - 1);
  const line = points.map((p, i) => `${i * step},${48 - (p / max) * 44}`).join(' L');
  return (
    <svg
      aria-hidden
      height={160}
      preserveAspectRatio="none"
      style={{ display: 'block' }}
      viewBox="0 0 100 48"
      width="100%"
    >
      <defs>
        <linearGradient id={id} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor={cssVar.colorPrimary} stopOpacity={0.24} />
          <stop offset="100%" stopColor={cssVar.colorPrimary} stopOpacity={0} />
        </linearGradient>
      </defs>
      <path d={`M${line} L100,48 L0,48 Z`} fill={`url(#${id})`} />
      <path
        d={`M${line}`}
        fill="none"
        stroke={cssVar.colorPrimary}
        strokeWidth={1.5}
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
};

const Bars = ({ values }: { values: number[] }) => {
  const max = Math.max(...values);
  const w = 100 / values.length;
  return (
    <svg
      aria-hidden
      height={160}
      preserveAspectRatio="none"
      style={{ display: 'block' }}
      viewBox="0 0 100 48"
      width="100%"
    >
      {values.map((v, i) => (
        <rect
          fill={cssVar.colorPrimary}
          fillOpacity={0.75}
          height={(v / max) * 44}
          key={i}
          rx={0.6}
          width={w * 0.6}
          x={i * w + w * 0.2}
          y={48 - (v / max) * 44}
        />
      ))}
    </svg>
  );
};

const Body = ({ children }: { children: ReactNode }) => (
  <div style={{ minInlineSize: 0 }}>{children}</div>
);

export default () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
    <div style={{ maxInlineSize: 520 }}>
      <ChartGrid>
        <Surface title="Requests (container under 640px: one column)">
          <Body>
            <Area points={[32, 40, 36, 52, 48, 61, 58, 70]} />
          </Body>
        </Surface>
        <Surface title="Token usage by model">
          <Body>
            <Bars values={[82, 64, 51, 38, 27]} />
          </Body>
        </Surface>
      </ChartGrid>
    </div>
    <ChartGrid>
      <Surface title="A single chart keeps a readable width">
        <Body>
          <Area points={[5, 9, 7, 12, 10, 15, 14, 18]} />
        </Body>
      </Surface>
    </ChartGrid>
  </div>
);
