'use client';

import './style.css';

import clsx from 'clsx';
import type { FC } from 'react';

import LobeImage, { type ImageProps as LobeImageProps } from '@/Image';

import { mdxImageClasses } from './stable';

export type ImageProps = LobeImageProps;
const Image: FC<ImageProps> = ({ className, style, alt = 'img', ...rest }) => {
  return (
    <LobeImage alt={alt} className={clsx(mdxImageClasses(), className)} style={style} {...rest} />
  );
};

Image.displayName = 'MdxImage';

export default Image;
