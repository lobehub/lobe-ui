import { Image, ImageProps } from 'antd';
import { PropsWithChildren, memo } from 'react';

import usePreview from '@/Image/usePreview';

const { PreviewGroup } = Image;

export interface ImageGalleryProps extends PropsWithChildren {
  enable?: boolean;
  items?: string[];
  preview?: ImageProps['preview'];
}

const ImageGallery = memo<ImageGalleryProps>(({ items, children, enable = true, preview = {} }) => {
  const mergePreivew = usePreview(preview);

  if (!enable) return children;

  return (
    <PreviewGroup items={items} preview={mergePreivew}>
      {children}
    </PreviewGroup>
  );
});

export default ImageGallery;
