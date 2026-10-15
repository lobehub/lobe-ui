import type { ReactNode } from 'react';

import Caption from './parts/Caption';
import CenterPlay from './parts/CenterPlay';
import Controls from './parts/Controls';
import Frame from './parts/Frame';
import LoadError from './parts/LoadError';
import Root from './parts/Root';
import SectionList from './parts/SectionList';
import Timeline from './parts/Timeline';
import type { VideoProps } from './type';
import VideoPreset from './Video';

export interface IVideo {
  (props: VideoProps): ReactNode;
  Caption: typeof Caption;
  CenterPlay: typeof CenterPlay;
  Controls: typeof Controls;
  Frame: typeof Frame;
  LoadError: typeof LoadError;
  Root: typeof Root;
  SectionList: typeof SectionList;
  Timeline: typeof Timeline;
}

const Video = VideoPreset as unknown as IVideo;
Video.Caption = Caption;
Video.CenterPlay = CenterPlay;
Video.Controls = Controls;
Video.Frame = Frame;
Video.LoadError = LoadError;
Video.Root = Root;
Video.SectionList = SectionList;
Video.Timeline = Timeline;

export default Video;
export type * from './type';
export { useVideo, useVideoPlayer, useVideoState } from './useVideo';
