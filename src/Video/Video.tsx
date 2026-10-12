'use client';

import clsx from 'clsx';

import Caption from './parts/Caption';
import CenterPlay from './parts/CenterPlay';
import Controls from './parts/Controls';
import Frame from './parts/Frame';
import LoadError from './parts/LoadError';
import Root from './parts/Root';
import Timeline from './parts/Timeline';
import type { VideoProps, VideoState } from './type';
import { useVideo } from './useVideo';

const Overlay = ({ render }: { render: (state: VideoState) => React.ReactNode }) => (
  <>{render(useVideo())}</>
);

const Video = ({
  className,
  classNames,
  frameStep,
  overlay,
  style,
  styles: customStyles,
  thumbnails = true,
  ...rest
}: VideoProps) => (
  <Root
    className={clsx(className, classNames?.root)}
    style={{ ...customStyles?.root, ...style }}
    {...rest}
  >
    <Frame className={classNames?.frame} style={customStyles?.frame}>
      {overlay && <Overlay render={overlay} />}
      <Caption />
      <CenterPlay />
      <Controls
        className={classNames?.controls}
        frameStep={frameStep}
        style={customStyles?.controls}
      >
        <Timeline
          className={classNames?.timeline}
          style={customStyles?.timeline}
          thumbnails={thumbnails}
        />
      </Controls>
      <LoadError />
    </Frame>
  </Root>
);

Video.displayName = 'Video';

export default Video;
