'use client';

import { getEmoji } from '@lobehub/fluent-emoji';
import { Avatar as AntAvatar } from 'antd';
import { cva } from 'class-variance-authority';
import { Loader2 } from 'lucide-react';
import { readableColor } from 'polished';
import { isValidElement, memo, useMemo } from 'react';
import { Center } from 'react-layout-kit';

import FluentEmoji from '@/FluentEmoji';
import Icon from '@/Icon';
import Img from '@/Img';
import Tooltip from '@/Tooltip';

import { useStyles } from './style';
import type { AvatarProps } from './type';

const Avatar = memo<AvatarProps>(
  ({
    bordered,
    className,
    avatar,
    title,
    animation,
    borderedColor,
    size = 48,
    shape = 'circle',
    background,
    style,
    unoptimized,
    alt,
    variant = 'borderless',
    shadow,
    loading,
    sliceText = true,
    ref,
    ...rest
  }) => {
    const isStringAvatar = typeof avatar === 'string';

    const isDefaultAntAvatar = useMemo(
      () =>
        Boolean(
          avatar &&
            (['/', 'http', 'data:'].some((index) => isStringAvatar && avatar.startsWith(index)) ||
              isValidElement(avatar)),
        ),
      [avatar, isStringAvatar],
    );

    const emoji = useMemo(
      () => avatar && !isDefaultAntAvatar && isStringAvatar && getEmoji(avatar),
      [avatar, isStringAvatar, isDefaultAntAvatar],
    );

    const { styles, cx, theme } = useStyles();

    const variants = useMemo(
      () =>
        cva(styles.root, {
          defaultVariants: {
            shadow: false,
            variant: 'borderless',
          },
          /* eslint-disable sort-keys-fix/sort-keys-fix */
          variants: {
            variant: {
              filled: styles.filled,
              outlined: styles.outlined,
              borderless: styles.borderless,
            },
            shadow: {
              false: null,
              true: styles.shadow,
            },
          },
          /* eslint-enable sort-keys-fix/sort-keys-fix */
        }),
      [styles],
    );

    const text = String(isDefaultAntAvatar ? title : avatar);

    const imgAlt = alt || title || 'avatar';

    const defualtAvatar =
      typeof avatar === 'string' ? (
        <Img
          alt={imgAlt}
          height={size}
          loading={'lazy'}
          src={avatar}
          unoptimized={unoptimized}
          width={size}
        />
      ) : (
        avatar
      );

    const customAvatar = emoji ? (
      <FluentEmoji
        emoji={emoji}
        size={size * 0.8}
        type={animation ? 'anim' : '3d'}
        unoptimized={unoptimized}
      />
    ) : sliceText ? (
      text?.toUpperCase().slice(0, 2)
    ) : (
      text?.toUpperCase()
    );

    const content = (
      <AntAvatar
        alt={imgAlt}
        className={cx(variants({ shadow, variant }), className)}
        draggable={false}
        ref={ref}
        shape={shape}
        size={size}
        src={isDefaultAntAvatar ? defualtAvatar : undefined}
        style={{
          background: customAvatar && !emoji ? background || theme.colorFill : background,
          boxShadow: bordered
            ? `${theme.colorBgLayout} 0 0 0 2px, ${borderedColor || theme.colorTextTertiary} 0 0 0 4px`
            : undefined,
          color: readableColor(background || theme.colorBorder),
          cursor: rest?.onClick ? 'pointer' : undefined,
          fontSize: size * (emoji ? 0.7 : 0.5),
          ...style,
        }}
        {...rest}
      >
        {loading && (
          <Center className={styles.loading} height={'100%'} width={'100%'}>
            <Icon icon={Loader2} spin />
          </Center>
        )}
        {!isDefaultAntAvatar && customAvatar}
      </AntAvatar>
    );

    if (!title) return content;

    return (
      <Tooltip title={title} {...rest.tooltipProps}>
        {content}
      </Tooltip>
    );
  },
);

Avatar.displayName = 'Avatar';

export default Avatar;
