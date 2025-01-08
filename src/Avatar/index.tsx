'use client';

import { getEmoji } from '@lobehub/fluent-emoji';
import { Avatar as AntAvatar, type AvatarProps as AntAvatarProps } from 'antd';
import { type ReactNode, forwardRef, isValidElement, useMemo } from 'react';

import FluentEmoji from '@/FluentEmoji';
import Img from '@/Img';

import { useStyles } from './style';

export interface AvatarProps extends AntAvatarProps {
  animation?: boolean;
  /**
   * @description The URL or base64 data of the avatar image
   */
  avatar?: string | ReactNode;
  /**
   * @description The background color of the avatar
   */
  background?: string;
  /**
   * @description The shape of the avatar
   * @default 'circle'
   */
  shape?: 'circle' | 'square';
  /**
   * @description The size of the avatar in pixels
   * @default 40
   */
  size?: number;
  /**
   * @description The title text to display if avatar is not provided
   */
  title?: string;
  unoptimized?: boolean;
}

const Avatar = forwardRef<HTMLDivElement, AvatarProps>(
  (
    {
      className,
      avatar,
      title,
      animation,
      size = 40,
      shape = 'circle',
      background = 'rgba(0,0,0,0)',
      style,
      unoptimized,
      alt,
      ...rest
    },
    ref,
  ) => {
    const isStringAvatar = typeof avatar === 'string';
    const isDefaultAntAvatar = Boolean(
      avatar &&
        (['/', 'http', 'data:'].some((index) => isStringAvatar && avatar.startsWith(index)) ||
          isValidElement(avatar)),
    );

    const emoji = useMemo(
      () => avatar && !isDefaultAntAvatar && isStringAvatar && getEmoji(avatar),
      [avatar],
    );

    const { styles, cx } = useStyles({ background, isEmoji: Boolean(emoji), size });

    const text = String(isDefaultAntAvatar ? title : avatar);

    const avatarProps = {
      alt: alt || title || 'avatar',
      className: cx(styles.avatar, className),
      shape,
      size,
      style: rest?.onClick ? style : { cursor: 'default', ...style },
      ...rest,
    };

    if (isDefaultAntAvatar)
      return (
        <AntAvatar
          ref={ref}
          src={
            typeof avatar === 'string' ? (
              <Img
                alt={avatarProps.alt}
                height={size}
                loading={'lazy'}
                src={avatar}
                unoptimized={unoptimized}
                width={size}
              />
            ) : (
              avatar
            )
          }
          {...avatarProps}
        />
      );

    return (
      <AntAvatar ref={ref} {...avatarProps}>
        {emoji ? (
          <FluentEmoji
            emoji={emoji}
            size={size * 0.8}
            type={animation ? 'anim' : '3d'}
            unoptimized={unoptimized}
          />
        ) : (
          text?.toUpperCase().slice(0, 2)
        )}
      </AntAvatar>
    );
  },
);

export default Avatar;
