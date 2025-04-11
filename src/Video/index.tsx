'use client';

import { Skeleton } from 'antd';
import { cva } from 'class-variance-authority';
import { PlayIcon } from 'lucide-react';
import { type CSSProperties, type Ref, memo, useMemo, useState } from 'react';
import { Flexbox, FlexboxProps } from 'react-layout-kit';

import ActionIcon from '@/ActionIcon';
import type { VideoProps as VProps } from '@/types';

import { useStyles } from './style';

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
    const { cx, styles, theme } = useStyles({
      maxHeight,
      maxWidth,
      minHeight,
      minWidth,
    });

    const variants = useMemo(
      () =>
        cva(styles.root, {
          defaultVariants: {
            variant: 'filled',
          },
          /* eslint-disable sort-keys-fix/sort-keys-fix */
          variants: {
            variant: {
              filled: styles.filled,
              outlined: styles.outlined,
              borderless: styles.borderless,
            },
          },
          /* eslint-enable sort-keys-fix/sort-keys-fix */
        }),
      [styles],
    );

    if (isLoading)
      return (
        <Skeleton.Avatar
          active
          style={{
            borderRadius: theme.borderRadius,
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
            width: '100%',
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
