import { Image as AntImage, type ImageProps as AntImageProps, Skeleton } from 'antd';
import { Eye } from 'lucide-react';
import { ReactNode, memo } from 'react';
import { Flexbox } from 'react-layout-kit';

import Icon from '@/Icon';
import usePreview from '@/Image/usePreview';

import { useStyles } from './style';

export interface ImageProps extends AntImageProps {
  actions?: ReactNode;
  isLoading?: boolean;
  minSize?: number;
  size?: number;
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
    ...rest
  }) => {
    const { styles, cx, theme } = useStyles({ minSize, size });
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
          fallback={styles.imageOff}
          loading={'lazy'}
          preview={{
            mask: actions ? <div /> : <Icon icon={Eye} size={'normal'} />,
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
