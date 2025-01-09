'use client';

import { IconAvatar, type IconAvatarProps } from '@lobehub/icons';
import { memo } from 'react';

import { COLOR_PRIMARY, TITLE } from '../style';
import Color from './Color';

export type AvatarProps = Omit<IconAvatarProps, 'Icon'>;

const Avatar = memo<AvatarProps>(({ background, ...rest }) => {
  return (
    <IconAvatar
      Icon={Color}
      aria-label={TITLE}
      background={background || COLOR_PRIMARY}
      iconMultiple={0.7}
      {...rest}
    />
  );
});

export default Avatar;
