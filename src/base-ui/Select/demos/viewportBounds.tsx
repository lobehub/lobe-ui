import { Flexbox, Text } from '@lobehub/ui';
import { Select, setFloatingCollisionPadding } from '@lobehub/ui/base-ui';
import { useEffect, useState } from 'react';

const TITLE_BAR_HEIGHT = 40;

const options = Array.from({ length: 80 }, (_, index) => ({
  label: `Font ${index + 1}`,
  value: `font-${index + 1}`,
}));

export default () => {
  const [value, setValue] = useState<string | null>(null);

  useEffect(() => {
    setFloatingCollisionPadding({ top: TITLE_BAR_HEIGHT });
    return () => setFloatingCollisionPadding(undefined);
  }, []);

  return (
    <Flexbox gap={8} justify="flex-end" style={{ inset: 0, padding: 16, position: 'fixed' }}>
      <div
        style={{
          alignItems: 'center',
          background: 'var(--lobe-color-fill-secondary)',
          borderBottom: '1px solid var(--lobe-color-border)',
          display: 'flex',
          fontSize: 12,
          height: TITLE_BAR_HEIGHT,
          insetInline: 0,
          justifyContent: 'center',
          position: 'fixed',
          top: 0,
        }}
      >
        Reserved title bar ({TITLE_BAR_HEIGHT}px)
      </div>
      <Text type="secondary">
        The popup flips upward, keeps its search field visible and stops below the title bar.
      </Text>
      <Select
        showSearch
        options={options}
        placeholder="Open near the bottom edge"
        style={{ width: 320 }}
        value={value}
        onChange={(next) => setValue(next as string | null)}
      />
    </Flexbox>
  );
};
