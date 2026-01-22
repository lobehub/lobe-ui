'use client';

import { getEmoji } from '@lobehub/fluent-emoji';
import { Avatar as AntAvatar } from 'antd';
import { cssVar, cx } from 'antd-style';
import { Loader2 } from 'lucide-react';
import { memo, useMemo, useState } from 'react';

import { Center } from '@/Flex';
import FluentEmoji from '@/FluentEmoji';
import Icon from '@/Icon';
import Img from '@/Img';
import { safeReadableColor } from '@/utils/safeReadableColor';

import { styles, variants } from './style';
import type { AvatarProps } from './type';
import {
  calculateEmojiSize,
  isDefaultAntAvatar as checkIsDefaultAntAvatar,
  formatAvatarText,
  getActualColorForReadable,
  hasValidBackground,
} from './utils';

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
    const isStringAvatar = typeof avatar === 'string';

    const isDefaultAntAvatar = useMemo(() => checkIsDefaultAntAvatar(avatar), [avatar]);
    const [isImgError, setIsImgError] = useState(false);

    const emoji = useMemo(
      () => avatar && !isDefaultAntAvatar && isStringAvatar && getEmoji(avatar),
      [avatar, isStringAvatar, isDefaultAntAvatar],
    );

    const text = String(isDefaultAntAvatar ? title : avatar);

    const imgAlt = alt || title || 'avatar';

    const defaultAvatar = useMemo(
      () =>
        typeof avatar === 'string' ? (
          <Img
            alt={imgAlt}
            height={size}
            loading={'lazy'}
            onError={() => setIsImgError(true)}
            src={avatar}
            unoptimized={unoptimized}
            width={size}
          />
        ) : (
          avatar
        ),
      [avatar, imgAlt, size, unoptimized],
    );

    const hasBackground = hasValidBackground(background);

    const customAvatar = useMemo(
      () =>
        emoji ? (
          <FluentEmoji
            emoji={emoji}
            size={calculateEmojiSize(size, hasBackground, emojiScaleWithBackground)}
            type={animation ? 'anim' : '3d'}
            unoptimized={unoptimized}
          />
        ) : (
          formatAvatarText(text || title, sliceText)
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
    const actualColorForReadable = useMemo(
      () => getActualColorForReadable(background, cssVar.colorBorder),
      [background],
    );

    const avatarStyle = useMemo(
      () => ({
        backgroundColor:
          (isDefaultAntAvatar && !isImgError) || emoji
            ? background
            : background || cssVar.colorBorder,
        borderRadius: shape === 'square' && size && size < 24 ? '33%' : undefined,
        boxShadow: bordered
          ? `${cssVar.colorBgLayout} 0 0 0 2px, ${borderedColor || cssVar.colorTextTertiary} 0 0 0 4px`
          : undefined,
        color: safeReadableColor(actualColorForReadable),
        cursor: rest?.onClick ? 'pointer' : undefined,
        fontSize: size * (emoji ? 0.7 : 0.5),
        ...style,
      }),
      [
        isDefaultAntAvatar,
        isImgError,
        background,
        shape,
        emoji,
        size,
        bordered,
        borderedColor,
        actualColorForReadable,
        rest?.onClick,
        style,
      ],
    );

    const showFallback = !isDefaultAntAvatar || isImgError;

    return (
      <AntAvatar
        alt={imgAlt}
        className={cx(variants({ shadow, variant }), className)}
        draggable={false}
        ref={ref}
        shape={shape}
        size={size}
        src={isDefaultAntAvatar && !isImgError ? defaultAvatar : undefined}
        style={avatarStyle}
        {...rest}
      >
        {loading && (
          <Center className={styles.loading} height={'100%'} width={'100%'}>
            <Icon icon={Loader2} spin />
          </Center>
        )}
        {showFallback && customAvatar}
      </AntAvatar>
    );
  },
);

Avatar.displayName = 'Avatar';

export default Avatar;
