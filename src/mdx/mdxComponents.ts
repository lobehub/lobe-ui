import type { MDXComponents } from 'mdx/types';

import Callout from './Callout';
import Card from './Card';
import Cards from './Cards';
import FileTree from './FileTree';
import Image from './Image';
import Link from './Link';
import Steps from './Steps';
import Tab from './Tab';
import Tabs from './Tabs';
import Video from './Video';

const mdxComponents: MDXComponents = {
  Callout,
  Card,
  Cards,
  FileTree,
  Image,
  Steps,
  Tab,
  Tabs,
  Video,
  a: Link,
};

export default mdxComponents;
