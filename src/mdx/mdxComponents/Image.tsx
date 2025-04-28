'use client';

import type { FC } from 'react';

import LobeImage, { type ImageProps as LobeImageProps } from '@/Image';

export type ImageProps = LobeImageProps;
const Image: FC<ImageProps> = ({ style, alt = 'img', ...rest }) => {
  return (
    <LobeImage
      alt={alt}
      preview={{ mask: false }}
      style={{
        borderRadius: 'calc(var(--lobe-markdown-border-radius) * 1px)',
        marginBlock: 'calc(var(--lobe-markdown-margin-multiple) * 1em)',
        ...style,
      }}
      {...rest}
    />
  );
};

Image.displayName = 'MdxImage';

export default Image;
