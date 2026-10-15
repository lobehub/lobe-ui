import { Flexbox, Tag } from '@lobehub/ui';

import { presetColors } from '../utils';

export default () => {
  return (
    <Flexbox gap={16} padding={16}>
      <Flexbox horizontal gap={8} wrap="wrap">
        <Tag color="success">success</Tag>
        <Tag color="warning">warning</Tag>
        <Tag color="error">error</Tag>
        <Tag color="info">info</Tag>
      </Flexbox>
      <Flexbox horizontal gap={8} wrap="wrap">
        {presetColors.map((color) => (
          <Tag color={color} key={color}>
            {color}
          </Tag>
        ))}
      </Flexbox>
    </Flexbox>
  );
};
