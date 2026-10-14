import { ColorPicker, Flexbox } from '@lobehub/ui';

export default () => (
  <Flexbox horizontal align="center" gap={24} padding={16} wrap="wrap">
    <ColorPicker alpha defaultFormat="rgb" defaultValue="#0072f5cc" trigger="field" />
    <ColorPicker alpha defaultFormat="hsl" defaultValue="#f4416c80" trigger="chip" />
    <ColorPicker defaultValue="" trigger="field" />
    <ColorPicker defaultValue="" />
    <ColorPicker disabled defaultValue="#ee9e0b" trigger="field" />
  </Flexbox>
);
