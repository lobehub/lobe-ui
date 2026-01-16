import { Flexbox, LobeSelect, Tag } from '@lobehub/ui';
import { useMemo, useState } from 'react';

export default () => {
  const [value, setValue] = useState<string | null>(null);
  const options = useMemo(
    () =>
      Array.from({ length: 500 }).map((_, index) => ({
        label: `Option ${index + 1}`,
        value: `option-${index + 1}`,
      })),
    [],
  );

  return (
    <Flexbox
      align="center"
      gap={12}
      justify="center"
      style={{
        background: 'var(--lobe-color-fill-secondary)',
        borderRadius: 16,
        padding: 28,
      }}
    >
      <Flexbox align="center" gap={8} horizontal>
        <div style={{ fontSize: 15, fontWeight: 600 }}>Virtual List</div>
        <Tag color="cyan">Performance</Tag>
      </Flexbox>
      <LobeSelect
        allowClear
        listItemHeight={32}
        onChange={(next) => setValue(next as string | null)}
        options={options}
        placeholder="Search 500 options"
        showSearch
        style={{ width: 320 }}
        value={value}
        virtual
      />
      <div style={{ color: 'var(--lobe-color-text-3)', fontSize: 12, textAlign: 'center' }}>
        Virtualized list keeps scrolling smooth with large datasets.
      </div>
    </Flexbox>
  );
};
