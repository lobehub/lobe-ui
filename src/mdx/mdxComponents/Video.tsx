'use client';

import './style.css';

import clsx from 'clsx';
import type { FC } from 'react';

import LobeVideo, { type VideoProps as LobeVideoProps } from '@/Video';

import { mdxVideoClasses } from './stable';

export type VideoProps = LobeVideoProps;

const toLength = (value?: number | string) =>
  typeof value === 'string' && /^\d+$/.test(value) ? Number(value) : value;

const Video: FC<VideoProps> = ({ className, height, style, width, ...rest }) => {
  return (
    <LobeVideo
      className={clsx(mdxVideoClasses(), className)}
      height={toLength(height)}
      style={style}
      width={toLength(width)}
      {...rest}
    />
  );
};

Video.displayName = 'MdxVideo';

export default Video;
