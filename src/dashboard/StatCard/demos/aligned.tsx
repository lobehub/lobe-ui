import { ActionIcon, cssVar, Segmented } from '@lobehub/ui';
import { StatCard } from '@lobehub/ui/dashboard';
import { RefreshCw } from 'lucide-react';
import { useId, useState } from 'react';

const Area = ({ points }: { points: number[] }) => {
  const id = useId();
  const max = Math.max(...points);
  const step = 100 / (points.length - 1);
  const line = points.map((p, i) => `${i * step},${40 - (p / max) * 36}`).join(' L');
  return (
    <svg
      aria-hidden
      height={56}
      preserveAspectRatio="none"
      style={{ display: 'block', marginBlockStart: 12 }}
      viewBox="0 0 100 40"
      width="100%"
    >
      <defs>
        <linearGradient id={id} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor={cssVar.colorPrimary} stopOpacity={0.24} />
          <stop offset="100%" stopColor={cssVar.colorPrimary} stopOpacity={0} />
        </linearGradient>
      </defs>
      <path d={`M${line} L100,40 L0,40 Z`} fill={`url(#${id})`} />
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

const Hint = ({ points, previous }: { points: number[]; previous: string }) => (
  <>
    <span>{previous}</span>
    <Area points={points} />
  </>
);

const Scope = () => {
  const [value, setValue] = useState('total');
  return (
    <Segmented
      size="small"
      value={value}
      options={[
        { label: '总量', value: 'total' },
        { label: '方案', value: 'plan' },
      ]}
      onChange={setValue}
    />
  );
};

export default () => (
  <div
    style={{
      display: 'grid',
      gap: 12,
      gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
    }}
  >
    <StatCard
      delta="+12.4%"
      direction="up"
      hint={<Hint points={[4, 6, 5, 8, 7, 9, 12]} previous="上期 8,210" />}
      label="活跃用户"
      value="9,227"
    />
    <StatCard
      action={<Scope />}
      delta="+3.1%"
      direction="up"
      hint={<Hint points={[10, 9, 11, 12, 11, 13, 14]} previous="上期 ¥41,920" />}
      label="收入"
      value="¥43,210"
    />
    <StatCard
      action={<Scope />}
      delta="-1.8%"
      direction="down"
      hint={<Hint points={[9, 8, 8, 7, 8, 6, 6]} previous="上期 1,284" />}
      label="订阅数"
      value="1,261"
    />
    <StatCard
      action={<ActionIcon icon={RefreshCw} size="small" title="Refresh" />}
      delta="+0.4%"
      direction="up"
      hint={<Hint points={[5, 5, 6, 6, 7, 6, 7]} previous="上期 2.31M" />}
      label="Token 用量"
      value="2.32M"
    />
  </div>
);
