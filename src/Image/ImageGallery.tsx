'use client';

import { Image, ImageProps } from 'antd';
import { PropsWithChildren, ReactNode, memo } from 'react';

import usePreview, { PreviewOptions } from '@/Image/usePreview';

const { PreviewGroup } = Image;

export interface ImageGalleryProps extends PropsWithChildren {
  enable?: boolean;
  items?: string[];
  preview?: ImageProps['preview'] & {
    toolbarAddon?: ReactNode;
  } & any;
}

const ImageGallery = memo<ImageGalleryProps>(({ items, children, enable = true, preview }) => {
  const mergePreivew = usePreview(preview);

  if (!enable) return children;

  return (
    <PreviewGroup items={items} preview={mergePreivew as PreviewOptions}>
      {children}
    </PreviewGroup>
  );
});

export default ImageGallery;
