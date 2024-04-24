'use client';

import { FC } from 'react';

import LobeVideo, { type VideoProps as LobeVideoProps } from '@/Video';

export interface VideoProps extends LobeVideoProps {
  cover?: boolean;
  inStep?: boolean;
}

const Video: FC<VideoProps> = ({ style, width = 800, height, cover, inStep, ...rest }) => {
  const size = cover
    ? { height: 300, width: 800 }
    : inStep
      ? {
          height,
          width: 780,
        }
      : {
          height,
          width,
        };

  return (
    <LobeVideo
      height={size.height}
      preview={false}
      style={{
        borderRadius: 'calc(var(--lobe-markdown-border-radius) * 1px)',
        marginBlock: 'calc(var(--lobe-markdown-margin-multiple) * 1em)',
        ...style,
      }}
      width={size.width}
      {...rest}
    />
  );
};

export default Video;
