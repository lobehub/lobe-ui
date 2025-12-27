'use client';

import { Image as AntImage, Skeleton } from 'antd';
import { cssVar, cx, useThemeMode } from 'antd-style';
import { memo } from 'react';

import { Flexbox } from '@/Flex';

import usePreview from './components/usePreview';
import { FALLBACK_DARK, FALLBACK_LIGHT, styles, variants } from './style';
import type { ImageProps } from './type';

const Image = memo<ImageProps>(
  ({
    ref,
    style,
    preview,
    isLoading,
    maxHeight = '100%',
    maxWidth = '100%',
    minHeight,
    minWidth,
    actions,
    className,
    alwaysShowActions,
    variant = 'filled',
    objectFit = 'cover',
    classNames,
    styles: customStyles,
    onClick,
    width,
    height,
    ...rest
  }) => {
    const { isDarkMode } = useThemeMode();
    const actionsClassName = alwaysShowActions ? styles.actionsVisible : styles.actionsHidden;
    const mergePreivew = usePreview(preview);

    if (isLoading)
      return (
        <div onClick={onClick}>
          <Skeleton.Avatar
            active
            style={{
              borderRadius: cssVar.borderRadius,
              height,
              maxHeight,
              maxWidth,
              minHeight,
              minWidth,
              width,
            }}
          />
        </div>
      );

    return (
      <Flexbox className={cx(variants({ variant }), className)} ref={ref} style={style}>
        {actions && (
          <div className={cx(actionsClassName, alwaysShowActions ? '' : 'actions-hidden')}>
            {actions}
          </div>
        )}
        <AntImage
          className={cx(styles.image, classNames?.image)}
          classNames={{
            root: cx(styles.wrapper, classNames?.wrapper),
          }}
          fallback={isDarkMode ? FALLBACK_DARK : FALLBACK_LIGHT}
          height={height}
          loading={'lazy'}
          onClick={onClick}
          preview={preview === false ? false : (mergePreivew as any)}
          style={{
            maxHeight,
            maxWidth,
            minHeight,
            minWidth,
            objectFit: objectFit || 'cover',
            ...customStyles?.image,
          }}
          styles={{
            root: customStyles?.wrapper,
          }}
          width={width}
          {...rest}
        />
      </Flexbox>
    );
  },
);

Image.displayName = 'Image';

export default Image;
