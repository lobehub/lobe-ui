import { FC } from 'react';

import Callout from './Callout';
import Cards from './Cards';
import FileTree from './FileTree';
import Image from './Image';
import Steps from './Steps';
import Tabs from './Tabs';
import Video from './Video';

const mdxComponents: Record<string, FC<any>> = {
  Callout,
  Cards,
  FileTree,
  Image,
  Steps,
  Tabs,
  Video,
};

export default mdxComponents;
