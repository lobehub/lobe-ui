import { Flexbox, Tag } from '@lobehub/ui';

const variants = ['filled', 'outlined', 'borderless', 'solid'] as const;

export default () => {
  return (
    <Flexbox gap={8} padding={16}>
      {variants.map((variant) => (
        <Flexbox horizontal gap={8} key={variant} wrap="wrap">
          <Tag color="gold" variant={variant}>
            gold {variant}
          </Tag>
          <Tag color="purple" variant={variant}>
            purple {variant}
          </Tag>
          <Tag color="success" variant={variant}>
            success {variant}
          </Tag>
          <Tag color="error" variant={variant}>
            error {variant}
          </Tag>
        </Flexbox>
      ))}
    </Flexbox>
  );
};
