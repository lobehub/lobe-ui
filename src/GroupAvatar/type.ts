import type { Ref } from 'react';

import type { AvatarProps } from '@/Avatar/type';
import type { BlockProps } from '@/Block/type';
import type { SMOOTH_CORNER_MASKS } from '@/utils/smoothCorners';

type AvatarItem = string | Omit<AvatarProps, 'size'>;

export interface GroupAvatarProps extends Omit<BlockProps, 'width' | 'height' | 'variant'> {
  avatars?: AvatarItem[];
  ref?: Ref<HTMLDivElement>;
  size?: number;
  smoothCornerType?: keyof typeof SMOOTH_CORNER_MASKS;
}
