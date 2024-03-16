import { FC } from 'react';

import Callout from './Callout';
import Cards, { Card } from './Cards';
import FileTree from './FileTree';
import Image from './Image';
import Steps from './Steps';
import Tabs from './Tabs';
import Video from './Video';

const mdxComponents: Record<string, FC<any>> = {
  Callout,
  Card,
  Cards,
  FileTree,
  Image,
  LobeCallout: Callout,
  LobeCard: Card,
  LobeCards: Cards,
  LobeFileTree: FileTree,
  LobeSteps: Steps,
  LobeTabs: Tabs,
  Steps,
  Tabs,
  Video,
};

export default mdxComponents;
