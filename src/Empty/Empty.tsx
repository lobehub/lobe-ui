'use client';

import * as stylex from '@stylexjs/stylex';
import clsx from 'clsx';
import { Plus } from 'lucide-react';
import { type KeyboardEvent, memo, useMemo } from 'react';

import FluentEmoji from '@/FluentEmoji';
import Icon from '@/Icon';
import { cssVar } from '@/styles/stylex/cssVar.stylex';
import { styleProps } from '@/styles/stylex/props';
import Text from '@/Text';
import { toDataAttributes } from '@/utils/bem';

import { emptyClasses } from './stable';
import { styles } from './style';
import type { EmptyProps } from './type';

const Empty = memo<EmptyProps>(
  ({
    title,
    description,
    icon,
    iconColor,
    emoji,
    image,
    imageSize = 48,
    action,
    actionProps,
    titleProps,
    descriptionProps,
    align,
    imageProps,
    children,
    type = 'default',
    variant = 'default',
    className,
    onClick,
    ref,
    style,
    ...rest
  }) => {
    const isPage = type === 'page';
    const alignValue = align || (isPage ? 'flex-start' : 'center');
    const isCenter = alignValue === 'center';

    const isClickable = !isPage && variant === 'dashed' && !!onClick;
    const resolvedIcon = icon ?? (isClickable ? Plus : undefined);

    const iconSize = isPage ? 36 : variant === 'dashed' ? 20 : 32;

    const cover = useMemo(() => {
      if (image) return image;
      if (emoji) return <FluentEmoji emoji={emoji} size={imageSize} type={'anim'} />;
      if (!resolvedIcon) return null;

      return (
        <Icon
          color={iconColor}
          icon={resolvedIcon}
          size={{ size: iconSize, strokeWidth: isPage ? 1.25 : 2 }}
        />
      );
    }, [image, emoji, imageSize, resolvedIcon, isPage, iconColor, iconSize]);

    const rootClassName = styleProps(
      [
        isPage ? styles.rootPage : styles.root,
        !isPage && variant === 'dashed' && styles.dashed,
        isClickable && styles.dashedClickable,
        !isPage && variant === 'dashed' ? styles.colorDashed : styles.colorDefault,
      ],
      clsx(emptyClasses(), className),
    ).className;

    const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
      if (!isClickable) return;
      if (event.key !== 'Enter' && event.key !== ' ') return;

      event.preventDefault();
      (onClick as (event: unknown) => void)?.(event);
    };

    const rootStyle: EmptyProps['style'] = style;
    const dataAttributes = toDataAttributes({ type, variant });

    const titleNode = title && (
      <Text
        align={isCenter ? 'center' : undefined}
        color={cssVar.colorText}
        fontSize={isPage ? 18 : 14}
        weight={isPage ? 600 : 500}
        {...titleProps}
        className={clsx(
          stylex.props(
            styles.title,
            isPage ? styles.titlePage : variant === 'dashed' && styles.titleDashed,
          ).className,
          emptyClasses('title'),
          titleProps?.className,
        )}
      >
        {title}
      </Text>
    );

    const descriptionNode = description && (
      <Text
        align={isCenter ? 'center' : undefined}
        color={cssVar.colorTextTertiary}
        fontSize={13}
        {...descriptionProps}
        className={clsx(
          stylex.props(styles.description, isPage && styles.descriptionPage).className,
          emptyClasses('description'),
          descriptionProps?.className,
        )}
      >
        {description}
      </Text>
    );

    if (isPage) {
      return (
        <div
          {...dataAttributes}
          className={rootClassName}
          ref={ref}
          style={{ alignItems: alignValue, ...rootStyle }}
          onClick={onClick}
          {...rest}
        >
          {cover && (
            <div {...imageProps} className={clsx(emptyClasses('cover'), imageProps?.className)}>
              {cover}
            </div>
          )}
          <div>
            {titleNode}
            {descriptionNode}
            {children}
            {action && (
              <div
                {...actionProps}
                {...styleProps(
                  styles.extraPage,
                  clsx(emptyClasses('action'), actionProps?.className),
                )}
              >
                {action}
              </div>
            )}
          </div>
        </div>
      );
    }

    return (
      <div
        {...dataAttributes}
        className={rootClassName}
        ref={ref}
        role={isClickable ? 'button' : undefined}
        style={{ alignItems: alignValue, textAlign: isCenter ? 'center' : undefined, ...rootStyle }}
        tabIndex={isClickable ? 0 : undefined}
        onClick={onClick}
        onKeyDown={handleKeyDown}
        {...rest}
      >
        {cover && (
          <div {...imageProps} className={clsx(emptyClasses('cover'), imageProps?.className)}>
            {cover}
          </div>
        )}
        {titleNode}
        {descriptionNode}
        {children}
        {action && (
          <div
            {...actionProps}
            {...styleProps(styles.action, clsx(emptyClasses('action'), actionProps?.className))}
          >
            {action}
          </div>
        )}
      </div>
    );
  },
);

Empty.displayName = 'Empty';

export default Empty;
