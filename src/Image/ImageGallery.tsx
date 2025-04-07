'use client';

import { Image, type ImageProps } from 'antd';
import { type PropsWithChildren, type ReactNode, memo } from 'react';

import usePreview, { type PreviewOptions } from './components/usePreview';

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

ImageGallery.displayName = 'ImageGallery';

export default ImageGallery;
