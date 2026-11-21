'use client';

import clsx from 'clsx';
import { type KeyboardEvent, memo } from 'react';

import { Flexbox } from '@/Flex';
import { cssVar } from '@/styles/stylex/cssVar.stylex';
import { styleProps } from '@/styles/stylex/props';

import { AvatarImpl as Avatar } from '../Avatar';
import { avatarGroupClasses } from '../stable';
import type { AvatarGroupProps } from '../type';
import { styles } from './style';

const pressOnKey = (event: KeyboardEvent<HTMLDivElement>) => {
  if (event.key !== 'Enter' && event.key !== ' ') return;
  event.preventDefault();
  event.currentTarget.click();
};

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
    const hiddenNames = restAvatars
      .map((item) => item.title ?? item.label ?? item.alt)
      .filter(Boolean)
      .join(', ');

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
            ringColor,
            label,
            pressed,
            disabled,
            badge,
            onClick: itemClick,
            ...restAvatarProps
          } = avatar;
          const interactive = !disabled && (!!onClick || !!itemClick);
          const stacking = {
            marginLeft: index === 0 ? 0 : gapValue,
            zIndex: badge ? items.length + 1 : zIndexReverse ? items.length - index : index,
          };
          const node = (
            <Avatar
              aria-disabled={disabled || undefined}
              aria-label={label}
              aria-pressed={interactive ? !!pressed : undefined}
              className={clsx(avatarGroupClasses('avatar'), classNames?.avatar, avatarClassName)}
              key={badge ? undefined : key}
              nativeTitle={label}
              role={interactive ? 'button' : undefined}
              tabIndex={interactive ? 0 : undefined}
              xstyle={styles.avatar}
              style={{
                ...(!badge && stacking),
                ...(ringColor && { boxShadow: `0 0 0 2px ${ringColor}` }),
                ...customStyles?.avatar,
                ...avatarStyle,
              }}
              onKeyDown={interactive ? pressOnKey : undefined}
              onClick={
                interactive ? (itemClick ?? (() => onClick?.({ item: avatar, key }))) : undefined
              }
              {...avatarProps}
              {...restAvatarProps}
            />
          );
          if (!badge) return node;
          const item = styleProps(styles.item, avatarGroupClasses('item'));
          return (
            <span className={item.className} key={key} style={{ ...item.style, ...stacking }}>
              {node}
              <span {...styleProps(styles.badge, avatarGroupClasses('badge'))}>{badge}</span>
            </span>
          );
        })}
        {max && restAvatars.length > 0 && (
          <Avatar
            {...avatarProps}
            aria-label={hiddenNames || undefined}
            avatar={`+${restAvatars.length}`}
            background={cssVar.colorText}
            className={clsx(avatarGroupClasses('count'), classNames?.count)}
            contentXstyle={styles.count}
            fallbackVariant={'text'}
            nativeTitle={hiddenNames || undefined}
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
