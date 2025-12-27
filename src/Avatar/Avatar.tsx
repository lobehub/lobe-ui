'use client';

import { getEmoji } from '@lobehub/fluent-emoji';
import { Avatar as AntAvatar } from 'antd';
import { cssVar, cx, useTheme } from 'antd-style';
import { Loader2 } from 'lucide-react';
import { readableColor } from 'polished';
import { isValidElement, memo, useMemo } from 'react';

import { Center } from '@/Flex';
import FluentEmoji from '@/FluentEmoji';
import Icon from '@/Icon';
import Img from '@/Img';

import { styles, variants } from './style';
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
    shape = 'square',
    background,
    style,
    unoptimized,
    alt,
    variant = 'borderless',
    shadow,
    loading,
    sliceText = true,
    emojiScaleWithBackground = true,
    ref,
    ...rest
  }) => {
    const theme = useTheme();
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

    const hasBackground =
      background &&
      background !== 'transparent' &&
      background !== 'rgba(0,0,0,0)' &&
      background !== null;

    const customAvatar = useMemo(
      () =>
        emoji ? (
          <FluentEmoji
            emoji={emoji}
            size={emojiScaleWithBackground ? (hasBackground ? size * 0.85 : size) : size * 0.85}
            type={animation ? 'anim' : '3d'}
            unoptimized={unoptimized}
          />
        ) : sliceText ? (
          (text || title)?.toUpperCase().slice(0, 2)
        ) : (
          (text || title)?.toUpperCase()
        ),
      [
        animation,
        emoji,
        hasBackground,
        size,
        sliceText,
        text,
        title,
        unoptimized,
        emojiScaleWithBackground,
      ],
    );

    // Get actual color value for readableColor (CSS variables can't be parsed)
    const actualColorForReadable = useMemo(() => {
      const bgColor = background || theme.colorBorder;
      // If background is a CSS variable, use theme.colorBorder as fallback
      if (typeof bgColor === 'string' && bgColor.startsWith('var(')) {
        return theme.colorBorder;
      }
      return bgColor;
    }, [background, theme.colorBorder]);

    return (
      <AntAvatar
        alt={imgAlt}
        className={cx(variants({ shadow, variant }), className)}
        draggable={false}
        ref={ref}
        shape={shape}
        size={size}
        src={isDefaultAntAvatar ? defualtAvatar : undefined}
        style={{
          background: isDefaultAntAvatar || !!emoji ? background : background || cssVar.colorBorder,
          borderRadius: shape === 'square' && size && size < 24 ? '33%' : undefined,
          boxShadow: bordered
            ? `${cssVar.colorBgLayout} 0 0 0 2px, ${borderedColor || cssVar.colorTextTertiary} 0 0 0 4px`
            : undefined,
          color: readableColor(actualColorForReadable),
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
  },
);

Avatar.displayName = 'Avatar';

export default Avatar;
