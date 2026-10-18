'use client';

import clsx from 'clsx';

import { Flexbox } from '@/Flex';
import Tag from '@/Tag';

import { dashboardLabelWithKeyClasses } from './stable';
import type { LabelWithKeyProps } from './type';

/** A human label followed by its machine key as a tag. */
const LabelWithKey = ({ className, tag, title, ...rest }: LabelWithKeyProps) => (
  <Flexbox
    horizontal
    align={'center'}
    className={clsx(dashboardLabelWithKeyClasses(), className)}
    gap={8}
    {...rest}
  >
    {title}
    <Tag className={dashboardLabelWithKeyClasses('tag')}>{tag}</Tag>
  </Flexbox>
);

LabelWithKey.displayName = 'LabelWithKey';

export default LabelWithKey;
