import { ColorPicker, ColorSwatches, Flexbox, Text } from '@lobehub/ui';
import { useState } from 'react';

const colors = [
  { color: '#f4416c', title: 'Red' },
  { color: '#ee9e0b', title: 'Gold' },
  { color: '#379d4a', title: 'Green' },
  { color: '#0072f5', title: 'Blue' },
  { color: '#bd54c6', title: 'Purple' },
];

export default () => {
  const [color, setColor] = useState<string | undefined>('#7c5cff');

  return (
    <Flexbox gap={24} padding={16}>
      <Flexbox gap={8}>
        <Text type="secondary">Built-in</Text>
        <ColorSwatches enableColorPicker colors={colors} value={color} onChange={setColor} />
      </Flexbox>
      <Flexbox gap={8}>
        <Text type="secondary">Wrap the built-in picker</Text>
        <ColorSwatches
          enableColorPicker
          align="center"
          colors={colors}
          value={color}
          renderPicker={({ value }, picker) => (
            <>
              {picker}
              <Text code fontSize={12} type="secondary">
                {value ?? 'preset'}
              </Text>
            </>
          )}
          onChange={setColor}
        />
      </Flexbox>
      <Flexbox gap={8}>
        <Text type="secondary">Replace it with an alpha picker</Text>
        <ColorSwatches
          enableColorPicker
          align="center"
          colors={colors}
          value={color}
          renderPicker={({ value, onChange }) => (
            <ColorPicker alpha showText value={value} onChangeComplete={onChange} />
          )}
          onChange={setColor}
        />
      </Flexbox>
    </Flexbox>
  );
};
