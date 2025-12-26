'use client';

import { Skeleton } from 'antd';
import { cssVar, cx } from 'antd-style';
import { PlayIcon } from 'lucide-react';
import { type CSSProperties, type Ref, memo, useMemo, useState } from 'react';

import ActionIcon from '@/ActionIcon';
import { Flexbox, FlexboxProps } from '@/Flex';
import type { VideoProps as VProps } from '@/types';

import { styles, variants } from './style';

export interface VideoProps extends VProps, Pick<FlexboxProps, 'width' | 'height'> {
  autoPlay?: boolean;
  classNames?: {
    mask?: string;
    video?: string;
    wrapper?: string;
  };
  isLoading?: boolean;
  loop?: boolean;
  maxHeight?: number | string;
  maxWidth?: number | string;
  minHeight?: number | string;
  minWidth?: number | string;
  muted?: HTMLVideoElement['muted'];
  onEnded?: VProps['onEnded'];
  onMouseEnter?: VProps['onMouseEnter'];
  onMouseLeave?: VProps['onMouseLeave'];
  onPause?: VProps['onPause'];
  onPlay?: VProps['onPlay'];
  onPlaying?: VProps['onPlaying'];
  onProgress?: VProps['onProgress'];
  poster?: string;
  preload?: HTMLVideoElement['preload'];
  preview?: boolean;
  ref?: Ref<HTMLDivElement>;
  size?: number | string;
  src: string;
  styles?: {
    mask?: CSSProperties;
    video?: CSSProperties;
    wrapper?: CSSProperties;
  };
  variant?: 'borderless' | 'filled' | 'outlined';
}

const Video = memo<VideoProps>(
  ({
    ref,
    preload = 'auto',
    src,
    style,
    classNames,
    className,
    maxHeight = '100%',
    maxWidth = '100%',
    minHeight,
    minWidth,
    onEnded,
    onPause,
    onPlay,
    onPlaying,
    width,
    height,
    onMouseEnter,
    styles: customStyles,
    onMouseLeave,
    preview = true,
    isLoading,
    variant = 'filled',
    autoPlay,
    ...rest
  }) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [showControls, setShowControls] = useState(false);

    // Convert props to CSS variables
    const cssVariables = useMemo<Record<string, string>>(() => {
      const vars: Record<string, string> = {};
      if (maxHeight !== undefined) {
        vars['--video-max-height'] = typeof maxHeight === 'number' ? `${maxHeight}px` : maxHeight;
      }
      if (maxWidth !== undefined) {
        vars['--video-max-width'] = typeof maxWidth === 'number' ? `${maxWidth}px` : maxWidth;
      }
      if (minHeight !== undefined) {
        vars['--video-min-height'] = typeof minHeight === 'number' ? `${minHeight}px` : minHeight;
      }
      if (minWidth !== undefined) {
        vars['--video-min-width'] = typeof minWidth === 'number' ? `${minWidth}px` : minWidth;
      }
      return vars;
    }, [maxHeight, maxWidth, minHeight, minWidth]);

    if (isLoading)
      return (
        <Skeleton.Avatar
          active
          style={{
            borderRadius: cssVar.borderRadiusLG,
            height,
            maxHeight,
            maxWidth,
            minHeight,
            minWidth,
            width,
          }}
        />
      );

    return (
      <Flexbox
        className={cx(variants({ variant }), className, classNames?.wrapper)}
        height={height}
        ref={ref}
        style={{
          ...cssVariables,
          ...style,
          ...customStyles?.wrapper,
        }}
        width={width}
      >
        {preview && !isPlaying && (
          <Flexbox
            align={'center'}
            className={cx(styles.mask, classNames?.mask)}
            justify={'center'}
            style={customStyles?.mask}
          >
            <ActionIcon color={'#fff'} icon={PlayIcon} variant={'filled'} />
          </Flexbox>
        )}
        <video
          autoPlay={autoPlay}
          className={cx(styles.video, classNames?.video)}
          controls={showControls}
          height={height}
          onEnded={(e) => {
            setIsPlaying(false);
            onEnded?.(e);
          }}
          onMouseEnter={(e) => {
            setShowControls(true);
            onMouseEnter?.(e);
          }}
          onMouseLeave={(e) => {
            setShowControls(false);
            onMouseLeave?.(e);
          }}
          onPause={(e) => {
            setIsPlaying(false);
            onPause?.(e);
          }}
          onPlay={(e) => {
            setIsPlaying(true);
            onPlay?.(e);
          }}
          onPlaying={(e) => {
            setIsPlaying(true);
            onPlaying?.(e);
          }}
          preload={preload}
          style={{
            height: 'auto',
            maxWidth: '100%',
            ...customStyles?.video,
          }}
          width={width}
          {...rest}
        >
          <source src={src} />
        </video>
      </Flexbox>
    );
  },
);

Video.displayName = 'Video';

export default Video;
