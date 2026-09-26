'use client';

import { cssVar, cx } from 'antd-style';
import { Plus } from 'lucide-react';
import { type KeyboardEvent, memo, useMemo } from 'react';

import FluentEmoji from '@/FluentEmoji';
import Icon from '@/Icon';
import Text from '@/Text';

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

    const rootClassName = cx(
      isPage ? styles.rootPage : styles.root,
      !isPage && variant === 'dashed' && styles.dashed,
      isClickable && styles.dashedClickable,
      className,
    );

    const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
      if (!isClickable) return;
      if (event.key !== 'Enter' && event.key !== ' ') return;

      event.preventDefault();
      (onClick as (event: unknown) => void)?.(event);
    };

    const rootStyle: EmptyProps['style'] = {
      color:
        !isPage && variant === 'dashed' ? cssVar.colorTextTertiary : cssVar.colorTextQuaternary,
      ...style,
    };

    const titleNode = title && (
      <Text
        align={isCenter ? 'center' : undefined}
        color={cssVar.colorText}
        fontSize={isPage ? 18 : 14}
        weight={isPage ? 600 : 500}
        style={{
          marginBottom: isPage ? 4 : 0,
          marginTop: isPage ? 0 : variant === 'dashed' ? 6 : 8,
        }}
        {...titleProps}
      >
        {title}
      </Text>
    );

    const descriptionNode = description && (
      <Text
        align={isCenter ? 'center' : undefined}
        color={cssVar.colorTextTertiary}
        fontSize={13}
        style={{ maxWidth: isPage ? '52ch' : '34ch' }}
        {...descriptionProps}
      >
        {description}
      </Text>
    );

    if (isPage) {
      return (
        <div
          className={rootClassName}
          ref={ref}
          style={{ alignItems: alignValue, ...rootStyle }}
          onClick={onClick}
          {...rest}
        >
          {cover && <div {...imageProps}>{cover}</div>}
          <div>
            {titleNode}
            {descriptionNode}
            {children}
            {action && (
              <div className={styles.extraPage} {...actionProps}>
                {action}
              </div>
            )}
          </div>
        </div>
      );
    }

    return (
      <div
        className={rootClassName}
        ref={ref}
        role={isClickable ? 'button' : undefined}
        style={{ alignItems: alignValue, textAlign: isCenter ? 'center' : undefined, ...rootStyle }}
        tabIndex={isClickable ? 0 : undefined}
        onClick={onClick}
        onKeyDown={handleKeyDown}
        {...rest}
      >
        {cover && <div {...imageProps}>{cover}</div>}
        {titleNode}
        {descriptionNode}
        {children}
        {action && (
          <div className={styles.action} {...actionProps}>
            {action}
          </div>
        )}
      </div>
    );
  },
);

Empty.displayName = 'Empty';

export default Empty;
