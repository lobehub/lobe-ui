'use client';

import { IconAvatar, type IconAvatarProps } from '@lobehub/icons';
import { type FC } from 'react';

import { COLOR_PRIMARY, TITLE } from '../style';
import Inner from './Inner';

export type AvatarProps = Omit<IconAvatarProps, 'Icon'>;

const Avatar: FC<AvatarProps> = ({ background, ...rest }) => {
  return (
    <IconAvatar
      Icon={Inner}
      aria-label={TITLE}
      background={background || COLOR_PRIMARY}
      color={'#fff'}
      iconMultiple={0.7}
      {...rest}
    />
  );
};

export default Avatar;
