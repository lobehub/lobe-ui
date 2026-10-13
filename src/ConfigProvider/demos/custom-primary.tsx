import {
  Button,
  Checkbox,
  ColorSwatches,
  Flexbox,
  type LobePrimaryColor,
  primaryColors,
  Progress,
  Slider,
  Switch,
  ThemeScope,
} from '@lobehub/ui';
import { useState } from 'react';

const colors = (['red', 'orange', 'green', 'geekblue', 'purple'] as const).map((name) => ({
  color: primaryColors[name],
  title: name,
}));

const findPreset = (color: string) =>
  (Object.keys(primaryColors) as (keyof typeof primaryColors)[]).find(
    (name) => primaryColors[name] === color,
  );

export default () => {
  const [color, setColor] = useState<string | undefined>('#7c5cff');
  const primaryColor = color ? ((findPreset(color) ?? color) as LobePrimaryColor) : undefined;

  return (
    <Flexbox gap={24} padding={16}>
      <ColorSwatches enableColorPicker colors={colors} value={color} onChange={setColor} />
      <ThemeScope primaryColor={primaryColor}>
        <Flexbox gap={16}>
          <Flexbox horizontal align="center" gap={12} wrap="wrap">
            <Button type="primary">Primary</Button>
            <Button>Default</Button>
            <Switch defaultChecked />
            <Checkbox defaultChecked>Checked</Checkbox>
          </Flexbox>
          <Slider defaultValue={60} style={{ maxWidth: 320 }} />
          <Progress percent={60} style={{ maxWidth: 320 }} />
        </Flexbox>
      </ThemeScope>
    </Flexbox>
  );
};
