'use client';

import { Image as AntImage, type ImageProps as AntImageProps, Skeleton } from 'antd';
import { useResponsive, useThemeMode } from 'antd-style';
import { Eye } from 'lucide-react';
import { ReactNode, memo } from 'react';
import { Flexbox } from 'react-layout-kit';

import Icon from '@/Icon';

import { useStyles } from './style';
import usePreview from './usePreview';

export interface ImageProps extends AntImageProps {
  actions?: ReactNode;
  alwaysShowActions?: boolean;
  borderless?: boolean;
  classNames?: {
    image?: string;
    wrapper?: string;
  };
  isLoading?: boolean;
  minSize?: number | string;
  objectFit?: 'cover' | 'contain';
  preview?: AntImageProps['preview'] & {
    toolbarAddon?: ReactNode;
  };
  size?: number | string;
  toolbarAddon?: ReactNode;
}

const Image = memo<ImageProps>(
  ({
    wrapperClassName,
    style,
    preview,
    isLoading,
    minSize = 64,
    size = '100%',
    actions,
    alwaysShowActions,
    objectFit = 'cover',
    classNames = {},
    onClick,
    width,
    height,
    borderless,
    ...rest
  }) => {
    const { mobile } = useResponsive();
    const { isDarkMode } = useThemeMode();
    const { styles, cx, theme } = useStyles({
      alwaysShowActions,
      borderless,
      minSize,
      objectFit,
      size,
    });
    const mergePreivew = usePreview(preview);

    if (isLoading)
      return (
        <div onClick={onClick}>
          <Skeleton.Avatar
            active
            style={{
              borderRadius: theme.borderRadius,
              height,
              maxHeight: size,
              maxWidth: size,
              minHeight: minSize,
              minWidth: minSize,
              width,
            }}
          />
        </div>
      );

    return (
      <Flexbox className={cx(styles.imageWrapper, wrapperClassName)} style={style}>
        {actions && <div className={styles.actions}>{actions}</div>}
        <AntImage
          className={classNames.image}
          fallback={
            isDarkMode
              ? 'https://gw.alipayobjects.com/zos/kitchen/nhzBb%24r0Cm/image_off_dark.webp'
              : 'https://gw.alipayobjects.com/zos/kitchen/QAvkgt30Ys/image_off_light.webp'
          }
          height={height}
          loading={'lazy'}
          onClick={onClick}
          preview={
            preview === false
              ? false
              : {
                  mask: mobile ? false : actions ? <div /> : <Icon icon={Eye} size={'normal'} />,
                  ...(mergePreivew as any),
                }
          }
          width={width}
          wrapperClassName={cx(styles.image, classNames.wrapper)}
          {...rest}
        />
      </Flexbox>
    );
  },
);

export default Image;
