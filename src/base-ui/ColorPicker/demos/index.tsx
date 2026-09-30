import { Flexbox } from '@lobehub/ui';
import { ColorPicker } from '@lobehub/ui/base-ui';
import { useState } from 'react';

const presets = [
  '#f4416c',
  '#f88c13',
  '#ee9e0b',
  '#379d4a',
  '#2ec5b6',
  '#0072f5',
  '#bd54c6',
  '#080808',
];

export default () => {
  const [color, setColor] = useState('#0072f5');

  return (
    <Flexbox horizontal align="center" gap={24} padding={16}>
      <ColorPicker presets={presets} value={color} onChange={setColor} />
      <ColorPicker showText value={color} onChange={setColor} />
      <ColorPicker alpha showText defaultValue="#0072f5cc" />
    </Flexbox>
  );
};
