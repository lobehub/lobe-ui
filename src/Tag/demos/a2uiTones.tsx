import { Flexbox, Tag } from '@lobehub/ui';

const colors = ['default', 'success', 'warning', 'error', 'info', 'discovery'] as const;

export default () => {
  return (
    <Flexbox gap={12}>
      <Flexbox horizontal gap={6} wrap="wrap">
        {colors.map((color) => (
          <Tag color={color} key={color} variant="a2ui">
            {color}
          </Tag>
        ))}
      </Flexbox>
      <Flexbox horizontal gap={6} wrap="wrap">
        {colors.map((color) => (
          <Tag color={color} key={color} shape="round" size="small" variant="a2ui">
            {color}
          </Tag>
        ))}
      </Flexbox>
    </Flexbox>
  );
};
