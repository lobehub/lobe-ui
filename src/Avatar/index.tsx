'use client';

import { type ReactNode, RefAttributes } from 'react';

import AvatarParent, { type AvatarProps } from './Avatar';
import AvatarGroup from './AvatarGroup';

export interface IAvatar {
  (props: AvatarProps & RefAttributes<HTMLDivElement>): ReactNode;
  Group: typeof AvatarGroup;
}

const Avatar = AvatarParent as unknown as IAvatar;

Avatar.Group = AvatarGroup;

export default Avatar;
export type { AvatarProps } from './Avatar';
export { default as AvatarGroup, type AvatarGroupProps } from './AvatarGroup';
