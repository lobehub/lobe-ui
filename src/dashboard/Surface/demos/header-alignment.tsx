import { ActionIcon, Segmented } from '@lobehub/ui/base-ui';
import { Surface } from '@lobehub/ui/dashboard';
import { Download } from 'lucide-react';
import { useState } from 'react';

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

const Figure = ({ value }: { value: string }) => (
  <div style={{ fontSize: 24, fontVariantNumeric: 'tabular-nums', fontWeight: 600 }}>{value}</div>
);

const grid = {
  display: 'grid',
  gap: 12,
  gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
} as const;

export default () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
    <div style={grid}>
      <Surface title="Requests">
        <Figure value="128,402" />
      </Surface>
      <Surface extra={<Scope />} title="Revenue">
        <Figure value="¥43,210" />
      </Surface>
      <Surface extra={<ActionIcon icon={Download} size="small" title="Export" />} title="Errors">
        <Figure value="312" />
      </Surface>
    </div>
    <div style={grid}>
      <Surface description="Last 7 days, all workspaces" title="Active users">
        <Figure value="9,227" />
      </Surface>
      <Surface description="Paid plans only" extra={<Scope />} title="Subscriptions">
        <Figure value="1,261" />
      </Surface>
      <Surface
        description="Prompt and completion"
        extra={<ActionIcon icon={Download} size="small" title="Export" />}
        title="Token usage"
      >
        <Figure value="2.32M" />
      </Surface>
    </div>
  </div>
);
