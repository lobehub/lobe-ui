'use client';

import clsx from 'clsx';
import type { CSSProperties } from 'react';

import { a2uiStyles } from '@/internal/a2ui/styles';
import { avatarTintVars, initialsOf } from '@/internal/a2ui/utils';
import { styleProps } from '@/styles/stylex/props';

import { avatarGroupClasses } from '../stable';
import type { AvatarGroupItemType, AvatarGroupProps } from '../type';
import { styles } from './a2uiStyle';

const isImage = (value: unknown): value is string =>
  typeof value === 'string' && /^(https?:|data:|blob:|\/|\.\/)/.test(value);

const nameOf = (item: AvatarGroupItemType) =>
  item.title ??
  item.label ??
  item.alt ??
  (typeof item.avatar === 'string' && !isImage(item.avatar) ? item.avatar : undefined) ??
  item.key;

/**
 * `variant="a2ui"`: the A2UI playground `AvatarGroup`, initials tinted by the name's hue, a 2px
 * ring, a `+N` count and an optional label. Adapted from CopilotKit a2ui-playground (MIT).
 */
const A2uiAvatarGroup = ({
  className,
  classNames,
  items,
  label,
  max,
  onClick,
  ref,
  size: sizeProp,
  style,
  styles: customStyles,
}: AvatarGroupProps) => {
  const size = sizeProp ?? 32;
  const shown = max ? items.slice(0, Math.max(1, max)) : items;
  const hidden = items.slice(shown.length);
  const hiddenNames = hidden.map(nameOf).filter(Boolean).join(', ');
  const box = { height: size, width: size };

  return (
    <div
      data-variant="a2ui"
      ref={ref}
      {...styleProps([a2uiStyles.base, styles.root], clsx(avatarGroupClasses(), className), style)}
    >
      <div {...styleProps(styles.stack)}>
        {shown.map((item, index) => {
          const name = nameOf(item);
          const interactive = !item.disabled && (!!onClick || !!item.onClick);
          return (
            <div
              aria-label={item.label ?? name}
              key={item.key}
              role={interactive ? 'button' : undefined}
              tabIndex={interactive ? 0 : undefined}
              title={name}
              {...styleProps(
                styles.avatar,
                clsx(avatarGroupClasses('avatar'), classNames?.avatar, item.className),
                {
                  ...box,
                  ...avatarTintVars(name),
                  marginInlineStart: index === 0 ? 0 : -6,
                  ...(item.ringColor && { boxShadow: `0 0 0 2px ${item.ringColor}` }),
                  ...customStyles?.avatar,
                  ...item.style,
                } as CSSProperties,
              )}
              onClick={
                interactive
                  ? (item.onClick ?? (() => onClick?.({ item, key: item.key })))
                  : undefined
              }
            >
              {isImage(item.avatar) ? (
                <img alt={item.alt ?? name} src={item.avatar} {...styleProps(styles.img)} />
              ) : (
                initialsOf(name)
              )}
            </div>
          );
        })}
        {hidden.length > 0 && (
          <div
            aria-label={hiddenNames || undefined}
            title={hiddenNames || undefined}
            {...styleProps(styles.count, clsx(avatarGroupClasses('count'), classNames?.count), {
              ...box,
              marginInlineStart: -6,
              ...customStyles?.count,
            })}
          >
            +{hidden.length}
          </div>
        )}
      </div>
      {label != null && (
        <span {...styleProps(styles.label, avatarGroupClasses('label'))}>{label}</span>
      )}
    </div>
  );
};

export default A2uiAvatarGroup;
