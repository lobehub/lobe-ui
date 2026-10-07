import type { ReactNode, RefAttributes } from 'react';

import AvatarParent from './Avatar';
import AvatarGroup from './AvatarGroup';
import { type AvatarProps } from './type';

interface IAvatar {
  (props: AvatarProps & RefAttributes<HTMLDivElement>): ReactNode;
  Group: typeof AvatarGroup;
}

const Avatar = AvatarParent as unknown as IAvatar;
Avatar.Group = AvatarGroup;

export default Avatar;
export { default as AvatarGroup } from './AvatarGroup';
export type * from './type';
