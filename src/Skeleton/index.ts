import type { FC } from 'react';

import SkeletonRoot from './Skeleton';
import SkeletonAvatar from './SkeletonAvatar';
import SkeletonText from './SkeletonText';
import type { SkeletonProps } from './type';

interface ISkeleton extends FC<SkeletonProps> {
  Avatar: typeof SkeletonAvatar;
  Text: typeof SkeletonText;
}

const Skeleton = SkeletonRoot as ISkeleton;
Skeleton.Avatar = SkeletonAvatar;
Skeleton.Text = SkeletonText;

export default Skeleton;

export { default as SkeletonAvatar } from './SkeletonAvatar';
export { default as SkeletonText } from './SkeletonText';
export type * from './type';
