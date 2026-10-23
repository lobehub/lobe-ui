import { Avatar, type AvatarFallbackVariant, Flexbox, Text } from '@lobehub/ui';

const variants: AvatarFallbackVariant[] = [
  'marble',
  'beam',
  'pixel',
  'sunset',
  'ring',
  'bauhaus',
  'text',
];

const names = ['LobeHub', 'Arvin Xu', 'CanisMinor', 'Design System'];

export default () => (
  <Flexbox gap={16} padding={16}>
    {variants.map((variant) => (
      <Flexbox horizontal align="center" gap={16} key={variant}>
        <Text style={{ width: 64 }} type="secondary">
          {variant}
        </Text>
        {names.map((name) => (
          <Avatar fallbackVariant={variant} key={name} shape="circle" size={40} title={name} />
        ))}
        {names.slice(0, 2).map((name) => (
          <Avatar fallbackVariant={variant} key={`${name}-square`} size={40} title={name} />
        ))}
      </Flexbox>
    ))}
  </Flexbox>
);
