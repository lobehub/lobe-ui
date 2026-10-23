'use client';

import clsx from 'clsx';
import { memo } from 'react';

import { Flexbox } from '@/Flex';
import { cssVar } from '@/styles/stylex/cssVar.stylex';
import { styleProps } from '@/styles/stylex/props';

import { AvatarImpl as Avatar } from '../Avatar';
import { avatarGroupClasses } from '../stable';
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
    size: sizeProp,
    background,
    animation,
    draggable,
    fallbackColors,
    fallbackVariant,
    classNames,
    shape,
    styles: customStyles,
    onClick,
    ref,
    zIndexReverse,
    className,
    ...rest
  }) => {
    const size = sizeProp ?? 48;
    const avatars = max ? items.slice(0, max) : items;
    const restAvatars = items.slice(max, items.length);
    const gapValue = gap ?? Math.floor(-size / 4);

    const avatarProps = {
      animation,
      background,
      bordered,
      draggable,
      fallbackColors,
      fallbackVariant,
      shadow,
      shape,
      size: sizeProp,
      variant,
    };

    return (
      <Flexbox
        horizontal
        gap={gap}
        ref={ref}
        {...styleProps(styles.root, clsx(avatarGroupClasses(), className))}
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
              className={clsx(avatarGroupClasses('avatar'), classNames?.avatar, avatarClassName)}
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
            className={clsx(avatarGroupClasses('count'), classNames?.count)}
            contentXstyle={styles.count}
            fallbackVariant={'text'}
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
