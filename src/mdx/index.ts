import { FC } from 'react';

import Callout from './Callout';
import Image from './Image';
import Video from './Video';

export { default as Callout, type CalloutProps } from './Callout';
export { default as Image, type ImageProps } from './Image';
export { default as Pre, type PreProps, PreSingleLine } from './Pre';
export { default as Video, type VideoProps } from './Video';
export const mdxComponents: Record<string, FC<any>> = {
  Callout,
  Image,
  LobeCallout: Callout,
  Video,
  img: Image,
  video: Video,
};
