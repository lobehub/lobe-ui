'use client';

import clsx from 'clsx';
import { memo } from 'react';

import { Flexbox } from '@/Flex';
import { cssVar } from '@/styles/stylex/cssVar.stylex';

import { AvatarImpl as Avatar } from '../Avatar';
import type { AvatarGroupProps } from '../type';
import { styles } from './style';

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
    zIndexReverse,
    ...rest
  }) => {
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
        horizontal
        gap={gap}
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
              className={clsx(classNames?.avatar, avatarClassName)}
              key={key}
              xstyle={styles.avatar}
              style={{
                marginLeft: index === 0 ? 0 : gapValue,
                zIndex: zIndexReverse ? items.length - index : index,
                ...customStyles?.avatar,
                ...avatarStyle,
              }}
              onClick={() => onClick?.({ item: avatar, key })}
              {...avatarProps}
              {...restAvatarProps}
            />
          );
        })}
        {max && restAvatars.length > 0 && (
          <Avatar
            {...avatarProps}
            avatar={`+${restAvatars.length}`}
            background={cssVar.colorText}
            className={classNames?.count}
            contentXstyle={styles.count}
            sliceText={false}
            xstyle={styles.avatar}
            style={{
              marginLeft: gapValue,
              zIndex: zIndexReverse ? 0 : avatars.length,
              ...customStyles?.count,
            }}
          />
        )}
      </Flexbox>
    );
  },
);

AvatarGroup.displayName = 'AvatarGroup';

export default AvatarGroup;
