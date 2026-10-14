import { ColorPicker, Flexbox } from '@lobehub/ui';

const sizes = ['small', 'middle', 'large'] as const;

export default () => (
  <Flexbox gap={16} padding={16}>
    {(['swatch', 'field', 'chip'] as const).map((trigger) => (
      <Flexbox horizontal align="center" gap={16} key={trigger}>
        {sizes.map((size) => (
          <ColorPicker defaultValue="#379d4a" key={size} size={size} trigger={trigger} />
        ))}
      </Flexbox>
    ))}
  </Flexbox>
);
