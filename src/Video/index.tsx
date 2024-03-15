import { Skeleton } from 'antd';
import { PlayIcon } from 'lucide-react';
import { memo, useState } from 'react';
import { Flexbox } from 'react-layout-kit';

import Icon from '@/Icon';
import { DivProps } from '@/types';

import { useStyles } from './style';

export interface VideoProps extends DivProps {
  autoplay?: boolean;
  borderless?: boolean;
  classNames?: {
    video?: string;
    wrapper?: string;
  };
  height?: number | string;
  isLoading?: boolean;
  loop?: boolean;
  minSize?: number | string;
  muted?: HTMLVideoElement['muted'];
  onload?: HTMLVideoElement['onload'];
  poster?: string;
  preload?: HTMLVideoElement['preload'];
  preview?: boolean;
  size?: number | string;
  src: string;
  width?: number | string;
}

const Video = memo<VideoProps>(
  ({
    preload = 'auto',
    src,
    style,
    classNames,
    className,
    minSize,
    size = '100%',
    width,
    height,
    onMouseEnter,
    onMouseLeave,
    preview = true,
    isLoading,
    borderless,
    ...rest
  }) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [showControls, setShowControls] = useState(false);
    const { cx, styles, theme } = useStyles({
      borderless,
      minSize,
      size,
    });
    const onVideoMouseEnter = (e: any) => {
      setShowControls(true);
      onMouseEnter?.(e);
    };
    const onVideoMouseLeave = (e: any) => {
      setShowControls(false);
      onMouseLeave?.(e);
    };

    if (isLoading)
      return (
        <Skeleton.Avatar
          active
          style={{
            borderRadius: theme.borderRadius,
            height,
            maxHeight: size,
            maxWidth: size,
            minHeight: minSize,
            minWidth: minSize,
            width,
          }}
        />
      );

    return (
      <Flexbox className={cx(styles.videoWrapper, classNames?.wrapper)} style={style}>
        {preview && !isPlaying && (
          <Flexbox align={'center'} className={styles.preview} justify={'center'}>
            <Icon color={'#fff'} icon={PlayIcon} size={'normal'} />
          </Flexbox>
        )}
        <video
          className={cx(styles.video, classNames?.video, className)}
          controls={showControls}
          height={height}
          onEnded={() => setIsPlaying(false)}
          onMouseEnter={onVideoMouseEnter}
          onMouseLeave={onVideoMouseLeave}
          onPause={() => setIsPlaying(false)}
          onPlay={() => setIsPlaying(true)}
          onPlaying={() => setIsPlaying(true)}
          preload={preload}
          style={{
            height: 'auto',
            width: '100%',
          }}
          width={width}
          {...(rest as any)}
        >
          <source src={src} />
        </video>
      </Flexbox>
    );
  },
);

export default Video;
