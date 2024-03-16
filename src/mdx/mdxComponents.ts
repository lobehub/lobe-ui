import { FC } from 'react';

import Callout from './Callout';
import Cards, { Card } from './Cards';
import Image from './Image';
import Tabs from './Tabs';
import Video from './Video';

const mdxComponents: Record<string, FC<any>> = {
  Callout,
  Card,
  Cards,
  Image,
  LobeCallout: Callout,
  LobeCard: Card,
  LobeCards: Cards,
  LobeTabs: Tabs,
  Tabs,
  Video,
};

export default mdxComponents;
