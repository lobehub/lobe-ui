'use client';

import { Skeleton, Tag } from '@lobehub/ui';

import { Flexbox } from '@/Flex';

export default () => (
  <Flexbox gap={16}>
    <Tag>Tag</Tag>
    <Skeleton.Tags />
    <Flexbox horizontal gap={2}>
      <Tag size={'small'}>Tag</Tag>
      <Tag size={'small'}>Tag</Tag>
      <Tag size={'small'}>Tag</Tag>
    </Flexbox>
    <Skeleton.Tags count={3} gap={2} size="small" />
    <Flexbox horizontal gap={16}>
      <Tag size="large">Tag</Tag>
      <Tag size="large">Tag</Tag>
    </Flexbox>
    <Skeleton.Tags count={2} gap={16} size="large" />
  </Flexbox>
);
