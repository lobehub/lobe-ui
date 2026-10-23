'use client';

import { getEmoji } from '@lobehub/fluent-emoji';
import BoringAvatar from 'boring-avatars';
import clsx from 'clsx';
import { Loader2 } from 'lucide-react';
import { memo, type ReactNode, useMemo, useState } from 'react';

import { Center } from '@/Flex';
import FluentEmoji from '@/FluentEmoji';
import Icon from '@/Icon';
import { cssVar } from '@/styles/stylex/cssVar.stylex';
import { styleProps } from '@/styles/stylex/props';
import { stylish } from '@/styles/stylex/stylish';
import { toDataAttributes } from '@/utils/bem';
import { safeReadableColor } from '@/utils/safeReadableColor';

import { avatarClasses } from './stable';
import { styles } from './style';
import { type AvatarProps } from './type';
import {
  AVATAR_FALLBACK_COLORS,
  calculateEmojiSize,
  formatAvatarText,
  getAvatarFallbackSeed,
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
    fallbackColors,
    fallbackVariant = 'marble',
    loading,
    ref,
    shadow,
    shape = 'square',
    size: sizeProp,
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
    const size = sizeProp ?? 48;
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

    // Plain text avatars (a name, initials) are treated as a seed like `title`; only
    // `fallbackVariant="text"` renders them as uppercase text.
    const fallbackSeed = getAvatarFallbackSeed(avatar, title, alt);
    const showFallback =
      fallbackVariant !== 'text' && !!fallbackSeed && !emoji && !showImage && !showElement;
    const colors = fallbackColors?.length ? fallbackColors : AVATAR_FALLBACK_COLORS;

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

    const customSize = sizeProp !== undefined;
    const showDefaultBackground =
      !background && !showFallback && !((isUrlOrElement && !isImgError) || emoji);

    return (
      <div
        {...toDataAttributes({ shadow, shape, variant })}
        {...rest}
        ref={ref}
        className={
          styleProps(
            [
              styles.root,
              variantStyles[variant],
              shadow && styles.shadow,
              !customSize && styles.defaultSize,
              !customSize && !!emoji && styles.defaultEmojiFont,
              shape === 'circle' ? styles.circle : !customSize && styles.defaultSquare,
              showDefaultBackground && styles.defaultBackground,
              !background && styles.defaultColor,
              !!rest?.onClick && styles.clickable,
              xstyle,
            ],
            clsx(avatarClasses(), className, classNames?.root),
          ).className
        }
        style={{
          ...(background && { backgroundColor: background, color: safeReadableColor(background) }),
          ...(customSize && {
            fontSize: size * (emoji ? 0.7 : 0.5),
            height: size,
            width: size,
            ...(shape !== 'circle' && { borderRadius: size < 24 ? '33%' : Math.max(size / 6, 2) }),
          }),
          ...(bordered && {
            boxShadow: `${cssVar.colorBgLayout} 0 0 0 2px, ${borderedColor || cssVar.colorTextTertiary} 0 0 0 4px`,
          }),
          ...style,
          ...customStyles?.root,
        }}
      >
        {loading && (
          <Center
            flex={'none'}
            height={'100%'}
            width={'100%'}
            {...styleProps(
              styles.loading,
              clsx(avatarClasses('loading'), classNames?.loading),
              customStyles?.loading,
            )}
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
            {...styleProps(
              styles.img,
              clsx(avatarClasses('img'), classNames?.img),
              customStyles?.img,
            )}
            onError={() => setIsImgError(true)}
          />
        )}
        {showFallback && (
          <BoringAvatar
            square
            aria-label={imgAlt}
            colors={colors}
            name={fallbackSeed}
            size={'100%'}
            variant={fallbackVariant}
            {...styleProps(
              styles.fallback,
              clsx(avatarClasses('fallback'), classNames?.fallback),
              customStyles?.fallback,
            )}
          />
        )}
        {!showImage && !showFallback && (
          <span
            {...styleProps(
              [styles.content, contentXstyle],
              clsx(avatarClasses('content'), classNames?.content),
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
