import type { ReactNode } from 'react';

import type { SkeletonProps } from '@/Skeleton/type';

import SkeletonParent from './Skeleton';
import SkeletonAvatar from './SkeletonAvatar';
import SkeletonBlock from './SkeletonBlock';
import SkeletonButton from './SkeletonButton';
import SkeletonParagraph from './SkeletonParagraph';
import SkeletonTags from './SkeletonTags';
import SkeletonTitle from './SkeletonTitle';

interface ISkeleton {
  (props: SkeletonProps): ReactNode;
  Avatar: typeof SkeletonAvatar;
  Block: typeof SkeletonBlock;
  Button: typeof SkeletonButton;
  Paragraph: typeof SkeletonParagraph;
  Tags: typeof SkeletonTags;
  Title: typeof SkeletonTitle;
}

const Skeleton = SkeletonParent as unknown as ISkeleton;
Skeleton.Block = SkeletonBlock;
Skeleton.Avatar = SkeletonAvatar;
Skeleton.Title = SkeletonTitle;
Skeleton.Paragraph = SkeletonParagraph;
Skeleton.Button = SkeletonButton;
Skeleton.Tags = SkeletonTags;

export default Skeleton;

export { default as SkeletonAvatar } from './SkeletonAvatar';
export { default as SkeletonBlock } from './SkeletonBlock';
export { default as SkeletonButton } from './SkeletonButton';
export { default as SkeletonParagraph } from './SkeletonParagraph';
export { default as SkeletonTags } from './SkeletonTags';
export { default as SkeletonTitle } from './SkeletonTitle';
export type * from './type';
