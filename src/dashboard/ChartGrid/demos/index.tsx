import { cssVar, Segmented } from '@lobehub/ui';
import { ChartGrid, Surface } from '@lobehub/ui/dashboard';
import { type ReactNode, useId, useState } from 'react';

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

const Scope = () => {
  const [value, setValue] = useState('day');
  return (
    <Segmented
      size="small"
      value={value}
      options={[
        { label: 'Day', value: 'day' },
        { label: 'Week', value: 'week' },
      ]}
      onChange={setValue}
    />
  );
};

export default () => (
  <ChartGrid>
    <Surface extra={<Scope />} title="Requests">
      <Body>
        <Area points={[32, 40, 36, 52, 48, 61, 58, 70, 66, 78, 74, 88]} />
      </Body>
    </Surface>
    <Surface title="Token usage by model">
      <Body>
        <Bars values={[82, 64, 51, 38, 27, 19, 12]} />
      </Body>
    </Surface>
    <Surface title="Active users">
      <Body>
        <Area points={[12, 14, 13, 18, 22, 21, 26, 25, 29, 31, 30, 34]} />
      </Body>
    </Surface>
    <Surface extra={<Scope />} title="Errors">
      <Body>
        <Bars values={[4, 7, 3, 9, 5, 2, 6, 8, 3, 4]} />
      </Body>
    </Surface>
  </ChartGrid>
);
