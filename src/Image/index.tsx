import { Image as AntImage, type ImageProps as AntImageProps, Skeleton } from 'antd';
import { useResponsive, useThemeMode } from 'antd-style';
import { Eye } from 'lucide-react';
import { ReactNode, memo } from 'react';
import { Flexbox } from 'react-layout-kit';

import Icon from '@/Icon';
import usePreview from '@/Image/usePreview';

import { useStyles } from './style';

export interface ImageProps extends AntImageProps {
  actions?: ReactNode;
  alwaysShowActions?: boolean;
  isLoading?: boolean;
  minSize?: number | string;
  objectFit?: 'cover' | 'contain';
  preview?: AntImageProps['preview'] & {
    toolbarAddon?: ReactNode;
  } & any;
  size?: number | string;
  toolbarAddon?: ReactNode;
}

const Image = memo<ImageProps>(
  ({
    wrapperClassName,
    style,
    preview = {},
    isLoading,
    minSize = 64,
    size = '100%',
    actions,
    alwaysShowActions,
    objectFit = 'cover',
    ...rest
  }) => {
    const { mobile } = useResponsive();
    const { isDarkMode } = useThemeMode();
    const { styles, cx, theme } = useStyles({ alwaysShowActions, minSize, objectFit, size });
    const mergePreivew = usePreview(preview);

    if (isLoading)
      return (
        <Skeleton.Avatar
          active
          style={{
            borderRadius: theme.borderRadius,
            height: size,
            minHeight: minSize,
            minWidth: minSize,
            width: size,
          }}
        />
      );

    return (
      <Flexbox className={cx(styles.imageWrapper, wrapperClassName)} style={style}>
        {actions && <div className={styles.actions}>{actions}</div>}
        <AntImage
          fallback={
            isDarkMode
              ? 'https://gw.alipayobjects.com/zos/kitchen/nhzBb%24r0Cm/image_off_dark.webp'
              : 'https://gw.alipayobjects.com/zos/kitchen/QAvkgt30Ys/image_off_light.webp'
          }
          loading={'lazy'}
          preview={{
            mask: mobile ? false : actions ? <div /> : <Icon icon={Eye} size={'normal'} />,
            ...(mergePreivew as any),
          }}
          wrapperClassName={styles.image}
          {...rest}
        />
      </Flexbox>
    );
  },
);

export default Image;
