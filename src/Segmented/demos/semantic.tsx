import { Flexbox, Segmented } from '@lobehub/ui';

const options = ['Daily', 'Weekly', 'Monthly'];

export default () => (
  <Flexbox gap={16} style={{ maxWidth: 360 }}>
    {/* Compact mobile height: slots take a className or an inline style. */}
    <Segmented
      block
      options={options}
      styles={{
        item: { height: 28, paddingInline: 8 },
        itemLabel: { fontSize: 12 },
        root: { padding: 2 },
      }}
    />
    <Segmented
      block
      options={options}
      size="large"
      styles={{
        indicator: { borderRadius: 999 },
        item: { borderRadius: 999 },
        root: { borderRadius: 999 },
      }}
    />
  </Flexbox>
);
