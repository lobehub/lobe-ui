import { Flexbox, GlideHighlight } from '@lobehub/ui';
import type { CSSProperties } from 'react';

const tabs = ['Overview', 'Activity', 'Usage', 'Billing', 'Members'];

const tab: CSSProperties = {
  background: 'none',
  border: 'none',
  color: 'inherit',
  cursor: 'pointer',
  font: 'inherit',
  padding: '6px 12px',
};

export default () => (
  <Flexbox padding={16}>
    <GlideHighlight
      style={{ display: 'flex', gap: 2, width: 'fit-content' }}
      styles={{ highlight: { borderRadius: 999 } }}
    >
      {tabs.map((label) => (
        <button data-glide-row key={label} style={tab} type="button">
          {label}
        </button>
      ))}
    </GlideHighlight>
  </Flexbox>
);
