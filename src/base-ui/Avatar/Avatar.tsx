'use client';

import { getEmoji } from '@lobehub/fluent-emoji';
import { cssVar, cx } from 'antd-style';
import { Loader2 } from 'lucide-react';
import { memo, useMemo, useState } from 'react';

import { Center } from '@/Flex';
import FluentEmoji from '@/FluentEmoji';
import Icon from '@/Icon';
import { safeReadableColor } from '@/utils/safeReadableColor';

import { styles, variants } from './style';
import { type AvatarProps } from './type';
import {
  calculateEmojiSize,
  formatAvatarText,
  hasValidBackground,
  isDefaultAntAvatar,
} from './utils';

const Avatar = memo<AvatarProps>(
  ({
    alt,
    animation,
    avatar,
    background,
    bordered,
    borderedColor,
    className,
    classNames,
    crossOrigin,
    draggable = false,
    emojiScaleWithBackground = true,
    loading,
    ref,
    shadow,
    shape = 'square',
    size = 48,
    sliceText = true,
    style,
    styles: customStyles,
    title,
    tooltipProps,
    unoptimized,
    variant = 'borderless',
    ...rest
  }) => {
    const isStringAvatar = typeof avatar === 'string';

    const [isImgError, setIsImgError] = useState(false);

    const isUrlOrElement = useMemo(() => isDefaultAntAvatar(avatar), [avatar]);

    const emoji = useMemo(
      () => (avatar && isStringAvatar && !isUrlOrElement ? getEmoji(avatar) : undefined),
      [avatar, isStringAvatar, isUrlOrElement],
    );

    const text = String(isUrlOrElement ? title : avatar);

    const imgAlt = alt || title || 'avatar';

    const hasBackground = hasValidBackground(background);
    const showImage = isUrlOrElement && isStringAvatar && !isImgError;
    const showElement = isUrlOrElement && !isStringAvatar && !isImgError;

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

    return (
      <div
        {...rest}
        className={cx(variants({ shadow, variant }), className, classNames?.root)}
        ref={ref}
        style={{
          backgroundColor:
            (isUrlOrElement && !isImgError) || emoji
              ? background
              : background || cssVar.colorBorder,
          borderRadius: shape === 'circle' ? '50%' : size < 24 ? '33%' : Math.max(size / 6, 2),
          boxShadow: bordered
            ? `${cssVar.colorBgLayout} 0 0 0 2px, ${borderedColor || cssVar.colorTextTertiary} 0 0 0 4px`
            : undefined,
          color: safeReadableColor(background || cssVar.colorBorder),
          cursor: rest?.onClick ? 'pointer' : undefined,
          fontSize: size * (emoji ? 0.7 : 0.5),
          height: size,
          width: size,
          ...style,
          ...customStyles?.root,
        }}
      >
        {loading && (
          <Center
            className={cx(styles.loading, classNames?.loading)}
            flex={'none'}
            height={'100%'}
            style={customStyles?.loading}
            width={'100%'}
          >
            <Icon spin icon={Loader2} />
          </Center>
        )}
        {typeof avatar === 'string' && showImage && (
          <img
            alt={imgAlt}
            className={cx(styles.img, classNames?.img)}
            crossOrigin={crossOrigin}
            draggable={draggable}
            height={size}
            loading={'lazy'}
            src={avatar}
            style={customStyles?.img}
            width={size}
            onError={() => setIsImgError(true)}
          />
        )}
        {!showImage && (
          <span className={cx(styles.content, classNames?.content)} style={customStyles?.content}>
            {showElement ? avatar : customAvatar}
          </span>
        )}
      </div>
    );
  },
);

Avatar.displayName = 'Avatar';

export default Avatar;
