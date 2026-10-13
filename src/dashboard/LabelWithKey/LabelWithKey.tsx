'use client';

import Tag from '@/base-ui/Tag';
import { Flexbox } from '@/Flex';

import type { LabelWithKeyProps } from './type';

/** A human label followed by its machine key as a tag. */
const LabelWithKey = ({ tag, title, ...rest }: LabelWithKeyProps) => (
  <Flexbox horizontal align={'center'} gap={8} {...rest}>
    {title}
    <Tag>{tag}</Tag>
  </Flexbox>
);

LabelWithKey.displayName = 'LabelWithKey';

export default LabelWithKey;
