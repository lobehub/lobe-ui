'use client';

import { getEmoji } from '@lobehub/fluent-emoji';
import clsx from 'clsx';
import { Loader2 } from 'lucide-react';
import { memo, type ReactNode, useMemo, useState } from 'react';

import { Center } from '@/Flex';
import FluentEmoji from '@/FluentEmoji';
import Icon from '@/Icon';
import { cssVar } from '@/styles/stylex/cssVar.stylex';
import { styleProps } from '@/styles/stylex/props';
import { stylish } from '@/styles/stylex/stylish';
import { safeReadableColor } from '@/utils/safeReadableColor';

import { styles } from './style';
import { type AvatarProps } from './type';
import {
  calculateEmojiSize,
  formatAvatarText,
  hasValidBackground,
  isDefaultAntAvatar,
} from './utils';

const variantStyles = {
  borderless: stylish.variantBorderlessWithoutHover,
  filled: stylish.variantFilledWithoutHover,
  outlined: stylish.variantOutlinedWithoutHover,
};

type AvatarImplProps = AvatarProps & {
  contentXstyle?: Parameters<typeof styleProps>[0];
  xstyle?: Parameters<typeof styleProps>[0];
};

export const AvatarImpl = memo<AvatarImplProps>(
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
    xstyle,
    contentXstyle,
    ...rest
  }) => {
    const isStringAvatar = typeof avatar === 'string';

    const [isImgError, setIsImgError] = useState(false);

    const isUrlOrElement = useMemo(() => isDefaultAntAvatar(avatar), [avatar]);

    const emoji = useMemo(
      () => (avatar && isStringAvatar && !isUrlOrElement ? getEmoji(avatar) : undefined),
      [avatar, isStringAvatar, isUrlOrElement],
    );

    const text = isUrlOrElement ? title : typeof avatar === 'string' ? avatar : undefined;

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
        ref={ref}
        className={
          styleProps(
            [styles.root, variantStyles[variant], shadow && styles.shadow, xstyle],
            clsx(className, classNames?.root),
          ).className
        }
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
            flex={'none'}
            height={'100%'}
            width={'100%'}
            {...styleProps(styles.loading, classNames?.loading, customStyles?.loading)}
          >
            <Icon spin icon={Loader2} />
          </Center>
        )}
        {typeof avatar === 'string' && showImage && (
          <img
            alt={imgAlt}
            crossOrigin={crossOrigin}
            draggable={draggable}
            height={size}
            loading={'lazy'}
            src={avatar}
            width={size}
            {...styleProps(styles.img, classNames?.img, customStyles?.img)}
            onError={() => setIsImgError(true)}
          />
        )}
        {!showImage && (
          <span
            {...styleProps(
              [styles.content, contentXstyle],
              classNames?.content,
              customStyles?.content,
            )}
          >
            {showElement ? avatar : customAvatar}
          </span>
        )}
      </div>
    );
  },
);

AvatarImpl.displayName = 'Avatar';

const Avatar = AvatarImpl as (props: AvatarProps) => ReactNode;

export default Avatar;
