'use client';

import { memo } from 'react';
import { Flexbox } from 'react-layout-kit';

import Avatar from '../Avatar';
import type { AvatarGroupProps } from '../type';
import { useStyles } from './style';

const AvatarGroup = memo<AvatarGroupProps>(
  ({
    items,
    max,
    gap,
    variant = 'borderless',
    bordered,
    shadow,
    size = 48,
    background,
    animation,
    draggable,
    classNames,
    shape,
    styles: customStyles,
    onClick,
    ref,
    ...rest
  }) => {
    const { cx, styles } = useStyles();
    const avatars = max ? items.slice(0, max) : items;
    const restAvatars = items.slice(max, items.length);
    const gapValue = gap ?? Math.floor(-size / 4);

    const avatarProps = {
      animation,
      background,
      bordered,
      draggable,
      shadow,
      shape,
      size,
      variant,
    };

    return (
      <Flexbox
        gap={gap}
        horizontal
        ref={ref}
        style={{
          position: 'relative',
        }}
        {...rest}
      >
        {avatars.map((avatar, index) => {
          const {
            key,
            style: avatarStyle,
            className: avatarClassName,
            ...restAvatarProps
          } = avatar;
          return (
            <Avatar
              className={cx(classNames?.avatar, avatarClassName, styles.avatar)}
              key={key}
              onClick={() => onClick?.({ item: avatar, key })}
              style={{
                marginLeft: index === 0 ? 0 : gapValue,
                ...customStyles?.avatar,
                ...avatarStyle,
              }}
              {...avatarProps}
              {...restAvatarProps}
            />
          );
        })}
        {max && restAvatars.length > 0 && (
          <Avatar
            avatar={`+${restAvatars.length}`}
            className={cx(styles.count, classNames?.count, styles.avatar)}
            sliceText={false}
            style={{
              marginLeft: gapValue,
              ...customStyles?.count,
            }}
            {...avatarProps}
          />
        )}
      </Flexbox>
    );
  },
);

AvatarGroup.displayName = 'AvatarGroup';

export default AvatarGroup;
