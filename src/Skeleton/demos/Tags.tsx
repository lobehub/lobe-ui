'use client';

import { Skeleton, Tag } from '@lobehub/ui';

import { Flexbox } from '@/Flex';

export default () => (
  <Flexbox gap={16}>
    <Tag>Tag</Tag>
    <Skeleton.Tags />
    <Flexbox gap={2} horizontal>
      <Tag size={'small'}>Tag</Tag>
      <Tag size={'small'}>Tag</Tag>
      <Tag size={'small'}>Tag</Tag>
    </Flexbox>
    <Skeleton.Tags count={3} gap={2} size="small" />
    <Flexbox gap={16} horizontal>
      <Tag size="large">Tag</Tag>
      <Tag size="large">Tag</Tag>
    </Flexbox>
    <Skeleton.Tags count={2} gap={16} size="large" />
  </Flexbox>
);
