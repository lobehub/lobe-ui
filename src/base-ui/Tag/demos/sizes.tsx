import { Flexbox, Tag } from '@lobehub/ui';

export default () => {
  return (
    <Flexbox gap={8} padding={16}>
      {(['small', 'middle', 'large'] as const).map((size) => (
        <Flexbox horizontal gap={8} key={size} wrap="wrap">
          <Tag color="blue" shape="normal" size={size}>
            {size} normal
          </Tag>
          <Tag color="volcano" shape="round" size={size}>
            {size} round
          </Tag>
          <Tag color="#1677ff" shape="round" size={size} variant="solid">
            {size} round solid
          </Tag>
        </Flexbox>
      ))}
    </Flexbox>
  );
};
