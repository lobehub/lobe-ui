'use client';

import { Image as AntImage, Skeleton } from 'antd';
import { cva } from 'class-variance-authority';
import { memo, useMemo } from 'react';
import { Flexbox } from 'react-layout-kit';

import usePreview from './components/usePreview';
import { FALLBACK_DARK, FALLBACK_LIGHT, useStyles } from './style';
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
    const { styles, cx, theme } = useStyles({
      alwaysShowActions,
    });
    const mergePreivew = usePreview(preview);

    const variants = useMemo(
      () =>
        cva(styles.root, {
          defaultVariants: {
            variant: 'filled',
          },
          /* eslint-disable sort-keys-fix/sort-keys-fix */
          variants: {
            variant: {
              filled: styles.filled,
              outlined: styles.outlined,
              borderless: styles.borderless,
            },
          },
          /* eslint-enable sort-keys-fix/sort-keys-fix */
        }),
      [styles],
    );

    if (isLoading)
      return (
        <div onClick={onClick}>
          <Skeleton.Avatar
            active
            style={{
              borderRadius: theme.borderRadius,
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
        {actions && <div className={styles.actions}>{actions}</div>}
        <AntImage
          className={cx(styles.image, classNames?.image)}
          classNames={{
            root: cx(styles.wrapper, classNames?.wrapper),
          }}
          fallback={theme.isDarkMode ? FALLBACK_DARK : FALLBACK_LIGHT}
          height={height}
          loading={'lazy'}
          onClick={onClick}
          preview={
            preview === false
              ? false
              : {
                  mask: false,
                  ...(mergePreivew as any),
                }
          }
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
