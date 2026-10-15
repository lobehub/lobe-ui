'use client';

import type { FC } from 'react';

import LobeVideo, { type VideoProps as LobeVideoProps } from '@/Video';

export type VideoProps = LobeVideoProps;

const toLength = (value?: number | string) =>
  typeof value === 'string' && /^\d+$/.test(value) ? Number(value) : value;

const Video: FC<VideoProps> = ({ height, style, width, ...rest }) => {
  return (
    <LobeVideo
      height={toLength(height)}
      width={toLength(width)}
      style={{
        borderRadius: 'calc(var(--lobe-markdown-border-radius) * 1px)',
        marginBlock: 'calc(var(--lobe-markdown-margin-multiple) * 1em)',
        ...style,
      }}
      {...rest}
    />
  );
};

Video.displayName = 'MdxVideo';

export default Video;
